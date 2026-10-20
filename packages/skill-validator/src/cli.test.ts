import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { discoverSharedDocs, discoverSkills, runValidator } from "./cli.js";

const TMP = join(import.meta.dirname, "__test_fixtures__");

function setup(skills: Record<string, string>) {
	rmSync(TMP, { recursive: true, force: true });
	for (const [path, content] of Object.entries(skills)) {
		const full = join(TMP, path);
		mkdirSync(join(full, ".."), { recursive: true });
		writeFileSync(full, content);
	}
}

function teardown() {
	rmSync(TMP, { recursive: true, force: true });
}

describe("discoverSkills", () => {
	it("finds SKILL.md files recursively", () => {
		setup({
			"plugin-a/skills/foo/SKILL.md": "---\ndescription: Test\n---\n# Foo",
			"plugin-a/skills/bar/SKILL.md": "---\ndescription: Test\n---\n# Bar",
		});
		const files = discoverSkills(TMP);
		expect(files).toHaveLength(2);
		teardown();
	});
});

describe("discoverSharedDocs", () => {
	it("finds shared/**/*.md files under each plugin", () => {
		setup({
			"plugin-a/shared/template.md": "# Template",
			"plugin-a/shared/workflows/launch.md": "# Launch",
			"plugin-a/skills/foo/SKILL.md": "---\ndescription: Test\n---\n# Foo",
		});
		const files = discoverSharedDocs(TMP);
		expect(files).toHaveLength(2);
		teardown();
	});
});

describe("runValidator", () => {
	it("returns exit code 0 for valid skills", () => {
		setup({
			"plugin-a/skills/foo/SKILL.md":
				"---\nname: foo\ndescription: Define a component contract. Use when the user asks to specify a new component.\n---\n# Foo\n\nBody.",
		});
		const result = runValidator(TMP);
		expect(result.exitCode).toBe(0);
		teardown();
	});

	it("returns exit code 1 for invalid skills", () => {
		setup({
			"plugin-a/skills/foo/SKILL.md": "# No frontmatter\n\nBody.",
		});
		const result = runValidator(TMP);
		expect(result.exitCode).toBe(1);
		teardown();
	});

	it("merges plugin-level issues into each file's result", () => {
		setup({
			"plugin-a/shared/template.md": "# Template",
			"plugin-a/skills/foo/SKILL.md":
				"---\nname: foo\ndescription: Define a component contract. Use when the user asks to specify a new component.\n---\n# Foo\n\nRead `${CLAUDE_PLUGIN_ROOT}/shared/template.md` and `shared/missing.md`.",
		});
		const { exitCode, results } = runValidator(TMP);
		expect(exitCode).toBe(1);
		expect(results).toHaveLength(2);
		const skillResult = results.find((r) => r.filePath.endsWith("SKILL.md"));
		expect(skillResult?.result.pass).toBe(false);
		expect(skillResult?.result.errors.map((e) => e.rule)).toEqual(["shared-ref-resolvable"]);
		const sharedResult = results.find((r) => r.filePath.endsWith("template.md"));
		expect(sharedResult?.result.pass).toBe(true);
		teardown();
	});

	it("runs skill-ref-exists on shared docs only, against the owning plugin's skills", () => {
		setup({
			"plugin-a/skills/foo/SKILL.md":
				"---\nname: foo\ndescription: Define a component contract. Use when the user asks to specify a new component.\n---\n# Foo\n\nBody.",
			"plugin-a/shared/workflows/launch.md":
				"# Launch\n\n1. `/plugin-a:bar <x>` — broken\n2. `/plugin-a:foo <x>` — fine\n3. Write `.metapowers/other-plugin/<x>/01.md` — not a skill rule, must not fire here",
		});
		const { exitCode, results } = runValidator(TMP);
		expect(exitCode).toBe(1);

		const sharedResult = results.find((r) => r.filePath.endsWith("launch.md"));
		expect(sharedResult).toBeDefined();
		expect(sharedResult?.result.pass).toBe(false);
		expect(sharedResult?.result.errors.map((e) => e.rule)).toEqual(["skill-ref-exists"]);
		expect(sharedResult?.result.errors[0].message).toContain("/plugin-a:bar");

		const skillResult = results.find((r) => r.filePath.endsWith("SKILL.md"));
		expect(skillResult?.result.pass).toBe(true);
		teardown();
	});
});

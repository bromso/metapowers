import { describe, it, expect } from "vitest";
import { discoverSkills, runValidator } from "./cli.js";
import { join } from "node:path";
import { mkdirSync, writeFileSync, rmSync } from "node:fs";

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

describe("runValidator", () => {
	it("returns exit code 0 for valid skills", () => {
		setup({
			"plugin-a/skills/foo/SKILL.md":
				"---\ndescription: Define a component contract\n---\n# Foo\n\nBody.",
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
});

import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { discoverSharedDocs, discoverSkills, runValidator } from "./cli.js";

const TMP = join(import.meta.dirname, "__test_fixtures__");
const SKILLS = join(TMP, "skills");
const REPO_SKILLS = join(import.meta.dirname, "../../../skills");

const VALID_FM =
	"---\nname: development-plan\ndescription: Define a component contract. Use when the user asks to specify a new component.\n---\n";

/** Write `files` (paths relative to the fixture repo root, which holds skills/ and references/). */
function setup(files: Record<string, string>) {
	rmSync(TMP, { recursive: true, force: true });
	for (const [path, content] of Object.entries(files)) {
		const full = join(TMP, path);
		mkdirSync(join(full, ".."), { recursive: true });
		writeFileSync(full, content);
	}
}

afterEach(() => rmSync(TMP, { recursive: true, force: true }));

describe("discoverSkills", () => {
	it("finds <name>/SKILL.md files directly under the skills directory", () => {
		setup({
			"skills/development-plan/SKILL.md": "---\ndescription: Test\n---\n# Foo",
			"skills/design-define/SKILL.md": "---\ndescription: Test\n---\n# Bar",
			"skills/design-define/references/SKILL.md": "not a skill",
		});
		expect(discoverSkills(SKILLS)).toHaveLength(2);
	});
});

describe("discoverSharedDocs", () => {
	it("finds per-skill references and the canonical references/ next to skills/", () => {
		setup({
			"references/design/template.md": "# Template",
			"references/design/guides/launch.md": "# Launch",
			"skills/design-define/references/template.md": "# Template",
			"skills/design-define/SKILL.md": "---\ndescription: Test\n---\n# Foo",
		});
		expect(
			discoverSharedDocs(SKILLS)
				.map((file) => file.slice(TMP.length + 1))
				.sort(),
		).toEqual([
			"references/design/guides/launch.md",
			"references/design/template.md",
			"skills/design-define/references/template.md",
		]);
	});
});

describe("runValidator", () => {
	it("returns exit code 0 for valid skills", () => {
		setup({ "skills/development-plan/SKILL.md": `${VALID_FM}# Foo\n\nBody.` });
		expect(runValidator(SKILLS).exitCode).toBe(0);
	});

	it("returns exit code 1 for invalid skills", () => {
		setup({ "skills/development-plan/SKILL.md": "# No frontmatter\n\nBody." });
		expect(runValidator(SKILLS).exitCode).toBe(1);
	});

	it("merges pack-level issues into each file's result", () => {
		setup({
			"references/development/template.md": "# Template",
			"skills/development-plan/SKILL.md": `${VALID_FM}# Foo\n\nRead \`references/template.md\` and \`references/missing.md\`.`,
		});
		const { exitCode, results } = runValidator(SKILLS);
		expect(exitCode).toBe(1);
		expect(results).toHaveLength(2);
		const skillResult = results.find((r) => r.filePath.endsWith("SKILL.md"));
		expect(skillResult?.result.errors.map((e) => e.rule)).toEqual(["reference-resolvable"]);
		const docResult = results.find((r) => r.filePath.endsWith("template.md"));
		expect(docResult?.result.pass).toBe(true);
	});

	it("runs skill-ref-exists on reference docs only", () => {
		setup({
			"skills/development-plan/SKILL.md": `${VALID_FM}# Foo\n\nBody.`,
			"references/development/launch.md":
				"# Launch\n\n1. `/development-ship <x>` — broken\n2. `/development-plan <x>` — fine\n3. Write `.singularskills/design/<x>/01.md` — not a skill rule, must not fire here",
		});
		const { exitCode, results } = runValidator(SKILLS);
		expect(exitCode).toBe(1);
		const docResult = results.find((r) => r.filePath.endsWith("launch.md"));
		expect(docResult?.result.errors.map((e) => e.rule)).toEqual(["skill-ref-exists"]);
		expect(docResult?.result.errors[0].message).toContain("/development-ship");
		expect(results.find((r) => r.filePath.endsWith("SKILL.md"))?.result.pass).toBe(true);
	});
});

describe("the real pack", () => {
	it("passes the validator", () => {
		const { exitCode, results } = runValidator(REPO_SKILLS);
		const failures = results
			.filter(({ result }) => !result.pass)
			.map(({ filePath, result }) => ({
				filePath,
				errors: result.errors.map((e) => `${e.rule}: ${e.message}`),
			}));
		expect(failures).toEqual([]);
		expect(exitCode).toBe(0);
		expect(results.filter((r) => r.filePath.endsWith("SKILL.md")).length).toBeGreaterThan(250);
	});
});

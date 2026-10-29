import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, beforeEach, describe, expect, test } from "vitest";
import { genReferences, referenceLinks } from "./references.js";
import { listSkills } from "./skills.js";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");

let root: string;
beforeEach(() => {
	root = mkdtempSync(path.join(tmpdir(), "pack-tools-refs-"));
});
afterEach(() => rmSync(root, { recursive: true, force: true }));

function write(file: string, content: string): void {
	const full = path.join(root, file);
	mkdirSync(path.dirname(full), { recursive: true });
	writeFileSync(full, content);
}

const read = (file: string) => readFileSync(path.join(root, file), "utf-8");
const exists = (file: string) => existsSync(path.join(root, file));

function skill(name: string, body: string): void {
	write(`skills/${name}/SKILL.md`, `---\nname: ${name}\ndescription: Do it.\n---\n\n${body}\n`);
}

describe("referenceLinks", () => {
	test("returns each distinct references/ inline-code path without its fragment", () => {
		expect(
			referenceLinks(
				"Read `references/a.md` and `references/a.md#step-2`, then `references/guides/b.md`; not references/c.md.",
			),
		).toEqual(["a.md", "guides/b.md"]);
	});
});

describe("genReferences", () => {
	test("copies canonical files into consumers and reports drift with --check", () => {
		write("references/design/template.md", "# Template\n");
		write("references/design/unused.md", "# Unused\n");
		skill("design-define", "Use `references/template.md` and `references/own.md`.");
		write("skills/design-define/references/own.md", "# Own\n");
		skill("design-test", "Use `references/template.md#scope`.");
		write("skills/design-test/references/template.md", "# Stale\n");
		skill("design-ideate", "No links.");
		write("skills/design-ideate/references/unused.md", "# Unused\n");
		write("skills/design-ideate/references/notes.md", "# Single consumer, unlinked\n");

		const expected = [
			"skills/design-define/references/template.md",
			"skills/design-ideate/references/unused.md",
			"skills/design-test/references/template.md",
		];
		expect(genReferences(root, { check: true }).sort()).toEqual(expected);
		expect(exists("skills/design-define/references/template.md")).toBe(false);
		expect(read("skills/design-test/references/template.md")).toBe("# Stale\n");

		expect(genReferences(root, { check: false }).sort()).toEqual(expected);
		expect(read("skills/design-define/references/template.md")).toBe("# Template\n");
		expect(read("skills/design-test/references/template.md")).toBe("# Template\n");
		expect(read("skills/design-define/references/own.md")).toBe("# Own\n");
		expect(exists("skills/design-ideate/references/unused.md")).toBe(false);
		expect(read("skills/design-ideate/references/notes.md")).toBe("# Single consumer, unlinked\n");
		expect(genReferences(root, { check: true })).toEqual([]);
	});

	test("resolves references/workflows/<name>.yml to workflows/<name>.yml", () => {
		write("workflows/design.yml", "name: design\n");
		write("workflows/legal.yml", "name: legal\n");
		write("references/singular/guide.md", "# Guide\n");
		skill("workflow", "Load `references/workflows/design.yml`.");
		write("skills/workflow/references/workflows/legal.yml", "name: legal\n");

		expect(genReferences(root, { check: false }).sort()).toEqual([
			"skills/workflow/references/workflows/design.yml",
			"skills/workflow/references/workflows/legal.yml",
		]);
		expect(read("skills/workflow/references/workflows/design.yml")).toBe("name: design\n");
		expect(exists("skills/workflow/references/workflows")).toBe(true);
		expect(exists("skills/workflow/references/workflows/legal.yml")).toBe(false);
	});

	test("removes directories it empties", () => {
		write("references/design/template.md", "# Template\n");
		skill("design-ideate", "No links.");
		write("skills/design-ideate/references/template.md", "# Template\n");
		genReferences(root, { check: false });
		expect(exists("skills/design-ideate/references")).toBe(false);
	});

	test("throws on a link that resolves nowhere", () => {
		skill("design-define", "Use `references/missing.md`.");
		expect(() => genReferences(root, { check: true })).toThrow(
			"design-define: `references/missing.md` resolves to neither references/design/missing.md nor a file inside the skill",
		);
	});
});

describe("the real pack", () => {
	test("is in sync with references/ and workflows/", () => {
		expect(genReferences(repoRoot, { check: true })).toEqual([]);
	});

	test("every references/ link in every skill resolves inside that skill", () => {
		for (const skill of listSkills(path.join(repoRoot, "skills"))) {
			const dir = path.dirname(skill.path);
			for (const link of referenceLinks(skill.content)) {
				expect(existsSync(path.join(dir, "references", link)), `${skill.name}: ${link}`).toBe(true);
			}
		}
	});
});

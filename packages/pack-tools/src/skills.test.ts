import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { assertPackRoot, listSkills } from "./skills.js";

describe("listSkills", () => {
	let packRoot: string;
	beforeEach(() => {
		packRoot = mkdtempSync(path.join(tmpdir(), "pack-tools-"));
	});
	afterEach(() => {
		rmSync(packRoot, { recursive: true, force: true });
	});

	it("reads <domain>-<skill>/SKILL.md and splits the domain", () => {
		mkdirSync(path.join(packRoot, "design-empathize"), { recursive: true });
		writeFileSync(path.join(packRoot, "design-empathize", "SKILL.md"), "# Empathize\n");
		mkdirSync(path.join(packRoot, "workflow"), { recursive: true });
		writeFileSync(path.join(packRoot, "workflow", "SKILL.md"), "# Workflow\n");

		const found = listSkills(packRoot);
		expect(found.map((s) => s.name)).toEqual(["design-empathize", "workflow"]);
		expect(found[0].domain).toBe("design");
		expect(found[1].domain).toBe("singular");
	});

	it("keeps a hyphenated domain whole", () => {
		mkdirSync(path.join(packRoot, "project-management-retrospective"), { recursive: true });
		writeFileSync(
			path.join(packRoot, "project-management-retrospective", "SKILL.md"),
			"# Retrospective\n",
		);
		expect(listSkills(packRoot)[0].domain).toBe("project-management");
	});
});

describe("assertPackRoot", () => {
	let dir: string;
	beforeEach(() => {
		dir = mkdtempSync(path.join(tmpdir(), "pack-tools-"));
	});
	afterEach(() => {
		rmSync(dir, { recursive: true, force: true });
	});

	it("throws when packRoot does not exist", () => {
		expect(() => assertPackRoot(path.join(dir, "nope"))).toThrow(/not a directory/);
	});
	it("throws when packRoot is a file", () => {
		const file = path.join(dir, "file.txt");
		writeFileSync(file, "");
		expect(() => assertPackRoot(file)).toThrow(/not a directory/);
	});
	it("throws on a folder with no SKILL.md", () => {
		expect(() => assertPackRoot(dir)).toThrow(/no skills found/);
	});
	it("passes when at least one skill exists", () => {
		mkdirSync(path.join(dir, "legal-review"), { recursive: true });
		writeFileSync(path.join(dir, "legal-review", "SKILL.md"), "# Review\n");
		expect(() => assertPackRoot(dir)).not.toThrow();
	});
});

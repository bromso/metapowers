import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { assertPluginsRoot } from "./skills.js";

describe("assertPluginsRoot", () => {
	let dir: string;
	beforeEach(() => {
		dir = mkdtempSync(path.join(tmpdir(), "plugin-tools-"));
	});
	afterEach(() => {
		rmSync(dir, { recursive: true, force: true });
	});

	it("throws when pluginsRoot does not exist", () => {
		expect(() => assertPluginsRoot(path.join(dir, "nope"))).toThrow(/not a directory/);
	});
	it("throws when pluginsRoot is a file", () => {
		const file = path.join(dir, "file.txt");
		writeFileSync(file, "");
		expect(() => assertPluginsRoot(file)).toThrow(/not a directory/);
	});
	it("throws when pluginsRoot contains no skills", () => {
		expect(() => assertPluginsRoot(dir)).toThrow(/no skills found/);
	});
	it("passes when at least one skill exists", () => {
		mkdirSync(path.join(dir, "legal/skills/review"), { recursive: true });
		writeFileSync(path.join(dir, "legal/skills/review/SKILL.md"), "# Review\n");
		expect(() => assertPluginsRoot(dir)).not.toThrow();
	});
});

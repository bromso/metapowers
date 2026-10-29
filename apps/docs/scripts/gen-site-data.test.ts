import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, expect, test } from "vitest";
import {
	generateSearchCommands,
	generateSiteData,
	writeSearchCommands,
	writeSiteData,
} from "./gen-site-data";

let fixtureDir: string;

function writeSkill(packRoot: string, name: string) {
	mkdirSync(join(packRoot, "skills", name), { recursive: true });
	writeFileSync(join(packRoot, "skills", name, "SKILL.md"), `---\nname: ${name}\n---\n# skill\n`);
}

function writeWorkflow(packRoot: string, file: string, yaml: string) {
	mkdirSync(join(packRoot, "workflows"), { recursive: true });
	writeFileSync(join(packRoot, "workflows", file), yaml);
}

beforeEach(() => {
	fixtureDir = mkdtempSync(join(tmpdir(), "gen-site-data-"));
	for (const name of [
		"alpha-one",
		"alpha-two",
		"project-management-plan",
		"singular-status",
		"workflow",
	]) {
		writeSkill(fixtureDir, name);
	}
	mkdirSync(join(fixtureDir, "evals", "alpha-two"), { recursive: true });
	writeWorkflow(
		fixtureDir,
		"zeta.yml",
		"name: zeta\ntitle: Zeta Flow\nfolder: zeta\nphases:\n  - phase: 1\n    title: One\n    skills: [alpha-one]\n",
	);
	writeWorkflow(
		fixtureDir,
		"alpha.yml",
		[
			"name: alpha",
			"title: Alpha Cycle",
			"folder: alpha",
			"phases:",
			"  - phase: 1",
			"    title: One",
			"    artifact: 01-one.md",
			"    skills: [alpha-one]",
			"  - phase: 2",
			"    title: Two",
			"    artifact: 02-two.md",
			"    requires: [01-one.md]",
			"    skills: [alpha-two]",
			"",
		].join("\n"),
	);
});

afterEach(() => {
	rmSync(fixtureDir, { recursive: true, force: true });
});

test("groups the flat pack's skills by domain and counts eval suites", () => {
	const data = generateSiteData(fixtureDir);
	expect(data.plugins).toEqual([
		{ slug: "alpha", name: "alpha", skills: 2, hasEvals: true },
		{ slug: "project-management", name: "project-management", skills: 1, hasEvals: false },
		{ slug: "singular", name: "singular", skills: 2, hasEvals: false },
	]);
	expect(data.totals).toEqual({ skills: 5, plugins: 3, evalSuites: 1, agents: 7 });
});

test("lists the workflows by name with their phase counts", () => {
	expect(generateSiteData(fixtureDir).workflows).toEqual([
		{ name: "alpha", title: "Alpha Cycle", phases: 2 },
		{ name: "zeta", title: "Zeta Flow", phases: 1 },
	]);
});

test("throws a clear error when the pack has no skills folder", () => {
	const brokenDir = mkdtempSync(join(tmpdir(), "gen-site-data-broken-"));
	try {
		expect(() => generateSiteData(brokenDir)).toThrow(/skills/);
	} finally {
		rmSync(brokenDir, { recursive: true, force: true });
	}
});

test("--check returns 1 when the committed file differs and 0 when equal", () => {
	const outFile = join(fixtureDir, "..", `site-data-${Date.now()}.json`);

	try {
		writeFileSync(outFile, "not the right content");
		expect(writeSiteData(fixtureDir, outFile, true)).toBe(1);

		expect(writeSiteData(fixtureDir, outFile, false)).toBe(0);
		expect(writeSiteData(fixtureDir, outFile, true)).toBe(0);
	} finally {
		rmSync(outFile, { force: true });
	}
});

test("output is byte-identical on a second run", () => {
	const outFile = join(fixtureDir, "..", `site-data-identical-${Date.now()}.json`);

	try {
		writeSiteData(fixtureDir, outFile, false);
		const first = readFileSync(outFile, "utf8");

		writeSiteData(fixtureDir, outFile, false);
		const second = readFileSync(outFile, "utf8");

		expect(second).toBe(first);
		expect(first.endsWith("\n")).toBe(true);
		expect(first.includes("\t")).toBe(true);
	} finally {
		rmSync(outFile, { force: true });
	}
});

// ---------------------------------------------------------------------------------------------
// generateSearchCommands / writeSearchCommands

let contentDir: string;

beforeEach(() => {
	contentDir = mkdtempSync(join(tmpdir(), "gen-search-commands-"));
});

afterEach(() => {
	rmSync(contentDir, { recursive: true, force: true });
});

test("maps a page's docs URL to its frontmatter command, skipping pages without one", () => {
	mkdirSync(join(contentDir, "f"), { recursive: true });
	writeFileSync(
		join(contentDir, "f", "a.mdx"),
		'---\ntitle: A\ndescription: desc\ncommand: "/x-y <p>"\nkind: utility\n---\n\nbody\n',
	);
	writeFileSync(
		join(contentDir, "f", "b.mdx"),
		"---\ntitle: B\ndescription: desc\nkind: utility\n---\n\nbody\n",
	);

	expect(generateSearchCommands(contentDir)).toEqual({ "/docs/f/a": "/x-y <p>" });
});

test("maps an unquoted frontmatter command", () => {
	mkdirSync(join(contentDir, "h"), { recursive: true });
	writeFileSync(
		join(contentDir, "h", "c.mdx"),
		"---\ntitle: C\ndescription: desc\ncommand: /h-c\nkind: utility\n---\n\nbody\n",
	);

	expect(generateSearchCommands(contentDir)).toEqual({ "/docs/h/c": "/h-c" });
});

test("maps index.mdx to its folder's URL", () => {
	mkdirSync(join(contentDir, "g"), { recursive: true });
	writeFileSync(
		join(contentDir, "g", "index.mdx"),
		'---\ntitle: G\ndescription: desc\ncommand: "/g-h"\nkind: utility\n---\n\nbody\n',
	);

	expect(generateSearchCommands(contentDir)).toEqual({ "/docs/g": "/g-h" });
});

test("--check returns 1 when the committed search-commands file differs and 0 when equal", () => {
	mkdirSync(join(contentDir, "f"), { recursive: true });
	writeFileSync(
		join(contentDir, "f", "a.mdx"),
		'---\ntitle: A\ndescription: desc\ncommand: "/x-y <p>"\nkind: utility\n---\n\nbody\n',
	);
	const outFile = join(contentDir, "..", `search-commands-${Date.now()}.json`);

	try {
		writeFileSync(outFile, "not the right content");
		expect(writeSearchCommands(contentDir, outFile, true)).toBe(1);

		expect(writeSearchCommands(contentDir, outFile, false)).toBe(0);
		expect(writeSearchCommands(contentDir, outFile, true)).toBe(0);
	} finally {
		rmSync(outFile, { force: true });
	}
});

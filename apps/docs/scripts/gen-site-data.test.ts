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

function writePlugin(
	pluginsDir: string,
	slug: string,
	name: string,
	skills: string[],
	hasEvals: boolean,
) {
	const pluginDir = join(pluginsDir, slug);
	mkdirSync(join(pluginDir, ".claude-plugin"), { recursive: true });
	writeFileSync(join(pluginDir, ".claude-plugin", "plugin.json"), JSON.stringify({ name }));

	for (const skill of skills) {
		mkdirSync(join(pluginDir, "skills", skill), { recursive: true });
		writeFileSync(join(pluginDir, "skills", skill, "SKILL.md"), "# skill\n");
	}

	if (hasEvals) {
		mkdirSync(join(pluginDir, "evals"), { recursive: true });
	}
}

beforeEach(() => {
	fixtureDir = mkdtempSync(join(tmpdir(), "gen-site-data-"));
	writePlugin(fixtureDir, "alpha", "Alpha", ["skill-one", "skill-two"], true);
	writePlugin(fixtureDir, "beta", "Beta", [], false);
});

afterEach(() => {
	rmSync(fixtureDir, { recursive: true, force: true });
});

test("counts skills, plugins and eval suites", () => {
	const data = generateSiteData(fixtureDir);
	expect(data.plugins).toEqual([
		{ slug: "alpha", name: "Alpha", skills: 2, hasEvals: true },
		{ slug: "beta", name: "Beta", skills: 0, hasEvals: false },
	]);
	expect(data.totals).toEqual({ skills: 2, plugins: 2, evalSuites: 1, agents: 4 });
});

test("throws a clear error when plugin.json is missing", () => {
	const brokenDir = mkdtempSync(join(tmpdir(), "gen-site-data-broken-"));
	mkdirSync(join(brokenDir, "gamma", "skills"), { recursive: true });

	try {
		expect(() => generateSiteData(brokenDir)).toThrow(/gamma/);
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
		'---\ntitle: A\ndescription: desc\ncommand: "/x:y <p>"\nkind: utility\n---\n\nbody\n',
	);
	writeFileSync(
		join(contentDir, "f", "b.mdx"),
		"---\ntitle: B\ndescription: desc\nkind: utility\n---\n\nbody\n",
	);

	expect(generateSearchCommands(contentDir)).toEqual({ "/docs/f/a": "/x:y <p>" });
});

test("maps an unquoted frontmatter command", () => {
	mkdirSync(join(contentDir, "h"), { recursive: true });
	writeFileSync(
		join(contentDir, "h", "c.mdx"),
		"---\ntitle: C\ndescription: desc\ncommand: /h:c\nkind: utility\n---\n\nbody\n",
	);

	expect(generateSearchCommands(contentDir)).toEqual({ "/docs/h/c": "/h:c" });
});

test("maps index.mdx to its folder's URL", () => {
	mkdirSync(join(contentDir, "g"), { recursive: true });
	writeFileSync(
		join(contentDir, "g", "index.mdx"),
		'---\ntitle: G\ndescription: desc\ncommand: "/g:h"\nkind: utility\n---\n\nbody\n',
	);

	expect(generateSearchCommands(contentDir)).toEqual({ "/docs/g": "/g:h" });
});

test("--check returns 1 when the committed search-commands file differs and 0 when equal", () => {
	mkdirSync(join(contentDir, "f"), { recursive: true });
	writeFileSync(
		join(contentDir, "f", "a.mdx"),
		'---\ntitle: A\ndescription: desc\ncommand: "/x:y <p>"\nkind: utility\n---\n\nbody\n',
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

import { copyFileSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { deriveKind, parseCliArgs, runCodemod, transformDoc } from "./codemod-skill-pages";

const fixturesDir = join(import.meta.dirname, "__fixtures__");

function read(name: string): string {
	return readFileSync(join(fixturesDir, name), "utf8");
}

/** Lowercased words, splitting on anything that is not a letter (drops markdown/JSX punctuation). */
function words(src: string): string[] {
	return src
		.toLowerCase()
		.split(/[^a-z]+/)
		.filter(Boolean);
}

/** Word -> occurrence count, so duplicates and lost sentences (words that exist elsewhere) count. */
function wordCounts(src: string): Map<string, number> {
	const counts = new Map<string, number>();
	for (const word of words(src)) counts.set(word, (counts.get(word) ?? 0) + 1);
	return counts;
}

test.each(["single-skill", "usage-with-paragraph", "phase-group"])("transforms %s", (name) => {
	const { out, changed } = transformDoc(read(`${name}.mdx`), "utility");
	expect(changed).toBe(true);
	expect(out).toBe(read(`${name}.expected.mdx`));
});

test("is idempotent", () => {
	const once = transformDoc(read("single-skill.mdx"), "utility").out;
	const twice = transformDoc(once, "utility");
	expect(twice.changed).toBe(false);
	expect(twice.out).toBe(once);
});

test.each(["usage-with-paragraph", "phase-group"])("is idempotent on %s", (name) => {
	const once = transformDoc(read(`${name}.mdx`), "utility").out;
	const twice = transformDoc(once, "utility");
	expect(twice.changed).toBe(false);
	expect(twice.out).toBe(once);
	expect(twice.report).toEqual([]);
});

test("leaves a page with nothing to transform unchanged except kind", () => {
	const { out, report } = transformDoc(read("nothing-to-do.mdx"), "overview");
	expect(out.replace("kind: overview\n", "")).toBe(read("nothing-to-do.mdx"));
	expect(report).toEqual([]);
});

test("removes no words", () => {
	for (const name of ["single-skill", "usage-with-paragraph", "phase-group"]) {
		const before = wordCounts(read(`${name}.mdx`));
		const after = wordCounts(transformDoc(read(`${name}.mdx`), "utility").out);
		for (const [word, count] of before) {
			expect(after.get(word) ?? 0).toBeGreaterThanOrEqual(count);
		}
	}
});

test("reports a recognised section whose shape matches no rule and leaves it untouched", () => {
	const src = [
		"---",
		"title: Odd",
		"description: An odd page.",
		"---",
		"",
		"## What It Does",
		"",
		"It does several things, described in prose rather than a list.",
		"",
		"## Next Phase",
		"",
		"Go to [A](/a) or [B](/b).",
		"",
	].join("\n");
	const { out, report } = transformDoc(src, "phase");
	expect(report).toEqual(["What It Does", "Next Phase"]);
	expect(out).toBe(
		src.replace("description: An odd page.\n", "description: An odd page.\nkind: phase\n"),
	);
});

test("updates an existing kind in place and leaves an equal one untouched", () => {
	const src = "---\ntitle: T\nkind: overview\ndescription: D\n---\n\nBody\n";
	expect(transformDoc(src, "phase").out).toBe(
		"---\ntitle: T\nkind: phase\ndescription: D\n---\n\nBody\n",
	);
	expect(transformDoc(src, "overview").changed).toBe(false);
});

test("drops the Usage heading when the lifted fence was its only content", () => {
	const src =
		"---\ntitle: T\ndescription: D\n---\n\n## Usage\n\n```\n/x:y\n```\n\n## Purpose\n\nP\n";
	expect(transformDoc(src, "utility").out).toBe(
		'---\ntitle: T\ndescription: D\ncommand: "/x:y"\nkind: utility\n---\n\n## Purpose\n\nP\n',
	);
});

test("ignores ## lines inside fenced code", () => {
	const src = "---\ntitle: T\ndescription: D\n---\n\n## Notes\n\n```\n## Output\n```\n";
	const { out, report } = transformDoc(src, "overview");
	expect(out).toBe(src.replace("description: D\n", "description: D\nkind: overview\n"));
	expect(report).toEqual([]);
});

test("phase-group fence not starting with / is left unmatched", () => {
	const src = [
		"---",
		"title: T",
		"description: D",
		"---",
		"",
		"## Skills",
		"",
		"### Thing",
		"",
		"```",
		"echo hello",
		"```",
		"",
		"Does a thing.",
		"",
	].join("\n");
	const { out, report } = transformDoc(src, "utility");
	expect(report).toEqual(["Skills"]);
	expect(out).toBe(src.replace("description: D\n", "description: D\nkind: utility\n"));
});

test("deriveKind follows meta separators", () => {
	const meta = {
		pages: [
			"index",
			"---Phases---",
			"empathize",
			"---Utilities---",
			"a11y-audit",
			"---Memory---",
			"storage",
			"---Other---",
			"utilities",
		],
	};
	expect(deriveKind("empathize", meta)).toBe("phase");
	expect(deriveKind("a11y-audit", meta)).toBe("utility");
	expect(deriveKind("storage", meta)).toBe("overview");
	expect(deriveKind("index", meta)).toBe("overview");
	expect(deriveKind("utilities", meta)).toBe("utility");
	expect(deriveKind("unlisted", undefined)).toBe("overview");
});

let tempDir: string;

beforeEach(() => {
	tempDir = mkdtempSync(join(tmpdir(), "codemod-skill-pages-"));
	for (const name of [
		"single-skill.mdx",
		"usage-with-paragraph.mdx",
		"phase-group.mdx",
		"nothing-to-do.mdx",
		"meta.json",
	]) {
		copyFileSync(join(fixturesDir, name), join(tempDir, name));
	}
	vi.spyOn(console, "log").mockImplementation(() => {});
});

afterEach(() => {
	rmSync(tempDir, { recursive: true, force: true });
	vi.restoreAllMocks();
});

test("runCodemod --check returns 1 when files would change and 0 after writing", () => {
	const before = read("single-skill.mdx");
	expect(runCodemod(tempDir, true)).toBe(1);
	// check mode never writes
	expect(readFileSync(join(tempDir, "single-skill.mdx"), "utf8")).toBe(before);

	expect(runCodemod(tempDir, false)).toBe(0);
	expect(readFileSync(join(tempDir, "phase-group.mdx"), "utf8")).toContain("kind: phase\n");
	expect(readFileSync(join(tempDir, "single-skill.mdx"), "utf8")).toContain("kind: utility\n");
	expect(readFileSync(join(tempDir, "nothing-to-do.mdx"), "utf8")).toContain("kind: overview\n");

	expect(runCodemod(tempDir, true)).toBe(0);
});

test("runCodemod prints changed lines before unmatched lines", () => {
	const lines: string[] = [];
	vi.spyOn(console, "log").mockImplementation((line: string) => {
		lines.push(line);
	});

	const odd = "---\ntitle: Odd\ndescription: D\n---\n\n## What It Does\n\nProse.\n";
	writeFileSync(join(tempDir, "odd.mdx"), odd);

	runCodemod(tempDir, true);
	const firstUnmatched = lines.findIndex((line) => line.startsWith("unmatched:"));
	expect(lines.filter((line) => line.startsWith("changed:")).length).toBe(5);
	expect(lines.slice(firstUnmatched)).toEqual(["unmatched: odd.mdx — What It Does"]);
});

test("parseCliArgs defaults to the given dir with --check off", () => {
	expect(parseCliArgs([], "/default")).toEqual({ contentDir: "/default", check: false });
});

test("parseCliArgs reads --check and --dir", () => {
	expect(parseCliArgs(["--check"], "/default")).toEqual({ contentDir: "/default", check: true });
	expect(parseCliArgs(["--dir", "/other"], "/default")).toEqual({
		contentDir: "/other",
		check: false,
	});
	expect(parseCliArgs(["--dir", "/other", "--check"], "/default")).toEqual({
		contentDir: "/other",
		check: true,
	});
});

test("parseCliArgs rejects a --dir with no value", () => {
	const result = parseCliArgs(["--dir"], "/default");
	expect(result).toHaveProperty("error");
});

test("parseCliArgs rejects a --dir whose value is another flag", () => {
	const result = parseCliArgs(["--dir", "--check"], "/default");
	expect(result).toHaveProperty("error");
});

test("parseCliArgs rejects an unknown argument", () => {
	const result = parseCliArgs(["--chek"], "/default");
	expect(result).toHaveProperty("error");
	expect((result as { error: string }).error).toContain("--chek");
});

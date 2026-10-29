import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { LEGACY_NAME, checkRename } from "./rename-check.js";

// The old name is assembled so that this test file does not itself trip the check.
const Old = `M${LEGACY_NAME.slice(1)}`;

let root: string;

function write(rel: string, body: string): void {
	const file = path.join(root, rel);
	mkdirSync(path.dirname(file), { recursive: true });
	writeFileSync(file, body);
}

beforeEach(() => {
	root = mkdtempSync(path.join(tmpdir(), "pack-tools-rename-"));
});

afterEach(() => {
	rmSync(root, { recursive: true, force: true });
});

describe("checkRename", () => {
	it("spells the legacy name in lower case", () => {
		expect(LEGACY_NAME).toBe(["meta", "powers"].join(""));
	});

	it("is silent for a repo with no occurrence", () => {
		write("README.md", "# singularskills\n");
		write("skills/design-empathize/SKILL.md", "Write `.singularskills/design/x/01.md`.\n");
		expect(checkRename(root)).toEqual([]);
	});

	it("reports path:line for a forbidden occurrence, case-insensitively", () => {
		write("CONTRIBUTING.md", `# Contributing\n\nThanks for helping ${Old}.\n`);
		expect(checkRename(root)).toEqual(["CONTRIBUTING.md:3"]);
	});

	it("forbids a legacy artifact path in a skill", () => {
		write(
			"skills/design-define/SKILL.md",
			`# Define\n\nRead the brief.\nWrite \`.${LEGACY_NAME}/design/<project>/02-define.md\`.\n`,
		);
		expect(checkRename(root)).toEqual(["skills/design-define/SKILL.md:4"]);
	});

	it("reports every matching line of a file", () => {
		write("package.json", `{\n\t"name": "${LEGACY_NAME}",\n\t"x": "${Old}"\n}\n`);
		expect(checkRename(root)).toEqual(["package.json:2", "package.json:3"]);
	});

	it("allows the history allowlist", () => {
		const allowed = [
			"CHANGELOG.md",
			"packages/skill-validator/CHANGELOG.md",
			"docs/plans/2026-04-22-pivot.md",
			"docs/superpowers/specs/x.md",
			"docs/superpowers/plans/deep/y.md",
			".git/config",
			"node_modules/x/index.js",
			"apps/docs/node_modules/y/index.js",
			"apps/docs/out/index.html",
			"apps/docs/.next/cache.json",
			"bun.lock",
			".superpowers/sdd/report.md",
		];
		for (const rel of allowed) write(rel, `${Old}\n`);
		expect(checkRename(root)).toEqual([]);
	});

	it("does not stretch the allowlist to look-alike paths", () => {
		write("docs/CHANGELOG.md", `${Old}\n`);
		write("docs/notes.md", `${Old}\n`);
		write("apps/docs/content/x.mdx", `${Old}\n`);
		expect(checkRename(root)).toEqual([
			"apps/docs/content/x.mdx:1",
			"docs/CHANGELOG.md:1",
			"docs/notes.md:1",
		]);
	});

	it("allows only the README migration note, not other README lines", () => {
		write(
			"README.md",
			[
				"# singularskills",
				"",
				`> Migrating from ${LEGACY_NAME}: move \`.${LEGACY_NAME}/\` to \`.singularskills/\` and replace \`/domain:skill\` with \`/domain-skill\`.`,
				"",
				`Formerly ${Old}.`,
				"",
			].join("\n"),
		);
		write("CONTRIBUTING.md", `> Migrating from ${LEGACY_NAME}: same words, wrong file.\n`);
		expect(checkRename(root)).toEqual(["CONTRIBUTING.md:1", "README.md:5"]);
	});

	it("skips binary files", () => {
		write("assets/logo.png", `\u0000PNG ${LEGACY_NAME}`);
		expect(checkRename(root)).toEqual([]);
	});

	it("in a git work tree, skips ignored files and lists untracked ones", () => {
		execFileSync("git", ["init", "-q"], { cwd: root });
		write(".gitignore", "dist/\n");
		write("packages/a/dist/cli.js", `${LEGACY_NAME}\n`);
		write("untracked.md", `${Old}\n`);
		expect(checkRename(root)).toEqual(["untracked.md:1"]);
	});
});

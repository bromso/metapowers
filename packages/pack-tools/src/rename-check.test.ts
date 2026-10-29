import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { ALLOWED_SOURCE_FILES, checkRename } from "./rename-check.js";

const LEGACY_NAME = "metapowers";
const Old = "Metapowers";

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
	it("allowlists exactly the source files that must name the old project", () => {
		expect([...ALLOWED_SOURCE_FILES].sort()).toEqual([
			"apps/docs/scripts/codemod-skill-pages.test.ts",
			"apps/docs/scripts/codemod-skill-pages.ts",
			"packages/pack-tools/src/migrate.test.ts",
			"packages/pack-tools/src/migrate.ts",
			"packages/pack-tools/src/rename-check.test.ts",
			"packages/pack-tools/src/rename-check.ts",
			"packages/skill-validator/src/plugin-rules.test.ts",
			"packages/skill-validator/src/plugin-rules.ts",
		]);
	});

	it("does not report a hit inside an allowlisted source file, only its neighbours", () => {
		for (const rel of ALLOWED_SOURCE_FILES) write(rel, `const OLD = "${LEGACY_NAME}";\n`);
		write("packages/pack-tools/src/args.test.ts", `const OLD = "${LEGACY_NAME}";\n`);
		write("packages/pack-tools/src/sub/migrate.ts", `const OLD = "${LEGACY_NAME}";\n`);
		expect(checkRename(root)).toEqual([
			"packages/pack-tools/src/args.test.ts:1",
			"packages/pack-tools/src/sub/migrate.ts:1",
		]);
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

	it("allows the same migration note on the docs installation page, and nothing else there", () => {
		write(
			"apps/docs/content/docs/overview/installation.mdx",
			[
				"## Migrating",
				"",
				`> Migrating from ${LEGACY_NAME}: move \`.${LEGACY_NAME}/\` to \`.singularskills/\`.`,
				"",
				`Formerly ${Old}.`,
				"",
			].join("\n"),
		);
		expect(checkRename(root)).toEqual(["apps/docs/content/docs/overview/installation.mdx:5"]);
	});

	it("reports a file whose name holds the old name even when its content is clean", () => {
		write(`apps/docs/content/docs/overview/what-is-${LEGACY_NAME}.mdx`, "# What is it\n");
		expect(checkRename(root)).toEqual([
			`apps/docs/content/docs/overview/what-is-${LEGACY_NAME}.mdx`,
		]);
	});

	it("reports a file under a directory segment holding the old name", () => {
		write(`skills/${Old}-guide/SKILL.md`, "# Guide\n");
		expect(checkRename(root)).toEqual([`skills/${Old}-guide/SKILL.md`]);
	});

	it("reports the path before its content lines", () => {
		write(`notes/${LEGACY_NAME}.md`, `one\n${Old} two\n`);
		expect(checkRename(root)).toEqual([`notes/${LEGACY_NAME}.md`, `notes/${LEGACY_NAME}.md:2`]);
	});

	it("does not report an allowlisted path for its name", () => {
		write(`docs/plans/2026-04-22-${LEGACY_NAME}-pivot-plan.md`, `${Old}\n`);
		write(`.superpowers/${LEGACY_NAME}/x.md`, "clean\n");
		expect(checkRename(root)).toEqual([]);
	});

	it("skips binary file content", () => {
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

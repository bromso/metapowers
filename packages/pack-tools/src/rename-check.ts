import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, realpathSync, statSync } from "node:fs";
import path from "node:path";

/**
 * The project's former name, lower case. Spelled in two parts so that this file, and the
 * migration and validator code that must still recognise the old name, do not trip the check.
 */
export const LEGACY_NAME = ["meta", "powers"].join("");

const LEGACY = new RegExp(LEGACY_NAME, "i");

/** History and generated trees that may keep the old name (spec §10a). */
const ALLOWED_FILES = new Set(["CHANGELOG.md", "bun.lock"]);
const ALLOWED_PREFIXES = [
	"docs/plans/",
	"docs/superpowers/",
	".git/",
	".superpowers/",
	"apps/docs/out/",
	"apps/docs/.next/",
];
const PACKAGE_CHANGELOG = /^packages\/[^/]+\/CHANGELOG\.md$/;

/** The one README line that names the old project on purpose: the migration note. */
const MIGRATION_NOTE = new RegExp(`^> Migrating from ${LEGACY_NAME}:`);

function allowedFile(rel: string): boolean {
	if (ALLOWED_FILES.has(rel) || PACKAGE_CHANGELOG.test(rel)) return true;
	if (rel.split("/").includes("node_modules")) return true;
	return ALLOWED_PREFIXES.some((prefix) => rel.startsWith(prefix));
}

/** Repo-relative POSIX paths: git's tracked and untracked-but-not-ignored files, else a walk. */
function listFiles(repoRoot: string): string[] {
	try {
		const top = execFileSync("git", ["rev-parse", "--show-toplevel"], {
			cwd: repoRoot,
			encoding: "utf8",
			stdio: ["ignore", "pipe", "ignore"],
		}).trim();
		if (realpathSync(top) === realpathSync(repoRoot)) {
			const out = execFileSync(
				"git",
				["ls-files", "-z", "--cached", "--others", "--exclude-standard"],
				{
					cwd: repoRoot,
					encoding: "utf8",
					maxBuffer: 64 * 1024 * 1024,
				},
			);
			return [...new Set(out.split("\0").filter(Boolean))];
		}
	} catch {
		// Not a git work tree (or no git): fall back to walking the directory.
	}
	const files: string[] = [];
	const walk = (dir: string, rel: string) => {
		for (const entry of readdirSync(dir, { withFileTypes: true })) {
			const childRel = rel ? `${rel}/${entry.name}` : entry.name;
			if (entry.isDirectory()) {
				if (entry.name === "node_modules" || entry.name === ".git") continue;
				walk(path.join(dir, entry.name), childRel);
			} else if (entry.isFile()) {
				files.push(childRel);
			}
		}
	};
	walk(repoRoot, "");
	return files;
}

/**
 * Every `path:line` under `repoRoot` that mentions the old project name (case-insensitive)
 * outside the history allowlist, sorted by path then line. Binary files are skipped.
 */
export function checkRename(repoRoot: string): string[] {
	const hits: string[] = [];
	for (const rel of listFiles(repoRoot).sort()) {
		if (allowedFile(rel)) continue;
		const file = path.join(repoRoot, rel);
		if (!existsSync(file) || !statSync(file).isFile()) continue;
		const buffer = readFileSync(file);
		if (buffer.includes(0)) continue;
		const text = buffer.toString("utf8");
		if (!LEGACY.test(text)) continue;
		text.split("\n").forEach((line, index) => {
			if (!LEGACY.test(line)) return;
			if (rel === "README.md" && MIGRATION_NOTE.test(line)) return;
			hits.push(`${rel}:${index + 1}`);
		});
	}
	return hits;
}

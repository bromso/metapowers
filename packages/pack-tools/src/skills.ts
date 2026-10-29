import { readFileSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import { globSync } from "glob";

export interface SkillFile {
	name: string;
	domain: string;
	path: string;
	content: string;
}

/** Domains whose name contains a `-`, so the first `-` of a skill name is not the split. */
const HYPHENATED_DOMAINS = ["project-management"];

/**
 * The skill's domain: a hyphenated domain the name starts with, else the text before the
 * first `-`, or `"singular"` for a name with no `-` (e.g. `workflow`).
 */
function domainOf(name: string): string {
	const hyphenated = HYPHENATED_DOMAINS.find((domain) => name.startsWith(`${domain}-`));
	if (hyphenated) return hyphenated;
	const dash = name.indexOf("-");
	return dash < 0 ? "singular" : name.slice(0, dash);
}

/** Every `<packRoot>/<domain>-<skill>/SKILL.md`, sorted by path. */
export function listSkills(packRoot: string): SkillFile[] {
	const files = globSync("*/SKILL.md", { cwd: packRoot, absolute: true }).sort();
	return files.map((file) => {
		const name = path.basename(path.dirname(file));
		return {
			name,
			domain: domainOf(name),
			path: file,
			content: readFileSync(file, "utf-8"),
		};
	});
}

/**
 * Throws unless `packRoot` is a directory containing at least one skill,
 * so a mistyped root fails loudly instead of "checking" nothing.
 */
export function assertPackRoot(packRoot: string): void {
	let isDir = false;
	try {
		isDir = statSync(packRoot).isDirectory();
	} catch {
		isDir = false;
	}
	if (!isDir) throw new Error(`packRoot "${packRoot}" is not a directory`);
	if (listSkills(packRoot).length === 0) {
		throw new Error(
			`no skills found under packRoot "${packRoot}" (expected <domain>-<skill>/SKILL.md)`,
		);
	}
}

/** Writes `content` to `path` only if it differs from what is on disk. Returns true if written. */
export function writeIfChanged(path: string, content: string): boolean {
	let current: string | undefined;
	try {
		current = readFileSync(path, "utf-8");
	} catch {
		current = undefined;
	}
	if (current === content) return false;
	writeFileSync(path, content);
	return true;
}

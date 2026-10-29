import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import { globSync } from "glob";

export interface SkillFile {
	name: string;
	domain: string;
	path: string;
	content: string;
}

/** The text before the first `-` in `name`, or `"singular"` for a name with no `-` (e.g. `workflow`). */
function domainOf(name: string): string {
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

/** Names of the plugin directories directly under `pluginsRoot`, sorted. */
export function listPlugins(pluginsRoot: string): string[] {
	return readdirSync(pluginsRoot, { withFileTypes: true })
		.filter((entry) => entry.isDirectory())
		.map((entry) => entry.name)
		.sort();
}

/**
 * Temporary shim (deleted in Task 3) that maps a `SkillFile`'s new fields back to the
 * `plugin`/`skill` names the other modules still read, so they keep compiling against the
 * new flat `SkillFile` shape without being rewritten in this task.
 */
export function legacy(skill: SkillFile): {
	plugin: string;
	skill: string;
	path: string;
	content: string;
} {
	return { plugin: skill.domain, skill: skill.name, path: skill.path, content: skill.content };
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

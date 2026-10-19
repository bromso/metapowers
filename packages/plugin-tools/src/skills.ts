import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { globSync } from "glob";

export interface SkillFile {
	plugin: string;
	skill: string;
	path: string;
	content: string;
}

/** Every `<pluginsRoot>/<plugin>/skills/<skill>/SKILL.md`, sorted by path. */
export function listSkills(pluginsRoot: string): SkillFile[] {
	const files = globSync("*/skills/*/SKILL.md", { cwd: pluginsRoot, absolute: true }).sort();
	return files.map((file) => {
		const skillDir = path.dirname(file);
		const pluginDir = path.resolve(skillDir, "../..");
		return {
			plugin: path.basename(pluginDir),
			skill: path.basename(skillDir),
			path: file,
			content: readFileSync(file, "utf-8"),
		};
	});
}

/** Names of the plugin directories directly under `pluginsRoot`, sorted. */
export function listPlugins(pluginsRoot: string): string[] {
	return readdirSync(pluginsRoot, { withFileTypes: true })
		.filter((entry) => entry.isDirectory())
		.map((entry) => entry.name)
		.sort();
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

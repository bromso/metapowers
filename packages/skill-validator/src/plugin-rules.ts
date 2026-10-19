import { readdirSync } from "node:fs";
import path from "node:path";
import { globSync } from "glob";
import type { ParsedSkill } from "./parse-skill.js";
import type { ValidationIssue } from "./rules.js";

export interface PluginContext {
	pluginName: string; // directory name under plugins/
	pluginDir: string; // absolute
	sharedFiles: string[]; // paths relative to pluginDir, e.g. "shared/plan-template.md"
	skillNames: string[]; // directory names under skills/
	allPluginNames: string[]; // every plugin in the repo
	allSkillNames: Record<string, string[]>; // plugin -> skill dirs
}

function listSkillNames(pluginDir: string): string[] {
	return globSync("skills/*/SKILL.md", { cwd: pluginDir, posix: true })
		.map((file) => file.split("/")[1])
		.sort();
}

function listPluginDirs(pluginsRoot: string): string[] {
	return readdirSync(pluginsRoot, { withFileTypes: true })
		.filter((entry) => entry.isDirectory())
		.map((entry) => entry.name)
		.sort();
}

export function buildPluginContext(pluginDir: string, pluginsRoot: string): PluginContext {
	const absPluginDir = path.resolve(pluginDir);
	const absPluginsRoot = path.resolve(pluginsRoot);

	const sharedFiles = globSync("shared/**/*", {
		cwd: absPluginDir,
		nodir: true,
		posix: true,
	}).sort();

	const allPluginNames = listPluginDirs(absPluginsRoot);
	const allSkillNames: Record<string, string[]> = {};
	for (const name of allPluginNames) {
		allSkillNames[name] = listSkillNames(path.join(absPluginsRoot, name));
	}

	return {
		pluginName: path.basename(absPluginDir),
		pluginDir: absPluginDir,
		sharedFiles,
		skillNames: listSkillNames(absPluginDir),
		allPluginNames,
		allSkillNames,
	};
}

const PLUGIN_ROOT_PREFIX = "${CLAUDE_PLUGIN_ROOT}/";
const INLINE_CODE = /`([^`\n]+)`/g;
const SHARED_REF = /^(\$\{CLAUDE_PLUGIN_ROOT\}\/|plugins\/([^/]+)\/)?shared\/(.*)$/;

function sharedPathExists(sharedPath: string, ctx: PluginContext): boolean {
	const dirPrefix = sharedPath.endsWith("/") ? sharedPath : `${sharedPath}/`;
	return ctx.sharedFiles.some((file) => file === sharedPath || file.startsWith(dirPrefix));
}

function checkSharedRefs(parsed: ParsedSkill, ctx: PluginContext): ValidationIssue[] {
	const issues: ValidationIssue[] = [];

	for (const [, ref] of parsed.body.matchAll(INLINE_CODE)) {
		const match = SHARED_REF.exec(ref.trim());
		if (!match) continue;

		const [, prefix, refPlugin] = match;
		const relPath = `shared/${match[3].split("#")[0]}`;
		const canonical = `${PLUGIN_ROOT_PREFIX}${relPath}`;
		const exists = sharedPathExists(relPath, ctx);
		const missingNote = exists
			? ""
			: ` (and \`${relPath}\` does not exist in plugin "${ctx.pluginName}")`;

		if (prefix !== PLUGIN_ROOT_PREFIX) {
			const crossPlugin =
				refPlugin && refPlugin !== ctx.pluginName
					? ` It points into plugin "${refPlugin}", which is not available at runtime.`
					: "";
			issues.push({
				rule: "shared-ref-resolvable",
				message: `Shared reference \`${ref}\` will not resolve once the plugin is installed; use \`${canonical}\` instead${missingNote}.${crossPlugin}`,
				severity: "error",
			});
		} else if (!exists) {
			issues.push({
				rule: "shared-ref-resolvable",
				message: `Shared reference \`${ref}\` does not resolve: no \`${relPath}\` in plugin "${ctx.pluginName}". Fix the path or add the file under ${ctx.pluginName}/shared/.`,
				severity: "error",
			});
		}
	}

	return issues;
}

export function validatePluginSkill(parsed: ParsedSkill, ctx: PluginContext): ValidationIssue[] {
	return [...checkSharedRefs(parsed, ctx)];
}

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

/**
 * The standard Arguments paragraph (spec §6), with a `<domain>` placeholder.
 * `standardArgsParagraph` MUST stay identical to `ARGS_PARAGRAPH` in
 * packages/plugin-tools/src/args.ts for both slug rules — equality tests there
 * enforce it.
 */
export const STANDARD_ARGS_PARAGRAPH =
	'**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.metapowers/<domain>/<project>/skip-log.md`: `- <ISO timestamp> — <skill name> skipped prerequisite check for <artifact file> — reason: <reason or "none given">`.';

const FIRST_TOKEN_SENTENCE = "Take the first token as `<project>`";
const BASENAME_SENTENCE =
	"Derive `<project>` from the argument by taking its basename without extension";

export type SlugRule = "first-token" | "basename";

/** The standard Arguments paragraph for `domain`, in the given slug-rule variant. */
export function standardArgsParagraph(domain: string, rule: SlugRule): string {
	const text = STANDARD_ARGS_PARAGRAPH.replace("<domain>", domain);
	return rule === "basename" ? text.replace(FIRST_TOKEN_SENTENCE, BASENAME_SENTENCE) : text;
}

/**
 * Other domains' artifact roots a plugin may read (never write). Every other
 * `.metapowers/<domain>/` reference outside the plugin's own root is an error.
 */
const CROSS_DOMAIN_READS: Record<string, string[]> = {
	coaching: ["accessibility", "branding", "design", "marketing"],
	branding: ["marketing"],
};

function inlineCode(body: string): string[] {
	return Array.from(body.matchAll(INLINE_CODE), (m) => m[1].trim());
}

function checkArgsInPath(parsed: ParsedSkill): ValidationIssue[] {
	return inlineCode(parsed.body)
		.filter((span) => span.includes(".metapowers/") && span.includes("$ARGUMENTS"))
		.map((span) => ({
			rule: "no-args-in-path",
			message: `Path \`${span}\` contains $ARGUMENTS, which may include flags such as --skip-checks; use \`<project>\` instead.`,
			severity: "error" as const,
		}));
}

function checkArtifactRoot(parsed: ParsedSkill, ctx: PluginContext): ValidationIssue[] {
	if (ctx.pluginName === "metapowers") return [];
	const allowed = [ctx.pluginName, ...(CROSS_DOMAIN_READS[ctx.pluginName] ?? [])].map(
		(domain) => `.metapowers/${domain}/`,
	);
	return inlineCode(parsed.body)
		.filter((span) => span.startsWith(".metapowers/") || span.startsWith(".project/"))
		.filter((span) => !allowed.some((prefix) => span.startsWith(prefix)))
		.map((span) => ({
			rule: "artifact-root",
			message: `Path \`${span}\` is outside this plugin's artifact root; use \`.metapowers/${ctx.pluginName}/…\`.`,
			severity: "error" as const,
		}));
}

function checkSkipChecks(parsed: ParsedSkill, ctx: PluginContext): ValidationIssue[] {
	if (!parsed.body.includes("--skip-checks")) return [];
	const variants: SlugRule[] = ["first-token", "basename"];
	if (variants.some((rule) => parsed.body.includes(standardArgsParagraph(ctx.pluginName, rule))))
		return [];
	return [
		{
			rule: "skip-checks-standard",
			message: `Skill mentions --skip-checks but lacks the standard Arguments paragraph for "${ctx.pluginName}"; run \`plugin-tools fix-args\`.`,
			severity: "error",
		},
	];
}

/**
 * Matches `/<plugin>:<skill>` slash-command references, e.g. `/design:define`.
 * Requires a skill-like token immediately after the colon (no whitespace),
 * so prose such as "customers/clients: scope" or "release/sprint:**" never
 * matches — there's no word character right after the colon there.
 */
const SKILL_REF = /\/([a-zA-Z][a-zA-Z0-9-]*):([a-zA-Z][a-zA-Z0-9-]*)/g;

function checkSkillRefExists(parsed: ParsedSkill, ctx: PluginContext): ValidationIssue[] {
	const issues: ValidationIssue[] = [];
	const seen = new Set<string>();

	for (const [, pluginName, skillName] of parsed.body.matchAll(SKILL_REF)) {
		if (!ctx.allPluginNames.includes(pluginName)) continue; // not a plugin reference at all

		const skills = ctx.allSkillNames[pluginName] ?? [];
		if (skills.includes(skillName)) continue;

		const key = `${pluginName}:${skillName}`;
		if (seen.has(key)) continue;
		seen.add(key);

		const suggestion = skills.find((name) => name.startsWith(skillName));
		const suggestionNote = suggestion ? ` Did you mean \`/${pluginName}:${suggestion}\`?` : "";
		issues.push({
			rule: "skill-ref-exists",
			message: `Reference \`/${pluginName}:${skillName}\` does not match any skill in plugin "${pluginName}".${suggestionNote}`,
			severity: "error",
		});
	}

	return issues;
}

export function validatePluginSkill(parsed: ParsedSkill, ctx: PluginContext): ValidationIssue[] {
	return [
		...checkSharedRefs(parsed, ctx),
		...checkArgsInPath(parsed),
		...checkArtifactRoot(parsed, ctx),
		...checkSkipChecks(parsed, ctx),
		...checkSkillRefExists(parsed, ctx),
	];
}

/**
 * Checks only slash-command references. Used for `shared/**\/*.md` docs,
 * which aren't skills and shouldn't be run through the other skill-shaped
 * rules (artifact-root, skip-checks-standard, etc.).
 */
export function validateSkillRefs(parsed: ParsedSkill, ctx: PluginContext): ValidationIssue[] {
	return checkSkillRefExists(parsed, ctx);
}

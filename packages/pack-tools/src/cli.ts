import { mkdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { standardizeArgs } from "./args.js";
import { addCompute, addDisclaimer } from "./content-blocks.js";
import { checkCounts } from "./counts.js";
import { fixFrontmatter } from "./frontmatter.js";
import { syncHooks } from "./hooks.js";
import { formatPhaseDeps, generatePhaseDeps } from "./phase-deps.js";
import { applyPhaseFiles } from "./phase-files.js";
import { rewriteSharedRefs } from "./shared-refs.js";
import {
	type SkillFile,
	assertPackRoot,
	legacy,
	listPlugins,
	listSkills,
	writeIfChanged,
} from "./skills.js";
import { checkWorkflows, loadWorkflows } from "./workflows.js";

type Transform = (content: string, plugin: string, skill: string) => string;
type SkillTransform = (skill: SkillFile) => string;
/** Receives every skill first (for cross-skill facts), then rewrites one skill at a time. */
type Command = (skills: SkillFile[]) => SkillTransform;

const perSkill =
	(transform: Transform): Command =>
	() =>
	(skill) => {
		const { plugin, skill: skillName } = legacy(skill);
		return transform(skill.content, plugin, skillName);
	};

/**
 * Apply `command` to every SKILL.md under `pluginsRoot`, printing each path
 * that changes. With `check`, nothing is written and the exit code is 1 when
 * any file would change.
 */
function rewriteSkills(pluginsRoot: string, command: Command, check: boolean): number {
	let changed = 0;
	const skills = listSkills(pluginsRoot);
	const transform = command(skills);
	for (const skill of skills) {
		const next = transform(skill);
		if (next === skill.content) continue;
		changed++;
		if (!check) writeIfChanged(skill.path, next);
		console.log(skill.path);
	}
	return check && changed > 0 ? 1 : 0;
}

/**
 * Write `<plugin>/hooks/phase-deps.json` for every plugin with numbered phases, printing
 * each plugin whose file changes. With `check`, nothing is written and the exit code is 1
 * when any file would change or is missing.
 */
function genPhaseDeps(pluginsRoot: string, check: boolean): number {
	const skills = listSkills(pluginsRoot);
	let changed = 0;
	for (const plugin of listPlugins(pluginsRoot)) {
		const deps = generatePhaseDeps(plugin, skills);
		if (!deps) continue;
		const file = path.join(pluginsRoot, plugin, "hooks", "phase-deps.json");
		const text = formatPhaseDeps(deps);
		let current: string | undefined;
		try {
			current = readFileSync(file, "utf-8");
		} catch {
			current = undefined;
		}
		if (current === text) continue;
		changed++;
		if (!check) {
			mkdirSync(path.dirname(file), { recursive: true });
			writeIfChanged(file, text);
		}
		console.log(plugin);
	}
	return check && changed > 0 ? 1 : 0;
}

/** Where the canonical phase-gate.sh, hooks.json and design-extra.json live. */
const canonicalHooksDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../hooks");

/**
 * Sync `phase-gate.sh` and `hooks.json` into every plugin with phases (and remove
 * `hooks.json` from the rest), printing each path that changes. With `check`, nothing is
 * written and the exit code is 1 when any file would change.
 */
function syncHooksCommand(pluginsRoot: string, check: boolean): number {
	const changed = syncHooks(pluginsRoot, canonicalHooksDir, { check });
	for (const file of changed) console.log(file);
	return check && changed.length > 0 ? 1 : 0;
}

/** Adds the disclaimer, reporting (on stderr) each skill skipped for lacking `## Output`. */
const fixDisclaimer: Command = () => (skill) => {
	const result = addDisclaimer(skill.content, legacy(skill).plugin);
	if (result.skipped) console.error(`skipped (${result.skipped}): ${skill.path}`);
	return result.content;
};

/** Commands that rewrite SKILL.md files. */
const commands: Record<string, Command> = {
	"fix-shared-refs": perSkill(rewriteSharedRefs),
	"fix-args": perSkill(standardizeArgs),
	"fix-phase-files": applyPhaseFiles,
	"fix-frontmatter": perSkill(fixFrontmatter),
	"fix-disclaimer": fixDisclaimer,
	"fix-compute": perSkill(addCompute),
};

/** Commands that generate other files from the skills. */
const generators: Record<string, (pluginsRoot: string, check: boolean) => number> = {
	"gen-phase-deps": genPhaseDeps,
	"sync-hooks": syncHooksCommand,
};

/**
 * Prints every quoted skill count that disagrees with disk (spec §10), one
 * violation per line, and exits 1 if any; silent and exits 0 otherwise.
 */
function checkCountsCommand(repoRoot: string): number {
	const violations = checkCounts(repoRoot);
	for (const violation of violations) {
		console.log(`${violation.file}: found "${violation.found}" expected "${violation.expected}"`);
	}
	return violations.length > 0 ? 1 : 0;
}

/**
 * Prints every workflow violation (spec §6.2) of `<repoRoot>/workflows/*.yml` against the
 * pack in `<repoRoot>/skills`, one per line, and exits 1 if any; silent and exits 0 otherwise.
 */
function checkWorkflowsCommand(repoRoot: string): number {
	const violations = checkWorkflows(
		loadWorkflows(path.join(repoRoot, "workflows")),
		listSkills(path.join(repoRoot, "skills")),
	);
	for (const violation of violations) console.log(violation);
	return violations.length > 0 ? 1 : 0;
}

/** Commands that check repo-wide invariants and only report; these take the repo root, not pluginsRoot. */
const checkers: Record<string, (repoRoot: string) => number> = {
	"check-counts": checkCountsCommand,
	"check-workflows": checkWorkflowsCommand,
};
/** The directory under the repo root that each checker reads its skills from. */
const checkerPacks: Record<string, string> = {
	"check-counts": "plugins",
	"check-workflows": "skills",
};

const [command, root, ...rest] = process.argv.slice(2);
const rewrite = command ? commands[command] : undefined;
const generate = command ? generators[command] : undefined;
const checker = command ? checkers[command] : undefined;
if ((!rewrite && !generate && !checker) || !root) {
	const names = [...Object.keys(commands), ...Object.keys(generators), ...Object.keys(checkers)];
	console.error(`Usage: pack-tools <${names.join("|")}> <packRoot|repoRoot> [--check]`);
	process.exit(2);
}
try {
	assertPackRoot(checker ? path.join(root, checkerPacks[command]) : root);
} catch (err) {
	console.error(`pack-tools: ${(err as Error).message}`);
	process.exit(2);
}
const check = rest.includes("--check");
process.exit(
	checker
		? checker(root)
		: generate
			? generate(root, check)
			: rewriteSkills(root, rewrite as Command, check),
);

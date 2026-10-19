import { mkdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { standardizeArgs } from "./args.js";
import { syncHooks } from "./hooks.js";
import { formatPhaseDeps, generatePhaseDeps } from "./phase-deps.js";
import { applyPhaseFiles } from "./phase-files.js";
import { rewriteSharedRefs } from "./shared-refs.js";
import {
	type SkillFile,
	assertPluginsRoot,
	listPlugins,
	listSkills,
	writeIfChanged,
} from "./skills.js";

type Transform = (content: string, plugin: string) => string;
type SkillTransform = (skill: SkillFile) => string;
/** Receives every skill first (for cross-skill facts), then rewrites one skill at a time. */
type Command = (skills: SkillFile[]) => SkillTransform;

const perSkill =
	(transform: Transform): Command =>
	() =>
	(skill) =>
		transform(skill.content, skill.plugin);

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

/** Commands that rewrite SKILL.md files. */
const commands: Record<string, Command> = {
	"fix-shared-refs": perSkill(rewriteSharedRefs),
	"fix-args": perSkill(standardizeArgs),
	"fix-phase-files": applyPhaseFiles,
};

/** Commands that generate other files from the skills. */
const generators: Record<string, (pluginsRoot: string, check: boolean) => number> = {
	"gen-phase-deps": genPhaseDeps,
	"sync-hooks": syncHooksCommand,
};

const [command, pluginsRoot, ...rest] = process.argv.slice(2);
const rewrite = command ? commands[command] : undefined;
const generate = command ? generators[command] : undefined;
if ((!rewrite && !generate) || !pluginsRoot) {
	const names = [...Object.keys(commands), ...Object.keys(generators)];
	console.error(`Usage: plugin-tools <${names.join("|")}> <pluginsRoot> [--check]`);
	process.exit(2);
}
try {
	assertPluginsRoot(pluginsRoot);
} catch (err) {
	console.error(`plugin-tools: ${(err as Error).message}`);
	process.exit(2);
}
const check = rest.includes("--check");
process.exit(
	generate ? generate(pluginsRoot, check) : rewriteSkills(pluginsRoot, rewrite as Command, check),
);

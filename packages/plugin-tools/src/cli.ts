import { standardizeArgs } from "./args.js";
import { applyPhaseFiles } from "./phase-files.js";
import { rewriteSharedRefs } from "./shared-refs.js";
import { type SkillFile, assertPluginsRoot, listSkills, writeIfChanged } from "./skills.js";

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

const commands: Record<string, Command> = {
	"fix-shared-refs": perSkill(rewriteSharedRefs),
	"fix-args": perSkill(standardizeArgs),
	"fix-phase-files": applyPhaseFiles,
};

const [command, pluginsRoot, ...rest] = process.argv.slice(2);
const selected = command ? commands[command] : undefined;
if (!selected || !pluginsRoot) {
	console.error(`Usage: plugin-tools <${Object.keys(commands).join("|")}> <pluginsRoot> [--check]`);
	process.exit(2);
}
try {
	assertPluginsRoot(pluginsRoot);
} catch (err) {
	console.error(`plugin-tools: ${(err as Error).message}`);
	process.exit(2);
}
process.exit(rewriteSkills(pluginsRoot, selected, rest.includes("--check")));

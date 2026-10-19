import { standardizeArgs } from "./args.js";
import { rewriteSharedRefs } from "./shared-refs.js";
import { assertPluginsRoot, listSkills, writeIfChanged } from "./skills.js";

type Transform = (content: string, plugin: string) => string;

/**
 * Apply `transform` to every SKILL.md under `pluginsRoot`, printing each path
 * that changes. With `check`, nothing is written and the exit code is 1 when
 * any file would change.
 */
function rewriteSkills(pluginsRoot: string, transform: Transform, check: boolean): number {
	let changed = 0;
	for (const skill of listSkills(pluginsRoot)) {
		const next = transform(skill.content, skill.plugin);
		if (next === skill.content) continue;
		changed++;
		if (!check) writeIfChanged(skill.path, next);
		console.log(skill.path);
	}
	return check && changed > 0 ? 1 : 0;
}

const commands: Record<string, Transform> = {
	"fix-shared-refs": rewriteSharedRefs,
	"fix-args": standardizeArgs,
};

const [command, pluginsRoot, ...rest] = process.argv.slice(2);
const transform = command ? commands[command] : undefined;
if (!transform || !pluginsRoot) {
	console.error(`Usage: plugin-tools <${Object.keys(commands).join("|")}> <pluginsRoot> [--check]`);
	process.exit(2);
}
try {
	assertPluginsRoot(pluginsRoot);
} catch (err) {
	console.error(`plugin-tools: ${(err as Error).message}`);
	process.exit(2);
}
process.exit(rewriteSkills(pluginsRoot, transform, rest.includes("--check")));

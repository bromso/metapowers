import { rewriteSharedRefs } from "./shared-refs.js";
import { listSkills, writeIfChanged } from "./skills.js";

type Command = (pluginsRoot: string, check: boolean) => number;

function fixSharedRefs(pluginsRoot: string, check: boolean): number {
	let changed = 0;
	for (const skill of listSkills(pluginsRoot)) {
		const next = rewriteSharedRefs(skill.content, skill.plugin);
		if (next === skill.content) continue;
		changed++;
		if (!check) writeIfChanged(skill.path, next);
		console.log(skill.path);
	}
	return check && changed > 0 ? 1 : 0;
}

const commands: Record<string, Command> = {
	"fix-shared-refs": fixSharedRefs,
};

const [command, pluginsRoot, ...rest] = process.argv.slice(2);
const run = command ? commands[command] : undefined;
if (!run || !pluginsRoot) {
	console.error(`Usage: plugin-tools <${Object.keys(commands).join("|")}> <pluginsRoot> [--check]`);
	process.exit(2);
}
process.exit(run(pluginsRoot, rest.includes("--check")));

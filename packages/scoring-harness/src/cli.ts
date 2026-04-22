import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { globSync } from "glob";
import { resolve, dirname } from "node:path";
import { runScoring } from "./runner.js";

function getCurrentSha(): string {
	return execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf-8" }).trim();
}

function parseArgs(args: string[]) {
	const flags: Record<string, string> = {};
	for (let i = 0; i < args.length; i++) {
		if (args[i].startsWith("--") && i + 1 < args.length) {
			flags[args[i].slice(2)] = args[i + 1];
			i++;
		}
	}
	return flags;
}

async function main() {
	const flags = parseArgs(process.argv.slice(2));
	const sha = getCurrentSha();

	const rubricFiles = globSync("../../fixtures/**/expected/*.json", {
		cwd: import.meta.dirname,
		absolute: true,
	});

	const filtered = flags.skill
		? rubricFiles.filter((f) => {
				const content = JSON.parse(readFileSync(f, "utf-8"));
				return content.skill === flags.skill;
			})
		: rubricFiles;

	console.log(`Running ${filtered.length} scoring run(s) at ${sha.slice(0, 7)}...\n`);

	const results = [];
	for (const rubricPath of filtered) {
		const rubricDir = dirname(rubricPath);
		const rubricContent = JSON.parse(readFileSync(rubricPath, "utf-8"));
		const fixtureName = rubricContent.fixture;
		const fixturePath = resolve(rubricDir, "..", fixtureName);
		const skillName = rubricContent.skill;

		const skillPaths = globSync(`../../plugins/**/skills/${skillName}/SKILL.md`, {
			cwd: import.meta.dirname,
			absolute: true,
		});
		const skillPath = skillPaths[0];

		if (!skillPath) {
			console.log(`SKIP ${skillName} — skill not found`);
			continue;
		}

		console.log(`SCORE ${skillName} against ${fixtureName}...`);

		try {
			const result = await runScoring({ skillPath, fixturePath, rubricPath, sha });
			results.push(result);

			const pct = (result.score.score * 100).toFixed(0);
			console.log(`  Score: ${pct}% (${result.score.earnedScore}/${result.score.maxScore})`);

			for (const fail of result.score.failed) {
				console.log(`  FAIL [${fail.name}]: ${fail.description}`);
			}
		} catch (err) {
			console.log(`  ERROR: ${err}`);
		}
	}

	const hasFailures = results.some((r) => r.score.score < 1.0);
	process.exit(hasFailures ? 1 : 0);
}

main();

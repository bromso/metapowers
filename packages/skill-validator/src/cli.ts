import { readFileSync } from "node:fs";
import { globSync } from "glob";
import { parseSkill } from "./parse-skill.js";
import { type ValidationResult, validateSkill } from "./rules.js";

export function discoverSkills(rootDir: string): string[] {
	return globSync("**/skills/*/SKILL.md", { cwd: rootDir, absolute: true });
}

export interface ValidatorRunResult {
	exitCode: number;
	results: Array<{ filePath: string; result: ValidationResult }>;
}

export function runValidator(rootDir: string): ValidatorRunResult {
	const files = discoverSkills(rootDir);
	const results: ValidatorRunResult["results"] = [];
	let hasErrors = false;

	for (const filePath of files) {
		const content = readFileSync(filePath, "utf-8");
		const parsed = parseSkill(content, filePath);
		const result = validateSkill(parsed);
		results.push({ filePath, result });
		if (!result.pass) hasErrors = true;
	}

	return { exitCode: hasErrors ? 1 : 0, results };
}

// CLI entry point
const args = process.argv.slice(2);
if (args.length > 0) {
	const rootDir = args[0];
	const { exitCode, results } = runValidator(rootDir);

	for (const { filePath, result } of results) {
		const icon = result.pass ? "PASS" : "FAIL";
		console.log(`${icon} ${filePath}`);
		for (const err of result.errors) {
			console.log(`  ERROR [${err.rule}]: ${err.message}`);
		}
		for (const warn of result.warnings) {
			console.log(`  WARN  [${warn.rule}]: ${warn.message}`);
		}
	}

	process.exit(exitCode);
}

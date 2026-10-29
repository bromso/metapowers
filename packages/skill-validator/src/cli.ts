import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { globSync } from "glob";
import { parseSkill } from "./parse-skill.js";
import { buildPackContext, validatePackSkill, validateSkillRefs } from "./plugin-rules.js";
import { type ValidationResult, validateSkill } from "./rules.js";

/** `<rootDir>/<name>/SKILL.md` — `rootDir` is the pack's `skills/` directory. */
export function discoverSkills(rootDir: string): string[] {
	return globSync("*/SKILL.md", { cwd: rootDir, absolute: true }).sort();
}

/**
 * Reference docs — not skills, but still worth checking for `skill-ref-exists`: each skill's
 * `references/**\/*.md` and the canonical `references/**\/*.md` next to `rootDir`.
 */
export function discoverSharedDocs(rootDir: string): string[] {
	const own = globSync("*/references/**/*.md", { cwd: rootDir, absolute: true });
	const canonicalDir = path.resolve(rootDir, "../references");
	const canonical = existsSync(canonicalDir)
		? globSync("**/*.md", { cwd: canonicalDir, absolute: true })
		: [];
	return [...canonical, ...own].sort();
}

export interface ValidatorRunResult {
	exitCode: number;
	results: Array<{ filePath: string; result: ValidationResult }>;
}

/** Validate the pack whose `skills/` directory is `rootDir`. */
export function runValidator(rootDir: string): ValidatorRunResult {
	const ctx = buildPackContext(path.resolve(rootDir, ".."));
	const results: ValidatorRunResult["results"] = [];
	let hasErrors = false;

	for (const filePath of discoverSkills(rootDir)) {
		const parsed = parseSkill(readFileSync(filePath, "utf-8"), filePath);
		const result = validateSkill(parsed);
		for (const issue of validatePackSkill(parsed, ctx)) {
			(issue.severity === "error" ? result.errors : result.warnings).push(issue);
		}
		result.pass = result.errors.length === 0;

		results.push({ filePath, result });
		if (!result.pass) hasErrors = true;
	}

	// Reference docs aren't skills; only skill-ref-exists applies to them.
	for (const filePath of discoverSharedDocs(rootDir)) {
		const parsed = parseSkill(readFileSync(filePath, "utf-8"), filePath);
		const errors = validateSkillRefs(parsed, ctx);
		const result: ValidationResult = { pass: errors.length === 0, errors, warnings: [] };

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

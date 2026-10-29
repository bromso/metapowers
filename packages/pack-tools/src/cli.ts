import { existsSync } from "node:fs";
import path from "node:path";
import { standardizeArgs } from "./args.js";
import { addCompute, addDisclaimer } from "./content-blocks.js";
import { checkCounts } from "./counts.js";
import { fixFrontmatter } from "./frontmatter.js";
import { genGates } from "./gates.js";
import { migrate } from "./migrate.js";
import { applyPhaseFiles } from "./phase-files.js";
import { genReferences } from "./references.js";
import { rewriteSharedRefs } from "./shared-refs.js";
import { type SkillFile, assertPackRoot, listSkills, writeIfChanged } from "./skills.js";
import { checkWorkflows, loadWorkflows } from "./workflows.js";

type Transform = (content: string, domain: string, name: string) => string;
type SkillTransform = (skill: SkillFile) => string;
/** Receives every skill first (for cross-skill facts), then rewrites one skill at a time. */
type Command = (skills: SkillFile[]) => SkillTransform;

const perSkill =
	(transform: Transform): Command =>
	() =>
	(skill) =>
		transform(skill.content, skill.domain, skill.name);

/**
 * Apply `command` to every SKILL.md under `packRoot`, printing each path that changes. With
 * `check`, nothing is written and the exit code is 1 when any file would change.
 */
function rewriteSkills(packRoot: string, command: Command, check: boolean): number {
	let changed = 0;
	const skills = listSkills(packRoot);
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

/** Adds the disclaimer, reporting (on stderr) each skill skipped for lacking `## Output`. */
const fixDisclaimer: Command = () => (skill) => {
	const result = addDisclaimer(skill.content, skill.domain);
	if (result.skipped) console.error(`skipped (${result.skipped}): ${skill.path}`);
	return result.content;
};

/** Commands that rewrite SKILL.md files under a pack root. */
const commands: Record<string, Command> = {
	"fix-shared-refs": perSkill(rewriteSharedRefs),
	"fix-args": perSkill(standardizeArgs),
	"fix-phase-files": applyPhaseFiles,
	"fix-frontmatter": perSkill(fixFrontmatter),
	"fix-disclaimer": fixDisclaimer,
	"fix-compute": perSkill(addCompute),
};

/**
 * Prints every quoted skill count that disagrees with disk (spec §9), one
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

/** Commands that check repo-wide invariants against `<repoRoot>/skills` and only report. */
const checkers: Record<string, (repoRoot: string) => number> = {
	"check-counts": checkCountsCommand,
	"check-workflows": checkWorkflowsCommand,
};

/** Commands that generate files under a repo root; each returns the repo-relative paths that change. */
const generators: Record<string, (repoRoot: string, check: boolean) => string[]> = {
	"gen-gates": (repoRoot, check) =>
		genGates(repoRoot, loadWorkflows(path.join(repoRoot, "workflows")), { check }),
	"gen-references": (repoRoot, check) => genReferences(repoRoot, { check }),
};

/**
 * Runs generator `name`, printing each path that changes (or would, with `check`). Exits 1
 * when `check` finds drift or the generator throws (e.g. an unresolvable link), else 0.
 */
function generate(name: string, repoRoot: string, check: boolean): number {
	let changed: string[];
	try {
		changed = generators[name](repoRoot, check);
	} catch (err) {
		console.error(`pack-tools ${name}: ${(err as Error).message}`);
		return 1;
	}
	for (const file of changed) console.log(file);
	return check && changed.length > 0 ? 1 : 0;
}

/**
 * One-shot: move `<repoRoot>/plugins/` into the flat pack (spec §5). Refuses to run when
 * `<repoRoot>/skills` already exists, so it can never run twice.
 */
function migrateCommand(repoRoot: string): number {
	if (existsSync(path.join(repoRoot, "skills"))) {
		console.error(
			`pack-tools: ${path.join(repoRoot, "skills")} already exists; refusing to migrate`,
		);
		return 2;
	}
	const report = migrate(repoRoot, loadWorkflows(path.join(repoRoot, "workflows")));
	console.log(`moved ${report.moved}, deleted ${report.deleted.length}`);
	for (const [rule, count] of Object.entries(report.rewrites)) console.log(`  ${rule}: ${count}`);
	return 0;
}

const [command, root, ...rest] = process.argv.slice(2);
const rewrite = command ? commands[command] : undefined;
const checker = command ? checkers[command] : undefined;
const generator = command ? generators[command] : undefined;
if (command === "migrate" && root) {
	process.exit(migrateCommand(root));
}
if ((!rewrite && !checker && !generator) || !root) {
	const names = [
		...Object.keys(commands),
		...Object.keys(checkers),
		...Object.keys(generators),
		"migrate",
	];
	console.error(`Usage: pack-tools <${names.join("|")}> <packRoot|repoRoot> [--check]`);
	process.exit(2);
}
try {
	assertPackRoot(rewrite ? root : path.join(root, "skills"));
} catch (err) {
	console.error(`pack-tools: ${(err as Error).message}`);
	process.exit(2);
}
const check = rest.includes("--check");
if (generator) process.exit(generate(command as string, root, check));
process.exit(checker ? checker(root) : rewriteSkills(root, rewrite as Command, check));

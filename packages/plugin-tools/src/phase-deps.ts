import { writeTargets } from "./phase-files.js";
import type { SkillFile } from "./skills.js";

/**
 * The table a plugin's phase-gate hook reads (spec §8). `requires[NN]` lists globs,
 * relative to the project directory, that must each match a file before phase `NN`
 * may be written; a phase without a key is unrestricted.
 */
export interface PhaseDeps {
	domain: string;
	artifacts: string;
	requires: Record<string, string[]>;
}

/** Body of the `## Prerequisites` section (up to the next `## ` heading); "" when absent. */
function prerequisitesSection(content: string): string {
	const lines = content.split("\n");
	const start = lines.findIndex((line) => /^## Prerequisites\s*$/.test(line));
	if (start < 0) return "";
	const rest = lines.slice(start + 1);
	const end = rest.findIndex((line) => /^## /.test(line));
	return (end < 0 ? rest : rest.slice(0, end)).join("\n");
}

const PROJECT_FILE = /`\.metapowers\/[^/`]+\/<project>\/([^`]*)`/g;
/** Wording right after a path that makes the read optional, e.g. "(if exists)" or "if it exists". */
const OPTIONAL = /^\s*(?:\(if (?:it )?exists\)|if (?:it|they) exists?\b)/;

/**
 * Files a skill's `## Prerequisites` section reads, relative to the project directory,
 * sorted and deduplicated. A directory (`01-assess/`) becomes `01-assess/*.md`; the bare
 * project directory, `skip-log.md`, reads marked optional, and a section starting with
 * "None" contribute nothing.
 */
export function prerequisiteFiles(content: string): string[] {
	const section = prerequisitesSection(content);
	if (/^None\b/.test(section.trim())) return [];
	const files = new Set<string>();
	for (const match of section.matchAll(PROJECT_FILE)) {
		const after = section.slice((match.index ?? 0) + match[0].length);
		if (OPTIONAL.test(after)) continue;
		const file = match[1];
		if (file === "" || file === "skip-log.md") continue;
		files.add(file.endsWith("/") ? `${file}*.md` : file);
	}
	return [...files].sort();
}

/** `02-protect.md` → `02`, `01-assess/gdpr.md` → `01`, `01-assess/*.md` → `01`; undefined when unnumbered. */
const phaseOf = (file: string): string | undefined => /^(\d\d)-/.exec(file)?.[1];

/**
 * The phase-deps table for `plugin`: for each phase with ≥1 writer skill, `requires[NN]`
 * is the intersection of the writers' prerequisite files (so no writer's own documented
 * workflow is blocked), minus files of phase NN itself; empty intersections are omitted.
 * Returns null when no skill of `plugin` writes a numbered artifact.
 */
export function generatePhaseDeps(plugin: string, skills: SkillFile[]): PhaseDeps | null {
	const prereqsByPhase = new Map<string, string[][]>();
	let directoryPhase = false;
	for (const skill of skills) {
		if (skill.plugin !== plugin) continue;
		const phases = new Set<string>();
		for (const target of writeTargets(skill.content)) {
			if (target.plugin !== plugin) continue;
			const phase = phaseOf(target.file);
			if (!phase) continue;
			phases.add(phase);
			if (target.file.includes("/")) directoryPhase = true;
		}
		const prereqs = prerequisiteFiles(skill.content);
		for (const phase of phases) {
			const list = prereqsByPhase.get(phase) ?? [];
			prereqsByPhase.set(phase, list);
			list.push(prereqs);
		}
	}
	if (prereqsByPhase.size === 0) return null;

	const requires: Record<string, string[]> = {};
	for (const phase of [...prereqsByPhase.keys()].sort()) {
		const [first, ...others] = prereqsByPhase.get(phase) ?? [];
		const shared = first.filter(
			(file) => phaseOf(file) !== phase && others.every((list) => list.includes(file)),
		);
		if (shared.length > 0) requires[phase] = shared;
	}

	// Capture groups: 1 = project, 2 = phase for a plain phase file; when the directory
	// alternative matched instead, 3 = project, 4 = phase. `[0-9]`, not `\d`: phase-gate.sh
	// matches with bash `=~` (POSIX ERE), which has no `\d`.
	const base = `\\.metapowers/${plugin}/([^/]+)/([0-9][0-9])-[^/]+`;
	const artifacts = directoryPhase ? `${base}\\.md$|${base}/[^/]+\\.md$` : `${base}\\.md$`;
	return { domain: plugin, artifacts, requires };
}

const LINE_WIDTH = 100;
const TAB_WIDTH = 2; // how Biome measures a tab against lineWidth

/**
 * Serialize like Biome formats JSON: tab indentation, objects expanded, arrays inline when
 * the line fits in 100 columns, keys in `artifacts`, `domain`, `requires` order, and a
 * trailing newline.
 */
export function formatPhaseDeps(deps: PhaseDeps): string {
	const q = (value: string) => JSON.stringify(value);
	const entries = Object.keys(deps.requires)
		.sort()
		.map((phase, index, all) => {
			const files = deps.requires[phase];
			const comma = index < all.length - 1 ? "," : "";
			const inline = `\t\t${q(phase)}: [${files.map(q).join(", ")}]${comma}`;
			if (inline.length - 2 + 2 * TAB_WIDTH <= LINE_WIDTH) return inline;
			const items = files.map((file, i) => `\t\t\t${q(file)}${i < files.length - 1 ? "," : ""}`);
			return [`\t\t${q(phase)}: [`, ...items, `\t\t]${comma}`].join("\n");
		});
	const requires = entries.length === 0 ? "{}" : `{\n${entries.join("\n")}\n\t}`;
	return `{\n\t"artifacts": ${q(deps.artifacts)},\n\t"domain": ${q(deps.domain)},\n\t"requires": ${requires}\n}\n`;
}

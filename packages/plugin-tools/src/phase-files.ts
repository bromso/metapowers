import type { SkillFile } from "./skills.js";

export interface WriteTarget {
	skill: string; // the skill's title (first "# " heading); "" when it has none
	file: string; // path below .metapowers/<plugin>/<project>/, e.g. "02-protect.md" or "01-assess/gdpr.md"
	line: number; // 1-based
	plugin: string; // the <plugin> segment of the path
	path: string; // the full path as written, e.g. ".metapowers/security/<project>/02-protect.md"
}

/**
 * A write-target lead-in: `**Write the <x>** to|— write to|— save to|— append to|by appending to`
 * or a bare `Write to`, followed by a `.metapowers/` path in backticks.
 * Keep textually identical to WRITE_LINE in packages/skill-validator/src/plugin-rules.ts
 * (the validator must not depend on plugin-tools).
 */
const WRITE_LINE =
	/(\*\*Write the [a-z ]+\*\* (?:to|— (?:write|save) to|— append to|by appending to)|\bWrite to) `(\.metapowers\/[^`]+)`/g;
const PROJECT_PATH = /^\.metapowers\/([^/]+)\/<project>\/(.+)$/;

export const APPEND_TEMPLATE = (path: string, title: string, phaseLabel: string) =>
	`**Write the artifact** — append to \`${path}\` under a \`## ${title}\` section. Create the file with a \`# ${phaseLabel} — <project>\` heading if it does not exist; if a \`## ${title}\` section already exists, replace only that section.`;

/** First "# " heading of the skill. */
export function skillTitle(content: string): string {
	return /^# (.+)$/m.exec(content)?.[1].trim() ?? "";
}

/** `02-protect.md` → `Protect`, `04-trial-balance.md` → `Trial Balance`, `01-assess/gdpr.md` → `Assess`. */
export function phaseLabel(file: string): string {
	return file
		.split("/")[0]
		.replace(/\.md$/, "")
		.replace(/^\d+-/, "")
		.split("-")
		.filter(Boolean)
		.map((word) => word[0].toUpperCase() + word.slice(1))
		.join(" ");
}

/** Every write-target line whose path lies under `.metapowers/<plugin>/<project>/`. */
export function writeTargets(content: string): WriteTarget[] {
	const skill = skillTitle(content);
	const targets: WriteTarget[] = [];
	content.split("\n").forEach((text, index) => {
		for (const match of text.matchAll(WRITE_LINE)) {
			const parsed = PROJECT_PATH.exec(match[2]);
			if (!parsed) continue;
			targets.push({ skill, file: parsed[2], line: index + 1, plugin: parsed[1], path: match[2] });
		}
	});
	return targets;
}

/**
 * Files under `.metapowers/<plugin>/<project>/` written by ≥2 distinct skills of
 * the same plugin: plugin → file → writer skill directory names (sorted).
 */
export function multiWriterFiles(skills: SkillFile[]): Map<string, Map<string, string[]>> {
	const writers = new Map<string, Map<string, Set<string>>>();
	for (const skill of skills) {
		for (const target of writeTargets(skill.content)) {
			if (target.plugin !== skill.plugin) continue;
			const files = writers.get(skill.plugin) ?? new Map<string, Set<string>>();
			writers.set(skill.plugin, files);
			const names = files.get(target.file) ?? new Set<string>();
			files.set(target.file, names);
			names.add(skill.skill);
		}
	}
	const result = new Map<string, Map<string, string[]>>();
	for (const [plugin, files] of writers) {
		const multi = new Map<string, string[]>();
		for (const [file, names] of files) {
			if (names.size >= 2) multi.set(file, [...names].sort());
		}
		if (multi.size > 0) result.set(plugin, multi);
	}
	return result;
}

// Clauses after the path that the template already says.
const REDUNDANT_CLAUSES = /^(?: under an? `## [^`]*` section| \(append to existing\))/;

function rewriteWriteLine(text: string, file: string, title: string, label: string): string {
	for (const match of text.matchAll(WRITE_LINE)) {
		const parsed = PROJECT_PATH.exec(match[2]);
		if (!parsed || parsed[2] !== file) continue;
		if (text.includes(`— append to \`${match[2]}\``) && text.includes("section")) return text;
		const start = match.index ?? 0;
		const before = text.slice(0, start);
		const trailing = text
			.slice(start + match[0].length)
			.replace(REDUNDANT_CLAUSES, "")
			.trim();
		const template = APPEND_TEMPLATE(match[2], title, label);
		// A lead-in that introduced a block (" with heading:", " with sections:", ":") now
		// introduces it with its own sentence; any other trailing text is kept as-is.
		if (trailing.endsWith(":")) return `${before}${template} ${SECTION_CONTAINS}`;
		return trailing ? `${before}${template} ${trailing}` : before + template;
	}
	return text;
}

const SECTION_CONTAINS = "The section contains:";

/** True when `text` is a write-target line for `file`. */
function isWriteLineFor(text: string, file: string): boolean {
	return Array.from(text.matchAll(WRITE_LINE)).some(
		(match) => PROJECT_PATH.exec(match[2])?.[2] === file,
	);
}

/**
 * Rewrite the write-target lead-in for `file` to APPEND_TEMPLATE (a trailing block
 * introducer becomes "The section contains:"; "## X" in the block becomes "### X"), and in `## Output` replace
 * `written to \`<path>\`` with `appended to \`<path>\``.
 */
export function applyAppendWording(
	content: string,
	file: string,
	title: string,
	phaseLabel: string,
): string {
	const paths = new Set(
		writeTargets(content)
			.filter((target) => target.file === file)
			.map((target) => target.path),
	);
	let inOutput = false;
	let inWriteBlock = false;
	return content
		.split("\n")
		.map((text) => {
			if (/^## /.test(text)) inOutput = /^## Output\b/.test(text);
			// The write block: indented or blank continuation lines after the lead-in,
			// until the next line at column 0. Its own "## X" headings nest as "### X".
			if (inWriteBlock && text.trim() !== "" && !/^\s/.test(text)) inWriteBlock = false;
			if (inWriteBlock) return text.replace(/^(\s+)## /, "$1### ");
			if (isWriteLineFor(text, file)) inWriteBlock = true;
			let next = rewriteWriteLine(text, file, title, phaseLabel);
			if (inOutput) {
				for (const path of paths) {
					next = next.replaceAll(`written to \`${path}\``, `appended to \`${path}\``);
				}
			}
			return next;
		})
		.join("\n");
}

/**
 * Build a per-skill transform that applies the append wording to every
 * multi-writer phase file the skill writes.
 */
export function applyPhaseFiles(skills: SkillFile[]): (skill: SkillFile) => string {
	const multi = multiWriterFiles(skills);
	return (skill) => {
		const files = multi.get(skill.plugin);
		if (!files) return skill.content;
		const title = skillTitle(skill.content);
		let content = skill.content;
		const own = new Set(writeTargets(content).map((target) => target.file));
		for (const file of own) {
			if (files.has(file)) content = applyAppendWording(content, file, title, phaseLabel(file));
		}
		return content;
	};
}

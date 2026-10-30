import { argsSlugRule, logFields, replaceArgsParagraph } from "./args.js";
import { DISCLAIMER_INSTRUCTION } from "./content-blocks.js";
import { gatedSkills } from "./gates.js";
import { skillTitle } from "./phase-files.js";
import type { SkillFile } from "./skills.js";
import type { Phase, Workflow } from "./workflows.js";

/**
 * The four blocks of a SKILL.md that derive from the workflow files (spec §6.4–6.5, handoff
 * spec §4), regenerated in place by `pack-tools fix-skill-text`: the Arguments paragraph's
 * `skipped` line, the handoff paragraph that opens `## Prerequisites`, the gate-and-start step
 * after it, and the `**Record the run.**` block at the end of `## Output`. Re-runnable: running
 * it again changes nothing.
 */

/** The gate step: the first paragraph of `## Prerequisites` for every member of a gated phase. */
export const GATE_STEP =
	"Run this skill's gate before writing: `sh <this skill's folder>/scripts/gate.sh <project> <project root>`, where `<project root>` is the folder that contains `.singularskills/` (use `.` when you are already there). If it exits non-zero, stop and tell the user what it printed, unless `--skip-checks` was given (see Arguments).";

/** The gate step the one-shot migration wrote; replaced wherever it is still found. */
const LEGACY_GATE_STEP =
	"Run `scripts/gate.sh <project>` from this skill's folder. If it exits non-zero, stop and tell the user what it printed (unless `--skip-checks`, see Arguments).";

/** First words of the Output block; the block runs to the end of its closing `markdown` fence. */
export const OUTPUT_MARKER = "**Record the run.**";

/** A member of a domain workflow's phase: the workflow, the phase and the member's name. */
export type Member = { workflow: Workflow; phase: Phase; name: string };

/** Domain workflows only (no phase names a `folder`): skill name → its workflow and phase. */
export function memberships(workflows: Workflow[]): Map<string, Member> {
	const map = new Map<string, Member>();
	for (const workflow of workflows) {
		if (workflow.phases.some((phase) => phase.folder !== undefined)) continue;
		for (const phase of workflow.phases) {
			for (const name of phase.skills) map.set(name, { workflow, phase, name });
		}
	}
	return map;
}

const isFence = (line: string) => /^\s*(```|~~~)/.test(line);

/** Index of the `## <title>` line outside fenced code, or -1. */
function headingIndex(lines: string[], title: string): number {
	let inFence = false;
	for (let i = 0; i < lines.length; i++) {
		if (isFence(lines[i])) inFence = !inFence;
		if (!inFence && lines[i] === `## ${title}`) return i;
	}
	return -1;
}

/** End (exclusive) of the section whose heading is at `start`: the next `## ` outside fences. */
function sectionEnd(lines: string[], start: number): number {
	let inFence = false;
	for (let i = start + 1; i < lines.length; i++) {
		if (isFence(lines[i])) inFence = !inFence;
		if (!inFence && lines[i].startsWith("## ")) return i;
	}
	return lines.length;
}

/** The Arguments paragraph with the skill's literal log fields (see `logFields`). */
export function fixArgs(content: string, domain: string, name: string): string {
	if (argsSlugRule(content) === undefined) return content;
	return replaceArgsParagraph(content, domain, logFields(content, name));
}

/** One run-log line of `member` for `event`, as the Arguments paragraph's `skipped` line. */
function logLine(member: Member, event: string, note: string): string {
	const { workflow, phase, name } = member;
	return `\`{"ts":"<ISO timestamp>","skill":"${name}","workflow":"${workflow.folder}","phase":${phase.phase},"project":"<project>","event":"${event}","artifact":"${phase.artifact}","note":"${note}"}\``;
}

/** Opening of the ungated member's first Prerequisites paragraph. */
const START_STEP = "Before you start work, append this line to `.singularskills/log.jsonl`";

/**
 * The first paragraph of `## Prerequisites` for a phase member, in the order a literal agent
 * follows: run the gate, on a refusal append `refused` and stop (under `--skip-checks` the
 * Arguments paragraph's `skipped` line comes first), then append `started` before the work. An
 * ungated member only appends `started`.
 */
export function startParagraph(member: Member, gated: boolean): string {
	const started = logLine(member, "started", "");
	if (!gated) {
		return `${START_STEP} (create the folder and file if missing): ${started}.`;
	}
	const refused = logLine(member, "refused", "<what the gate printed>");
	return `${GATE_STEP} On a refusal, before you stop, append this line to \`.singularskills/log.jsonl\` (create the folder and file if missing): ${refused}. Once the gate has passed, or under \`--skip-checks\` once you have appended the \`skipped\` line, append this line before you start work: ${started}.`;
}

/** A line this fixer owns as the first paragraph of `## Prerequisites`. */
const isStartStep = (line: string) =>
	line.startsWith(GATE_STEP) || line === LEGACY_GATE_STEP || line.startsWith(START_STEP);

/**
 * `startParagraph` as the first paragraph of `## Prerequisites` for a phase member with an
 * artifact (a new section before the first H2 when there is none), replacing an earlier gate or
 * start step; any such step is removed from other skills, leaving `None.` in a section it
 * empties.
 */
export function fixStartStep(content: string, member: Member | undefined, gated: boolean): string {
	const lines = content.split("\n");
	const at = headingIndex(lines, "Prerequisites");
	const paragraph = member?.phase.artifact ? startParagraph(member, gated) : undefined;
	if (paragraph === undefined) {
		if (at < 0) return content;
		const end = sectionEnd(lines, at);
		const body = lines.slice(at + 1, end);
		const kept = body.filter((line) => !isStartStep(line));
		if (kept.length === body.length) return content;
		const collapsed = kept.filter((line, i) => !(line === "" && kept[i - 1] === ""));
		const empty = collapsed.every((line) => line.trim() === "");
		const section = empty ? ["", "None.", ""] : collapsed;
		lines.splice(at + 1, end - at - 1, ...section);
		return lines.join("\n");
	}
	if (at >= 0) {
		// A section that said only "None." now holds the step instead.
		const end = sectionEnd(lines, at);
		const rest = lines
			.slice(at + 1, end)
			.filter((line) => line.trim() !== "" && !isStartStep(line));
		if (rest.length === 1 && rest[0] === "None.") {
			lines.splice(at + 1, end - at - 1, "", paragraph, "");
			return lines.join("\n");
		}
		// A handoff paragraph (see `fixHandoff`) may already open the section; the step follows it.
		const lead = lines.findIndex((line, i) => i > at && line.trim() !== "");
		const afterLead = lead >= 0 && isHandoff(lines[lead]) ? lead : at;
		const first = lines.findIndex((line, i) => i > afterLead && line.trim() !== "");
		if (first >= 0 && isStartStep(lines[first])) {
			lines[first] = paragraph;
			return lines.join("\n");
		}
		lines.splice(afterLead + 1, 0, "", paragraph);
		return lines.join("\n");
	}
	const firstH2 = lines.findIndex((line) => line.startsWith("## "));
	const insertAt = firstH2 < 0 ? lines.length : firstH2;
	lines.splice(insertAt, 0, "## Prerequisites", "", paragraph, "");
	return lines.join("\n");
}

/** First words of the handoff paragraph: the first paragraph of `## Prerequisites` of every member. */
export const HANDOFF_MARKER = "**Part of a workflow.**";

/**
 * The handoff paragraph (handoff spec §4): a member invoked outside an open run, or for a whole
 * process, hands off to the `workflow` conductor. Only the phase number and title and the
 * workflow title and name vary per member.
 */
export function handoffParagraph(member: Member): string {
	const { workflow, phase } = member;
	return `${HANDOFF_MARKER} This skill is phase ${phase.phase} (${phase.title}) of the ${workflow.title} workflow (\`${workflow.name}\`); cross-domain workflows run it too. Unless the user named this skill, check \`.singularskills/log.jsonl\` for an open run for this project: a \`run-started\` line with \`"project":"<project>"\` and no later \`run-finished\` line for the same \`workflow\` and \`project\`. If there is no open run, or the user asked to start, run, continue or resume a process or workflow rather than this one step, do not continue here: invoke the \`workflow\` skill with the workflow the user asked for, or \`${workflow.name}\` when they named none, followed by \`<project>\`. It runs this phase in order, asks before it writes and records the run. Continue here when the user named this skill, or when an open run exists (the conductor is running you).`;
}

const isHandoff = (line: string) => line.startsWith(HANDOFF_MARKER);

/**
 * `handoffParagraph` as the first paragraph of `## Prerequisites` of every member (a new section
 * before the first H2 when there is none), replacing any earlier handoff wherever it sits; a
 * section that said only `None.` loses it. Without a member, any handoff is removed, leaving
 * `None.` in a section it empties.
 */
export function fixHandoff(content: string, member: Member | undefined): string {
	const lines = content.split("\n");
	const at = headingIndex(lines, "Prerequisites");
	if (member === undefined) {
		if (at < 0) return content;
		const end = sectionEnd(lines, at);
		const body = lines.slice(at + 1, end);
		const kept = body.filter((line) => !isHandoff(line));
		if (kept.length === body.length) return content;
		const collapsed = kept.filter((line, i) => !(line === "" && kept[i - 1] === ""));
		const empty = collapsed.every((line) => line.trim() === "");
		lines.splice(at + 1, end - at - 1, ...(empty ? ["", "None.", ""] : collapsed));
		return lines.join("\n");
	}
	const paragraph = handoffParagraph(member);
	if (at < 0) {
		const firstH2 = lines.findIndex((line) => line.startsWith("## "));
		lines.splice(firstH2 < 0 ? lines.length : firstH2, 0, "## Prerequisites", "", paragraph, "");
		return lines.join("\n");
	}
	const end = sectionEnd(lines, at);
	const body = lines
		.slice(at + 1, end)
		.filter((line) => !isHandoff(line) && line.trim() !== "None.")
		.filter((line, i, all) => !(line === "" && (i === 0 || all[i - 1] === "")));
	while (body.length > 0 && body[body.length - 1] === "") body.pop();
	lines.splice(at + 1, end - at - 1, "", paragraph, ...(body.length ? ["", ...body] : []), "");
	return lines.join("\n");
}

/** Markers around the conductor's generated workflows block (handoff spec §6). */
export const WORKFLOWS_BLOCK_START = "<!-- workflows:start -->";
export const WORKFLOWS_BLOCK_END = "<!-- workflows:end -->";

const cell = (values: string[]) => values.map((v) => `\`${v}\``).join(", ");

/**
 * The conductor's workflows block: for every workflow, sorted by name, a heading and one table
 * row per phase (number, title, artifact, own folder, requires, member skills), so the conductor
 * can run when it cannot read the workflow files.
 */
export function workflowsBlock(workflows: Workflow[]): string[] {
	const lines = [
		WORKFLOWS_BLOCK_START,
		"The workflows, from `workflows/*.yml` (regenerated by `pack-tools fix-skill-text`); each heading names the bundled copy of its file:",
	];
	for (const wf of [...workflows].sort((a, b) => a.name.localeCompare(b.name))) {
		lines.push(
			"",
			`### ${wf.name} — ${wf.title} (folder \`${wf.folder}\`, file \`references/workflows/${wf.name}.yml\`)`,
			"",
			"| Phase | Title | Artifact | Folder | Requires | Skills |",
			"| --- | --- | --- | --- | --- | --- |",
		);
		for (const p of wf.phases) {
			const artifact = p.artifact ? `\`${p.artifact}\`` : "";
			lines.push(
				`| ${p.phase} | ${p.title} | ${artifact} | ${p.folder ?? ""} | ${cell(p.requires)} | ${cell(p.skills)} |`,
			);
		}
	}
	lines.push(WORKFLOWS_BLOCK_END);
	return lines;
}

/** `workflowsBlock` in place of whatever sits between the markers; unchanged without a start marker. */
export function fixWorkflowsBlock(content: string, workflows: Workflow[]): string {
	const lines = content.split("\n");
	const start = lines.indexOf(WORKFLOWS_BLOCK_START);
	if (start < 0) return content;
	const end = lines.indexOf(WORKFLOWS_BLOCK_END, start);
	if (end < 0) throw new Error("unterminated workflows block");
	lines.splice(start, end - start + 1, ...workflowsBlock(workflows));
	return lines.join("\n");
}

/**
 * The `**Record the run.**` block (spec §6.5) of a phase member: its `finished` line, the
 * artifact frontmatter and the closing sections; for a shared artifact (a phase with two or
 * more members writing one file), also who writes the frontmatter and the italic line each
 * member's `## <section>` opens with.
 */
export function outputBlock(member: Member, section = "<Skill title>"): string[] {
	const { workflow, phase, name } = member;
	const gated = phase.requires.length > 0;
	const shared = phase.skills.length > 1 && !phase.artifact?.endsWith("/");
	const gateValue = gated ? "<passed|skipped>" : "none";
	const gateNote = gated
		? "`gate` is `passed` when the gate ran clean and `skipped` under `--skip-checks`"
		: "`gate` is `none`, as this phase has no gate";
	const log = [
		`${OUTPUT_MARKER} After you have written ${shared ? "your section" : "the artifact"}, append this line to \`.singularskills/log.jsonl\` (the \`started\` line of Prerequisites, with \`"event":"finished"\`): ${logLine(member, "finished", "")}.`,
	];
	const frontmatter = [
		"```yaml",
		"---",
		`skill: ${shared ? phase.title : name}`,
		`workflow: ${workflow.name}`,
		`phase: ${phase.phase}`,
		"project: <project>",
		"started: <ISO timestamp>",
		"finished: <ISO timestamp>",
		'agent: <the agent you run in, or "unknown">',
		`gate: ${gateValue}`,
		"---",
		"```",
	];
	const worst = gated
		? " and to set `gate` to the worst value among the sections (`skipped` over `passed`)"
		: "";
	const intro = shared
		? `This artifact is shared by every skill of phase ${phase.phase} (${phase.title}). The frontmatter is written once, by whoever creates the file: if you create it, open it with the block below (\`skill\` is the phase title, \`started\` the time of that first write; ${gateNote}); if it already exists, leave the block alone except to update \`finished\`${worst}.`
		: `Open the artifact with this frontmatter (\`agent\` is the agent you run in, or \`unknown\`; ${gateNote}):`;
	const sectionLine = shared
		? [
				`Open your \`## ${section}\` section with one italic line, \`*<skill name> · <ISO timestamp> · gate: ${gateValue}*\` (your skill name is \`${name}\`).`,
				"",
			]
		: [];
	// In a shared artifact the closing sections sit one level under the member's own section,
	// so "replace only that section" stays unambiguous.
	const level = shared ? "###" : "##";
	const closing = shared
		? `End your section with \`### Decisions\` and \`### Open questions\` (one level under your \`## ${section}\` heading, so the section stays one block), in this shape:`
		: "End the artifact with `## Decisions` and `## Open questions`, in this shape:";
	return [
		...log,
		"",
		intro,
		"",
		...frontmatter,
		"",
		...sectionLine,
		closing,
		"",
		"```markdown",
		`${level} Decisions`,
		"- <what was chosen> — <why> — <what was rejected>",
		"",
		`${level} Open questions`,
		"- <what the next phase or a reviewer must settle>",
		"```",
	];
}

/** `[start, end)` of the existing Output block, or `undefined`. */
function blockRange(lines: string[]): [number, number] | undefined {
	const start = lines.findIndex((line) => line.startsWith(OUTPUT_MARKER));
	if (start < 0) return undefined;
	const open = lines.findIndex((line, i) => i > start && line === "```markdown");
	const close = open < 0 ? -1 : lines.findIndex((line, i) => i > open && line === "```");
	if (close < 0) throw new Error(`unterminated ${OUTPUT_MARKER} block`);
	return [start, close + 1];
}

/**
 * The Output block of `member` in place of the existing one, or appended to `## Output` (a new
 * section at the end when there is none) before a disclaimer instruction so the disclaimer
 * stays the artifact's last paragraph. Without a member, any block is removed.
 */
export function fixOutputBlock(content: string, member: Member | undefined): string {
	const lines = content.split("\n");
	const range = blockRange(lines);
	if (!member?.phase.artifact) {
		if (!range) return content;
		const [start, end] = range;
		const removeTo = lines[end] === "" ? end + 1 : end;
		lines.splice(start, removeTo - start);
		return lines.join("\n");
	}
	// The section the skill appends under (see phase-files' APPEND_TEMPLATE), else its title.
	const section = /under an? `## ([^`]+)` section/.exec(content)?.[1] ?? skillTitle(content);
	const block = outputBlock(member, section || undefined);
	if (range) {
		const [start, end] = range;
		lines.splice(start, end - start, ...block);
		return lines.join("\n");
	}
	const start = headingIndex(lines, "Output");
	if (start < 0) return `${content.replace(/\n*$/, "")}\n\n## Output\n\n${block.join("\n")}\n`;
	const end = sectionEnd(lines, start);
	const disclaimer = lines.findIndex(
		(line, i) => i > start && i < end && line === DISCLAIMER_INSTRUCTION,
	);
	if (disclaimer >= 0) {
		lines.splice(disclaimer, 0, ...block, "");
		return lines.join("\n");
	}
	let last = end - 1;
	while (last > start && lines[last].trim() === "") last--;
	lines.splice(last + 1, 0, "", ...block);
	return lines.join("\n");
}

/**
 * `pack-tools fix-skill-text`: regenerates the Arguments paragraph, the gate step and the
 * Output block of every skill from `workflows`. Idempotent.
 */
export function fixSkillText(workflows: Workflow[]): (skill: SkillFile) => string {
	const members = memberships(workflows);
	const gated = gatedSkills(workflows);
	return (skill) => {
		let out = fixArgs(skill.content, skill.domain, skill.name);
		out = fixStartStep(out, members.get(skill.name), gated.has(skill.name));
		out = fixHandoff(out, members.get(skill.name));
		if (skill.name === "workflow") out = fixWorkflowsBlock(out, workflows);
		return fixOutputBlock(out, members.get(skill.name));
	};
}

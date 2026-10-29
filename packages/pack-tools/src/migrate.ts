import {
	existsSync,
	mkdirSync,
	readFileSync,
	readdirSync,
	renameSync,
	rmSync,
	statSync,
	writeFileSync,
} from "node:fs";
import path from "node:path";
import { globSync } from "glob";
import { replaceArgsParagraph } from "./args.js";
import { DISCLAIMER_INSTRUCTION } from "./content-blocks.js";
import {
	type FrontmatterBlock,
	blockValue,
	parseFrontmatter,
	renderFrontmatter,
} from "./frontmatter.js";
import { skillTitle } from "./phase-files.js";
import { rewriteSharedRefs } from "./shared-refs.js";
import type { Phase, Workflow } from "./workflows.js";

/**
 * One-shot migration (spec §5, §6.1): `plugins/<domain>/skills/<skill>/` becomes the flat
 * pack `skills/<domain>-<skill>/`, with frontmatter, paths, references and the run-log text
 * rewritten. Kept after the run for its tests and as the record of what changed.
 */

/** A skill being migrated: its old domain and directory name, and its workflow phase if any. */
export type MigrationContext = { domain: string; name: string; workflow?: Workflow; phase?: Phase };
export type MigrationReport = {
	moved: number;
	deleted: string[];
	rewrites: Record<string, number>;
};

/** The sixteen plugin directories the pack migrates from. */
export const DOMAINS = [
	"accessibility",
	"accounting",
	"bookkeeping",
	"branding",
	"coaching",
	"compliance",
	"design",
	"development",
	"finance",
	"leadership",
	"legal",
	"marketing",
	"metapowers",
	"project-management",
	"research",
	"security",
];

/** Skills deleted rather than moved: the old conductor, replaced by `skills/workflow` (spec §6.3). */
const DELETED_SKILLS = new Set(["metapowers/workflow"]);

/** `shared/` entries with no future reader (spec §5), deleted even when a skill links them. */
const ORPHANS = new Set([
	"accounting/accounting-cycle-guide.md",
	"bookkeeping/bookkeeping-cycle-guide.md",
	"finance/fpa-framework-guide.md",
	"legal/legal-lifecycle-guide.md",
	"metapowers/workflows",
	"metapowers/domain-registry.md",
]);

export const GATE_PARAGRAPH =
	"Run `scripts/gate.sh <project>` from this skill's folder. If it exits non-zero, stop and tell the user what it printed (unless `--skip-checks`, see Arguments).";

export const FIGMA_NOTE =
	"> **Note:** Figma steps require a Figma MCP server; see the design workflow page.";

/** `metapowers` → `singular`; every other domain keeps its name. */
export function flatDomain(domain: string): string {
	return domain === "metapowers" ? "singular" : domain;
}

/** The flat skill name, `<domain>-<skill>` (`metapowers/status` → `singular-status`). */
export function flatName(domain: string, skill: string): string {
	return `${flatDomain(domain)}-${skill}`;
}

/** The flat name a `<domain>:<skill>` reference points at; the old conductor is now `workflow`. */
function refName(domain: string, skill: string): string {
	return domain === "metapowers" && skill === "workflow" ? "workflow" : flatName(domain, skill);
}

const SKILL_REF = new RegExp(`(?<=[/"])(${DOMAINS.join("|")}):([a-z0-9][a-z0-9-]*)`, "g");

/** `/<domain>:<skill>` (and a quoted `"<domain>:<skill>"`) → the flat name. */
export function rewriteSkillRefs(text: string): string {
	return text.replace(SKILL_REF, (_m, domain: string, skill: string) => refName(domain, skill));
}

/** `.metapowers/<domain>/` → `.singularskills/<domain>/` (`metapowers` → `singular`), then any other `.metapowers/`. */
function rewriteArtifactPaths(text: string): string {
	return text
		.replaceAll(".metapowers/metapowers/", ".singularskills/singular/")
		.replaceAll(".metapowers/", ".singularskills/");
}

/** Drops every sentence that mentions `skip-log.md`, and a line left empty by it. */
function dropSkipLogSentences(text: string): string {
	const lines = text.split("\n");
	const out: string[] = [];
	for (let i = 0; i < lines.length; i++) {
		if (!lines[i].includes("skip-log.md")) {
			out.push(lines[i]);
			continue;
		}
		const kept = lines[i]
			.split(/(?<=[.!?])\s+/)
			.filter((sentence) => !sentence.includes("skip-log.md"))
			.join(" ");
		if (kept.trim() !== "") {
			out.push(kept);
		} else if ((out.length === 0 || out[out.length - 1] === "") && lines[i + 1] === "") {
			i++; // collapse the blank line the removed paragraph leaves behind
		}
	}
	return out.join("\n");
}

const isFence = (line: string) => /^\s*(```|~~~)/.test(line);

/** Index of the `## <title>` line outside fenced code, or -1. */
function headingIndex(lines: string[], title: string): number {
	let inFence = false;
	for (let i = 0; i < lines.length; i++) {
		if (isFence(lines[i])) inFence = !inFence;
		if (!inFence && new RegExp(`^## ${title}\\s*$`).test(lines[i])) return i;
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

/** The gate step as the first paragraph of `## Prerequisites` (a new section when there is none). */
function addGateStep(text: string, ctx: MigrationContext): string {
	if (!ctx.phase || ctx.phase.requires.length === 0 || text.includes(GATE_PARAGRAPH)) return text;
	const lines = text.split("\n");
	const at = headingIndex(lines, "Prerequisites");
	if (at >= 0) {
		lines.splice(at + 1, 0, "", GATE_PARAGRAPH);
		return lines.join("\n");
	}
	const firstH2 = lines.findIndex((line) => line.startsWith("## "));
	const insertAt = firstH2 < 0 ? lines.length : firstH2;
	lines.splice(insertAt, 0, "## Prerequisites", "", GATE_PARAGRAPH, "");
	return lines.join("\n");
}

/** First line of the closing-sections block; its presence makes `addOutputBlock` a no-op. */
const OUTPUT_MARKER = "**Record the run.**";

/**
 * The Output instruction of spec §6.5 for a phase member: the artifact frontmatter and the
 * two closing sections; for a shared artifact, also who writes the frontmatter and the italic
 * line each member's section opens with.
 */
export function outputBlock(ctx: MigrationContext, section = "<Skill title>"): string[] {
	const { workflow, phase } = ctx;
	if (!workflow || !phase) return [];
	const name = flatName(ctx.domain, ctx.name);
	const gated = phase.requires.length > 0;
	const shared = phase.skills.length > 1 && !phase.artifact?.endsWith("/");
	const gateValue = gated ? "<passed|skipped>" : "none";
	const gateNote = gated
		? "`gate` is `passed` when the gate ran clean and `skipped` under `--skip-checks`"
		: "`gate` is `none`, as this phase has no gate";
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
	const intro = shared
		? [
				`${OUTPUT_MARKER} This artifact is shared by every skill of phase ${phase.phase} (${phase.title}). The frontmatter is written once, by whoever creates the file: if you create it, open it with the block below (\`skill\` is the phase title, \`started\` the time of that first write; ${gateNote}); if it already exists, leave the block alone except to update \`finished\` and to set \`gate\` to the worst value among the sections (\`skipped\` over \`passed\`).`,
			]
		: [
				`${OUTPUT_MARKER} Open the artifact with this frontmatter (\`agent\` is the agent you run in, or \`unknown\`; ${gateNote}):`,
			];
	const sectionLine = shared
		? [
				`Open your \`## ${section}\` section with one italic line, \`*<skill name> · <ISO timestamp> · gate: <passed|skipped>*\` (your skill name is \`${name}\`).`,
				"",
			]
		: [];
	return [
		...intro,
		"",
		...frontmatter,
		"",
		...sectionLine,
		"End the artifact (or your section of a shared artifact) with `## Decisions` and `## Open questions`, in this shape:",
		"",
		"```markdown",
		"## Decisions",
		"- <what was chosen> — <why> — <what was rejected>",
		"",
		"## Open questions",
		"- <what the next phase or a reviewer must settle>",
		"```",
	];
}

/**
 * Append `outputBlock` to `## Output` (a new section at the end when there is none), before a
 * disclaimer instruction so the disclaimer stays the artifact's last paragraph.
 */
function addOutputBlock(text: string, ctx: MigrationContext): string {
	if (!ctx.phase?.artifact || text.includes(OUTPUT_MARKER)) return text;
	// The section the skill appends under (see phase-files' APPEND_TEMPLATE), else its title.
	const section = /under an? `## ([^`]+)` section/.exec(text)?.[1] ?? skillTitle(text);
	const block = outputBlock(ctx, section || undefined);
	const lines = text.split("\n");
	const start = headingIndex(lines, "Output");
	if (start < 0) return `${text.replace(/\n*$/, "")}\n\n## Output\n\n${block.join("\n")}\n`;
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

/** The Figma note (spec §8) after the title of a design skill that uses Figma MCP tools. */
function addFigmaNote(text: string, ctx: MigrationContext): string {
	if (ctx.domain !== "design" || !/mcp__|figma_/.test(text) || text.includes(FIGMA_NOTE)) {
		return text;
	}
	const lines = text.split("\n");
	const title = lines.findIndex((line) => line.startsWith("# "));
	if (title < 0) return text;
	lines.splice(title + 1, 0, "", FIGMA_NOTE);
	return lines.join("\n");
}

type BodyRule = (text: string, ctx: MigrationContext) => string;

/** The body rewrites in order (brief Task 3), keyed by the name the migration report counts. */
const BODY_RULES: [string, BodyRule][] = [
	["artifact-paths", rewriteArtifactPaths],
	["skill-refs", rewriteSkillRefs],
	["shared-refs", (text, ctx) => rewriteSharedRefs(text, ctx.domain)],
	["arguments", (text, ctx) => replaceArgsParagraph(text, flatDomain(ctx.domain))],
	["skip-log", dropSkipLogSentences],
	["gate-step", addGateStep],
	["output-block", addOutputBlock],
	["figma-note", addFigmaNote],
];

/** `rewriteBody` plus the names of the rules that changed something. */
export function rewriteBodyTracked(
	content: string,
	ctx: MigrationContext,
): { content: string; applied: string[] } {
	const applied: string[] = [];
	let out = content;
	for (const [name, rule] of BODY_RULES) {
		const next = rule(out, ctx);
		if (next !== out) applied.push(name);
		out = next;
	}
	return { content: out, applied };
}

/** Rewrite a skill body for the flat pack (brief Task 3). Idempotent. */
export function rewriteBody(content: string, ctx: MigrationContext): string {
	return rewriteBodyTracked(content, ctx).content;
}

/**
 * The new frontmatter block: `name` is the flat name, `description` stays verbatim, and
 * `metadata` holds `argument-hint`, `disable-model-invocation` and, for a member of a domain
 * workflow, `workflow`, `phase` and (when the phase has one) `artifact`.
 */
export function newFrontmatter(blocks: FrontmatterBlock[], ctx: MigrationContext): string {
	const entries: [string, string][] = [];
	for (const key of ["argument-hint", "disable-model-invocation"]) {
		const value = blockValue(blocks, key);
		if (value !== undefined) entries.push([key, value]);
	}
	if (ctx.workflow && ctx.phase) {
		entries.push(["workflow", ctx.workflow.name], ["phase", String(ctx.phase.phase)]);
		if (ctx.phase.artifact) entries.push(["artifact", ctx.phase.artifact]);
	}
	return renderFrontmatter(flatName(ctx.domain, ctx.name), blocks, entries);
}

const FRONTMATTER = /^---\n([\s\S]*?)\n---(?=\n|$)/;

/** A whole SKILL.md for the flat pack, with the rules each part applied. */
function migrateSkill(
	content: string,
	ctx: MigrationContext,
): { content: string; applied: string[] } {
	const match = FRONTMATTER.exec(content);
	const body = match ? content.slice(match[0].length) : content;
	const result = rewriteBodyTracked(body, ctx);
	if (!match) return result;
	const applied = [...result.applied, "frontmatter"];
	const blocks = parseFrontmatter(match[1]).map(([key, text]): FrontmatterBlock => {
		if (key !== "description") return [key, text];
		const next = rewriteSkillRefs(text);
		if (next !== text) applied.push("description-refs");
		return [key, next];
	});
	return { content: `${newFrontmatter(blocks, ctx)}${result.content}`, applied };
}

/** Domain workflows only (no phase names a `folder`): flat skill name → its workflow and phase. */
function memberships(workflows: Workflow[]): Map<string, { workflow: Workflow; phase: Phase }> {
	const map = new Map<string, { workflow: Workflow; phase: Phase }>();
	for (const workflow of workflows) {
		if (workflow.phases.some((phase) => phase.folder !== undefined)) continue;
		for (const phase of workflow.phases) {
			for (const skill of phase.skills) map.set(skill, { workflow, phase });
		}
	}
	return map;
}

const isDir = (p: string) => existsSync(p) && statSync(p).isDirectory();
const listDirs = (p: string) =>
	isDir(p)
		? readdirSync(p)
				.filter((entry) => isDir(path.join(p, entry)))
				.sort()
		: [];

function move(from: string, to: string): void {
	mkdirSync(path.dirname(to), { recursive: true });
	renameSync(from, to);
}

/** Every file below `dir`, as paths relative to `root`, sorted. */
function filesUnder(root: string, dir: string): string[] {
	return globSync("**/*", { cwd: path.join(root, dir), nodir: true, dot: true })
		.map((file) => path.join(dir, file))
		.sort();
}

type PendingSkill = { from: string; flat: string; content: string; ctx: MigrationContext };

/**
 * Move `<repoRoot>/plugins/` into the flat pack (brief Task 3): skill folders to
 * `skills/<flat>/` with rewritten SKILL.md, `shared/` files to `references/<domain>/` (two or
 * more readers) or the single reader's `references/` (orphans deleted), evals to
 * `evals/<flat>/`, then delete what is left of `plugins/`. Membership comes from the domain
 * workflows in `workflows`.
 */
export function migrate(repoRoot: string, workflows: Workflow[]): MigrationReport {
	const plugins = path.join(repoRoot, "plugins");
	const rel = (p: string) => path.relative(repoRoot, p);
	const members = memberships(workflows);
	const deleted: string[] = [];
	const rewrites: Record<string, number> = {};

	const pending: PendingSkill[] = [];
	for (const domain of listDirs(plugins)) {
		const skillsDir = path.join(plugins, domain, "skills");
		for (const skill of listDirs(skillsDir)) {
			const from = path.join(skillsDir, skill);
			if (!existsSync(path.join(from, "SKILL.md"))) continue;
			if (DELETED_SKILLS.has(`${domain}/${skill}`)) {
				deleted.push(rel(from));
				rmSync(from, { recursive: true, force: true });
				continue;
			}
			const flat = flatName(domain, skill);
			const member = members.get(flat);
			const ctx: MigrationContext = { domain, name: skill, ...member };
			const migrated = migrateSkill(readFileSync(path.join(from, "SKILL.md"), "utf-8"), ctx);
			for (const rule of migrated.applied) rewrites[rule] = (rewrites[rule] ?? 0) + 1;
			pending.push({ from, flat, content: migrated.content, ctx });
		}
	}

	for (const skill of pending) {
		const to = path.join(repoRoot, "skills", skill.flat);
		move(skill.from, to);
		writeFileSync(path.join(to, "SKILL.md"), skill.content);
	}

	for (const domain of listDirs(plugins)) {
		const sharedDir = path.join(plugins, domain, "shared");
		const entries = isDir(sharedDir) ? readdirSync(sharedDir).sort() : [];
		for (const entry of entries) {
			const from = path.join(sharedDir, entry);
			const link = new RegExp(`\`references/${entry.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}[\`/]`);
			const readers = pending.filter((s) => s.ctx.domain === domain && link.test(s.content));
			if (ORPHANS.has(`${domain}/${entry}`) || readers.length === 0) {
				deleted.push(...(isDir(from) ? filesUnder(repoRoot, rel(from)) : [rel(from)]));
				rmSync(from, { recursive: true, force: true });
			} else {
				const to =
					readers.length === 1
						? path.join(repoRoot, "skills", readers[0].flat, "references", entry)
						: path.join(repoRoot, "references", flatDomain(domain), entry);
				move(from, to);
				for (const file of isDir(to) ? filesUnder(to, ".").map((f) => path.join(to, f)) : [to]) {
					const text = readFileSync(file, "utf-8");
					const next = rewriteSkillRefs(rewriteArtifactPaths(text));
					if (next === text) continue;
					writeFileSync(file, next);
					rewrites["reference-files"] = (rewrites["reference-files"] ?? 0) + 1;
				}
			}
		}
	}

	for (const domain of listDirs(plugins)) {
		const evalsDir = path.join(plugins, domain, "evals");
		for (const skill of listDirs(evalsDir)) {
			const from = path.join(evalsDir, skill);
			if (DELETED_SKILLS.has(`${domain}/${skill}`)) continue; // deleted with the rest below
			move(from, path.join(repoRoot, "evals", flatName(domain, skill)));
		}
	}

	if (isDir(plugins)) {
		deleted.push(...filesUnder(repoRoot, "plugins"));
		rmSync(plugins, { recursive: true, force: true });
	}
	return { moved: pending.length, deleted, rewrites };
}

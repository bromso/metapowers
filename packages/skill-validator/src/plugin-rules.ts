import { existsSync } from "node:fs";
import path from "node:path";
import { globSync } from "glob";
import { type ParsedSkill, domainOf } from "./parse-skill.js";
import type { ValidationIssue } from "./rules.js";
import { type Workflow, loadWorkflows } from "./workflows.js";

export interface PackContext {
	skillNames: string[]; // directory names under skills/, sorted
	workflows: Workflow[]; // workflows/*.yml
	/** `<folder>/<artifact>` → member skills, for each workflow phase file written by ≥ 2 skills. */
	multiWriterFiles: Map<string, string[]>;
	/**
	 * Reference docs, relative to the pack root: `references/<domain>/<path>` (canonical) and
	 * `skills/<name>/references/<path>` (per skill), sorted.
	 */
	referenceFiles: string[];
}

/** Phase files (not folder artifacts) that two or more skills of one phase write into. */
function computeMultiWriterFiles(workflows: Workflow[]): Map<string, string[]> {
	const files = new Map<string, string[]>();
	for (const wf of workflows) {
		for (const phase of wf.phases) {
			if (!phase.artifact || phase.artifact.endsWith("/") || phase.skills.length < 2) continue;
			const key = `${phase.folder ?? wf.folder}/${phase.artifact}`;
			files.set(key, [...new Set([...(files.get(key) ?? []), ...phase.skills])].sort());
		}
	}
	return files;
}

/** The pack at `packRoot`: `skills/<name>/SKILL.md`, `workflows/*.yml` and `references/`. */
export function buildPackContext(packRoot: string): PackContext {
	const root = path.resolve(packRoot);
	const workflowsDir = path.join(root, "workflows");
	const workflows = existsSync(workflowsDir) ? loadWorkflows(workflowsDir) : [];
	const skillNames = globSync("skills/*/SKILL.md", { cwd: root, posix: true })
		.map((file) => file.split("/")[1])
		.sort();
	const referenceFiles = globSync(["references/**/*", "skills/*/references/**/*"], {
		cwd: root,
		nodir: true,
		posix: true,
	}).sort();
	return {
		skillNames,
		workflows,
		multiWriterFiles: computeMultiWriterFiles(workflows),
		referenceFiles,
	};
}

/**
 * A write-target lead-in followed by a `.singularskills/` path in backticks.
 * Keep textually identical to WRITE_LINE in packages/pack-tools/src/phase-files.ts
 * (duplicated so the validator does not depend on pack-tools; pack-tools has a test
 * asserting the two sources are equal).
 */
export const WRITE_LINE =
	/(\*\*Write the [a-z ]+\*\* (?:to|— (?:write|save) to|— append to|by appending to)|\bWrite to) `(\.singularskills\/[^`]+)`/g;
const PROJECT_PATH = /^\.singularskills\/([^/]+)\/<project>\/(.+)$/;

type WriteTarget = { key: string; path: string; text: string };

/** `{ key, path, text }` for each write-target line in `content`, keyed `<folder>/<file>`. */
function writeTargets(content: string): WriteTarget[] {
	const targets: WriteTarget[] = [];
	for (const text of content.split("\n")) {
		for (const match of text.matchAll(WRITE_LINE)) {
			const parsed = PROJECT_PATH.exec(match[2]);
			if (parsed) targets.push({ key: `${parsed[1]}/${parsed[2]}`, path: match[2], text });
		}
	}
	return targets;
}

/**
 * The append wording for a multi-writer phase file, with `<path>`, `<title>` and `<phase>`
 * placeholders. Must equal `APPEND_TEMPLATE("<path>", "<title>", "<phase>")` in
 * packages/pack-tools/src/phase-files.ts (duplicated so the validator does not depend on
 * pack-tools; a pack-tools test asserts the two are equal).
 */
export const APPEND_TEMPLATE_TEXT =
	"**Write the artifact** — append to `<path>` under a `## <title>` section. Create the file with a `# <phase> — <project>` heading if it does not exist; if a `## <title>` section already exists, replace only that section.";

const escapeRegExp = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** APPEND_TEMPLATE_TEXT for `path`, with the title (the same both times) and phase label as wildcards. */
function appendTemplatePattern(path: string): RegExp {
	const [beforeTitle, betweenTitles, afterTitle] = escapeRegExp(
		APPEND_TEMPLATE_TEXT.replace("<path>", path),
	).split("<title>");
	const withTitle = `${beforeTitle}([^\`\\n]+)${betweenTitles}\\1${afterTitle}`;
	return new RegExp(withTitle.replace("<phase>", "[^`\\n]+"));
}

const INLINE_CODE = /`([^`\n]+)`/g;

function inlineCode(body: string): string[] {
	return Array.from(body.matchAll(INLINE_CODE), (m) => m[1].trim());
}

/** The skill's `metadata` block, or `{}` when it has none. */
function metadataOf(parsed: ParsedSkill): Record<string, unknown> {
	const metadata = parsed.frontmatter.metadata;
	return metadata && typeof metadata === "object" && !Array.isArray(metadata)
		? (metadata as Record<string, unknown>)
		: {};
}

const TOP_LEVEL_KEYS = new Set(["name", "description", "allowed-tools", "metadata"]);
const METADATA_KEYS = new Set([
	"argument-hint",
	"disable-model-invocation",
	"workflow",
	"phase",
	"artifact",
]);

function checkFrontmatterShape(parsed: ParsedSkill): ValidationIssue[] {
	const issues: ValidationIssue[] = [];
	const extra = Object.keys(parsed.frontmatter).filter((key) => !TOP_LEVEL_KEYS.has(key));
	if (extra.length > 0) {
		issues.push({
			rule: "frontmatter-shape",
			message: `Frontmatter has unknown top-level key(s) ${extra.join(", ")}; only ${[...TOP_LEVEL_KEYS].join(", ")} are allowed (argument-hint and disable-model-invocation go under \`metadata\`). Run \`pack-tools fix-frontmatter\`.`,
			severity: "error",
		});
	}
	const metadata = parsed.frontmatter.metadata;
	if (metadata !== undefined && (typeof metadata !== "object" || Array.isArray(metadata))) {
		issues.push({
			rule: "frontmatter-shape",
			message: "Frontmatter `metadata` must be a mapping.",
			severity: "error",
		});
	} else {
		const extraMeta = Object.keys(metadataOf(parsed)).filter((key) => !METADATA_KEYS.has(key));
		if (extraMeta.length > 0) {
			issues.push({
				rule: "frontmatter-shape",
				message: `Frontmatter \`metadata\` has unknown key(s) ${extraMeta.join(", ")}; only ${[...METADATA_KEYS].join(", ")} are allowed.`,
				severity: "error",
			});
		}
	}
	return issues;
}

/**
 * The standard Arguments paragraph (spec §6.5), with a `<workflow>` placeholder for the skill's
 * artifact folder; `<phase>` stays a literal placeholder. `standardArgsParagraph` MUST stay
 * identical to `ARGS_PARAGRAPH` in packages/pack-tools/src/args.ts for both slug rules —
 * equality tests there enforce it.
 */
export const STANDARD_ARGS_PARAGRAPH =
	'**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"<skill name>","workflow":"<workflow>","phase":<phase>,"project":"<project>","event":"skipped","artifact":"<artifact file>","note":"<reason or \\"none given\\">"}`.';

const FIRST_TOKEN_SENTENCE = "Take the first token as `<project>`";
const BASENAME_SENTENCE =
	"Derive `<project>` from the argument by taking its basename without extension";

export type SlugRule = "first-token" | "basename";

/** The standard Arguments paragraph for `workflow`, in the given slug-rule variant. */
export function standardArgsParagraph(workflow: string, rule: SlugRule): string {
	const text = STANDARD_ARGS_PARAGRAPH.replace("<workflow>", workflow);
	return rule === "basename" ? text.replace(FIRST_TOKEN_SENTENCE, BASENAME_SENTENCE) : text;
}

/** The run log every skill may append to (the Arguments paragraph names it). */
const RUN_LOG = ".singularskills/log.jsonl";
const SINGULAR_DOMAIN = "singular";

/**
 * Other domains' artifact folders a skill may read (never write). Every other
 * `.singularskills/<folder>/` reference outside the skill's own folder is an error.
 */
const CROSS_DOMAIN_READS: Record<string, string[]> = {
	coaching: ["accessibility", "branding", "design", "marketing"],
	branding: ["marketing"],
};

/** The skill's artifact folder: its workflow's folder for a phase member, else its domain. */
function ownFolder(parsed: ParsedSkill, ctx: PackContext): string {
	const workflow = metadataOf(parsed).workflow;
	return ctx.workflows.find((wf) => wf.name === workflow)?.folder ?? parsed.domain;
}

function checkArgsInPath(parsed: ParsedSkill): ValidationIssue[] {
	return inlineCode(parsed.body)
		.filter((span) => span.includes(".singularskills/") && span.includes("$ARGUMENTS"))
		.map((span) => ({
			rule: "no-args-in-path",
			message: `Path \`${span}\` contains $ARGUMENTS, which may include flags such as --skip-checks; use \`<project>\` instead.`,
			severity: "error" as const,
		}));
}

/**
 * The project's former name, spelled in two parts so this detector does not itself trip the
 * repo's rename check (`pack-tools check-rename`).
 */
export const LEGACY_NAME = ["meta", "powers"].join("");

const LEGACY_ROOT = new RegExp(`[^\\s\`]*\\.${LEGACY_NAME}\\/[^\\s\`]*`, "g");

function checkArtifactRoot(parsed: ParsedSkill, ctx: PackContext): ValidationIssue[] {
	const legacy = [...new Set(Array.from(parsed.body.matchAll(LEGACY_ROOT), (m) => m[0]))].map(
		(span) => ({
			rule: "artifact-root",
			message: `Path \`${span}\` uses the legacy artifact root \`.${LEGACY_NAME}/\`; use \`.singularskills/\`.`,
			severity: "error" as const,
		}),
	);
	if (parsed.domain === SINGULAR_DOMAIN) return legacy;
	const folder = ownFolder(parsed, ctx);
	const allowed = [folder, ...(CROSS_DOMAIN_READS[parsed.domain] ?? [])].map(
		(name) => `.singularskills/${name}/`,
	);
	const outside = inlineCode(parsed.body)
		.filter((span) => span.startsWith(".singularskills/") || span.startsWith(".project/"))
		.filter((span) => span !== RUN_LOG && !allowed.some((prefix) => span.startsWith(prefix)))
		.map((span) => ({
			rule: "artifact-root",
			message: `Path \`${span}\` is outside this skill's artifact folder; use \`.singularskills/${folder}/…\`.`,
			severity: "error" as const,
		}));
	return [...legacy, ...outside];
}

function hasArgsParagraph(parsed: ParsedSkill): boolean {
	const variants: SlugRule[] = ["first-token", "basename"];
	return variants.some((rule) => parsed.body.includes(standardArgsParagraph(parsed.domain, rule)));
}

function checkSkipChecks(parsed: ParsedSkill): ValidationIssue[] {
	if (!parsed.body.includes("--skip-checks")) return [];
	if (hasArgsParagraph(parsed)) return [];
	return [
		{
			rule: "skip-checks-standard",
			message: `Skill mentions --skip-checks but lacks the standard Arguments paragraph for "${parsed.domain}"; run \`pack-tools fix-args\`.`,
			severity: "error",
		},
	];
}

/**
 * A `/<flat-name>` slash command: at the start of a line or after whitespace, `(` or a backtick,
 * and not followed by another path segment or a `:`. Only tokens that start with a known
 * domain (`<domain>-…`) are taken as skill references.
 */
const FLAT_REF = /(?<=^|[\s(`])\/([a-z][a-z0-9-]*)(?![\w/:-])/gm;
/** The old `/<domain>:<skill>` form; a skill-like token must follow the colon directly. */
const LEGACY_REF = /\/([a-zA-Z][a-zA-Z0-9-]*):([a-zA-Z][a-zA-Z0-9-]*)/g;
/** The legacy plugin of the `singular` domain. */
const LEGACY_SINGULAR = LEGACY_NAME;

function checkSkillRefExists(parsed: ParsedSkill, ctx: PackContext): ValidationIssue[] {
	const issues: ValidationIssue[] = [];
	const seen = new Set<string>();
	const domains = new Set(ctx.skillNames.map(domainOf));
	const skills = new Set(ctx.skillNames);
	const description = String(parsed.frontmatter.description ?? "");
	const texts = [description, parsed.body];

	for (const [ref, domain, skill] of texts.flatMap((text) => [...text.matchAll(LEGACY_REF)])) {
		if (!domains.has(domain) && domain !== LEGACY_SINGULAR) continue;
		if (seen.has(ref)) continue;
		seen.add(ref);
		const flat = `${domain === LEGACY_SINGULAR ? SINGULAR_DOMAIN : domain}-${skill}`;
		issues.push({
			rule: "skill-ref-exists",
			message: `\`${ref}\` is a legacy skill reference; use the flat name \`/${flat}\`.`,
			severity: "error",
		});
	}

	for (const [, name] of texts.flatMap((text) => [...text.matchAll(FLAT_REF)])) {
		if (skills.has(name) || !domains.has(domainOf(name)) || !name.includes("-")) continue;
		if (seen.has(name)) continue;
		seen.add(name);
		const suggestion = ctx.skillNames.find((skill) => skill.startsWith(name));
		const suggestionNote = suggestion ? ` Did you mean \`/${suggestion}\`?` : "";
		issues.push({
			rule: "skill-ref-exists",
			message: `Reference \`/${name}\` does not match any skill in the pack.${suggestionNote}`,
			severity: "error",
		});
	}

	return issues;
}

const REFERENCE = /^references\/(.+)$/;

function referenceExists(file: string, ctx: PackContext): boolean {
	const dirPrefix = file.endsWith("/") ? file : `${file}/`;
	return ctx.referenceFiles.some((ref) => ref === file || ref.startsWith(dirPrefix));
}

function checkReferences(parsed: ParsedSkill, ctx: PackContext): ValidationIssue[] {
	const issues: ValidationIssue[] = [];
	const seen = new Set<string>();
	for (const span of inlineCode(parsed.body)) {
		const match = REFERENCE.exec(span);
		if (!match) continue;
		const relPath = match[1].split("#")[0];
		if (seen.has(relPath)) continue;
		seen.add(relPath);
		const own = `skills/${parsed.name}/references/${relPath}`;
		const canonical = `references/${parsed.domain}/${relPath}`;
		if (referenceExists(own, ctx) || referenceExists(canonical, ctx)) continue;
		issues.push({
			rule: "reference-resolvable",
			message: `Reference \`${span}\` does not resolve: neither \`${own}\` nor \`${canonical}\` exists.`,
			severity: "error",
		});
	}
	return issues;
}

function checkPhaseFileAppend(parsed: ParsedSkill, ctx: PackContext): ValidationIssue[] {
	return writeTargets(parsed.body)
		.filter(({ key }) => ctx.multiWriterFiles.has(key))
		.filter(({ path, text }) => !appendTemplatePattern(path).test(text))
		.map(({ key }) => ({
			rule: "phase-file-append",
			message: `\`${key}\` is written by several skills of one workflow phase (${ctx.multiWriterFiles.get(key)?.join(", ")}); this skill must append under its own \`## <Title>\` section (creating the file if missing and replacing only that section) instead of overwriting it. Run \`pack-tools fix-phase-files\`.`,
			severity: "error" as const,
		}));
}

const SKILL_NAME = /^[a-z0-9-]{1,64}$/;

function checkNameMatchesDir(parsed: ParsedSkill): ValidationIssue[] {
	const name = parsed.frontmatter.name;
	if (typeof name === "string" && name === parsed.name && SKILL_NAME.test(name)) return [];
	return [
		{
			rule: "name-matches-dir",
			message: `Frontmatter \`name\` must equal the skill directory "${parsed.name}" (lowercase letters, digits and hyphens, at most 64 chars); found ${name === undefined ? "none" : JSON.stringify(name)}. Run \`pack-tools fix-frontmatter\`.`,
			severity: "error",
		},
	];
}

function checkArgumentHint(parsed: ParsedSkill): ValidationIssue[] {
	if (!hasArgsParagraph(parsed)) return [];
	const hint = metadataOf(parsed)["argument-hint"];
	if (typeof hint === "string" && hint.trim().length > 0) return [];
	return [
		{
			rule: "argument-hint-present",
			message:
				"Skill has the standard Arguments paragraph but no `metadata.argument-hint` in its frontmatter; run `pack-tools fix-frontmatter`.",
			severity: "error",
		},
	];
}

/** Canonical order of the leading frontmatter keys; any other key follows them. */
export const FRONTMATTER_KEY_ORDER = ["name", "description"];
const TOP_LEVEL_KEY = /^([A-Za-z0-9_-]+)\s*:/;

function checkFrontmatterKeyOrder(parsed: ParsedSkill): ValidationIssue[] {
	const keys = parsed.rawFrontmatter
		.split("\n")
		.map((line) => TOP_LEVEL_KEY.exec(line)?.[1])
		.filter((key): key is string => key !== undefined);
	const present = FRONTMATTER_KEY_ORDER.filter((key) => keys.includes(key));
	if (keys.slice(0, present.length).join() === present.join()) return [];
	return [
		{
			rule: "frontmatter-key-order",
			message: `Frontmatter keys should start with ${present.join(", ")} in that order (found ${keys.join(", ")}); run \`pack-tools fix-frontmatter\`.`,
			severity: "warning",
		},
	];
}

/**
 * Disclaimer wording per group (spec §5). These copies MUST stay identical to
 * DISCLAIMER, DISCLAIMER_INSTRUCTION and DISCLAIMER_PLUGINS in
 * packages/pack-tools/src/content-blocks.ts — equality tests there enforce it.
 */
export const DISCLAIMER_TEXT = {
	money:
		"> **Not financial or tax advice.** This artifact is generated analysis for review by a qualified accountant or financial professional before any filing, reporting or decision relies on it.",
	compliance:
		"> **Not legal or audit advice.** This artifact supports preparation for compliance work; certification, attestation and regulatory conclusions require a qualified auditor or counsel.",
	security:
		"> **Not a penetration test or audit.** This artifact is generated analysis; validate findings against the live system and have material controls reviewed by a qualified security professional.",
} as const;

export const DISCLAIMER_INSTRUCTION = "End the artifact with this paragraph, verbatim:";

/** Domain → disclaimer group. */
export const DISCLAIMER_GROUPS: Record<string, keyof typeof DISCLAIMER_TEXT> = {
	finance: "money",
	accounting: "money",
	bookkeeping: "money",
	compliance: "compliance",
	security: "security",
};

/** Spec §5; must equal COMPUTE_PARAGRAPH in packages/pack-tools/src/content-blocks.ts. */
export const COMPUTE_WITH_CODE_PARAGRAPH =
	"**Compute with code.** Perform every calculation (totals, balances, ratios, variances, projections) with a script — Bash, Python or a spreadsheet formula written to a file — and include the computation alongside the result. Never do arithmetic mentally.";

export const COMPUTE_WITH_CODE_PLUGINS = new Set(["finance", "accounting", "bookkeeping"]);

const FENCE = /^\s*(```|~~~)/;

/**
 * The lines of the `## Output` section (excluding its heading), up to the next
 * `## ` heading or the end; headings inside fenced code are ignored. Undefined
 * when the skill has no `## Output` section.
 */
export function outputSectionLines(body: string): string[] | undefined {
	const lines = body.split("\n");
	let inFence = false;
	let start = -1;
	for (let i = 0; i < lines.length; i++) {
		if (FENCE.test(lines[i])) inFence = !inFence;
		if (inFence || !lines[i].startsWith("## ")) continue;
		if (start >= 0) return lines.slice(start, i);
		if (/^## Output\s*$/.test(lines[i])) start = i + 1;
	}
	return start >= 0 ? lines.slice(start) : undefined;
}

function checkDisclaimer(parsed: ParsedSkill): ValidationIssue[] {
	const group = DISCLAIMER_GROUPS[parsed.domain];
	if (!group) return [];
	const section = outputSectionLines(parsed.body);
	const tail = (section ?? []).filter((line) => line.trim() !== "").slice(-2);
	const ok =
		section !== undefined &&
		tail[0] === DISCLAIMER_INSTRUCTION &&
		tail[1] === DISCLAIMER_TEXT[group] &&
		section.join("\n").includes(`${DISCLAIMER_INSTRUCTION}\n\n${DISCLAIMER_TEXT[group]}`);
	if (ok) return [];
	return [
		{
			rule: "disclaimer-present",
			message: `The \`## Output\` section must end with "${DISCLAIMER_INSTRUCTION}" followed by the ${group} disclaimer blockquote; run \`pack-tools fix-disclaimer\`.`,
			severity: "error",
		},
	];
}

function checkComputeWithCode(parsed: ParsedSkill): ValidationIssue[] {
	if (!COMPUTE_WITH_CODE_PLUGINS.has(parsed.domain)) return [];
	if (parsed.body.includes(COMPUTE_WITH_CODE_PARAGRAPH)) return [];
	return [
		{
			rule: "compute-with-code-present",
			message:
				"Money skills must include the standard **Compute with code.** paragraph; run `pack-tools fix-compute`.",
			severity: "error",
		},
	];
}

export function validatePackSkill(parsed: ParsedSkill, ctx: PackContext): ValidationIssue[] {
	return [
		...checkFrontmatterShape(parsed),
		...checkDisclaimer(parsed),
		...checkComputeWithCode(parsed),
		...checkNameMatchesDir(parsed),
		...checkArgumentHint(parsed),
		...checkFrontmatterKeyOrder(parsed),
		...checkReferences(parsed, ctx),
		...checkArgsInPath(parsed),
		...checkArtifactRoot(parsed, ctx),
		...checkSkipChecks(parsed),
		...checkSkillRefExists(parsed, ctx),
		...checkPhaseFileAppend(parsed, ctx),
	];
}

/**
 * Checks only slash-command references. Used for reference docs (`references/**\/*.md`),
 * which aren't skills and shouldn't be run through the other skill-shaped rules.
 */
export function validateSkillRefs(parsed: ParsedSkill, ctx: PackContext): ValidationIssue[] {
	return checkSkillRefExists(parsed, ctx);
}

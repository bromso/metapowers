import { parse } from "yaml";

export type SlugRule = "first-token" | "basename";

/** Domains whose argument is a file path; the project slug is its basename. */
export const BASENAME_DOMAINS = new Set(["coaching"]);

const FIRST_TOKEN_SENTENCE = "Take the first token as `<project>`";
const BASENAME_SENTENCE =
	"Derive `<project>` from the argument by taking its basename without extension";

/**
 * The values a skill's `skipped` line carries literally (spec §6.5): its flat name, its phase
 * (`null` for a utility) and the artifact it writes. A field left out stays a placeholder
 * (`<skill name>`, `<phase>`, `<artifact file>`).
 */
export type LogFields = { skill?: string; phase?: number | null; artifact?: string };

/**
 * The standard Arguments paragraph (spec §6.5): a `--skip-checks` bypass is a `skipped` line in
 * the run log, with `workflow` filled in (the skill's domain, which names its workflow and its
 * artifact folder) and the skill, phase and artifact filled in from `fields`. Must match
 * `standardArgsParagraph` in @singularskills/skill-validator (enforced by a test).
 */
export const ARGS_PARAGRAPH = (
	workflow: string,
	slugRule: SlugRule,
	fields: LogFields = {},
): string => {
	const skill = fields.skill ?? "<skill name>";
	const phase = fields.phase === undefined ? "<phase>" : String(fields.phase);
	const artifact = fields.artifact ?? "<artifact file>";
	const text = `**Arguments.** \`$ARGUMENTS\` may contain the project name and optional flags. ${FIRST_TOKEN_SENTENCE} and treat \`--skip-checks\` as a flag; never include flags in file paths. All paths below use \`<project>\`. If \`--skip-checks\` is present, skip the prerequisite check and, **before writing any artifact**, append one line to \`.singularskills/log.jsonl\`: \`{"ts":"<ISO timestamp>","skill":"${skill}","workflow":"${workflow}","phase":${phase},"project":"<project>","event":"skipped","artifact":"${artifact}","note":"<reason or \\"none given\\">"}\`.`;
	return slugRule === "basename" ? text.replace(FIRST_TOKEN_SENTENCE, BASENAME_SENTENCE) : text;
};

const FRONTMATTER_BLOCK = /^---\n([\s\S]*?)\n---(?=\n|$)/;

/**
 * The literal log fields of skill `name` whose SKILL.md is `content`: a phase member (with
 * `metadata.workflow`) gets its `metadata.phase` and `metadata.artifact`, a utility `null` and
 * the artifact placeholder. Without `name`, every field stays a placeholder.
 */
export function logFields(content: string, name?: string): LogFields {
	if (name === undefined) return {};
	const block = FRONTMATTER_BLOCK.exec(content)?.[1] ?? "";
	let metadata: Record<string, unknown> = {};
	try {
		const parsed = parse(block) as { metadata?: Record<string, unknown> } | null;
		if (parsed?.metadata && typeof parsed.metadata === "object") metadata = parsed.metadata;
	} catch {
		metadata = {};
	}
	if (metadata.workflow === undefined) return { skill: name, phase: null };
	return {
		skill: name,
		phase: typeof metadata.phase === "number" ? metadata.phase : undefined,
		artifact: typeof metadata.artifact === "string" ? metadata.artifact : undefined,
	};
}

/** The opening of every Arguments paragraph, old or new. */
const ARGS_LINE = /^\*\*Arguments\.\*\* `\$ARGUMENTS` may contain the project name/;

/**
 * The slug rule of the content's Arguments paragraph (whatever its log fields say), or
 * `undefined` when it has none.
 */
export function argsSlugRule(content: string): SlugRule | undefined {
	const line = content.split("\n").find((candidate) => ARGS_LINE.test(candidate));
	if (line === undefined) return undefined;
	return line.includes(BASENAME_SENTENCE) ? "basename" : "first-token";
}

/**
 * Replace every Arguments paragraph line (e.g. the old `skip-log.md` one) with the standard
 * paragraph for `workflow` and `fields`, keeping its slug rule. Content without one is unchanged.
 */
export function replaceArgsParagraph(
	content: string,
	workflow: string,
	fields: LogFields = {},
): string {
	return content
		.split("\n")
		.map((line) =>
			ARGS_LINE.test(line)
				? ARGS_PARAGRAPH(
						workflow,
						line.includes(BASENAME_SENTENCE) ? "basename" : "first-token",
						fields,
					)
				: line,
		)
		.join("\n");
}

// Whole-line legacy skip-checks sentences. The first covers both
// "…skip this check and log to `…skip-log.md`." and "…skip this check."
// (plus design/prototype's "…skip the ideation check and log to …").
const LEGACY_SKIP_LINES = [
	/^If `--skip-checks` is present in \$ARGUMENTS, skip /,
	/^If the user passes `--skip-checks`/,
];

// A backticked artifact path that still embeds $ARGUMENTS.
const ARGS_IN_PATH = /`[^`\n]*(?:\.singularskills\/|\.project\/)[^`\n]*\$ARGUMENTS[^`\n]*`/;
const INLINE_CODE = /`[^`\n]*`/g;
const FIRST_H2 = /^## /m;

function removeLegacySkipLines(content: string): string {
	const lines = content.split("\n");
	const kept: string[] = [];
	for (let i = 0; i < lines.length; i++) {
		if (LEGACY_SKIP_LINES.some((re) => re.test(lines[i]))) {
			// Collapse the blank line the sentence leaves behind.
			if ((kept.length === 0 || kept[kept.length - 1] === "") && lines[i + 1] === "") i++;
			continue;
		}
		kept.push(lines[i]);
	}
	return kept.join("\n");
}

function replaceArgs(text: string, slugRule: SlugRule): string {
	if (slugRule === "first-token") return text.replaceAll("$ARGUMENTS", "<project>");
	// Basename skills: the argument is a file path, so prose keeps "$ARGUMENTS";
	// only artifact paths switch to the sanitised <project> slug.
	return text.replace(INLINE_CODE, (span) =>
		span.includes(".singularskills/") ? span.replaceAll("$ARGUMENTS", "<project>") : span,
	);
}

/**
 * Standardise how a skill handles `$ARGUMENTS` (spec §6): PM artifacts move under
 * `.singularskills/project-management/`, legacy skip-checks sentences are removed, an
 * outdated Arguments paragraph is replaced, the standard Arguments paragraph is inserted
 * before the first H2, and `$ARGUMENTS` after it becomes `<project>`. Skills that neither
 * mention `--skip-checks` nor use `$ARGUMENTS` in an artifact path (free-text and
 * no-argument skills) are returned unchanged. With `name`, the paragraph's `skipped` line
 * carries the skill's literal log fields (see `logFields`). Idempotent.
 */
export function standardizeArgs(content: string, domain: string, name?: string): string {
	if (!content.includes("$ARGUMENTS")) return content;

	let out = content;
	if (domain === "project-management") {
		out = out.replaceAll(".project/", ".singularskills/project-management/");
	}
	if (!out.includes("--skip-checks") && !ARGS_IN_PATH.test(out)) return content;

	const slugRule: SlugRule = BASENAME_DOMAINS.has(domain) ? "basename" : "first-token";
	const fields = logFields(content, name);
	const paragraph = ARGS_PARAGRAPH(domain, slugRule, fields);
	out = replaceArgsParagraph(removeLegacySkipLines(out), domain, fields);

	let at = out.indexOf(paragraph);
	if (at < 0) {
		const h2 = out.search(FIRST_H2);
		if (h2 < 0) return out;
		const head = `${out.slice(0, h2).replace(/\n*$/, "")}\n\n`;
		out = `${head}${paragraph}\n\n${out.slice(h2)}`;
		at = head.length;
	}
	const split = at + paragraph.length;
	return out.slice(0, split) + replaceArgs(out.slice(split), slugRule);
}

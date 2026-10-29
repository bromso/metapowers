export type SlugRule = "first-token" | "basename";

/** Domains whose argument is a file path; the project slug is its basename. */
export const BASENAME_DOMAINS = new Set(["coaching"]);

const FIRST_TOKEN_SENTENCE = "Take the first token as `<project>`";
const BASENAME_SENTENCE =
	"Derive `<project>` from the argument by taking its basename without extension";

/**
 * The standard Arguments paragraph (spec §6.5): a `--skip-checks` bypass is a `skipped` line in
 * the run log, with `workflow` filled in (the skill's domain, which names its workflow and its
 * artifact folder). Must match STANDARD_ARGS_PARAGRAPH in @singularskills/skill-validator
 * (enforced by a test, re-enabled in Task 4).
 */
export const ARGS_PARAGRAPH = (workflow: string, slugRule: SlugRule): string => {
	const text = `**Arguments.** \`$ARGUMENTS\` may contain the project name and optional flags. ${FIRST_TOKEN_SENTENCE} and treat \`--skip-checks\` as a flag; never include flags in file paths. All paths below use \`<project>\`. If \`--skip-checks\` is present, skip the prerequisite check and, **before writing any artifact**, append one line to \`.singularskills/log.jsonl\`: \`{"ts":"<ISO timestamp>","skill":"<skill name>","workflow":"${workflow}","phase":<phase>,"project":"<project>","event":"skipped","artifact":"<artifact file>","note":"<reason or \\"none given\\">"}\`.`;
	return slugRule === "basename" ? text.replace(FIRST_TOKEN_SENTENCE, BASENAME_SENTENCE) : text;
};

/** The opening of every Arguments paragraph, old or new. */
const ARGS_LINE = /^\*\*Arguments\.\*\* `\$ARGUMENTS` may contain the project name/;

/**
 * Replace every Arguments paragraph line (e.g. the old `skip-log.md` one) with the standard
 * paragraph for `workflow`, keeping its slug rule. Content without one is unchanged.
 */
export function replaceArgsParagraph(content: string, workflow: string): string {
	return content
		.split("\n")
		.map((line) =>
			ARGS_LINE.test(line)
				? ARGS_PARAGRAPH(workflow, line.includes(BASENAME_SENTENCE) ? "basename" : "first-token")
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
 * no-argument skills) are returned unchanged. Idempotent.
 */
export function standardizeArgs(content: string, domain: string): string {
	if (!content.includes("$ARGUMENTS")) return content;

	let out = content;
	if (domain === "project-management") {
		out = out.replaceAll(".project/", ".singularskills/project-management/");
	}
	if (!out.includes("--skip-checks") && !ARGS_IN_PATH.test(out)) return content;

	const slugRule: SlugRule = BASENAME_DOMAINS.has(domain) ? "basename" : "first-token";
	const paragraph = ARGS_PARAGRAPH(domain, slugRule);
	out = replaceArgsParagraph(removeLegacySkipLines(out), domain);

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

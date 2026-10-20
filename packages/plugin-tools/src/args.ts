export type SlugRule = "first-token" | "basename";

/** Plugins whose argument is a file path; the project slug is its basename. */
export const BASENAME_PLUGINS = new Set(["coaching"]);

const FIRST_TOKEN_SENTENCE = "Take the first token as `<project>`";
const BASENAME_SENTENCE =
	"Derive `<project>` from the argument by taking its basename without extension";

/**
 * The standard Arguments paragraph (spec §6). Must match
 * STANDARD_ARGS_PARAGRAPH in @metapowers/skill-validator (enforced by a test).
 */
export const ARGS_PARAGRAPH = (domain: string, slugRule: SlugRule): string => {
	const text = `**Arguments.** \`$ARGUMENTS\` may contain the project name and optional flags. ${FIRST_TOKEN_SENTENCE} and treat \`--skip-checks\` as a flag; never include flags in file paths. All paths below use \`<project>\`. If \`--skip-checks\` is present, skip the prerequisite check and, **before writing any artifact**, append one line to \`.metapowers/${domain}/<project>/skip-log.md\`: \`- <ISO timestamp> — <skill name> skipped prerequisite check for <artifact file> — reason: <reason or "none given">\`.`;
	return slugRule === "basename" ? text.replace(FIRST_TOKEN_SENTENCE, BASENAME_SENTENCE) : text;
};

// Whole-line legacy skip-checks sentences. The first covers both
// "…skip this check and log to `…skip-log.md`." and "…skip this check."
// (plus design/prototype's "…skip the ideation check and log to …").
const LEGACY_SKIP_LINES = [
	/^If `--skip-checks` is present in \$ARGUMENTS, skip /,
	/^If the user passes `--skip-checks`/,
];

// A backticked artifact path that still embeds $ARGUMENTS.
const ARGS_IN_PATH = /`[^`\n]*(?:\.metapowers\/|\.project\/)[^`\n]*\$ARGUMENTS[^`\n]*`/;
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
		span.includes(".metapowers/") ? span.replaceAll("$ARGUMENTS", "<project>") : span,
	);
}

/**
 * Standardise how a skill handles `$ARGUMENTS` (spec §6): PM artifacts move under
 * `.metapowers/project-management/`, legacy skip-checks sentences are removed,
 * the standard Arguments paragraph is inserted before the first H2, and
 * `$ARGUMENTS` after it becomes `<project>`. Skills that neither mention
 * `--skip-checks` nor use `$ARGUMENTS` in an artifact path (free-text and
 * no-argument skills) are returned unchanged. Idempotent.
 */
export function standardizeArgs(content: string, plugin: string): string {
	if (!content.includes("$ARGUMENTS")) return content;

	let out = content;
	if (plugin === "project-management") {
		out = out.replaceAll(".project/", ".metapowers/project-management/");
	}
	if (!out.includes("--skip-checks") && !ARGS_IN_PATH.test(out)) return content;

	const slugRule: SlugRule = BASENAME_PLUGINS.has(plugin) ? "basename" : "first-token";
	const paragraph = ARGS_PARAGRAPH(plugin, slugRule);
	out = removeLegacySkipLines(out);

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

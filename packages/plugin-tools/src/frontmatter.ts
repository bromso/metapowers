import { type SlugRule, standardArgsParagraph } from "@metapowers/skill-validator";

/** `argument-hint` for skills whose Arguments paragraph takes the first token as the project. */
export const SLUG_HINT = "[project] [--skip-checks]";
/** `argument-hint` for skills whose Arguments paragraph derives the project from a file basename. */
export const BASENAME_HINT = "<file-or-topic> [--skip-checks]";

/** Hand-written hints for skills that take free text instead of a project (spec §2). */
export const FREE_TEXT_HINTS: Record<string, string> = {
	"metapowers/find-skill": "<topic>",
	"metapowers/create-skill": "<topic>",
	"metapowers/improve-skill": "<skill-name>",
	"metapowers/workflow": "<workflow-name>",
	"development/debug": "<symptom or error>",
	"development/ship": "[project]",
	"accessibility/checklist": "<component or page>",
	"branding/audit": "<brand or URL>",
};

/** Skills that download or write files outside `.metapowers/`; Claude must not auto-invoke them. */
export const MODEL_INVOCATION_DISABLED = new Set([
	"metapowers/find-skill",
	"metapowers/create-skill",
	"metapowers/improve-skill",
	"metapowers/init",
]);

/** The keys this fixer owns, in canonical order; every other key follows them. */
const OWNED_KEYS = ["name", "description", "argument-hint", "disable-model-invocation"];

const FRONTMATTER = /^---\n([\s\S]*?)\n---(?=\n|$)/;
const TOP_LEVEL_KEY = /^([A-Za-z0-9_-]+)\s*:/;

/** Splits raw frontmatter into `[key, text]` blocks: a top-level key line plus its continuation lines. */
function splitBlocks(raw: string): [string | undefined, string][] {
	const blocks: [string | undefined, string][] = [];
	for (const line of raw.split("\n")) {
		const key = TOP_LEVEL_KEY.exec(line)?.[1];
		if (key !== undefined || blocks.length === 0) blocks.push([key, line]);
		else blocks[blocks.length - 1][1] += `\n${line}`;
	}
	return blocks;
}

function argumentHint(content: string, plugin: string, skill: string): string | undefined {
	const rules: [SlugRule, string][] = [
		["first-token", SLUG_HINT],
		["basename", BASENAME_HINT],
	];
	for (const [rule, hint] of rules) {
		if (content.includes(standardArgsParagraph(plugin, rule))) return hint;
	}
	return FREE_TEXT_HINTS[`${plugin}/${skill}`];
}

/**
 * Normalise a skill's frontmatter (spec §2): `name` is the skill directory,
 * `argument-hint` follows the Arguments-paragraph variant (or the free-text
 * table), `disable-model-invocation: true` only on the meta-skills that write
 * outside `.metapowers/`. Keys are ordered `name, description, argument-hint,
 * disable-model-invocation`, then any other keys in their original order.
 * Existing key text (e.g. the description) is kept verbatim and the body is
 * untouched. A skill with no hint keeps any `argument-hint` it already has.
 * Content without frontmatter is returned unchanged. Idempotent.
 */
export function fixFrontmatter(content: string, plugin: string, skill: string): string {
	const match = FRONTMATTER.exec(content);
	if (!match) return content;

	const blocks = splitBlocks(match[1]);
	const existing = (key: string) => blocks.find(([k]) => k === key)?.[1];

	const hint = argumentHint(content.slice(match[0].length), plugin, skill);
	const owned: (string | undefined)[] = [
		`name: ${skill}`,
		existing("description"),
		hint !== undefined ? `argument-hint: ${JSON.stringify(hint)}` : existing("argument-hint"),
		MODEL_INVOCATION_DISABLED.has(`${plugin}/${skill}`)
			? "disable-model-invocation: true"
			: undefined,
	];
	const others = blocks
		.filter(([key, text]) => !(key !== undefined && OWNED_KEYS.includes(key)) && text !== "")
		.map(([, text]) => text);

	const raw = [...owned.filter((text) => text !== undefined), ...others].join("\n");
	return `---\n${raw}\n---${content.slice(match[0].length)}`;
}

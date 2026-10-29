import { type SlugRule, argsSlugRule } from "./args.js";

/** `argument-hint` for skills whose Arguments paragraph takes the first token as the project. */
export const SLUG_HINT = "[project] [--skip-checks]";
/** `argument-hint` for skills whose Arguments paragraph derives the project from a file basename. */
export const BASENAME_HINT = "<file-or-topic> [--skip-checks]";

/** Hand-written hints for skills that take free text instead of a project (spec §2), by skill name. */
export const FREE_TEXT_HINTS: Record<string, string> = {
	"singular-find-skill": "<topic>",
	"singular-create-skill": "<topic>",
	"singular-improve-skill": "<skill-name>",
	workflow: "<workflow> <project>",
	"development-debug": "<symptom or error>",
	"development-ship": "[project]",
	"accessibility-checklist": "<component or page>",
	"branding-audit": "<brand or URL>",
};

/** Skills that download or write files outside `.singularskills/`; Claude must not auto-invoke them. */
export const MODEL_INVOCATION_DISABLED = new Set([
	"singular-find-skill",
	"singular-create-skill",
	"singular-improve-skill",
	"singular-init",
]);

/** Top-level keys placed by `renderFrontmatter` itself; every other key keeps its text. */
const PLACED_KEYS = [
	"name",
	"description",
	"metadata",
	"argument-hint",
	"disable-model-invocation",
];
/** `metadata` keys in canonical order (spec §6.1, §9); unknown ones follow in original order. */
const METADATA_ORDER = [
	"argument-hint",
	"disable-model-invocation",
	"workflow",
	"phase",
	"artifact",
];

const FRONTMATTER = /^---\n([\s\S]*?)\n---(?=\n|$)/;
const TOP_LEVEL_KEY = /^([A-Za-z0-9_-]+)\s*:/;
const NESTED_KEY = /^\s+([A-Za-z0-9_-]+):\s?(.*)$/;

/** A top-level key (undefined for leading stray lines) and its text: the key line plus continuations. */
export type FrontmatterBlock = [string | undefined, string];

/** Splits raw frontmatter (between the `---` lines) into top-level key blocks. */
export function parseFrontmatter(raw: string): FrontmatterBlock[] {
	const blocks: FrontmatterBlock[] = [];
	for (const line of raw.split("\n")) {
		const key = TOP_LEVEL_KEY.exec(line)?.[1];
		if (key !== undefined || blocks.length === 0) blocks.push([key, line]);
		else blocks[blocks.length - 1][1] += `\n${line}`;
	}
	return blocks;
}

/** The raw value text of a single-line top-level key, e.g. `"[project]"` for `argument-hint: "[project]"`. */
export function blockValue(blocks: FrontmatterBlock[], key: string): string | undefined {
	const text = blocks.find(([k]) => k === key)?.[1];
	return text === undefined ? undefined : text.slice(text.indexOf(":") + 1).trim();
}

/** The `metadata` block's entries as `[key, raw value]`, in file order. */
export function metadataEntries(blocks: FrontmatterBlock[]): [string, string][] {
	const text = blocks.find(([k]) => k === "metadata")?.[1];
	if (text === undefined) return [];
	return text
		.split("\n")
		.slice(1)
		.flatMap((line) => {
			const match = NESTED_KEY.exec(line);
			return match ? [[match[1], match[2]] as [string, string]] : [];
		});
}

/**
 * The frontmatter block (spec §6.1): `name`, the `description` text verbatim, any other
 * top-level keys verbatim in original order (e.g. `allowed-tools`), then `metadata` with
 * `entries` in canonical order. `metadata` is omitted when `entries` is empty.
 */
export function renderFrontmatter(
	name: string,
	blocks: FrontmatterBlock[],
	entries: [string, string][],
): string {
	const description = blocks.find(([k]) => k === "description")?.[1];
	const others = blocks
		.filter(([key, text]) => !(key !== undefined && PLACED_KEYS.includes(key)) && text !== "")
		.map(([, text]) => text);
	const rank = (key: string) => {
		const at = METADATA_ORDER.indexOf(key);
		return at < 0 ? METADATA_ORDER.length : at;
	};
	const sorted = [...entries].sort(([a], [b]) => rank(a) - rank(b));
	const metadata = sorted.length
		? [`metadata:\n${sorted.map(([key, value]) => `  ${key}: ${value}`).join("\n")}`]
		: [];
	const lines = [`name: ${name}`, ...(description ? [description] : []), ...others, ...metadata];
	return `---\n${lines.join("\n")}\n---`;
}

const HINTS: Record<SlugRule, string> = { "first-token": SLUG_HINT, basename: BASENAME_HINT };

function argumentHint(body: string, name: string): string | undefined {
	const rule = argsSlugRule(body);
	return rule ? HINTS[rule] : FREE_TEXT_HINTS[name];
}

/**
 * Normalise a skill's frontmatter (spec §6.1): `name` is the skill directory; `description`
 * and any other top-level key are kept verbatim; `metadata` holds `argument-hint` (from the
 * Arguments-paragraph variant or the free-text table), `disable-model-invocation: true` only
 * on the skills that write outside `.singularskills/`, then the workflow membership already
 * there. A top-level `argument-hint` or `disable-model-invocation` moves under `metadata`. A
 * skill with no computed hint keeps any hint it already has. The body is untouched. Content
 * without frontmatter is returned unchanged. Idempotent.
 */
export function fixFrontmatter(content: string, _domain: string, name: string): string {
	const match = FRONTMATTER.exec(content);
	if (!match) return content;

	const blocks = parseFrontmatter(match[1]);
	const existing = metadataEntries(blocks);
	const existingHint =
		existing.find(([key]) => key === "argument-hint")?.[1] ?? blockValue(blocks, "argument-hint");

	const computed = argumentHint(content.slice(match[0].length), name);
	const hint = computed !== undefined ? JSON.stringify(computed) : existingHint;
	const entries: [string, string][] = [
		...(hint !== undefined ? [["argument-hint", hint] as [string, string]] : []),
		...(MODEL_INVOCATION_DISABLED.has(name)
			? [["disable-model-invocation", "true"] as [string, string]]
			: []),
		...existing.filter(([key]) => key !== "argument-hint" && key !== "disable-model-invocation"),
	];
	return `${renderFrontmatter(name, blocks, entries)}${content.slice(match[0].length)}`;
}

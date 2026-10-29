import path from "node:path";
import matter from "gray-matter";

export interface ParsedSkill {
	filePath: string;
	/** The skill's directory name, e.g. `design-define-component`. */
	name: string;
	/** The domain the name starts with, e.g. `design` (see `domainOf`). */
	domain: string;
	frontmatter: Record<string, unknown>;
	/** The frontmatter text between the `---` fences, as written (empty if none). */
	rawFrontmatter: string;
	body: string;
	sections: string[];
	errors: string[];
}

/** Domains whose name contains a `-`, so the first `-` of a skill name is not the split. */
const HYPHENATED_DOMAINS = ["project-management"];

/**
 * The skill's domain: a hyphenated domain the name starts with, else the text before the first
 * `-`, or `"singular"` for a name with no `-`. Must agree with `domainOf` in
 * packages/pack-tools/src/skills.ts.
 */
export function domainOf(name: string): string {
	const hyphenated = HYPHENATED_DOMAINS.find((domain) => name.startsWith(`${domain}-`));
	if (hyphenated) return hyphenated;
	const dash = name.indexOf("-");
	return dash < 0 ? "singular" : name.slice(0, dash);
}

// gray-matter's `.matter` is lost on its cache hits, so read the fenced block directly.
const RAW_FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/;

export function parseSkill(content: string, filePath: string): ParsedSkill {
	const errors: string[] = [];

	let frontmatter: Record<string, unknown> = {};
	let body = content;
	let rawFrontmatter = "";

	try {
		const parsed = matter(content);
		if (Object.keys(parsed.data).length === 0 && !content.startsWith("---")) {
			errors.push("Missing frontmatter");
		} else {
			frontmatter = parsed.data;
			rawFrontmatter = RAW_FRONTMATTER.exec(content)?.[1] ?? "";
		}
		body = parsed.content;
	} catch {
		errors.push("Missing frontmatter");
	}

	const sections = Array.from(body.matchAll(/^(#{1,3}\s+.+)$/gm)).map((m) => m[1]);

	const name = path.basename(path.dirname(filePath));
	return {
		filePath,
		name,
		domain: domainOf(name),
		frontmatter,
		rawFrontmatter,
		body,
		sections,
		errors,
	};
}

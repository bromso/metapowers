import matter from "gray-matter";

export interface ParsedSkill {
	filePath: string;
	frontmatter: Record<string, unknown>;
	/** The frontmatter text between the `---` fences, as written (empty if none). */
	rawFrontmatter: string;
	body: string;
	sections: string[];
	errors: string[];
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

	return { filePath, frontmatter, rawFrontmatter, body, sections, errors };
}

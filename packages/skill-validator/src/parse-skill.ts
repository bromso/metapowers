import matter from "gray-matter";

export interface ParsedSkill {
	filePath: string;
	frontmatter: Record<string, unknown>;
	body: string;
	sections: string[];
	errors: string[];
}

export function parseSkill(content: string, filePath: string): ParsedSkill {
	const errors: string[] = [];

	let frontmatter: Record<string, unknown> = {};
	let body = content;

	try {
		const parsed = matter(content);
		if (Object.keys(parsed.data).length === 0 && !content.startsWith("---")) {
			errors.push("Missing frontmatter");
		} else {
			frontmatter = parsed.data;
		}
		body = parsed.content;
	} catch {
		errors.push("Missing frontmatter");
	}

	const sections = Array.from(body.matchAll(/^(#{1,3}\s+.+)$/gm)).map((m) => m[1]);

	return { filePath, frontmatter, body, sections, errors };
}

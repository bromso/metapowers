import { readFileSync } from "node:fs";
import { join } from "node:path";
import { expect, test } from "vitest";
import { agents } from "./agents";

const INSTALLATION = join(
	import.meta.dirname,
	"..",
	"content",
	"docs",
	"overview",
	"installation.mdx",
);

/** Fumadocs-style heading ids of the installation page's `##`/`###` headings. */
function headingIds(): string[] {
	return readFileSync(INSTALLATION, "utf8")
		.split("\n")
		.filter((line) => /^#{2,3} /.test(line))
		.map((line) =>
			line
				.replace(/^#+ /, "")
				.trim()
				.toLowerCase()
				.replace(/[^a-z0-9 -]/g, "")
				.replace(/ /g, "-"),
		);
}

test("seven Tier 1 agents in order, each with a bundled mark or wordmark", () => {
	expect(agents.map((a) => a.name)).toEqual([
		"Claude Code",
		"Codex",
		"OpenCode",
		"Cursor",
		"GitHub Copilot",
		"Gemini CLI",
		"Kimi Code CLI",
	]);
	for (const a of agents) {
		if (a.mark.kind === "svg") expect(a.mark.path).toMatch(/^M/);
		else expect(a.mark.text.trim()).not.toBe("");
	}
	expect(agents.find((a) => a.slug === "codex")?.mark.kind).toBe("wordmark");
});

test("every agent installs singularskills with a note, and Claude Code and Codex use their marketplaces", () => {
	for (const a of agents) {
		expect(a.install.command).toContain("singularskills");
		expect(a.install.note.trim()).not.toBe("");
	}
	const bySlug = Object.fromEntries(agents.map((a) => [a.slug, a]));
	expect(bySlug["claude-code"].install.command).toBe(
		"/plugin marketplace add bromso/singularskills",
	);
	expect(bySlug["claude-code"].install.note).toContain(
		"/plugin install singularskills@singularskills",
	);
	expect(bySlug.codex.install.command).toBe("codex plugin marketplace add bromso/singularskills");
	for (const slug of ["opencode", "cursor", "github-copilot", "gemini-cli", "kimi-code-cli"]) {
		expect(bySlug[slug].install.command).toMatch(
			/^npx skills add bromso\/singularskills --agent [a-z-]+$/,
		);
	}
});

test("every agent's guide link is a heading on the installation page", () => {
	const ids = headingIds();
	for (const a of agents) {
		expect(a.href).toBe(`/docs/overview/installation#${a.slug}`);
		expect(ids).toContain(a.slug);
	}
});

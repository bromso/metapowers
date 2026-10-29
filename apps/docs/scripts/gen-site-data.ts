import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join, relative, sep } from "node:path";
import { parse } from "yaml";

export type SiteData = {
	/** One entry per domain (the first segment of every skill name); key kept as `plugins` for pack-tools' counts check. */
	plugins: { slug: string; name: string; skills: number; hasEvals: boolean }[];
	workflows: { name: string; title: string; phases: number }[];
	totals: { skills: number; plugins: number; evalSuites: number; agents: 7 };
};

/** Domains whose name contains a `-`, so the first `-` of a skill name is not the split. */
const HYPHENATED_DOMAINS = ["project-management"];

/** A skill's domain (mirrors pack-tools): a hyphenated domain prefix, the text before the first `-`, or `singular` for a dashless name. */
export function domainOf(skill: string): string {
	const hyphenated = HYPHENATED_DOMAINS.find((domain) => skill.startsWith(`${domain}-`));
	if (hyphenated) return hyphenated;
	const dash = skill.indexOf("-");
	return dash < 0 ? "singular" : skill.slice(0, dash);
}

/** Skill folder names under `<packRoot>/skills` (folders holding a SKILL.md), sorted. */
function listSkills(packRoot: string): string[] {
	const skillsDir = join(packRoot, "skills");
	if (!existsSync(skillsDir)) {
		throw new Error(`No skills folder in the pack (expected ${skillsDir})`);
	}
	return readdirSync(skillsDir, { withFileTypes: true })
		.filter((entry) => entry.isDirectory() && existsSync(join(skillsDir, entry.name, "SKILL.md")))
		.map((entry) => entry.name)
		.sort();
}

/** `workflows/*.yml` as `{ name, title, phases }`, sorted by name. */
function listWorkflows(packRoot: string): SiteData["workflows"] {
	const dir = join(packRoot, "workflows");
	if (!existsSync(dir)) return [];
	return readdirSync(dir)
		.filter((file) => file.endsWith(".yml"))
		.map((file) => {
			const doc = parse(readFileSync(join(dir, file), "utf8")) as {
				name: string;
				title: string;
				phases?: unknown[];
			};
			return { name: doc.name, title: doc.title, phases: doc.phases?.length ?? 0 };
		})
		.sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
}

export function generateSiteData(packRoot: string): SiteData {
	const skills = listSkills(packRoot);
	const bySlug = new Map<string, string[]>();
	for (const skill of skills) {
		const domain = domainOf(skill);
		bySlug.set(domain, [...(bySlug.get(domain) ?? []), skill]);
	}

	const plugins = [...bySlug.keys()].sort().map((slug) => {
		const members = bySlug.get(slug) ?? [];
		return {
			slug,
			name: slug,
			skills: members.length,
			hasEvals: members.some((skill) => existsSync(join(packRoot, "evals", skill))),
		};
	});

	const totals = {
		skills: skills.length,
		plugins: plugins.length,
		evalSuites: plugins.filter((plugin) => plugin.hasEvals).length,
		agents: 7 as const,
	};

	return { plugins, workflows: listWorkflows(packRoot), totals };
}

/** Writes `json` to `outFile` (or, under `--check`, reports whether it already matches). */
function writeJson(json: string, outFile: string, check: boolean): number {
	if (check) {
		const existing = existsSync(outFile) ? readFileSync(outFile, "utf8") : null;
		return existing === json ? 0 : 1;
	}

	mkdirSync(dirname(outFile), { recursive: true });
	writeFileSync(outFile, json);
	return 0;
}

export function writeSiteData(packRoot: string, outFile: string, check: boolean): number {
	const data = generateSiteData(packRoot);
	return writeJson(`${JSON.stringify(data, null, "\t")}\n`, outFile, check);
}

/** Walks `dir` for `.mdx` files, sorted for stable output. */
function walkMdxFiles(dir: string): string[] {
	return readdirSync(dir, { withFileTypes: true })
		.flatMap((entry) => {
			const path = join(dir, entry.name);
			if (entry.isDirectory()) return walkMdxFiles(path);
			return entry.name.endsWith(".mdx") ? [path] : [];
		})
		.sort();
}

/** The frontmatter `command` value in `src` (plain or double-quoted YAML), if present. */
function readFrontmatterCommand(src: string): string | undefined {
	const lines = src.split("\n");
	if (lines[0] !== "---") return undefined;
	const end = lines.indexOf("---", 1);
	if (end < 0) return undefined;

	for (const line of lines.slice(1, end)) {
		if (!line.startsWith("command:")) continue;
		const raw = line.slice("command:".length).trim();
		if (raw.startsWith('"') && raw.endsWith('"')) {
			return raw.slice(1, -1).replace(/\\(.)/g, "$1");
		}
		return raw;
	}
	return undefined;
}

/** The docs URL for a content file: `/docs/<folder>/<basename>`; `index.mdx` → `/docs/<folder>`. */
function docsUrlForFile(contentDir: string, file: string): string {
	const rel = relative(contentDir, file)
		.split(sep)
		.join("/")
		.replace(/\.mdx$/, "");
	const parts = rel.split("/");
	if (parts[parts.length - 1] === "index") parts.pop();
	return `/docs/${parts.join("/")}`;
}

/** Maps each page's docs URL to its frontmatter `command`, for pages that declare one. */
export function generateSearchCommands(contentDir: string): Record<string, string> {
	const entries = walkMdxFiles(contentDir)
		.map(
			(file) =>
				[
					docsUrlForFile(contentDir, file),
					readFrontmatterCommand(readFileSync(file, "utf8")),
				] as const,
		)
		.filter((entry): entry is [string, string] => entry[1] !== undefined)
		.sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));

	return Object.fromEntries(entries);
}

export function writeSearchCommands(contentDir: string, outFile: string, check: boolean): number {
	const data = generateSearchCommands(contentDir);
	return writeJson(`${JSON.stringify(data, null, "\t")}\n`, outFile, check);
}

if (import.meta.main) {
	// Script lives at apps/docs/scripts/gen-site-data.ts; the pack (skills/, workflows/,
	// evals/) is the repo root (three levels up), and the generated files go under
	// apps/docs/lib, next to the rest of this app's data.
	const scriptDir = import.meta.dirname;
	const packRoot = join(scriptDir, "..", "..", "..");
	const contentDir = join(scriptDir, "..", "content", "docs");
	const siteDataFile = join(scriptDir, "..", "lib", "site-data.json");
	const searchCommandsFile = join(scriptDir, "..", "lib", "search-commands.json");
	const check = process.argv.includes("--check");

	const siteDataResult = writeSiteData(packRoot, siteDataFile, check);
	const searchCommandsResult = writeSearchCommands(contentDir, searchCommandsFile, check);

	process.exit(siteDataResult !== 0 ? siteDataResult : searchCommandsResult);
}

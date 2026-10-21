import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join, relative, sep } from "node:path";

export type SiteData = {
	plugins: { slug: string; name: string; skills: number; hasEvals: boolean }[];
	totals: { skills: number; plugins: number; evalSuites: number; agents: 4 };
};

function countSkills(pluginDir: string): number {
	const skillsDir = join(pluginDir, "skills");
	if (!existsSync(skillsDir)) {
		return 0;
	}

	return readdirSync(skillsDir, { withFileTypes: true }).filter(
		(entry) => entry.isDirectory() && existsSync(join(skillsDir, entry.name, "SKILL.md")),
	).length;
}

export function generateSiteData(pluginsDir: string): SiteData {
	const slugs = readdirSync(pluginsDir, { withFileTypes: true })
		.filter((entry) => entry.isDirectory())
		.map((entry) => entry.name)
		.sort();

	const plugins = slugs.map((slug) => {
		const pluginDir = join(pluginsDir, slug);
		const manifestPath = join(pluginDir, ".claude-plugin", "plugin.json");

		if (!existsSync(manifestPath)) {
			throw new Error(`Missing plugin.json for plugin "${slug}" (expected at ${manifestPath})`);
		}

		const manifest = JSON.parse(readFileSync(manifestPath, "utf8")) as { name: string };

		return {
			slug,
			name: manifest.name,
			skills: countSkills(pluginDir),
			hasEvals: existsSync(join(pluginDir, "evals")),
		};
	});

	const totals = {
		skills: plugins.reduce((sum, plugin) => sum + plugin.skills, 0),
		plugins: plugins.length,
		evalSuites: plugins.filter((plugin) => plugin.hasEvals).length,
		agents: 4 as const,
	};

	return { plugins, totals };
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

export function writeSiteData(pluginsDir: string, outFile: string, check: boolean): number {
	const data = generateSiteData(pluginsDir);
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
	// Script lives at apps/docs/scripts/gen-site-data.ts; the plugins directory
	// is at the repo root (three levels up), and the generated files go under
	// apps/docs/lib, next to the rest of this app's data.
	const scriptDir = import.meta.dirname;
	const pluginsDir = join(scriptDir, "..", "..", "..", "plugins");
	const contentDir = join(scriptDir, "..", "content", "docs");
	const siteDataFile = join(scriptDir, "..", "lib", "site-data.json");
	const searchCommandsFile = join(scriptDir, "..", "lib", "search-commands.json");
	const check = process.argv.includes("--check");

	const siteDataResult = writeSiteData(pluginsDir, siteDataFile, check);
	const searchCommandsResult = writeSearchCommands(contentDir, searchCommandsFile, check);

	process.exit(siteDataResult !== 0 ? siteDataResult : searchCommandsResult);
}

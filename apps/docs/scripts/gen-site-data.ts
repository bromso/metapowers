import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

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

export function writeSiteData(pluginsDir: string, outFile: string, check: boolean): number {
	const data = generateSiteData(pluginsDir);
	const json = `${JSON.stringify(data, null, "\t")}\n`;

	if (check) {
		const existing = existsSync(outFile) ? readFileSync(outFile, "utf8") : null;
		return existing === json ? 0 : 1;
	}

	mkdirSync(dirname(outFile), { recursive: true });
	writeFileSync(outFile, json);
	return 0;
}

if (import.meta.main) {
	// Script lives at apps/docs/scripts/gen-site-data.ts; the plugins directory
	// is at the repo root (three levels up), and the generated file goes under
	// apps/docs/lib, next to the rest of this app's data.
	const scriptDir = import.meta.dirname;
	const pluginsDir = join(scriptDir, "..", "..", "..", "plugins");
	const outFile = join(scriptDir, "..", "lib", "site-data.json");
	const check = process.argv.includes("--check");

	process.exit(writeSiteData(pluginsDir, outFile, check));
}

import {
	cpSync,
	existsSync,
	mkdirSync,
	readFileSync,
	readdirSync,
	rmSync,
	writeFileSync,
} from "node:fs";
import { extname, join, resolve } from "node:path";

export type Tool = "claude" | "codex" | "opencode" | "cursor";

export interface Domain {
	name: string;
	description: string;
	skills: number;
}

const PLUGIN_ROOT_VAR = "${CLAUDE_PLUGIN_ROOT}";
const REWRITE_EXTENSIONS = new Set([".md", ".json", ".sh"]);

function countSkills(skillsDir: string): number {
	if (!existsSync(skillsDir)) return 0;
	return readdirSync(skillsDir, { withFileTypes: true }).filter(
		(entry) => entry.isDirectory() && existsSync(join(skillsDir, entry.name, "SKILL.md")),
	).length;
}

/** Domains listed in templates/marketplace.json, with SKILL.md counts from templates/plugins/. */
export function loadDomains(templatesDir: string): Domain[] {
	const marketplace = JSON.parse(readFileSync(join(templatesDir, "marketplace.json"), "utf8")) as {
		plugins: { name: string; description: string }[];
	};
	return marketplace.plugins.map((plugin) => ({
		name: plugin.name,
		description: plugin.description,
		skills: countSkills(join(templatesDir, "plugins", plugin.name, "skills")),
	}));
}

/** Replace every literal ${CLAUDE_PLUGIN_ROOT} with absPluginDir (split/join: no regex replacement patterns). */
export function rewritePluginRoot(content: string, absPluginDir: string): string {
	return content.split(PLUGIN_ROOT_VAR).join(absPluginDir);
}

function rewriteTree(dir: string, absPluginDir: string): void {
	for (const entry of readdirSync(dir, { withFileTypes: true })) {
		const path = join(dir, entry.name);
		if (entry.isDirectory()) {
			rewriteTree(path, absPluginDir);
		} else if (entry.isFile() && REWRITE_EXTENSIONS.has(extname(entry.name))) {
			const content = readFileSync(path, "utf8");
			if (content.includes(PLUGIN_ROOT_VAR)) {
				writeFileSync(path, rewritePluginRoot(content, absPluginDir));
			}
		}
	}
}

/** Copy domain plugins from templates into targetPluginsDir, rewriting ${CLAUDE_PLUGIN_ROOT} to each copied dir. */
export function copyDomains(
	templatesDir: string,
	targetPluginsDir: string,
	domains: string[],
	opts: { overwrite: boolean },
): string[] {
	const copied: string[] = [];
	mkdirSync(targetPluginsDir, { recursive: true });
	for (const domain of domains) {
		const srcDir = join(templatesDir, "plugins", domain);
		if (!existsSync(srcDir)) continue;
		const destDir = resolve(targetPluginsDir, domain);
		if (opts.overwrite) rmSync(destDir, { recursive: true, force: true });
		cpSync(srcDir, destDir, { recursive: true });
		rewriteTree(destDir, destDir);
		copied.push(domain);
	}
	return copied;
}

/** Slash commands that install the selected domains from the Metapowers marketplace in Claude Code. */
export function claudeCodeInstructions(domains: string[]): string {
	return [
		"/plugin marketplace add bromso/metapowers",
		...domains.map((domain) => `/plugin install ${domain}@metapowers`),
	].join("\n");
}

/** Version of this package, read from package.json next to dist/ (or src/). */
export function packageVersion(): string {
	const pkg = JSON.parse(readFileSync(join(import.meta.dirname, "..", "package.json"), "utf8")) as {
		version: string;
	};
	return pkg.version;
}

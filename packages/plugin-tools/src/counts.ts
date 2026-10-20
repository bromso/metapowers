import { readFileSync } from "node:fs";
import path from "node:path";
import { globSync } from "glob";
import { listSkills } from "./skills.js";

/** Number of skills (dirs directly containing a SKILL.md) per plugin, keyed by plugin dir name. */
export function countSkills(pluginsRoot: string): Record<string, number> {
	const counts: Record<string, number> = {};
	for (const skill of listSkills(pluginsRoot)) {
		counts[skill.plugin] = (counts[skill.plugin] ?? 0) + 1;
	}
	return counts;
}

/** Sum of every plugin's count. */
export function totalSkills(counts: Record<string, number>): number {
	return Object.values(counts).reduce((sum, n) => sum + n, 0);
}

export interface CountViolation {
	file: string;
	found: string;
	expected: string;
}

/** "project-management" -> "Project Management" */
function titleCase(slug: string): string {
	return slug
		.split("-")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
}

/** "Project Management" -> "project-management" (inverse of titleCase, for matching a display name back to a plugin dir). */
function slugify(name: string): string {
	return name.trim().toLowerCase().replace(/\s+/g, "-");
}

function readOptional(file: string): string | undefined {
	try {
		return readFileSync(file, "utf-8");
	} catch {
		return undefined;
	}
}

/** Prose files checked by rule (a) (spec §10); every docs `*.mdx` page is globbed separately in `checkCounts`. */
const PROSE_FILES = [
	"README.md",
	"CLAUDE.md",
	"apps/docs/app/layout.tsx",
	"apps/docs/app/(home)/page.tsx",
	"packages/create-metapowers/README.md",
];

const SKILLS_PATTERN = /(\d+)\+?\s+skills?/gi;

/**
 * The one plugin a line names, or `undefined` when it names none or more than one. A
 * `/docs/<slug>` link (as in a domain table's row link) is unambiguous and takes priority
 * over a bare word match, since a plugin's Title-Cased display name can collide with an
 * unrelated word elsewhere on the same line (e.g. "Leadership Development").
 */
function namedPlugin(line: string, pluginSlugs: string[]): string | undefined {
	const byLink = pluginSlugs.filter((slug) => new RegExp(`/docs/${slug}\\b`, "i").test(line));
	if (byLink.length === 1) return byLink[0];
	const byWord = pluginSlugs.filter((slug) => {
		const display = titleCase(slug);
		return (
			new RegExp(`\\b${slug}\\b`, "i").test(line) || new RegExp(`\\b${display}\\b`, "i").test(line)
		);
	});
	return byWord.length === 1 ? byWord[0] : undefined;
}

/**
 * A docs page under `content/docs/<plugin>/...` belongs to that plugin, which resolves a
 * line that itself names no (or more than one) plugin — e.g. a domain's own
 * `docs/<plugin>/index.mdx` describing itself without saying its name, or naming a second
 * plugin in passing ("...Legal Lifecycle... compliance, and governance.").
 */
function pluginFromPath(relFile: string, pluginSlugs: string[]): string | undefined {
	const match = relFile.match(/content\/docs\/([^/]+)\//);
	return match && pluginSlugs.includes(match[1]) ? match[1] : undefined;
}

/**
 * Rule (a): every `"<n> skills"` / `"<n>+ skills"` in the prose files must equal the real
 * total, or — when the same line names exactly one plugin (its dir name or Title-Cased
 * display name), or failing that the file lives under that plugin's own docs page —
 * that plugin's own count.
 */
function checkProseTotals(
	repoRoot: string,
	relFiles: string[],
	counts: Record<string, number>,
	total: number,
): CountViolation[] {
	const violations: CountViolation[] = [];
	const pluginSlugs = Object.keys(counts);

	for (const relFile of relFiles) {
		const content = readOptional(path.join(repoRoot, relFile));
		if (content === undefined) continue;
		const pathPlugin = pluginFromPath(relFile, pluginSlugs);
		for (const line of content.split("\n")) {
			for (const match of line.matchAll(SKILLS_PATTERN)) {
				const plugin = namedPlugin(line, pluginSlugs) ?? pathPlugin;
				const expected = plugin ? counts[plugin] : total;
				if (Number(match[1]) !== expected) {
					violations.push({ file: relFile, found: match[0], expected: String(expected) });
				}
			}
		}
	}
	return violations;
}

/** A Markdown table separator row, e.g. `|------|------|` or `| :--- | ---: |`. */
function isTableSeparator(line: string): boolean {
	return /^\s*\|[\s:|-]+\|\s*$/.test(line);
}

/**
 * Strict plugin match for a table's first cell: only a direct `/docs/<slug>` link counts.
 * Unlike narrative prose, a short table cell's plain text is often a category or tool name
 * (e.g. an MCP tool category called "Accessibility") that collides with a plugin's display
 * name without actually naming that plugin, so the looser bare-word tier of `namedPlugin`
 * is deliberately not used here.
 */
function linkedPlugin(cell: string, pluginSlugs: string[]): string | undefined {
	const matches = pluginSlugs.filter((slug) => new RegExp(`/docs/${slug}\\b`, "i").test(cell));
	return matches.length === 1 ? matches[0] : undefined;
}

/**
 * Rule (a) extra: a Markdown table row whose first cell links directly to a plugin's docs
 * page — every other cell that is a bare integer must equal that plugin's count. Catches a
 * domain-count table whose numeric cells have no "skills" word attached (e.g. README's
 * `| [Design](.../docs/design) | Design Thinking | 9 | ... |`).
 */
function checkTableRows(
	repoRoot: string,
	relFiles: string[],
	counts: Record<string, number>,
): CountViolation[] {
	const violations: CountViolation[] = [];
	const pluginSlugs = Object.keys(counts);

	for (const relFile of relFiles) {
		const content = readOptional(path.join(repoRoot, relFile));
		if (content === undefined) continue;
		for (const line of content.split("\n")) {
			if (!/^\s*\|.*\|\s*$/.test(line) || isTableSeparator(line)) continue;
			const cells = line
				.split("|")
				.slice(1, -1)
				.map((cell) => cell.trim());
			if (cells.length < 2) continue;
			const plugin = linkedPlugin(cells[0], pluginSlugs);
			if (!plugin) continue;
			const expected = counts[plugin];
			for (const cell of cells.slice(1)) {
				if (!/^\d+$/.test(cell)) continue;
				if (Number(cell) !== expected) {
					violations.push({
						file: relFile,
						found: `${cells[0]}: ${cell}`,
						expected: `${cells[0]}: ${expected}`,
					});
				}
			}
		}
	}
	return violations;
}

interface DescribedPlugin {
	name: string;
	description: string;
}

const WITH_SKILLS = /with (\d+) skills/i;

/** One `with <n> skills` check against `plugin.name`'s disk count, or no violation. */
function checkDescription(
	relFile: string,
	plugin: DescribedPlugin,
	counts: Record<string, number>,
): CountViolation | undefined {
	const match = plugin.description.match(WITH_SKILLS);
	if (!match) return undefined;
	const expected = counts[plugin.name];
	if (expected === undefined || Number(match[1]) === expected) return undefined;
	return {
		file: relFile,
		found: `${plugin.name}: ${match[0]}`,
		expected: `${plugin.name}: with ${expected} skills`,
	};
}

/** Rule (b): each marketplace.json/plugin.json description's `"with <n> skills"` must match that plugin's disk count. */
function checkDescriptions(repoRoot: string, counts: Record<string, number>): CountViolation[] {
	const violations: CountViolation[] = [];

	const marketplaceRel = ".claude-plugin/marketplace.json";
	const marketplaceContent = readOptional(path.join(repoRoot, marketplaceRel));
	if (marketplaceContent !== undefined) {
		const marketplace = JSON.parse(marketplaceContent) as { plugins?: DescribedPlugin[] };
		for (const plugin of marketplace.plugins ?? []) {
			const violation = checkDescription(marketplaceRel, plugin, counts);
			if (violation) violations.push(violation);
		}
	}

	for (const relFile of globSync("plugins/*/.claude-plugin/plugin.json", { cwd: repoRoot })) {
		const content = readOptional(path.join(repoRoot, relFile));
		if (content === undefined) continue;
		const plugin = JSON.parse(content) as DescribedPlugin;
		const violation = checkDescription(relFile, plugin, counts);
		if (violation) violations.push(violation);
	}

	return violations;
}

const HOME_PAGE = "apps/docs/app/(home)/page.tsx";

/** From `content.indexOf(startMarker)` up to (not including) the next `endMarker`, or to EOF. */
function extractBlock(content: string, startMarker: string, endMarker: string): string {
	const start = content.indexOf(startMarker);
	if (start < 0) return "";
	const end = content.indexOf(endMarker, start);
	return end < 0 ? content.slice(start) : content.slice(start, end);
}

/**
 * Rule (c): the docs homepage `domains` array and `stats` array. Each `skills:` value must
 * match its plugin's disk count; the array must list one entry per plugin, excluding
 * `metapowers` (its skills are already surfaced in the page's separate "Skill Management"
 * section, not as a domain card); the `Skills` stat must equal the real total and the
 * `Domains` stat must equal the number of domains listed.
 */
function checkHomePage(
	repoRoot: string,
	counts: Record<string, number>,
	total: number,
): CountViolation[] {
	const content = readOptional(path.join(repoRoot, HOME_PAGE));
	if (content === undefined) return [];
	const violations: CountViolation[] = [];

	const domainsBlock = extractBlock(content, "const domains", "\n];");
	const entries = [...domainsBlock.matchAll(/name:\s*"([^"]+)"[\s\S]*?skills:\s*(\d+)/g)];

	for (const [, name, skillsStr] of entries) {
		const expected = counts[slugify(name)];
		if (expected !== undefined && Number(skillsStr) !== expected) {
			violations.push({
				file: HOME_PAGE,
				found: `${name}: ${skillsStr} skills`,
				expected: `${name}: ${expected} skills`,
			});
		}
	}

	const expectedDomainCount = Object.keys(counts).filter((slug) => slug !== "metapowers").length;
	if (entries.length !== expectedDomainCount) {
		violations.push({
			file: HOME_PAGE,
			found: `domains array has ${entries.length} entries`,
			expected: `domains array has ${expectedDomainCount} entries`,
		});
	}

	const statsBlock = extractBlock(content, "const stats", "\n];");
	const skillsStat = statsBlock.match(/value:\s*"(\d+)\+?"\s*,\s*label:\s*"Skills"/);
	if (skillsStat && Number(skillsStat[1]) !== total) {
		violations.push({
			file: HOME_PAGE,
			found: `Skills stat: ${skillsStat[0]}`,
			expected: `Skills stat: ${total}`,
		});
	}

	const domainsStat = statsBlock.match(/value:\s*"(\d+)"\s*,\s*label:\s*"Domains"/);
	if (domainsStat && Number(domainsStat[1]) !== expectedDomainCount) {
		violations.push({
			file: HOME_PAGE,
			found: `Domains stat: ${domainsStat[0]}`,
			expected: `Domains stat: ${expectedDomainCount}`,
		});
	}

	return violations;
}

/**
 * Every place a skill count is quoted, checked against the real counts on disk under
 * `<repoRoot>/plugins` (spec §10). Empty when every quoted number agrees with disk.
 */
export function checkCounts(repoRoot: string): CountViolation[] {
	const pluginsRoot = path.join(repoRoot, "plugins");
	const counts = countSkills(pluginsRoot);
	const total = totalSkills(counts);

	const mdxFiles = globSync("apps/docs/content/docs/**/*.mdx", { cwd: repoRoot });
	const proseFiles = [...PROSE_FILES, ...mdxFiles];

	return [
		...checkProseTotals(repoRoot, proseFiles, counts, total),
		...checkTableRows(repoRoot, proseFiles, counts),
		...checkDescriptions(repoRoot, counts),
		...checkHomePage(repoRoot, counts, total),
	];
}

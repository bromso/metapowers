import { readFileSync } from "node:fs";
import path from "node:path";
import { globSync } from "glob";
import { listSkills } from "./skills.js";

/** Number of skills (dirs directly containing a SKILL.md) per domain, keyed by domain. */
export function countSkills(packRoot: string): Record<string, number> {
	const counts: Record<string, number> = {};
	for (const skill of listSkills(packRoot)) {
		counts[skill.domain] = (counts[skill.domain] ?? 0) + 1;
	}
	return counts;
}

/** The docs slug of a domain: the `singular` skills live under the docs' `overview` section. */
export function docsSlug(domain: string): string {
	return domain === "singular" ? "overview" : domain;
}

/** The counts re-keyed by docs slug. */
function byDocsSlug(counts: Record<string, number>): Record<string, number> {
	return Object.fromEntries(Object.entries(counts).map(([domain, n]) => [docsSlug(domain), n]));
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
		// The `overview` docs section is named by its domain word, never by "overview".
		const word = slug === "overview" ? "singular" : slug;
		const display = titleCase(word);
		return (
			new RegExp(`\\b${word}\\b`, "i").test(line) || new RegExp(`\\b${display}\\b`, "i").test(line)
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

/**
 * One `with <n> skills` check against `plugin.name`'s disk count when it names a domain, or
 * against the pack total otherwise (the one pack-level plugin); no violation when it agrees.
 */
function checkDescription(
	relFile: string,
	plugin: DescribedPlugin,
	counts: Record<string, number>,
): CountViolation | undefined {
	const match = plugin.description.match(WITH_SKILLS);
	if (!match) return undefined;
	const expected = counts[plugin.name] ?? totalSkills(counts);
	if (Number(match[1]) === expected) return undefined;
	return {
		file: relFile,
		found: `${plugin.name}: ${match[0]}`,
		expected: `${plugin.name}: with ${expected} skills`,
	};
}

/**
 * Rule (b): each `.claude-plugin/marketplace.json` entry's and the `.claude-plugin/plugin.json`
 * description's `"with <n> skills"` must match the disk count (see `checkDescription`).
 */
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

	const pluginRel = ".claude-plugin/plugin.json";
	const pluginContent = readOptional(path.join(repoRoot, pluginRel));
	if (pluginContent !== undefined) {
		const violation = checkDescription(pluginRel, JSON.parse(pluginContent), counts);
		if (violation) violations.push(violation);
	}

	return violations;
}

const DOMAINS_FILE = "apps/docs/lib/domains.ts";
const SITE_DATA_FILE = "apps/docs/lib/site-data.json";

/**
 * Rule (c): the docs site's two sources of truth for domains and counts. The homepage no
 * longer hardcodes either; it reads `lib/site-data.json` (generated from `skills/` by
 * `bun run gen:data`) joined with the hand-maintained `lib/domains.ts`. `domains.ts` must
 * list exactly one entry per domain (by docs slug), and every per-domain `skills`
 * value and the `totals.skills` figure in `site-data.json` must match disk.
 */
function checkSiteData(
	repoRoot: string,
	counts: Record<string, number>,
	total: number,
): CountViolation[] {
	const violations: CountViolation[] = [];
	const diskSlugs = Object.keys(counts).sort();

	const domainsSource = readOptional(path.join(repoRoot, DOMAINS_FILE));
	if (domainsSource !== undefined) {
		const listed = [...domainsSource.matchAll(/\bslug:\s*"([^"]+)"/g)].map((m) => m[1]).sort();
		for (const slug of diskSlugs) {
			if (!listed.includes(slug)) {
				violations.push({
					file: DOMAINS_FILE,
					found: `no entry for "${slug}"`,
					expected: `one entry per plugin (${diskSlugs.length} entries)`,
				});
			}
		}
		for (const slug of listed) {
			if (!diskSlugs.includes(slug)) {
				violations.push({
					file: DOMAINS_FILE,
					found: `entry for "${slug}" has no plugin on disk`,
					expected: `one entry per plugin (${diskSlugs.length} entries)`,
				});
			}
		}
	}

	const siteDataSource = readOptional(path.join(repoRoot, SITE_DATA_FILE));
	if (siteDataSource !== undefined) {
		let data: { plugins?: { slug: string; skills: number }[]; totals?: { skills?: number } };
		try {
			data = JSON.parse(siteDataSource);
		} catch (error) {
			return [
				...violations,
				{
					file: SITE_DATA_FILE,
					found: `unparseable JSON (${String(error)})`,
					expected: "valid JSON",
				},
			];
		}
		for (const plugin of data.plugins ?? []) {
			const expected = counts[plugin.slug];
			if (expected !== undefined && plugin.skills !== expected) {
				violations.push({
					file: SITE_DATA_FILE,
					found: `${plugin.slug}: ${plugin.skills} skills`,
					expected: `${plugin.slug}: ${expected} skills (run \`bun run gen:data\` in apps/docs)`,
				});
			}
		}
		if (data.totals?.skills !== undefined && data.totals.skills !== total) {
			violations.push({
				file: SITE_DATA_FILE,
				found: `totals.skills: ${data.totals.skills}`,
				expected: `totals.skills: ${total} (run \`bun run gen:data\` in apps/docs)`,
			});
		}
	}

	return violations;
}

/**
 * Every place a skill count is quoted, checked against the real counts on disk under
 * `<repoRoot>/skills` (spec §9). Empty when every quoted number agrees with disk. The docs
 * rules key domains by docs slug (`singular` is `overview`); the manifests by domain.
 */
export function checkCounts(repoRoot: string): CountViolation[] {
	const counts = countSkills(path.join(repoRoot, "skills"));
	const total = totalSkills(counts);
	const docsCounts = byDocsSlug(counts);

	const mdxFiles = globSync("apps/docs/content/docs/**/*.mdx", { cwd: repoRoot });
	const proseFiles = [...PROSE_FILES, ...mdxFiles];

	return [
		...checkProseTotals(repoRoot, proseFiles, docsCounts, total),
		...checkTableRows(repoRoot, proseFiles, docsCounts),
		...checkDescriptions(repoRoot, counts),
		...checkSiteData(repoRoot, docsCounts, total),
	];
}

import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { checkCounts, countSkills, totalSkills } from "./counts.js";

describe("countSkills", () => {
	let dir: string;
	beforeEach(() => {
		dir = mkdtempSync(path.join(tmpdir(), "pack-tools-counts-"));
	});
	afterEach(() => {
		rmSync(dir, { recursive: true, force: true });
	});

	it("counts only dirs containing SKILL.md, ignoring a stray README.md", () => {
		mkdirSync(path.join(dir, "a-x"), { recursive: true });
		mkdirSync(path.join(dir, "a-y"), { recursive: true });
		writeFileSync(path.join(dir, "a-x/SKILL.md"), "# X\n");
		writeFileSync(path.join(dir, "a-y/SKILL.md"), "# Y\n");
		writeFileSync(path.join(dir, "README.md"), "# Skills overview\n");

		expect(countSkills(dir)).toEqual({ a: 2 });
	});
});

describe("totalSkills", () => {
	it("sums every plugin's count", () => {
		expect(totalSkills({ a: 2, b: 3, c: 0 })).toBe(5);
	});
});

/** Builds `<repoRoot>/plugins/<plugin>-<skill>/SKILL.md` for each skill (the flat pack layout). */
function makePlugin(repoRoot: string, plugin: string, skills: string[]): void {
	for (const skill of skills) {
		const skillDir = path.join(repoRoot, "plugins", `${plugin}-${skill}`);
		mkdirSync(skillDir, { recursive: true });
		writeFileSync(path.join(skillDir, "SKILL.md"), `# ${skill}\n`);
	}
}

describe("checkCounts", () => {
	let repoRoot: string;
	beforeEach(() => {
		repoRoot = mkdtempSync(path.join(tmpdir(), "pack-tools-checkcounts-"));
	});
	afterEach(() => {
		rmSync(repoRoot, { recursive: true, force: true });
	});

	it("flags a README total that disagrees with disk (rule a)", () => {
		makePlugin(repoRoot, "a", ["x", "y"]);
		writeFileSync(path.join(repoRoot, "README.md"), "Metapowers ships 3 skills today.\n");

		const violations = checkCounts(repoRoot);
		expect(violations).toHaveLength(1);
		expect(violations[0]).toMatchObject({ file: "README.md", found: "3 skills", expected: "2" });
	});

	it("does not flag a README total that already matches disk", () => {
		makePlugin(repoRoot, "a", ["x", "y"]);
		writeFileSync(path.join(repoRoot, "README.md"), "Metapowers ships 2 skills today.\n");

		expect(checkCounts(repoRoot)).toEqual([]);
	});

	it("flags a marketplace.json description whose 'with N skills' disagrees with that plugin's disk count (rule b)", () => {
		makePlugin(repoRoot, "marketing", ["x", "y", "z"]);
		mkdirSync(path.join(repoRoot, ".claude-plugin"), { recursive: true });
		writeFileSync(
			path.join(repoRoot, ".claude-plugin", "marketplace.json"),
			JSON.stringify({
				plugins: [{ name: "marketing", description: "Growth marketing with 2 skills" }],
			}),
		);

		const violations = checkCounts(repoRoot);
		const marketplaceViolations = violations.filter((v) => v.file.endsWith("marketplace.json"));
		expect(marketplaceViolations).toHaveLength(1);
		expect(marketplaceViolations[0].found).toContain("2");
		expect(marketplaceViolations[0].expected).toContain("3");
	});

	it("flags a plugin.json description whose 'with N skills' disagrees with that plugin's disk count (rule b)", () => {
		makePlugin(repoRoot, "legal", ["x", "y"]);
		mkdirSync(path.join(repoRoot, "plugins/legal/.claude-plugin"), { recursive: true });
		writeFileSync(
			path.join(repoRoot, "plugins/legal/.claude-plugin/plugin.json"),
			JSON.stringify({ name: "legal", description: "Legal lifecycle with 9 skills" }),
		);

		const violations = checkCounts(repoRoot);
		const pluginJsonViolations = violations.filter((v) =>
			v.file.endsWith("plugins/legal/.claude-plugin/plugin.json"),
		);
		expect(pluginJsonViolations).toHaveLength(1);
		expect(pluginJsonViolations[0].found).toContain("9");
		expect(pluginJsonViolations[0].expected).toContain("2");
	});

	it("flags a stale per-plugin count or total in the generated docs site data (rule c)", () => {
		makePlugin(repoRoot, "marketing", ["x", "y", "z"]);
		const dataFile = path.join(repoRoot, "apps/docs/lib/site-data.json");
		mkdirSync(path.dirname(dataFile), { recursive: true });
		writeFileSync(
			dataFile,
			JSON.stringify({
				plugins: [{ slug: "marketing", name: "marketing", skills: 2, hasEvals: false }],
				totals: { skills: 2, plugins: 1, evalSuites: 0, agents: 4 },
			}),
		);

		const violations = checkCounts(repoRoot).filter((v) => v.file.endsWith("site-data.json"));
		expect(violations).toHaveLength(2);
		expect(violations[0]).toMatchObject({ found: "marketing: 2 skills" });
		expect(violations[0].expected).toContain("marketing: 3 skills");
		expect(violations[1]).toMatchObject({ found: "totals.skills: 2" });
		expect(violations[1].expected).toContain("totals.skills: 3");
	});

	it("flags a plugin missing from, or extra in, the docs domains table (rule c)", () => {
		makePlugin(repoRoot, "legal", ["x"]);
		makePlugin(repoRoot, "security", ["y"]);
		const domainsFile = path.join(repoRoot, "apps/docs/lib/domains.ts");
		mkdirSync(path.dirname(domainsFile), { recursive: true });
		writeFileSync(
			domainsFile,
			[
				"export const domains = [",
				'\t{ slug: "legal", name: "Legal" },',
				'\t{ slug: "finance", name: "Finance" },',
				"];",
			].join("\n"),
		);

		const violations = checkCounts(repoRoot).filter((v) => v.file.endsWith("domains.ts"));
		expect(violations.map((v) => v.found)).toEqual([
			'no entry for "security"',
			'entry for "finance" has no plugin on disk',
		]);
	});

	it("does not flag a domains table and site data that match disk (rule c)", () => {
		makePlugin(repoRoot, "legal", ["x", "y"]);
		mkdirSync(path.join(repoRoot, "apps/docs/lib"), { recursive: true });
		writeFileSync(
			path.join(repoRoot, "apps/docs/lib/domains.ts"),
			'export const domains = [\n\t{ slug: "legal", name: "Legal" },\n];\n',
		);
		writeFileSync(
			path.join(repoRoot, "apps/docs/lib/site-data.json"),
			JSON.stringify({
				plugins: [{ slug: "legal", name: "legal", skills: 2, hasEvals: true }],
				totals: { skills: 2, plugins: 1, evalSuites: 1, agents: 4 },
			}),
		);

		expect(checkCounts(repoRoot)).toEqual([]);
	});

	it("flags a bare-integer table cell that disagrees with its linked plugin's disk count (rule a, table rows)", () => {
		makePlugin(repoRoot, "a", ["x", "y"]);
		makePlugin(repoRoot, "b", ["x", "y", "z"]);
		writeFileSync(
			path.join(repoRoot, "README.md"),
			[
				"| Domain | Methodology | Skills |",
				"|--------|-------------|--------|",
				"| [A](https://example.com/docs/a) | Thing | 2 |",
				"| [B](https://example.com/docs/b) | Thing | 5 |",
			].join("\n"),
		);

		const violations = checkCounts(repoRoot);
		expect(violations).toHaveLength(1);
		expect(violations[0]).toMatchObject({
			file: "README.md",
			found: "[B](https://example.com/docs/b): 5",
			expected: "[B](https://example.com/docs/b): 3",
		});
	});
});

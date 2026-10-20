import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { checkCounts, countSkills, totalSkills } from "./counts.js";

describe("countSkills", () => {
	let dir: string;
	beforeEach(() => {
		dir = mkdtempSync(path.join(tmpdir(), "plugin-tools-counts-"));
	});
	afterEach(() => {
		rmSync(dir, { recursive: true, force: true });
	});

	it("counts only dirs containing SKILL.md, ignoring a stray skills/README.md", () => {
		mkdirSync(path.join(dir, "a/skills/x"), { recursive: true });
		mkdirSync(path.join(dir, "a/skills/y"), { recursive: true });
		writeFileSync(path.join(dir, "a/skills/x/SKILL.md"), "# X\n");
		writeFileSync(path.join(dir, "a/skills/y/SKILL.md"), "# Y\n");
		writeFileSync(path.join(dir, "a/skills/README.md"), "# Skills overview\n");

		expect(countSkills(dir)).toEqual({ a: 2 });
	});
});

describe("totalSkills", () => {
	it("sums every plugin's count", () => {
		expect(totalSkills({ a: 2, b: 3, c: 0 })).toBe(5);
	});
});

/** Builds `<repoRoot>/plugins/<plugin>/skills/<skill>/SKILL.md` for each skill. */
function makePlugin(repoRoot: string, plugin: string, skills: string[]): void {
	for (const skill of skills) {
		const skillDir = path.join(repoRoot, "plugins", plugin, "skills", skill);
		mkdirSync(skillDir, { recursive: true });
		writeFileSync(path.join(skillDir, "SKILL.md"), `# ${skill}\n`);
	}
}

describe("checkCounts", () => {
	let repoRoot: string;
	beforeEach(() => {
		repoRoot = mkdtempSync(path.join(tmpdir(), "plugin-tools-checkcounts-"));
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

	it("flags a stale 'skills:' value in the docs homepage domains array (rule c)", () => {
		makePlugin(repoRoot, "marketing", ["x", "y", "z"]);
		const pageFile = path.join(repoRoot, "apps/docs/app/(home)/page.tsx");
		mkdirSync(path.dirname(pageFile), { recursive: true });
		writeFileSync(
			pageFile,
			[
				"const domains = [",
				'\t{ name: "Marketing", icon: Megaphone, methodology: "RACE", skills: 2, description: "x", href: "/docs/marketing" },',
				"];",
				"",
				'const stats = [{ value: "3", label: "Skills" }, { value: "1", label: "Domains" }];',
			].join("\n"),
		);

		const violations = checkCounts(repoRoot);
		const pageViolations = violations.filter((v) => v.file.endsWith("app/(home)/page.tsx"));
		// Marketing skills: mismatch (2 vs 3), Skills stat mismatch (3 vs 3 disk total... see below)
		expect(pageViolations.some((v) => v.found.includes("2") && v.expected.includes("3"))).toBe(
			true,
		);
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

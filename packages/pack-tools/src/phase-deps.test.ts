import { describe, expect, it } from "vitest";
import { formatPhaseDeps, generatePhaseDeps, prerequisiteFiles } from "./phase-deps.js";
import type { SkillFile } from "./skills.js";

/** A minimal SKILL.md whose Prerequisites section is `prereq` and which writes `writes` (if any). */
function skillMd(plugin: string, title: string, prereq: string | null, writes?: string): string {
	const prereqSection = prereq === null ? "" : `## Prerequisites\n\n${prereq}\n\n`;
	const write = writes
		? `1. **Write the artifact** to \`.metapowers/${plugin}/<project>/${writes}\` with heading:\n`
		: "1. Present the result.\n";
	return `---\ndescription: Do ${title}\n---\n\n# ${title}\n\nDo "$ARGUMENTS".\n\n${prereqSection}## Process\n\n${write}\n## Output\n\nDone.\n`;
}

function skill(plugin: string, name: string, prereq: string | null, writes?: string): SkillFile {
	return {
		domain: plugin,
		name,
		path: `/skills/${plugin}-${name}/SKILL.md`,
		content: skillMd(plugin, name, prereq, writes),
	};
}

const reads = (plugin: string, ...files: string[]) =>
	`Read ${files.map((f) => `\`.metapowers/${plugin}/<project>/${f}\``).join(" and ")}. If this file does not exist, tell the user:\n\n> Run the earlier phase first.`;

describe("prerequisiteFiles", () => {
	it("ignores 'None — utility skill' prerequisites", () => {
		const ratiosFixture = skillMd(
			"finance",
			"Ratios",
			"None — utility skill, run anytime. Works best when financial data exists in `.metapowers/finance/<project>/`.",
		);
		expect(prerequisiteFiles(ratiosFixture)).toEqual([]);
	});

	it("collects files from the Prerequisites section only, sorted and deduplicated", () => {
		const content = skillMd(
			"accounting",
			"Close",
			"Read `.metapowers/accounting/<project>/07-statements.md` for statements and `.metapowers/accounting/<project>/06-adjusted-balance.md` for balances.",
			"08-close.md",
		).replace(
			"1. **Write",
			"1. Read `.metapowers/accounting/<project>/01-analyze.md`.\n2. **Write",
		);
		expect(prerequisiteFiles(content)).toEqual(["06-adjusted-balance.md", "07-statements.md"]);
	});

	it("turns a directory prerequisite into a glob and drops skip-log.md and bare directories", () => {
		const content = skillMd(
			"compliance",
			"Score",
			"Read `.metapowers/compliance/<project>/01-assess/`. Log skips in `.metapowers/compliance/<project>/skip-log.md`. Context lives in `.metapowers/compliance/<project>/`.",
		);
		expect(prerequisiteFiles(content)).toEqual(["01-assess/*.md"]);
	});

	it("drops files the section marks as optional", () => {
		const content = skillMd(
			"marketing",
			"Programmatic SEO",
			"Read `.metapowers/marketing/<project>/00-strategy.md` and `.metapowers/marketing/<project>/01-reach.md` (if exists). Read `.metapowers/marketing/<project>/02-act.md` if it exists.",
		);
		expect(prerequisiteFiles(content)).toEqual(["00-strategy.md"]);
	});

	it("returns [] when there is no Prerequisites section", () => {
		expect(prerequisiteFiles(skillMd("security", "Threat Intel", null, "threat-intel.md"))).toEqual(
			[],
		);
	});
});

describe("generatePhaseDeps", () => {
	it("hub shape: every phase requires only the phase-0 file", () => {
		const govern = reads("security", "00-govern.md");
		const deps = generatePhaseDeps("security", [
			skill("security", "risk-register", null, "00-govern.md"),
			skill("security", "asset-inventory", govern, "01-identify.md"),
			skill("security", "api-security", govern, "02-protect.md"),
			skill("security", "encryption", govern, "02-protect.md"),
			skill("security", "siem", govern, "03-detect.md"),
			skill("security", "threat-intel", null, "threat-intel.md"),
		]);
		expect(deps?.domain).toBe("security");
		expect(deps?.artifacts).toBe("\\.metapowers/security/([^/]+)/([0-9][0-9])-[^/]+\\.md$");
		expect(deps?.requires).toEqual({
			"01": ["00-govern.md"],
			"02": ["00-govern.md"],
			"03": ["00-govern.md"],
		});
	});

	it("chain shape: each phase requires the previous file(s)", () => {
		const deps = generatePhaseDeps("accounting", [
			skill("accounting", "analyze", null, "01-analyze.md"),
			skill("accounting", "journal", reads("accounting", "01-analyze.md"), "02-journal.md"),
			skill(
				"accounting",
				"close",
				reads("accounting", "07-statements.md", "06-adjusted-balance.md"),
				"08-close.md",
			),
		]);
		expect(deps?.requires["02"]).toEqual(["01-analyze.md"]);
		expect(deps?.requires["08"]).toEqual(["06-adjusted-balance.md", "07-statements.md"]);
		expect(deps?.requires["01"]).toBeUndefined();
	});

	it("intersects prerequisites across writers of the same phase", () => {
		const deps = generatePhaseDeps("x", [
			skill("x", "a", reads("x", "00-x.md", "01-y.md"), "02-z.md"),
			skill("x", "b", reads("x", "00-x.md"), "02-z.md"),
		]);
		expect(deps?.requires["02"]).toEqual(["00-x.md"]);
	});

	it("omits a phase whose writers share no prerequisite and excludes the phase's own files", () => {
		const deps = generatePhaseDeps("x", [
			skill("x", "a", reads("x", "00-x.md"), "01-y.md"),
			skill("x", "b", null, "01-y.md"),
			skill("x", "c", reads("x", "02-z.md", "01-y.md"), "02-z.md"),
		]);
		expect(deps?.requires).toEqual({ "02": ["01-y.md"] });
	});

	it("compliance: directory phase extends the artifacts regex and phase 2 requires only 00-scope.md", () => {
		const scope = reads("compliance", "00-scope.md");
		const deps = generatePhaseDeps("compliance", [
			skill("compliance", "regulatory-landscape", null, "00-scope.md"),
			skill("compliance", "gdpr", scope, "01-assess/gdpr.md"),
			skill("compliance", "ccpa", scope, "01-assess/ccpa.md"),
			skill("compliance", "gap-analysis", scope, "02-gaps.md"),
		]);
		expect(deps?.artifacts).toBe(
			"\\.metapowers/compliance/([^/]+)/([0-9][0-9])-[^/]+\\.md$|\\.metapowers/compliance/([^/]+)/([0-9][0-9])-[^/]+/[^/]+\\.md$",
		);
		expect(deps?.artifacts).toContain("/[^/]+\\.md$");
		expect(deps?.requires["01"]).toEqual(["00-scope.md"]);
		expect(deps?.requires["02"]).toEqual(["00-scope.md"]);
	});

	it("returns null for plugins without numbered phases", () => {
		const coachingFixtures = [
			skill("coaching", "ux", null, "ux-review.md"),
			skill("coaching", "strategy", null, "strategy-review.md"),
		];
		expect(generatePhaseDeps("coaching", coachingFixtures)).toBeNull();
	});

	it("ignores skills of other plugins and writes into other domains", () => {
		const deps = generatePhaseDeps("x", [
			skill("y", "other", reads("y", "00-a.md"), "01-b.md"),
			skill("x", "own", reads("x", "00-a.md"), "01-b.md"),
		]);
		expect(deps?.requires).toEqual({ "01": ["00-a.md"] });
	});
});

describe("formatPhaseDeps", () => {
	it("writes tab-indented JSON with sorted keys and a trailing newline", () => {
		const text = formatPhaseDeps({
			requires: { "02": ["00-a.md"], "01": ["00-a.md"] },
			domain: "x",
			artifacts: "a",
		});
		expect(text).toBe(
			'{\n\t"artifacts": "a",\n\t"domain": "x",\n\t"requires": {\n\t\t"01": ["00-a.md"],\n\t\t"02": ["00-a.md"]\n\t}\n}\n',
		);
	});
});

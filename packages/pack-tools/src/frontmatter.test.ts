import { describe, expect, it } from "vitest";
import { ARGS_PARAGRAPH } from "./args.js";
import {
	BASENAME_HINT,
	FREE_TEXT_HINTS,
	MODEL_INVOCATION_DISABLED,
	SLUG_HINT,
	fixFrontmatter,
	parseFrontmatter,
	renderFrontmatter,
} from "./frontmatter.js";

const body = (paragraph: string) =>
	`\n# Skill\n\nDo the thing for "$ARGUMENTS".\n\n${paragraph}\n\n## Prerequisites\n\nNone.\n`;

const secFixture = `---\ndescription: Audit API security\n---\n${body(ARGS_PARAGRAPH("security", "first-token"))}`;
const coachingFixture = `---\ndescription: Review code through the lens of a senior engineer\n---\n${body(ARGS_PARAGRAPH("coaching", "basename"))}`;
const findSkillFixture = `---\ndescription: Search skill marketplaces for relevant skills and install them\n---\n\n# Find Skill\n\nSearch for a skill matching "$ARGUMENTS".\n`;
const noArgsFixture =
	"---\ndescription: Detect the project stack\n---\n\n# Detect\n\nDetect things.\n";

describe("constants", () => {
	it("match the spec values", () => {
		expect(SLUG_HINT).toBe("[project] [--skip-checks]");
		expect(BASENAME_HINT).toBe("<file-or-topic> [--skip-checks]");
		expect(FREE_TEXT_HINTS).toEqual({
			"singular-find-skill": "<topic>",
			"singular-create-skill": "<topic>",
			"singular-improve-skill": "<skill-name>",
			workflow: "<workflow> <project>",
			"development-debug": "<symptom or error>",
			"development-ship": "[project]",
			"accessibility-checklist": "<component or page>",
			"branding-audit": "<brand or URL>",
		});
		expect([...MODEL_INVOCATION_DISABLED].sort()).toEqual([
			"singular-create-skill",
			"singular-find-skill",
			"singular-improve-skill",
			"singular-init",
		]);
	});
});

describe("parseFrontmatter / renderFrontmatter", () => {
	it("splits top-level keys with their continuation lines", () => {
		expect(parseFrontmatter("name: x\ndescription: >-\n  a\n  b\nmetadata:\n  phase: 1")).toEqual([
			["name", "name: x"],
			["description", "description: >-\n  a\n  b"],
			["metadata", "metadata:\n  phase: 1"],
		]);
	});

	it("renders name, description, other keys, then metadata", () => {
		const blocks = parseFrontmatter("description: D\nallowed-tools: Read\nname: old");
		expect(renderFrontmatter("design-x", blocks, [["workflow", "design"]])).toBe(
			"---\nname: design-x\ndescription: D\nallowed-tools: Read\nmetadata:\n  workflow: design\n---",
		);
		expect(renderFrontmatter("design-x", blocks, [])).toBe(
			"---\nname: design-x\ndescription: D\nallowed-tools: Read\n---",
		);
	});
});

describe("fixFrontmatter", () => {
	it("adds name and puts the slug hint under metadata", () => {
		const out = fixFrontmatter(secFixture, "security", "security-api-security");
		expect(out).toMatch(
			/^---\nname: security-api-security\ndescription: .*\nmetadata:\n {2}argument-hint: "\[project\] \[--skip-checks\]"\n---/,
		);
	});

	it("keeps the body byte-identical", () => {
		const out = fixFrontmatter(secFixture, "security", "security-api-security");
		const bodyOf = (s: string) => s.slice(s.indexOf("\n---\n", 4) + 5);
		expect(bodyOf(out)).toBe(bodyOf(secFixture));
	});

	it("uses the basename hint for coaching", () => {
		const out = fixFrontmatter(coachingFixture, "coaching", "coaching-code");
		expect(out).toContain('\n  argument-hint: "<file-or-topic> [--skip-checks]"\n');
		expect(out).not.toContain("disable-model-invocation");
	});

	it("uses the free-text hint table and disables model invocation for find-skill", () => {
		const out = fixFrontmatter(findSkillFixture, "singular", "singular-find-skill");
		expect(out).toMatch(
			/^---\nname: singular-find-skill\ndescription: Search .*\nmetadata:\n {2}argument-hint: "<topic>"\n {2}disable-model-invocation: true\n---\n/,
		);
	});

	it("omits metadata for skills without arguments and disables init", () => {
		expect(fixFrontmatter(noArgsFixture, "singular", "singular-detect")).toBe(
			"---\nname: singular-detect\ndescription: Detect the project stack\n---\n\n# Detect\n\nDetect things.\n",
		);
		expect(fixFrontmatter(noArgsFixture, "singular", "singular-init")).toMatch(
			/^---\nname: singular-init\ndescription: .*\nmetadata:\n {2}disable-model-invocation: true\n---\n/,
		);
	});

	it("moves top-level argument-hint and disable-model-invocation under metadata", () => {
		const input =
			'---\nname: singular-find-skill\ndescription: Find\nargument-hint: "<topic>"\ndisable-model-invocation: true\n---\n\n# F\n';
		expect(fixFrontmatter(input, "singular", "singular-find-skill")).toBe(
			'---\nname: singular-find-skill\ndescription: Find\nmetadata:\n  argument-hint: "<topic>"\n  disable-model-invocation: true\n---\n\n# F\n',
		);
	});

	it("keeps workflow membership in canonical metadata order", () => {
		const input = `---\nname: design-define\ndescription: Define\nmetadata:\n  artifact: 02-define.md\n  phase: 2\n  workflow: design\n  argument-hint: "[project] [--skip-checks]"\n---\n${body(ARGS_PARAGRAPH("design", "first-token"))}`;
		const out = fixFrontmatter(input, "design", "design-define");
		expect(out).toMatch(
			/^---\nname: design-define\ndescription: Define\nmetadata:\n {2}argument-hint: "\[project\] \[--skip-checks\]"\n {2}workflow: design\n {2}phase: 2\n {2}artifact: 02-define\.md\n---\n/,
		);
		expect(fixFrontmatter(out, "design", "design-define")).toBe(out);
	});

	it("overwrites a wrong existing name and is idempotent", () => {
		const input = secFixture.replace("---\n", "---\nname: wrong\n");
		const out = fixFrontmatter(input, "security", "security-api-security");
		expect(out).toContain("name: security-api-security");
		expect(out).not.toContain("name: wrong");
		expect(fixFrontmatter(out, "security", "security-api-security")).toBe(out);
	});

	it("reorders keys and keeps unknown keys between description and metadata, in original order", () => {
		const input = `---\nallowed-tools: Read\ndisable-model-invocation: true\ndescription: >-\n  Audit API\n  security\nmodel: haiku\nname: api-security\n---\n${body(ARGS_PARAGRAPH("security", "first-token"))}`;
		const out = fixFrontmatter(input, "security", "security-api-security");
		expect(out).toMatch(
			/^---\nname: security-api-security\ndescription: >-\n {2}Audit API\n {2}security\nallowed-tools: Read\nmodel: haiku\nmetadata:\n {2}argument-hint: "\[project\] \[--skip-checks\]"\n---\n/,
		);
	});

	it("returns content without frontmatter unchanged", () => {
		expect(fixFrontmatter("# No frontmatter\n", "security", "x")).toBe("# No frontmatter\n");
	});
});

import { standardArgsParagraph } from "@metapowers/skill-validator";
import { describe, expect, it } from "vitest";
import {
	BASENAME_HINT,
	FREE_TEXT_HINTS,
	MODEL_INVOCATION_DISABLED,
	SLUG_HINT,
	fixFrontmatter,
} from "./frontmatter.js";

const body = (paragraph: string) =>
	`\n# Skill\n\nDo the thing for "$ARGUMENTS".\n\n${paragraph}\n\n## Prerequisites\n\nNone.\n`;

const secFixture = `---\ndescription: Audit API security\n---\n${body(standardArgsParagraph("security", "first-token"))}`;
const coachingFixture = `---\ndescription: Review code through the lens of a senior engineer\n---\n${body(standardArgsParagraph("coaching", "basename"))}`;
const findSkillFixture = `---\ndescription: Search skill marketplaces for relevant skills and install them\n---\n\n# Find Skill\n\nSearch for a skill matching "$ARGUMENTS".\n`;
const noArgsFixture =
	"---\ndescription: Detect the project stack\n---\n\n# Detect\n\nDetect things.\n";

describe("constants", () => {
	it("match the spec values", () => {
		expect(SLUG_HINT).toBe("[project] [--skip-checks]");
		expect(BASENAME_HINT).toBe("<file-or-topic> [--skip-checks]");
		expect(FREE_TEXT_HINTS).toEqual({
			"metapowers/find-skill": "<topic>",
			"metapowers/create-skill": "<topic>",
			"metapowers/improve-skill": "<skill-name>",
			"metapowers/workflow": "<workflow-name> <project>",
			"development/debug": "<symptom or error>",
			"development/ship": "[project]",
			"accessibility/checklist": "<component or page>",
			"branding/audit": "<brand or URL>",
		});
		expect([...MODEL_INVOCATION_DISABLED].sort()).toEqual([
			"metapowers/create-skill",
			"metapowers/find-skill",
			"metapowers/improve-skill",
			"metapowers/init",
		]);
	});
});

describe("fixFrontmatter", () => {
	it("adds name, slug hint and key order to a slug skill", () => {
		const out = fixFrontmatter(secFixture, "security", "api-security");
		expect(out).toMatch(
			/^---\nname: api-security\ndescription: .*\nargument-hint: "\[project\] \[--skip-checks\]"\n---/,
		);
	});

	it("keeps the body byte-identical", () => {
		const out = fixFrontmatter(secFixture, "security", "api-security");
		const bodyOf = (s: string) => s.slice(s.indexOf("\n---\n", 4) + 5);
		expect(bodyOf(out)).toBe(bodyOf(secFixture));
	});

	it("uses the basename hint for coaching", () => {
		const out = fixFrontmatter(coachingFixture, "coaching", "code");
		expect(out).toContain('\nargument-hint: "<file-or-topic> [--skip-checks]"\n');
		expect(out).not.toContain("disable-model-invocation");
	});

	it("uses the free-text hint table and disables model invocation for find-skill", () => {
		const out = fixFrontmatter(findSkillFixture, "metapowers", "find-skill");
		expect(out).toMatch(
			/^---\nname: find-skill\ndescription: Search .*\nargument-hint: "<topic>"\ndisable-model-invocation: true\n---\n/,
		);
	});

	it("omits argument-hint for skills without arguments and disables init", () => {
		expect(fixFrontmatter(noArgsFixture, "metapowers", "detect")).toBe(
			"---\nname: detect\ndescription: Detect the project stack\n---\n\n# Detect\n\nDetect things.\n",
		);
		expect(fixFrontmatter(noArgsFixture, "metapowers", "init")).toMatch(
			/^---\nname: init\ndescription: .*\ndisable-model-invocation: true\n---\n/,
		);
	});

	it("overwrites a wrong existing name and is idempotent", () => {
		const input = secFixture.replace("---\n", "---\nname: wrong\n");
		const out = fixFrontmatter(input, "security", "api-security");
		expect(out).toContain("name: api-security");
		expect(out).not.toContain("name: wrong");
		expect(fixFrontmatter(out, "security", "api-security")).toBe(out);
	});

	it("reorders keys and keeps unknown keys after the four, in original order", () => {
		const input = `---\nallowed-tools: Read\ndisable-model-invocation: true\ndescription: >-\n  Audit API\n  security\nmodel: haiku\nname: api-security\n---\n${body(standardArgsParagraph("security", "first-token"))}`;
		const out = fixFrontmatter(input, "security", "api-security");
		expect(out).toMatch(
			/^---\nname: api-security\ndescription: >-\n {2}Audit API\n {2}security\nargument-hint: "\[project\] \[--skip-checks\]"\nallowed-tools: Read\nmodel: haiku\n---\n/,
		);
	});

	it("returns content without frontmatter unchanged", () => {
		expect(fixFrontmatter("# No frontmatter\n", "security", "x")).toBe("# No frontmatter\n");
	});
});

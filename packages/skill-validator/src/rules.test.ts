import { describe, expect, it } from "vitest";
import { parseSkill } from "./parse-skill.js";
import { type ValidationResult, validateSkill } from "./rules.js";

function validate(content: string): ValidationResult {
	const parsed = parseSkill(content, "test/SKILL.md");
	return validateSkill(parsed);
}

describe("validateSkill", () => {
	const validSkill = `---
description: Define a component contract with props, variants, and states. Use when the user asks to specify a new component before building it.
---

# Define Component

Body content with instructions.

## Prerequisites

Check for prior artifacts.

## Process

Steps to follow.

## Output

What gets produced.`;

	it("passes for a valid skill", () => {
		const result = validate(validSkill);
		expect(result.pass).toBe(true);
		expect(result.errors).toHaveLength(0);
	});

	it("fails when description is missing", () => {
		const input = `---
name: test
---

# Title

Body.`;
		const result = validate(input);
		expect(result.pass).toBe(false);
		expect(result.errors).toContainEqual(expect.objectContaining({ rule: "description-required" }));
	});

	it("fails when description exceeds 400 chars", () => {
		const input = `---
description: ${"a".repeat(401)}
---

# Title

Body.`;
		const result = validate(input);
		expect(result.pass).toBe(false);
		expect(result.errors).toContainEqual(
			expect.objectContaining({ rule: "description-max-length" }),
		);
	});

	it("fails when description does not start with a verb", () => {
		const input = `---
description: The component contract builder
---

# Title

Body.`;
		const result = validate(input);
		expect(result.pass).toBe(false);
		expect(result.errors).toContainEqual(
			expect.objectContaining({ rule: "description-starts-with-verb" }),
		);
	});

	it("warns when body exceeds 2000 words", () => {
		const longBody = `---
description: Do something useful
---

# Title

${"word ".repeat(2001)}`;
		const result = validate(longBody);
		expect(result.warnings).toContainEqual(expect.objectContaining({ rule: "body-max-words" }));
	});

	it("allows descriptions up to 400 chars", () => {
		const desc = `Define a component. Use when the user asks to specify a new component before building it.${" x".repeat(150)}`;
		expect(desc.length).toBeLessThanOrEqual(400);
		const result = validate(`---\ndescription: ${desc}\n---\n\n# Title\n`);
		expect(result.errors.map((e) => e.rule)).not.toContain("description-max-length");
	});
});

describe("description-has-trigger", () => {
	const triggerErrors = (desc: string) =>
		validate(`---\ndescription: ${desc}\n---\n\n# Title\n`).errors.filter(
			(e) => e.rule === "description-has-trigger",
		);

	it("accepts a ≥6-word Use-when clause and rejects 'Use when needed'", () => {
		expect(
			triggerErrors(
				"Audit API security. Use when the user asks to review API security before launch.",
			),
		).toEqual([]);
		expect(triggerErrors("Audit API security. Use when needed.")).toHaveLength(1);
	});

	it("rejects a blocklisted first word even with six or more words", () => {
		expect(
			triggerErrors("Audit API security. Use when needed for any of the teams on the project."),
		).toHaveLength(1);
		expect(
			triggerErrors(
				"Audit API security. Use when Appropriate for any of the teams on the project.",
			),
		).toHaveLength(1);
	});

	it("rejects mid-sentence Use when with <6 words", () => {
		expect(triggerErrors("Audit API security; Use when shipping an API.")).toHaveLength(1);
		expect(
			triggerErrors("Audit API security. Use when shipping. Then review the six things in a row."),
		).toHaveLength(1);
	});

	it("rejects descriptions without a Use-when clause or without a closing period", () => {
		expect(triggerErrors("Audit API security")).toHaveLength(1);
		expect(
			triggerErrors("Audit API security. Use when the user asks to review API security"),
		).toHaveLength(1);
	});
});

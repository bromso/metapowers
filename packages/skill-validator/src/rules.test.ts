import { describe, it, expect } from "vitest";
import { validateSkill, type ValidationResult } from "./rules.js";
import { parseSkill } from "./parse-skill.js";

function validate(content: string): ValidationResult {
	const parsed = parseSkill(content, "test/SKILL.md");
	return validateSkill(parsed);
}

describe("validateSkill", () => {
	const validSkill = `---
description: Define a component contract with props, variants, and states
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
		expect(result.errors).toContainEqual(
			expect.objectContaining({ rule: "description-required" })
		);
	});

	it("fails when description exceeds 200 chars", () => {
		const input = `---
description: ${"a".repeat(201)}
---

# Title

Body.`;
		const result = validate(input);
		expect(result.pass).toBe(false);
		expect(result.errors).toContainEqual(
			expect.objectContaining({ rule: "description-max-length" })
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
			expect.objectContaining({ rule: "description-starts-with-verb" })
		);
	});

	it("warns when body exceeds 2000 words", () => {
		const longBody = `---
description: Do something useful
---

# Title

${"word ".repeat(2001)}`;
		const result = validate(longBody);
		expect(result.warnings).toContainEqual(
			expect.objectContaining({ rule: "body-max-words" })
		);
	});
});

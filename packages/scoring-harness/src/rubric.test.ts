import { describe, it, expect } from "vitest";
import { scoreOutput, loadRubric, type Rubric } from "./rubric.js";

const sampleRubric: Rubric = {
	skill: "define-component",
	fixture: "button-brief.md",
	rubric: {
		has_purpose: {
			description: "Has a Purpose section",
			weight: 1,
			check: "section_exists",
			pattern: "## Purpose",
		},
		has_all_states: {
			description: "Covers all states",
			weight: 3,
			check: "content_contains_all",
			patterns: ["default", "hover", "focus", "disabled"],
		},
		no_raw_colors: {
			description: "No raw hex colors",
			weight: 3,
			check: "content_excludes",
			patterns: ["#[0-9a-fA-F]{3,8}"],
		},
	},
};

describe("scoreOutput", () => {
	it("scores a passing output", () => {
		const output = `## Purpose

A button for actions.

## States

Supports default, hover, focus, and disabled states.

Uses token color.bg.primary.`;

		const result = scoreOutput(output, sampleRubric);
		expect(result.score).toBe(1.0);
		expect(result.passed).toHaveLength(3);
		expect(result.failed).toHaveLength(0);
	});

	it("scores a partially passing output", () => {
		const output = `## Purpose

A button.

Only has default and hover.

Uses #ff0000 for the background.`;

		const result = scoreOutput(output, sampleRubric);
		expect(result.score).toBeLessThan(1.0);
		expect(result.score).toBeGreaterThan(0);
		expect(result.failed.length).toBeGreaterThan(0);
	});

	it("returns 0 for completely failing output", () => {
		const output = "Nothing useful here. Color is #ff0000.";
		const result = scoreOutput(output, sampleRubric);
		expect(result.score).toBe(0);
	});
});

describe("loadRubric", () => {
	it("loads a rubric from a JSON file", () => {
		const rubric = loadRubric(
			new URL("../../../fixtures/design-thinking/expected/button-define-sections.json", import.meta.url).pathname
		);
		expect(rubric.skill).toBe("define-component");
		expect(Object.keys(rubric.rubric).length).toBeGreaterThan(0);
	});
});

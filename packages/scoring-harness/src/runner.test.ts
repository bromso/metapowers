import { describe, it, expect } from "vitest";
import { buildScoringPrompt } from "./runner.js";

describe("buildScoringPrompt", () => {
	it("constructs a prompt from skill and fixture", () => {
		const skillContent = "---\ndescription: Define a component\n---\n\n# Define\n\nInstructions.";
		const fixtureContent = "# Button Brief\n\nA button component.";
		const prompt = buildScoringPrompt(skillContent, fixtureContent);

		expect(prompt).toContain("# Define");
		expect(prompt).toContain("# Button Brief");
		expect(prompt).toContain("Instructions.");
	});
});

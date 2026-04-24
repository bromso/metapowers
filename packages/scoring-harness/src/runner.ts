import Anthropic from "@anthropic-ai/sdk";
import { readFileSync } from "node:fs";
import { loadRubric, scoreOutput, type ScoreResult } from "./rubric.js";

export function buildScoringPrompt(skillContent: string, fixtureContent: string): string {
	return `You are scoring a skill. Execute the skill instructions against the provided fixture input. Produce ONLY the skill output — no commentary, no explanation.

## Skill Instructions

${skillContent}

## Input (Fixture)

${fixtureContent}

## Task

Execute the skill instructions above against the input. Produce the output artifact exactly as the skill describes.`;
}

export interface ScoringRunResult {
	skill: string;
	fixture: string;
	output: string;
	score: ScoreResult;
	sha: string;
}

export async function runScoring(options: {
	skillPath: string;
	fixturePath: string;
	rubricPath: string;
	sha: string;
}): Promise<ScoringRunResult> {
	const skillContent = readFileSync(options.skillPath, "utf-8");
	const fixtureContent = readFileSync(options.fixturePath, "utf-8");
	const rubric = loadRubric(options.rubricPath);

	const prompt = buildScoringPrompt(skillContent, fixtureContent);

	const client = new Anthropic();
	const response = await client.messages.create({
		model: "claude-sonnet-4-20250514",
		max_tokens: 4096,
		messages: [{ role: "user", content: prompt }],
	});

	const output = response.content
		.filter((block) => block.type === "text")
		.map((block) => block.text)
		.join("\n");

	const score = scoreOutput(output, rubric);

	return {
		skill: rubric.skill,
		fixture: rubric.fixture,
		output,
		score,
		sha: options.sha,
	};
}

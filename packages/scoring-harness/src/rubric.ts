import { readFileSync } from "node:fs";

export interface RubricCheck {
	description: string;
	weight: number;
	check:
		| "section_exists"
		| "section_contains"
		| "content_contains_all"
		| "content_contains_any"
		| "content_excludes";
	pattern?: string;
	patterns?: string[];
	section?: string;
}

export interface Rubric {
	skill: string;
	fixture: string;
	rubric: Record<string, RubricCheck>;
}

export interface CheckResult {
	name: string;
	description: string;
	passed: boolean;
	weight: number;
}

export interface ScoreResult {
	score: number;
	maxScore: number;
	earnedScore: number;
	passed: CheckResult[];
	failed: CheckResult[];
}

function runCheck(output: string, check: RubricCheck): boolean {
	switch (check.check) {
		case "section_exists":
			return output.includes(check.pattern!);

		case "section_contains": {
			const sectionIdx = output.indexOf(check.section!);
			if (sectionIdx === -1) return false;
			const sectionContent = output.slice(sectionIdx);
			return check.patterns?.every((p) => sectionContent.includes(p)) ?? false;
		}

		case "content_contains_all":
			return (
				check.patterns?.every((p) => {
					const regex = new RegExp(p, "i");
					return regex.test(output);
				}) ?? false
			);

		case "content_contains_any":
			return (
				check.patterns?.some((p) => {
					const regex = new RegExp(p, "i");
					return regex.test(output);
				}) ?? false
			);

		case "content_excludes":
			return (
				check.patterns?.every((p) => {
					const regex = new RegExp(p, "gi");
					return !regex.test(output);
				}) ?? false
			);

		default:
			return false;
	}
}

export function scoreOutput(output: string, rubric: Rubric): ScoreResult {
	const passed: CheckResult[] = [];
	const failed: CheckResult[] = [];
	let maxScore = 0;
	let earnedScore = 0;

	for (const [name, check] of Object.entries(rubric.rubric)) {
		maxScore += check.weight;
		const didPass = runCheck(output, check);
		const result: CheckResult = {
			name,
			description: check.description,
			passed: didPass,
			weight: check.weight,
		};

		if (didPass) {
			earnedScore += check.weight;
			passed.push(result);
		} else {
			failed.push(result);
		}
	}

	return {
		score: maxScore > 0 ? earnedScore / maxScore : 0,
		maxScore,
		earnedScore,
		passed,
		failed,
	};
}

export function loadRubric(filePath: string): Rubric {
	const content = readFileSync(filePath, "utf-8");
	return JSON.parse(content) as Rubric;
}

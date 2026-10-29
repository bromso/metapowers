import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseSkill, validateSkill } from "@singularskills/skill-validator";
import { describe, expect, it } from "vitest";
import { loadWorkflows } from "./workflows.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "../../..");
const skillFile = (name: string) => path.join(repoRoot, "skills", name, "SKILL.md");
const read = (file: string) => (existsSync(file) ? readFileSync(file, "utf-8") : "");

describe("the workflow conductor skill", () => {
	const content = read(skillFile("workflow"));
	const parsed = parseSkill(content, skillFile("workflow"));
	const body = parsed.body;

	it("exists", () => {
		expect(content).not.toBe("");
	});

	it("has only name, description and metadata.argument-hint in its frontmatter", () => {
		expect(Object.keys(parsed.frontmatter).sort()).toEqual(["description", "metadata", "name"]);
		expect(parsed.frontmatter.name).toBe("workflow");
		expect(parsed.frontmatter.metadata).toEqual({ "argument-hint": "<workflow> <project>" });
	});

	it("has a description the validator accepts (verb-first, Use when, 120–400 chars)", () => {
		const description = String(parsed.frontmatter.description ?? "");
		expect(description.length).toBeGreaterThanOrEqual(120);
		expect(description.length).toBeLessThanOrEqual(400);
		expect(description).toMatch(/^Run /);
		expect(description).toMatch(/Use when /);
		expect(validateSkill(parsed).errors).toEqual([]);
	});

	it("stops after each phase and asks for approval before continuing", () => {
		expect(body).toMatch(/\*\*Stop\.\*\*/);
		expect(body).toMatch(/Nothing proceeds without an answer/);
	});

	it("records an approval as a phase-approved run-log line", () => {
		expect(body).toMatch(/"event":"phase-approved"/);
		expect(body).toMatch(/complete only when the run log holds a `phase-approved`/);
	});

	it("resumes at the first unapproved phase", () => {
		expect(body).toMatch(/Resuming is the same command/);
		expect(body).toMatch(/first unapproved phase/);
	});

	it("runs every member in listed order by default and accepts a subset named by the user", () => {
		expect(body).toMatch(/run all of them in the listed order/);
		expect(body).toMatch(/subset/);
	});

	it("never writes an artifact itself and never skips a gate", () => {
		expect(body).toMatch(/never writes an artifact itself/);
		expect(body).toMatch(/never skips a gate/);
	});

	it("also writes run-started and run-finished lines", () => {
		expect(body).toMatch(/"event":"run-started"/);
		expect(body).toMatch(/"event":"run-finished"/);
	});

	it("finds the workflow file next to skills/ first, then in its bundled references", () => {
		expect(body).toMatch(/the `workflows\/` folder next to the `skills\/` folder of this pack/);
		expect(body).toMatch(
			/if it is not there, the `workflows\/<name>\.yml` file bundled in this skill's `references\/`/,
		);
	});

	it("links every workflow file as a reference", () => {
		const names = loadWorkflows(path.join(repoRoot, "workflows")).map((wf) => wf.name);
		expect(names.length).toBeGreaterThan(0);
		for (const name of names) expect(body).toContain(`\`references/workflows/${name}.yml\``);
	});

	it("points readers at the run-log reference", () => {
		expect(body).toContain("`references/run-log.md`");
		expect(read(path.join(repoRoot, "skills", "workflow", "references", "run-log.md"))).toMatch(
			/phase-approved/,
		);
	});
});

describe("status and report read the run log", () => {
	it("singular-status reports approved, written or missing per phase", () => {
		const body = read(skillFile("singular-status"));
		expect(body).toContain(".singularskills/log.jsonl");
		expect(body).toMatch(/approved/);
		expect(body).toMatch(/written/);
		expect(body).toMatch(/missing/);
	});

	it("singular-report reads artifact frontmatter and Decisions sections", () => {
		const body = read(skillFile("singular-report"));
		expect(body).toContain(".singularskills/log.jsonl");
		expect(body).toMatch(/frontmatter/);
		expect(body).toMatch(/\*\*Decisions\*\*/);
		expect(body).toContain(".singularskills/reports/<project>-report.md");
	});
});

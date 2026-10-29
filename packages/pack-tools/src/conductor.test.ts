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

	it("decides 'written' per member of this phase, not by the file existing", () => {
		expect(body).toMatch(/Written is decided per member, not by the file existing/);
		expect(body).toMatch(/exists and its frontmatter `skill` is that member/);
		expect(body).toMatch(/has that member's own `## <Skill title>` section/);
		expect(body).toMatch(
			/The phase is \*\*written\*\* when every member of this phase has written/,
		);
	});

	it("counts an artifact with no frontmatter (or a section without its italic opener) as written before the run log, and offers it for approval", () => {
		expect(body).toMatch(/An artifact that exists but has \*\*no frontmatter\*\*/);
		expect(body).toMatch(/a member's `## <Skill title>` section without the italic opener/);
		expect(body).toMatch(/was written before the run log existed/);
		expect(body).toMatch(/never re-run the member for it/);
		expect(body).toMatch(/\*\*Written-unlogged\*\*[^\n]*do not re-run that member/);
		expect(body).toMatch(
			/report the phase as written-unlogged and go to step 4 to offer it for approval/,
		);
	});

	it("reports skipped and refused lines by project and by the run's name or any member's folder", () => {
		expect(body).toMatch(
			/keep the `refused` and `skipped` lines whose `project` matches and whose `workflow` is either this workflow's name or the folder of any of its phases/,
		);
		expect(body).toMatch(
			/Every `refused` or `skipped` line kept in step 1 \(its `project` matches and its `workflow` is this workflow's name or any member's folder\)/,
		);
	});

	it("on resume with some members written, asks before running the rest", () => {
		expect(body).toMatch(/do not assume the rest should run/);
		expect(body).toMatch(
			/ask whether to run the remaining members or approve the phase as it stands/,
		);
	});

	it("infers the workflow and project from the request when $ARGUMENTS is empty", () => {
		expect(body).toMatch(/If `\$ARGUMENTS` is empty/);
		expect(body).toMatch(/take the workflow and project from the user's request instead/);
		expect(body).toMatch(/match a workflow by its name or its title/);
		expect(body).toMatch(/Ask only if they cannot be found/);
	});

	it("ends the run on a gate refusal and on completion only for its own run", () => {
		expect(body).toMatch(/append `run-finished` with a note naming the refusal/);
		expect(body).toMatch(/`complete` only if this conversation appended `run-started`/);
	});

	it("passes a user-requested bypass on to the member, never on its own", () => {
		expect(body).toMatch(/If the user then explicitly asks to bypass it/);
		expect(body).toMatch(/followed by its skip-checks flag/);
		expect(body).toMatch(/This holds for every member, one or several/);
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

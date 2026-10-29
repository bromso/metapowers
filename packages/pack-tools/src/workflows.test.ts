import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, test } from "vitest";
import type { SkillFile } from "./skills.js";
import { listSkills } from "./skills.js";
import { type Workflow, checkWorkflows, loadWorkflows } from "./workflows.js";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const workflowsDir = path.join(repoRoot, "workflows");

/** A skill whose frontmatter carries `metadata` (omitted when `metadata` is undefined). */
function skill(name: string, metadata?: { workflow: string; phase: number }): SkillFile {
	const meta = metadata
		? `metadata:\n  workflow: ${metadata.workflow}\n  phase: ${metadata.phase}\n`
		: "";
	return {
		name,
		domain: name.split("-")[0],
		path: `skills/${name}/SKILL.md`,
		content: `---\nname: ${name}\ndescription: Do it.\n${meta}---\n\n# ${name}\n`,
	};
}

/** A two-phase design workflow; `requires` for phase 2 is overridable. */
function design(requires = ["01-empathize.md"]): Workflow {
	return {
		name: "design",
		title: "Design Thinking",
		folder: "design",
		phases: [
			{
				phase: 1,
				title: "Empathize",
				artifact: "01-empathize.md",
				requires: [],
				skills: ["design-empathize"],
			},
			{
				phase: 2,
				title: "Define",
				artifact: "02-define.md",
				requires,
				skills: ["design-define-component"],
			},
		],
	};
}

const designSkills = () => [
	skill("design-empathize", { workflow: "design", phase: 1 }),
	skill("design-define-component", { workflow: "design", phase: 2 }),
];

describe("loadWorkflows", () => {
	test("loadWorkflows parses design.yml with five phases in order", () => {
		const wf = loadWorkflows(workflowsDir).find((w) => w.name === "design");
		expect(wf?.phases.map((p) => p.artifact)).toEqual([
			"01-empathize.md",
			"02-define.md",
			"03-ideate.md",
			"04-prototype.md",
			"05-test.md",
		]);
		expect(wf?.phases[3].requires).toEqual(["02-define.md", "03-ideate.md"]);
	});

	test("loads all 19 workflow files, compliance phase 1 naming its folder", () => {
		const workflows = loadWorkflows(workflowsDir);
		expect(workflows).toHaveLength(19);
		const compliance = workflows.find((w) => w.name === "compliance");
		expect(compliance?.phases.find((p) => p.phase === 1)?.artifact).toBe("01-assess/");
	});

	test("an approval-only phase loads with its artifact undefined", () => {
		const feature = loadWorkflows(workflowsDir).find((w) => w.name === "build-feature");
		const ship = feature?.phases.find((p) => p.skills.includes("development-ship"));
		expect(ship).toBeDefined();
		expect(ship?.artifact).toBeUndefined();
	});

	test("every workflow is internally consistent (requires and phase numbers)", () => {
		const violations = checkWorkflows(loadWorkflows(workflowsDir), []).filter(
			(v) => !v.includes("names unknown skill"),
		);
		expect(violations).toEqual([]);
	});
});

describe("checkWorkflows", () => {
	test("is clean for a consistent workflow and its members", () => {
		expect(checkWorkflows([design()], designSkills())).toEqual([]);
	});

	test("checkWorkflows flags a requires that nothing produces", () => {
		expect(checkWorkflows([design(["09-x.md"])], designSkills())).toEqual([
			"design: phase 2 requires 09-x.md which no earlier phase produces",
		]);
	});

	test("flags a requires produced only by the same or a later phase", () => {
		expect(checkWorkflows([design(["02-define.md"])], designSkills())).toEqual([
			"design: phase 2 requires 02-define.md which no earlier phase produces",
		]);
	});

	test("flags an empty-string artifact", () => {
		const wf = design();
		wf.phases[1] = { ...wf.phases[1], artifact: "" };
		expect(checkWorkflows([wf], designSkills())).toEqual(["design: phase 2 has an empty artifact"]);
	});

	test("flags a member that is not a skill in the pack", () => {
		expect(checkWorkflows([design()], [designSkills()[0]])).toEqual([
			"design: phase 2 names unknown skill design-define-component",
		]);
	});

	test("checkWorkflows flags a member whose metadata names another workflow", () => {
		const skills = [
			skill("design-empathize", { workflow: "research", phase: 1 }),
			designSkills()[1],
		];
		const research: Workflow = { ...design(), name: "research", folder: "research" };
		research.phases = [{ ...research.phases[0], skills: ["research-discover"] }];
		const all = [...skills, skill("research-discover", { workflow: "research", phase: 1 })];
		expect(checkWorkflows([design(), research], all)).toEqual([
			"design-empathize: listed in design phase 1 but metadata says research phase 1",
		]);
	});

	test("flags a member with no workflow metadata", () => {
		const skills = [skill("design-empathize"), designSkills()[1]];
		expect(checkWorkflows([design()], skills)).toEqual([
			"design-empathize: listed in design phase 1 but metadata says nothing",
		]);
	});

	test("flags metadata naming a workflow with no file", () => {
		const skills = [...designSkills(), skill("design-ideate", { workflow: "ideas", phase: 1 })];
		expect(checkWorkflows([design()], skills)).toEqual([
			"design-ideate: metadata.workflow ideas has no workflow file",
		]);
	});

	test("flags metadata naming a phase the workflow does not have", () => {
		const skills = [...designSkills(), skill("design-ideate", { workflow: "design", phase: 7 })];
		expect(checkWorkflows([design()], skills)).toEqual([
			"design-ideate: metadata.phase 7 is not a phase of design",
		]);
	});

	test("does not check metadata for steps of a cross-domain workflow (phases with a folder)", () => {
		const feature: Workflow = {
			name: "build-feature",
			title: "Build a Feature",
			folder: "build-feature",
			phases: [
				{
					phase: 1,
					title: "Understand the problem space",
					folder: "design",
					artifact: "02-define.md",
					requires: [],
					skills: ["design-define-component"],
				},
				{
					phase: 2,
					title: "Merge",
					folder: "development",
					requires: [],
					skills: ["development-ship"],
				},
			],
		};
		const skills = [...designSkills(), skill("development-ship")];
		expect(checkWorkflows([design(), feature], skills)).toEqual([]);
	});
});

// TODO Task 3: un-skip once the skills live at skills/<domain>-<skill>/ with metadata.
test.skip("every workflow file in the repo is clean against the pack", () => {
	expect(
		checkWorkflows(loadWorkflows(workflowsDir), listSkills(path.join(repoRoot, "skills"))),
	).toEqual([]);
});

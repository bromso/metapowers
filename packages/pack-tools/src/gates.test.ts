import { spawnSync } from "node:child_process";
import {
	existsSync,
	mkdirSync,
	mkdtempSync,
	readFileSync,
	readdirSync,
	rmSync,
	statSync,
	writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, beforeEach, describe, expect, test } from "vitest";
import { genGates } from "./gates.js";
import { GATE_STEP } from "./skill-text.js";
import { listSkills } from "./skills.js";
import { type Workflow, loadWorkflows } from "./workflows.js";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");

let tmp: string;
beforeEach(() => {
	tmp = mkdtempSync(path.join(tmpdir(), "pack-tools-gates-"));
});
afterEach(() => rmSync(tmp, { recursive: true, force: true }));

function write(file: string, content: string): void {
	mkdirSync(path.dirname(file), { recursive: true });
	writeFileSync(file, content);
}

/** A pack under `tmp/repo` with one SKILL.md per name. */
function pack(names: string[]): string {
	const root = path.join(tmp, "repo");
	for (const name of names) write(path.join(root, "skills", name, "SKILL.md"), `# ${name}\n`);
	return root;
}

const design: Workflow = {
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
			requires: ["01-empathize.md"],
			skills: ["design-define"],
		},
		{ phase: 3, title: "Approve", requires: ["02-define.md"], skills: ["design-approve"] },
	],
};

const compliance: Workflow = {
	name: "compliance",
	title: "Compliance",
	folder: "compliance",
	phases: [
		{
			phase: 1,
			title: "Assess",
			artifact: "01-assess/",
			requires: [],
			skills: ["compliance-gdpr"],
		},
		{
			phase: 2,
			title: "Remediate",
			artifact: "02-remediate.md",
			requires: ["01-assess/"],
			skills: ["compliance-remediate"],
		},
	],
};

const crossDomain: Workflow = {
	name: "build-feature",
	title: "Build a Feature",
	folder: "build-feature",
	phases: [
		{
			phase: 1,
			title: "Define",
			folder: "design",
			artifact: "02-define.md",
			requires: ["01-empathize.md"],
			skills: ["design-empathize"],
		},
	],
};

const gatePath = (root: string, name: string) =>
	path.join(root, "skills", name, "scripts", "gate.sh");

function run(gate: string, project: string, root: string) {
	return spawnSync("sh", [gate, project, root], { encoding: "utf-8" });
}

describe("gate.sh", () => {
	test("exits 1 and names the missing artifact, then 0 once it exists", () => {
		const root = pack(["design-empathize", "design-define", "design-approve"]);
		genGates(root, [design], { check: false });
		const gate = gatePath(root, "design-define");
		const failed = run(gate, "date-picker.v2", tmp);
		expect(failed.status).toBe(1);
		expect(failed.stderr).toContain("gate: date-picker.v2 needs 01-empathize.md first");
		write(path.join(tmp, ".singularskills/design/date-picker.v2/01-empathize.md"), "");
		expect(run(gate, "date-picker.v2", tmp).status).toBe(1);
		writeFileSync(path.join(tmp, ".singularskills/design/date-picker.v2/01-empathize.md"), "x");
		const passed = run(gate, "date-picker.v2", tmp);
		expect(passed.status).toBe(0);
		expect(passed.stderr).toBe("");
	});

	test("a folder artifact counts as present only with a file inside", () => {
		const root = pack(["compliance-gdpr", "compliance-remediate"]);
		genGates(root, [compliance], { check: false });
		const gate = gatePath(root, "compliance-remediate");
		const assess = path.join(tmp, ".singularskills/compliance/acme/01-assess");
		expect(run(gate, "acme", tmp).stderr).toContain("gate: acme needs 01-assess/ first");
		mkdirSync(path.join(assess, "empty"), { recursive: true });
		expect(run(gate, "acme", tmp).status).toBe(1);
		writeFileSync(path.join(assess, "gdpr.md"), "x");
		expect(run(gate, "acme", tmp).status).toBe(0);
	});

	test("lists every missing artifact and defaults root to the working directory", () => {
		const root = pack(["design-prototype"]);
		const wf: Workflow = {
			...design,
			phases: [
				{
					phase: 4,
					title: "Prototype",
					artifact: "04-prototype.md",
					requires: ["02-define.md", "03-ideate.md"],
					skills: ["design-prototype"],
				},
			],
		};
		genGates(root, [wf], { check: false });
		const result = spawnSync("sh", [gatePath(root, "design-prototype"), "p"], {
			cwd: tmp,
			encoding: "utf-8",
		});
		expect(result.status).toBe(1);
		expect(result.stderr).toContain("gate: p needs 02-define.md, 03-ideate.md first");
		expect(spawnSync("sh", [gatePath(root, "design-prototype")]).status).toBe(2);
	});
});

describe("genGates", () => {
	test("writes scripts for gated members only and removes stale ones", () => {
		const names = ["design-empathize", "design-define", "design-approve", "design-other"];
		const root = pack(names);
		write(gatePath(root, "design-other"), "#!/bin/sh\nexit 0\n");

		expect(genGates(root, [design, crossDomain], { check: true }).sort()).toEqual([
			"skills/design-define/scripts/gate.sh",
			"skills/design-other/scripts/gate.sh",
		]);
		expect(existsSync(gatePath(root, "design-define"))).toBe(false);

		expect(genGates(root, [design, crossDomain], { check: false }).sort()).toEqual([
			"skills/design-define/scripts/gate.sh",
			"skills/design-other/scripts/gate.sh",
		]);
		const script = readFileSync(gatePath(root, "design-define"), "utf-8");
		expect(script.startsWith("#!/bin/sh\n")).toBe(true);
		expect(script).toContain("REQUIRED='01-empathize.md'");
		expect(script).toContain("FOLDER='design'");
		expect(statSync(gatePath(root, "design-define")).mode & 0o777).toBe(0o755);
		for (const name of ["design-empathize", "design-approve", "design-other"]) {
			expect(existsSync(path.join(root, "skills", name, "scripts"))).toBe(false);
		}
		expect(genGates(root, [design, crossDomain], { check: true })).toEqual([]);
	});

	test("--check reports a script whose mode drifted", () => {
		const root = pack(["design-empathize", "design-define", "design-approve"]);
		genGates(root, [design], { check: false });
		spawnSync("chmod", ["644", gatePath(root, "design-define")]);
		expect(genGates(root, [design], { check: true })).toEqual([
			"skills/design-define/scripts/gate.sh",
		]);
	});
});

describe("the real pack", () => {
	const skills = listSkills(path.join(repoRoot, "skills"));
	const workflows = loadWorkflows(path.join(repoRoot, "workflows"));

	test("is in sync with the workflows", () => {
		expect(genGates(repoRoot, workflows, { check: true })).toEqual([]);
	});

	test("a skill ships a gate script exactly when its Prerequisites open with the gate step", () => {
		for (const skill of skills) {
			const dir = path.dirname(skill.path);
			const prerequisites = /^## Prerequisites\n\n(.*)$/m.exec(skill.content)?.[1];
			expect(existsSync(path.join(dir, "scripts/gate.sh")), skill.name).toBe(
				prerequisites?.startsWith(GATE_STEP) ?? false,
			);
			if (!existsSync(path.join(dir, "scripts/gate.sh"))) {
				expect(skill.content, skill.name).not.toContain("scripts/gate.sh");
			}
		}
	});

	test("every gate script parses with sh -n", () => {
		const gates = readdirSync(path.join(repoRoot, "skills"))
			.map((name) => gatePath(repoRoot, name))
			.filter((file) => existsSync(file));
		expect(gates.length).toBeGreaterThan(0);
		for (const gate of gates) expect(spawnSync("sh", ["-n", gate]).status, gate).toBe(0);
	});
});

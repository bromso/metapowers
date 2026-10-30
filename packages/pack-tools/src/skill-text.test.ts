import path from "node:path";
import { fileURLToPath } from "node:url";
import { handoffParagraph as validatorHandoff } from "@singularskills/skill-validator";
import { describe, expect, test } from "vitest";
import { ARGS_PARAGRAPH } from "./args.js";
import { DISCLAIMER_INSTRUCTION } from "./content-blocks.js";
import {
	GATE_STEP,
	HANDOFF_MARKER,
	fixSkillText,
	fixWorkflowsBlock,
	handoffParagraph,
	memberships,
	workflowsBlock,
} from "./skill-text.js";
import { type SkillFile, listSkills } from "./skills.js";
import { type Phase, type Workflow, loadWorkflows } from "./workflows.js";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");

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
			skills: ["design-define-component"],
		},
	],
};
const strategy: Phase = {
	phase: 0,
	title: "Strategy",
	artifact: "00-strategy.md",
	requires: [],
	skills: ["marketing-customer-research", "marketing-pricing-strategy"],
};
const act: Phase = {
	phase: 2,
	title: "Act",
	artifact: "02-act.md",
	requires: ["00-strategy.md"],
	skills: ["marketing-copywriting", "marketing-page-cro"],
};
const marketing: Workflow = {
	name: "marketing",
	title: "RACE Framework",
	folder: "marketing",
	phases: [strategy, act],
};
const workflows = [design, marketing];

const LEGACY_GATE =
	"Run `scripts/gate.sh <project>` from this skill's folder. If it exits non-zero, stop and tell the user what it printed (unless `--skip-checks`, see Arguments).";

function frontmatter(name: string, metadata: string): string {
	return `---\nname: ${name}\ndescription: Do it.\nmetadata:\n  argument-hint: "[project] [--skip-checks]"\n${metadata}---\n`;
}

function skill(name: string, metadata: string, body: string): SkillFile {
	const domain = name.slice(0, name.indexOf("-"));
	return {
		name,
		domain,
		path: `/r/skills/${name}/SKILL.md`,
		content: frontmatter(name, metadata) + body,
	};
}

const args = (domain: string) => ARGS_PARAGRAPH(domain, "first-token");

const defineBody = `
# Define Component

${args("design")}

## Prerequisites

${LEGACY_GATE}

Read \`.singularskills/design/<project>/01-empathize.md\`.

## Process

1. **Write the artifact** to \`.singularskills/design/<project>/02-define.md\`

## Output

The component contract.
`;
const define = skill(
	"design-define-component",
	"  workflow: design\n  phase: 2\n  artifact: 02-define.md\n",
	defineBody,
);

const sharedBody = (title: string) => `
# ${title}

${args("marketing")}

## Prerequisites

None.

## Process

1. **Write the artifact** — append to \`.singularskills/marketing/<project>/0x.md\` under a \`## ${title}\` section.

## Output

Appended.
`;
const copywriting = skill(
	"marketing-copywriting",
	"  workflow: marketing\n  phase: 2\n  artifact: 02-act.md\n",
	sharedBody("Copywriting"),
);
const research = skill(
	"marketing-customer-research",
	"  workflow: marketing\n  phase: 0\n  artifact: 00-strategy.md\n",
	sharedBody("Customer Research"),
);
const utility = skill(
	"development-debug",
	"",
	`\n# Debug\n\n${args("development")}\n\n## Output\n\nA fix.\n`,
);

const fix = fixSkillText(workflows);

describe("fix-skill-text: the Arguments paragraph", () => {
	test("a phase member's skipped line carries its name, folder, phase and artifact", () => {
		expect(fix(define)).toContain(
			'`{"ts":"<ISO timestamp>","skill":"design-define-component","workflow":"design","phase":2,"project":"<project>","event":"skipped","artifact":"02-define.md","note":"<reason or \\"none given\\">"}`',
		);
	});

	test("a utility's skipped line has a null phase and keeps the artifact placeholder", () => {
		expect(fix(utility)).toContain(
			'"skill":"development-debug","workflow":"development","phase":null,"project":"<project>","event":"skipped","artifact":"<artifact file>"',
		);
	});
});

const DEFINE_LINE = (event: string, note = "") =>
	`\`{"ts":"<ISO timestamp>","skill":"design-define-component","workflow":"design","phase":2,"project":"<project>","event":"${event}","artifact":"02-define.md","note":"${note}"}\``;

/** The first paragraph of `## Prerequisites` after the handoff paragraph that opens every member's section. */
const firstPrerequisite = (content: string) =>
	/^## Prerequisites\n\n(?:\*\*Part of a workflow\.\*\*[^\n]*\n\n)?(.*)$/m.exec(content)?.[1];

describe("fix-skill-text: the gate-and-start step", () => {
	test("a gated member's Prerequisites open with the gate, then refused, then started", () => {
		const out = fix(define);
		expect(out).not.toContain(LEGACY_GATE);
		const first = firstPrerequisite(out) ?? "";
		expect(first.startsWith(GATE_STEP)).toBe(true);
		expect(GATE_STEP).toContain(
			"`sh <this skill's folder>/scripts/gate.sh <project> <project root>`",
		);
		expect(GATE_STEP).toContain("the folder that contains `.singularskills/`");
		const gate = first.indexOf("gate.sh");
		const refused = first.indexOf(DEFINE_LINE("refused", "<what the gate printed>"));
		const skipped = first.indexOf("once you have appended the `skipped` line");
		const started = first.indexOf(DEFINE_LINE("started"));
		expect(gate).toBeGreaterThanOrEqual(0);
		expect(refused).toBeGreaterThan(gate);
		expect(skipped).toBeGreaterThan(refused);
		expect(started).toBeGreaterThan(skipped);
		expect(out).toContain(`${first}\n\nRead \``);
	});

	test("adds the step to a gated member without one, and only once", () => {
		const out = fix(copywriting);
		expect(firstPrerequisite(out)?.startsWith(GATE_STEP)).toBe(true);
		expect(out).not.toContain("None.");
		expect(out.split(GATE_STEP)).toHaveLength(2);
	});

	test("an ungated member's Prerequisites open with one started sentence and no gate", () => {
		const out = fix(research);
		expect(out).not.toContain("gate.sh");
		expect(firstPrerequisite(out)).toBe(
			'Before you start work, append this line to `.singularskills/log.jsonl` (create the folder and file if missing): `{"ts":"<ISO timestamp>","skill":"marketing-customer-research","workflow":"marketing","phase":0,"project":"<project>","event":"started","artifact":"00-strategy.md","note":""}`.',
		);
		expect(out).not.toContain('"event":"refused"');
	});

	test("replaces a gate step on a member whose phase is no longer gated", () => {
		const out = fix({ ...research, content: research.content.replace("None.", LEGACY_GATE) });
		expect(out).not.toContain("gate.sh");
		expect(firstPrerequisite(out)).toMatch(/^Before you start work, append this line/);
		expect(out).toMatch(/started","artifact":"00-strategy\.md","note":""\}`\.\n\n## Process/);
	});

	test("utilities get no step and lose one they had", () => {
		expect(fix(utility)).not.toContain("gate.sh");
		expect(fix(utility)).not.toContain('"event":"started"');
		const stale = utility.content.replace(
			"## Output",
			`## Prerequisites\n\n${firstPrerequisite(fix(define))}\n\n## Output`,
		);
		const out = fix({ ...utility, content: stale });
		expect(out).not.toContain("gate.sh");
		expect(out).toContain("## Prerequisites\n\nNone.\n\n## Output");
	});
});

const empathize = skill(
	"design-empathize",
	"  workflow: design\n  phase: 1\n  artifact: 01-empathize.md\n",
	`\n# Empathize\n\n${args("design")}\n\n## Prerequisites\n\nNone — this is the first phase.\n\n## Process\n\n1. Write it.\n\n## Output\n\nThe brief.\n`,
);

const HANDOFF_COMMON = (phase: number, title: string) =>
	`**Part of a workflow.** This skill is phase ${phase} (${title}) of the Design Thinking workflow (\`design\`); cross-domain workflows run it too. First check \`.singularskills/log.jsonl\` for an open run for this project: a \`run-started\` line with \`"project":"<project>"\` and no later \`run-finished\` line for the same \`workflow\` and \`project\`. If one exists, the conductor is running you: continue here. Otherwise, if the user asked to start, run, continue or resume a process or workflow rather than this one step, do not continue here: invoke the \`workflow\` skill with the workflow the user asked for, or \`design\` when they named none, followed by \`<project>\`; it runs this phase in order, asks before it writes and records the run.`;
const DESIGN_EMPATHIZE_HANDOFF = `${HANDOFF_COMMON(1, "Empathize")} Otherwise, unless the user named this skill, ask one question, since this is the first phase of its workflow: "Just this step, or the whole Design Thinking workflow?" End your turn and wait; on the whole workflow, hand off the same way; on just this step, continue here.`;
const DESIGN_DEFINE_HANDOFF = `${HANDOFF_COMMON(2, "Define")} Otherwise continue here: a later phase runs on its own, behind its gate.`;

/** The paragraphs of `## Prerequisites`, in order. */
const prerequisites = (content: string) =>
	/^## Prerequisites\n\n([\s\S]*?)\n\n## /m
		.exec(content)?.[1]
		.split("\n\n")
		.filter((p) => p.trim() !== "") ?? [];

describe("fix-skill-text: the handoff paragraph", () => {
	const designMember = { workflow: design, phase: design.phases[0], name: "design-empathize" };
	const defineMember = {
		workflow: design,
		phase: design.phases[1],
		name: "design-define-component",
	};

	test("renders design-empathize's first-phase paragraph exactly", () => {
		expect(handoffParagraph(designMember)).toBe(DESIGN_EMPATHIZE_HANDOFF);
	});

	test("renders design-define-component's later-phase paragraph exactly", () => {
		expect(handoffParagraph(defineMember)).toBe(DESIGN_DEFINE_HANDOFF);
		expect(DESIGN_DEFINE_HANDOFF).not.toContain("Just this step");
	});

	test("checks the open run before intent, so the conductor's own run never loops", () => {
		const text = handoffParagraph(designMember);
		const openRun = text.indexOf("If one exists, the conductor is running you: continue here.");
		const intent = text.indexOf("if the user asked to start, run, continue or resume");
		expect(openRun).toBeGreaterThan(0);
		expect(intent).toBeGreaterThan(openRun);
	});

	test("names the project only, never the member's workflow, in the open-run check", () => {
		const text = handoffParagraph(designMember);
		expect(text).toContain(
			'a `run-started` line with `"project":"<project>"` and no later `run-finished` line',
		);
		expect(text).not.toContain('"workflow":"design"');
	});

	test("puts the paragraph first in Prerequisites, before the gate step", () => {
		const [first, second] = prerequisites(fix(define));
		expect(first).toMatch(/^\*\*Part of a workflow\.\*\* This skill is phase 2 \(Define\)/);
		expect(second?.startsWith(GATE_STEP)).toBe(true);
	});

	test("replaces a 'None.' section and creates a missing section", () => {
		const out = fix(copywriting);
		expect(out).not.toContain("None.");
		expect(prerequisites(out)[0]).toMatch(
			/^\*\*Part of a workflow\.\*\* This skill is phase 2 \(Act\)/,
		);
		const noSection = {
			...empathize,
			content: empathize.content.replace(
				/## Prerequisites\n\nNone — this is the first phase\.\n\n/,
				"",
			),
		};
		expect(fix(noSection)).toMatch(
			/^## Prerequisites\n\n\*\*Part of a workflow\.\*\* This skill is phase 1 \(Empathize\)/m,
		);
	});

	test("regenerates the spike wording and is idempotent", () => {
		const spike =
			"**Part of a workflow.** This skill is phase 1 (Empathize) of the Design Thinking workflow. Unless the user invoked this skill by name, check the log.";
		const withSpike = {
			...empathize,
			content: empathize.content.replace("None — this is the first phase.", spike),
		};
		const once = fix(withSpike);
		expect(once).not.toContain("Unless the user invoked this skill by name");
		expect(once.split(HANDOFF_MARKER)).toHaveLength(2);
		expect(prerequisites(once)[0]).toBe(DESIGN_EMPATHIZE_HANDOFF);
		expect(fix({ ...withSpike, content: once })).toBe(once);
	});

	test("removes the paragraph from a skill with no membership", () => {
		const stale = utility.content.replace(
			"## Output",
			`## Prerequisites\n\n${DESIGN_EMPATHIZE_HANDOFF}\n\n## Output`,
		);
		const out = fix({ ...utility, content: stale });
		expect(out).not.toContain(HANDOFF_MARKER);
		expect(out).toContain("## Prerequisites\n\nNone.\n\n## Output");
	});

	test("matches the validator's handoffParagraph for every member of the real pack", () => {
		const real = loadWorkflows(path.join(repoRoot, "workflows"));
		const members = memberships(real);
		expect(members.size).toBe(218);
		for (const m of members.values()) {
			expect(handoffParagraph(m), m.name).toBe(
				validatorHandoff({
					phase: m.phase.phase,
					phaseTitle: m.phase.title,
					workflowTitle: m.workflow.title,
					workflowName: m.workflow.name,
					first: m.phase === m.workflow.phases[0],
				}),
			);
		}
	});

	test("a gated member keeps the handoff, gate and started order", () => {
		const [first, second] = prerequisites(fix(define));
		expect(first).toBe(handoffParagraph(defineMember));
		expect(second).toContain(DEFINE_LINE("started"));
	});
});

describe("fix-skill-text: the conductor's workflows block", () => {
	const real = loadWorkflows(path.join(repoRoot, "workflows"));
	const before =
		"## Files\n\nprose\n\n<!-- workflows:start -->\nold\n<!-- workflows:end -->\n\n## Run-log lines you write\n\nkeep\n";

	test("renders the design workflow's rows", () => {
		const block = workflowsBlock(real).join("\n");
		expect(block).toContain(
			"### design — Design Thinking (folder `design`, file `references/workflows/design.yml`)",
		);
		expect(block).toContain(
			"| 2 | Define | `02-define.md` |  | `01-empathize.md` | `design-define-component` |",
		);
	});

	test("renders a cross-domain phase's folder and an approval-only phase's empty artifact", () => {
		const block = workflowsBlock(real).join("\n");
		expect(block).toMatch(
			/\| 1 \| [^|]+ \| `01-discover.md` \| research \| {2}\| `research-discover` \|/,
		);
		expect(block).toMatch(/\| \d+ \| [^|]+ \| {2}\| [^|]* \| [^|]* \| `development-ship` \|/);
	});

	test("replaces the block between the markers and leaves the rest untouched", () => {
		const out = fixWorkflowsBlock(before, real);
		expect(out.startsWith("## Files\n\nprose\n\n<!-- workflows:start -->\n")).toBe(true);
		expect(out.endsWith("<!-- workflows:end -->\n\n## Run-log lines you write\n\nkeep\n")).toBe(
			true,
		);
		expect(out).not.toContain("\nold\n");
		expect(fixWorkflowsBlock(out, real)).toBe(out);
		expect(fixWorkflowsBlock("no markers here\n", real)).toBe("no markers here\n");
	});

	test("is applied to the workflow skill only", () => {
		const fixReal = fixSkillText(real);
		const conductor = { name: "workflow", domain: "singular", path: "", content: before };
		expect(fixReal(conductor)).toContain("### design — Design Thinking");
		const member = { name: "design-empathize", domain: "design", path: "", content: before };
		expect(fixReal(member)).toContain("<!-- workflows:start -->\nold\n<!-- workflows:end -->");
	});
});

describe("fix-skill-text: the Output block", () => {
	test("a single-writer member logs finished only, then gets frontmatter and closing sections", () => {
		const output = fix(define).slice(fix(define).indexOf("## Output"));
		expect(output).toContain(DEFINE_LINE("finished"));
		expect(output).not.toContain('"event":"started"');
		expect(output).not.toContain('"event":"refused"');
		expect(output).toContain("skill: design-define-component\nworkflow: design\nphase: 2\n");
		expect(output).toContain("gate: <passed|skipped>\n");
		expect(output).toContain("End the artifact with `## Decisions` and `## Open questions`");
		expect(output).not.toContain("or your section of a shared artifact");
		expect(output).toContain("## Decisions\n- <what was chosen> — <why> — <what was rejected>");
		expect(fix(define).trimEnd().endsWith("```")).toBe(true);
	});

	test("a gated shared member: frontmatter once, worst gate value, italic line with passed|skipped", () => {
		const out = fix(copywriting);
		expect(out).toMatch(/frontmatter is written once, by whoever creates the file/);
		expect(out).toContain("worst value among the sections");
		expect(out).toContain(
			"Open your `## Copywriting` section with one italic line, `*<skill name> · <ISO timestamp> · gate: <passed|skipped>*`",
		);
		expect(out).toContain("skill: Act\n");
		expect(out).toContain("### Decisions\n- <what was chosen>");
		expect(out).not.toMatch(/^## Decisions/m);
		expect(out).toContain('"event":"refused"');
	});

	test("an ungated shared member says gate: none everywhere and has no worst-value clause or refused line", () => {
		const out = fix(research);
		expect(out).toContain("gate: none\n---");
		expect(out).toContain("`*<skill name> · <ISO timestamp> · gate: none*`");
		expect(out).not.toContain("worst value");
		expect(out).not.toContain("<passed|skipped>");
		expect(out).not.toContain('"event":"refused"');
		expect(out).toContain('"event":"started"');
	});

	test("a utility gets no block, and loses one it had", () => {
		expect(fix(utility)).not.toContain("**Record the run.**");
		const withBlock = fix(define).slice(fix(define).indexOf("\n# Define"));
		const out = fix({ ...utility, content: frontmatter("development-debug", "") + withBlock });
		expect(out).not.toContain("**Record the run.**");
		expect(out).not.toContain("## Decisions");
	});

	test("goes before a disclaimer instruction, which stays last", () => {
		const content = `${define.content.trimEnd()}\n\n${DISCLAIMER_INSTRUCTION}\n\n> **Not legal.**\n`;
		const out = fix({ ...define, content });
		expect(out.trimEnd().endsWith("> **Not legal.**")).toBe(true);
		expect(out.indexOf("## Decisions")).toBeLessThan(out.indexOf(DISCLAIMER_INSTRUCTION));
	});

	test("replaces an outdated block in place", () => {
		const once = fix(define);
		const stale = once.replace(
			"End the artifact with `## Decisions`",
			"End the artifact (or your section of a shared artifact) with `## Decisions`",
		);
		expect(fix({ ...define, content: stale })).toBe(once);
	});
});

test("fix-skill-text is idempotent", () => {
	for (const s of [define, copywriting, research, utility]) {
		const once = fix(s);
		expect(fix({ ...s, content: once })).toBe(once);
	}
});

test("the real pack is in sync with its workflows", () => {
	const real = fixSkillText(loadWorkflows(path.join(repoRoot, "workflows")));
	const drift = listSkills(path.join(repoRoot, "skills"))
		.filter((s) => real(s) !== s.content)
		.map((s) => s.name);
	expect(drift).toEqual([]);
});

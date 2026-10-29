import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, test } from "vitest";
import { ARGS_PARAGRAPH } from "./args.js";
import { parseFrontmatter } from "./frontmatter.js";
import {
	FIGMA_NOTE,
	GATE_PARAGRAPH,
	type MigrationContext,
	flatName,
	migrate,
	newFrontmatter,
	rewriteBody,
} from "./migrate.js";
import { LEGACY_NAME } from "./rename-check.js";
import { type Phase, type Workflow, loadWorkflows } from "./workflows.js";

const join = path.join;

/** `text` with each `{legacy}` replaced by the old project name. */
const legacy = (text: string) => text.replaceAll("{legacy}", LEGACY_NAME);

const designWorkflow: Workflow = {
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

const actPhase: Phase = {
	phase: 2,
	title: "Act",
	artifact: "02-act.md",
	requires: ["00-strategy.md"],
	skills: ["marketing-copywriting", "marketing-page-cro"],
};
const marketingWorkflow: Workflow = {
	name: "marketing",
	title: "RACE Framework",
	folder: "marketing",
	phases: [actPhase],
};

const ctxDesignEmpathize: MigrationContext = {
	domain: "design",
	name: "empathize",
	workflow: designWorkflow,
	phase: designWorkflow.phases[0],
};
const ctxDesignDefine: MigrationContext = {
	domain: "design",
	name: "define-component",
	workflow: designWorkflow,
	phase: designWorkflow.phases[1],
};
const ctxCopywriting: MigrationContext = {
	domain: "marketing",
	name: "copywriting",
	workflow: marketingWorkflow,
	phase: actPhase,
};
const ctxShip: MigrationContext = { domain: "development", name: "ship" };

const OLD_ARGS = (domain: string) =>
	`**Arguments.** \`$ARGUMENTS\` may contain the project name and optional flags. Take the first token as \`<project>\` and treat \`--skip-checks\` as a flag; never include flags in file paths. All paths below use \`<project>\`. If \`--skip-checks\` is present, skip the prerequisite check and, **before writing any artifact**, append one line to \`.${LEGACY_NAME}/${domain}/<project>/skip-log.md\`: \`- <ISO timestamp> — <skill name> skipped prerequisite check for <artifact file> — reason: <reason or "none given">\`.`;

const defineBody = `
# Define Component

Produce a component contract for "$ARGUMENTS".

${OLD_ARGS("design")}

## Prerequisites

Read \`.${LEGACY_NAME}/design/<project>/01-empathize.md\`. If this file does not exist, tell the user:

> Phase 1 (Empathize) has not been completed for "<project>". Run \`/design:empathize <project>\` first, or use \`--skip-checks\` to bypass.

## Process

1. Read \`\${CLAUDE_PLUGIN_ROOT}/shared/component-contract-template.md\`.
2. Read the design system via MCP tools \`figma_get_design_system\`.
3. **Write the artifact** to \`.${LEGACY_NAME}/design/<project>/02-define.md\`

## Output

The component contract written to \`.${LEGACY_NAME}/design/<project>/02-define.md\`. Present a summary.
`;

const copywritingBody = `
# Copywriting

Write copy for "$ARGUMENTS".

${OLD_ARGS("marketing")}

## Prerequisites

Read \`.${LEGACY_NAME}/marketing/<project>/00-strategy.md\`. If this file does not exist, tell the user:

> Run \`/marketing:customer-research <project>\` first.

## Process

1. **Write the artifact** — append to \`.${LEGACY_NAME}/marketing/<project>/02-act.md\` under a \`## Copywriting\` section.

## Output

Copy appended to \`.${LEGACY_NAME}/marketing/<project>/02-act.md\`.
`;

describe("flatName", () => {
	test("joins domain and skill with a dash", () => {
		expect(flatName("design", "empathize")).toBe("design-empathize");
	});
	test("maps the legacy domain to singular", () =>
		expect(flatName(LEGACY_NAME, "status")).toBe("singular-status"));
});

describe("rewriteBody", () => {
	test("rewrites artifact paths, skill refs and shared refs", () => {
		const out = rewriteBody(
			legacy(
				"Read `.{legacy}/design/<project>/01-empathize.md`; see /design:ideate and `${CLAUDE_PLUGIN_ROOT}/shared/wcag-criteria.md`",
			),
			ctxDesignDefine,
		);
		expect(out).toContain("`.singularskills/design/<project>/01-empathize.md`");
		expect(out).toContain("/design-ideate");
		expect(out).toContain("`references/wcag-criteria.md`");
	});

	test("maps the legacy folder and commands to singular", () => {
		const ctx: MigrationContext = { domain: LEGACY_NAME, name: "report" };
		const out = rewriteBody(
			legacy(
				"Write `.{legacy}/{legacy}/<project>/report.md`, list `.{legacy}/`, run /{legacy}:status or /project-management:retrospective, not https://example.com/x",
			),
			ctx,
		);
		expect(out).toContain("`.singularskills/singular/<project>/report.md`");
		expect(out).toContain("list `.singularskills/`");
		expect(out).toContain("/singular-status");
		expect(out).toContain("/project-management-retrospective");
		expect(out).toContain("https://example.com/x");
	});

	test("replaces the Arguments paragraph and drops skip-log sentences", () => {
		const out = rewriteBody(
			`${defineBody}\nAlso log it. Note the skip in \`skip-log.md\` too. Then go on.\n`,
			ctxDesignDefine,
		);
		expect(out).not.toMatch(/skip-log\.md/);
		expect(out).toContain('"event":"skipped"');
		expect(out).toContain(ARGS_PARAGRAPH("design", "first-token"));
		expect(out).toContain("Also log it. Then go on.");
	});

	test("keeps the basename variant of the Arguments paragraph", () => {
		const old = OLD_ARGS("coaching").replace(
			"Take the first token as `<project>`",
			"Derive `<project>` from the argument by taking its basename without extension",
		);
		const out = rewriteBody(`# Code\n\n${old}\n\n## Process\n`, {
			domain: "coaching",
			name: "code",
		});
		expect(out).toContain(ARGS_PARAGRAPH("coaching", "basename"));
	});

	test("adds the gate step to a phase member's Prerequisites and keeps the stop sentence", () => {
		const out = rewriteBody(defineBody, ctxDesignDefine);
		expect(out).toMatch(/Run `scripts\/gate\.sh <project>`/);
		expect(out).toMatch(/If this file does not exist, tell the user/);
		expect(out).toContain(`## Prerequisites\n\n${GATE_PARAGRAPH}\n\nRead \``);
	});

	test("does not add the gate step to a phase with no requires or to a utility", () => {
		const body = "# E\n\n## Prerequisites\n\nNone.\n\n## Output\n\nDone.\n";
		expect(rewriteBody(body, ctxDesignEmpathize)).not.toContain("gate.sh");
		expect(rewriteBody(body, ctxShip)).not.toContain("gate.sh");
	});

	test("appends the Decisions and Open questions instruction to a phase member's Output", () => {
		const out = rewriteBody(defineBody, ctxDesignDefine);
		const output = out.slice(out.indexOf("## Output"));
		expect(output).toContain(
			"End the artifact (or your section of a shared artifact) with `## Decisions` and `## Open questions`",
		);
		expect(output).toContain("skill: design-define-component\nworkflow: design\nphase: 2\n");
		expect(output).toContain("## Decisions\n- <what was chosen> — <why> — <what was rejected>");
		expect(output).toContain(
			"## Open questions\n- <what the next phase or a reviewer must settle>",
		);
		expect(out.trimEnd().endsWith("```")).toBe(true);
	});

	test("a utility's Output is left alone", () => {
		const body = "# Ship\n\n## Output\n\nMerged.\n";
		expect(rewriteBody(body, ctxShip)).toBe(body);
	});

	test("a shared-artifact member's Output instruction says the frontmatter is written once, by whoever creates the file, and each section opens with the italic skill line", () => {
		const out = rewriteBody(copywritingBody, ctxCopywriting);
		expect(out).toMatch(/frontmatter .* once/i);
		expect(out).toMatch(/by whoever creates the file/);
		expect(out).toContain("*<skill name> · <ISO timestamp> · gate: <passed|skipped>*");
		expect(out).toContain("Open your `## Copywriting` section with one italic line");
		expect(out).toContain(
			"End your section with `### Decisions` and `### Open questions` (one level under your `## Copywriting` heading",
		);
		expect(out).toContain("### Decisions\n- <what was chosen>");
		expect(out).toContain("### Open questions\n- <what the next phase");
		expect(out).not.toMatch(/^## Decisions/m);
		expect(out).toContain("skill: Act\n");
	});

	test("puts the closing-sections block before an existing disclaimer, which stays last", () => {
		const body = `${defineBody.trimEnd()}\n\nEnd the artifact with this paragraph, verbatim:\n\n> **Not legal.**\n`;
		const out = rewriteBody(body, ctxDesignDefine);
		expect(out.trimEnd().endsWith("> **Not legal.**")).toBe(true);
		expect(out.indexOf("## Decisions")).toBeLessThan(
			out.indexOf("End the artifact with this paragraph"),
		);
	});

	test("design skills that use Figma tools get the Figma note as their first paragraph", () => {
		const out = rewriteBody(defineBody, ctxDesignDefine);
		expect(out).toContain(`# Define Component\n\n${FIGMA_NOTE}\n\nProduce`);
		expect(rewriteBody(copywritingBody, ctxCopywriting)).not.toContain(FIGMA_NOTE);
	});

	test("is idempotent", () => {
		const once = rewriteBody(defineBody, ctxDesignDefine);
		expect(rewriteBody(once, ctxDesignDefine)).toBe(once);
		const shared = rewriteBody(copywritingBody, ctxCopywriting);
		expect(rewriteBody(shared, ctxCopywriting)).toBe(shared);
	});
});

describe("newFrontmatter", () => {
	test("moves argument-hint under metadata and adds workflow membership", () => {
		expect(
			newFrontmatter(
				parseFrontmatter('name: empathize\ndescription: …\nargument-hint: "[project]"'),
				ctxDesignEmpathize,
			),
		).toBe(
			'---\nname: design-empathize\ndescription: …\nmetadata:\n  argument-hint: "[project]"\n  workflow: design\n  phase: 1\n  artifact: 01-empathize.md\n---',
		);
	});

	test("a utility skill gets no workflow metadata", () => {
		expect(
			newFrontmatter(
				parseFrontmatter(
					'name: find-skill\ndescription: Find it.\nargument-hint: "<topic>"\ndisable-model-invocation: true',
				),
				{ domain: LEGACY_NAME, name: "find-skill" },
			),
		).toBe(
			'---\nname: singular-find-skill\ndescription: Find it.\nmetadata:\n  argument-hint: "<topic>"\n  disable-model-invocation: true\n---',
		);
	});

	test("a skill with neither hint nor membership has no metadata", () => {
		expect(
			newFrontmatter(parseFrontmatter("name: detect\ndescription: Detect."), {
				domain: LEGACY_NAME,
				name: "detect",
			}),
		).toBe("---\nname: singular-detect\ndescription: Detect.\n---");
	});
});

describe("migrate", () => {
	let tmp: string;
	beforeEach(() => {
		tmp = mkdtempSync(join(tmpdir(), "pack-tools-migrate-"));
	});
	afterEach(() => {
		rmSync(tmp, { recursive: true, force: true });
	});

	function write(rel: string, content: string) {
		mkdirSync(path.dirname(join(tmp, rel)), { recursive: true });
		writeFileSync(join(tmp, rel), content);
	}

	function skillMd(name: string, body: string, hint = "[project] [--skip-checks]") {
		return `---\nname: ${name}\ndescription: Do ${name}. Use when the user wants it.\nargument-hint: "${hint}"\n---\n${body}`;
	}

	test("on a two-domain fixture moves folders, splits shared files by usage and deletes plugins/", () => {
		write(
			"plugins/design/skills/empathize/SKILL.md",
			skillMd(
				"empathize",
				legacy(
					"\n# Empathize\n\nRead `${CLAUDE_PLUGIN_ROOT}/shared/wcag-criteria.md`.\n\n## Output\n\nWritten to `.{legacy}/design/<project>/01-empathize.md`.\n",
				),
			),
		);
		write(
			"plugins/design/skills/ideate/SKILL.md",
			skillMd(
				"ideate",
				"\n# Ideate\n\nRead `${CLAUDE_PLUGIN_ROOT}/shared/wcag-criteria.md` and `${CLAUDE_PLUGIN_ROOT}/shared/lonely.md`.\n",
			),
		);
		write("plugins/design/skills/ideate/notes/extra.md", "extra\n");
		write("plugins/design/shared/wcag-criteria.md", legacy("Save to `.{legacy}/design/x/`.\n"));
		write("plugins/design/shared/lonely.md", "Then run /design:empathize.\n");
		write("plugins/design/shared/orphan.md", "orphan\n");
		write("plugins/design/evals/empathize/prompt.md", "Look into it.\n");
		write("plugins/design/hooks/hooks.json", "{}\n");
		write("plugins/design/.claude-plugin/plugin.json", "{}\n");
		write(
			legacy("plugins/{legacy}/skills/workflow/SKILL.md"),
			skillMd("workflow", "\n# Workflow\n", "<workflow-name>"),
		);
		write(
			legacy("plugins/{legacy}/skills/status/SKILL.md"),
			legacy(
				"---\nname: status\ndescription: Show status. Use when the user asks where things stand.\n---\n\n# Status\n\nList `.{legacy}/`. See /{legacy}:report.\n",
			),
		);
		write(
			"workflows/design.yml",
			"name: design\ntitle: Design Thinking\nfolder: design\nphases:\n  - phase: 1\n    title: Empathize\n    artifact: 01-empathize.md\n    requires: []\n    skills: [design-empathize]\n",
		);

		const report = migrate(tmp, loadWorkflows(join(tmp, "workflows")));

		expect(existsSync(join(tmp, "skills/design-empathize/SKILL.md"))).toBe(true);
		expect(existsSync(join(tmp, "skills/design-ideate/SKILL.md"))).toBe(true);
		expect(existsSync(join(tmp, "skills/design-ideate/notes/extra.md"))).toBe(true);
		expect(existsSync(join(tmp, "skills/singular-status/SKILL.md"))).toBe(true);
		expect(existsSync(join(tmp, "references/design/wcag-criteria.md"))).toBe(true);
		expect(existsSync(join(tmp, "skills/design-ideate/references/lonely.md"))).toBe(true);
		expect(existsSync(join(tmp, "evals/design-empathize/prompt.md"))).toBe(true);
		expect(existsSync(join(tmp, "skills/singular-workflow"))).toBe(false);
		expect(existsSync(join(tmp, "skills/workflow"))).toBe(false);
		expect(existsSync(join(tmp, "plugins"))).toBe(false);

		expect(report.moved).toBe(3);
		expect(report.deleted).toContain("plugins/design/shared/orphan.md");
		expect(report.deleted).toContain(legacy("plugins/{legacy}/skills/workflow"));
		expect(report.deleted).toContain("plugins/design/hooks/hooks.json");
		expect(report.rewrites["shared-refs"]).toBe(2);
		expect(report.rewrites["reference-files"]).toBe(2);
		expect(readFileSync(join(tmp, "references/design/wcag-criteria.md"), "utf-8")).toBe(
			"Save to `.singularskills/design/x/`.\n",
		);
		expect(readFileSync(join(tmp, "skills/design-ideate/references/lonely.md"), "utf-8")).toBe(
			"Then run /design-empathize.\n",
		);

		const empathize = readFileSync(join(tmp, "skills/design-empathize/SKILL.md"), "utf-8");
		expect(empathize).toMatch(
			/^---\nname: design-empathize\ndescription: .*\nmetadata:\n {2}argument-hint: "\[project\] \[--skip-checks\]"\n {2}workflow: design\n {2}phase: 1\n {2}artifact: 01-empathize\.md\n---\n\n# Empathize/,
		);
		expect(empathize).toContain("`references/wcag-criteria.md`");
		expect(empathize).toContain("## Decisions");

		const status = readFileSync(join(tmp, "skills/singular-status/SKILL.md"), "utf-8");
		expect(status).toContain("name: singular-status\n");
		expect(status).toContain("List `.singularskills/`. See /singular-report.");
	});

	test("rewrites skill refs in the description too", () => {
		write(
			"plugins/marketing/skills/copywriting/SKILL.md",
			"---\nname: copywriting\ndescription: Write copy. Use when the user needs new words. Not for edits; see /marketing:copy-editing.\n---\n\n# Copywriting\n",
		);
		mkdirSync(join(tmp, "workflows"));
		migrate(tmp, []);
		const out = readFileSync(join(tmp, "skills/marketing-copywriting/SKILL.md"), "utf-8");
		expect(out).toContain("see /marketing-copy-editing.\n");
	});
});

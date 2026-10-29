import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { parseSkill } from "./parse-skill.js";
import {
	COMPUTE_WITH_CODE_PARAGRAPH,
	COMPUTE_WITH_CODE_PLUGINS,
	DISCLAIMER_GROUPS,
	DISCLAIMER_INSTRUCTION,
	DISCLAIMER_TEXT,
	type PackContext,
	STANDARD_ARGS_PARAGRAPH,
	buildPackContext,
	standardArgsParagraph,
	validatePackSkill,
	validateSkillRefs,
} from "./plugin-rules.js";
import type { ValidationIssue } from "./rules.js";
import type { Workflow } from "./workflows.js";

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
			skills: ["design-define-component", "design-define-token"],
		},
	],
};

const ctx: PackContext = {
	skillNames: [
		"design-define-component",
		"design-define-token",
		"design-empathize",
		"development-plan",
		"singular-init",
	],
	workflows: [designWorkflow],
	multiWriterFiles: new Map([
		["design/02-define.md", ["design-define-component", "design-define-token"]],
	]),
	referenceFiles: [
		"references/design/wcag-criteria.md",
		"references/design/guides/one.md",
		"skills/development-plan/references/plan-template.md",
	],
};

/** Frontmatter for skill `name` with optional extra `metadata` lines. */
function fm(name: string, metadata = '  argument-hint: "[project]"\n'): string {
	return `---\nname: ${name}\ndescription: Plan x\nmetadata:\n${metadata}---\n`;
}

/** Validate `body` as skill `name` (default `development-plan`) at skills/<name>/SKILL.md. */
function runAs(name: string, body: string, front = fm(name)): ValidationIssue[] {
	return validatePackSkill(parseSkill(`${front}${body}`, `/r/skills/${name}/SKILL.md`), ctx);
}

const run = (body: string) => runAs("development-plan", body);

function rules(issues: ValidationIssue[]): string[] {
	return issues.map((i) => i.rule);
}

describe("buildPackContext", () => {
	const root = join(import.meta.dirname, "__pack_ctx_fixtures__");

	afterEach(() => rmSync(root, { recursive: true, force: true }));

	it("collects skills, workflows, multi-writer phase files and reference files", () => {
		const files: Record<string, string> = {
			"skills/design-empathize/SKILL.md": "x",
			"skills/design-define-component/SKILL.md": "x",
			"skills/design-define-token/SKILL.md": "x",
			"skills/design-define-token/references/token-guide.md": "x",
			"references/design/wcag-criteria.md": "x",
			"workflows/design.yml": [
				"name: design",
				"title: Design Thinking",
				"folder: design",
				"phases:",
				"  - phase: 1",
				"    title: Empathize",
				"    artifact: 01-empathize.md",
				"    requires: []",
				"    skills: [design-empathize]",
				"  - phase: 2",
				"    title: Define",
				"    artifact: 02-define.md",
				"    requires: [01-empathize.md]",
				"    skills: [design-define-component, design-define-token]",
				"",
			].join("\n"),
			"workflows/build.yml": [
				"name: build",
				"title: Build",
				"folder: build",
				"phases:",
				"  - phase: 1",
				"    title: Define it",
				"    folder: design",
				"    artifact: 02-define.md",
				"    requires: []",
				"    skills: [design-define-component]",
				"",
			].join("\n"),
		};
		for (const [file, content] of Object.entries(files)) {
			mkdirSync(join(root, file, ".."), { recursive: true });
			writeFileSync(join(root, file), content);
		}

		const built = buildPackContext(root);
		expect(built.skillNames).toEqual([
			"design-define-component",
			"design-define-token",
			"design-empathize",
		]);
		expect(built.workflows.map((wf) => wf.name)).toEqual(["build", "design"]);
		expect(built.multiWriterFiles).toEqual(
			new Map([["design/02-define.md", ["design-define-component", "design-define-token"]]]),
		);
		expect(built.referenceFiles).toEqual([
			"references/design/wcag-criteria.md",
			"skills/design-define-token/references/token-guide.md",
		]);
	});

	it("treats a missing workflows/ directory as no workflows", () => {
		mkdirSync(join(root, "skills/development-plan"), { recursive: true });
		writeFileSync(join(root, "skills/development-plan/SKILL.md"), "x");
		expect(buildPackContext(root).workflows).toEqual([]);
	});
});

describe("frontmatter-shape", () => {
	it("accepts name, description, allowed-tools and metadata with the known keys", () => {
		const front =
			'---\nname: design-empathize\ndescription: Plan x\nallowed-tools: Read\nmetadata:\n  argument-hint: "[project]"\n  disable-model-invocation: true\n  workflow: design\n  phase: 1\n  artifact: 01-empathize.md\n---\n';
		expect(runAs("design-empathize", "# X\n", front)).toEqual([]);
	});

	it("flags an unknown top-level key", () => {
		const front = "---\nname: development-plan\ndescription: Plan x\nmodel: haiku\n---\n";
		const issues = runAs("development-plan", "# X\n", front);
		expect(rules(issues)).toEqual(["frontmatter-shape"]);
		expect(issues[0].severity).toBe("error");
		expect(issues[0].message).toContain("model");
	});

	it("flags a top-level argument-hint (it belongs under metadata)", () => {
		const front =
			'---\nname: development-plan\ndescription: Plan x\nargument-hint: "[project]"\n---\n';
		expect(rules(runAs("development-plan", "# X\n", front))).toEqual(["frontmatter-shape"]);
	});

	it("flags an unknown metadata key", () => {
		const issues = runAs("development-plan", "# X\n", fm("development-plan", "  owner: me\n"));
		expect(rules(issues)).toEqual(["frontmatter-shape"]);
		expect(issues[0].message).toContain("owner");
	});
});

describe("standardArgsParagraph", () => {
	it("is the run-log paragraph with the workflow filled in", () => {
		expect(standardArgsParagraph("security", "first-token")).toBe(
			'**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"<skill name>","workflow":"security","phase":<phase>,"project":"<project>","event":"skipped","artifact":"<artifact file>","note":"<reason or \\"none given\\">"}`.',
		);
		expect(standardArgsParagraph("security", "first-token")).toBe(
			STANDARD_ARGS_PARAGRAPH.replace("<workflow>", "security"),
		);
	});

	it("basename variant swaps only the slug sentence", () => {
		const text = standardArgsParagraph("coaching", "basename");
		expect(text).toContain(
			"Derive `<project>` from the argument by taking its basename without extension and treat `--skip-checks` as a flag",
		);
		expect(text).not.toContain("Take the first token");
		expect(text).toContain('"workflow":"coaching"');
	});
});

/** The paragraph as the utility `development-plan` must carry it: literal name, `null` phase. */
const UTILITY = { skill: "development-plan", phase: null };
const paragraph = (workflow: string) => standardArgsParagraph(workflow, "first-token", UTILITY);

describe("no-args-in-path", () => {
	it("flags $ARGUMENTS inside a .singularskills path", () => {
		expect(rules(run("Write `.singularskills/development/$ARGUMENTS/01-plan.md`."))).toEqual([
			"no-args-in-path",
		]);
	});

	it("accepts <project> paths and $ARGUMENTS in prose", () => {
		expect(
			run('Plan "$ARGUMENTS". Write `.singularskills/development/<project>/01-plan.md`.'),
		).toEqual([]);
	});
});

describe("artifact-root", () => {
	it("accepts the skill's own folder and the run log", () => {
		expect(
			run(
				"Write `.singularskills/development/<project>/01-plan.md`; log to `.singularskills/log.jsonl`.",
			),
		).toEqual([]);
	});

	it("accepts the artifact root itself, as the gate step names it", () => {
		expect(run("Run it from the folder that contains `.singularskills/`.")).toEqual([]);
		expect(rules(run("Write `.singularskills/other/x.md`."))).toEqual(["artifact-root"]);
	});

	it("accepts a phase member's workflow folder", () => {
		const front = fm(
			"design-empathize",
			'  argument-hint: "[project]"\n  workflow: design\n  phase: 1\n  artifact: 01-empathize.md\n',
		);
		expect(
			runAs("design-empathize", "Write `.singularskills/design/<project>/01-empathize.md`.", front),
		).toEqual([]);
	});

	it("flags another domain's folder and .project/ paths", () => {
		expect(rules(run("Write `.singularskills/design/<project>/01-plan.md`."))).toEqual([
			"artifact-root",
		]);
		expect(rules(run("Read `.project/<project>/00-initiate.md`."))).toEqual(["artifact-root"]);
	});

	it("lets singular-* skills read anywhere under .singularskills/", () => {
		expect(
			runAs(
				"singular-init",
				"Read `.singularskills/design/<project>/01-define.md`, `.singularskills/config.md` and `.singularskills/reports/`.",
			),
		).toEqual([]);
	});

	it("allows the listed cross-domain reads only", () => {
		expect(
			runAs("coaching-copy", "Look for `.singularskills/branding/<brand>/03-verbal.md`."),
		).toEqual([]);
		expect(runAs("branding-voice", "Read `.singularskills/marketing/<project>/x.md`.")).toEqual([]);
		expect(
			rules(runAs("coaching-copy", "Write `.singularskills/security/<project>/x.md`.")),
		).toEqual(["artifact-root"]);
	});

	it("flags any legacy .metapowers/ path, even for singular-* skills", () => {
		const issues = run("Write `.metapowers/development/<project>/01-plan.md`.");
		expect(rules(issues)).toEqual(["artifact-root"]);
		expect(issues[0].message).toContain("legacy artifact root");
		expect(rules(runAs("singular-init", "Create .metapowers/config.md first."))).toEqual([
			"artifact-root",
		]);
	});
});

describe("skill-ref-exists", () => {
	it("accepts a reference to an existing flat skill", () => {
		expect(run("Run `/design-define-component <project>` first.")).toEqual([]);
	});

	it("flags a reference to a nonexistent skill, suggesting the closest match by prefix", () => {
		const issues = run("Run `/design-define <project>` first.");
		expect(rules(issues)).toEqual(["skill-ref-exists"]);
		expect(issues[0].message).toContain("/design-define");
		expect(issues[0].message).toContain("design-define-component");
	});

	it("omits the suggestion when no skill name starts with the reference", () => {
		const issues = run("Run `/design-zzz <project>` first.");
		expect(rules(issues)).toEqual(["skill-ref-exists"]);
		expect(issues[0].message).not.toContain("Did you mean");
	});

	it("ignores tokens without a known domain prefix and path segments", () => {
		expect(run("See /docs-foo, `/usr/bin` and `/design/` or `/file/` in the URL.")).toEqual([]);
	});

	it("flags a legacy /<domain>:<skill> reference", () => {
		const issues = run("Run `/design:empathize <project>` first.");
		expect(rules(issues)).toEqual(["skill-ref-exists"]);
		expect(issues[0].message).toContain("legacy skill reference");
		expect(issues[0].message).toContain("/design-empathize");
		expect(rules(run("See /metapowers:init."))).toEqual(["skill-ref-exists"]);
	});

	it("checks references in the description", () => {
		const front = (description: string) =>
			`---\nname: development-plan\ndescription: ${description}\nmetadata:\n  argument-hint: "[project]"\n---\n`;
		expect(
			runAs("development-plan", "Body.", front("Plan x. Not for x; see /design-empathize.")),
		).toEqual([]);
		expect(
			rules(runAs("development-plan", "Body.", front("Plan x. Not for x; see /design-nope."))),
		).toEqual(["skill-ref-exists"]);
	});

	it("is the only rule validateSkillRefs runs", () => {
		const doc = parseSkill(
			"# Guide\n\n1. `/design-nope <x>`\n2. Write `.metapowers/x/y.md`\n",
			"/r/references/design/guide.md",
		);
		expect(rules(validateSkillRefs(doc, ctx))).toEqual(["skill-ref-exists"]);
	});
});

describe("reference-resolvable", () => {
	it("accepts a reference in the skill's own references/ or its domain's canonical folder", () => {
		expect(run("Use `references/plan-template.md`.")).toEqual([]);
		expect(runAs("design-empathize", "Use `references/wcag-criteria.md#aa`.")).toEqual([]);
		expect(runAs("design-empathize", "Read `references/guides/`.")).toEqual([]);
	});

	it("flags a reference that resolves nowhere", () => {
		const issues = run("Use `references/wcag-criteria.md`.");
		expect(rules(issues)).toEqual(["reference-resolvable"]);
		expect(issues[0].message).toContain("skills/development-plan/references/wcag-criteria.md");
	});
});

describe("skip-checks-standard", () => {
	it("flags --skip-checks without the standard paragraph", () => {
		expect(rules(run("If `--skip-checks` is present in $ARGUMENTS, skip this check."))).toEqual([
			"skip-checks-standard",
		]);
	});

	it("flags the paragraph for a different workflow", () => {
		expect(rules(run(paragraph("design")))).toContain("skip-checks-standard");
	});

	it("accepts the standard paragraph (first-token and basename variants)", () => {
		expect(run(`${paragraph("development")}\n\nor use \`--skip-checks\` to bypass.`)).toEqual([]);
		expect(run(standardArgsParagraph("development", "basename", UTILITY))).toEqual([]);
	});

	it("flags a paragraph whose skipped line keeps the placeholders", () => {
		expect(rules(run(standardArgsParagraph("development", "first-token")))).toContain(
			"skip-checks-standard",
		);
	});

	it("requires a phase member's literal phase and artifact", () => {
		const front = fm(
			"design-define-component",
			'  argument-hint: "[project]"\n  workflow: design\n  phase: 2\n  artifact: 02-define.md\n',
		);
		const literal = standardArgsParagraph("design", "first-token", {
			skill: "design-define-component",
			phase: 2,
			artifact: "02-define.md",
		});
		expect(literal).toContain(
			'"skill":"design-define-component","workflow":"design","phase":2,"project":"<project>","event":"skipped","artifact":"02-define.md"',
		);
		expect(rules(runAs("design-define-component", literal, front))).not.toContain(
			"skip-checks-standard",
		);
		const utility = standardArgsParagraph("design", "first-token", {
			skill: "design-define-component",
			phase: null,
		});
		expect(rules(runAs("design-define-component", utility, front))).toContain(
			"skip-checks-standard",
		);
	});

	it("ignores skills that never mention --skip-checks", () => {
		expect(run("No flags here.")).toEqual([]);
	});
});

describe("phase-file-append", () => {
	const front = (name: string) =>
		fm(
			name,
			'  argument-hint: "[project]"\n  workflow: design\n  phase: 2\n  artifact: 02-define.md\n',
		);
	const appendLine =
		"5. **Write the artifact** — append to `.singularskills/design/<project>/02-define.md` under a `## Alpha` section. Create the file with a `# Define — <project>` heading if it does not exist; if a `## Alpha` section already exists, replace only that section.";
	const partialAppendLine =
		"5. **Write the artifact** — append to `.singularskills/design/<project>/02-define.md` under a `## Delta` section:";
	const toLine =
		"5. **Write the artifact** to `.singularskills/design/<project>/02-define.md` with heading:";

	const check = (name: string, body: string) =>
		rules(runAs(name, `# X\n\n${body}\n`, front(name))).filter((r) => r === "phase-file-append");

	it("accepts the append wording on a multi-writer phase file", () => {
		expect(check("design-define-component", appendLine)).toEqual([]);
	});

	it("flags overwriting or partial append wording on a multi-writer phase file", () => {
		expect(check("design-define-token", toLine)).toEqual(["phase-file-append"]);
		expect(check("design-define-token", partialAppendLine)).toEqual(["phase-file-append"]);
	});

	it("accepts the template followed by a trailing sentence", () => {
		expect(check("design-define-component", `${appendLine} The section contains:`)).toEqual([]);
	});

	it("flags append wording that drops the create-the-file clause", () => {
		const noCreate =
			"5. **Write the artifact** — append to `.singularskills/design/<project>/02-define.md` under a `## Alpha` section; if a `## Alpha` section already exists, replace only that section.";
		expect(check("design-define-token", noCreate)).toEqual(["phase-file-append"]);
	});

	it("flags 'append to' that is not attached to the path", () => {
		const detached =
			"5. **Write the artifact** to `.singularskills/design/<project>/02-define.md` — append to it; replace only that section.";
		expect(check("design-define-token", detached)).toEqual(["phase-file-append"]);
	});

	it("ignores files of single-skill phases", () => {
		expect(
			check(
				"design-empathize",
				"5. **Write the artifact** to `.singularskills/design/<project>/01-empathize.md` with heading:",
			),
		).toEqual([]);
	});
});

function runRaw(content: string, filePath = "/r/skills/development-plan/SKILL.md") {
	return rules(validatePackSkill(parseSkill(content, filePath), ctx));
}

describe("name-matches-dir", () => {
	it("accepts a name equal to the skill directory", () => {
		expect(runRaw("---\nname: development-plan\ndescription: Plan x\n---\n# Plan\n")).toEqual([]);
	});

	it("rejects a mismatched or invalid name", () => {
		expect(runRaw("---\nname: plan\ndescription: Plan x\n---\n# Plan\n")).toEqual([
			"name-matches-dir",
		]);
		expect(runRaw("---\ndescription: Plan x\n---\n# Plan\n")).toEqual(["name-matches-dir"]);
		expect(
			runRaw("---\nname: Plan_X\ndescription: Plan x\n---\n# Plan\n", "/r/skills/Plan_X/SKILL.md"),
		).toEqual(["name-matches-dir"]);
		const long = "a".repeat(65);
		expect(
			runRaw(
				`---\nname: ${long}\ndescription: Plan x\n---\n# Plan\n`,
				`/r/skills/${long}/SKILL.md`,
			),
		).toEqual(["name-matches-dir"]);
	});
});

describe("argument-hint-present", () => {
	const front = (metadata: string) =>
		`---\nname: development-plan\ndescription: Plan x\n${metadata}---\n`;

	it("reads metadata.argument-hint for Arguments-paragraph skills only", () => {
		expect(runRaw(`${front("")}${paragraph("development")}\n`)).toEqual(["argument-hint-present"]);
		expect(
			runRaw(`${front("")}${standardArgsParagraph("development", "basename", UTILITY)}\n`),
		).toEqual(["argument-hint-present"]);
		expect(
			runRaw(`${front('metadata:\n  argument-hint: ""\n')}${paragraph("development")}\n`),
		).toEqual(["argument-hint-present"]);
		expect(
			runRaw(
				`${front('metadata:\n  argument-hint: "[project] [--skip-checks]"\n')}${paragraph("development")}\n`,
			),
		).toEqual([]);
		expect(runRaw(`${front("")}Plan "$ARGUMENTS" freely.\n`)).toEqual([]);
	});
});

describe("frontmatter-key-order", () => {
	it("warns on description before name", () => {
		const issues = validatePackSkill(
			parseSkill(
				"---\ndescription: Plan x\nname: development-plan\n---\n# Plan\n",
				"/r/skills/development-plan/SKILL.md",
			),
			ctx,
		);
		expect(issues).toEqual([
			expect.objectContaining({ rule: "frontmatter-key-order", severity: "warning" }),
		]);
	});

	it("accepts name, description, then the other keys", () => {
		expect(
			runRaw(
				'---\nname: development-plan\ndescription: Plan x\nallowed-tools: Read\nmetadata:\n  argument-hint: "[project]"\n---\n# Plan\n',
			),
		).toEqual([]);
	});

	it("warns when metadata comes before name and description", () => {
		expect(
			runRaw(
				'---\nmetadata:\n  argument-hint: "[project]"\nname: development-plan\ndescription: Plan x\n---\n# Plan\n',
			),
		).toEqual(["frontmatter-key-order"]);
	});
});

const MONEY_QUOTE =
	"> **Not financial or tax advice.** This artifact is generated analysis for review by a qualified accountant or financial professional before any filing, reporting or decision relies on it.";

describe("disclaimer constants", () => {
	it("match spec §5 verbatim", () => {
		expect(DISCLAIMER_INSTRUCTION).toBe("End the artifact with this paragraph, verbatim:");
		expect(DISCLAIMER_TEXT.money).toBe(MONEY_QUOTE);
		expect(DISCLAIMER_TEXT.compliance).toBe(
			"> **Not legal or audit advice.** This artifact supports preparation for compliance work; certification, attestation and regulatory conclusions require a qualified auditor or counsel.",
		);
		expect(DISCLAIMER_TEXT.security).toBe(
			"> **Not a penetration test or audit.** This artifact is generated analysis; validate findings against the live system and have material controls reviewed by a qualified security professional.",
		);
		expect(DISCLAIMER_GROUPS).toEqual({
			finance: "money",
			accounting: "money",
			bookkeeping: "money",
			compliance: "compliance",
			security: "security",
		});
	});
});

describe("disclaimer-present", () => {
	const output = (tail: string) =>
		`# X\n\n${COMPUTE_WITH_CODE_PARAGRAPH}\n\n## Output\n\nPresent:\n- Totals${tail}`;
	const good = `\n\n${DISCLAIMER_INSTRUCTION}\n\n${MONEY_QUOTE}\n`;

	it("accepts the instruction and the domain group's blockquote as the end of ## Output", () => {
		expect(runAs("finance-ratios", output(good))).toEqual([]);
		expect(
			runAs(
				"security-threat-model",
				`# X\n\n## Output\n\n- Findings\n\n${DISCLAIMER_INSTRUCTION}\n\n${DISCLAIMER_TEXT.security}\n\n`,
			),
		).toEqual([]);
	});

	it("accepts a disclaimer following another blockquote", () => {
		expect(
			runAs(
				"security-threat-model",
				`# X\n\n## Output\n\n> **Note:** other\n\n${DISCLAIMER_INSTRUCTION}\n\n${DISCLAIMER_TEXT.security}\n`,
			),
		).toEqual([]);
	});

	it("flags a missing disclaimer", () => {
		expect(rules(runAs("compliance-gdpr", "# X\n\n## Output\n\n- Gaps\n"))).toEqual([
			"disclaimer-present",
		]);
	});

	it("flags a skill with no ## Output section", () => {
		expect(rules(runAs("security-threat-model", "# X\n\nNo output.\n"))).toEqual([
			"disclaimer-present",
		]);
	});

	it("flags another group's blockquote", () => {
		expect(
			rules(
				runAs(
					"compliance-gdpr",
					`# X\n\n## Output\n\n- Gaps\n\n${DISCLAIMER_INSTRUCTION}\n\n${MONEY_QUOTE}\n`,
				),
			),
		).toEqual(["disclaimer-present"]);
	});

	it("flags the blockquote without the instruction sentence", () => {
		expect(rules(runAs("finance-ratios", output(`\n\n${MONEY_QUOTE}\n`)))).toEqual([
			"disclaimer-present",
		]);
	});

	it("flags content after the disclaimer", () => {
		expect(rules(runAs("finance-ratios", output(`${good}\n- Late bullet\n`)))).toEqual([
			"disclaimer-present",
		]);
	});

	it("flags a disclaimer placed outside ## Output", () => {
		expect(
			rules(
				runAs(
					"finance-ratios",
					`# X\n\n${COMPUTE_WITH_CODE_PARAGRAPH}\n\n${DISCLAIMER_INSTRUCTION}\n\n${MONEY_QUOTE}\n\n## Output\n\n- Totals\n`,
				),
			),
		).toEqual(["disclaimer-present"]);
	});

	it("ignores other domains", () => {
		expect(runAs("legal-contract-review", "# X\n\n## Output\n\n- Memo\n")).toEqual([]);
	});
});

describe("compute-with-code-present", () => {
	const tail = `\n\n## Output\n\n- Totals\n\n${DISCLAIMER_INSTRUCTION}\n\n${MONEY_QUOTE}\n`;

	it("matches spec §5 verbatim", () => {
		expect(COMPUTE_WITH_CODE_PARAGRAPH).toBe(
			"**Compute with code.** Perform every calculation (totals, balances, ratios, variances, projections) with a script — Bash, Python or a spreadsheet formula written to a file — and include the computation alongside the result. Never do arithmetic mentally.",
		);
		expect([...COMPUTE_WITH_CODE_PLUGINS].sort()).toEqual(["accounting", "bookkeeping", "finance"]);
	});

	it("accepts a money skill with the paragraph", () => {
		expect(runAs("bookkeeping-record", `# X\n\n${COMPUTE_WITH_CODE_PARAGRAPH}${tail}`)).toEqual([]);
	});

	it("flags a money skill without the paragraph", () => {
		expect(rules(runAs("accounting-close", `# X${tail}`))).toEqual(["compute-with-code-present"]);
	});

	it("ignores compliance and security", () => {
		expect(
			runAs(
				"compliance-gdpr",
				`# X\n\n## Output\n\n- Gaps\n\n${DISCLAIMER_INSTRUCTION}\n\n${DISCLAIMER_TEXT.compliance}\n`,
			),
		).toEqual([]);
	});
});

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
	type PluginContext,
	STANDARD_ARGS_PARAGRAPH,
	buildPluginContext,
	standardArgsParagraph,
	validatePluginSkill,
} from "./plugin-rules.js";
import type { ValidationIssue } from "./rules.js";

const ctx: PluginContext = {
	pluginName: "development",
	pluginDir: "/repo/plugins/development",
	sharedFiles: ["shared/plan-template.md", "shared/workflows/launch-product.md"],
	skillNames: ["plan"],
	allPluginNames: ["development"],
	allSkillNames: { development: ["plan"] },
	multiWriterFiles: new Set(),
};

/** Valid frontmatter for a skill at x/SKILL.md, so only the rule under test fires. */
const FM = '---\nname: x\ndescription: Plan x\nargument-hint: "[project]"\n---\n';

function run(body: string): ValidationIssue[] {
	return validatePluginSkill(parseSkill(`${FM}${body}`, "x/SKILL.md"), ctx);
}

function rules(issues: ValidationIssue[]): string[] {
	return issues.map((i) => i.rule);
}

describe("buildPluginContext", () => {
	const root = join(import.meta.dirname, "__plugin_ctx_fixtures__");

	afterEach(() => rmSync(root, { recursive: true, force: true }));

	it("collects shared files, skills, and all plugins", () => {
		const files = [
			"development/shared/plan-template.md",
			"development/shared/workflows/launch-product.md",
			"development/skills/plan/SKILL.md",
			"development/skills/review/SKILL.md",
			"design/skills/audit/SKILL.md",
		];
		for (const file of files) {
			mkdirSync(join(root, file, ".."), { recursive: true });
			writeFileSync(join(root, file), "x");
		}

		const built = buildPluginContext(join(root, "development"), root);
		expect(built).toEqual({
			pluginName: "development",
			pluginDir: join(root, "development"),
			sharedFiles: ["shared/plan-template.md", "shared/workflows/launch-product.md"],
			skillNames: ["plan", "review"],
			allPluginNames: ["design", "development"],
			allSkillNames: { design: ["audit"], development: ["plan", "review"] },
			multiWriterFiles: new Set(),
		});
	});
});

describe("phase-file-append", () => {
	const root = join(import.meta.dirname, "__phase_file_fixtures__");
	const appendLine =
		"5. **Write the artifact** — append to `.metapowers/security/<project>/02-x.md` under a `## Alpha` section. Create the file with a `# X — <project>` heading if it does not exist; if a `## Alpha` section already exists, replace only that section.";
	const partialAppendLine =
		"5. **Write the artifact** — append to `.metapowers/security/<project>/02-x.md` under a `## Delta` section:";
	const toLine =
		"5. **Write the artifact** to `.metapowers/security/<project>/02-x.md` with heading:";
	const skills: Record<string, string> = {
		alpha: `# Alpha\n\n${appendLine}\n`,
		beta: `# Beta\n\n${toLine}\n`,
		delta: `# Delta\n\n${partialAppendLine}\n`,
		gamma:
			"# Gamma\n\n5. **Write the artifact** to `.metapowers/security/<project>/03-y.md` with heading:\n",
		other: "# Other\n\n5. **Write the artifact** to `.metapowers/legal/<project>/02-x.md`:\n",
	};

	afterEach(() => rmSync(root, { recursive: true, force: true }));

	function setup(): PluginContext {
		for (const [name, body] of Object.entries(skills)) {
			const dir = join(root, "security/skills", name);
			mkdirSync(dir, { recursive: true });
			writeFileSync(
				join(dir, "SKILL.md"),
				`---\nname: ${name}\ndescription: Do ${name}\n---\n${body}`,
			);
		}
		return buildPluginContext(join(root, "security"), root);
	}

	function check(name: string, ctxFor: PluginContext): string[] {
		const body = skills[name];
		return rules(
			validatePluginSkill(
				parseSkill(`---\nname: ${name}\ndescription: Do ${name}\n---\n${body}`, `${name}/SKILL.md`),
				ctxFor,
			),
		).filter((rule) => rule === "phase-file-append");
	}

	it("collects files written by two or more skills of the plugin", () => {
		expect(setup().multiWriterFiles).toEqual(new Set(["02-x.md"]));
	});

	it("flags only the multi-writer skill that still overwrites the phase file", () => {
		const built = setup();
		expect(check("alpha", built)).toEqual([]);
		expect(check("beta", built)).toEqual(["phase-file-append"]);
		expect(check("delta", built)).toEqual(["phase-file-append"]);
		expect(check("gamma", built)).toEqual([]);
	});

	it("ignores write lines when the file has a single writer", () => {
		expect(check("beta", ctx)).toEqual([]);
	});
});

describe("shared-ref-resolvable", () => {
	it("flags repo-relative shared refs", () => {
		const issues = run("Read `plugins/development/shared/plan-template.md`.");
		expect(issues.map((i) => i.rule)).toEqual(["shared-ref-resolvable"]);
		expect(issues[0].message).toContain("${CLAUDE_PLUGIN_ROOT}/shared/plan-template.md");
	});

	it("flags bare shared/ refs", () => {
		expect(rules(run("See `shared/plan-template.md`."))).toEqual(["shared-ref-resolvable"]);
	});

	it("accepts CLAUDE_PLUGIN_ROOT refs to existing files and directories", () => {
		expect(
			run(
				"Read `${CLAUDE_PLUGIN_ROOT}/shared/plan-template.md` and `${CLAUDE_PLUGIN_ROOT}/shared/workflows/`.",
			),
		).toEqual([]);
	});

	it("flags CLAUDE_PLUGIN_ROOT refs to missing files", () => {
		expect(rules(run("Read `${CLAUDE_PLUGIN_ROOT}/shared/nope.md`."))).toEqual([
			"shared-ref-resolvable",
		]);
	});

	it("ignores #fragments when resolving", () => {
		expect(run("Read `${CLAUDE_PLUGIN_ROOT}/shared/plan-template.md#risks`.")).toEqual([]);
	});
});

function runAs(pluginName: string, body: string): ValidationIssue[] {
	return validatePluginSkill(parseSkill(`${FM}${body}`, "x/SKILL.md"), {
		...ctx,
		pluginName,
	});
}

const paragraph = (domain: string) => standardArgsParagraph(domain, "first-token");

describe("standardArgsParagraph", () => {
	it("first-token variant is STANDARD_ARGS_PARAGRAPH with the domain filled in", () => {
		expect(standardArgsParagraph("security", "first-token")).toBe(
			STANDARD_ARGS_PARAGRAPH.replace("<domain>", "security"),
		);
	});

	it("basename variant swaps only the slug sentence (spec §6)", () => {
		const text = standardArgsParagraph("coaching", "basename");
		expect(text).toContain(
			"Derive `<project>` from the argument by taking its basename without extension and treat `--skip-checks` as a flag",
		);
		expect(text).not.toContain("Take the first token");
		expect(text).toContain(".metapowers/coaching/<project>/skip-log.md");
	});
});

describe("no-args-in-path", () => {
	it("flags $ARGUMENTS inside a .metapowers path", () => {
		expect(rules(run("Write `.metapowers/development/$ARGUMENTS/01-plan.md`."))).toEqual([
			"no-args-in-path",
		]);
	});

	it("accepts <project> paths and $ARGUMENTS in prose", () => {
		expect(run('Plan "$ARGUMENTS". Write `.metapowers/development/<project>/01-plan.md`.')).toEqual(
			[],
		);
	});
});

describe("artifact-root", () => {
	it("flags .project/ paths", () => {
		expect(rules(run("Read `.project/<project>/00-initiate.md`."))).toEqual(["artifact-root"]);
	});

	it("flags another domain's root", () => {
		expect(rules(run("Write `.metapowers/design/<project>/01-plan.md`."))).toEqual([
			"artifact-root",
		]);
	});

	it("accepts the plugin's own root", () => {
		expect(run("Write `.metapowers/development/<project>/01-plan.md`.")).toEqual([]);
	});

	it("exempts the metapowers plugin", () => {
		expect(
			runAs(
				"metapowers",
				"Read `.metapowers/design/<project>/01-define.md`, `.metapowers/config.md` and `.metapowers/reports/`.",
			),
		).toEqual([]);
	});

	it("allows the listed cross-domain reads only", () => {
		expect(runAs("coaching", "Look for `.metapowers/branding/<brand>/03-verbal.md`.")).toEqual([]);
		expect(rules(runAs("coaching", "Write `.metapowers/security/<project>/x.md`."))).toEqual([
			"artifact-root",
		]);
	});
});

describe("skill-ref-exists", () => {
	const designCtx: PluginContext = {
		...ctx,
		pluginName: "design",
		allPluginNames: ["design", "development"],
		allSkillNames: { design: ["define-component", "empathize"], development: ["plan"] },
	};

	function runDesign(body: string): ValidationIssue[] {
		return validatePluginSkill(parseSkill(`${FM}${body}`, "x/SKILL.md"), designCtx);
	}

	it("flags a reference to a nonexistent skill, suggesting the closest match by prefix", () => {
		const issues = runDesign("Run `/design:define <project>` first.");
		expect(rules(issues)).toEqual(["skill-ref-exists"]);
		expect(issues[0].message).toContain("/design:define");
		expect(issues[0].message).toContain("define-component");
	});

	it("accepts a reference to an existing skill", () => {
		expect(runDesign("Run `/design:define-component <project>` first.")).toEqual([]);
	});

	it("ignores tokens whose plugin prefix is not a real plugin", () => {
		expect(runDesign("See /docs:foo for details.")).toEqual([]);
	});

	it("omits the suggestion when no skill name starts with the reference", () => {
		const issues = runDesign("Run `/design:zzz <project>` first.");
		expect(rules(issues)).toEqual(["skill-ref-exists"]);
		expect(issues[0].message).not.toContain("Did you mean");
	});

	function runDesignDescription(description: string): ValidationIssue[] {
		const fm = `---\nname: x\ndescription: ${description}\nargument-hint: "[project]"\n---\n`;
		return validatePluginSkill(parseSkill(`${fm}Body.`, "x/SKILL.md"), designCtx);
	}

	it("flags a nonexistent skill referenced in the description", () => {
		const issues = runDesignDescription("Plan x. Not for x; see /design:nope.");
		expect(rules(issues)).toEqual(["skill-ref-exists"]);
		expect(issues[0].message).toContain("/design:nope");
	});

	it("accepts an existing skill referenced in the description", () => {
		expect(runDesignDescription("Plan x. Not for x; see /design:empathize.")).toEqual([]);
	});
});

describe("skip-checks-standard", () => {
	it("flags --skip-checks without the standard paragraph", () => {
		expect(rules(run("If `--skip-checks` is present in $ARGUMENTS, skip this check."))).toEqual([
			"skip-checks-standard",
		]);
	});

	it("flags the paragraph for a different domain", () => {
		expect(rules(run(paragraph("design")))).toContain("skip-checks-standard");
	});

	it("accepts the standard paragraph (first-token and basename variants)", () => {
		expect(run(`${paragraph("development")}\n\nor use \`--skip-checks\` to bypass.`)).toEqual([]);
		expect(run(standardArgsParagraph("development", "basename"))).toEqual([]);
	});

	it("ignores skills that never mention --skip-checks", () => {
		expect(run("No flags here.")).toEqual([]);
	});
});

function runRaw(content: string, filePath = "/repo/plugins/development/skills/plan/SKILL.md") {
	return rules(validatePluginSkill(parseSkill(content, filePath), ctx));
}

describe("name-matches-dir", () => {
	it("accepts a name equal to the skill directory", () => {
		expect(runRaw("---\nname: plan\ndescription: Plan x\n---\n# Plan\n")).toEqual([]);
	});

	it("rejects a mismatched or invalid name", () => {
		expect(runRaw("---\nname: planner\ndescription: Plan x\n---\n# Plan\n")).toEqual([
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
	const fm = (extra: string) => `---\nname: plan\ndescription: Plan x\n${extra}---\n`;

	it("fires only for Arguments-paragraph skills", () => {
		expect(runRaw(`${fm("")}${paragraph("development")}\n`)).toEqual(["argument-hint-present"]);
		expect(runRaw(`${fm("")}${standardArgsParagraph("development", "basename")}\n`)).toEqual([
			"argument-hint-present",
		]);
		expect(runRaw(`${fm('argument-hint: ""\n')}${paragraph("development")}\n`)).toEqual([
			"argument-hint-present",
		]);
		expect(
			runRaw(`${fm('argument-hint: "[project] [--skip-checks]"\n')}${paragraph("development")}\n`),
		).toEqual([]);
		expect(runRaw(`${fm("")}Plan "$ARGUMENTS" freely.\n`)).toEqual([]);
	});
});

describe("frontmatter-key-order", () => {
	it("warns on description before name", () => {
		const issues = validatePluginSkill(
			parseSkill(
				"---\ndescription: Plan x\nname: plan\n---\n# Plan\n",
				"/repo/plugins/development/skills/plan/SKILL.md",
			),
			ctx,
		);
		expect(issues).toEqual([
			expect.objectContaining({ rule: "frontmatter-key-order", severity: "warning" }),
		]);
	});

	it("accepts the canonical order with other keys after it", () => {
		expect(
			runRaw(
				'---\nname: plan\ndescription: Plan x\nargument-hint: "[project]"\ndisable-model-invocation: true\nmodel: haiku\n---\n# Plan\n',
			),
		).toEqual([]);
	});

	it("warns when another key comes before the four", () => {
		expect(runRaw("---\nmodel: haiku\nname: plan\ndescription: Plan x\n---\n# Plan\n")).toEqual([
			"frontmatter-key-order",
		]);
	});

	it("warns on argument-hint after disable-model-invocation", () => {
		expect(
			runRaw(
				'---\nname: plan\ndescription: Plan x\ndisable-model-invocation: true\nargument-hint: "[project]"\n---\n# Plan\n',
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

	it("accepts the instruction and the group's blockquote as the end of ## Output", () => {
		expect(runAs("finance", output(good))).toEqual([]);
		expect(
			runAs(
				"security",
				`# X\n\n## Output\n\n- Findings\n\n${DISCLAIMER_INSTRUCTION}\n\n${DISCLAIMER_TEXT.security}\n\n`,
			),
		).toEqual([]);
	});

	it("accepts a disclaimer following another blockquote", () => {
		expect(
			runAs(
				"security",
				`# X\n\n## Output\n\n> **Note:** other\n\n${DISCLAIMER_INSTRUCTION}\n\n${DISCLAIMER_TEXT.security}\n`,
			),
		).toEqual([]);
	});

	it("flags a missing disclaimer", () => {
		expect(rules(runAs("compliance", "# X\n\n## Output\n\n- Gaps\n"))).toEqual([
			"disclaimer-present",
		]);
	});

	it("flags a skill with no ## Output section", () => {
		expect(rules(runAs("security", "# X\n\nNo output.\n"))).toEqual(["disclaimer-present"]);
	});

	it("flags another group's blockquote", () => {
		expect(
			rules(
				runAs(
					"compliance",
					`# X\n\n## Output\n\n- Gaps\n\n${DISCLAIMER_INSTRUCTION}\n\n${MONEY_QUOTE}\n`,
				),
			),
		).toEqual(["disclaimer-present"]);
	});

	it("flags the blockquote without the instruction sentence", () => {
		expect(rules(runAs("finance", output(`\n\n${MONEY_QUOTE}\n`)))).toEqual(["disclaimer-present"]);
	});

	it("flags content after the disclaimer", () => {
		expect(rules(runAs("finance", output(`${good}\n- Late bullet\n`)))).toEqual([
			"disclaimer-present",
		]);
	});

	it("flags a disclaimer placed outside ## Output", () => {
		expect(
			rules(
				runAs(
					"finance",
					`# X\n\n${COMPUTE_WITH_CODE_PARAGRAPH}\n\n${DISCLAIMER_INSTRUCTION}\n\n${MONEY_QUOTE}\n\n## Output\n\n- Totals\n`,
				),
			),
		).toEqual(["disclaimer-present"]);
	});

	it("ignores other plugins", () => {
		expect(runAs("legal", "# X\n\n## Output\n\n- Memo\n")).toEqual([]);
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
		expect(runAs("bookkeeping", `# X\n\n${COMPUTE_WITH_CODE_PARAGRAPH}${tail}`)).toEqual([]);
	});

	it("flags a money skill without the paragraph", () => {
		expect(rules(runAs("accounting", `# X${tail}`))).toEqual(["compute-with-code-present"]);
	});

	it("ignores compliance and security", () => {
		expect(
			runAs(
				"compliance",
				`# X\n\n## Output\n\n- Gaps\n\n${DISCLAIMER_INSTRUCTION}\n\n${DISCLAIMER_TEXT.compliance}\n`,
			),
		).toEqual([]);
	});
});

import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { parseSkill } from "./parse-skill.js";
import {
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
};

function run(body: string): ValidationIssue[] {
	return validatePluginSkill(
		parseSkill(`---\ndescription: Plan x\n---\n${body}`, "x/SKILL.md"),
		ctx,
	);
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
		});
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
	return validatePluginSkill(parseSkill(`---\ndescription: Plan x\n---\n${body}`, "x/SKILL.md"), {
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

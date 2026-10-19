import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { parseSkill } from "./parse-skill.js";
import { type PluginContext, buildPluginContext, validatePluginSkill } from "./plugin-rules.js";
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

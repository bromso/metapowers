import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { claudeCodeInstructions, copyDomains, loadDomains, rewritePluginRoot } from "./lib";

function write(path: string, content: string) {
	mkdirSync(dirname(path), { recursive: true });
	writeFileSync(path, content);
}

let root: string;
let tmpl: string;

beforeEach(() => {
	root = mkdtempSync(join(tmpdir(), "create-metapowers-"));
	tmpl = join(root, "templates");
	write(
		join(tmpl, "marketplace.json"),
		JSON.stringify({
			name: "metapowers",
			plugins: [
				{ name: "design", description: "Design thinking" },
				{ name: "marketing", description: "RACE" },
				{ name: "finance", description: "FP&A" },
			],
		}),
	);
	write(
		join(tmpl, "plugins/design/skills/define-component/SKILL.md"),
		"Use `${CLAUDE_PLUGIN_ROOT}/shared/component-contract.md`.\n",
	);
	write(
		join(tmpl, "plugins/design/hooks/hooks.json"),
		'{"command": "\\"${CLAUDE_PLUGIN_ROOT}\\"/hooks/phase-gate.sh"}\n',
	);
	write(join(tmpl, "plugins/design/hooks/phase-gate.sh"), 'cat "${CLAUDE_PLUGIN_ROOT}/x"\n');
	write(join(tmpl, "plugins/marketing/skills/a/SKILL.md"), "a\n");
	write(join(tmpl, "plugins/marketing/skills/b/SKILL.md"), "b\n");
	mkdirSync(join(tmpl, "plugins/marketing/skills/not-a-skill"), { recursive: true });
	write(join(tmpl, "plugins/finance/skills/budget/SKILL.md"), "budget\n");
});

afterEach(() => {
	rmSync(root, { recursive: true, force: true });
});

describe("loadDomains", () => {
	it("loadDomains reads all plugins from marketplace.json and counts SKILL.md dirs", () => {
		const domains = loadDomains(tmpl);
		const find = (name: string) => domains.find((d) => d.name === name);
		expect(domains.map((d) => d.name)).toContain("finance");
		expect(find("marketing")?.skills).toBe(2);
		expect(find("design")).toEqual({ name: "design", description: "Design thinking", skills: 1 });
	});
});

describe("rewritePluginRoot", () => {
	it("rewritePluginRoot handles targets containing $ and &", () => {
		expect(rewritePluginRoot("x `${CLAUDE_PLUGIN_ROOT}/shared/a.md`", "/p/$1 & co")).toBe(
			"x `/p/$1 & co/shared/a.md`",
		);
	});
});

describe("copyDomains", () => {
	it("copyDomains rewrites CLAUDE_PLUGIN_ROOT in copied skills", () => {
		const target = join(root, "project/.metapowers/plugins");
		const copied = copyDomains(tmpl, target, ["design", "marketing"], { overwrite: false });
		expect(copied).toEqual(["design", "marketing"]);
		const designDir = join(target, "design");
		expect(readFileSync(join(designDir, "skills/define-component/SKILL.md"), "utf8")).toBe(
			`Use \`${designDir}/shared/component-contract.md\`.\n`,
		);
		expect(readFileSync(join(designDir, "hooks/hooks.json"), "utf8")).not.toContain(
			"CLAUDE_PLUGIN_ROOT",
		);
		expect(readFileSync(join(designDir, "hooks/phase-gate.sh"), "utf8")).toBe(
			`cat "${designDir}/x"\n`,
		);
		expect(existsSync(join(target, "finance"))).toBe(false);
	});

	it("copyDomains with overwrite removes stale files from a previous install", () => {
		const target = join(root, "project/.metapowers/plugins");
		const stale = join(target, "design/skills/old/SKILL.md");
		write(stale, "stale\n");
		copyDomains(tmpl, target, ["design"], { overwrite: true });
		expect(existsSync(stale)).toBe(false);
		expect(existsSync(join(target, "design/skills/define-component/SKILL.md"))).toBe(true);
	});

	it("copyDomains does not copy a domain's evals/ directory", () => {
		write(join(tmpl, "plugins/design/evals/empathize/prompt.md"), "eval prompt\n");
		const target = join(root, "project/.metapowers/plugins");
		copyDomains(tmpl, target, ["design"], { overwrite: false });
		expect(existsSync(join(target, "design/skills/define-component/SKILL.md"))).toBe(true);
		expect(existsSync(join(target, "design/evals"))).toBe(false);
	});
});

describe("claudeCodeInstructions", () => {
	it("claudeCodeInstructions lists marketplace add then one install per domain", () => {
		expect(claudeCodeInstructions(["design", "legal"])).toBe(
			"/plugin marketplace add bromso/metapowers\n/plugin install design@metapowers\n/plugin install legal@metapowers",
		);
	});
});

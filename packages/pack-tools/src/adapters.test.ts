import {
	existsSync,
	mkdirSync,
	mkdtempSync,
	readFileSync,
	rmSync,
	statSync,
	writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, beforeEach, expect, test } from "vitest";
import { genAdapters } from "./adapters.js";

let tmp: string;
let root: string;
beforeEach(() => {
	tmp = mkdtempSync(path.join(tmpdir(), "pack-tools-adapters-"));
	root = path.join(tmp, "repo");
	write(
		".claude-plugin/plugin.json",
		JSON.stringify({ name: "pack", version: "1.2.3", description: "A pack" }),
	);
	write(
		"skills/design-empathize/SKILL.md",
		'---\nname: design-empathize\ndescription: "Empathize with users. Use when it matters: always."\nmetadata:\n  argument-hint: "<component>"\n  workflow: design\n  phase: 1\n  artifact: 01-empathize.md\n---\n\n# Empathize\n',
	);
	write(
		"skills/singular-detect/SKILL.md",
		"---\nname: singular-detect\ndescription: Detect a stack.\n---\n\n# Detect\n",
	);
	write(
		"skills/singular-find-skill/SKILL.md",
		'---\nname: singular-find-skill\ndescription: Find a skill.\nmetadata:\n  argument-hint: "<topic>"\n  disable-model-invocation: true\n---\n\n# Find\n',
	);
	write(
		"workflows/design.yml",
		[
			"name: design",
			"title: Design Thinking",
			"folder: design",
			"phases:",
			"  - { phase: 1, title: Empathize, artifact: 01-empathize.md, requires: [], skills: [design-empathize] }",
			"  - { phase: 2, title: Define, artifact: 02-define.md, requires: [01-empathize.md], skills: [design-empathize] }",
			"",
		].join("\n"),
	);
	write(
		"workflows/launch.yml",
		[
			"name: launch",
			"title: Launch",
			"folder: launch",
			"phases:",
			"  - { phase: 1, title: Design, folder: design, artifact: 01-empathize.md, requires: [], skills: [design-empathize] }",
			"  - { phase: 2, title: Again, folder: design, artifact: 02-define.md, requires: [01-empathize.md], skills: [design-empathize] }",
			"",
		].join("\n"),
	);
	write("packages/pack-tools/hooks/gate-hook.sh", "#!/usr/bin/env bash\nexit 0\n");
});
afterEach(() => rmSync(tmp, { recursive: true, force: true }));

function write(file: string, content: string): void {
	const target = path.join(root, file);
	mkdirSync(path.dirname(target), { recursive: true });
	writeFileSync(target, content);
}

const read = (file: string) => readFileSync(path.join(root, file), "utf-8");

test("genAdapters writes a command wrapper per skill carrying metadata.argument-hint", () => {
	const changed = genAdapters(root, { check: false });
	expect(changed).toContain("adapters/claude/commands/design-empathize.md");
	expect(read("adapters/claude/commands/design-empathize.md")).toBe(
		[
			"---",
			'description: "Empathize with users. Use when it matters: always."',
			'argument-hint: "<component>"',
			"---",
			"",
			"Use the `design-empathize` skill with these arguments: $ARGUMENTS",
			"",
		].join("\n"),
	);
	expect(read("adapters/claude/commands/singular-detect.md")).toBe(
		[
			"---",
			'description: "Detect a stack."',
			"---",
			"",
			"Use the `singular-detect` skill with these arguments: $ARGUMENTS",
			"",
		].join("\n"),
	);
	expect(read("adapters/claude/commands/singular-find-skill.md")).toContain(
		"disable-model-invocation: true\n",
	);
	expect(read("adapters/gemini/commands/design-empathize.toml")).toBe(
		'description = "Empathize with users. Use when it matters: always."\nprompt = "Use the design-empathize skill with these arguments: {{args}}"\n',
	);
	expect(JSON.parse(read("adapters/claude/gates.json"))).toEqual({
		design: { "02": ["01-empathize.md"] },
	});
	expect((statSync(path.join(root, "adapters/claude/gate-hook.sh")).mode & 0o777).toString(8)).toBe(
		"755",
	);
	for (const manifest of ["plugin.json", ".codex-plugin/plugin.json"]) {
		expect(JSON.parse(read(manifest))).toMatchObject({
			name: "pack",
			version: "1.2.3",
			description: "A pack",
			skills: "./skills",
		});
	}
	expect(JSON.parse(read(".agents/plugins/marketplace.json"))).toMatchObject({ name: "pack" });
	expect(genAdapters(root, { check: true })).toEqual([]);
});

test("genAdapters --check reports a hand-edited wrapper", () => {
	genAdapters(root, { check: false });
	const wrapper = "adapters/claude/commands/singular-detect.md";
	write(wrapper, `${read(wrapper)}Also do this.\n`);
	write("adapters/claude/commands/gone.md", "stale\n");
	expect(genAdapters(root, { check: true })).toEqual(["adapters/claude/commands/gone.md", wrapper]);
	expect(read(wrapper)).toContain("Also do this.");
	genAdapters(root, { check: false });
	expect(existsSync(path.join(root, "adapters/claude/commands/gone.md"))).toBe(false);
	expect(genAdapters(root, { check: true })).toEqual([]);
});

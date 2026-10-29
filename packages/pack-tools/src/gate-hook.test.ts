import { spawnSync } from "node:child_process";
import { copyFileSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, beforeEach, expect, test } from "vitest";

const HOOK = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../hooks/gate-hook.sh");

let tmp: string;
let hook: string;
let project: string;
beforeEach(() => {
	tmp = mkdtempSync(path.join(tmpdir(), "pack-tools-gate-hook-"));
	// The hook reads `gates.json` next to itself, so run a copy beside a fixture.
	const adapter = path.join(tmp, "plugin", "adapters", "claude");
	mkdirSync(adapter, { recursive: true });
	hook = path.join(adapter, "gate-hook.sh");
	copyFileSync(HOOK, hook);
	writeFileSync(
		path.join(adapter, "gates.json"),
		JSON.stringify({ design: { "02": ["01-empathize.md"], "03": ["02-define.md"] } }),
	);
	project = path.join(tmp, "project");
	mkdirSync(project);
});
afterEach(() => rmSync(tmp, { recursive: true, force: true }));

function write(file: string, content: string): void {
	mkdirSync(path.dirname(file), { recursive: true });
	writeFileSync(file, content);
}

/** Runs the hook for a `Write` of `file` (relative to the project root). */
function run(file: string) {
	const input = JSON.stringify({
		tool_name: "Write",
		tool_input: { file_path: path.join(project, file), content: "x" },
	});
	return spawnSync("bash", [hook], { input, encoding: "utf-8" });
}

function skipped(projectName: string, artifact: string): string {
	return `${JSON.stringify({
		ts: "2026-10-29T10:00:00Z",
		skill: "design-define-component",
		workflow: "design",
		phase: 2,
		project: projectName,
		event: "skipped",
		artifact,
		note: "none given",
	})}\n`;
}

test("gate-hook exits 2 and names the missing artifact for phase 2 with no 01", () => {
	const result = run(".singularskills/design/date-picker/02-define.md");
	expect(result.status).toBe(2);
	expect(result.stderr.trim()).toBe(
		"singularskills gate: design/date-picker phase 02 needs 01-empathize.md first. Re-run with --skip-checks.",
	);
});

test("gate-hook exits 0 when log.jsonl has a skipped event for that artifact and project", () => {
	write(path.join(project, ".singularskills/log.jsonl"), skipped("date-picker", "02-define.md"));
	const result = run(".singularskills/design/date-picker/02-define.md");
	expect(result.stderr).toBe("");
	expect(result.status).toBe(0);
});

test("gate-hook ignores a skipped event for another project", () => {
	write(path.join(project, ".singularskills/log.jsonl"), skipped("other", "02-define.md"));
	expect(run(".singularskills/design/date-picker/02-define.md").status).toBe(2);
});

test("gate-hook exits 0 for a project folder named v2.0-beta once the artifact exists", () => {
	const target = ".singularskills/design/v2.0-beta/02-define.md";
	const blocked = run(target);
	expect(blocked.status).toBe(2);
	expect(blocked.stderr).toContain("design/v2.0-beta phase 02 needs 01-empathize.md");
	write(path.join(project, ".singularskills/design/v2.0-beta/01-empathize.md"), "# Empathize\n");
	expect(run(target).status).toBe(0);
});

test("gate-hook treats an empty required file as missing and ignores ungated paths", () => {
	write(path.join(project, ".singularskills/design/date-picker/01-empathize.md"), "");
	expect(run(".singularskills/design/date-picker/02-define.md").status).toBe(2);
	expect(run(".singularskills/design/date-picker/01-empathize.md").status).toBe(0);
	expect(run(".singularskills/design/date-picker/notes.md").status).toBe(0);
	expect(run(".singularskills/log.jsonl").status).toBe(0);
	expect(run("src/02-define.md").status).toBe(0);
});

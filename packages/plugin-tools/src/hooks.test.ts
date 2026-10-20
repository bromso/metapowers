import { spawnSync } from "node:child_process";
import {
	chmodSync,
	copyFileSync,
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
import { fileURLToPath } from "node:url";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { syncHooks } from "./hooks.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const canonicalDir = path.resolve(here, "../hooks");
const designGate = path.resolve(here, "../../../plugins/design/hooks/check-define-exists.sh");

const hubDeps = {
	artifacts: "\\.metapowers/security/([^/]+)/([0-9][0-9])-[^/]+\\.md$",
	domain: "security",
	requires: { "01": ["00-govern.md"], "02": ["00-govern.md"], "03": ["00-govern.md"] },
};
const chainDeps = {
	artifacts: "\\.metapowers/accounting/([^/]+)/([0-9][0-9])-[^/]+\\.md$",
	domain: "accounting",
	requires: { "02": ["01-analyze.md"], "03": ["02-journal.md"] },
};
// Keeps the legacy `\d` form to exercise phase-gate.sh's `\d` -> `[0-9]` fallback.
const complianceDeps = {
	artifacts:
		"\\.metapowers/compliance/([^/]+)/(\\d\\d)-[^/]+\\.md$|\\.metapowers/compliance/([^/]+)/(\\d\\d)-[^/]+/[^/]+\\.md$",
	domain: "compliance",
	requires: { "01": ["00-scope.md"], "02": ["01-assess/*.md"] },
};

const json = (filePath: string, toolName = "Write") =>
	JSON.stringify({ tool_name: toolName, tool_input: { file_path: filePath, content: "x" } });

let tmp: string;
let hookDirs: Record<string, string>;

beforeEach(() => {
	tmp = mkdtempSync(path.join(tmpdir(), "phase gate-"));
	hookDirs = {};
	for (const [name, deps] of Object.entries({
		hub: hubDeps,
		chain: chainDeps,
		compliance: complianceDeps,
	})) {
		const dir = path.join(tmp, "hooks", name);
		mkdirSync(dir, { recursive: true });
		copyFileSync(path.join(canonicalDir, "phase-gate.sh"), path.join(dir, "phase-gate.sh"));
		writeFileSync(path.join(dir, "phase-deps.json"), JSON.stringify(deps));
		hookDirs[name] = dir;
	}
});
afterEach(() => {
	rmSync(tmp, { recursive: true, force: true });
});

function run(script: string, stdin: string, cwd: string, env: Record<string, string> = {}) {
	const r = spawnSync("/bin/bash", [script], {
		input: stdin,
		cwd,
		env: { ...process.env, METAPOWERS_SKIP_CHECKS: "", ...env },
		encoding: "utf-8",
	});
	return { status: r.status, stderr: r.stderr };
}

function gate(
	stdin: string,
	cwd: string,
	env: Record<string, string> = {},
	deps: "hub" | "chain" | "compliance" = "hub",
) {
	return run(path.join(hookDirs[deps], "phase-gate.sh"), stdin, cwd, env);
}

/** Create `rel` (and its parent dirs) under `tmp`. */
function touch(rel: string, content = "") {
	const file = path.join(tmp, rel);
	mkdirSync(path.dirname(file), { recursive: true });
	writeFileSync(file, content);
}

describe("phase-gate.sh", () => {
	it("ignores paths outside .metapowers", () => {
		expect(gate(json("/tmp/x/README.md"), tmp).status).toBe(0);
	});

	it("allows a phase with no requires entry", () => {
		expect(gate(json(`${tmp}/.metapowers/security/acme/00-govern.md`), tmp).status).toBe(0);
	});

	it("blocks with exit 2 and a message naming the missing file", () => {
		const r = gate(json(`${tmp}/.metapowers/security/acme/02-protect.md`), tmp);
		expect(r.status).toBe(2);
		expect(r.stderr).toContain("00-govern.md");
		expect(r.stderr).toBe(
			"Metapowers phase gate: security/acme phase 02 needs 00-govern.md first. Re-run with --skip-checks, or set METAPOWERS_SKIP_CHECKS=1.\n",
		);
	});

	it("allows once the required file exists", () => {
		touch(".metapowers/security/acme/00-govern.md");
		expect(gate(json(`${tmp}/.metapowers/security/acme/02-protect.md`), tmp).status).toBe(0);
	});

	it("hub: phase 3 allowed with only 00 present", () => {
		touch(".metapowers/security/acme/00-govern.md");
		expect(gate(json(`${tmp}/.metapowers/security/acme/03-detect.md`), tmp).status).toBe(0);
	});

	it("chain: phase 3 blocked with only 01 present", () => {
		touch(".metapowers/accounting/acme/01-analyze.md");
		const r = gate(json(`${tmp}/.metapowers/accounting/acme/03-ledger.md`), tmp, {}, "chain");
		expect(r.status).toBe(2);
		expect(r.stderr).toContain("accounting/acme phase 03 needs 02-journal.md first.");
	});

	it("compliance: 01-assess/x.md satisfies phase 2", () => {
		const target = json(`${tmp}/.metapowers/compliance/acme/02-gap-analysis.md`);
		expect(gate(target, tmp, {}, "compliance").status).toBe(2);
		touch(".metapowers/compliance/acme/01-assess/x.md");
		expect(gate(target, tmp, {}, "compliance").status).toBe(0);
	});

	it("compliance: a file inside 01-assess/ is gated as phase 01", () => {
		const target = json(`${tmp}/.metapowers/compliance/acme/01-assess/gdpr.md`);
		const r = gate(target, tmp, {}, "compliance");
		expect(r.status).toBe(2);
		expect(r.stderr).toContain("compliance/acme phase 01 needs 00-scope.md first.");
	});

	it("skip-log naming the target allows that write but not another phase file", () => {
		touch(
			".metapowers/security/acme/skip-log.md",
			"- 2026-10-20T10:00:00Z — Secure Coding skipped prerequisite check for 02-protect.md — reason: demo\n",
		);
		expect(gate(json(`${tmp}/.metapowers/security/acme/02-protect.md`), tmp).status).toBe(0);
		expect(gate(json(`${tmp}/.metapowers/security/acme/03-detect.md`), tmp).status).toBe(2);
	});

	it("METAPOWERS_SKIP_CHECKS=1 allows", () => {
		const target = json(`${tmp}/.metapowers/security/acme/02-protect.md`);
		expect(gate(target, tmp, { METAPOWERS_SKIP_CHECKS: "1" }).status).toBe(0);
	});

	it("absolute file_path under cwd is matched", () => {
		const target = json(`${tmp}/.metapowers/security/acme-corp/02-protect.md`);
		const r = gate(target, tmp);
		expect(r.status).toBe(2);
		expect(r.stderr).toContain("security/acme-corp phase 02");
		touch(".metapowers/security/acme-corp/00-govern.md");
		expect(gate(target, tmp).status).toBe(0);
	});

	it("empty or non-JSON stdin exits 0", () => {
		expect(gate("", tmp).status).toBe(0);
		expect(gate("not json", tmp).status).toBe(0);
	});

	it("Edit on an existing phase file is gated identically", () => {
		touch(".metapowers/security/acme/02-protect.md", "old");
		const r = gate(json(`${tmp}/.metapowers/security/acme/02-protect.md`, "Edit"), tmp);
		expect(r.status).toBe(2);
		expect(r.stderr).toContain("00-govern.md");
	});

	it("missing jq exits 0", () => {
		const emptyBin = path.join(tmp, "empty-bin");
		mkdirSync(emptyBin);
		const r = gate(json(`${tmp}/.metapowers/security/acme/02-protect.md`), tmp, {
			PATH: emptyBin,
		});
		expect(r.status).toBe(0);
	});
});

describe("design check-define-exists.sh", () => {
	const figmaCall = JSON.stringify({
		tool_name: "mcp__plugin_design_metapowers-figma__figma_create_frame",
		tool_input: { name: "Button" },
	});

	it("blocks with exit 2 when no component has 02-define.md", () => {
		touch(".metapowers/design/button/01-empathize.md");
		const r = run(designGate, figmaCall, tmp);
		expect(r.status).toBe(2);
		expect(r.stderr).toBe(
			"Metapowers design gate: no .metapowers/design/<component>/02-define.md found. Run /design:define-component <component> first, or set METAPOWERS_SKIP_CHECKS=1.\n",
		);
	});

	it("allows once any component has 02-define.md, or with METAPOWERS_SKIP_CHECKS=1", () => {
		expect(run(designGate, figmaCall, tmp, { METAPOWERS_SKIP_CHECKS: "1" }).status).toBe(0);
		touch(".metapowers/design/button/02-define.md");
		expect(run(designGate, figmaCall, tmp).status).toBe(0);
	});

	it("does not treat a skip-log entry mentioning Figma as a bypass", () => {
		touch(".metapowers/design/button/skip-log.md", "- skipped prerequisite check for Figma\n");
		expect(run(designGate, figmaCall, tmp).status).toBe(2);
	});
});

describe("syncHooks", () => {
	let root: string;
	beforeEach(() => {
		root = path.join(tmp, "plugins");
		for (const p of ["security", "design", "coaching"]) {
			mkdirSync(path.join(root, p, "hooks"), { recursive: true });
			writeFileSync(path.join(root, p, "hooks", "hooks.json"), '{"hooks":{}}\n');
		}
		writeFileSync(path.join(root, "security/hooks/phase-deps.json"), JSON.stringify(hubDeps));
		writeFileSync(path.join(root, "design/hooks/phase-deps.json"), JSON.stringify(hubDeps));
	});

	it("writes phase-gate.sh (755) and hooks.json to phased plugins and removes the rest", () => {
		const changed = syncHooks(root, canonicalDir, { check: false });
		expect(changed.length).toBeGreaterThan(0);
		const gateFile = path.join(root, "security/hooks/phase-gate.sh");
		expect(readFileSync(gateFile, "utf-8")).toBe(
			readFileSync(path.join(canonicalDir, "phase-gate.sh"), "utf-8"),
		);
		expect(statSync(gateFile).mode & 0o777).toBe(0o755);
		const sec = JSON.parse(readFileSync(path.join(root, "security/hooks/hooks.json"), "utf-8"));
		expect(sec.hooks.PreToolUse).toHaveLength(1);
		expect(sec.hooks.PreToolUse[0].matcher).toBe("Write|Edit|MultiEdit");
		const design = JSON.parse(readFileSync(path.join(root, "design/hooks/hooks.json"), "utf-8"));
		expect(design.hooks.PreToolUse).toHaveLength(2);
		expect(design.hooks.PreToolUse[1].matcher).toBe(
			"mcp__(plugin_design_)?metapowers-figma__figma_(create|modify|delete|duplicate|reorder|set|add|apply|arrange|group|execute).*",
		);
		expect(existsSync(path.join(root, "coaching/hooks/hooks.json"))).toBe(false);
		expect(syncHooks(root, canonicalDir, { check: true })).toEqual([]);
	});

	it("check reports drift in content and mode without writing", () => {
		syncHooks(root, canonicalDir, { check: false });
		const gateFile = path.join(root, "security/hooks/phase-gate.sh");
		chmodSync(gateFile, 0o644);
		writeFileSync(path.join(root, "coaching/hooks/hooks.json"), "{}\n");
		const changed = syncHooks(root, canonicalDir, { check: true });
		expect(changed).toEqual([path.join(root, "coaching/hooks/hooks.json"), gateFile]);
		expect(statSync(gateFile).mode & 0o777).toBe(0o644);
	});
});

describe("design-extra.json Figma matcher", () => {
	const extra = JSON.parse(readFileSync(path.join(canonicalDir, "design-extra.json"), "utf-8"));
	const re = new RegExp(`^(?:${extra.matcher})$`);
	const mutating = [
		"figma_create_frame",
		"figma_create_component",
		"figma_create_instance",
		"figma_create_shape",
		"figma_create_text",
		"figma_create_slide",
		"figma_modify_node",
		"figma_delete_node",
		"figma_delete_slide",
		"figma_duplicate_slide",
		"figma_reorder_slides",
		"figma_set_auto_layout",
		"figma_set_slide_transition",
		"figma_add_shape_to_slide",
		"figma_add_text_to_slide",
		"figma_apply_styles",
		"figma_arrange_component_set",
		"figma_group_nodes",
		"figma_execute",
	];
	const prefixes = ["mcp__plugin_design_metapowers-figma__", "mcp__metapowers-figma__"];
	const cases = (tools: string[]) => prefixes.flatMap((p) => tools.map((t) => `${p}${t}`));
	it("matches the plugin-scoped and the user-level create_component name", () => {
		expect(re.test("mcp__plugin_design_metapowers-figma__figma_create_component")).toBe(true);
		expect(re.test("mcp__metapowers-figma__figma_create_component")).toBe(true);
	});
	it.each(cases(mutating))("matches %s", (tool) => {
		expect(re.test(tool)).toBe(true);
	});
	it.each(
		cases([
			"figma_export_image",
			"figma_get_component",
			"figma_get_component_for_dev",
			"figma_get_component_image",
			"figma_get_components",
			"figma_get_design_system",
			"figma_get_design_system_summary",
			"figma_get_file_info",
			"figma_get_node",
			"figma_get_slide_content",
			"figma_get_styles",
			"figma_get_variables",
			"figma_list_slides",
		]),
	)("does not match read-only %s", (tool) => {
		expect(re.test(tool)).toBe(false);
	});
	it("does not match another plugin's server", () => {
		expect(re.test("mcp__plugin_other_metapowers-figma__figma_create_frame")).toBe(false);
	});
});

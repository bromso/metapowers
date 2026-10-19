import { chmodSync, existsSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import { listPlugins } from "./skills.js";

const GATE_MODE = 0o755;

function readOrUndefined(file: string): string | undefined {
	try {
		return readFileSync(file, "utf-8");
	} catch {
		return undefined;
	}
}

/** The hooks.json text for `plugin`: the canonical entry, plus design's Figma gate. */
export function hooksJsonFor(plugin: string, canonicalDir: string): string {
	const hooks = JSON.parse(readFileSync(path.join(canonicalDir, "hooks.json"), "utf-8"));
	if (plugin === "design") {
		const extra = JSON.parse(readFileSync(path.join(canonicalDir, "design-extra.json"), "utf-8"));
		hooks.hooks.PreToolUse.push(extra);
	}
	return `${JSON.stringify(hooks, null, "\t")}\n`;
}

/**
 * Copy `phase-gate.sh` (mode 755) and `hooks.json` from `canonicalDir` into every plugin
 * under `pluginsRoot` that has `hooks/phase-deps.json`, and delete `hooks/hooks.json` from
 * plugins without one. Returns every path that changed (or, with `check`, would change),
 * sorted; with `check` nothing is written.
 */
export function syncHooks(
	pluginsRoot: string,
	canonicalDir: string,
	{ check }: { check: boolean },
): string[] {
	const gate = readFileSync(path.join(canonicalDir, "phase-gate.sh"), "utf-8");
	const changed: string[] = [];
	for (const plugin of listPlugins(pluginsRoot)) {
		const hooksDir = path.join(pluginsRoot, plugin, "hooks");
		const hooksJson = path.join(hooksDir, "hooks.json");
		if (!existsSync(path.join(hooksDir, "phase-deps.json"))) {
			if (existsSync(hooksJson)) {
				changed.push(hooksJson);
				if (!check) rmSync(hooksJson);
			}
			continue;
		}
		const gateFile = path.join(hooksDir, "phase-gate.sh");
		const gateStale =
			readOrUndefined(gateFile) !== gate || (statSync(gateFile).mode & 0o777) !== GATE_MODE;
		if (gateStale) {
			changed.push(gateFile);
			if (!check) {
				writeFileSync(gateFile, gate);
				chmodSync(gateFile, GATE_MODE);
			}
		}
		const text = hooksJsonFor(plugin, canonicalDir);
		if (readOrUndefined(hooksJson) !== text) {
			changed.push(hooksJson);
			if (!check) writeFileSync(hooksJson, text);
		}
	}
	return changed.sort();
}

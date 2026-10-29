import {
	chmodSync,
	existsSync,
	mkdirSync,
	readFileSync,
	readdirSync,
	rmSync,
	rmdirSync,
	statSync,
	writeFileSync,
} from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { Workflow } from "./workflows.js";

/** `templates/gate.sh`, a sibling of both `src/` and `dist/`. */
const TEMPLATE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../templates/gate.sh");
const MODE = 0o755;

export type Gate = { required: string[]; folder: string };

/**
 * The gate of every skill that needs one: a member of a domain workflow's phase that produces an
 * artifact and requires earlier ones. Cross-domain workflows (whose phases carry `folder`) never
 * gate; their skills are gated by their own domain workflow.
 */
export function gatedSkills(workflows: Workflow[]): Map<string, Gate> {
	const result = new Map<string, Gate>();
	for (const wf of workflows) {
		if (wf.phases.some((phase) => phase.folder !== undefined)) continue;
		for (const phase of wf.phases) {
			if (!phase.artifact || phase.requires.length === 0) continue;
			for (const name of phase.skills) {
				if (result.has(name)) throw new Error(`${name} is a member of more than one gated phase`);
				result.set(name, { required: phase.requires, folder: wf.folder });
			}
		}
	}
	return result;
}

/** The template with `REQUIRED` and `FOLDER` filled in. */
function render(template: string, gate: Gate): string {
	return template.replace("@REQUIRED@", gate.required.join(" ")).replace("@FOLDER@", gate.folder);
}

function upToDate(file: string, content: string): boolean {
	if (!existsSync(file)) return false;
	return readFileSync(file, "utf-8") === content && (statSync(file).mode & 0o777) === MODE;
}

/**
 * Writes `skills/<member>/scripts/gate.sh` (mode 0755) for every gated skill under `repoRoot`
 * and deletes the gate script of every other skill. Returns the repo-relative paths that
 * change (with `check`, that would change; nothing is written).
 */
export function genGates(
	repoRoot: string,
	workflows: Workflow[],
	{ check }: { check: boolean },
): string[] {
	const template = readFileSync(TEMPLATE, "utf-8");
	const wanted = gatedSkills(workflows);
	const skillsDir = path.join(repoRoot, "skills");
	const changed: string[] = [];
	const names = readdirSync(skillsDir).filter((name) =>
		existsSync(path.join(skillsDir, name, "SKILL.md")),
	);
	for (const name of names.sort()) {
		const relative = path.posix.join("skills", name, "scripts", "gate.sh");
		const file = path.join(repoRoot, relative);
		const gate = wanted.get(name);
		if (gate) {
			const content = render(template, gate);
			if (upToDate(file, content)) continue;
			changed.push(relative);
			if (check) continue;
			mkdirSync(path.dirname(file), { recursive: true });
			writeFileSync(file, content);
			chmodSync(file, MODE);
		} else if (existsSync(file)) {
			changed.push(relative);
			if (check) continue;
			rmSync(file);
			const scripts = path.dirname(file);
			if (readdirSync(scripts).length === 0) rmdirSync(scripts);
		}
	}
	return changed;
}

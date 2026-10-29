import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { parse } from "yaml";
import type { SkillFile } from "./skills.js";

export type Phase = {
	phase: number;
	title: string;
	/**
	 * Only in cross-domain workflows: the domain folder this step's skill writes into. Such a
	 * step borrows a skill from its domain's workflow, so its members are not held to `metadata`.
	 */
	folder?: string;
	/**
	 * File below the folder; ends in `/` for a folder artifact. Omitted for an approval-only
	 * phase (its skill writes no file, or writes outside `<folder>/<project>/`); never `""`.
	 */
	artifact?: string;
	requires: string[];
	skills: string[];
};
export type Workflow = { name: string; title: string; folder: string; phases: Phase[] };

/** Every `<dir>/*.yml`, parsed, sorted by file name. */
export function loadWorkflows(dir: string): Workflow[] {
	return readdirSync(dir)
		.filter((file) => file.endsWith(".yml"))
		.sort()
		.map((file) => parse(readFileSync(path.join(dir, file), "utf-8")) as Workflow);
}

type Membership = { workflow?: unknown; phase?: unknown };

/** The skill's `metadata` workflow and phase, or `{}` when it has none. */
function membership(skill: SkillFile): Membership {
	const block = /^---\n([\s\S]*?)\n---/.exec(skill.content)?.[1];
	if (!block) return {};
	try {
		const metadata = (parse(block) as { metadata?: Membership } | null)?.metadata;
		return metadata ?? {};
	} catch {
		return {};
	}
}

const isCrossDomain = (wf: Workflow) => wf.phases.some((phase) => phase.folder !== undefined);

/**
 * In a cross-domain workflow, a member keeps the gate of its domain workflow: every file its
 * domain phase `requires` must be produced by an earlier phase of this workflow with the same
 * `folder`, or the member's gate refuses every run.
 */
function checkCrossDomainRequires(workflows: Workflow[]): string[] {
	const requires = new Map<string, string[]>();
	for (const wf of workflows) {
		if (isCrossDomain(wf)) continue;
		for (const phase of wf.phases) {
			for (const name of phase.skills) requires.set(name, phase.requires);
		}
	}
	const violations: string[] = [];
	for (const wf of workflows.filter(isCrossDomain)) {
		for (const phase of wf.phases) {
			if (phase.folder === undefined) continue;
			const produced = new Set(
				wf.phases.flatMap((p) =>
					p.phase < phase.phase && p.folder === phase.folder && p.artifact ? [p.artifact] : [],
				),
			);
			for (const name of phase.skills) {
				for (const file of requires.get(name) ?? []) {
					if (produced.has(file)) continue;
					violations.push(
						`${wf.name}: phase ${phase.phase} member ${name} requires ${file} which no earlier ${phase.folder} phase produces`,
					);
				}
			}
		}
	}
	return violations;
}

/**
 * Violations of the workflow invariants (spec §6.2), `[]` when clean: every `requires` names an
 * earlier phase's artifact, every member is a skill of the pack, the members of a domain
 * workflow agree with their `metadata.workflow`/`metadata.phase` both ways, and in a
 * cross-domain workflow every member's domain `requires` is produced by an earlier phase with
 * the same `folder`.
 */
export function checkWorkflows(workflows: Workflow[], skills: SkillFile[]): string[] {
	const violations: string[] = [];
	const byName = new Map(skills.map((skill) => [skill.name, skill]));
	for (const wf of workflows) {
		for (const phase of wf.phases) {
			if (phase.artifact === "") {
				violations.push(`${wf.name}: phase ${phase.phase} has an empty artifact`);
			}
			const produced = new Set(
				wf.phases.flatMap((p) => (p.phase < phase.phase && p.artifact ? [p.artifact] : [])),
			);
			for (const file of phase.requires) {
				if (!produced.has(file)) {
					violations.push(
						`${wf.name}: phase ${phase.phase} requires ${file} which no earlier phase produces`,
					);
				}
			}
			for (const name of phase.skills) {
				const skill = byName.get(name);
				if (!skill) {
					violations.push(`${wf.name}: phase ${phase.phase} names unknown skill ${name}`);
					continue;
				}
				if (phase.folder !== undefined) continue;
				const meta = membership(skill);
				if (meta.workflow === wf.name && meta.phase === phase.phase) continue;
				const other = meta.workflow ? `${meta.workflow} phase ${meta.phase}` : "nothing";
				violations.push(
					`${name}: listed in ${wf.name} phase ${phase.phase} but metadata says ${other}`,
				);
			}
		}
	}
	violations.push(...checkCrossDomainRequires(workflows));
	const byWorkflow = new Map(workflows.map((wf) => [wf.name, wf]));
	for (const skill of skills) {
		const meta = membership(skill);
		if (meta.workflow === undefined) continue;
		const wf = byWorkflow.get(String(meta.workflow));
		if (!wf) {
			violations.push(`${skill.name}: metadata.workflow ${meta.workflow} has no workflow file`);
		} else if (!wf.phases.some((p) => p.phase === meta.phase)) {
			violations.push(`${skill.name}: metadata.phase ${meta.phase} is not a phase of ${wf.name}`);
		}
	}
	return violations;
}

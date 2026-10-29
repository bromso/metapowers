import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { parse } from "yaml";

/**
 * A workflow file's types and loader. Kept identical in shape to `Phase`/`Workflow` and
 * `loadWorkflows` in packages/pack-tools/src/workflows.ts (duplicated so the validator does not
 * depend on pack-tools; a pack-tools test parses a shared fixture with both and compares them).
 */
export type Phase = {
	phase: number;
	title: string;
	/** Only in cross-domain workflows: the domain folder this step's skill writes into. */
	folder?: string;
	/** File below the folder; ends in `/` for a folder artifact. Omitted for an approval-only phase. */
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

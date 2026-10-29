import {
	chmodSync,
	existsSync,
	mkdirSync,
	readFileSync,
	readdirSync,
	rmSync,
	statSync,
	writeFileSync,
} from "node:fs";
import path from "node:path";
import { parse } from "yaml";
import { type SkillFile, listSkills } from "./skills.js";
import { type Workflow, loadWorkflows } from "./workflows.js";

/** Canonical gate hook, copied into the Claude adapter. */
const HOOK_SOURCE = "packages/pack-tools/hooks/gate-hook.sh";
const HOOK_MODE = 0o755;
const CLAUDE_COMMANDS = "adapters/claude/commands";
const GEMINI_COMMANDS = "adapters/gemini/commands";

type Frontmatter = {
	description?: unknown;
	metadata?: { "argument-hint"?: unknown; "disable-model-invocation"?: unknown };
};

/** The pack's identity, read from the Claude manifest (the one hand-written manifest). */
type Manifest = {
	name: string;
	version: string;
	description: string;
	author?: unknown;
	homepage?: unknown;
	repository?: unknown;
	license?: unknown;
	keywords?: unknown;
};

function frontmatter(skill: SkillFile): Frontmatter {
	const block = /^---\n([\s\S]*?)\n---/.exec(skill.content)?.[1];
	if (!block) throw new Error(`${skill.name}: no frontmatter`);
	const data = parse(block) as Frontmatter | null;
	if (typeof data?.description !== "string") throw new Error(`${skill.name}: no description`);
	return data;
}

/** `/<name>` in Claude Code: frontmatter from the skill, a body that hands over to it. */
function claudeCommand(skill: SkillFile): string {
	const { description, metadata } = frontmatter(skill);
	const lines = ["---", `description: ${JSON.stringify(description)}`];
	const hint = metadata?.["argument-hint"];
	if (typeof hint === "string") lines.push(`argument-hint: ${JSON.stringify(hint)}`);
	if (metadata?.["disable-model-invocation"] === true) lines.push("disable-model-invocation: true");
	lines.push("---", "", `Use the \`${skill.name}\` skill with these arguments: $ARGUMENTS`, "");
	return lines.join("\n");
}

/** `/<name>` in Gemini CLI. A JSON string literal is a valid TOML basic string. */
function geminiCommand(skill: SkillFile): string {
	const { description } = frontmatter(skill);
	const prompt = `Use the ${skill.name} skill with these arguments: {{args}}`;
	return `description = ${JSON.stringify(description)}\nprompt = ${JSON.stringify(prompt)}\n`;
}

/**
 * The requirements the Claude gate hook enforces: `{ <folder>: { <NN>: [artifact, …] } }` for
 * every phase of a domain workflow that requires earlier artifacts. Cross-domain workflows
 * (whose phases carry `folder`) never gate.
 */
function gatesJson(workflows: Workflow[]): string {
	const gates: Record<string, Record<string, string[]>> = {};
	for (const wf of workflows) {
		if (wf.phases.some((phase) => phase.folder !== undefined)) continue;
		for (const phase of wf.phases) {
			if (phase.requires.length === 0) continue;
			const folder = gates[wf.folder] ?? {};
			gates[wf.folder] = folder;
			const key = String(phase.phase).padStart(2, "0");
			if (folder[key]) throw new Error(`${wf.folder}: two workflows gate phase ${key}`);
			folder[key] = phase.requires;
		}
	}
	return json(gates);
}

const LINE_WIDTH = 100;
/** A multi-line array of scalars, as `JSON.stringify(…, "\t")` prints it. */
const SCALAR_ARRAY =
	/^(\t*)(.*)\[\n((?:\t+(?:"(?:[^"\\]|\\.)*"|[-+.\deE]+|true|false|null),?\n)+)\t*\]/gm;

/**
 * Tab-indented JSON as Biome formats it: an array of scalars sits on one line when that line
 * fits the line width (a tab counts as two columns).
 */
function json(value: unknown): string {
	const text = JSON.stringify(value, null, "\t").replace(
		SCALAR_ARRAY,
		(block, indent: string, head: string, items: string) => {
			const inline = `${indent}${head}[${items
				.trim()
				.split(/,?\n\t*/)
				.join(", ")}]`;
			const width = inline.length + indent.length;
			return width <= LINE_WIDTH ? inline : block;
		},
	);
	return `${text}\n`;
}

/** The Codex and Copilot CLI manifests: the Claude manifest's identity plus the skills folder. */
function pluginManifest(manifest: Manifest): string {
	const { name, version, description, author, homepage, repository, license, keywords } = manifest;
	return json({
		name,
		version,
		description,
		author,
		homepage,
		repository,
		license,
		keywords,
		skills: "./skills",
	});
}

/** Codex's repo marketplace: this repo is the one plugin, at its root. */
function codexMarketplace(manifest: Manifest): string {
	const { name, version, description } = manifest;
	return json({
		name,
		version,
		description,
		skills: "./skills",
		plugins: [
			{
				name,
				version,
				description,
				source: { source: "local", path: "./" },
				policy: { installation: "AVAILABLE", authentication: "ON_INSTALL" },
				category: "Productivity",
			},
		],
	});
}

/**
 * Writes the agent adapters under `repoRoot` from `skills/`, `workflows/` and
 * `.claude-plugin/plugin.json`: a Claude and a Gemini command wrapper per skill (deleting
 * wrappers of skills that no longer exist), the Claude gate hook and its `gates.json`, and the
 * Codex and Copilot CLI manifests. Returns the sorted repo-relative paths that change (with
 * `check`, that would change; nothing is written).
 */
export function genAdapters(repoRoot: string, { check }: { check: boolean }): string[] {
	const manifest = JSON.parse(
		readFileSync(path.join(repoRoot, ".claude-plugin/plugin.json"), "utf-8"),
	) as Manifest;
	const skills = listSkills(path.join(repoRoot, "skills"));
	const wanted = new Map<string, { content: string; mode?: number }>();
	for (const skill of skills) {
		wanted.set(`${CLAUDE_COMMANDS}/${skill.name}.md`, { content: claudeCommand(skill) });
		wanted.set(`${GEMINI_COMMANDS}/${skill.name}.toml`, { content: geminiCommand(skill) });
	}
	wanted.set("adapters/claude/gates.json", {
		content: gatesJson(loadWorkflows(path.join(repoRoot, "workflows"))),
	});
	wanted.set("adapters/claude/gate-hook.sh", {
		content: readFileSync(path.join(repoRoot, HOOK_SOURCE), "utf-8"),
		mode: HOOK_MODE,
	});
	wanted.set(".codex-plugin/plugin.json", { content: pluginManifest(manifest) });
	wanted.set(".agents/plugins/marketplace.json", { content: codexMarketplace(manifest) });
	wanted.set("plugin.json", { content: pluginManifest(manifest) });

	const changed: string[] = [];
	for (const [relative, { content, mode }] of wanted) {
		const file = path.join(repoRoot, relative);
		const current = existsSync(file) ? readFileSync(file, "utf-8") : undefined;
		const modeOk =
			mode === undefined || (current !== undefined && (statSync(file).mode & 0o777) === mode);
		if (current === content && modeOk) continue;
		changed.push(relative);
		if (check) continue;
		mkdirSync(path.dirname(file), { recursive: true });
		writeFileSync(file, content);
		if (mode !== undefined) chmodSync(file, mode);
	}
	for (const dir of [CLAUDE_COMMANDS, GEMINI_COMMANDS]) {
		const absolute = path.join(repoRoot, dir);
		if (!existsSync(absolute)) continue;
		for (const entry of readdirSync(absolute)) {
			const relative = `${dir}/${entry}`;
			if (wanted.has(relative)) continue;
			changed.push(relative);
			if (!check) rmSync(path.join(absolute, entry), { recursive: true });
		}
	}
	return changed.sort();
}

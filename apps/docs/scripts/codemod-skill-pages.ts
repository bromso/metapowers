import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { basename, dirname, join, relative, resolve } from "node:path";

/**
 * Re-wraps skill pages under content/docs into the skill-page components (spec §7.5):
 * `## Usage` fence → frontmatter `command`, `## What It Does` list → `<Steps>`, `## Output` →
 * `<Output>`, `## MCP Tools Used` → `<Requires>`, `## Next Phase` → `<NextPhase>`, and the
 * phase-group `## Skills` fences / `**Output:**` lines → `<Command>` / `<Output>`. Every page also
 * gets a frontmatter `kind`. Line/section based: untouched markdown is never reformatted, no words
 * are removed, and a second run changes nothing.
 */

export type Kind = "phase" | "utility" | "overview";

const UTILITY_SEPARATORS = new Set([
	"---Utilities---",
	"---Skill Management---",
	"---Project---",
	"---Meta Skills---",
	"---Other---",
]);

export function deriveKind(fileBase: string, meta: { pages: string[] } | undefined): Kind {
	if (!meta) return "overview";
	let current: Kind = "overview";
	for (const entry of meta.pages) {
		if (/^---.*---$/.test(entry)) {
			current =
				entry === "---Phases---" ? "phase" : UTILITY_SEPARATORS.has(entry) ? "utility" : "overview";
		} else if (entry === fileBase) {
			return current;
		}
	}
	return "overview";
}

// ---------------------------------------------------------------------------------------------
// Line helpers

const FENCE_OPEN = /^\s*(`{3,}|~{3,})/;

type Fence = { start: number; end: number; inner: string[] };

/** Fenced blocks in `lines` (start/end are the indexes of the fence lines). */
function findFences(lines: string[]): Fence[] {
	const fences: Fence[] = [];
	let open: { start: number; marker: string } | null = null;
	lines.forEach((line, index) => {
		if (!open) {
			const match = FENCE_OPEN.exec(line);
			if (match) open = { start: index, marker: match[1] };
			return;
		}
		const trimmed = line.trim();
		if (trimmed.startsWith(open.marker) && /^(`+|~+)$/.test(trimmed)) {
			fences.push({ start: open.start, end: index, inner: lines.slice(open.start + 1, index) });
			open = null;
		}
	});
	return fences;
}

const isBlank = (line: string | undefined) => line !== undefined && line.trim() === "";

/** The single non-empty line of a fence, or null when the fence holds zero or several lines. */
function singleLine(fence: Fence): string | null {
	const lines = fence.inner.filter((line) => line.trim() !== "");
	return lines.length === 1 ? lines[0].trim() : null;
}

/** A JSX attribute: a plain string literal when safe, else a JS string expression. */
function attr(name: string, value: string): string {
	return /["{}<>]/.test(value) ? `${name}={${JSON.stringify(value)}}` : `${name}="${value}"`;
}

function yamlValue(value: string): string {
	return /^[A-Za-z0-9][\w .-]*$/.test(value) && !/\s$/.test(value)
		? value
		: `"${value.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

/** Index just past the first sentence of `text`, ignoring punctuation inside code spans. */
function firstSentenceEnd(text: string): number | null {
	let inCode = false;
	for (let i = 0; i < text.length - 1; i++) {
		const char = text[i];
		if (char === "`") inCode = !inCode;
		if (inCode || !".!?".includes(char) || text[i + 1] !== " ") continue;
		const rest = text.slice(i + 1).trimStart();
		if (/^[A-Z`"'*([]/.test(rest)) return i + 1;
	}
	return null;
}

// ---------------------------------------------------------------------------------------------
// Section rules. Each takes the section's content (no heading, no surrounding blank lines) and
// returns new content, "skip" when there is nothing to do (already transformed), or "unmatched".

type RuleResult = string[] | "skip" | "unmatched";

function stepLine(item: string): string {
	const end = firstSentenceEnd(item);
	const title = end === null ? null : item.slice(0, end).trim();
	const body = end === null ? item : item.slice(end).trim();
	// Titles render as plain text, so only split when the first sentence has no inline markdown.
	if (title === null || body === "" || /[`*_[\]<>{}]/.test(title)) return `<Step>${item}</Step>`;
	return `<Step ${attr("title", title)}>${body}</Step>`;
}

function ruleWhatItDoes(content: string[]): RuleResult {
	if (content.some((line) => line.includes("<Steps>"))) return "skip";
	const items: string[] = [];
	let afterBlank = false;
	for (const line of content) {
		if (isBlank(line)) {
			afterBlank = true;
			continue;
		}
		const item = /^\d+\.\s+(.*)$/.exec(line);
		if (item) {
			items.push(item[1].trim());
		} else if (
			items.length > 0 &&
			!afterBlank &&
			/^\s+\S/.test(line) &&
			!/^\s+([-*+]|\d+\.)\s/.test(line)
		) {
			items[items.length - 1] += ` ${line.trim()}`;
		} else {
			return "unmatched";
		}
		afterBlank = false;
	}
	if (items.length === 0) return "unmatched";
	return ["<Steps>", ...items.map(stepLine), "</Steps>"];
}

function ruleOutput(content: string[]): RuleResult {
	if (content.some((line) => line.includes("<Output>"))) return "skip";
	if (content.length === 0) return "unmatched";
	return ["<Output>", ...content, "</Output>"];
}

function ruleMcpTools(content: string[]): RuleResult {
	if (content.some((line) => line.includes("<Requires"))) return "skip";
	const tools: string[] = [];
	for (const line of content) {
		if (isBlank(line)) continue;
		const match = /^[-*]\s+`([^`]+)`\s+[—–]\s+(.+)$/.exec(line);
		if (!match) return "unmatched";
		const [, name, description] = match;
		tools.push(
			`\t\t{ name: ${JSON.stringify(name)}, description: ${JSON.stringify(description.trim())} },`,
		);
	}
	if (tools.length === 0) return "unmatched";
	return ["<Requires", "\tmcp={[", ...tools, "\t]}", "/>"];
}

function ruleNextPhase(content: string[]): RuleResult {
	if (content.some((line) => line.includes("<NextPhase"))) return "skip";
	const isParagraph = content.every(
		(line) => !isBlank(line) && !/^\s*([-*+>#<|]|\d+\.\s|```|~~~)/.test(line),
	);
	if (content.length === 0 || !isParagraph) return "unmatched";
	const text = content.map((line) => line.trim()).join(" ");
	const links = [...text.matchAll(/\[([^\]]+)\]\(([^)\s]+)\)/g)];
	if (links.length !== 1) return "unmatched";
	const [link, title, href] = links[0];
	const children = text.replace(link, () => title);
	return [`<NextPhase ${attr("href", href)} ${attr("title", title)}>${children}</NextPhase>`];
}

function rulePhaseGroup(content: string[]): RuleResult {
	const fences = findFences(content);
	const outputLines = content.filter((line) => line.startsWith("**Output:**"));
	if (fences.length === 0 && outputLines.length === 0) {
		return content.some((line) => line.includes("<Command>")) ? "skip" : "unmatched";
	}
	const commands = fences.map(singleLine);
	if (commands.some((command) => command === null || !command.startsWith("/"))) return "unmatched";
	const out: string[] = [];
	for (let i = 0; i < content.length; i++) {
		const fenceIndex = fences.findIndex((fence) => fence.start === i);
		if (fenceIndex >= 0) {
			out.push("<Command>", `{${JSON.stringify(commands[fenceIndex])}}`, "</Command>");
			i = fences[fenceIndex].end;
		} else if (content[i].startsWith("**Output:**")) {
			out.push(`<Output>${content[i]}</Output>`);
		} else {
			out.push(content[i]);
		}
	}
	return out;
}

/** Lifts the first fence out of `## Usage`; returns the command and the remaining content. */
function liftUsage(content: string[]): { command: string; content: string[] } | "unmatched" {
	const fence = findFences(content)[0];
	const command = fence ? singleLine(fence) : null;
	if (!fence || command === null) return "unmatched";
	const rest = [...content.slice(0, fence.start), ...content.slice(fence.end + 1)];
	// Collapse the blank line pair the fence sat between, keep everything else as is.
	if ((fence.start === 0 || isBlank(rest[fence.start - 1])) && isBlank(rest[fence.start])) {
		rest.splice(fence.start, 1);
	}
	return { command, content: trimBlank(rest).content };
}

// ---------------------------------------------------------------------------------------------
// Document structure

type Section = { heading: string | null; lines: string[] };

/** Splits body lines into a preamble and `## ` sections, ignoring `## ` lines inside fences. */
function splitSections(lines: string[]): Section[] {
	const sections: Section[] = [{ heading: null, lines: [] }];
	let fence: string | null = null;
	for (const line of lines) {
		const match = FENCE_OPEN.exec(line);
		if (fence === null && match) fence = match[1];
		else if (fence !== null && line.trim().startsWith(fence) && /^(`+|~+)$/.test(line.trim())) {
			fence = null;
		} else if (fence === null && line.startsWith("## ")) {
			sections.push({ heading: line.slice(3).trim(), lines: [line] });
			continue;
		}
		sections[sections.length - 1].lines.push(line);
	}
	return sections;
}

function trimBlank(lines: string[]): { lead: string[]; content: string[]; trail: string[] } {
	let start = 0;
	let end = lines.length;
	while (start < end && isBlank(lines[start])) start++;
	while (end > start && isBlank(lines[end - 1])) end--;
	return { lead: lines.slice(0, start), content: lines.slice(start, end), trail: lines.slice(end) };
}

/** Sets `key` in frontmatter lines: in place when present, else after `after` (or description). */
function setFrontmatterKey(fm: string[], key: string, value: string, after?: string): void {
	const line = `${key}: ${yamlValue(value)}`;
	const existing = fm.findIndex((l) => l.startsWith(`${key}:`));
	if (existing >= 0) {
		fm[existing] = line;
		return;
	}
	let anchor = fm.findIndex((l) => l.startsWith(`${after ?? "description"}:`));
	if (anchor < 0) anchor = fm.findIndex((l) => l.startsWith("description:"));
	if (anchor < 0) {
		fm.push(line);
		return;
	}
	while (anchor + 1 < fm.length && /^\s+\S/.test(fm[anchor + 1])) anchor++;
	fm.splice(anchor + 1, 0, line);
}

const SECTION_RULES: Record<string, (content: string[]) => RuleResult> = {
	"What It Does": ruleWhatItDoes,
	Output: ruleOutput,
	"MCP Tools Used": ruleMcpTools,
	"Next Phase": ruleNextPhase,
	Skills: rulePhaseGroup,
};

export function transformDoc(
	src: string,
	kind: Kind,
): { out: string; changed: boolean; report: string[] } {
	const lines = src.split("\n");
	const report: string[] = [];
	const fmEnd = lines[0] === "---" ? lines.indexOf("---", 1) : -1;
	if (fmEnd < 0) return { out: src, changed: false, report: ["(no frontmatter)"] };
	const fm = lines.slice(1, fmEnd);
	const hasCommand = fm.some((line) => line.startsWith("command:"));
	let command: string | null = null;
	let usageSeen = false;

	const body: string[] = [];
	for (const section of splitSections(lines.slice(fmEnd + 1))) {
		const { heading } = section;
		if (heading === null) {
			body.push(...section.lines);
			continue;
		}
		const { lead, content, trail } = trimBlank(section.lines.slice(1));
		let result: RuleResult | "drop" = "skip";

		if (heading === "Usage") {
			if (usageSeen) result = "unmatched";
			else if (!hasCommand) {
				const lifted = liftUsage(content);
				if (lifted === "unmatched") result = "unmatched";
				else {
					command = lifted.command;
					result = lifted.content.length === 0 ? "drop" : lifted.content;
				}
			}
			usageSeen = true;
		} else if (SECTION_RULES[heading]) {
			result = SECTION_RULES[heading](content);
		}

		if (result === "drop") continue;
		if (result === "unmatched") report.push(heading);
		if (result === "skip" || result === "unmatched") body.push(...section.lines);
		else body.push(section.lines[0], ...lead, ...result, ...trail);
	}

	if (command !== null) setFrontmatterKey(fm, "command", command);
	setFrontmatterKey(fm, "kind", kind, "command");

	const out = ["---", ...fm, "---", ...body].join("\n");
	return { out, changed: out !== src, report };
}

// ---------------------------------------------------------------------------------------------
// Runner

function walkMdx(dir: string): string[] {
	return readdirSync(dir, { withFileTypes: true })
		.flatMap((entry) => {
			const path = join(dir, entry.name);
			if (entry.isDirectory()) return walkMdx(path);
			return entry.name.endsWith(".mdx") ? [path] : [];
		})
		.sort();
}

function readMeta(dir: string): { pages: string[] } | undefined {
	const path = join(dir, "meta.json");
	if (!existsSync(path)) return undefined;
	let meta: { pages?: string[] };
	try {
		meta = JSON.parse(readFileSync(path, "utf8")) as { pages?: string[] };
	} catch (error) {
		const reason = error instanceof Error ? error.message : String(error);
		throw new Error(`Failed to parse ${path}: ${reason}`);
	}
	return Array.isArray(meta.pages) ? { pages: meta.pages } : undefined;
}

export function runCodemod(contentDir: string, check: boolean): number {
	const changed: string[] = [];
	const unmatched: string[] = [];
	for (const file of walkMdx(contentDir)) {
		const kind = deriveKind(basename(file, ".mdx"), readMeta(dirname(file)));
		const src = readFileSync(file, "utf8");
		const result = transformDoc(src, kind);
		const rel = relative(contentDir, file);
		if (result.changed) {
			changed.push(rel);
			if (!check) writeFileSync(file, result.out);
		}
		for (const section of result.report) unmatched.push(`${rel} — ${section}`);
	}
	for (const rel of changed) console.log(`changed: ${rel}`);
	for (const entry of unmatched) console.log(`unmatched: ${entry}`);
	return check && changed.length > 0 ? 1 : 0;
}

const USAGE = "Usage: codemod-skill-pages [--check] [--dir <path>]";

export type CliArgs = { contentDir: string; check: boolean };
export type CliParseResult = CliArgs | { error: string };

/**
 * Parses CLI args against `defaultDir`; rejects unknown flags, a `--dir` with no value, and a
 * `--dir` value that looks like another flag (so `--dir --check` doesn't swallow `--check`).
 */
export function parseCliArgs(args: string[], defaultDir: string): CliParseResult {
	let check = false;
	let dir: string | undefined;
	for (let i = 0; i < args.length; i++) {
		const arg = args[i];
		if (arg === "--check") {
			check = true;
		} else if (arg === "--dir") {
			const value = args[i + 1];
			if (value === undefined || value.startsWith("--")) {
				return { error: `${USAGE}\n--dir requires a value` };
			}
			dir = value;
			i++;
		} else {
			return { error: `${USAGE}\nUnknown argument: ${arg}` };
		}
	}
	return { contentDir: resolve(dir ?? defaultDir), check };
}

if (import.meta.main) {
	// Script lives at apps/docs/scripts/; content is at apps/docs/content/docs.
	const defaultDir = join(import.meta.dirname, "..", "content", "docs");
	const parsed = parseCliArgs(process.argv.slice(2), defaultDir);
	if ("error" in parsed) {
		console.error(parsed.error);
		process.exit(2);
	}
	process.exit(runCodemod(parsed.contentDir, parsed.check));
}

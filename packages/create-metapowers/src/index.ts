#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { type Interface, createInterface } from "node:readline";
import {
	type Domain,
	type Tool,
	claudeCodeInstructions,
	copyDomains,
	loadDomains,
	packageVersion,
} from "./lib";

const TOOLS: { id: Tool; label: string }[] = [
	{ id: "claude", label: "Claude Code" },
	{ id: "codex", label: "Codex CLI" },
	{ id: "opencode", label: "OpenCode" },
	{ id: "cursor", label: "Cursor" },
];

// One reader for the whole run, so piped answers ("1,16\ny\n") reach successive prompts
// instead of being swallowed by the first readline interface.
let input: Interface | undefined;
const lines: string[] = [];
const waiting: ((line: string) => void)[] = [];
let inputClosed = false;

function getInput(): Interface {
	if (!input) {
		input = createInterface({ input: process.stdin });
		input.on("line", (line) => {
			const next = waiting.shift();
			if (next) next(line);
			else lines.push(line);
		});
		input.on("close", () => {
			inputClosed = true;
			for (const next of waiting.splice(0)) next("");
		});
	}
	return input;
}

function closeInput() {
	input?.close();
}

function prompt(question: string): Promise<string> {
	getInput();
	process.stdout.write(question);
	const buffered = lines.shift();
	if (buffered !== undefined) return Promise.resolve(buffered.trim());
	// stdin closed without an answer (EOF): treat as an empty answer
	if (inputClosed) return Promise.resolve("");
	return new Promise((resolve) => {
		waiting.push((line) => resolve(line.trim()));
	});
}

function log(msg: string) {
	console.log(`  ${msg}`);
}

function success(msg: string) {
	console.log(`  ✓ ${msg}`);
}

function header(msg: string) {
	console.log(`\n  ${msg}\n`);
}

function fail(msg: string): never {
	console.error(`  Error: ${msg}`);
	process.exit(1);
}

interface Args {
	installAll: boolean;
	tool?: Tool;
	targetDir: string;
}

function parseArgs(argv: string[]): Args {
	let installAll = false;
	let tool: string | undefined;
	let target: string | undefined;
	for (let i = 0; i < argv.length; i++) {
		const arg = argv[i];
		if (arg === "--all") {
			installAll = true;
		} else if (arg === "--tool") {
			tool = argv[++i];
		} else if (arg.startsWith("--tool=")) {
			tool = arg.slice("--tool=".length);
		} else if (!arg.startsWith("-") && target === undefined) {
			target = arg;
		}
	}
	if (tool !== undefined && !TOOLS.some((t) => t.id === tool)) {
		fail(`unknown --tool "${tool}". Use one of: ${TOOLS.map((t) => t.id).join(", ")}`);
	}
	return { installAll, tool: tool as Tool | undefined, targetDir: resolve(target || ".") };
}

async function selectTool(): Promise<Tool> {
	// Non-interactive runs (CI, piped stdin) default to Claude Code, which writes no files.
	if (!process.stdin.isTTY) return "claude";
	header("Which tool?");
	TOOLS.forEach((t, i) => {
		log(`  ${i + 1}. ${t.label}`);
	});
	console.log();
	const answer = await prompt("  Tool number: ");
	const tool = TOOLS[Number.parseInt(answer, 10) - 1];
	if (!tool) fail("no tool selected.");
	return tool.id;
}

async function selectDomains(domains: Domain[], installAll: boolean): Promise<string[]> {
	if (installAll) {
		log(`Installing all ${domains.length} domains...\n`);
		return domains.map((d) => d.name);
	}

	header("Available domains:");
	domains.forEach((d, i) => {
		log(
			`  ${String(i + 1).padStart(2)}. ${d.name.padEnd(20)} ${d.skills} skills — ${d.description}`,
		);
	});
	console.log();
	const answer = await prompt("  Which domains? (comma-separated numbers, or 'all') ");

	if (answer.toLowerCase() === "all") return domains.map((d) => d.name);
	const indices = answer.split(",").map((s) => Number.parseInt(s.trim(), 10) - 1);
	return [...new Set(indices.filter((i) => i >= 0 && i < domains.length))].map(
		(i) => domains[i].name,
	);
}

function claudeOnPath(): boolean {
	const result = spawnSync("claude", ["--version"], { stdio: "ignore" });
	return !result.error && result.status === 0;
}

async function installClaudeCode(selected: string[]) {
	header("Claude Code installs Metapowers from the plugin marketplace. Run:");
	for (const line of claudeCodeInstructions(selected).split("\n")) log(`  ${line}`);
	console.log();

	if (process.stdin.isTTY && claudeOnPath()) {
		const answer = await prompt("  Run these now? (y/N) ");
		closeInput(); // release stdin before handing the terminal to `claude`
		if (answer.toLowerCase() === "y") {
			const commands = [
				["plugin", "marketplace", "add", "bromso/metapowers"],
				...selected.map((d) => ["plugin", "install", `${d}@metapowers`]),
			];
			for (const args of commands) {
				log(`$ claude ${args.join(" ")}`);
				const result = spawnSync("claude", args, { stdio: "inherit" });
				if (result.error || result.status !== 0) fail(`claude ${args.join(" ")} failed.`);
			}
			success(`Installed ${selected.length} domains via the marketplace`);
		}
	}

	header("Next steps:");
	log("  Claude Code: use the /plugin commands above");
	log("  Then try: /design:empathize button\n");
}

async function installFiles(
	tool: Tool,
	selected: string[],
	domains: Domain[],
	targetDir: string,
	templatesDir: string,
) {
	const metapowersDir = join(targetDir, ".metapowers");
	const targetPluginsDir =
		tool === "cursor"
			? join(targetDir, ".cursor", "skills", "metapowers")
			: join(metapowersDir, "plugins");

	if (existsSync(targetPluginsDir)) {
		log(`${targetPluginsDir} already exists.`);
		const overwrite = await prompt("  Overwrite the selected domains? (y/N) ");
		if (overwrite.toLowerCase() !== "y") {
			log("Aborted.");
			process.exit(0);
		}
	}

	mkdirSync(metapowersDir, { recursive: true });
	const copied = copyDomains(templatesDir, targetPluginsDir, selected, { overwrite: true });
	for (const domain of copied) success(`Installed ${domain}`);

	for (const domain of copied) {
		if (domain !== "metapowers") mkdirSync(join(metapowersDir, domain), { recursive: true });
	}
	success("Created artifact directories in .metapowers/");

	const configFile = tool === "cursor" ? ".cursorrules" : "AGENTS.md";
	const configSrc = join(templatesDir, configFile);
	const configDest = join(targetDir, configFile);
	if (existsSync(configSrc)) {
		if (!existsSync(configDest)) {
			cpSync(configSrc, configDest);
			success(`Created ${configFile}`);
		} else {
			log(`${configFile} already exists, skipped`);
		}
	}

	const config = {
		tool,
		// every installed domain, including ones kept from an earlier run
		domains: domains.map((d) => d.name).filter((name) => existsSync(join(targetPluginsDir, name))),
		created: new Date().toISOString().split("T")[0],
		version: packageVersion(),
	};
	writeFileSync(join(metapowersDir, "config.json"), `${JSON.stringify(config, null, 2)}\n`);
	success("Created .metapowers/config.json");

	const skills = domains.filter((d) => copied.includes(d.name)).reduce((n, d) => n + d.skills, 0);
	header("Done!");
	log(`Installed ${copied.length} domains with ${skills} skills into ${targetPluginsDir}\n`);
	log("Next steps:");
	if (tool === "cursor") {
		log("  Cursor: .cursorrules points at .cursor/skills/metapowers/<domain>/skills/");
	} else {
		const label = tool === "codex" ? "Codex CLI" : "OpenCode";
		log(`  ${label}: AGENTS.md points at .metapowers/plugins/<domain>/skills/`);
	}
	log("  Claude Code: run with --tool claude for the /plugin commands");
	log("  Then try: /design:empathize button\n");
}

async function main() {
	const { installAll, tool: toolArg, targetDir } = parseArgs(process.argv.slice(2));

	console.log("\n  create-metapowers\n");
	log("Structured workflows for digital production domains.\n");

	const templatesDir = join(import.meta.dirname, "..", "templates");
	if (!existsSync(join(templatesDir, "marketplace.json"))) {
		fail("templates directory not found. Package may be corrupted.");
	}
	const domains = loadDomains(templatesDir);

	const tool = toolArg ?? (await selectTool());
	const selected = await selectDomains(domains, installAll);
	if (selected.length === 0) fail("no domains selected.");

	if (tool === "claude") {
		await installClaudeCode(selected);
	} else {
		await installFiles(tool, selected, domains, targetDir, templatesDir);
	}
	closeInput();
}

main().catch((err) => {
	console.error("Error:", err.message);
	process.exit(1);
});

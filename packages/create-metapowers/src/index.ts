#!/usr/bin/env node

import { existsSync, mkdirSync, cpSync, writeFileSync, readFileSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { createInterface } from "node:readline";

const DOMAINS = [
	{ name: "design", description: "Design Thinking (5 phases)" },
	{ name: "research", description: "Double Diamond (4 phases)" },
	{ name: "development", description: "Plan-Build-Test-Ship (6 skills)" },
	{ name: "marketing", description: "RACE Framework (33 skills)" },
	{ name: "branding", description: "Brand Identity (5 phases + audit)" },
	{ name: "accessibility", description: "WCAG-EM (5 phases + checklist)" },
	{ name: "project-management", description: "Scrum (32 skills)" },
	{ name: "coaching", description: "Domain Coaching (5 lenses)" },
	{ name: "leadership", description: "Leadership Dev (12 skills)" },
	{ name: "legal", description: "Legal Lifecycle (35 skills)" },
	{ name: "metapowers", description: "Cross-domain meta-skills (status, init, report, workflow)" },
];

function prompt(question: string): Promise<string> {
	const rl = createInterface({ input: process.stdin, output: process.stdout });
	return new Promise((resolve) => {
		rl.question(question, (answer) => {
			rl.close();
			resolve(answer.trim());
		});
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

async function main() {
	const args = process.argv.slice(2);
	const installAll = args.includes("--all");
	const targetDir = resolve(args.find((a) => !a.startsWith("-")) || ".");

	console.log("\n  create-metapowers\n");
	log("Structured workflows for digital production domains.\n");

	// Check if .metapowers already exists
	const metapowersDir = join(targetDir, ".metapowers");
	if (existsSync(metapowersDir)) {
		log(".metapowers/ already exists in this directory.");
		const overwrite = await prompt("  Overwrite? (y/N) ");
		if (overwrite.toLowerCase() !== "y") {
			log("Aborted.");
			process.exit(0);
		}
	}

	// Select domains
	let selectedDomains: string[];

	if (installAll) {
		selectedDomains = DOMAINS.map((d) => d.name);
		log(`Installing all ${DOMAINS.length} domains...\n`);
	} else {
		header("Available domains:");
		DOMAINS.forEach((d, i) => {
			log(`  ${String(i + 1).padStart(2)}. ${d.name.padEnd(22)} ${d.description}`);
		});

		console.log();
		const answer = await prompt("  Which domains? (comma-separated numbers, or 'all') ");

		if (answer.toLowerCase() === "all") {
			selectedDomains = DOMAINS.map((d) => d.name);
		} else {
			const indices = answer.split(",").map((s) => parseInt(s.trim(), 10) - 1);
			selectedDomains = indices
				.filter((i) => i >= 0 && i < DOMAINS.length)
				.map((i) => DOMAINS[i].name);
		}

		if (selectedDomains.length === 0) {
			log("No domains selected. Aborted.");
			process.exit(1);
		}
	}

	// Find templates directory (bundled with package)
	const templatesDir = join(import.meta.dirname, "..", "templates");

	if (!existsSync(templatesDir)) {
		console.error("  Error: templates directory not found. Package may be corrupted.");
		process.exit(1);
	}

	// Create .metapowers directory
	mkdirSync(metapowersDir, { recursive: true });
	success("Created .metapowers/");

	// Copy selected domain plugins
	const pluginsDir = join(templatesDir, "plugins");
	const targetPluginsDir = join(targetDir, ".metapowers", "plugins");
	mkdirSync(targetPluginsDir, { recursive: true });

	for (const domain of selectedDomains) {
		const srcDir = join(pluginsDir, domain);
		if (existsSync(srcDir)) {
			const destDir = join(targetPluginsDir, domain);
			cpSync(srcDir, destDir, { recursive: true });
			success(`Installed ${domain}`);
		}
	}

	// Create domain subdirectories for artifacts
	for (const domain of selectedDomains) {
		if (domain !== "metapowers") {
			mkdirSync(join(metapowersDir, domain), { recursive: true });
		}
	}
	success("Created artifact directories");

	// Copy AGENTS.md
	const agentsSrc = join(templatesDir, "AGENTS.md");
	if (existsSync(agentsSrc)) {
		const agentsDest = join(targetDir, "AGENTS.md");
		if (!existsSync(agentsDest)) {
			cpSync(agentsSrc, agentsDest);
			success("Created AGENTS.md (Codex CLI, OpenCode)");
		} else {
			log("AGENTS.md already exists, skipped");
		}
	}

	// Copy .cursorrules
	const cursorSrc = join(templatesDir, ".cursorrules");
	if (existsSync(cursorSrc)) {
		const cursorDest = join(targetDir, ".cursorrules");
		if (!existsSync(cursorDest)) {
			cpSync(cursorSrc, cursorDest);
			success("Created .cursorrules (Cursor)");
		} else {
			log(".cursorrules already exists, skipped");
		}
	}

	// Write config
	const config = {
		domains: selectedDomains,
		created: new Date().toISOString().split("T")[0],
		version: "0.1.0",
	};
	writeFileSync(
		join(metapowersDir, "config.json"),
		JSON.stringify(config, null, 2) + "\n"
	);
	success("Created .metapowers/config.json");

	// Summary
	header("Done!\n");
	log(`Installed ${selectedDomains.length} domains with ${countSkills(targetPluginsDir, selectedDomains)} skills.\n`);
	log("Next steps:\n");
	log("  Claude Code:  Skills are in .metapowers/plugins/");
	log("  Codex CLI:    AGENTS.md loaded automatically");
	log("  OpenCode:     AGENTS.md loaded automatically");
	log("  Cursor:       .cursorrules loaded automatically\n");
	log("Try a skill:");
	log("  /design:empathize button");
	log("  /research:discover user-onboarding");
	log("  /development:plan auth-system\n");
}

function countSkills(pluginsDir: string, domains: string[]): number {
	let count = 0;
	for (const domain of domains) {
		const skillsDir = join(pluginsDir, domain, "skills");
		if (existsSync(skillsDir)) {
			try {
				const skills = readdirSync(skillsDir);
				count += skills.length;
			} catch {
				// ignore
			}
		}
	}
	return count;
}

main().catch((err) => {
	console.error("Error:", err.message);
	process.exit(1);
});

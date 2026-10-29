import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

const here = path.dirname(fileURLToPath(import.meta.url));
const script = path.resolve(here, "../../../scripts/run-evals.sh");

let root: string;

function writeCase(plugin: string, skill: string, body: string) {
	const dir = path.join(root, plugin, "evals", skill);
	mkdirSync(path.join(dir, "graders"), { recursive: true });
	writeFileSync(path.join(dir, "prompt.md"), `---\nmax_turns: 25\nruns: 2\n---\n\n${body}\n`);
}

function runDry(...args: string[]) {
	return spawnSync("bash", [script, ...args, "--dry"], {
		encoding: "utf8",
		env: { ...process.env, EVALS_PLUGINS_DIR: root },
	});
}

beforeEach(() => {
	root = mkdtempSync(path.join(tmpdir(), "run-evals-dry-"));
});

afterEach(() => {
	rmSync(root, { recursive: true, force: true });
});

describe("run-evals.sh --dry", () => {
	it("lists every case and exits 0 when no prompt names its skill or plugin command", () => {
		writeCase("security", "security-policy", "We need written rules for laptops and passwords.");
		writeCase("design", "empathize", "Look into what a good date picker needs.");
		const result = runDry();
		expect(result.status).toBe(0);
		expect(result.stdout).toContain("security/security-policy");
		expect(result.stdout).toContain("design/empathize");
	});

	it("exits 1 and names the file when a prompt names its skill directory as a word", () => {
		writeCase("security", "security-policy", "We need written rules for laptops and passwords.");
		writeCase("design", "empathize", "Please Empathize with our users of the date picker.");
		const result = runDry();
		expect(result.status).toBe(1);
		expect(result.stdout + result.stderr).toContain("design/evals/empathize/prompt.md");
		expect(result.stderr).not.toContain("security-policy/prompt.md names");
	});

	it("exits 1 when a prompt names a /plugin: command", () => {
		writeCase("design", "empathize", "Run /design:define on the date picker.");
		const result = runDry();
		expect(result.status).toBe(1);
		expect(result.stdout + result.stderr).toContain("design/evals/empathize/prompt.md");
	});

	it("does not flag a skill name that is only part of a longer word", () => {
		writeCase("development", "plan", "Break the payments feature into tasks; see planning.md.");
		const result = runDry();
		expect(result.status).toBe(0);
	});

	it("limits the listing to the plugins given as arguments", () => {
		writeCase("security", "security-policy", "We need written rules for laptops and passwords.");
		writeCase("design", "empathize", "Look into what a good date picker needs.");
		const result = runDry("design");
		expect(result.status).toBe(0);
		expect(result.stdout).toContain("design/empathize");
		expect(result.stdout).not.toContain("security/security-policy");
	});
});

// Per-run graders as serialised by `claude plugin eval` 2.1.283: no `type`; only the
// case-level `graders[]` carries it.
function runGrader(name: string, passed: boolean, scored: boolean) {
	return {
		name,
		passed,
		weight: 1,
		explanation: "",
		withOnly: false,
		scored,
		judgeVotes: [],
		evidence: [],
	};
}

function realShapeResult(extra: { scoreWithout?: number }) {
	return {
		costUsd: 1.5,
		partial: false,
		cases: [
			{
				name: "security-policy",
				graders: [
					{ name: "fired", type: "tool_used" },
					{ name: "artifact", type: "file_exists" },
					{ name: "quality", type: "llm" },
				],
				aggregates: { score: 0.9, delta: 0.5, ...extra },
				arms: {
					with: [
						{ graders: [runGrader("fired", true, false), runGrader("quality", true, true)] },
						{ graders: [runGrader("fired", false, false), runGrader("quality", true, true)] },
					],
					without: [
						{ graders: [runGrader("fired", false, false), runGrader("quality", false, true)] },
					],
				},
			},
		],
	};
}

function runReport(results: Record<string, string>) {
	const resultsDir = path.join(root, "results");
	mkdirSync(resultsDir, { recursive: true });
	for (const [plugin, json] of Object.entries(results)) {
		writeCase(plugin, "x", "A plain request.");
		writeFileSync(path.join(resultsDir, `${plugin}.json`), json);
	}
	return spawnSync("bash", [script, "--report"], {
		encoding: "utf8",
		env: { ...process.env, EVALS_PLUGINS_DIR: root, EVALS_RESULTS_DIR: resultsDir },
	});
}

function row(stdout: string, plugin: string) {
	const line = stdout.split("\n").find((l) => l.startsWith(`${plugin} `));
	return line?.trim().split(/\s+/);
}

describe("run-evals.sh --report", () => {
	it("reads with/without/delta and counts fired runs by grader name", () => {
		const result = runReport({ security: JSON.stringify(realShapeResult({ scoreWithout: 0.4 })) });
		expect(result.status).toBe(0);
		expect(row(result.stdout, "security")).toEqual([
			"security",
			"security-policy",
			"0.9",
			"0.4",
			"0.5",
			"1/2",
		]);
	});

	it("falls back to score minus delta when scoreWithout is absent", () => {
		const result = runReport({ security: JSON.stringify(realShapeResult({})) });
		expect(row(result.stdout, "security")?.[3]).toBe("0.4");
	});

	it("prints (unreadable) for a malformed result file and keeps going", () => {
		const result = runReport({
			design: "{not json",
			security: JSON.stringify(realShapeResult({ scoreWithout: 0.4 })),
		});
		expect(result.status).toBe(0);
		expect(row(result.stdout, "design")?.[1]).toBe("(unreadable)");
		expect(row(result.stdout, "security")?.[5]).toBe("1/2");
	});
});

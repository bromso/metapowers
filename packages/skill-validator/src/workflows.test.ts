import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { loadWorkflows } from "./workflows.js";

const root = join(import.meta.dirname, "__workflow_fixtures__");

afterEach(() => rmSync(root, { recursive: true, force: true }));

describe("loadWorkflows", () => {
	it("parses every .yml file, sorted by file name, ignoring other files", () => {
		mkdirSync(root, { recursive: true });
		writeFileSync(
			join(root, "b.yml"),
			"name: b\ntitle: B\nfolder: b\nphases:\n  - phase: 1\n    title: One\n    folder: design\n    requires: []\n    skills: [design-x]\n",
		);
		writeFileSync(
			join(root, "a.yml"),
			"name: a\ntitle: A\nfolder: a\nphases:\n  - phase: 0\n    title: Zero\n    artifact: 00-zero.md\n    requires: []\n    skills: [a-x, a-y]\n",
		);
		writeFileSync(join(root, "notes.md"), "# not a workflow");
		expect(loadWorkflows(root)).toEqual([
			{
				name: "a",
				title: "A",
				folder: "a",
				phases: [
					{ phase: 0, title: "Zero", artifact: "00-zero.md", requires: [], skills: ["a-x", "a-y"] },
				],
			},
			{
				name: "b",
				title: "B",
				folder: "b",
				phases: [{ phase: 1, title: "One", folder: "design", requires: [], skills: ["design-x"] }],
			},
		]);
	});
});

import { expect, test } from "vitest";
import { agents } from "./agents";

test("four supported agents in order, each with a bundled mark or wordmark", () => {
	expect(agents.map((a) => a.name)).toEqual(["Claude Code", "Codex", "OpenCode", "Cursor"]);
	for (const a of agents) {
		if (a.mark.kind === "svg") expect(a.mark.path).toMatch(/^M/);
		else expect(a.mark.text).toBe("Codex");
		// The installation page's heading for Codex is "Codex CLI" (id `codex-cli`); the
		// other three headings match their slug verbatim.
		const expectedId = a.slug === "codex" ? "codex-cli" : a.slug;
		expect(a.href).toBe(`/docs/overview/installation#${expectedId}`);
	}
});

test("every agent has an install command and note, and its guide link stays on the installation page", () => {
	for (const a of agents) {
		expect(a.install.command.trim()).not.toBe("");
		expect(a.install.note.trim()).not.toBe("");
		expect(a.href.startsWith("/docs/overview/installation#")).toBe(true);
	}
	expect(agents[0].install.command).toBe("/plugin marketplace add bromso/metapowers");
	for (const a of agents.slice(1))
		expect(a.install.command).toBe(`npx create-metapowers --tool ${a.slug}`);
});

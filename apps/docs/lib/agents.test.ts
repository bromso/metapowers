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

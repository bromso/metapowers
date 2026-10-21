import { expect, test } from "vitest";
import { agents } from "./agents";

test("four supported agents in order, each with a bundled mark or wordmark", () => {
	expect(agents.map((a) => a.name)).toEqual(["Claude Code", "Codex", "OpenCode", "Cursor"]);
	for (const a of agents) {
		if (a.mark.kind === "svg") expect(a.mark.path).toMatch(/^M/);
		else expect(a.mark.text).toBe("Codex");
		expect(a.href).toBe(`/docs/overview/installation#${a.slug}`);
	}
});

import { describe, expect, it } from "vitest";
import { rewriteSharedRefs } from "./shared-refs.js";

describe("rewriteSharedRefs", () => {
	it("rewrites repo-relative refs to CLAUDE_PLUGIN_ROOT", () => {
		expect(rewriteSharedRefs("Read `plugins/legal/shared/contract-template.md`", "legal")).toBe(
			"Read `${CLAUDE_PLUGIN_ROOT}/shared/contract-template.md`",
		);
	});
	it("rewrites bare shared/ refs", () => {
		expect(
			rewriteSharedRefs("the template at `shared/chart-of-accounts-template.md`", "bookkeeping"),
		).toBe("the template at `${CLAUDE_PLUGIN_ROOT}/shared/chart-of-accounts-template.md`");
	});
	it("rewrites finance's bare financial-model-template.md", () => {
		expect(rewriteSharedRefs("Reference `financial-model-template.md` for", "finance")).toBe(
			"Reference `${CLAUDE_PLUGIN_ROOT}/shared/financial-model-template.md` for",
		);
	});
	it("rewrites cross-plugin refs to the local copy", () => {
		expect(
			rewriteSharedRefs("`plugins/accessibility/shared/wcag-21-aa-criteria.md`", "coaching"),
		).toBe("`${CLAUDE_PLUGIN_ROOT}/shared/wcag-21-aa-criteria.md`");
	});
	it("is idempotent", () => {
		const once = rewriteSharedRefs("`plugins/legal/shared/x.md`", "legal");
		expect(rewriteSharedRefs(once, "legal")).toBe(once);
	});
});

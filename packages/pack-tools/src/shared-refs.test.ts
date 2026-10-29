import { describe, expect, it } from "vitest";
import { rewriteSharedRefs } from "./shared-refs.js";

describe("rewriteSharedRefs", () => {
	it("rewrites CLAUDE_PLUGIN_ROOT shared refs to the skill's references/", () => {
		expect(
			rewriteSharedRefs("Read `${CLAUDE_PLUGIN_ROOT}/shared/wcag-criteria.md` first", "design"),
		).toBe("Read `references/wcag-criteria.md` first");
	});
	it("rewrites repo-relative refs to references/", () => {
		expect(rewriteSharedRefs("Read `plugins/legal/shared/contract-template.md`", "legal")).toBe(
			"Read `references/contract-template.md`",
		);
	});
	it("rewrites bare shared/ refs", () => {
		expect(
			rewriteSharedRefs("the template at `shared/chart-of-accounts-template.md`", "bookkeeping"),
		).toBe("the template at `references/chart-of-accounts-template.md`");
	});
	it("rewrites finance's bare financial-model-template.md", () => {
		expect(rewriteSharedRefs("Reference `financial-model-template.md` for", "finance")).toBe(
			"Reference `references/financial-model-template.md` for",
		);
	});
	it("rewrites cross-plugin refs to the local copy", () => {
		expect(
			rewriteSharedRefs("`plugins/accessibility/shared/wcag-21-aa-criteria.md`", "coaching"),
		).toBe("`references/wcag-21-aa-criteria.md`");
	});
	it("is idempotent", () => {
		const once = rewriteSharedRefs(
			"`plugins/legal/shared/x.md` and `${CLAUDE_PLUGIN_ROOT}/shared/y.md`",
			"legal",
		);
		expect(rewriteSharedRefs(once, "legal")).toBe(once);
		const finance = rewriteSharedRefs("`financial-model-template.md`", "finance");
		expect(rewriteSharedRefs(finance, "finance")).toBe(finance);
	});
});

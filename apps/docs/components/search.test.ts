import { describe, expect, it } from "vitest";
import { commandForUrl, groupResultsByDomain } from "./search";

const r = (id: string, url: string, type: "page" | "heading" | "text" = "page") => ({
	id,
	url,
	type,
	content: id,
});

const groups = (urls: string[]) =>
	[...groupResultsByDomain(urls.map((url, i) => r(String(i), url))).groupStarts.values()].map(
		(d) => d?.slug ?? null,
	);

describe("groupResultsByDomain", () => {
	it("groups by domain in best-rank order and keeps ranking inside each group", () => {
		const { items, groupStarts } = groupResultsByDomain([
			r("a", "/docs/design/audit"),
			r("b", "/docs/accessibility/audit"),
			r("c", "/docs/design/audit#scope", "heading"),
			r("d", "/docs/accessibility/retest", "text"),
		]);
		expect(items.map((i) => i.id)).toEqual(["a", "c", "b", "d"]);
		expect([...groupStarts].map(([id, d]) => [id, d?.slug])).toEqual([
			["a", "design"],
			["b", "accessibility"],
		]);
	});

	it("maps overview to singular, keeps root-page heading hits, leaves unknown urls ungrouped", () => {
		expect(groups(["/docs/overview#intro"])).toEqual(["singular"]);
		expect(groups(["/docs/accessibility#audit-phases"])).toEqual(["accessibility"]);
		expect(groups(["/docs"])).toEqual([null]);
		expect(groups(["/elsewhere"])).toEqual([null]);
	});
});

describe("commandForUrl", () => {
	it("returns the command for a page URL, stripping any hash first", () => {
		expect(commandForUrl("/docs/design/a11y-audit#usage")).toBe("/design-a11y-audit");
	});

	it("returns undefined for an unknown URL", () => {
		expect(commandForUrl("/docs/does-not-exist")).toBeUndefined();
	});
});

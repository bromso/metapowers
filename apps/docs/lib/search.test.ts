import { describe, expect, it } from "vitest";
import { domainForResultUrl, groupResultsByDomain } from "../components/search";

const r = (id: string, url: string, type: "page" | "heading" | "text" = "page") => ({
	id,
	url,
	type,
	content: id,
});

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

	it("maps overview to metapowers and leaves unknown urls ungrouped", () => {
		expect(domainForResultUrl("/docs/overview#intro")?.slug).toBe("metapowers");
		expect(domainForResultUrl("/docs")).toBeUndefined();
		expect(groupResultsByDomain([r("x", "/elsewhere")]).groupStarts.get("x")).toBeNull();
	});
});

import { expect, test } from "vitest";
import { domains } from "./domains";
import { getDomainForSlug, getDomains, getTotals } from "./site";
import siteData from "./site-data.json";

test("every plugin in site-data has a domain entry and vice versa", () => {
	const dataSlugs = siteData.plugins.map((p) => p.slug).sort();
	const domainSlugs = domains.map((d) => d.slug).sort();
	expect(domainSlugs).toEqual(dataSlugs);
});

test("getDomainForSlug maps overview to metapowers and unknown to undefined", () => {
	expect(getDomainForSlug(["overview", "status"])?.slug).toBe("metapowers");
	expect(getDomainForSlug(["design"])?.slug).toBe("design");
	expect(getDomainForSlug(["guides"])).toBeUndefined();
	expect(getDomainForSlug(undefined)).toBeUndefined();
});

test("getDomains puts metapowers last and carries counts", () => {
	const result = getDomains();

	expect(result[result.length - 1].slug).toBe("metapowers");

	const expectedOrder = [
		...domains.filter((d) => d.slug !== "metapowers").sort((a, b) => a.name.localeCompare(b.name)),
		domains.find((d) => d.slug === "metapowers"),
	].map((d) => d?.slug);
	expect(result.map((d) => d.slug)).toEqual(expectedOrder);

	for (const domain of result) {
		const plugin = siteData.plugins.find((p) => p.slug === domain.slug);
		expect(plugin).toBeDefined();
		expect(domain.skills).toBe(plugin?.skills);
		expect(domain.hasEvals).toBe(plugin?.hasEvals);
	}
});

test("getTotals returns the totals from site-data.json", () => {
	expect(getTotals()).toEqual(siteData.totals);
});

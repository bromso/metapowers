import type { SiteData } from "../scripts/gen-site-data";
import { type Domain, domains } from "./domains";
import siteData from "./site-data.json";

export function getDomains(): (Domain & { skills: number; hasEvals: boolean })[] {
	const bySlug = new Map(siteData.plugins.map((plugin) => [plugin.slug, plugin]));

	const joined = domains.map((domain) => {
		const plugin = bySlug.get(domain.slug);
		return {
			...domain,
			skills: plugin?.skills ?? 0,
			hasEvals: plugin?.hasEvals ?? false,
		};
	});

	const metapowers = joined.filter((domain) => domain.slug === "metapowers");
	const rest = joined
		.filter((domain) => domain.slug !== "metapowers")
		.sort((a, b) => a.name.localeCompare(b.name));

	return [...rest, ...metapowers];
}

export function getTotals(): SiteData["totals"] {
	return siteData.totals as SiteData["totals"];
}

export function getDomainForSlug(slug: string[] | undefined): Domain | undefined {
	const first = slug?.[0];
	if (!first) {
		return undefined;
	}

	const normalized = first === "overview" ? "metapowers" : first;
	return domains.find((domain) => domain.slug === normalized);
}

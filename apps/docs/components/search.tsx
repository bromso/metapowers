"use client";

import { type Domain, domainForDocsUrl } from "@/lib/domains";
import searchCommands from "@/lib/search-commands.json";
import { type SearchClient, useDocsSearch } from "fumadocs-core/search/client";
import { flexsearchStaticClient } from "fumadocs-core/search/client/flexsearch-static";
import {
	SearchDialog as Dialog,
	SearchDialogClose,
	SearchDialogContent,
	SearchDialogFooter,
	SearchDialogHeader,
	SearchDialogIcon,
	SearchDialogInput,
	SearchDialogList,
	SearchDialogListItem,
	SearchDialogOverlay,
	type SearchItemType,
} from "fumadocs-ui/components/dialog/search";
import { I18nProvider } from "fumadocs-ui/contexts/i18n";
import type { SharedProps } from "fumadocs-ui/contexts/search";
import { useMemo } from "react";

/** Mirrors the `basePath` in `next.config.mjs`: the static index is exported under it in production. */
const SEARCH_INDEX =
	process.env.NODE_ENV === "production" ? "/metapowers/api/search" : "/api/search";

/**
 * The `flexsearch-static` preset. fumadocs-core 16.8.1 types `type: "flexsearch-static"` but
 * `useDocsSearch` throws "unknown search client" for it at runtime, so the client is passed
 * directly. It is created on the first query: constructing it fetches the index, which must
 * not happen during prerendering.
 */
let flexsearch: SearchClient | undefined;
const searchClient: SearchClient = {
	deps: [SEARCH_INDEX],
	search(query) {
		flexsearch ??= flexsearchStaticClient({ from: SEARCH_INDEX });
		return flexsearch.search(query);
	},
};

/** Overrides only the dialog's input placeholder; the sidebar trigger keeps "Find a skill…". */
const dialogTranslations = { search: "Find the skill that…" };

export interface GroupedResults {
	/** Results reordered so each domain's results are contiguous (keyboard order matches display). */
	items: SearchItemType[];
	/** First item id of each group → the domain heading rendered above it (`null` when unknown). */
	groupStarts: Map<string, Domain | null>;
}

/**
 * Groups results by domain. Groups are ordered by their best-ranked result and results keep
 * their relative ranking inside a group, so a page's heading/text hits stay under its domain.
 */
export function groupResultsByDomain(results: SearchItemType[]): GroupedResults {
	const groups = new Map<string, { domain: Domain | null; items: SearchItemType[] }>();
	for (const item of results) {
		// Drop the `#heading` / `?query` so heading hits on a domain's root page (`/docs/design#…`)
		// still match its `docsPath` exactly.
		const domain = item.type === "action" ? undefined : domainForDocsUrl(item.url.split(/[#?]/)[0]);
		const key = domain?.slug ?? "";
		let group = groups.get(key);
		if (!group) {
			group = { domain: domain ?? null, items: [] };
			groups.set(key, group);
		}
		group.items.push(item);
	}

	const items: SearchItemType[] = [];
	const groupStarts = new Map<string, Domain | null>();
	for (const group of groups.values()) {
		groupStarts.set(group.items[0].id, group.domain);
		items.push(...group.items);
	}
	return { items, groupStarts };
}

/** The skill `command` for a docs URL, e.g. `/docs/design/a11y-audit#usage` → `/design:a11y-audit`. */
export function commandForUrl(url: string): string | undefined {
	return (searchCommands as Record<string, string>)[url.split(/[#?]/)[0]];
}

function GroupHeading({ domain }: { domain: Domain | null }) {
	return (
		<div className="mp-eyebrow flex items-center gap-2 px-2.5 pt-3 pb-1.5 first:pt-1.5">
			{domain ? (
				<span
					aria-hidden="true"
					className="size-2.5 shrink-0 rounded-full"
					style={{ background: `var(--domain-${domain.colour})` }}
				/>
			) : null}
			{domain?.name ?? "Docs"}
		</div>
	);
}

function Empty() {
	return (
		<div className="py-12 text-center text-mp-muted text-sm">
			No skill matches. Try a verb: audit, plan, draft.
		</div>
	);
}

export default function SearchDialog(props: SharedProps) {
	const { search, setSearch, query } = useDocsSearch({ client: searchClient });

	const grouped = useMemo(
		() =>
			query.data && query.data !== "empty"
				? groupResultsByDomain(query.data as SearchItemType[])
				: null,
		[query.data],
	);

	return (
		<Dialog search={search} onSearchChange={setSearch} isLoading={query.isLoading} {...props}>
			<SearchDialogOverlay />
			<SearchDialogContent className="bg-mp-surface text-mp-ink">
				<SearchDialogHeader>
					<SearchDialogIcon />
					<I18nProvider locale="en" translations={dialogTranslations}>
						<SearchDialogInput />
					</I18nProvider>
					<SearchDialogClose />
				</SearchDialogHeader>
				<SearchDialogList
					items={grouped?.items ?? null}
					Empty={Empty}
					Item={({ item, onClick }) => {
						const start = grouped?.groupStarts.has(item.id);
						const command = item.type === "page" ? commandForUrl(item.url) : undefined;
						return (
							<>
								{start ? <GroupHeading domain={grouped?.groupStarts.get(item.id) ?? null} /> : null}
								<SearchDialogListItem item={item} onClick={onClick} />
								{command ? (
									<div className="-mt-1.5 px-4 pb-1.5 font-mono text-mp-muted text-xs">
										{command}
									</div>
								) : null}
							</>
						);
					}}
				/>
				<SearchDialogFooter className="text-mp-muted text-xs">
					↵ open · esc close
				</SearchDialogFooter>
			</SearchDialogContent>
		</Dialog>
	);
}

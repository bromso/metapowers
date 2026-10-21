import { DomainTile } from "@/components/home/DomainTile";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { getDomains } from "@/lib/site";
import { source } from "@/lib/source";
import { flattenTree } from "fumadocs-core/page-tree";
import Link from "next/link";

export interface DomainGridProps {
	/** Domain slug (for example "design"); omit to list every domain. */
	domain?: string;
}

/** Page URLs in sidebar order, so the grid follows each domain's `meta.json`. */
function treeOrder(): Map<string, number> {
	const items = flattenTree(source.getPageTree().children);
	return new Map(items.map((item, index) => [item.url, index]));
}

function DomainPages({ slug }: { slug: string }) {
	const prefix = `/docs/${slug}/`;
	const order = treeOrder();
	const rank = (url: string) => order.get(url) ?? Number.MAX_SAFE_INTEGER;
	const pages = source
		.getPages()
		.filter((page) => page.url.startsWith(prefix))
		.sort((a, b) => rank(a.url) - rank(b.url) || a.url.localeCompare(b.url));
	const domain = getDomains().find((entry) => entry.slug === slug);
	const tint = domain ? `var(--domain-${domain.colour})` : "var(--mp-accent-soft)";

	return (
		<div className="not-prose my-8">
			<Eyebrow>
				{domain ? `${domain.skills} skills in this domain` : `${pages.length} pages`}
			</Eyebrow>
			<ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
				{pages.map((page) => (
					<li key={page.url} className="min-w-0">
						<Link
							href={page.url}
							className="flex h-full flex-col gap-2 rounded-[20px] border border-mp-ink/10 bg-mp-surface p-4 text-mp-ink transition-colors hover:border-mp-ink/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mp-accent"
						>
							<span className="mp-eyebrow flex items-center gap-2">
								<span
									aria-hidden="true"
									className="size-2 shrink-0 rounded-full"
									style={{ background: tint }}
								/>
								{page.data.kind ?? "overview"}
							</span>
							<span className="font-medium tracking-tight break-words">{page.data.title}</span>
							{page.data.command ? (
								<code className="mt-auto truncate font-mono text-xs text-mp-muted">
									{page.data.command}
								</code>
							) : null}
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
}

/**
 * MDX grid for domain index pages. With `domain`, a compact tile per documented page in that
 * domain; without it, the homepage's domain tiles.
 */
export function DomainGrid({ domain }: DomainGridProps) {
	if (domain) return <DomainPages slug={domain} />;
	return (
		<ul className="not-prose my-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
			{getDomains().map((entry) => (
				<li key={entry.slug} className="min-w-0">
					<DomainTile domain={entry} compact />
				</li>
			))}
		</ul>
	);
}

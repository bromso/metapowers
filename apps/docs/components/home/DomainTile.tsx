import SpotlightCard from "@/components/motion/SpotlightCard";
import type { getDomains } from "@/lib/site";
import Link from "next/link";
import type { CSSProperties } from "react";

export interface DomainTileProps {
	domain: ReturnType<typeof getDomains>[number];
	/** Tighter padding and type, for dense grids. */
	compact?: boolean;
}

/**
 * SpotlightCard sets a white surface and a zinc border as inline variables; point them at
 * theme tokens instead so the tile follows the light and dark themes.
 */
const tokens = (meta: boolean) =>
	({
		"--spotlight-card-surface": meta ? "var(--mp-ink)" : "var(--mp-surface)",
		"--spotlight-card-border": meta
			? "transparent"
			: "color-mix(in srgb, var(--mp-ink) 10%, transparent)",
	}) as CSSProperties;

export function DomainTile({ domain, compact = false }: DomainTileProps) {
	const meta = domain.slug === "singular";
	const Icon = domain.icon;
	const subtle = meta ? "opacity-75" : "text-mp-muted";
	return (
		<SpotlightCard
			theme="light"
			proximity={80}
			spotlightColor={meta ? "var(--mp-ground)" : "var(--mp-ink)"}
			className="h-full rounded-[20px]! p-0!"
			style={tokens(meta)}
		>
			<Link
				href={domain.docsPath}
				className={[
					"flex h-full flex-col rounded-[inherit] focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-mp-accent",
					compact ? "gap-4 p-4" : "gap-8 p-4 sm:p-6",
					meta ? "text-mp-ground" : "text-mp-ink",
				].join(" ")}
			>
				<span
					aria-hidden="true"
					className={[
						"flex shrink-0 items-center justify-center rounded-xl text-mp-ink",
						compact ? "size-9" : "size-10 sm:size-12",
					].join(" ")}
					style={{ background: `var(--domain-${domain.colour})` }}
				>
					<Icon className={compact ? "size-4" : "size-5"} strokeWidth={1.75} />
				</span>
				<span className="mt-auto flex min-w-0 flex-col gap-1">
					<span
						className={[
							"font-medium tracking-tight break-words",
							compact ? "text-base" : "text-base sm:text-xl",
						].join(" ")}
					>
						{domain.name}
					</span>
					<span className={`text-sm ${subtle}`}>{domain.skills} skills</span>
					<span className={`text-xs ${subtle}`}>{domain.methodology}</span>
				</span>
			</Link>
		</SpotlightCard>
	);
}

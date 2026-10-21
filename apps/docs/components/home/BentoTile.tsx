import { AnimatedIcon } from "@/components/home/AnimatedIcon";
import { renderLineMdIcon, renderLineMdIconStill } from "@/lib/icons";
import type { getBentoDomains } from "@/lib/site";
import Link from "next/link";
import type { CSSProperties } from "react";

type BentoDomain = ReturnType<typeof getBentoDomains>[number];

export interface BentoTileProps {
	domain: BentoDomain;
}

/** Grid placement per size (spec §4.4): five full rows at six columns, no gaps at two. */
const SIZE: Record<BentoDomain["bento"]["size"], string> = {
	wide: "lg:col-span-3 lg:row-span-2 col-span-2 row-span-2",
	half: "lg:col-span-2 col-span-2",
	small: "col-span-1",
	meta: "lg:col-span-2 col-span-2",
};

/**
 * One bento cell: a link to the domain's docs. Rest state is ink on surface with a pastel swatch;
 * the chroma CSS in `global.css` (`.bento-tile`) raises `--tile-colour` under the spotlight that
 * `ChromaBento` wraps around the grid. Colours are picked through custom properties because
 * Tailwind does not scan interpolated class names.
 */
export function BentoTile({ domain }: BentoTileProps) {
	const { size } = domain.bento;
	const meta = size === "meta";
	const wide = size === "wide";
	const colours = {
		"--tile-colour": `var(--domain-${domain.colour})`,
		"--tile-swatch": `var(--mp-sidebar-swatch-${domain.colour})`,
	} as CSSProperties;
	const subtle = meta ? "text-mp-ground/75" : "text-mp-muted";

	return (
		<li className={`min-w-0 ${SIZE[size]}`}>
			<Link
				href={domain.docsPath}
				data-bento-tile=""
				data-chroma-area=""
				data-meta={meta ? "" : undefined}
				style={colours}
				className={[
					"bento-tile flex h-full flex-col rounded-[20px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-mp-accent",
					wide ? "gap-6 p-5 sm:p-8" : "gap-6 p-4 sm:p-6",
					meta ? "bg-mp-ink text-mp-ground" : "bg-mp-surface text-mp-ink",
				].join(" ")}
			>
				<AnimatedIcon
					svg={renderLineMdIcon(domain.animatedIcon)}
					still={renderLineMdIconStill(domain.animatedIcon)}
					className={[
						"bento-icon flex shrink-0 items-center justify-center rounded-xl [&_svg]:size-full",
						wide ? "size-12 p-2.5 sm:size-14 sm:p-3" : "size-10 p-2 sm:size-12 sm:p-2.5",
					].join(" ")}
				/>
				<span className="mt-auto flex min-w-0 flex-col gap-1">
					<span
						className={[
							"font-medium tracking-tight break-words",
							wide ? "text-xl sm:text-3xl" : "text-base sm:text-xl",
						].join(" ")}
					>
						{domain.name}
					</span>
					{wide ? (
						<span className="max-w-md text-sm text-pretty sm:text-base">{domain.blurb}</span>
					) : null}
					<span className={`text-sm ${subtle}`}>{domain.skills} skills</span>
					<span className={`text-xs ${subtle}`}>{domain.methodology}</span>
				</span>
			</Link>
		</li>
	);
}

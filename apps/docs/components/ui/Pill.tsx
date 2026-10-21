import { StarPill } from "@/components/ui/StarPill";
import Link from "next/link";
import type { ReactNode } from "react";

export type PillVariant = "primary" | "outline" | "ghost";
export type PillSize = "sm" | "md";

export interface PillProps {
	href: string;
	variant: PillVariant;
	children: ReactNode;
	/** Opens in a new tab with a plain `<a>`; otherwise `next/link`. */
	external?: boolean;
	/** `sm` is the compact nav size. Defaults to `md`. */
	size?: PillSize;
	className?: string;
	/** Primary pills only: a star laps the outline once on hover or keyboard focus. */
	star?: boolean;
	/** Which surface the pill sits on, for the star's own contrast. Defaults to `"light"`. */
	starTheme?: "light" | "dark";
}

export const pillBase =
	"inline-flex items-center justify-center gap-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mp-accent";

export const pillSizes: Record<PillSize, string> = { sm: "px-4 py-1.5", md: "px-5 py-2.5" };

export const pillVariants: Record<PillVariant, string> = {
	// Dark accent is lighter (spec §3), so white would drop below 4.5:1; use the ground token.
	primary: "bg-mp-accent text-white hover:opacity-90 [.dark_&]:text-mp-ground",
	outline: "border border-mp-ink text-mp-ink hover:bg-mp-ink/5",
	ghost: "text-mp-ink hover:bg-mp-ink/5",
};

/** Single source of truth for a pill's resting classes, shared by `Pill` and `StarPill`. */
export function pillClassName({
	variant,
	size = "md",
	className,
}: {
	variant: PillVariant;
	size?: PillSize;
	className?: string;
}): string {
	return [pillBase, pillSizes[size], pillVariants[variant], className].filter(Boolean).join(" ");
}

export function Pill({
	href,
	variant,
	children,
	external = false,
	size = "md",
	className,
	star = false,
	starTheme = "light",
}: PillProps) {
	if (star && variant === "primary") {
		return (
			<StarPill
				href={href}
				external={external}
				size={size}
				className={className}
				starTheme={starTheme}
			>
				{children}
			</StarPill>
		);
	}
	const classes = pillClassName({ variant, size, className });
	if (external) {
		return (
			<a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
				{children}
			</a>
		);
	}
	return (
		<Link href={href} className={classes}>
			{children}
		</Link>
	);
}

import Link from "next/link";
import type { ReactNode } from "react";

export type PillVariant = "primary" | "outline" | "ghost";

export interface PillProps {
	href: string;
	variant: PillVariant;
	children: ReactNode;
	/** Opens in a new tab with a plain `<a>`; otherwise `next/link`. */
	external?: boolean;
	/** `sm` is the compact nav size. Defaults to `md`. */
	size?: "sm" | "md";
	className?: string;
}

const base =
	"inline-flex items-center justify-center gap-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mp-accent";

const sizes = { sm: "px-4 py-1.5", md: "px-5 py-2.5" } as const;

const variants: Record<PillVariant, string> = {
	// Dark accent is lighter (spec §3), so white would drop below 4.5:1; use the ground token.
	primary: "bg-mp-accent text-white hover:opacity-90 [.dark_&]:text-mp-ground",
	outline: "border border-mp-ink text-mp-ink hover:bg-mp-ink/5",
	ghost: "text-mp-ink hover:bg-mp-ink/5",
};

export function Pill({
	href,
	variant,
	children,
	external = false,
	size = "md",
	className,
}: PillProps) {
	const classes = [base, sizes[size], variants[variant], className].filter(Boolean).join(" ");
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

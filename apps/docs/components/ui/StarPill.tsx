"use client";

import StarBorder from "@/components/motion/StarBorder";
import { type PillSize, pillClassName } from "@/components/ui/Pill";
import { useResolvedToken } from "@/lib/motion";
import Link from "next/link";
import type { ReactNode } from "react";

interface StarPillProps {
	href: string;
	children: ReactNode;
	external?: boolean;
	size?: PillSize;
	className?: string;
	starTheme?: "light" | "dark";
}

// StarBorder's own chrome hardcodes px-6/py-3.5 padding and a track-colored focus ring, which
// would otherwise tie (or lose) against the pill's own classes depending on Tailwind's utility
// order. Force these two with `!` so the pill's own padding and focus ring always win,
// regardless of generation order. Background/text are matched by value instead (see the
// `backgroundColor`/`textColor` props below) since matching values makes the tie harmless.
const SIZE_FORCE: Record<PillSize, string> = { sm: "px-4! py-1.5!", md: "px-5! py-2.5!" };
const FOCUS_FORCE =
	"focus-visible:outline-2! focus-visible:outline-offset-2! focus-visible:outline-mp-accent!";

/**
 * Client-only wrapper so the plain pills (`Pill` itself) stay server-renderable. Renders the
 * same resting classes as `Pill` on the actual `as={Link}` / `as="a"` anchor StarBorder wraps,
 * so the pill looks and measures exactly as it does without `star`; the star canvas is the
 * only addition, and only on hover / keyboard focus.
 */
export function StarPill({
	href,
	children,
	external = false,
	size = "md",
	className,
	starTheme = "light",
}: StarPillProps) {
	// `color` is parsed through a 2D canvas (see components/motion/README.md), which cannot
	// resolve `var(...)`, so it needs a live-resolved value — unlike backgroundColor/textColor/
	// borderColor below, which land in a plain inline style and can reference the token directly.
	const accentSoft = useResolvedToken("--mp-accent-soft");
	const classes = [
		pillClassName({ variant: "primary", size, className }),
		SIZE_FORCE[size],
		FOCUS_FORCE,
	].join(" ");

	const shared = {
		hover: "lap" as const,
		stars: 1,
		duration: 1.6,
		glow: 0.4,
		sparkle: false,
		clickPulse: false,
		radius: 999,
		theme: starTheme,
		color: accentSoft ?? undefined,
		backgroundColor: "var(--mp-accent)",
		textColor: "white",
		borderColor: "transparent",
		className: classes,
	};

	if (external) {
		return (
			<StarBorder as="a" href={href} target="_blank" rel="noopener noreferrer" {...shared}>
				{children}
			</StarBorder>
		);
	}
	return (
		<StarBorder as={Link} href={href} {...shared}>
			{children}
		</StarBorder>
	);
}

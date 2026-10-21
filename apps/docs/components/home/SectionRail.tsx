"use client";

import LineSidebar from "@/components/motion/LineSidebar";
import { prefersReducedMotion, usePrefersReducedMotion } from "@/lib/motion";
import { useEffect, useState } from "react";

/** The homepage sections the rail points at, in page order; each id is on its `<section>`. */
export const RAIL_SECTIONS: readonly { id: string; label: string }[] = [
	{ id: "install", label: "Install" },
	{ id: "how-it-works", label: "How it works" },
	{ id: "domains", label: "Domains" },
	{ id: "showcase", label: "Showcase" },
	{ id: "numbers", label: "Numbers" },
	{ id: "start", label: "Start" },
];

/** The hero's `<section>`; the rail stays hidden while it is in view. */
const HERO_SELECTOR = 'section[aria-labelledby="hero-title"]';

/**
 * Landing-page section rail (spec §4.8, owner request, PR #47): a React Bits Line Sidebar fixed
 * to the right edge (mirrored with its `side="right"` addition), from `lg` up. At rest it is six
 * short lines; the labels and indexes appear to their left while it is hovered or focused, and
 * the line of the section in view is drawn in the accent.
 * It fades in once the hero has scrolled away and out again at the top. Each item is a real
 * `#id` link, so it works from the keyboard and without JavaScript; with JavaScript the jump is
 * a smooth scroll (instant under reduced motion). The docs pages keep Fumadocs' own table of
 * contents; this only mounts on the landing page.
 */
export function SectionRail() {
	const reduced = usePrefersReducedMotion();
	const [active, setActive] = useState<number | null>(null);
	const [shown, setShown] = useState(false);

	useEffect(() => {
		if (typeof IntersectionObserver === "undefined") return;
		const sections = RAIL_SECTIONS.map((s) => document.getElementById(s.id));
		// The section crossing the band between 35% and 60% of the viewport is the current one.
		const current = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (!entry.isIntersecting) continue;
					const index = sections.indexOf(entry.target as HTMLElement);
					if (index >= 0) setActive(index);
				}
			},
			{ rootMargin: "-35% 0px -60% 0px", threshold: 0 },
		);
		for (const section of sections) if (section) current.observe(section);

		const hero = document.querySelector(HERO_SELECTOR);
		const gate = new IntersectionObserver(([entry]) => setShown(!entry || !entry.isIntersecting), {
			rootMargin: "0px",
			threshold: 0.2,
		});
		if (hero) gate.observe(hero);
		else setShown(true);

		return () => {
			current.disconnect();
			gate.disconnect();
		};
	}, []);

	return (
		<div
			className={[
				"fixed top-1/2 right-5 z-30 hidden -translate-y-1/2 transition-opacity duration-300 ease-out motion-reduce:transition-none lg:block",
				shown ? "opacity-100" : "pointer-events-none opacity-0",
			].join(" ")}
			aria-hidden={shown ? undefined : "true"}
		>
			<LineSidebar
				ariaLabel="Page sections"
				items={RAIL_SECTIONS.map((s) => ({ label: s.label, href: `#${s.id}` }))}
				active={active}
				side="right"
				revealLabels
				accentColor="var(--mp-accent)"
				textColor="var(--mp-muted)"
				markerColor="color-mix(in srgb, var(--mp-ink) 35%, transparent)"
				markerLength={22}
				markerGap={10}
				tickScale={0.45}
				itemGap={14}
				fontSize={0.8}
				proximityRadius={72}
				maxShift={reduced ? 0 : 8}
				smoothing={reduced ? 1 : 90}
				onItemClick={(index, _label, event) => {
					const target = document.getElementById(RAIL_SECTIONS[index].id);
					if (!target) return;
					event.preventDefault();
					target.scrollIntoView({
						behavior: reduced || prefersReducedMotion() ? "auto" : "smooth",
						block: "start",
					});
				}}
			/>
		</div>
	);
}

export default SectionRail;

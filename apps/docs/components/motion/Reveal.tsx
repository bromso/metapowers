"use client";

import { gsap, useGSAP } from "@/lib/gsap";
import { prefersReducedMotion, usePrefersReducedMotion } from "@/lib/motion";
import { type ElementType, type JSX, type ReactNode, useRef } from "react";

/**
 * Upper bound on `delay` (seconds). With duration 0.45 s and `power2.out`, opacity
 * reaches 0.8 at about 249 ms, so a delay of at most 0.05 s keeps it under 300 ms.
 */
const MAX_DELAY = 0.05;

export interface RevealProps {
	children: ReactNode;
	/** Seconds to wait after the trigger fires; capped at 0.05. */
	delay?: number;
	as?: keyof JSX.IntrinsicElements;
	className?: string;
}

/**
 * Fades and rises its children once, when 20% of the element is in view.
 *
 * Server markup is always the final, visible state. The hidden starting state is
 * applied only on the client, in useGSAP's layout effect, and only to elements
 * that are below the viewport at mount: anything already on screen stays put.
 * With reduced motion the children always render statically.
 */
export function Reveal({ children, delay = 0, as = "div", className }: RevealProps) {
	const ref = useRef<HTMLElement>(null);
	const reduced = usePrefersReducedMotion();
	// Read through a ref so a changed `delay` never re-runs (replays) the reveal.
	const delayRef = useRef(delay);
	delayRef.current = delay;

	useGSAP(
		() => {
			const el = ref.current;
			// Live read as well: the hook reports `false` during hydration.
			if (!el || reduced || prefersReducedMotion()) return;
			if (el.getBoundingClientRect().top < window.innerHeight) return;
			gsap.from(el, {
				y: 16,
				opacity: 0,
				duration: 0.45,
				ease: "power2.out",
				delay: Math.min(Math.max(delayRef.current, 0), MAX_DELAY),
				scrollTrigger: { trigger: el, start: "20% bottom", once: true },
			});
		},
		{ dependencies: [reduced], scope: ref, revertOnUpdate: true },
	);

	const Tag = as as ElementType;
	return (
		<Tag ref={ref} className={className}>
			{children}
		</Tag>
	);
}

export default Reveal;

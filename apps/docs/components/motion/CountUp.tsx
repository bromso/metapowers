"use client";

import { gsap, useGSAP } from "@/lib/gsap";
import { prefersReducedMotion, usePrefersReducedMotion } from "@/lib/motion";
import { useRef } from "react";

export interface CountUpProps {
	to: number;
	/** Seconds. */
	duration?: number;
	className?: string;
}

const format = (value: number) => value.toLocaleString("en-US");

/**
 * Counts from 0 to `to` once, when it scrolls into view.
 *
 * Server markup always shows the final value, so the number is correct without JS.
 * On the client the count only runs for an element that is below the viewport at
 * mount: it is reset to 0 there (unseen) and counts up when it scrolls into view.
 * An element already on screen at mount keeps its final value and does not count, so
 * nothing visible ever jumps back to 0. With reduced motion it always shows `to`.
 *
 * The digits span is keyed by `to` and React never updates its text in place, so
 * GSAP's writes to it cannot conflict with React (a new `to` remounts the span).
 * The animated digits are aria-hidden; a visually hidden copy carries the value.
 */
export function CountUp({ to, duration = 1.2, className }: CountUpProps) {
	const ref = useRef<HTMLSpanElement>(null);
	const reduced = usePrefersReducedMotion();

	useGSAP(
		() => {
			const el = ref.current;
			if (!el) return;
			const final = format(to);
			if (
				reduced ||
				prefersReducedMotion() ||
				el.getBoundingClientRect().top < window.innerHeight
			) {
				el.textContent = final;
				return;
			}
			const counter = { value: 0 };
			el.textContent = format(0);
			gsap.to(counter, {
				value: to,
				duration,
				ease: "power2.out",
				snap: { value: 1 }, // `snap: 1` at runtime; GSAP types want the per-property form
				onUpdate: () => {
					el.textContent = format(counter.value);
				},
				scrollTrigger: { trigger: el, start: "top 90%", once: true },
			});
			return () => {
				el.textContent = final;
			};
		},
		{ dependencies: [reduced, to, duration], scope: ref, revertOnUpdate: true },
	);

	return (
		<span className={className}>
			<span key={to} ref={ref} aria-hidden="true">
				{format(to)}
			</span>
			<span className="sr-only">{format(to)}</span>
		</span>
	);
}

export default CountUp;

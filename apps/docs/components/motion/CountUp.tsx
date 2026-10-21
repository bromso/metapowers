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
 * Counts from 0 to `to` once when in view. With reduced motion renders `to`
 * immediately. The final value is always exposed to assistive tech (and
 * crawlers) through a visually hidden copy; the animated digits are aria-hidden.
 */
export function CountUp({ to, duration = 1.2, className }: CountUpProps) {
	const ref = useRef<HTMLSpanElement>(null);
	const reduced = usePrefersReducedMotion();

	useGSAP(
		() => {
			const el = ref.current;
			if (!el) return;
			if (reduced || prefersReducedMotion()) {
				el.textContent = format(to);
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
		},
		{ dependencies: [reduced, to, duration], scope: ref, revertOnUpdate: true },
	);

	return (
		<span className={className}>
			<span ref={ref} aria-hidden="true">
				{format(reduced ? to : 0)}
			</span>
			<span className="sr-only">{format(to)}</span>
		</span>
	);
}

export default CountUp;

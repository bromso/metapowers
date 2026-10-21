"use client";

import { gsap, useGSAP } from "@/lib/gsap";
import { prefersReducedMotion, usePrefersReducedMotion } from "@/lib/motion";
import { type ElementType, type JSX, type ReactNode, useRef } from "react";

export interface RevealProps {
	children: ReactNode;
	/** Seconds to wait after the trigger fires. */
	delay?: number;
	as?: keyof JSX.IntrinsicElements;
	className?: string;
}

/**
 * Fades and rises its children once, when 20% of the element is in view.
 * With reduced motion the children render statically in their final state.
 */
export function Reveal({ children, delay = 0, as = "div", className }: RevealProps) {
	const ref = useRef<HTMLElement>(null);
	const reduced = usePrefersReducedMotion();

	useGSAP(
		() => {
			const el = ref.current;
			// Live read as well: the hook reports `false` during hydration.
			if (!el || reduced || prefersReducedMotion()) return;
			gsap.from(el, {
				y: 16,
				opacity: 0,
				duration: 0.45,
				ease: "power2.out",
				delay,
				scrollTrigger: { trigger: el, start: "20% bottom", once: true },
			});
		},
		{ dependencies: [reduced, delay], scope: ref, revertOnUpdate: true },
	);

	const Tag = as as ElementType;
	return (
		<Tag ref={ref} className={className}>
			{children}
		</Tag>
	);
}

export default Reveal;

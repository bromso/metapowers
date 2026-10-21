"use client";

import { usePrefersReducedMotion, useResolvedToken } from "@/lib/motion";
import dynamic from "next/dynamic";
import { type RefObject, useEffect, useRef, useState } from "react";

/** WebGL backdrop: client-only and code-split; the section's ink/surface background covers first paint. */
const GhostFibers = dynamic(() => import("@/components/motion/GhostFibers"), { ssr: false });

/** True once the browser is idle after hydration, so the WebGL fibres never compete with first paint. */
function useIdle(): boolean {
	const [idle, setIdle] = useState(false);
	useEffect(() => {
		if (typeof window.requestIdleCallback === "function") {
			const handle = window.requestIdleCallback(() => setIdle(true), { timeout: 2000 });
			return () => window.cancelIdleCallback(handle);
		}
		const handle = window.setTimeout(() => setIdle(true), 200);
		return () => window.clearTimeout(handle);
	}, []);
	return idle;
}

/** True once the element has come within one viewport of the current scroll position. */
function useNearViewport<T extends Element>(): [RefObject<T | null>, boolean] {
	const ref = useRef<T | null>(null);
	const [near, setNear] = useState(false);
	useEffect(() => {
		const element = ref.current;
		if (!element) return undefined;
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries.some((entry) => entry.isIntersecting)) setNear(true);
			},
			{ rootMargin: "100%" },
		);
		observer.observe(element);
		return () => observer.disconnect();
	}, []);
	return [ref, near];
}

/**
 * Faint, slow fibres behind the closing CTA's ink background (spec §4.6). Mounted only once the
 * section has scrolled within one viewport and the browser is idle, so the WebGL chunk never
 * competes with first paint. Under reduced motion the chunk is never requested at all: the
 * `GhostFibers` element below is not rendered, so `next/dynamic` never imports it (`GhostFibers`'s
 * own wrapper additionally renders `null` for reduced motion, for the rare case the preference
 * flips on mid-session after the chunk already loaded).
 *
 * `opacity` is not a `GhostFibers` prop (it takes `HTMLAttributes<HTMLDivElement>`, which has no
 * `opacity`); the faintness is applied as CSS opacity on this wrapper instead.
 */
export function CtaFibers() {
	const reduced = usePrefersReducedMotion();
	const idle = useIdle();
	const [ref, near] = useNearViewport<HTMLDivElement>();
	// GhostFibers reads colour props through a 2D canvas, so `var(...)` cannot resolve inside it;
	// pass already-resolved token values (see lib/motion.ts's useResolvedToken).
	const glowColor = useResolvedToken("--mp-accent-soft");
	const lineColor = useResolvedToken("--mp-muted");
	const secondaryColor = useResolvedToken("--mp-accent-soft");

	const ready = !reduced && idle && near && !!glowColor && !!lineColor && !!secondaryColor;

	return (
		<div
			ref={ref}
			aria-hidden="true"
			className="pointer-events-none absolute inset-0 z-0 opacity-25"
		>
			{ready ? (
				<GhostFibers
					glowColor={glowColor}
					lineColor={lineColor}
					secondaryColor={secondaryColor}
					speed={0.1}
					layers={2}
					vignette={0.9}
					mouseInteraction={false}
					intro
					lightMode={false}
					dpr={1.5}
					className="h-full w-full"
				/>
			) : null}
		</div>
	);
}

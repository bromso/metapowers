"use client";

import { useIdle, useNearViewport, usePrefersReducedMotion, useResolvedToken } from "@/lib/motion";
import dynamic from "next/dynamic";

/** WebGL backdrop: client-only and code-split; the section's ink/surface background covers first paint. */
const GhostFibers = dynamic(() => import("@/components/motion/GhostFibers"), { ssr: false });

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
 *
 * Colour tokens: `glowColor` (`--mp-accent-soft`) and `secondaryColor` (`--domain-sky`) are
 * deliberately different tokens — the shader mixes them per-ribbon by `vTint`
 * (`GhostFibers.tsx`'s `mix(mix(uGlowColor, uSecondaryColor, vTint), uLineColor, vLight.y)`), so
 * two equal inputs would make `layers={2}`'s second ribbon chromatically identical to the first,
 * a no-op. `--domain-sky` gives the second ribbon a cooler, distinct cast (teal in the dark
 * theme, pale cyan in light) while staying faint at the wrapper's 0.25 opacity and legible in the
 * dark theme's surface-coloured section. `lineColor` (`--mp-muted`) stays a third, neutral token
 * for the specular highlights so it doesn't collide with either ribbon colour.
 */
export function CtaFibers() {
	const reduced = usePrefersReducedMotion();
	const idle = useIdle();
	const [ref, near] = useNearViewport<HTMLDivElement>();
	// GhostFibers reads colour props through a 2D canvas, so `var(...)` cannot resolve inside it;
	// pass already-resolved token values (see lib/motion.ts's useResolvedToken). Each token is
	// resolved exactly once.
	const glowColor = useResolvedToken("--mp-accent-soft");
	const secondaryColor = useResolvedToken("--domain-sky");
	const lineColor = useResolvedToken("--mp-muted");

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

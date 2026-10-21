"use client";

import { useIdle, useNearViewport, usePrefersReducedMotion, useResolvedToken } from "@/lib/motion";
import dynamic from "next/dynamic";

/** WebGL backdrop: client-only and code-split; the section's ink/surface background covers first paint. */
const Topography = dynamic(() => import("@/components/motion/Topography"), { ssr: false });

/**
 * Faint, slow contour lines behind the closing CTA's ink background (spec §4.6). Mounted only
 * once the section has scrolled within one viewport and the browser is idle, so the WebGL chunk
 * never competes with first paint. Under reduced motion the chunk is never requested at all:
 * the `Topography` element below is not rendered, so `next/dynamic` never imports it
 * (`Topography`'s own wrapper additionally renders `null` for reduced motion, for the rare case
 * the preference flips on mid-session after the chunk already loaded).
 *
 * Values: React Bits' "dunes" preset (`color`, `lineCount`, `majorLines`, `elevation`, `scale`,
 * `detail`, `speed`, `direction`) on the demo's base look for everything else (`lineWidth`,
 * `foreground`, `tilt`, `morph`, `depthOfField`, `fog`), then made subtle: `opacity` 0.3, a low
 * `glow`, and no pointer, click, marker or glitch effects. `color` is the `--mp-topo` token,
 * resolved because Topography parses it as a hex string, not as CSS.
 */
export function CtaBackdrop() {
	const reduced = usePrefersReducedMotion();
	const idle = useIdle();
	const [ref, near] = useNearViewport<HTMLDivElement>();
	const color = useResolvedToken("--mp-topo");

	const ready = !reduced && idle && near && !!color;

	return (
		<div ref={ref} aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
			{ready ? (
				<Topography
					color={color}
					lineCount={34}
					lineWidth={1.2}
					majorLines={false}
					elevation={0.5}
					foreground={0.2}
					scale={1.8}
					detail={0.15}
					tilt={32}
					speed={0.45}
					direction="right"
					morph={0.2}
					glow={0.15}
					depthOfField={0.4}
					fog={0.35}
					opacity={0.3}
					dpr={1}
					mouseInteraction={false}
					clickEffect="none"
					markers="none"
					glitch={0}
					intro
					lightMode={false}
					className="h-full w-full"
				/>
			) : null}
		</div>
	);
}

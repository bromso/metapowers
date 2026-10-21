"use client";

import { prefersReducedMotion } from "@/lib/motion";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

export interface AnimatedIconProps {
	/** Animated line-md markup (`renderLineMdIcon`); its SMIL draw plays when it is inserted. */
	svg: string;
	/** The same icon frozen at its final frame (`renderLineMdIconStill`): the resting render. */
	still: string;
	className?: string;
}

/**
 * Renders a build-time line-md icon (trusted markup from `lib/icons.ts`, never user input).
 * At rest it shows the still render, so server HTML, touch devices and reduced motion all see the
 * finished drawing without any motion. On the enclosing `[data-bento-tile]`'s first mouse/pen
 * `pointerenter` or keyboard focus it swaps in the animated markup under a new key, so a fresh
 * `<svg>` is inserted and its draw plays once; the listeners are then removed and it never
 * replays. SMIL `fill="freeze"` holds the last frame, which matches the still render.
 */
export function AnimatedIcon({ svg, still, className }: AnimatedIconProps) {
	const ref = useRef<HTMLSpanElement>(null);
	const [play, setPlay] = useState(0);

	useEffect(() => {
		const tile = ref.current?.closest<HTMLElement>("[data-bento-tile]");
		if (!tile) return undefined;
		const start = () => {
			if (prefersReducedMotion()) return;
			tile.removeEventListener("pointerenter", onPointer);
			tile.removeEventListener("focus", onFocus);
			setPlay(1);
		};
		const onPointer = (event: PointerEvent) => {
			if (event.pointerType !== "touch") start();
		};
		const onFocus = () => {
			if (tile.matches(":focus-visible")) start();
		};
		tile.addEventListener("pointerenter", onPointer);
		tile.addEventListener("focus", onFocus);
		return () => {
			tile.removeEventListener("pointerenter", onPointer);
			tile.removeEventListener("focus", onFocus);
		};
	}, []);

	// The SVG timeline normally starts on insertion; rewind explicitly in case the browser
	// started it at document load.
	useLayoutEffect(() => {
		if (!play) return;
		ref.current?.querySelector("svg")?.setCurrentTime(0);
	}, [play]);

	return (
		<span
			ref={ref}
			aria-hidden="true"
			className={className}
			key={play}
			// Trusted build-time SVG from lib/icons.ts, never user input.
			dangerouslySetInnerHTML={{ __html: play ? svg : still }}
		/>
	);
}

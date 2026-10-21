// Source: https://reactbits.dev/r/ChromaGrid-TS-TW.json (MIT + Commons Clause), copied 2026-10-21
// Ported, not copied: only ChromaGrid's pointer-tracking spotlight math is kept. The photo grid,
// its themes, images and markup are not part of this file.
"use client";

import { prefersReducedMotion, usePrefersReducedMotion } from "@/lib/motion";
import { type ReactNode, useEffect, useLayoutEffect, useRef } from "react";

export interface ChromaSpotlightProps {
	children?: ReactNode;
	/** Spotlight radius in px (upstream `radius`). */
	radius?: number;
	/** 0–1: how much of the radius is soft falloff (upstream `softness`). */
	softness?: number;
	/** Seconds-ish lag of the spotlight behind the pointer (upstream `damping`). */
	damping?: number;
	className?: string;
}

/** Upstream ChromaGrid's default `fadeOut`, in seconds. */
const FADE_OUT = 0.6;
const VARIABLES = [
	"--chroma-x",
	"--chroma-y",
	"--chroma-r",
	"--chroma-stops",
	"--chroma-power",
] as const;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const falloffStops = (softness: number) => {
	const core = clamp(1 - softness, 0, 0.95);
	const stops = [];
	for (let i = 0; i <= 12; i++) {
		const t = i / 12;
		const u = clamp((t - core) / Math.max(0.0001, 1 - core), 0, 1);
		const alpha = 1 - u * u * u * (u * (u * 6 - 15) + 10);
		stops.push(`rgba(0, 0, 0, ${alpha.toFixed(3)}) ${(t * 100).toFixed(1)}%`);
	}
	return stops.join(", ");
};

/**
 * Tracks the pointer over its own box and writes `--chroma-x` / `--chroma-y` (px from its
 * top-left), `--chroma-r` (px), `--chroma-stops` (mask falloff for `softness`) and
 * `--chroma-power` (0–1, fades in on enter and out on leave) on itself. Descendants marked
 * `data-chroma-area` also get `--chroma-ox` / `--chroma-oy`, their offset inside this box, so a
 * tile can place the spotlight in its own coordinates. Under reduced motion or on a coarse
 * pointer nothing is written and tiles keep their static look.
 */
const ChromaSpotlight = ({
	children,
	radius = 260,
	softness = 0.6,
	damping = 0.45,
	className,
}: ChromaSpotlightProps) => {
	const rootRef = useRef<HTMLDivElement>(null);
	const placeRef = useRef<(() => void) | null>(null);
	const dampingRef = useRef(damping);
	dampingRef.current = damping;
	const reduced = usePrefersReducedMotion();

	useEffect(() => {
		const root = rootRef.current;
		// The hook reports `false` during hydration, so read the preference live as well.
		if (!root || reduced || prefersReducedMotion()) return undefined;
		if (window.matchMedia?.("(pointer: coarse)").matches) return undefined;

		const state = { x: 0, y: 0, tx: 0, ty: 0, power: 0, target: 0, primed: false };
		let raf = 0;
		let last = 0;
		const areas = new Set<HTMLElement>();

		root.style.setProperty("--chroma-r", `${Math.max(20, radius)}px`);
		root.style.setProperty("--chroma-stops", falloffStops(clamp(softness, 0, 1)));
		root.style.setProperty("--chroma-power", "0");

		const place = () => {
			const box = root.getBoundingClientRect();
			for (const node of root.querySelectorAll<HTMLElement>("[data-chroma-area]")) {
				const rect = node.getBoundingClientRect();
				node.style.setProperty("--chroma-ox", `${rect.left - box.left}px`);
				node.style.setProperty("--chroma-oy", `${rect.top - box.top}px`);
				areas.add(node);
			}
		};
		placeRef.current = place;

		const frame = (now: number) => {
			raf = 0;
			const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60;
			last = now;
			const follow = 1 - Math.exp(-dt / Math.max(0.01, dampingRef.current * 0.32));
			state.x += (state.tx - state.x) * follow;
			state.y += (state.ty - state.y) * follow;
			const span = state.target > state.power ? 0.1 : Math.max(0.02, FADE_OUT * 0.35);
			state.power += (state.target - state.power) * (1 - Math.exp(-dt / span));
			root.style.setProperty("--chroma-x", `${state.x.toFixed(2)}px`);
			root.style.setProperty("--chroma-y", `${state.y.toFixed(2)}px`);
			root.style.setProperty("--chroma-power", state.power.toFixed(4));
			const settled =
				Math.abs(state.tx - state.x) < 0.1 &&
				Math.abs(state.ty - state.y) < 0.1 &&
				Math.abs(state.target - state.power) < 0.002;
			if (settled) {
				state.power = state.target;
				root.style.setProperty("--chroma-power", state.power.toFixed(4));
				last = 0;
			} else {
				raf = requestAnimationFrame(frame);
			}
		};

		const wake = () => {
			if (!raf) raf = requestAnimationFrame(frame);
		};

		const onMove = (event: PointerEvent) => {
			const box = root.getBoundingClientRect();
			state.tx = event.clientX - box.left;
			state.ty = event.clientY - box.top;
			if (!state.primed || state.power < 0.02) {
				state.x = state.tx;
				state.y = state.ty;
				state.primed = true;
			}
			state.target = 1;
			wake();
		};

		const onLeave = () => {
			state.target = 0;
			wake();
		};

		const resizeObserver = new ResizeObserver(place);
		resizeObserver.observe(root);
		root.addEventListener("pointermove", onMove);
		root.addEventListener("pointerdown", onMove);
		root.addEventListener("pointerleave", onLeave);
		root.addEventListener("pointercancel", onLeave);
		place();

		return () => {
			cancelAnimationFrame(raf);
			placeRef.current = null;
			resizeObserver.disconnect();
			root.removeEventListener("pointermove", onMove);
			root.removeEventListener("pointerdown", onMove);
			root.removeEventListener("pointerleave", onLeave);
			root.removeEventListener("pointercancel", onLeave);
			for (const name of VARIABLES) root.style.removeProperty(name);
			for (const node of areas) {
				node.style.removeProperty("--chroma-ox");
				node.style.removeProperty("--chroma-oy");
			}
		};
	}, [reduced, radius, softness]);

	// As upstream: re-measure tile offsets after every render (tiles may have moved).
	useLayoutEffect(() => {
		placeRef.current?.();
	});

	return (
		<div ref={rootRef} className={className}>
			{children}
		</div>
	);
};

export default ChromaSpotlight;

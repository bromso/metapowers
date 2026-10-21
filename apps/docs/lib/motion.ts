import { type RefObject, useEffect, useRef, useState, useSyncExternalStore } from "react";

/**
 * Single gate for every animation on the site. Components must call
 * `usePrefersReducedMotion()` (or `prefersReducedMotion()` outside React)
 * and render their final, static state when it returns true.
 */
const QUERY = "(prefers-reduced-motion: reduce)";

function getMediaQuery(): MediaQueryList | null {
	if (typeof window === "undefined" || typeof window.matchMedia !== "function") return null;
	return window.matchMedia(QUERY);
}

/** Pure read of the user's motion preference; `false` when there is no DOM. */
export function prefersReducedMotion(): boolean {
	return getMediaQuery()?.matches ?? false;
}

function subscribe(onChange: () => void): () => void {
	const mql = getMediaQuery();
	if (!mql) return () => {};
	mql.addEventListener("change", onChange);
	return () => mql.removeEventListener("change", onChange);
}

/** Client hook: subscribes to the reduced-motion media query. Server snapshot is `false`. */
export function usePrefersReducedMotion(): boolean {
	return useSyncExternalStore(subscribe, prefersReducedMotion, () => false);
}

/**
 * Resolves a CSS custom property (e.g. `--mp-accent-soft`) to its computed value on `<html>`,
 * re-reading it when the Fumadocs `.dark` class is toggled. Returns `null` until the first
 * client read lands (there is no server snapshot).
 *
 * This exists for color props that are read through a 2D canvas and so cannot resolve
 * `var(...)` the way plain CSS can — e.g. `StarBorder`'s `color` / `trailColor` prop (used by
 * `StarPill`), or `GhostFibers`' `glowColor` / `lineColor` if a future caller needs it. See
 * `Hero.tsx`'s `useAuroraTheme` for the same pattern applied to the aurora's gradient stops.
 */
export function useResolvedToken(name: string): string | null {
	const [value, setValue] = useState<string | null>(null);
	useEffect(() => {
		const root = document.documentElement;
		const read = () => {
			const resolved = getComputedStyle(root).getPropertyValue(name).trim();
			if (!resolved) return;
			setValue((prev) => (prev === resolved ? prev : resolved));
		};
		read();
		const observer = new MutationObserver(read);
		observer.observe(root, { attributes: true, attributeFilter: ["class"] });
		return () => observer.disconnect();
	}, [name]);
	return value;
}

/**
 * True once the browser is idle after hydration, so a WebGL mount never competes with first
 * paint. Shared by callers that lazy-mount a WebGL component (see `CtaFibers.tsx`). `Hero.tsx`
 * keeps its own copy of this pattern for now.
 */
export function useIdle(): boolean {
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

/**
 * True once the returned ref's element has come within one viewport of the current scroll
 * position. Sticky: once `true` it stays `true` and the observer disconnects, since callers use
 * this only to gate a one-time lazy mount, not to track ongoing visibility.
 */
export function useNearViewport<T extends Element>(): [RefObject<T | null>, boolean] {
	const ref = useRef<T | null>(null);
	const [near, setNear] = useState(false);
	useEffect(() => {
		const element = ref.current;
		if (!element) return undefined;
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries.some((entry) => entry.isIntersecting)) {
					setNear(true);
					observer.disconnect();
				}
			},
			{ rootMargin: "100%" },
		);
		observer.observe(element);
		return () => observer.disconnect();
	}, []);
	return [ref, near];
}

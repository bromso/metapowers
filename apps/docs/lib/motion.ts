import { useEffect, useState, useSyncExternalStore } from "react";

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

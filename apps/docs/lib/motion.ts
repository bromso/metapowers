import { useSyncExternalStore } from "react";

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

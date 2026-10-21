import { expect, test } from "vitest";
import { prefersReducedMotion } from "./motion";

test("prefersReducedMotion is false without a window", () => {
	expect(prefersReducedMotion()).toBe(false);
});
test("prefersReducedMotion reads the media query when present", () => {
	(globalThis as any).window = { matchMedia: () => ({ matches: true }) };
	expect(prefersReducedMotion()).toBe(true);
	// biome-ignore lint/performance/noDelete: the stub window must be removed, not set to undefined
	delete (globalThis as any).window;
});

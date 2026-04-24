import { describe, expect, it } from "vitest";
import { contrastRatio, meetsAA, meetsAAA, simulateColorBlindness } from "./wcag.js";

describe("contrastRatio", () => {
	it("returns 21 for black on white", () => {
		expect(contrastRatio({ r: 0, g: 0, b: 0 }, { r: 1, g: 1, b: 1 })).toBeCloseTo(21, 0);
	});

	it("returns 1 for same color", () => {
		expect(contrastRatio({ r: 0.5, g: 0.5, b: 0.5 }, { r: 0.5, g: 0.5, b: 0.5 })).toBeCloseTo(1, 0);
	});
});

describe("meetsAA", () => {
	it("passes for black on white at normal text", () => {
		expect(meetsAA({ r: 0, g: 0, b: 0 }, { r: 1, g: 1, b: 1 }, "normal")).toBe(true);
	});

	it("fails for light gray on white", () => {
		expect(meetsAA({ r: 0.8, g: 0.8, b: 0.8 }, { r: 1, g: 1, b: 1 }, "normal")).toBe(false);
	});
});

describe("simulateColorBlindness", () => {
	it("transforms red for protanopia", () => {
		const result = simulateColorBlindness({ r: 1, g: 0, b: 0 }, "protanopia");
		expect(result.r).toBeLessThan(1);
	});
});

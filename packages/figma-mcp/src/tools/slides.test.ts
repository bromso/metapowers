import { describe, it, expect } from "vitest";
import { registerSlidesTools } from "./slides.js";

describe("registerSlidesTools", () => {
	it("is a function", () => {
		expect(typeof registerSlidesTools).toBe("function");
	});
});

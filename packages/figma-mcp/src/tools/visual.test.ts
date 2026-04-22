import { describe, it, expect } from "vitest";
import { registerVisualTools } from "./visual.js";

describe("registerVisualTools", () => {
	it("is a function", () => {
		expect(typeof registerVisualTools).toBe("function");
	});
});

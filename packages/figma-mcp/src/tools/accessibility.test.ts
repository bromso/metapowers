import { describe, it, expect } from "vitest";
import { registerAccessibilityTools } from "./accessibility.js";

describe("registerAccessibilityTools", () => {
	it("is a function", () => {
		expect(typeof registerAccessibilityTools).toBe("function");
	});
});

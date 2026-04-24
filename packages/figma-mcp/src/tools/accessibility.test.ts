import { describe, expect, it } from "vitest";
import { registerAccessibilityTools } from "./accessibility.js";

describe("registerAccessibilityTools", () => {
	it("is a function", () => {
		expect(typeof registerAccessibilityTools).toBe("function");
	});
});

import { describe, expect, it } from "vitest";
import { registerDesignSystemTools } from "./design-system.js";

describe("registerDesignSystemTools", () => {
	it("is a function", () => {
		expect(typeof registerDesignSystemTools).toBe("function");
	});
});

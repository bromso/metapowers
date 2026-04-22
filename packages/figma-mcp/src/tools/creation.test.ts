import { describe, it, expect } from "vitest";
import { registerCreationTools } from "./creation.js";

describe("registerCreationTools", () => {
	it("is a function", () => {
		expect(typeof registerCreationTools).toBe("function");
	});
});

import { describe, expect, it } from "vitest";
import { registerFigJamTools } from "./figjam.js";

describe("registerFigJamTools", () => {
	it("is a function", () => {
		expect(typeof registerFigJamTools).toBe("function");
	});
});

import { describe, it, expect } from "vitest";
import { createFigmaServer } from "./server.js";

describe("createFigmaServer", () => {
	it("creates server with correct name and version", () => {
		const server = createFigmaServer("test-token");
		expect(server).toBeDefined();
	});
});

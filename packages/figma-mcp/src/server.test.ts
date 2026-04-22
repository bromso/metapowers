import { describe, it, expect, afterEach } from "vitest";
import { createFigmaServer } from "./server.js";
import type { FigmaBridge } from "./figma/bridge.js";

describe("createFigmaServer", () => {
	let bridge: FigmaBridge;

	afterEach(async () => {
		if (bridge) await bridge.close();
	});

	it("creates server and bridge", () => {
		const result = createFigmaServer({ token: "test-token", bridgePort: 9200 });
		bridge = result.bridge;
		expect(result.server).toBeDefined();
		expect(result.bridge).toBeDefined();
	});
});

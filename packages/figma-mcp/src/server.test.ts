import { afterEach, describe, expect, it } from "vitest";
import type { FigmaBridge } from "./figma/bridge.js";
import { createFigmaServer } from "./server.js";

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

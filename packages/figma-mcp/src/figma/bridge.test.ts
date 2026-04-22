import { describe, it, expect, afterEach } from "vitest";
import { FigmaBridge } from "./bridge.js";

describe("FigmaBridge", () => {
	let bridge: FigmaBridge;

	afterEach(async () => {
		if (bridge) await bridge.close();
	});

	it("starts WebSocket server on specified port", async () => {
		bridge = new FigmaBridge({ port: 9100 });
		await bridge.start();
		expect(bridge.port).toBe(9100);
	});

	it("reports not connected when no plugin connected", () => {
		bridge = new FigmaBridge({ port: 9101 });
		expect(bridge.isConnected).toBe(false);
	});

	it("execute rejects when no plugin connected", async () => {
		bridge = new FigmaBridge({ port: 9102 });
		await bridge.start();
		await expect(bridge.execute("figma.currentPage.name")).rejects.toThrow(
			"No Figma plugin connected",
		);
	});
});

#!/usr/bin/env node

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createFigmaServer } from "./server.js";

export { createFigmaServer } from "./server.js";
export type { ServerOptions } from "./server.js";
export { FigmaClient } from "./figma/rest-api.js";
export { FigmaBridge } from "./figma/bridge.js";
export type * from "./figma/rest-api.js";

const token = process.env.FIGMA_ACCESS_TOKEN;
if (!token) {
	console.error("Error: FIGMA_ACCESS_TOKEN environment variable is required");
	process.exit(1);
}

const bridgePort = Number(process.env.FIGMA_BRIDGE_PORT) || 9000;
const { server, bridge } = createFigmaServer({ token, bridgePort });

await bridge.start();
console.error(`[figma-mcp] Bridge WebSocket server listening on port ${bridgePort}`);

const transport = new StdioServerTransport();
await server.connect(transport);

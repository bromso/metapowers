#!/usr/bin/env node

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createFigmaServer } from "./server.js";

export { createFigmaServer } from "./server.js";
export { FigmaClient } from "./figma/rest-api.js";
export type * from "./figma/rest-api.js";

const token = process.env.FIGMA_ACCESS_TOKEN;
if (!token) {
	console.error("Error: FIGMA_ACCESS_TOKEN environment variable is required");
	process.exit(1);
}

const server = createFigmaServer(token);
const transport = new StdioServerTransport();
await server.connect(transport);

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { FigmaClient } from "./figma/rest-api.js";
import { registerDesignSystemTools } from "./tools/design-system.js";
import { registerVisualTools } from "./tools/visual.js";

export function createFigmaServer(token: string): McpServer {
	const server = new McpServer({
		name: "@metapowers/figma-mcp",
		version: "0.1.0",
	});

	const client = new FigmaClient(token);

	registerDesignSystemTools(server, client);
	registerVisualTools(server, client);

	return server;
}

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { FigmaClient } from "./figma/rest-api.js";
import { FigmaBridge } from "./figma/bridge.js";
import { registerDesignSystemTools } from "./tools/design-system.js";
import { registerVisualTools } from "./tools/visual.js";
import { registerCreationTools } from "./tools/creation.js";
import { registerFigJamTools } from "./tools/figjam.js";

export interface ServerOptions {
	token: string;
	bridgePort?: number;
}

export function createFigmaServer(options: ServerOptions): { server: McpServer; bridge: FigmaBridge } {
	const server = new McpServer({
		name: "@metapowers/figma-mcp",
		version: "0.1.0",
	});

	const client = new FigmaClient(options.token);
	const bridge = new FigmaBridge({ port: options.bridgePort ?? 9000 });

	registerDesignSystemTools(server, client);
	registerVisualTools(server, client);
	registerCreationTools(server, bridge);
	registerFigJamTools(server, bridge);

	return { server, bridge };
}

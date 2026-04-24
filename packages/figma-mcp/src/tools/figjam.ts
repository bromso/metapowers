import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { FigmaBridge } from "../figma/bridge.js";

function textResult(data: unknown) {
	return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
}

export function registerFigJamTools(server: McpServer, bridge: FigmaBridge): void {
	// 1. figjam_create_sticky
	(server.tool as any)(
		"figjam_create_sticky",
		"Create a sticky note on a FigJam board",
		{
			text: z.string(),
			x: z.number().optional(),
			y: z.number().optional(),
		},
		async (params: { text: string; x?: number; y?: number }) => {
			const result = await bridge.sendCommand("FIGJAM_CREATE_STICKY", params);
			return textResult(result);
		},
	);

	// 2. figjam_create_stickies
	(server.tool as any)(
		"figjam_create_stickies",
		"Create multiple sticky notes on a FigJam board",
		{
			stickies: z.array(
				z.object({
					text: z.string(),
					x: z.number().optional(),
					y: z.number().optional(),
				}),
			),
		},
		async (params: { stickies: Array<{ text: string; x?: number; y?: number }> }) => {
			const result = await bridge.sendCommand("FIGJAM_CREATE_STICKIES", params);
			return textResult(result);
		},
	);

	// 3. figjam_create_connector
	(server.tool as any)(
		"figjam_create_connector",
		"Create a connector between two nodes on a FigJam board",
		{
			startNodeId: z.string(),
			endNodeId: z.string(),
			label: z.string().optional(),
		},
		async (params: { startNodeId: string; endNodeId: string; label?: string }) => {
			const result = await bridge.sendCommand("FIGJAM_CREATE_CONNECTOR", params);
			return textResult(result);
		},
	);

	// 4. figjam_create_shape_with_text
	(server.tool as any)(
		"figjam_create_shape_with_text",
		"Create a shape with text on a FigJam board",
		{
			shapeType: z.enum([
				"DIAMOND",
				"ELLIPSE",
				"ROUNDED_RECTANGLE",
				"TRIANGLE_UP",
				"TRIANGLE_DOWN",
			]),
			text: z.string(),
			x: z.number().optional(),
			y: z.number().optional(),
		},
		async (params: { shapeType: string; text: string; x?: number; y?: number }) => {
			const result = await bridge.sendCommand("FIGJAM_CREATE_SHAPE_WITH_TEXT", params);
			return textResult(result);
		},
	);

	// 5. figjam_create_table
	(server.tool as any)(
		"figjam_create_table",
		"Create a table on a FigJam board",
		{
			rows: z.number(),
			columns: z.number(),
			data: z.array(z.array(z.string())).optional(),
		},
		async (params: { rows: number; columns: number; data?: string[][] }) => {
			const result = await bridge.sendCommand("FIGJAM_CREATE_TABLE", params);
			return textResult(result);
		},
	);

	// 6. figjam_create_code_block
	(server.tool as any)(
		"figjam_create_code_block",
		"Create a code block on a FigJam board",
		{
			code: z.string(),
			language: z.string().optional(),
			x: z.number().optional(),
			y: z.number().optional(),
		},
		async (params: { code: string; language?: string; x?: number; y?: number }) => {
			const result = await bridge.sendCommand("FIGJAM_CREATE_CODE_BLOCK", params);
			return textResult(result);
		},
	);

	// 7. figjam_get_board_contents
	(server.tool as any)(
		"figjam_get_board_contents",
		"Get all top-level nodes on the current FigJam board",
		{},
		async () => {
			const result = await bridge.sendCommand("FIGJAM_GET_BOARD_CONTENTS");
			return textResult(result);
		},
	);

	// 8. figjam_get_connections
	(server.tool as any)(
		"figjam_get_connections",
		"Get all connectors on the current FigJam board",
		{},
		async () => {
			const result = await bridge.sendCommand("FIGJAM_GET_CONNECTIONS");
			return textResult(result);
		},
	);
}

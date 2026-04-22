import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { FigmaBridge } from "../figma/bridge.js";

function textResult(data: unknown) {
	return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
}

export function registerCreationTools(server: McpServer, bridge: FigmaBridge): void {
	// 1. figma_execute
	(server.tool as any)(
		"figma_execute",
		"Execute arbitrary Figma Plugin API code in the connected Figma Desktop instance.",
		{ code: z.string() },
		async ({ code }: { code: string }) => {
			const result = await bridge.execute(code);
			return textResult(result);
		},
	);

	// 2. figma_create_frame
	(server.tool as any)(
		"figma_create_frame",
		"Create a new frame node in the current Figma document",
		{
			name: z.string().optional(),
			width: z.number().optional(),
			height: z.number().optional(),
			x: z.number().optional(),
			y: z.number().optional(),
		},
		async (params: { name?: string; width?: number; height?: number; x?: number; y?: number }) => {
			const result = await bridge.sendCommand("CREATE_FRAME", params);
			return textResult(result);
		},
	);

	// 3. figma_create_component
	(server.tool as any)(
		"figma_create_component",
		"Create a new component node in the current Figma document",
		{
			name: z.string().optional(),
			width: z.number().optional(),
			height: z.number().optional(),
			x: z.number().optional(),
			y: z.number().optional(),
		},
		async (params: { name?: string; width?: number; height?: number; x?: number; y?: number }) => {
			const result = await bridge.sendCommand("CREATE_COMPONENT", params);
			return textResult(result);
		},
	);

	// 4. figma_create_instance
	(server.tool as any)(
		"figma_create_instance",
		"Create an instance of an existing component",
		{
			componentId: z.string(),
			x: z.number().optional(),
			y: z.number().optional(),
		},
		async (params: { componentId: string; x?: number; y?: number }) => {
			const result = await bridge.sendCommand("CREATE_INSTANCE", params);
			return textResult(result);
		},
	);

	// 5. figma_create_text
	(server.tool as any)(
		"figma_create_text",
		"Create a new text node in the current Figma document",
		{
			text: z.string(),
			name: z.string().optional(),
			fontSize: z.number().optional(),
			fontFamily: z.string().optional(),
			fontStyle: z.string().optional(),
			x: z.number().optional(),
			y: z.number().optional(),
		},
		async (params: { text: string; name?: string; fontSize?: number; fontFamily?: string; fontStyle?: string; x?: number; y?: number }) => {
			const result = await bridge.sendCommand("CREATE_TEXT", params);
			return textResult(result);
		},
	);

	// 6. figma_create_shape
	(server.tool as any)(
		"figma_create_shape",
		"Create a shape node (rectangle, ellipse, polygon, star, or line)",
		{
			type: z.enum(["RECTANGLE", "ELLIPSE", "POLYGON", "STAR", "LINE"]),
			name: z.string().optional(),
			width: z.number().optional(),
			height: z.number().optional(),
			x: z.number().optional(),
			y: z.number().optional(),
			cornerRadius: z.number().optional(),
		},
		async (params: { type: string; name?: string; width?: number; height?: number; x?: number; y?: number; cornerRadius?: number }) => {
			const result = await bridge.sendCommand("CREATE_SHAPE", params);
			return textResult(result);
		},
	);

	// 7. figma_modify_node
	(server.tool as any)(
		"figma_modify_node",
		"Modify properties of an existing node",
		{
			nodeId: z.string(),
			properties: z.record(z.unknown()),
		},
		async (params: { nodeId: string; properties: Record<string, unknown> }) => {
			const result = await bridge.sendCommand("MODIFY_NODE", params);
			return textResult(result);
		},
	);

	// 8. figma_delete_node
	(server.tool as any)(
		"figma_delete_node",
		"Delete a node from the Figma document",
		{ nodeId: z.string() },
		{ destructiveHint: true },
		async (params: { nodeId: string }) => {
			const result = await bridge.sendCommand("DELETE_NODE", params);
			return textResult(result);
		},
	);

	// 9. figma_arrange_component_set
	(server.tool as any)(
		"figma_arrange_component_set",
		"Arrange components into a component set (variant group)",
		{
			componentIds: z.array(z.string()),
			name: z.string().optional(),
		},
		async (params: { componentIds: string[]; name?: string }) => {
			const result = await bridge.sendCommand("ARRANGE_COMPONENT_SET", params);
			return textResult(result);
		},
	);

	// 10. figma_group_nodes
	(server.tool as any)(
		"figma_group_nodes",
		"Group multiple nodes together",
		{
			nodeIds: z.array(z.string()),
			name: z.string().optional(),
		},
		async (params: { nodeIds: string[]; name?: string }) => {
			const result = await bridge.sendCommand("GROUP_NODES", params);
			return textResult(result);
		},
	);

	// 11. figma_set_auto_layout
	(server.tool as any)(
		"figma_set_auto_layout",
		"Apply auto layout settings to a frame or component",
		{
			nodeId: z.string(),
			direction: z.enum(["HORIZONTAL", "VERTICAL"]),
			spacing: z.number().optional(),
			paddingHorizontal: z.number().optional(),
			paddingVertical: z.number().optional(),
		},
		async (params: { nodeId: string; direction: string; spacing?: number; paddingHorizontal?: number; paddingVertical?: number }) => {
			const result = await bridge.sendCommand("SET_AUTO_LAYOUT", params);
			return textResult(result);
		},
	);

	// 12. figma_apply_styles
	(server.tool as any)(
		"figma_apply_styles",
		"Apply visual styles (fills, strokes, effects, opacity) to a node",
		{
			nodeId: z.string(),
			fills: z.unknown().optional(),
			strokes: z.unknown().optional(),
			strokeWeight: z.number().optional(),
			effects: z.unknown().optional(),
			opacity: z.number().optional(),
			cornerRadius: z.number().optional(),
		},
		async (params: { nodeId: string; fills?: unknown; strokes?: unknown; strokeWeight?: number; effects?: unknown; opacity?: number; cornerRadius?: number }) => {
			const result = await bridge.sendCommand("APPLY_STYLES", params);
			return textResult(result);
		},
	);
}

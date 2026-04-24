import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { FigmaBridge } from "../figma/bridge.js";

function textResult(data: unknown) {
	return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
}

export function registerSlidesTools(server: McpServer, bridge: FigmaBridge): void {
	// 1. figma_list_slides
	(server.tool as any)(
		"figma_list_slides",
		"List all slides in the current Figma presentation",
		{},
		async () => {
			const result = await bridge.sendCommand("FIGMA_LIST_SLIDES", {});
			return textResult(result);
		},
	);

	// 2. figma_get_slide_content
	(server.tool as any)(
		"figma_get_slide_content",
		"Get the content and children of a specific slide",
		{ slideId: z.string() },
		async (params: { slideId: string }) => {
			const result = await bridge.sendCommand("FIGMA_GET_SLIDE_CONTENT", params);
			return textResult(result);
		},
	);

	// 3. figma_create_slide
	(server.tool as any)(
		"figma_create_slide",
		"Create a new slide in the current Figma presentation",
		{ name: z.string().optional() },
		async (params: { name?: string }) => {
			const result = await bridge.sendCommand("FIGMA_CREATE_SLIDE", params);
			return textResult(result);
		},
	);

	// 4. figma_duplicate_slide
	(server.tool as any)(
		"figma_duplicate_slide",
		"Duplicate an existing slide",
		{ slideId: z.string() },
		async (params: { slideId: string }) => {
			const result = await bridge.sendCommand("FIGMA_DUPLICATE_SLIDE", params);
			return textResult(result);
		},
	);

	// 5. figma_delete_slide
	(server.tool as any)(
		"figma_delete_slide",
		"Delete a slide from the presentation",
		{ slideId: z.string() },
		{ destructiveHint: true },
		async (params: { slideId: string }) => {
			const result = await bridge.sendCommand("FIGMA_DELETE_SLIDE", params);
			return textResult(result);
		},
	);

	// 6. figma_reorder_slides
	(server.tool as any)(
		"figma_reorder_slides",
		"Reorder slides by providing an ordered array of slide IDs",
		{ slideIds: z.array(z.string()) },
		async (params: { slideIds: string[] }) => {
			const result = await bridge.sendCommand("FIGMA_REORDER_SLIDES", params);
			return textResult(result);
		},
	);

	// 7. figma_add_text_to_slide
	(server.tool as any)(
		"figma_add_text_to_slide",
		"Add a text node to a specific slide",
		{
			slideId: z.string(),
			text: z.string(),
			x: z.number().optional(),
			y: z.number().optional(),
			fontSize: z.number().optional(),
		},
		async (params: {
			slideId: string;
			text: string;
			x?: number;
			y?: number;
			fontSize?: number;
		}) => {
			const result = await bridge.sendCommand("FIGMA_ADD_TEXT_TO_SLIDE", params);
			return textResult(result);
		},
	);

	// 8. figma_add_shape_to_slide
	(server.tool as any)(
		"figma_add_shape_to_slide",
		"Add a shape to a specific slide",
		{
			slideId: z.string(),
			type: z.enum(["RECTANGLE", "ELLIPSE"]),
			width: z.number().optional(),
			height: z.number().optional(),
			x: z.number().optional(),
			y: z.number().optional(),
		},
		async (params: {
			slideId: string;
			type: string;
			width?: number;
			height?: number;
			x?: number;
			y?: number;
		}) => {
			const result = await bridge.sendCommand("FIGMA_ADD_SHAPE_TO_SLIDE", params);
			return textResult(result);
		},
	);

	// 9. figma_set_slide_transition
	(server.tool as any)(
		"figma_set_slide_transition",
		"Set the transition effect for a slide",
		{
			slideId: z.string(),
			style: z.enum([
				"DISSOLVE",
				"SLIDE_FROM_LEFT",
				"SLIDE_FROM_RIGHT",
				"PUSH_FROM_LEFT",
				"SMART_ANIMATE",
				"NONE",
			]),
			duration: z.number().optional(),
			curve: z.string().optional(),
		},
		async (params: { slideId: string; style: string; duration?: number; curve?: string }) => {
			const result = await bridge.sendCommand("FIGMA_SET_SLIDE_TRANSITION", params);
			return textResult(result);
		},
	);
}

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { FigmaClient } from "../figma/rest-api.js";

function textResult(data: unknown) {
	return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
}

export function registerVisualTools(server: McpServer, client: FigmaClient): void {
	// 1. figma_get_file_info
	server.tool(
		"figma_get_file_info",
		"Get file metadata (name, last modified, pages, thumbnail)",
		{ fileKey: z.string() },
		{ annotations: { readOnlyHint: true } },
		async ({ fileKey }) => {
			const file = await client.getFile(fileKey, { depth: 1 });

			const result = {
				name: file.name,
				lastModified: file.lastModified,
				editorType: file.editorType,
				thumbnailUrl: file.thumbnailUrl,
				version: file.version,
				pages: (file.document.children ?? []).map((child) => ({
					id: child.id,
					name: child.name,
				})),
			};

			return textResult(result);
		},
	);

	// 2. figma_get_node
	server.tool(
		"figma_get_node",
		"Get specific nodes by ID with full properties",
		{
			fileKey: z.string(),
			nodeIds: z.array(z.string()),
			depth: z.number().optional(),
		},
		{ annotations: { readOnlyHint: true } },
		async ({ fileKey, nodeIds, depth }) => {
			const params = depth !== undefined ? { depth } : undefined;
			const response = await client.getNodes(fileKey, nodeIds, params);
			return textResult(response.nodes);
		},
	);

	// 3. figma_export_image
	server.tool(
		"figma_export_image",
		"Render nodes as images",
		{
			fileKey: z.string(),
			nodeIds: z.array(z.string()),
			format: z.enum(["png", "svg", "jpg", "pdf"]).optional(),
			scale: z.number().min(0.01).max(4).optional(),
		},
		{ annotations: { readOnlyHint: true } },
		async ({ fileKey, nodeIds, format, scale }) => {
			const response = await client.getImages(fileKey, nodeIds, { format, scale });
			return textResult(response.images);
		},
	);
}

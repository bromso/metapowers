import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { FigmaClient } from "../figma/rest-api.js";
import {
	exportVariablesToCSS,
	exportVariablesToJSON,
	exportVariablesToTailwind,
} from "../utils/export.js";

function textResult(data: unknown) {
	return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
}

export function registerDesignSystemTools(server: McpServer, client: FigmaClient): void {
	// 1. figma_get_design_system
	(server.tool as any)(
		"figma_get_design_system",
		"Fetches file structure, components, styles, and variables for a Figma design system",
		{ fileKey: z.string(), depth: z.number().optional() },
		{ readOnlyHint: true },
		async ({ fileKey, depth }: { fileKey: string; depth?: number }) => {
			const params = depth !== undefined ? { depth } : undefined;
			const [fileResult, variablesResult] = await Promise.allSettled([
				client.getFile(fileKey, params),
				client.getVariables(fileKey),
			]);

			const file = fileResult.status === "fulfilled" ? fileResult.value : null;
			const variables = variablesResult.status === "fulfilled" ? variablesResult.value : null;

			const result = {
				file: file
					? {
							name: file.name,
							lastModified: file.lastModified,
							components: file.components,
							componentSets: file.componentSets,
							styles: file.styles,
						}
					: null,
				variables: variables?.meta ?? null,
				variablesError:
					variablesResult.status === "rejected" ? "Variables API requires Enterprise plan" : null,
			};

			return textResult(result);
		},
	);

	// 2. figma_get_variables
	(server.tool as any)(
		"figma_get_variables",
		"Fetches design token variables, optionally exporting to CSS, Tailwind, or JSON format",
		{
			fileKey: z.string(),
			exportFormat: z.enum(["raw", "css", "tailwind", "json"]).optional(),
		},
		{ readOnlyHint: true },
		async ({
			fileKey,
			exportFormat,
		}: { fileKey: string; exportFormat?: "raw" | "css" | "tailwind" | "json" }) => {
			const response = await client.getVariables(fileKey);
			const { variables, variableCollections } = response.meta;

			if (!exportFormat || exportFormat === "raw") {
				return textResult(response.meta);
			}

			if (exportFormat === "css") {
				return textResult({ css: exportVariablesToCSS(variables, variableCollections) });
			}

			if (exportFormat === "tailwind") {
				return textResult({ tailwind: exportVariablesToTailwind(variables, variableCollections) });
			}

			return textResult({ json: exportVariablesToJSON(variables, variableCollections) });
		},
	);

	// 3. figma_get_styles
	(server.tool as any)(
		"figma_get_styles",
		"Fetches published styles from a Figma file",
		{ fileKey: z.string() },
		{ readOnlyHint: true },
		async ({ fileKey }: { fileKey: string }) => {
			const response = await client.getStyles(fileKey);
			return textResult(response.meta.styles);
		},
	);

	// 4. figma_get_component
	(server.tool as any)(
		"figma_get_component",
		"Fetches a single component's node tree from a Figma file",
		{ fileKey: z.string(), nodeId: z.string() },
		{ readOnlyHint: true },
		async ({ fileKey, nodeId }: { fileKey: string; nodeId: string }) => {
			const response = await client.getNodes(fileKey, [nodeId]);
			return textResult(response.nodes);
		},
	);

	// 5. figma_get_component_image
	(server.tool as any)(
		"figma_get_component_image",
		"Exports a component as an image in the specified format",
		{
			fileKey: z.string(),
			nodeId: z.string(),
			format: z.enum(["png", "svg", "jpg", "pdf"]).optional(),
			scale: z.number().min(0.01).max(4).optional(),
		},
		{ readOnlyHint: true },
		async ({
			fileKey,
			nodeId,
			format,
			scale,
		}: { fileKey: string; nodeId: string; format?: string; scale?: number }) => {
			const response = await client.getImages(fileKey, [nodeId], { format, scale });
			return textResult(response);
		},
	);

	// 6. figma_get_component_for_dev
	(server.tool as any)(
		"figma_get_component_for_dev",
		"Fetches a component's node tree and image in parallel for developer handoff",
		{
			fileKey: z.string(),
			nodeId: z.string(),
			imageFormat: z.enum(["png", "svg"]).optional(),
		},
		{ readOnlyHint: true },
		async ({
			fileKey,
			nodeId,
			imageFormat,
		}: { fileKey: string; nodeId: string; imageFormat?: string }) => {
			const [nodesResult, imageResult] = await Promise.all([
				client.getNodes(fileKey, [nodeId]),
				client.getImages(fileKey, [nodeId], { format: imageFormat }),
			]);

			return textResult({
				nodes: nodesResult.nodes,
				image: imageResult.images[nodeId] ?? null,
			});
		},
	);

	// 7. figma_get_design_system_summary
	(server.tool as any)(
		"figma_get_design_system_summary",
		"Returns a summary with counts of components, styles, and pages",
		{ fileKey: z.string() },
		{ readOnlyHint: true },
		async ({ fileKey }: { fileKey: string }) => {
			const file = await client.getFile(fileKey, { depth: 1 });

			const summary = {
				name: file.name,
				lastModified: file.lastModified,
				components: Object.keys(file.components).length,
				componentSets: Object.keys(file.componentSets).length,
				styles: Object.keys(file.styles).length,
				pages: file.document.children?.length ?? 0,
			};

			return textResult(summary);
		},
	);

	// 8. figma_get_components
	(server.tool as any)(
		"figma_get_components",
		"Lists all published components in a Figma file",
		{ fileKey: z.string() },
		{ readOnlyHint: true },
		async ({ fileKey }: { fileKey: string }) => {
			const response = await client.getComponents(fileKey);
			return textResult(response.meta.components);
		},
	);
}

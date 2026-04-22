import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { FigmaBridge } from "../figma/bridge.js";
import { contrastRatio, meetsAA, meetsAAA, simulateColorBlindness } from "../utils/wcag.js";

function textResult(data: unknown) {
	return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
}

export function registerAccessibilityTools(server: McpServer, bridge: FigmaBridge): void {
	// 1. figma_a11y_lint
	(server.tool as any)(
		"figma_a11y_lint",
		"Run WCAG accessibility checks on a node or frame. Checks text size, touch targets, and image alt text.",
		{
			nodeId: z.string().optional(),
		},
		async (params: { nodeId?: string }) => {
			const result = await bridge.sendCommand("FIGMA_A11Y_LINT", params);
			return textResult(result);
		},
	);

	// 2. figma_a11y_scorecard
	(server.tool as any)(
		"figma_a11y_scorecard",
		"Generate an accessibility scorecard for a component or page.",
		{
			nodeId: z.string().optional(),
		},
		async (params: { nodeId?: string }) => {
			const result = await bridge.sendCommand("FIGMA_A11Y_SCORECARD", params);
			return textResult(result);
		},
	);

	// 3. figma_a11y_color_blind_sim
	(server.tool as any)(
		"figma_a11y_color_blind_sim",
		"Simulate color blindness for a pair of colors and compute contrast ratio under simulation.",
		{
			foreground: z.object({ r: z.number(), g: z.number(), b: z.number() }),
			background: z.object({ r: z.number(), g: z.number(), b: z.number() }),
			type: z.enum(["protanopia", "deuteranopia", "tritanopia"]),
		},
		async (params: {
			foreground: { r: number; g: number; b: number };
			background: { r: number; g: number; b: number };
			type: "protanopia" | "deuteranopia" | "tritanopia";
		}) => {
			const simFg = simulateColorBlindness(params.foreground, params.type);
			const simBg = simulateColorBlindness(params.background, params.type);
			const ratio = contrastRatio(simFg, simBg);
			return textResult({
				simulationType: params.type,
				simulatedForeground: simFg,
				simulatedBackground: simBg,
				contrastRatio: ratio,
				meetsAA: ratio >= 4.5,
				meetsAAA: ratio >= 7,
			});
		},
	);

	// 4. figma_a11y_contrast_check
	(server.tool as any)(
		"figma_a11y_contrast_check",
		"Check a foreground/background color pair against WCAG AA and AAA contrast requirements.",
		{
			foreground: z.object({ r: z.number(), g: z.number(), b: z.number() }),
			background: z.object({ r: z.number(), g: z.number(), b: z.number() }),
			size: z.enum(["normal", "large"]).optional(),
		},
		async (params: {
			foreground: { r: number; g: number; b: number };
			background: { r: number; g: number; b: number };
			size?: "normal" | "large";
		}) => {
			const size = params.size || "normal";
			const ratio = contrastRatio(params.foreground, params.background);
			return textResult({
				contrastRatio: ratio,
				size,
				meetsAA: meetsAA(params.foreground, params.background, size),
				meetsAAA: meetsAAA(params.foreground, params.background, size),
			});
		},
	);

	// 5. figma_a11y_focus_order
	(server.tool as any)(
		"figma_a11y_focus_order",
		"Validate tab/focus order of interactive elements in a node or page.",
		{
			nodeId: z.string().optional(),
		},
		async (params: { nodeId?: string }) => {
			const result = await bridge.sendCommand("FIGMA_A11Y_GET_FOCUS_ORDER", params);
			return textResult(result);
		},
	);
}

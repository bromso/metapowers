# Figma MCP Server — Milestone 1 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build the foundation of `@metapowers/figma-mcp` — an MCP server that exposes Figma REST API read operations as tools for Claude Code.

**Architecture:** TypeScript MCP server using `@modelcontextprotocol/sdk` with stdio transport. A `FigmaClient` class wraps the Figma REST API. Tools are organized by capability group and registered on the server. All read-only in M1.

**Tech Stack:** TypeScript, `@modelcontextprotocol/sdk`, `zod`, Vitest, Figma REST API

---

### Task 1: Scaffold the package

**Files:**
- Create: `packages/figma-mcp/package.json`
- Create: `packages/figma-mcp/tsconfig.json`
- Create: `packages/figma-mcp/vitest.config.ts`

**Step 1: Create `packages/figma-mcp/package.json`**

```json
{
	"name": "@metapowers/figma-mcp",
	"version": "0.1.0",
	"private": true,
	"type": "module",
	"main": "dist/index.js",
	"types": "dist/index.d.ts",
	"bin": {
		"metapowers-figma-mcp": "dist/index.js"
	},
	"scripts": {
		"build": "tsc",
		"test": "vitest run",
		"test:watch": "vitest",
		"start": "node dist/index.js"
	},
	"dependencies": {
		"@modelcontextprotocol/sdk": "^1.0.0",
		"zod": "^3.23.0"
	},
	"devDependencies": {
		"@types/node": "^22.0.0",
		"vitest": "^3.0.0"
	}
}
```

**Step 2: Create `packages/figma-mcp/tsconfig.json`**

```json
{
	"extends": "../../tsconfig.base.json",
	"compilerOptions": {
		"outDir": "dist",
		"rootDir": "src"
	},
	"include": ["src"],
	"exclude": ["src/**/*.test.ts"]
}
```

**Step 3: Create `packages/figma-mcp/vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		include: ["src/**/*.test.ts"],
	},
});
```

**Step 4: Install dependencies**

```bash
cd /Users/jonasbroms/Sites/metapowers && bun install
```

**Step 5: Commit**

```bash
git add packages/figma-mcp/package.json packages/figma-mcp/tsconfig.json packages/figma-mcp/vitest.config.ts bun.lock
git commit -m "feat(figma-mcp): scaffold package with MCP SDK and Vitest"
```

---

### Task 2: Figma REST API client

**Files:**
- Create: `packages/figma-mcp/src/figma/rest-api.ts`
- Create: `packages/figma-mcp/src/figma/rest-api.test.ts`

**Step 1: Write the failing test**

```ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { FigmaClient } from "./rest-api.js";

describe("FigmaClient", () => {
	let client: FigmaClient;

	beforeEach(() => {
		client = new FigmaClient("test-token");
	});

	it("throws if no token provided", () => {
		expect(() => new FigmaClient("")).toThrow("FIGMA_ACCESS_TOKEN is required");
	});

	it("sends correct auth header", async () => {
		const mockFetch = vi.fn().mockResolvedValue({
			ok: true,
			json: () => Promise.resolve({ name: "Test File" }),
		});
		vi.stubGlobal("fetch", mockFetch);

		await client.getFile("abc123");

		expect(mockFetch).toHaveBeenCalledWith(
			"https://api.figma.com/v1/files/abc123",
			expect.objectContaining({
				headers: { "X-Figma-Token": "test-token" },
			}),
		);

		vi.unstubAllGlobals();
	});

	it("throws on API error response", async () => {
		const mockFetch = vi.fn().mockResolvedValue({
			ok: false,
			status: 403,
			statusText: "Forbidden",
		});
		vi.stubGlobal("fetch", mockFetch);

		await expect(client.getFile("abc123")).rejects.toThrow("Figma API error: 403 Forbidden");

		vi.unstubAllGlobals();
	});

	it("getFile passes query params", async () => {
		const mockFetch = vi.fn().mockResolvedValue({
			ok: true,
			json: () => Promise.resolve({ name: "Test" }),
		});
		vi.stubGlobal("fetch", mockFetch);

		await client.getFile("abc123", { depth: 2, ids: "1:2,3:4" });

		expect(mockFetch).toHaveBeenCalledWith(
			"https://api.figma.com/v1/files/abc123?depth=2&ids=1%3A2%2C3%3A4",
			expect.anything(),
		);

		vi.unstubAllGlobals();
	});

	it("getNodes fetches specific nodes", async () => {
		const mockFetch = vi.fn().mockResolvedValue({
			ok: true,
			json: () => Promise.resolve({ nodes: {} }),
		});
		vi.stubGlobal("fetch", mockFetch);

		await client.getNodes("abc123", ["1:2", "3:4"]);

		expect(mockFetch).toHaveBeenCalledWith(
			"https://api.figma.com/v1/files/abc123/nodes?ids=1%3A2%2C3%3A4",
			expect.anything(),
		);

		vi.unstubAllGlobals();
	});

	it("getImages exports nodes as images", async () => {
		const mockFetch = vi.fn().mockResolvedValue({
			ok: true,
			json: () => Promise.resolve({ images: { "1:2": "https://example.com/img.png" } }),
		});
		vi.stubGlobal("fetch", mockFetch);

		const result = await client.getImages("abc123", ["1:2"], { format: "svg", scale: 2 });

		expect(mockFetch).toHaveBeenCalledWith(
			expect.stringContaining("/v1/images/abc123"),
			expect.anything(),
		);
		expect(result.images["1:2"]).toBe("https://example.com/img.png");

		vi.unstubAllGlobals();
	});

	it("getVariables fetches local variables", async () => {
		const mockFetch = vi.fn().mockResolvedValue({
			ok: true,
			json: () => Promise.resolve({ meta: { variables: {}, variableCollections: {} } }),
		});
		vi.stubGlobal("fetch", mockFetch);

		await client.getVariables("abc123");

		expect(mockFetch).toHaveBeenCalledWith(
			"https://api.figma.com/v1/files/abc123/variables/local",
			expect.anything(),
		);

		vi.unstubAllGlobals();
	});

	it("getStyles fetches published styles", async () => {
		const mockFetch = vi.fn().mockResolvedValue({
			ok: true,
			json: () => Promise.resolve({ meta: { styles: [] } }),
		});
		vi.stubGlobal("fetch", mockFetch);

		await client.getStyles("abc123");

		expect(mockFetch).toHaveBeenCalledWith(
			"https://api.figma.com/v1/files/abc123/styles",
			expect.anything(),
		);

		vi.unstubAllGlobals();
	});

	it("getComponents fetches published components", async () => {
		const mockFetch = vi.fn().mockResolvedValue({
			ok: true,
			json: () => Promise.resolve({ meta: { components: [] } }),
		});
		vi.stubGlobal("fetch", mockFetch);

		await client.getComponents("abc123");

		expect(mockFetch).toHaveBeenCalledWith(
			"https://api.figma.com/v1/files/abc123/components",
			expect.anything(),
		);

		vi.unstubAllGlobals();
	});
});
```

**Step 2: Run test to verify it fails**

```bash
cd packages/figma-mcp && bun vitest run
```

Expected: FAIL — module not found

**Step 3: Write the implementation**

```ts
const BASE_URL = "https://api.figma.com";

export class FigmaClient {
	private token: string;

	constructor(token: string) {
		if (!token) {
			throw new Error("FIGMA_ACCESS_TOKEN is required");
		}
		this.token = token;
	}

	private async request<T>(path: string, params?: Record<string, string | number>): Promise<T> {
		const url = new URL(`${BASE_URL}${path}`);
		if (params) {
			for (const [key, value] of Object.entries(params)) {
				if (value !== undefined) {
					url.searchParams.set(key, String(value));
				}
			}
		}

		const response = await fetch(url.toString(), {
			headers: { "X-Figma-Token": this.token },
		});

		if (!response.ok) {
			throw new Error(`Figma API error: ${response.status} ${response.statusText}`);
		}

		return response.json() as Promise<T>;
	}

	async getFile(fileKey: string, params?: { depth?: number; ids?: string }): Promise<FigmaFileResponse> {
		return this.request<FigmaFileResponse>(
			`/v1/files/${fileKey}`,
			params as Record<string, string | number>,
		);
	}

	async getNodes(fileKey: string, nodeIds: string[], params?: { depth?: number }): Promise<FigmaNodesResponse> {
		return this.request<FigmaNodesResponse>(`/v1/files/${fileKey}/nodes`, {
			ids: nodeIds.join(","),
			...params,
		});
	}

	async getImages(
		fileKey: string,
		nodeIds: string[],
		options?: { format?: "png" | "svg" | "jpg" | "pdf"; scale?: number },
	): Promise<FigmaImagesResponse> {
		return this.request<FigmaImagesResponse>(`/v1/images/${fileKey}`, {
			ids: nodeIds.join(","),
			...options,
		});
	}

	async getVariables(fileKey: string): Promise<FigmaVariablesResponse> {
		return this.request<FigmaVariablesResponse>(`/v1/files/${fileKey}/variables/local`);
	}

	async getStyles(fileKey: string): Promise<FigmaStylesResponse> {
		return this.request<FigmaStylesResponse>(`/v1/files/${fileKey}/styles`);
	}

	async getComponents(fileKey: string): Promise<FigmaComponentsResponse> {
		return this.request<FigmaComponentsResponse>(`/v1/files/${fileKey}/components`);
	}
}

// --- Response types ---

export interface FigmaFileResponse {
	name: string;
	lastModified: string;
	editorType: string;
	thumbnailUrl: string;
	version: string;
	document: FigmaNode;
	components: Record<string, FigmaComponentMeta>;
	componentSets: Record<string, FigmaComponentMeta>;
	styles: Record<string, FigmaStyleMeta>;
}

export interface FigmaNode {
	id: string;
	name: string;
	type: string;
	children?: FigmaNode[];
	[key: string]: unknown;
}

export interface FigmaComponentMeta {
	key: string;
	name: string;
	description: string;
}

export interface FigmaStyleMeta {
	key: string;
	name: string;
	styleType: "FILL" | "TEXT" | "EFFECT" | "GRID";
	description: string;
}

export interface FigmaNodesResponse {
	name: string;
	nodes: Record<string, { document: FigmaNode; components: Record<string, FigmaComponentMeta>; styles: Record<string, FigmaStyleMeta> }>;
}

export interface FigmaImagesResponse {
	err: string | null;
	images: Record<string, string>;
}

export interface FigmaVariable {
	id: string;
	name: string;
	key: string;
	variableCollectionId: string;
	resolvedType: "BOOLEAN" | "FLOAT" | "STRING" | "COLOR";
	valuesByMode: Record<string, unknown>;
	description: string;
}

export interface FigmaVariableCollection {
	id: string;
	name: string;
	key: string;
	modes: Array<{ modeId: string; name: string }>;
	defaultModeId: string;
	variableIds: string[];
}

export interface FigmaVariablesResponse {
	meta: {
		variables: Record<string, FigmaVariable>;
		variableCollections: Record<string, FigmaVariableCollection>;
	};
}

export interface FigmaPublishedStyle {
	key: string;
	file_key: string;
	node_id: string;
	style_type: "FILL" | "TEXT" | "EFFECT" | "GRID";
	name: string;
	description: string;
}

export interface FigmaStylesResponse {
	meta: { styles: FigmaPublishedStyle[] };
}

export interface FigmaPublishedComponent {
	key: string;
	file_key: string;
	node_id: string;
	name: string;
	description: string;
	containing_frame: { name: string; nodeId: string; pageName: string };
}

export interface FigmaComponentsResponse {
	meta: { components: FigmaPublishedComponent[] };
}
```

**Step 4: Run tests**

```bash
cd packages/figma-mcp && bun vitest run
```

Expected: All 8 tests pass

**Step 5: Commit**

```bash
git add packages/figma-mcp/src/figma/
git commit -m "feat(figma-mcp): add Figma REST API client with tests"
```

---

### Task 3: MCP server foundation + entry point

**Files:**
- Create: `packages/figma-mcp/src/server.ts`
- Create: `packages/figma-mcp/src/server.test.ts`
- Create: `packages/figma-mcp/src/index.ts`

**Step 1: Write the failing test**

```ts
import { describe, it, expect } from "vitest";
import { createFigmaServer } from "./server.js";

describe("createFigmaServer", () => {
	it("creates server with correct name and version", () => {
		const server = createFigmaServer("test-token");
		expect(server).toBeDefined();
	});
});
```

**Step 2: Run test to verify it fails**

```bash
cd packages/figma-mcp && bun vitest run
```

**Step 3: Write `packages/figma-mcp/src/server.ts`**

```ts
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
```

**Step 4: Write `packages/figma-mcp/src/index.ts`**

```ts
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
```

**Step 5: Commit** (test will pass once tool files exist — created in next tasks)

```bash
git add packages/figma-mcp/src/server.ts packages/figma-mcp/src/server.test.ts packages/figma-mcp/src/index.ts
git commit -m "feat(figma-mcp): add MCP server foundation and stdio entry point"
```

---

### Task 4: Design system tools

**Files:**
- Create: `packages/figma-mcp/src/tools/design-system.ts`
- Create: `packages/figma-mcp/src/tools/design-system.test.ts`
- Create: `packages/figma-mcp/src/utils/export.ts`
- Create: `packages/figma-mcp/src/utils/export.test.ts`

**Step 1: Write the export utility tests**

```ts
import { describe, it, expect } from "vitest";
import { exportVariablesToCSS, exportVariablesToTailwind, exportVariablesToJSON } from "./export.js";
import type { FigmaVariable, FigmaVariableCollection } from "../figma/rest-api.js";

const mockVariables: Record<string, FigmaVariable> = {
	"var1": {
		id: "var1",
		name: "colors/primary",
		key: "k1",
		variableCollectionId: "col1",
		resolvedType: "COLOR",
		valuesByMode: { "mode1": { r: 0.2, g: 0.4, b: 0.9, a: 1 } },
		description: "Primary color",
	},
	"var2": {
		id: "var2",
		name: "spacing/sm",
		key: "k2",
		variableCollectionId: "col1",
		resolvedType: "FLOAT",
		valuesByMode: { "mode1": 8 },
		description: "Small spacing",
	},
};

const mockCollections: Record<string, FigmaVariableCollection> = {
	"col1": {
		id: "col1",
		name: "Tokens",
		key: "ck1",
		modes: [{ modeId: "mode1", name: "Default" }],
		defaultModeId: "mode1",
		variableIds: ["var1", "var2"],
	},
};

describe("exportVariablesToCSS", () => {
	it("converts variables to CSS custom properties", () => {
		const css = exportVariablesToCSS(mockVariables, mockCollections);
		expect(css).toContain("--colors-primary:");
		expect(css).toContain("--spacing-sm: 8");
		expect(css).toContain(":root {");
	});
});

describe("exportVariablesToTailwind", () => {
	it("converts variables to Tailwind config object", () => {
		const config = exportVariablesToTailwind(mockVariables, mockCollections);
		expect(config.colors).toBeDefined();
		expect(config.spacing).toBeDefined();
	});
});

describe("exportVariablesToJSON", () => {
	it("returns structured JSON", () => {
		const json = exportVariablesToJSON(mockVariables, mockCollections);
		expect(json).toHaveProperty("collections");
		expect(json.collections[0].name).toBe("Tokens");
	});
});
```

**Step 2: Write `packages/figma-mcp/src/utils/export.ts`**

```ts
import type { FigmaVariable, FigmaVariableCollection } from "../figma/rest-api.js";

function variableNameToCSS(name: string): string {
	return name.replace(/\//g, "-").toLowerCase();
}

function colorToRGBA(color: { r: number; g: number; b: number; a: number }): string {
	const r = Math.round(color.r * 255);
	const g = Math.round(color.g * 255);
	const b = Math.round(color.b * 255);
	if (color.a === 1) {
		return `rgb(${r}, ${g}, ${b})`;
	}
	return `rgba(${r}, ${g}, ${b}, ${color.a})`;
}

function resolveValue(variable: FigmaVariable, modeId: string): string {
	const value = variable.valuesByMode[modeId];
	if (variable.resolvedType === "COLOR" && typeof value === "object" && value !== null) {
		return colorToRGBA(value as { r: number; g: number; b: number; a: number });
	}
	return String(value);
}

export function exportVariablesToCSS(
	variables: Record<string, FigmaVariable>,
	collections: Record<string, FigmaVariableCollection>,
): string {
	const lines: string[] = [":root {"];

	for (const collection of Object.values(collections)) {
		const modeId = collection.defaultModeId;
		lines.push(`\t/* ${collection.name} */`);

		for (const varId of collection.variableIds) {
			const variable = variables[varId];
			if (!variable) continue;
			const cssName = variableNameToCSS(variable.name);
			const value = resolveValue(variable, modeId);
			lines.push(`\t--${cssName}: ${value};`);
		}
	}

	lines.push("}");
	return lines.join("\n");
}

export function exportVariablesToTailwind(
	variables: Record<string, FigmaVariable>,
	collections: Record<string, FigmaVariableCollection>,
): Record<string, Record<string, string>> {
	const result: Record<string, Record<string, string>> = {};

	for (const collection of Object.values(collections)) {
		const modeId = collection.defaultModeId;

		for (const varId of collection.variableIds) {
			const variable = variables[varId];
			if (!variable) continue;

			const parts = variable.name.split("/");
			const category = parts[0].toLowerCase();
			const name = parts.slice(1).join("-").toLowerCase() || "DEFAULT";

			result[category] ??= {};
			result[category][name] = resolveValue(variable, modeId);
		}
	}

	return result;
}

export function exportVariablesToJSON(
	variables: Record<string, FigmaVariable>,
	collections: Record<string, FigmaVariableCollection>,
): { collections: Array<{ name: string; modes: string[]; variables: Array<{ name: string; type: string; values: Record<string, unknown> }> }> } {
	return {
		collections: Object.values(collections).map((collection) => ({
			name: collection.name,
			modes: collection.modes.map((m) => m.name),
			variables: collection.variableIds
				.map((varId) => variables[varId])
				.filter(Boolean)
				.map((v) => ({
					name: v.name,
					type: v.resolvedType,
					values: Object.fromEntries(
						collection.modes.map((mode) => [mode.name, v.valuesByMode[mode.modeId]]),
					),
				})),
		})),
	};
}
```

**Step 3: Write the design system tools test**

```ts
import { describe, it, expect } from "vitest";
import { registerDesignSystemTools } from "./design-system.js";

describe("registerDesignSystemTools", () => {
	it("is a function", () => {
		expect(typeof registerDesignSystemTools).toBe("function");
	});
});
```

**Step 4: Write `packages/figma-mcp/src/tools/design-system.ts`**

```ts
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { FigmaClient } from "../figma/rest-api.js";
import { exportVariablesToCSS, exportVariablesToTailwind, exportVariablesToJSON } from "../utils/export.js";

export function registerDesignSystemTools(server: McpServer, client: FigmaClient): void {
	server.registerTool(
		"figma_get_design_system",
		{
			title: "Get Design System",
			description: "Fetch the full design system from a Figma file — tokens, styles, and components in one call.",
			inputSchema: z.object({
				fileKey: z.string().describe("The Figma file key (from the URL)"),
				depth: z.number().optional().describe("Tree traversal depth (default: 1 for top-level only)"),
			}),
			annotations: { readOnlyHint: true },
		},
		async ({ fileKey, depth }) => {
			const [file, variables] = await Promise.allSettled([
				client.getFile(fileKey, { depth: depth ?? 1 }),
				client.getVariables(fileKey),
			]);

			const result: Record<string, unknown> = {};

			if (file.status === "fulfilled") {
				result.name = file.value.name;
				result.lastModified = file.value.lastModified;
				result.components = file.value.components;
				result.componentSets = file.value.componentSets;
				result.styles = file.value.styles;
			} else {
				result.fileError = file.reason instanceof Error ? file.reason.message : String(file.reason);
			}

			if (variables.status === "fulfilled") {
				result.variables = variables.value.meta.variables;
				result.variableCollections = variables.value.meta.variableCollections;
			} else {
				result.variablesNote = "Variables endpoint requires Enterprise plan or file_variables:read scope";
			}

			return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
		},
	);

	server.registerTool(
		"figma_get_variables",
		{
			title: "Get Variables",
			description: "Fetch design tokens/variables from a Figma file. Optionally export to CSS, Tailwind, Sass, or JSON format.",
			inputSchema: z.object({
				fileKey: z.string().describe("The Figma file key"),
				exportFormat: z.enum(["raw", "css", "tailwind", "json"]).optional().describe("Export format (default: raw)"),
			}),
			annotations: { readOnlyHint: true },
		},
		async ({ fileKey, exportFormat }) => {
			const response = await client.getVariables(fileKey);
			const { variables, variableCollections } = response.meta;

			if (!exportFormat || exportFormat === "raw") {
				return { content: [{ type: "text", text: JSON.stringify(response.meta, null, 2) }] };
			}

			let output: string;
			if (exportFormat === "css") {
				output = exportVariablesToCSS(variables, variableCollections);
			} else if (exportFormat === "tailwind") {
				output = JSON.stringify(exportVariablesToTailwind(variables, variableCollections), null, 2);
			} else {
				output = JSON.stringify(exportVariablesToJSON(variables, variableCollections), null, 2);
			}

			return { content: [{ type: "text", text: output }] };
		},
	);

	server.registerTool(
		"figma_get_styles",
		{
			title: "Get Styles",
			description: "Fetch published color, text, and effect styles from a Figma file.",
			inputSchema: z.object({
				fileKey: z.string().describe("The Figma file key"),
			}),
			annotations: { readOnlyHint: true },
		},
		async ({ fileKey }) => {
			const response = await client.getStyles(fileKey);
			return { content: [{ type: "text", text: JSON.stringify(response.meta.styles, null, 2) }] };
		},
	);

	server.registerTool(
		"figma_get_component",
		{
			title: "Get Component",
			description: "Fetch a specific component's full node tree and metadata from a Figma file.",
			inputSchema: z.object({
				fileKey: z.string().describe("The Figma file key"),
				nodeId: z.string().describe("The component's node ID (e.g., '10:5')"),
			}),
			annotations: { readOnlyHint: true },
		},
		async ({ fileKey, nodeId }) => {
			const response = await client.getNodes(fileKey, [nodeId]);
			const node = response.nodes[nodeId];
			if (!node) {
				return { content: [{ type: "text", text: `Node ${nodeId} not found` }], isError: true };
			}
			return { content: [{ type: "text", text: JSON.stringify(node, null, 2) }] };
		},
	);

	server.registerTool(
		"figma_get_component_image",
		{
			title: "Get Component Image",
			description: "Export a component or node as an image (PNG, SVG, JPG, or PDF).",
			inputSchema: z.object({
				fileKey: z.string().describe("The Figma file key"),
				nodeId: z.string().describe("The node ID to export"),
				format: z.enum(["png", "svg", "jpg", "pdf"]).optional().describe("Image format (default: png)"),
				scale: z.number().min(0.01).max(4).optional().describe("Scale factor (default: 1)"),
			}),
			annotations: { readOnlyHint: true },
		},
		async ({ fileKey, nodeId, format, scale }) => {
			const response = await client.getImages(fileKey, [nodeId], { format, scale });
			const imageUrl = response.images[nodeId];
			if (!imageUrl) {
				return { content: [{ type: "text", text: `Failed to export node ${nodeId}` }], isError: true };
			}
			return { content: [{ type: "text", text: imageUrl }] };
		},
	);

	server.registerTool(
		"figma_get_component_for_dev",
		{
			title: "Get Component for Development",
			description: "Get a component's node tree plus a visual render — everything a developer needs to implement it.",
			inputSchema: z.object({
				fileKey: z.string().describe("The Figma file key"),
				nodeId: z.string().describe("The component's node ID"),
				imageFormat: z.enum(["png", "svg"]).optional().describe("Image format (default: png)"),
			}),
			annotations: { readOnlyHint: true },
		},
		async ({ fileKey, nodeId, imageFormat }) => {
			const [nodeResponse, imageResponse] = await Promise.all([
				client.getNodes(fileKey, [nodeId]),
				client.getImages(fileKey, [nodeId], { format: imageFormat ?? "png", scale: 2 }),
			]);

			const node = nodeResponse.nodes[nodeId];
			const imageUrl = imageResponse.images[nodeId];

			return {
				content: [
					{ type: "text", text: JSON.stringify({ node, imageUrl }, null, 2) },
				],
			};
		},
	);

	server.registerTool(
		"figma_get_design_system_summary",
		{
			title: "Get Design System Summary",
			description: "Get a high-level overview of a Figma file's design system — counts of components, styles, tokens, and pages.",
			inputSchema: z.object({
				fileKey: z.string().describe("The Figma file key"),
			}),
			annotations: { readOnlyHint: true },
		},
		async ({ fileKey }) => {
			const file = await client.getFile(fileKey, { depth: 1 });

			const summary = {
				fileName: file.name,
				lastModified: file.lastModified,
				pages: file.document.children?.map((p) => p.name) ?? [],
				componentCount: Object.keys(file.components).length,
				componentSetCount: Object.keys(file.componentSets).length,
				styleCount: Object.keys(file.styles).length,
				styles: {
					fill: Object.values(file.styles).filter((s) => s.styleType === "FILL").length,
					text: Object.values(file.styles).filter((s) => s.styleType === "TEXT").length,
					effect: Object.values(file.styles).filter((s) => s.styleType === "EFFECT").length,
					grid: Object.values(file.styles).filter((s) => s.styleType === "GRID").length,
				},
			};

			return { content: [{ type: "text", text: JSON.stringify(summary, null, 2) }] };
		},
	);

	server.registerTool(
		"figma_get_components",
		{
			title: "Get All Components",
			description: "List all published components in a Figma file with metadata.",
			inputSchema: z.object({
				fileKey: z.string().describe("The Figma file key"),
			}),
			annotations: { readOnlyHint: true },
		},
		async ({ fileKey }) => {
			const response = await client.getComponents(fileKey);
			return { content: [{ type: "text", text: JSON.stringify(response.meta.components, null, 2) }] };
		},
	);
}
```

**Step 5: Run tests**

```bash
cd packages/figma-mcp && bun vitest run
```

Expected: All tests pass

**Step 6: Commit**

```bash
git add packages/figma-mcp/src/tools/design-system.ts packages/figma-mcp/src/tools/design-system.test.ts packages/figma-mcp/src/utils/export.ts packages/figma-mcp/src/utils/export.test.ts
git commit -m "feat(figma-mcp): add design system tools with token export"
```

---

### Task 5: Visual context tools

**Files:**
- Create: `packages/figma-mcp/src/tools/visual.ts`
- Create: `packages/figma-mcp/src/tools/visual.test.ts`

**Step 1: Write the test**

```ts
import { describe, it, expect } from "vitest";
import { registerVisualTools } from "./visual.js";

describe("registerVisualTools", () => {
	it("is a function", () => {
		expect(typeof registerVisualTools).toBe("function");
	});
});
```

**Step 2: Write `packages/figma-mcp/src/tools/visual.ts`**

```ts
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { FigmaClient } from "../figma/rest-api.js";

export function registerVisualTools(server: McpServer, client: FigmaClient): void {
	server.registerTool(
		"figma_get_file_info",
		{
			title: "Get File Info",
			description: "Get file metadata — name, last modified, pages, thumbnail URL.",
			inputSchema: z.object({
				fileKey: z.string().describe("The Figma file key"),
			}),
			annotations: { readOnlyHint: true },
		},
		async ({ fileKey }) => {
			const file = await client.getFile(fileKey, { depth: 1 });
			const info = {
				name: file.name,
				lastModified: file.lastModified,
				editorType: file.editorType,
				thumbnailUrl: file.thumbnailUrl,
				version: file.version,
				pages: file.document.children?.map((p) => ({ id: p.id, name: p.name })) ?? [],
			};
			return { content: [{ type: "text", text: JSON.stringify(info, null, 2) }] };
		},
	);

	server.registerTool(
		"figma_get_node",
		{
			title: "Get Node",
			description: "Get specific node(s) by ID with full properties.",
			inputSchema: z.object({
				fileKey: z.string().describe("The Figma file key"),
				nodeIds: z.array(z.string()).describe("Node IDs to fetch (e.g., ['1:2', '3:4'])"),
				depth: z.number().optional().describe("Tree depth (default: full)"),
			}),
			annotations: { readOnlyHint: true },
		},
		async ({ fileKey, nodeIds, depth }) => {
			const response = await client.getNodes(fileKey, nodeIds, { depth });
			return { content: [{ type: "text", text: JSON.stringify(response.nodes, null, 2) }] };
		},
	);

	server.registerTool(
		"figma_export_image",
		{
			title: "Export Image",
			description: "Render one or more nodes as images. Returns temporary URLs to the rendered images.",
			inputSchema: z.object({
				fileKey: z.string().describe("The Figma file key"),
				nodeIds: z.array(z.string()).describe("Node IDs to render"),
				format: z.enum(["png", "svg", "jpg", "pdf"]).optional().describe("Image format (default: png)"),
				scale: z.number().min(0.01).max(4).optional().describe("Scale factor (default: 1)"),
			}),
			annotations: { readOnlyHint: true },
		},
		async ({ fileKey, nodeIds, format, scale }) => {
			const response = await client.getImages(fileKey, nodeIds, { format, scale });
			return { content: [{ type: "text", text: JSON.stringify(response.images, null, 2) }] };
		},
	);
}
```

**Step 3: Run tests**

```bash
cd packages/figma-mcp && bun vitest run
```

Expected: All tests pass

**Step 4: Commit**

```bash
git add packages/figma-mcp/src/tools/visual.ts packages/figma-mcp/src/tools/visual.test.ts
git commit -m "feat(figma-mcp): add visual context tools (file info, nodes, image export)"
```

---

### Task 6: Build and verify

**Step 1: Build the package**

```bash
cd packages/figma-mcp && bun run build
```

Expected: Compiles to `dist/` with no errors

**Step 2: Run all tests**

```bash
cd packages/figma-mcp && bun vitest run
```

Expected: All tests pass

**Step 3: Verify the server starts (will fail without token, but should show the error)**

```bash
cd packages/figma-mcp && node dist/index.js 2>&1 || true
```

Expected: "Error: FIGMA_ACCESS_TOKEN environment variable is required"

**Step 4: Build entire monorepo to verify no breakage**

```bash
cd /Users/jonasbroms/Sites/metapowers && bun turbo build
```

Expected: All packages build successfully

**Step 5: Commit any fixes**

```bash
git add -A && git commit -m "fix(figma-mcp): address build issues"
```

---

## Summary

| Task | Description | Commit message |
|------|-------------|----------------|
| 1 | Scaffold package | `feat(figma-mcp): scaffold package with MCP SDK and Vitest` |
| 2 | Figma REST API client | `feat(figma-mcp): add Figma REST API client with tests` |
| 3 | MCP server + entry point | `feat(figma-mcp): add MCP server foundation and stdio entry point` |
| 4 | Design system tools (8) + token export | `feat(figma-mcp): add design system tools with token export` |
| 5 | Visual context tools (3) | `feat(figma-mcp): add visual context tools (file info, nodes, image export)` |
| 6 | Build and verify | (fix commit if needed) |

## What M1 Delivers

An MCP server at `packages/figma-mcp` with **11 read-only tools**:

1. `figma_get_design_system` — full system in one call
2. `figma_get_variables` — tokens with CSS/Tailwind/JSON export
3. `figma_get_styles` — published styles
4. `figma_get_component` — single component node tree
5. `figma_get_component_image` — export as image
6. `figma_get_component_for_dev` — node tree + visual render
7. `figma_get_design_system_summary` — counts and overview
8. `figma_get_components` — list all published components
9. `figma_get_file_info` — file metadata and pages
10. `figma_get_node` — specific nodes by ID
11. `figma_export_image` — batch image export

## What Comes Next

- **M2:** Variable write tools (`figma_create_variable`, `figma_update_variable`) + accessibility tools
- **M3:** 5 design phase skills using the MCP server
- **M4:** Bonus skills (export-tokens, a11y-audit, design-review, system-overview)
- **M5:** Documentation in apps/docs

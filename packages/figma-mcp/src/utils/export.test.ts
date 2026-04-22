import { describe, it, expect } from "vitest";
import { exportVariablesToCSS, exportVariablesToTailwind, exportVariablesToJSON } from "./export.js";
import type { FigmaVariable, FigmaVariableCollection } from "../figma/rest-api.js";

const mockVariables: Record<string, FigmaVariable> = {
	"var1": {
		id: "var1",
		name: "colors/primary",
		key: "k1",
		variableCollectionId: "col1",
		resolvedType: "COLOR" as const,
		valuesByMode: { "mode1": { r: 0.2, g: 0.4, b: 0.9, a: 1 } },
		description: "Primary color",
	},
	"var2": {
		id: "var2",
		name: "spacing/sm",
		key: "k2",
		variableCollectionId: "col1",
		resolvedType: "FLOAT" as const,
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
	it("outputs CSS custom properties with :root", () => {
		const css = exportVariablesToCSS(mockVariables, mockCollections);
		expect(css).toContain(":root {");
		expect(css).toContain("--colors-primary:");
		expect(css).toContain("--spacing-sm: 8");
	});
});

describe("exportVariablesToTailwind", () => {
	it("outputs nested object grouped by first path segment", () => {
		const result = exportVariablesToTailwind(mockVariables, mockCollections);
		expect(result).toHaveProperty("colors");
		expect(result).toHaveProperty("spacing");
	});
});

describe("exportVariablesToJSON", () => {
	it("outputs structured JSON with collections array", () => {
		const result = exportVariablesToJSON(mockVariables, mockCollections);
		expect(result.collections).toBeDefined();
		expect(result.collections[0].name).toBe("Tokens");
	});
});

import type { FigmaVariable, FigmaVariableCollection } from "../figma/rest-api.js";

// ── Helpers ────────────────────────────────────────────────────────

interface FigmaColor {
	r: number;
	g: number;
	b: number;
	a: number;
}

function isColor(value: unknown): value is FigmaColor {
	return (
		typeof value === "object" &&
		value !== null &&
		"r" in value &&
		"g" in value &&
		"b" in value &&
		"a" in value
	);
}

function colorToCSS(color: FigmaColor): string {
	const r = Math.round(color.r * 255);
	const g = Math.round(color.g * 255);
	const b = Math.round(color.b * 255);
	if (color.a < 1) {
		return `rgba(${r}, ${g}, ${b}, ${color.a})`;
	}
	return `rgb(${r}, ${g}, ${b})`;
}

function resolveValue(variable: FigmaVariable, modeId: string): string {
	const value = variable.valuesByMode[modeId];
	if (isColor(value)) {
		return colorToCSS(value);
	}
	return String(value);
}

function variableNameToCSS(name: string): string {
	return name.replace(/\//g, "-");
}

// ── Exports ────────────────────────────────────────────────────────

export function exportVariablesToCSS(
	variables: Record<string, FigmaVariable>,
	collections: Record<string, FigmaVariableCollection>,
): string {
	const lines: string[] = [];

	for (const collection of Object.values(collections)) {
		lines.push(`/* ${collection.name} */`);
		lines.push(":root {");

		const modeId = collection.defaultModeId;

		for (const varId of collection.variableIds) {
			const variable = variables[varId];
			if (!variable) continue;
			const cssName = variableNameToCSS(variable.name);
			const value = resolveValue(variable, modeId);
			lines.push(`\t--${cssName}: ${value};`);
		}

		lines.push("}");
		lines.push("");
	}

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

			const segments = variable.name.split("/");
			const group = segments[0];
			const key = segments.slice(1).join("-");
			const value = resolveValue(variable, modeId);

			if (!result[group]) {
				result[group] = {};
			}
			result[group][key] = value;
		}
	}

	return result;
}

export function exportVariablesToJSON(
	variables: Record<string, FigmaVariable>,
	collections: Record<string, FigmaVariableCollection>,
): { collections: Array<{ name: string; modes: Array<{ name: string; variables: Record<string, unknown> }> }> } {
	const result = {
		collections: Object.values(collections).map((collection) => ({
			name: collection.name,
			modes: collection.modes.map((mode) => ({
				name: mode.name,
				variables: Object.fromEntries(
					collection.variableIds
						.map((varId) => {
							const variable = variables[varId];
							if (!variable) return null;
							return [
								variable.name,
								{
									type: variable.resolvedType,
									value: variable.valuesByMode[mode.modeId],
									description: variable.description,
								},
							];
						})
						.filter((entry) => entry !== null) as Array<[string, { type: string; value: unknown; description: string }]>,
				),
			})),
		})),
	};

	return result;
}

interface RGB {
	r: number;
	g: number;
	b: number;
}

function luminance(color: RGB): number {
	const [rs, gs, bs] = [color.r, color.g, color.b].map((c) => {
		return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
	});
	return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

export function contrastRatio(fg: RGB, bg: RGB): number {
	const l1 = luminance(fg);
	const l2 = luminance(bg);
	const lighter = Math.max(l1, l2);
	const darker = Math.min(l1, l2);
	return (lighter + 0.05) / (darker + 0.05);
}

export function meetsAA(fg: RGB, bg: RGB, size: "normal" | "large"): boolean {
	const ratio = contrastRatio(fg, bg);
	return size === "large" ? ratio >= 3 : ratio >= 4.5;
}

export function meetsAAA(fg: RGB, bg: RGB, size: "normal" | "large"): boolean {
	const ratio = contrastRatio(fg, bg);
	return size === "large" ? ratio >= 4.5 : ratio >= 7;
}

// Simplified color blindness simulation matrices
const matrices: Record<string, number[][]> = {
	protanopia: [
		[0.567, 0.433, 0],
		[0.558, 0.442, 0],
		[0, 0.242, 0.758],
	],
	deuteranopia: [
		[0.625, 0.375, 0],
		[0.7, 0.3, 0],
		[0, 0.3, 0.7],
	],
	tritanopia: [
		[0.95, 0.05, 0],
		[0, 0.433, 0.567],
		[0, 0.475, 0.525],
	],
};

export function simulateColorBlindness(
	color: RGB,
	type: "protanopia" | "deuteranopia" | "tritanopia",
): RGB {
	const m = matrices[type];
	return {
		r: Math.min(1, Math.max(0, m[0][0] * color.r + m[0][1] * color.g + m[0][2] * color.b)),
		g: Math.min(1, Math.max(0, m[1][0] * color.r + m[1][1] * color.g + m[1][2] * color.b)),
		b: Math.min(1, Math.max(0, m[2][0] * color.r + m[2][1] * color.g + m[2][2] * color.b)),
	};
}

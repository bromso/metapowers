import { readFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * Shared pieces of the build-time brand images (`og-image.png/route.tsx`, `apple-touch-icon.png/route.tsx`),
 * rendered by `next/og` during the static export. Colours mirror the `--mp-*` tokens in
 * `app/global.css`; the font is Miranda Sans, the site's own face, as WOFF (Satori reads
 * TTF, OTF and WOFF, not the site's WOFF2; `app/fonts/*.woff` are converted copies).
 */
export const BRAND = {
	ground: "#f8f4ec",
	ink: "#1b1916",
	muted: "#6b655c",
	accent: "#c2432a",
} as const;

/** The Open Graph image's size and alt text (`og-image.png/route.tsx`, `layout.tsx`). */
export const OG_SIZE = { width: 1200, height: 630 };
export const OG_ALT = "singularskills — Your whole production team, as repeatable workflows.";

export async function brandFonts() {
	const font = (weight: 500 | 700) =>
		readFile(join(process.cwd(), "app", "fonts", `miranda-sans-${weight}.woff`));
	return [
		{ name: "Miranda Sans", data: await font(500), weight: 500 as const, style: "normal" as const },
		{ name: "Miranda Sans", data: await font(700), weight: 700 as const, style: "normal" as const },
	];
}

/** The "S" letter mark: a rounded accent square with the letter in the ground colour. */
export function LetterMark({ size }: { size: number }) {
	return (
		<div
			style={{
				width: size,
				height: size,
				borderRadius: size * (7 / 32),
				background: BRAND.accent,
				color: BRAND.ground,
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				fontFamily: "Miranda Sans",
				fontWeight: 700,
				fontSize: size * (19 / 32),
				lineHeight: 1,
			}}
		>
			S
		</div>
	);
}

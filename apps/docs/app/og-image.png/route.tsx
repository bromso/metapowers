import { ImageResponse } from "next/og";
import { BRAND, LetterMark, OG_SIZE, brandFonts } from "../brand-image";

/**
 * The Open Graph / Twitter card image, rendered once at build time into the static export as
 * `out/og-image.png`. A route handler rather than the `opengraph-image.tsx` convention: under
 * `output: "export"` that convention emits an extensionless file and links it without the
 * basePath, so `app/layout.tsx` links this one explicitly instead.
 */
export const dynamic = "force-static";

export async function GET() {
	return new ImageResponse(
		<div
			style={{
				width: "100%",
				height: "100%",
				display: "flex",
				flexDirection: "column",
				justifyContent: "space-between",
				padding: "80px",
				background: BRAND.ground,
				color: BRAND.ink,
				fontFamily: "Miranda Sans",
			}}
		>
			<LetterMark size={56} />
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					fontSize: 71,
					fontWeight: 500,
					lineHeight: 1.08,
					letterSpacing: "-0.02em",
				}}
			>
				<span>Your whole production team,</span>
				<span>as repeatable workflows.</span>
			</div>
			<div style={{ display: "flex", fontSize: 24, fontWeight: 500, color: BRAND.muted }}>
				bromso.github.io/singularskills
			</div>
		</div>,
		{ ...OG_SIZE, fonts: await brandFonts() },
	);
}

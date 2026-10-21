import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";
// Required for `output: "export"` — Next can't infer static params for a generated image route.
export const dynamic = "force-static";

// Literal hex values, not CSS vars — `ImageResponse` renders outside the DOM and
// can't read `app/global.css` custom properties. Mirrors `--mp-accent` and `--mp-ground`
// (light theme) there; keep the two in sync if the palette changes.
const MP_ACCENT = "#c2432a";
const MP_GROUND = "#f8f4ec";

export default async function AppleIcon() {
	const fontData = await readFile(path.join(process.cwd(), "app/fonts/miranda-sans-700.ttf"));

	return new ImageResponse(
		<div
			style={{
				width: "100%",
				height: "100%",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				background: MP_ACCENT,
				borderRadius: 40,
			}}
		>
			<span
				style={{
					fontFamily: "Miranda Sans",
					fontWeight: 700,
					fontSize: 110,
					color: MP_GROUND,
					lineHeight: 1,
				}}
			>
				M
			</span>
		</div>,
		{
			...size,
			fonts: [{ name: "Miranda Sans", data: fontData, weight: 700, style: "normal" }],
		},
	);
}

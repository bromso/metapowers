import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Metapowers — Your whole production team, as repeatable workflows.";
// Required for `output: "export"` — Next can't infer static params for a generated image route.
export const dynamic = "force-static";

// Literal hex values, not CSS vars — `ImageResponse` renders outside the DOM and can't
// read `app/global.css` custom properties. Mirrors `--mp-ground`, `--mp-ink`, `--mp-accent`
// and `--mp-muted` there (light theme); keep the four in sync if the palette changes.
const MP_GROUND = "#f8f4ec";
const MP_INK = "#1b1916";
const MP_ACCENT = "#c2432a";
const MP_MUTED = "#6b655c";

export default async function OpengraphImage() {
	const fontData = await readFile(path.join(process.cwd(), "app/fonts/miranda-sans-500.ttf"));

	return new ImageResponse(
		<div
			style={{
				width: "100%",
				height: "100%",
				display: "flex",
				flexDirection: "column",
				justifyContent: "space-between",
				background: MP_GROUND,
				padding: 80,
			}}
		>
			<div
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					width: 56,
					height: 56,
					borderRadius: 14,
					background: MP_ACCENT,
					color: MP_GROUND,
					fontSize: 32,
					fontWeight: 500,
				}}
			>
				M
			</div>
			<div
				style={{
					display: "flex",
					fontFamily: "Miranda Sans",
					fontWeight: 500,
					fontSize: 72,
					lineHeight: 1.1,
					letterSpacing: "-0.03em",
					color: MP_INK,
					maxWidth: 980,
				}}
			>
				Your whole production team, as repeatable workflows.
			</div>
			<div
				style={{
					display: "flex",
					fontFamily: "Miranda Sans",
					fontWeight: 500,
					fontSize: 24,
					color: MP_MUTED,
				}}
			>
				bromso.github.io/metapowers
			</div>
		</div>,
		{
			...size,
			fonts: [{ name: "Miranda Sans", data: fontData, weight: 500, style: "normal" }],
		},
	);
}

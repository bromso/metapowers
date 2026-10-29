import { ImageResponse } from "next/og";
import { LetterMark, brandFonts } from "../brand-image";

/**
 * The 180×180 Apple touch icon, rendered once at build time into the static export as
 * `out/apple-touch-icon.png` and linked from `app/layout.tsx` (see `og-image.png/route.tsx` for
 * why this is a route handler, not the `apple-icon.tsx` convention).
 */
export const dynamic = "force-static";

export async function GET() {
	return new ImageResponse(<LetterMark size={180} />, {
		width: 180,
		height: 180,
		fonts: await brandFonts(),
	});
}

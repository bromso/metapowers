import { createMDX } from "fumadocs-mdx/next";

// The basePath derivation below is mirrored in `components/search.tsx` (SEARCH_INDEX) and
// `app/layout.tsx` (icon URLs); keep them in sync.
const isProd = process.env.NODE_ENV === "production";

/** @type {import('next').NextConfig} */
const config = {
	reactStrictMode: true,
	output: "export",
	basePath: isProd ? "/singularskills" : "",
	trailingSlash: true,
	images: {
		unoptimized: true,
	},
};

const withMDX = createMDX();

export default withMDX(config);

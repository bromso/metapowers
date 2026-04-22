import { createMDX } from "fumadocs-mdx/next";

const isProd = process.env.NODE_ENV === "production";

/** @type {import('next').NextConfig} */
const config = {
	reactStrictMode: true,
	output: "export",
	basePath: isProd ? "/metapowers" : "",
	trailingSlash: true,
	images: {
		unoptimized: true,
	},
};

const withMDX = createMDX();

export default withMDX(config);

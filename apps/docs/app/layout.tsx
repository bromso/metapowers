import SearchDialog from "@/components/search-lazy";
import { RootProvider } from "fumadocs-ui/provider/next";
import type { Metadata } from "next";
import localFont from "next/font/local";
import type { ReactNode } from "react";
import "./global.css";

/**
 * Miranda Sans is split into two `next/font/local` calls that share one family name, so CSS
 * sees a single four-weight family. Only 400/500 (body text, the hero headline) are
 * preloaded; 600/700 (Fumadocs headings, `font-semibold`) load on demand when first used.
 * The shared name is `mirandaSans` because Turbopack builds `--font-miranda` from the
 * first call's identifier, not from `declarations`. Font loader options must be literals,
 * so the declaration is repeated.
 */
const mirandaSans = localFont({
	src: [
		{ path: "./fonts/miranda-sans-400.woff2", weight: "400", style: "normal" },
		{ path: "./fonts/miranda-sans-500.woff2", weight: "500", style: "normal" },
	],
	declarations: [{ prop: "font-family", value: "mirandaSans" }],
	display: "swap",
	variable: "--font-miranda",
});

const mirandaSansBold = localFont({
	src: [
		{ path: "./fonts/miranda-sans-600.woff2", weight: "600", style: "normal" },
		{ path: "./fonts/miranda-sans-700.woff2", weight: "700", style: "normal" },
	],
	declarations: [{ prop: "font-family", value: "mirandaSans" }],
	display: "swap",
	preload: false,
	adjustFontFallback: false,
	variable: "--font-miranda-bold",
});

const siteUrl = "https://bromso.github.io/metapowers";

export const metadata: Metadata = {
	title: {
		default: "Metapowers — Structured Workflows for AI Coding",
		template: "%s | Metapowers",
	},
	description:
		"283 skills across 16 domains — structured, repeatable workflows for design, research, development, marketing, and more. Works with Claude Code, Codex CLI, OpenCode, and Cursor.",
	metadataBase: new URL(siteUrl),
	openGraph: {
		type: "website",
		locale: "en_US",
		url: siteUrl,
		siteName: "Metapowers",
		title: "Metapowers — Structured Workflows for AI Coding",
		description:
			"283 skills across 16 domains — structured, repeatable workflows for design, research, development, marketing, and more.",
	},
	twitter: {
		card: "summary_large_image",
		title: "Metapowers — Structured Workflows for AI Coding",
		description:
			"283 skills across 16 domains. Works with Claude Code, Codex CLI, OpenCode, and Cursor.",
	},
	icons: {
		// `metadataBase` has no trailing slash, so a relative "/apple-icon.png" would resolve
		// without the "/metapowers" basePath — the literal prefix below is intended. The
		// `apple-icon.tsx` file-convention route omitted the basePath on its generated
		// `<link>` (Next.js bug); this static public/ file + explicit URL sidesteps it, same
		// as the old favicon.svg precedent.
		//
		// Declaring any `icons` entry here disables Next's automatic merge of file-convention
		// icons (see `resolve-metadata.js`: the static-icon merge only runs when
		// `resolvedMetadata.icons` is still unset) — so `icon.svg` has to be repeated here too,
		// or the favicon link disappears from every page entirely. `app/icon.svg` itself still
		// does the actual work; this just re-declares its URL so it keeps getting linked.
		icon: "/metapowers/icon.svg",
		apple: "/metapowers/apple-icon.png",
	},
	other: {
		"npm:package": "create-metapowers",
	},
};

// Static JSON-LD structured data — all values are hardcoded constants, no user input
const structuredData = JSON.stringify([
	{
		"@context": "https://schema.org",
		"@type": "WebSite",
		name: "Metapowers",
		url: siteUrl,
		description:
			"Structured, repeatable workflows for digital production domains. 283 skills across 16 domains.",
		author: {
			"@type": "Person",
			name: "Jonas Broms",
			url: "https://github.com/bromso",
		},
	},
	{
		"@context": "https://schema.org",
		"@type": "SoftwareApplication",
		name: "Metapowers",
		description:
			"Structured, repeatable workflows for digital production domains. 283 skills across 16 domains.",
		url: siteUrl,
		applicationCategory: "DeveloperApplication",
		operatingSystem: "Any",
		license: "https://opensource.org/licenses/MIT",
		author: {
			"@type": "Person",
			name: "Jonas Broms",
			url: "https://github.com/bromso",
		},
		sameAs: [
			"https://github.com/bromso/metapowers",
			"https://www.npmjs.com/package/create-metapowers",
		],
		installUrl: "https://www.npmjs.com/package/create-metapowers",
		offers: {
			"@type": "Offer",
			price: "0",
			priceCurrency: "USD",
		},
		softwareRequirements: "Claude Code, Codex CLI, OpenCode, or Cursor",
	},
]);

export default function Layout({ children }: { children: ReactNode }) {
	return (
		<html
			lang="en"
			className={`${mirandaSans.variable} ${mirandaSansBold.variable}`}
			suppressHydrationWarning
		>
			<head>
				{/* Safe: structuredData is a compile-time constant with no user input */}
				<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: structuredData }} />
			</head>
			<body className="flex min-h-screen flex-col">
				<RootProvider
					i18n={{ locale: "en", translations: { search: "Find a skill…" } }}
					search={{ SearchDialog }}
				>
					{children}
				</RootProvider>
			</body>
		</html>
	);
}

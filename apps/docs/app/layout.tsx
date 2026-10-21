import SearchDialog from "@/components/search-lazy";
import { getTotals } from "@/lib/site";
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

/** Mirrors the `basePath` derivation in `next.config.mjs`, so icon URLs also resolve under `next dev`. */
const basePath = process.env.NODE_ENV === "production" ? "/metapowers" : "";

/** Skill and domain counts come from the generated `lib/site-data.json` (`bun run gen:data`). */
const totals = getTotals();
const counts = `${totals.skills} skills across ${totals.plugins} domains`;

export const metadata: Metadata = {
	title: {
		default: "Metapowers — Structured Workflows for AI Coding",
		template: "%s | Metapowers",
	},
	description: `${counts} — structured, repeatable workflows for design, research, development, marketing, and more. Works with Claude Code, Codex CLI, OpenCode, and Cursor.`,
	// Origin only: the static `app/opengraph-image.png` URL Next generates already carries the
	// basePath, so a base of `siteUrl` would double it (`/metapowers/metapowers/…`).
	metadataBase: new URL(new URL(siteUrl).origin),
	openGraph: {
		type: "website",
		locale: "en_US",
		url: siteUrl,
		siteName: "Metapowers",
		title: "Metapowers — Structured Workflows for AI Coding",
		description: `${counts} — structured, repeatable workflows for design, research, development, marketing, and more.`,
	},
	twitter: {
		card: "summary_large_image",
		title: "Metapowers — Structured Workflows for AI Coding",
		description: `${counts}. Works with Claude Code, Codex CLI, OpenCode, and Cursor.`,
	},
	icons: {
		// `metadataBase` is the bare origin, so a relative "/apple-icon.png" would resolve
		// without the "/metapowers" basePath — the explicit `basePath` prefix below is intended. The
		// `apple-icon.tsx` file-convention route omitted the basePath on its generated
		// `<link>` (Next.js bug); this static public/ file + explicit URL sidesteps it, same
		// as the old favicon.svg precedent.
		//
		// Declaring any `icons` entry here disables Next's automatic merge of file-convention
		// icons (see `resolve-metadata.js`: the static-icon merge only runs when
		// `resolvedMetadata.icons` is still unset) — so `icon.svg` has to be repeated here too,
		// or the favicon link disappears from every page entirely. `app/icon.svg` itself still
		// does the actual work; this just re-declares its URL so it keeps getting linked.
		icon: `${basePath}/icon.svg`,
		apple: `${basePath}/apple-icon.png`,
	},
	other: {
		"npm:package": "create-metapowers",
	},
};

// Static JSON-LD structured data — hardcoded constants plus build-time counts from
// `lib/site-data.json`, no user input
const structuredData = JSON.stringify([
	{
		"@context": "https://schema.org",
		"@type": "WebSite",
		name: "Metapowers",
		url: siteUrl,
		description: `Structured, repeatable workflows for digital production domains. ${counts}.`,
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
		description: `Structured, repeatable workflows for digital production domains. ${counts}.`,
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
				{/* Safe: structuredData is built at build time from constants and generated data, no user input */}
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

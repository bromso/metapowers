import { RootProvider } from "fumadocs-ui/provider/next";
import type { ReactNode } from "react";
import type { Metadata } from "next";
import "./global.css";

const siteUrl = "https://bromso.github.io/metapowers";

export const metadata: Metadata = {
	title: {
		default: "Metapowers — Structured Workflows for AI Coding",
		template: "%s | Metapowers",
	},
	description:
		"275+ skills across 16 domains — structured, repeatable workflows for design, research, development, marketing, and more. Works with Claude Code, Codex CLI, OpenCode, and Cursor.",
	metadataBase: new URL(siteUrl),
	openGraph: {
		type: "website",
		locale: "en_US",
		url: siteUrl,
		siteName: "Metapowers",
		title: "Metapowers — Structured Workflows for AI Coding",
		description:
			"275+ skills across 16 domains — structured, repeatable workflows for design, research, development, marketing, and more.",
	},
	twitter: {
		card: "summary_large_image",
		title: "Metapowers — Structured Workflows for AI Coding",
		description:
			"275+ skills across 16 domains. Works with Claude Code, Codex CLI, OpenCode, and Cursor.",
	},
	icons: {
		icon: "/metapowers/favicon.svg",
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
			"Structured, repeatable workflows for digital production domains. 275+ skills across 16 domains.",
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
			"Structured, repeatable workflows for digital production domains. 275+ skills across 16 domains.",
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
		<html lang="en" suppressHydrationWarning>
			<head>
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
				<link href="https://fonts.googleapis.com/css2?family=Miranda+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
				{/* Safe: structuredData is a compile-time constant with no user input */}
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{ __html: structuredData }}
				/>
			</head>
			<body className="flex min-h-screen flex-col">
				<RootProvider>{children}</RootProvider>
			</body>
		</html>
	);
}

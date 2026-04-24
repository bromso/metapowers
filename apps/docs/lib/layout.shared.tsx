import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";

export function baseOptions(): BaseLayoutProps {
	return {
		nav: {
			title: "Metapowers",
		},
		links: [
			{
				text: "Docs",
				url: "/docs",
			},
			{
				text: "Domains",
				url: "/docs/overview/what-is-metapowers",
			},
			{
				text: "Getting Started",
				url: "/docs/overview/installation",
			},
			{
				text: "GitHub",
				url: "https://github.com/bromso/metapowers",
				external: true,
			},
		],
	};
}

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
		],
	};
}

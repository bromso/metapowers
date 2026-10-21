import { DomainSwatch, sidebarComponents } from "@/components/docs/sidebar";
import { GitHubIcon, NpmIcon } from "@/components/ui/Icons";
import { domainForDocsUrl } from "@/lib/domains";
import { baseOptions } from "@/lib/layout.shared";
import { source } from "@/lib/source";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import type { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
	return (
		<DocsLayout
			tree={source.getPageTree()}
			tabs={{
				// Domain roots surface in the sidebar's root switcher: swap the icon for the swatch.
				transform: (option) => {
					const domain = domainForDocsUrl(option.url);
					if (!domain) return option;
					return {
						...option,
						icon: (
							<span className="flex size-full items-center justify-center">
								<DomainSwatch colour={domain.colour} />
							</span>
						),
					};
				},
			}}
			{...baseOptions()}
			sidebar={{
				components: sidebarComponents,
				footer: (
					<div key="sidebar-footer" className="flex items-center gap-1">
						<a
							href="https://github.com/bromso/metapowers"
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center justify-center rounded-md p-2 text-fd-muted-foreground hover:text-fd-foreground transition-colors"
							aria-label="GitHub"
						>
							<GitHubIcon className="size-5" />
						</a>
						<a
							href="https://www.npmjs.com/package/create-metapowers"
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center justify-center rounded-md p-2 text-fd-muted-foreground hover:text-fd-foreground transition-colors"
							aria-label="npm"
						>
							<NpmIcon className="size-5" />
						</a>
					</div>
				),
			}}
		>
			{children}
		</DocsLayout>
	);
}

import { source } from "@/lib/source";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { baseOptions } from "@/lib/layout.shared";
import type { ReactNode } from "react";
import { Github } from "lucide-react";

function NpmIcon({ className }: { className?: string }) {
	return (
		<svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
			<path d="M1.763 0C.786 0 0 .786 0 1.763v20.474C0 23.214.786 24 1.763 24h20.474c.977 0 1.763-.786 1.763-1.763V1.763C24 .786 23.214 0 22.237 0zM5.13 5.323h13.74v13.04H16.5V7.476H12.1v10.886H5.13z" />
		</svg>
	);
}

export default function Layout({ children }: { children: ReactNode }) {
	return (
		<DocsLayout
			tree={source.getPageTree()}
			tabs={{}}
			{...baseOptions()}
			sidebar={{
				footer: (
					<div className="flex items-center gap-1">
						<a
							href="https://github.com/bromso/metapowers"
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center justify-center rounded-md p-2 text-fd-muted-foreground hover:text-fd-foreground transition-colors"
							aria-label="GitHub"
						>
							<Github className="size-5" />
						</a>
						<a
							href="https://www.npmjs.com/org/metapowers"
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

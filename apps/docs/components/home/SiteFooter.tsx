import { GitHubIcon } from "@/components/ui/Icons";
import Link from "next/link";

const linkClass =
	"inline-flex items-center gap-1.5 rounded-full text-mp-muted transition-colors hover:text-mp-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mp-accent";

export function SiteFooter() {
	return (
		<footer className="border-t border-mp-ink/10">
			<div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-10 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-6">
				<ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
					<li>
						<Link href="/docs/overview" className={linkClass}>
							Docs
						</Link>
					</li>
					<li>
						<Link href="/#domains" className={linkClass}>
							Domains
						</Link>
					</li>
					<li>
						<a
							href="https://github.com/bromso/singularskills"
							target="_blank"
							rel="noopener noreferrer"
							className={linkClass}
						>
							<GitHubIcon className="size-4" />
							GitHub
						</a>
					</li>
					<li>
						<a
							href="https://github.com/bromso/singularskills/blob/main/LICENSE"
							target="_blank"
							rel="noopener noreferrer"
							className={linkClass}
						>
							MIT
						</a>
					</li>
				</ul>
				<p className="text-mp-muted">
					<a
						href="https://github.com/bromso"
						target="_blank"
						rel="noopener noreferrer"
						className={linkClass}
					>
						Built by Jonas Bröms
					</a>
				</p>
			</div>
		</footer>
	);
}

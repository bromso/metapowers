import { Terminal } from "@/components/ui/Terminal";
import Link from "next/link";

export function InstallStrip() {
	return (
		<section
			id="install"
			aria-labelledby="install-title"
			className="scroll-mt-20 px-4 py-16 sm:px-6"
		>
			<div className="mx-auto max-w-3xl">
				<h2 id="install-title" className="sr-only">
					Install
				</h2>
				<Terminal command="/plugin marketplace add bromso/metapowers" />
				<p className="mt-4 text-center text-sm text-mp-muted">
					<Link
						href="/docs/overview/installation"
						className="rounded underline-offset-4 transition-colors hover:text-mp-ink hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mp-accent"
					>
						Also: <code className="font-mono text-mp-ink">npx create-metapowers</code> for Codex ·
						OpenCode · Cursor
					</Link>
				</p>
			</div>
		</section>
	);
}

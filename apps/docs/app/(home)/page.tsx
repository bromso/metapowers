import Link from "next/link";

export default function HomePage() {
	return (
		<main className="flex flex-1 flex-col items-center justify-center px-4 text-center">
			<h1 className="mb-4 text-4xl font-bold">Metapowers</h1>
			<p className="mb-8 max-w-lg text-lg text-fd-muted-foreground">
				Metaprompting plugins for Claude Code — structured workflows for design,
				coding, research, and more.
			</p>
			<div className="flex gap-4">
				<Link
					href="/docs"
					className="rounded-lg bg-fd-primary px-6 py-3 text-sm font-medium text-fd-primary-foreground transition-colors hover:bg-fd-primary/90"
				>
					Get Started
				</Link>
				<a
					href="https://github.com/metapowers/metapowers"
					className="rounded-lg border border-fd-border px-6 py-3 text-sm font-medium transition-colors hover:bg-fd-accent"
					target="_blank"
					rel="noopener noreferrer"
				>
					GitHub
				</a>
			</div>
		</main>
	);
}

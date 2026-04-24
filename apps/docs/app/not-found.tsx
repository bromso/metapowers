import Link from "next/link";

export default function NotFound() {
	return (
		<main className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
			<p className="text-6xl font-bold text-fd-primary">404</p>
			<h1 className="mt-4 text-2xl font-semibold text-fd-foreground">
				Page not found
			</h1>
			<p className="mt-2 max-w-md text-fd-muted-foreground">
				The page you're looking for doesn't exist or has been moved.
			</p>
			<div className="mt-8 flex gap-4">
				<Link
					href="/docs/overview"
					className="rounded-lg bg-fd-primary px-6 py-2.5 text-sm font-medium text-fd-primary-foreground transition-colors hover:bg-fd-primary/90"
				>
					Documentation
				</Link>
				<Link
					href="/"
					className="rounded-lg border border-fd-border px-6 py-2.5 text-sm font-medium text-fd-foreground transition-colors hover:bg-fd-accent"
				>
					Home
				</Link>
			</div>
		</main>
	);
}

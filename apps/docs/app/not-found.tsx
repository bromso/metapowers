import { SiteFooter } from "@/components/home/SiteFooter";
import { SiteNav } from "@/components/home/SiteNav";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Pill } from "@/components/ui/Pill";

export default function NotFound() {
	return (
		<div className="bg-mp-ground text-mp-ink">
			<SiteNav />
			<main className="flex flex-col items-center justify-center px-6 py-40 text-center">
				<Eyebrow>404</Eyebrow>
				<h1 className="mp-display mt-4 text-4xl sm:text-5xl">This room doesn't exist.</h1>
				<p className="mt-4 max-w-md text-mp-muted">
					The page you're looking for moved or never existed.
				</p>
				<div className="mt-8 flex flex-wrap items-center justify-center gap-3">
					<Pill href="/docs/overview" variant="primary">
						Browse the docs
					</Pill>
					<Pill href="/" variant="outline">
						Back home
					</Pill>
				</div>
			</main>
			<SiteFooter />
		</div>
	);
}

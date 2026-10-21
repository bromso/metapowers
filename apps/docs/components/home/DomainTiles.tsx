import { DomainTile } from "@/components/home/DomainTile";
import Reveal from "@/components/motion/Reveal";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { getDomains, getTotals } from "@/lib/site";

/** Per-column stagger in seconds (Reveal caps any delay at 0.05). */
const STAGGER = 0.04;

export function DomainTiles() {
	const domains = getDomains();
	const totals = getTotals();
	return (
		<section
			id="domains"
			aria-labelledby="domains-title"
			className="scroll-mt-20 px-4 py-24 sm:px-6 sm:py-32"
		>
			<div className="mx-auto max-w-7xl">
				<Eyebrow>
					{totals.plugins} domains · {totals.skills} skills
				</Eyebrow>
				<h2 id="domains-title" className="mp-display mt-4 text-[clamp(2rem,5vw,4rem)]">
					Pick the room you need.
				</h2>
				<ul className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
					{domains.map((domain, index) => (
						<li key={domain.slug} className="min-w-0">
							<Reveal delay={(index % 4) * STAGGER} className="h-full">
								<DomainTile domain={domain} />
							</Reveal>
						</li>
					))}
				</ul>
			</div>
		</section>
	);
}

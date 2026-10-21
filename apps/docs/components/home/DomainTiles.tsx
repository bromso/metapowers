import { ChromaBento } from "@/components/home/ChromaBento";
import { SectionHeader } from "@/components/home/SectionHeader";
import { getTotals } from "@/lib/site";

export function DomainTiles() {
	const totals = getTotals();
	return (
		<section
			id="domains"
			aria-labelledby="domains-title"
			className="scroll-mt-20 px-4 py-24 sm:px-6 sm:py-32"
		>
			<div className="mx-auto max-w-7xl">
				<SectionHeader
					id="domains-title"
					eyebrow={`${totals.plugins} domains · ${totals.skills} skills`}
					title="Pick the room you need."
				/>
				<ChromaBento />
			</div>
		</section>
	);
}

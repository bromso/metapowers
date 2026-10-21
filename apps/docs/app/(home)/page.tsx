import { ClosingCta } from "@/components/home/ClosingCta";
import { DomainTiles } from "@/components/home/DomainTiles";
import { Hero } from "@/components/home/Hero";
import { HowItWorks } from "@/components/home/HowItWorks";
import { InstallStrip } from "@/components/home/InstallStrip";
import { NumbersStrip } from "@/components/home/NumbersStrip";
import { SkillShowcase } from "@/components/home/SkillShowcase";
import { getTotals } from "@/lib/site";

export default function HomePage() {
	const totals = getTotals();
	return (
		<>
			<Hero skills={totals.skills} plugins={totals.plugins} />
			<InstallStrip />
			<HowItWorks />
			<DomainTiles />
			<SkillShowcase />
			<NumbersStrip />
			<ClosingCta />
		</>
	);
}

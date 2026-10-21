import { Hero } from "@/components/home/Hero";
import { InstallStrip } from "@/components/home/InstallStrip";
import { getTotals } from "@/lib/site";

export default function HomePage() {
	const totals = getTotals();
	return (
		<>
			<Hero skills={totals.skills} plugins={totals.plugins} />
			<InstallStrip />
			{/* sections 3–7: Task 6 */}
		</>
	);
}

import CountUp from "@/components/motion/CountUp";
import { getTotals } from "@/lib/site";

export function NumbersStrip() {
	const totals = getTotals();
	const items = [
		{ value: totals.skills, label: "skills" },
		{ value: totals.plugins, label: "domains" },
		{ value: totals.evalSuites, label: "eval suites" },
		{ value: totals.agents, label: "agents supported" },
	];
	return (
		<section
			id="numbers"
			aria-label="singularskills in numbers"
			className="scroll-mt-20 px-4 py-24 sm:px-6 sm:py-32"
		>
			<dl className="mx-auto grid max-w-7xl grid-cols-2 gap-x-6 gap-y-12 border-y border-mp-ink/15 py-14 lg:grid-cols-4">
				{items.map((item) => (
					<div key={item.label} className="flex flex-col gap-3">
						<dt className="mp-eyebrow order-2">{item.label}</dt>
						<dd className="mp-display order-1 text-[clamp(3rem,8vw,6rem)] tabular-nums">
							<CountUp to={item.value} />
						</dd>
					</div>
				))}
			</dl>
		</section>
	);
}

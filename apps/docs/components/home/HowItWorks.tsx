import { SectionHeader } from "@/components/home/SectionHeader";
import Reveal from "@/components/motion/Reveal";
import type { ReactNode } from "react";

const STEPS: { numeral: string; body: ReactNode }[] = [
	{
		numeral: "01",
		body: "Install the marketplace once and enable the domains you need.",
	},
	{
		numeral: "02",
		body: "Run a skill with a project name and it asks for what it can't infer.",
	},
	{
		numeral: "03",
		body: (
			<>
				Numbered artifacts land in <code className="font-mono text-[0.9em]">.metapowers/</code>,
				gates stop you skipping steps.
			</>
		),
	},
];

/** Per-column stagger in seconds (Reveal caps any delay at 0.05). */
const STAGGER = 0.025;

export function HowItWorks() {
	return (
		<section aria-labelledby="how-title" className="px-4 py-24 sm:px-6 sm:py-32">
			<div className="mx-auto max-w-7xl">
				<SectionHeader
					id="how-title"
					eyebrow="How it works"
					title="Three steps, then it's muscle memory."
				/>
				<ol className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
					{STEPS.map((step, index) => (
						<li key={step.numeral}>
							<Reveal delay={index * STAGGER} className="border-t border-mp-ink/15 pt-6">
								<span
									aria-hidden="true"
									className="mp-display block text-[clamp(4rem,9vw,7rem)] text-mp-accent"
								>
									{step.numeral}
								</span>
								<p className="mt-6 max-w-sm text-lg leading-snug">{step.body}</p>
							</Reveal>
						</li>
					))}
				</ol>
			</div>
		</section>
	);
}

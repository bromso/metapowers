import { SectionHeader } from "@/components/home/SectionHeader";
import { TRACE_CAPTIONS } from "@/lib/trace";
import dynamic from "next/dynamic";
import type { ReactNode } from "react";

// Split into its own chunk (it pulls in `motion`) but still server-rendered, so the settled
// trace is in the HTML.
const SkillTrace = dynamic(() => import("@/components/home/SkillTrace"), { ssr: true });

const CODE = ".metapowers/";

/** Sets the `.metapowers/` path in monospace, as the original third step did. */
function withCode(caption: string): ReactNode {
	const at = caption.indexOf(CODE);
	if (at < 0) return caption;
	return (
		<>
			{caption.slice(0, at)}
			<code className="font-mono text-[0.9em]">{CODE}</code>
			{caption.slice(at + CODE.length)}
		</>
	);
}

export function HowItWorks() {
	return (
		<section
			id="how-it-works"
			aria-labelledby="how-title"
			className="scroll-mt-20 px-4 py-24 sm:px-6 sm:py-32"
		>
			<div className="mx-auto max-w-7xl">
				<SectionHeader
					id="how-title"
					eyebrow="How it works"
					title="Three steps, then it's muscle memory."
				/>
				<div className="mt-14">
					<SkillTrace />
				</div>
				<ul className="mt-10 grid gap-6 md:grid-cols-3 md:gap-8">
					{TRACE_CAPTIONS.map((caption) => (
						<li
							key={caption}
							className="max-w-sm border-t border-mp-ink/15 pt-4 text-lg leading-snug"
						>
							{withCode(caption)}
						</li>
					))}
				</ul>
			</div>
		</section>
	);
}

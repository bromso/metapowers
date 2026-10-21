"use client";

import Aurora from "@/components/motion/Aurora";
import SplitText from "@/components/motion/SplitText";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Pill } from "@/components/ui/Pill";
import { gsap, useGSAP } from "@/lib/gsap";
import { prefersReducedMotion, usePrefersReducedMotion } from "@/lib/motion";
import { type CSSProperties, useEffect, useRef, useState } from "react";

export interface HeroProps {
	skills: number;
	plugins: number;
}

const HEADLINE = "Your whole production team, as repeatable workflows.";

/** Static gradient that is always painted under the Aurora canvas (and alone without JS). */
const staticGradient: CSSProperties = {
	backgroundImage: [
		"radial-gradient(60% 70% at 15% 100%, var(--mp-grad-1) 0%, transparent 70%)",
		"radial-gradient(55% 65% at 55% 95%, var(--mp-grad-2) 0%, transparent 70%)",
		"radial-gradient(60% 70% at 95% 85%, var(--mp-grad-3) 0%, transparent 70%)",
	].join(", "),
};

type AuroraTheme = { stops: string[]; dark: boolean };

/**
 * Aurora parses colours through a 2D canvas, which cannot resolve `var(...)`, so read the
 * resolved token values from the root element and re-read them when the theme class flips.
 */
function useAuroraTheme(): AuroraTheme | null {
	const [theme, setTheme] = useState<AuroraTheme | null>(null);
	useEffect(() => {
		const root = document.documentElement;
		const read = () => {
			const style = getComputedStyle(root);
			const stops = ["--mp-grad-1", "--mp-grad-2", "--mp-grad-3"].map((name) =>
				style.getPropertyValue(name).trim(),
			);
			if (stops.some((value) => value === "")) return;
			setTheme({ stops, dark: root.classList.contains("dark") });
		};
		read();
		const observer = new MutationObserver(read);
		observer.observe(root, { attributes: true, attributeFilter: ["class"] });
		return () => observer.disconnect();
	}, []);
	return theme;
}

export function Hero({ skills, plugins }: HeroProps) {
	const sectionRef = useRef<HTMLElement>(null);
	const panelRef = useRef<HTMLDivElement>(null);
	const reduced = usePrefersReducedMotion();
	const auroraTheme = useAuroraTheme();

	useGSAP(
		() => {
			const section = sectionRef.current;
			const panel = panelRef.current;
			if (!section || !panel || reduced || prefersReducedMotion()) return;
			gsap.to(panel, {
				scale: 0.9,
				borderRadius: 32,
				top: 24,
				right: 24,
				bottom: 24,
				left: 24,
				ease: "none",
				scrollTrigger: {
					trigger: section,
					start: "top top",
					end: "bottom bottom",
					scrub: true,
				},
			});
		},
		{ scope: sectionRef, dependencies: [reduced], revertOnUpdate: true },
	);

	return (
		<section ref={sectionRef} aria-labelledby="hero-title" className="relative h-[160vh]">
			<div className="sticky top-0 h-screen overflow-hidden">
				<div
					ref={panelRef}
					className="absolute inset-0 overflow-hidden bg-mp-ground"
					style={{ transformOrigin: "center top" }}
				>
					<div aria-hidden="true" className="absolute inset-0" style={staticGradient} />
					{auroraTheme ? (
						<div className="absolute inset-0">
							<Aurora
								lightMode={!auroraTheme.dark}
								direction="bottom"
								colorStops={auroraTheme.stops}
								dpr={1.5}
							/>
						</div>
					) : null}
					<div className="relative mx-auto flex h-full max-w-7xl flex-col justify-end px-4 pb-16 sm:px-6 sm:pb-24">
						<Eyebrow className="mb-6 text-mp-ink!">
							{skills} skills · {plugins} domains · one command
						</Eyebrow>
						<div id="hero-title" className="max-w-5xl">
							<SplitText
								text={HEADLINE}
								tag="h1"
								splitType="words"
								delay={60}
								duration={0.9}
								trigger="load"
								textAlign="left"
								// SplitText clips its box for the rise effect; the bottom padding keeps
								// descenders on the last line visible at line-height 1.
								className="mp-display pb-[0.12em] text-[clamp(2.75rem,8vw,7.5rem)] text-mp-ink"
							/>
						</div>
						<div className="mt-10 flex flex-wrap gap-3">
							<Pill href="#install" variant="primary">
								Add the marketplace
							</Pill>
							<Pill href="/docs/overview" variant="outline">
								Browse skills
							</Pill>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

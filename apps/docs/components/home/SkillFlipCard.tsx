"use client";

import dynamic from "next/dynamic";
import { Component, type ReactNode, useEffect, useRef, useState } from "react";

// The `motion` chunk loads on the client only; the stacked faces below are the server output.
const FlipCard = dynamic(() => import("@/components/motion/FlipCard"), { ssr: false });

/**
 * If the chunk fails to load, `next/dynamic` throws during render; without a boundary React
 * would unmount the whole page. Rendering nothing instead leaves the stacked faces as they are.
 */
class ChunkBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
	state = { failed: false };
	static getDerivedStateFromError() {
		return { failed: true };
	}
	render() {
		return this.state.failed ? null : this.props.children;
	}
}

const FRONT_LABEL = "Flip to see what it writes";
const BACK_LABEL = "Flip back to the skill";

/** Front keeps the surface card; back keeps the ink card (surface in dark theme). */
const FACE_CLASS = {
	front:
		"flex h-full flex-col rounded-[20px] border border-mp-ink/10 bg-mp-surface p-5 text-mp-ink sm:p-7",
	back: "flex h-full flex-col rounded-[20px] bg-mp-ink p-5 text-mp-ground sm:p-7 [.dark_&]:border [.dark_&]:border-mp-ink/15 [.dark_&]:bg-mp-surface [.dark_&]:text-mp-ink",
};

function Face({ side, children }: { side: "front" | "back"; children: ReactNode }) {
	return (
		<div className={FACE_CLASS[side]}>
			<div className="min-w-0">{children}</div>
			<p className="mt-auto flex items-center gap-2 pt-5 text-sm opacity-70">
				<span aria-hidden="true">↻</span>
				{side === "front" ? FRONT_LABEL : BACK_LABEL}
			</p>
		</div>
	);
}

/**
 * The card's own copy of a face. Hidden from assistive technology: the "Skill card contents"
 * region is the readable copy, and the card's `role="button"` keeps only its short name.
 */
function CardCopy({ side, children }: { side: "front" | "back"; children: ReactNode }) {
	return (
		<div aria-hidden="true" className="h-full">
			<Face side={side}>{children}</Face>
		</div>
	);
}

/**
 * The skill showcase as one card: the SKILL.md excerpt on the front, the artifacts it writes on
 * the back. The server (and pre-mount) markup is `[data-faces]`: both faces stacked and fully
 * visible with their captions, so the artifact tree shows even if the `motion` chunk never loads.
 */
export function SkillFlipCard({ front, back }: { front: ReactNode; back: ReactNode }) {
	const facesRef = useRef<HTMLElement>(null);
	const [size, setSize] = useState<{ width: number; height: number } | null>(null);

	useEffect(() => {
		const el = facesRef.current;
		if (!el) return;
		// The card is as tall as its tallest face. Each face is measured on its own, so the value
		// is the same whether the faces are stacked (pre-mount) or overlaid (post-mount).
		// getBoundingClientRect keeps fractional pixels; the only ancestor transform is Reveal's
		// translate, which does not change sizes.
		const measure = () => {
			const width = el.getBoundingClientRect().width;
			let height = 0;
			for (const face of el.children) {
				height = Math.max(height, face.getBoundingClientRect().height);
			}
			setSize((prev) =>
				prev && prev.width === width && prev.height === height ? prev : { width, height },
			);
		};
		measure();
		const observer = new ResizeObserver(measure);
		observer.observe(el);
		for (const face of el.children) observer.observe(face);
		return () => observer.disconnect();
	}, []);

	return (
		// Mount-time swap. Until the FlipCard root (`[aria-pressed]`) exists, the faces are the
		// visible content, stacked. Once it exists, the `[&:has([aria-pressed])>…]` classes overlay
		// the faces in one grid cell (height = tallest face, the card's measured height, so the
		// one-time shift is only the back face's height) and fade them to opacity 0 under the card.
		// They stay in the accessibility tree as the "Skill card contents" region: the card's
		// `role="button"` makes its own copy of the faces presentational, so screen readers read
		// the text here. `--skill-shadow` is ink in light theme and ground in dark, so the drop
		// shadow never glows.
		<div className="relative mx-auto w-full max-w-[560px] [--skill-shadow:var(--mp-ink)] [&:has([aria-pressed])>[data-faces]]:pointer-events-none [&:has([aria-pressed])>[data-faces]]:gap-0 [&:has([aria-pressed])>[data-faces]]:opacity-0 [&:has([aria-pressed])>[data-faces]]:select-none [&:has([aria-pressed])>[data-faces]>*]:[grid-area:1/1] [.dark_&]:[--skill-shadow:var(--mp-ground)]">
			<section ref={facesRef} data-faces="" aria-label="Skill card contents" className="grid gap-4">
				<div className="min-w-0">
					<Face side="front">{front}</Face>
				</div>
				<div className="min-w-0">
					<Face side="back">{back}</Face>
				</div>
			</section>
			{size ? (
				<div className="absolute inset-x-0 top-0">
					<ChunkBoundary>
						<FlipCard
							front={<CardCopy side="front">{front}</CardCopy>}
							back={<CardCopy side="back">{back}</CardCopy>}
							axis="y"
							flipOnClick
							draggable
							tilt
							glare={false}
							hoverScale={1.01}
							radius={20}
							width={size.width}
							height={size.height}
							background="var(--mp-surface)"
							color="var(--mp-ink)"
							shadowColor="var(--skill-shadow)"
							shadowOpacity={0.18}
							ariaLabel="Skill card: flip to see what it writes"
						/>
					</ChunkBoundary>
				</div>
			) : null}
		</div>
	);
}

"use client";

import dynamic from "next/dynamic";
import { type ReactNode, useEffect, useRef, useState } from "react";

// The `motion` chunk loads on the client only; the stacked faces below are the server output.
const FlipCard = dynamic(() => import("@/components/motion/FlipCard"), { ssr: false });

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
 * The skill showcase as one card: the SKILL.md excerpt on the front, the artifacts it writes on
 * the back. The server (and no-JS) markup is `[data-faces]`: both faces stacked, captions
 * visible. With scripting on, the same box lays the faces over each other (back hidden), so the
 * box is already the card's final size before hydration. After mount it stays in the flow as
 * an invisible sizer, and the `FlipCard` sits on top at its measured width and height, so the
 * swap cannot shift the layout.
 */
export function SkillFlipCard({ front, back }: { front: ReactNode; back: ReactNode }) {
	const facesRef = useRef<HTMLDivElement>(null);
	const [size, setSize] = useState<{ width: number; height: number } | null>(null);

	useEffect(() => {
		const el = facesRef.current;
		if (!el) return;
		const measure = () => {
			const width = el.offsetWidth;
			const height = el.offsetHeight;
			setSize((prev) =>
				prev && prev.width === width && prev.height === height ? prev : { width, height },
			);
		};
		measure();
		const observer = new ResizeObserver(measure);
		observer.observe(el);
		return () => observer.disconnect();
	}, []);

	return (
		// `--skill-shadow` is ink in light theme and ground in dark, so the drop shadow never glows.
		<div className="relative mx-auto w-full max-w-[560px] [--skill-shadow:var(--mp-ink)] [&:has([aria-pressed])>[data-faces]]:invisible [.dark_&]:[--skill-shadow:var(--mp-ground)]">
			<div
				ref={facesRef}
				data-faces=""
				// `scripting: enabled` matches before hydration when JS is on, and not with JS off.
				className="grid gap-4 [@media(scripting:enabled)]:gap-0 [@media(scripting:enabled)]:lg:min-h-[360px]"
			>
				<div className="min-w-0 [@media(scripting:enabled)]:[grid-area:1/1]">
					<Face side="front">{front}</Face>
				</div>
				<div className="min-w-0 [@media(scripting:enabled)]:invisible [@media(scripting:enabled)]:[grid-area:1/1]">
					<Face side="back">{back}</Face>
				</div>
			</div>
			{size ? (
				<div className="absolute inset-0">
					<FlipCard
						front={<Face side="front">{front}</Face>}
						back={<Face side="back">{back}</Face>}
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
				</div>
			) : null}
		</div>
	);
}

// Source: https://reactbits.dev/r/ThoughtLine-TS-TW.json (MIT + Commons Clause), copied 2026-10-21
"use client";

import { prefersReducedMotion, usePrefersReducedMotion } from "@/lib/motion";
import { type AnimationPlaybackControls, animate } from "motion/react";
import type React from "react";
import {
	type CSSProperties,
	type ReactNode,
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
} from "react";
export type ThoughtLineGlyph = "sparkle" | "dot" | "none" | ReactNode;

export interface ThoughtLineProps {
	label?: string;
	doneLabel?: string;
	renderLabel?: (text: string, working: boolean) => ReactNode;
	glyph?: ThoughtLineGlyph;
	steps?: string[];
	collapsible?: boolean;
	collapseOnSettle?: boolean;
	color?: string;
	glyphColor?: string;
	fontSize?: number;
	breathPeriod?: number;
	breathDepth?: number;
	shimmer?: boolean;
	shimmerDuration?: number;
	settleDuration?: number;
	settleBlur?: number;
	working?: boolean;
	settleAfter?: number;
	elapsed?: number;
	showTimer?: boolean;
	onSettle?: (seconds: number) => void;
	className?: string;
	style?: CSSProperties;
}

const EASE_OUT: [number, number, number, number] = [0.23, 1, 0.32, 1];
const EASE_IN_OUT: [number, number, number, number] = [0.77, 0, 0.175, 1];
const GLYPH_DONE = 0.55;
const EMPTY_STEPS: string[] = [];

const fmt = (ds: number) =>
	ds < 600
		? `${(ds / 10).toFixed(1)}s`
		: `${Math.floor(ds / 600)}m ${((ds % 600) / 10).toFixed(1)}s`;
const spoken = (ds: number) =>
	ds < 600
		? `${(ds / 10).toFixed(1)} seconds`
		: `${Math.floor(ds / 600)} minutes ${((ds % 600) / 10).toFixed(1)} seconds`;

const STYLE = `
@keyframes thought-line-pulse { 0%, 100% { opacity: 0.55; } 50% { opacity: 1; } }
@keyframes thought-line-shimmer { to { background-position: -125% 0; } }
`;

// Local modification: inline glyphs replace the upstream `@hugeicons` icons (sparkle, chevron,
// tick) so the copy needs no icon package.
type GlyphProps = { size: string; strokeWidth: number };

const SparkleGlyph = ({ size, strokeWidth }: GlyphProps) => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth={strokeWidth}
		strokeLinecap="round"
		strokeLinejoin="round"
		aria-hidden="true"
	>
		<path d="M10 3.5c.6 3.9 2.6 5.9 6.5 6.5-3.9.6-5.9 2.6-6.5 6.5-.6-3.9-2.6-5.9-6.5-6.5 3.9-.6 5.9-2.6 6.5-6.5Z" />
		<path d="M18 14.5c.3 1.9 1.1 2.7 3 3-1.9.3-2.7 1.1-3 3-.3-1.9-1.1-2.7-3-3 1.9-.3 2.7-1.1 3-3Z" />
	</svg>
);

const ChevronGlyph = ({ size, strokeWidth }: GlyphProps) => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth={strokeWidth}
		strokeLinecap="round"
		strokeLinejoin="round"
		aria-hidden="true"
	>
		<path d="M18 9l-6 6-6-6" />
	</svg>
);

const TickGlyph = ({ size, strokeWidth }: GlyphProps) => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth={strokeWidth}
		strokeLinecap="round"
		strokeLinejoin="round"
		aria-hidden="true"
	>
		<path d="M5 14l3.5 3.5L19 6.5" />
	</svg>
);

const ThoughtLine: React.FC<ThoughtLineProps> = ({
	label = "Thinking…",
	doneLabel = "",
	renderLabel,
	glyph = "sparkle",
	steps = EMPTY_STEPS,
	collapsible = true,
	collapseOnSettle = true,
	color = "currentColor",
	glyphColor = "",
	fontSize = 16,
	breathPeriod = 1.6,
	breathDepth = 0.45,
	shimmer = true,
	shimmerDuration = 1.8,
	settleDuration = 350,
	settleBlur = 2,
	working = true,
	settleAfter = 0,
	elapsed,
	showTimer = true,
	onSettle,
	className = "",
	style,
}) => {
	// Local modification: read through the site's motion gate; under reduced motion there is no
	// breath and no shimmer (upstream kept a shallower, slower breath), and settling is instant.
	const reduce = usePrefersReducedMotion();
	const [autoSettled, setAutoSettled] = useState(false);
	const [open, setOpen] = useState(true);
	const isWorking = working && !autoSettled;
	const doneText = doneLabel || (showTimer ? "Thought for" : "Done thinking");
	const hasTrace = steps.length > 0;
	const depth = reduce ? 0 : breathDepth;
	const period = reduce ? breathPeriod * 1.5 : breathPeriod;
	const trough = 1 - depth;
	const sheen = shimmer && !reduce;

	const glyphRef = useRef<HTMLSpanElement>(null);
	const breathRef = useRef<HTMLSpanElement>(null);
	const timerRef = useRef<HTMLSpanElement>(null);
	const stackRef = useRef<HTMLSpanElement>(null);
	const workRef = useRef<HTMLSpanElement>(null);
	const doneRef = useRef<HTMLSpanElement>(null);
	const dsRef = useRef(0);
	const prevWorking = useRef(isWorking);
	const latest = useRef<{ onSettle?: (seconds: number) => void }>({});
	latest.current = { onSettle };
	const [announce, setAnnounce] = useState(label);

	useEffect(() => {
		if (working) setAutoSettled(false);
	}, [working]);
	useEffect(() => {
		if (isWorking) setOpen(true);
		else if (collapseOnSettle) setOpen(false);
	}, [isWorking, collapseOnSettle]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: upstream deps; `glyph` re-runs the effect when the glyph element is swapped
	useEffect(() => {
		const glyphEl = glyphRef.current;
		const breathEl = breathRef.current;
		if (!breathEl) return undefined;
		// Local modification: the hook reports `false` during hydration, so read the preference
		// live; reduced-motion users get the final opacities at once, with no tween.
		if (reduce || prefersReducedMotion()) {
			if (glyphEl) glyphEl.style.opacity = isWorking ? "1" : String(GLYPH_DONE);
			breathEl.style.opacity = "1";
			return undefined;
		}
		const s = settleDuration / 1000;
		const loop = (el: HTMLElement, delay: number) =>
			animate(
				el,
				{ opacity: [trough, 1, trough] },
				{ duration: period, ease: EASE_IN_OUT, repeat: Number.POSITIVE_INFINITY, delay },
			);
		let cancelled = false;
		const running: AnimationPlaybackControls[] = [];
		if (isWorking) {
			if (depth > 0) {
				if (sheen)
					running.push(animate(breathEl, { opacity: 1 }, { duration: 0.2, ease: EASE_OUT }));
				if (glyphEl) {
					const lead = animate(glyphEl, { opacity: trough }, { duration: 0.2, ease: EASE_OUT });
					running.push(lead);
					lead.then(() => {
						if (cancelled) return;
						running.push(loop(glyphEl, 0));
						if (!sheen) running.push(loop(breathEl, 0.14));
					});
				} else if (!sheen) {
					running.push(loop(breathEl, 0.14));
				}
			} else {
				if (glyphEl)
					running.push(animate(glyphEl, { opacity: 1 }, { duration: 0.2, ease: EASE_OUT }));
				running.push(animate(breathEl, { opacity: 1 }, { duration: 0.2, ease: EASE_OUT }));
			}
		} else {
			if (glyphEl)
				running.push(animate(glyphEl, { opacity: GLYPH_DONE }, { duration: s, ease: EASE_OUT }));
			running.push(animate(breathEl, { opacity: 1 }, { duration: s, ease: EASE_OUT }));
		}
		return () => {
			cancelled = true;
			for (const a of running) a.stop();
		};
	}, [isWorking, period, depth, trough, settleDuration, glyph, sheen, reduce]);

	const paint = (ds: number) => {
		dsRef.current = ds;
		if (timerRef.current) timerRef.current.textContent = fmt(ds);
	};
	// biome-ignore lint/correctness/useExhaustiveDependencies: upstream deps; `paint` only writes refs
	useLayoutEffect(() => {
		if (elapsed != null) {
			paint(Math.round(elapsed * 10));
			return undefined;
		}
		if (!isWorking) return undefined;
		const startedAt = performance.now();
		paint(0);
		const id = setInterval(() => {
			const ds = Math.floor((performance.now() - startedAt) / 100);
			paint(ds);
			if (settleAfter > 0 && ds >= Math.round(settleAfter * 10)) setAutoSettled(true);
		}, 100);
		return () => clearInterval(id);
	}, [isWorking, elapsed, settleAfter]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: upstream deps; label and size changes re-place the timer
	useLayoutEffect(() => {
		const t = timerRef.current;
		const stack = stackRef.current;
		if (!t || !stack) return undefined;
		const place = (glide: boolean) => {
			const active = isWorking ? workRef.current : doneRef.current;
			if (!active) return;
			const shift = active.offsetWidth - stack.offsetWidth;
			if (!glide) t.style.transition = "none";
			t.style.transform = `translateX(${shift}px)`;
			if (!glide) {
				void t.offsetWidth;
				t.style.transition = "";
			}
		};
		place(prevWorking.current !== isWorking);
		prevWorking.current = isWorking;
		const ro = new ResizeObserver(() => place(false));
		if (workRef.current) ro.observe(workRef.current);
		if (doneRef.current) ro.observe(doneRef.current);
		return () => ro.disconnect();
	}, [isWorking, label, doneText, fontSize, showTimer]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: upstream fires only when `isWorking` flips
	useEffect(() => {
		if (isWorking) {
			setAnnounce(label);
			return;
		}
		setAnnounce(showTimer ? `${doneText} ${spoken(dsRef.current)}` : doneText);
		latest.current.onSettle?.(dsRef.current / 10);
	}, [isWorking]);

	const toggle = hasTrace && collapsible;
	const head = (
		<>
			{glyph !== "none" ? (
				<span
					ref={glyphRef}
					className="mr-[0.2em] inline-flex h-[1.1em] w-[1.1em] flex-none [color:var(--tl-glyph)] [&>svg]:block [&>svg]:h-full [&>svg]:w-full"
					aria-hidden="true"
				>
					{glyph === "sparkle" ? (
						<SparkleGlyph size="100%" strokeWidth={2} />
					) : glyph === "dot" ? (
						<span className="m-auto h-[0.5em] w-[0.5em] rounded-full bg-current" />
					) : (
						glyph
					)}
				</span>
			) : null}
			<span ref={stackRef} className="inline-grid" aria-hidden="true">
				<span
					ref={workRef}
					className="w-max opacity-0 [grid-area:1/1] [filter:blur(var(--tl-blur))] [transition:opacity_var(--tl-settle)_cubic-bezier(0.23,1,0.32,1),filter_var(--tl-settle)_cubic-bezier(0.23,1,0.32,1)] data-[active]:opacity-100 data-[active]:[filter:blur(0)] motion-reduce:[filter:none]! motion-reduce:[transition:opacity_var(--tl-settle)_ease]"
					data-active={isWorking ? "" : undefined}
				>
					<span
						ref={breathRef}
						className="inline-block group-data-[working]:data-[shimmer]:bg-clip-text group-data-[working]:data-[shimmer]:text-transparent group-data-[working]:data-[shimmer]:[background-image:linear-gradient(100deg,color-mix(in_srgb,var(--tl-color)_50%,transparent)_30%,var(--tl-color)_50%,color-mix(in_srgb,var(--tl-color)_50%,transparent)_70%)] group-data-[working]:data-[shimmer]:[background-size:250%_100%] group-data-[working]:data-[shimmer]:[background-position:125%_0] group-data-[working]:data-[shimmer]:[-webkit-text-fill-color:transparent] group-data-[working]:data-[shimmer]:[animation:thought-line-shimmer_var(--tl-shimmer)_linear_infinite]"
						data-shimmer={sheen ? "" : undefined}
					>
						{renderLabel ? renderLabel(label, true) : label}
					</span>
				</span>
				<span
					ref={doneRef}
					className="w-max opacity-0 [grid-area:1/1] [filter:blur(var(--tl-blur))] [transition:opacity_var(--tl-settle)_cubic-bezier(0.23,1,0.32,1),filter_var(--tl-settle)_cubic-bezier(0.23,1,0.32,1)] data-[active]:[opacity:var(--tl-done)] data-[active]:[filter:blur(0)] motion-reduce:[filter:none]! motion-reduce:[transition:opacity_var(--tl-settle)_ease]"
					data-active={isWorking ? undefined : ""}
				>
					{renderLabel ? renderLabel(doneText, false) : doneText}
				</span>
			</span>
			{showTimer ? (
				<span
					ref={timerRef}
					className="tabular-nums [opacity:var(--tl-timer)] [transition:opacity_var(--tl-settle)_ease,transform_var(--tl-settle)_cubic-bezier(0.77,0,0.175,1)] data-[done]:[opacity:var(--tl-done)] motion-reduce:[transition:opacity_var(--tl-settle)_ease]"
					data-done={isWorking ? undefined : ""}
					aria-hidden="true"
				>
					{/* Local modification: a controlled `elapsed` is in the server markup too. */}
					{elapsed != null ? fmt(Math.round(elapsed * 10)) : "0.0s"}
				</span>
			) : null}
			{collapsible ? (
				<span
					className="ml-[0.1em] inline-flex opacity-0 [transition:opacity_200ms_ease,transform_200ms_cubic-bezier(0.23,1,0.32,1)] data-[on]:opacity-55 group-data-[open]:rotate-180"
					data-on={hasTrace ? "" : undefined}
					aria-hidden="true"
				>
					<ChevronGlyph size="1em" strokeWidth={2.2} />
				</span>
			) : null}
			{/* biome-ignore lint/a11y/useSemanticElements: upstream live region; an <output> inside a <button> is not valid */}
			<span className="sr-only" role="status">
				{announce}
			</span>
		</>
	);

	return (
		<div
			className={`group inline-flex flex-col items-start leading-[1.2] font-medium [color:var(--tl-color)] [font-family:inherit] [font-size:var(--tl-font)]${className ? ` ${className}` : ""}`}
			data-working={isWorking ? "" : undefined}
			data-open={open && hasTrace ? "" : undefined}
			style={
				{
					"--tl-font": `${fontSize}px`,
					"--tl-color": color,
					"--tl-glyph": glyphColor || color,
					"--tl-settle": `${reduce ? 0 : settleDuration}ms`,
					"--tl-blur": `${settleBlur}px`,
					"--tl-shimmer": `${shimmerDuration}s`,
					...style,
				} as CSSProperties
			}
		>
			<style>{STYLE}</style>
			{collapsible ? (
				<button
					type="button"
					className="relative m-0 inline-flex cursor-default items-center gap-[0.3em] border-0 bg-transparent p-0 text-left whitespace-nowrap text-inherit outline-none [font:inherit] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-mp-accent data-[toggle]:cursor-pointer data-[toggle]:[-webkit-tap-highlight-color:transparent]"
					data-toggle={toggle ? "" : undefined}
					aria-expanded={toggle ? open : undefined}
					// Local modification: stays in the tab order before the first step arrives (upstream:
					// `toggle ? 0 : -1`), so a trace that has not played yet is not skipped by keyboard users.
					tabIndex={collapsible ? 0 : -1}
					onClick={() => {
						if (toggle) setOpen((v) => !v);
					}}
				>
					{head}
				</button>
			) : (
				<div className="relative m-0 inline-flex cursor-default items-center gap-[0.3em] border-0 bg-transparent p-0 text-left whitespace-nowrap text-inherit outline-none [font:inherit] data-[toggle]:cursor-pointer data-[toggle]:[-webkit-tap-highlight-color:transparent]">
					{head}
				</div>
			)}
			{hasTrace ? (
				<div
					className="grid w-0 min-w-full [grid-template-rows:0fr] [transition:grid-template-rows_var(--tl-settle)_cubic-bezier(0.23,1,0.32,1)] data-[open]:[grid-template-rows:1fr]"
					data-open={open ? "" : undefined}
					aria-hidden={!open}
				>
					<div className="min-h-0 overflow-x-visible overflow-y-clip">
						<div className="flex w-max flex-col gap-[0.45em] pt-[0.6em] pb-[0.2em] pl-[1.6em] text-[0.875em] font-normal whitespace-nowrap">
							{steps.map((text, i) => {
								const done = !isWorking || i < steps.length - 1;
								return (
									<div
										key={`${i}-${text}`}
										className="group/step flex translate-y-0 items-center gap-[0.5em] opacity-100 [transition:opacity_200ms_cubic-bezier(0.23,1,0.32,1),transform_200ms_cubic-bezier(0.23,1,0.32,1)] starting:-translate-y-1 starting:opacity-0 motion-reduce:[transform:none]! motion-reduce:[transition:opacity_200ms_ease]"
										data-done={done ? "" : undefined}
									>
										<span
											className="inline-grid h-[1em] w-[1em] flex-none place-items-center opacity-55"
											aria-hidden="true"
										>
											{done ? (
												<TickGlyph size="1em" strokeWidth={2.5} />
											) : (
												<i
													className={`block h-[0.4em] w-[0.4em] rounded-full bg-current${reduce ? "" : " [animation:thought-line-pulse_1.6s_cubic-bezier(0.77,0,0.175,1)_infinite] motion-reduce:[animation-duration:2.4s]"}`}
												/>
											)}
										</span>
										<span className="[transition:opacity_var(--tl-settle)_ease] group-data-[done]/step:opacity-55">
											{text}
										</span>
									</div>
								);
							})}
						</div>
					</div>
				</div>
			) : null}
		</div>
	);
};

export default ThoughtLine;

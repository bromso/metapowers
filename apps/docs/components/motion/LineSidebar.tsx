// Source: https://reactbits.dev/r/LineSidebar-TS-TW.json (MIT + Commons Clause), copied 2026-10-21
"use client";

import { prefersReducedMotion } from "@/lib/motion";
import type React from "react";
import { type CSSProperties, useCallback, useEffect, useRef, useState } from "react";

type Falloff = "linear" | "smooth" | "sharp";

/** Local addition: an item may carry a link target, rendered as an `<a>` inside the `<li>`. */
export type LineSidebarItem = string | { label: string; href: string };

export interface LineSidebarProps {
	items?: LineSidebarItem[];
	accentColor?: string;
	textColor?: string;
	markerColor?: string;
	showIndex?: boolean;
	showMarker?: boolean;
	proximityRadius?: number;
	maxShift?: number;
	falloff?: Falloff;
	markerLength?: number;
	markerGap?: number;
	tickScale?: number;
	scaleTick?: boolean;
	itemGap?: number;
	fontSize?: number;
	smoothing?: number;
	defaultActive?: number | null;
	/** Local addition: controlled active index; when given, clicks still call `onItemClick`. */
	active?: number | null;
	/**
	 * Local addition: labels (index and text) are hidden until the sidebar is hovered or holds
	 * keyboard focus, so at rest only the marker lines show.
	 */
	revealLabels?: boolean;
	/** Local addition: an accessible name for the `<nav>`. */
	ariaLabel?: string;
	/**
	 * Local addition: which edge the lines sit on. `"right"` mirrors the geometry: markers and
	 * ticks to the right of the labels, labels right-aligned and shifting left on hover.
	 */
	side?: "left" | "right";
	onItemClick?: (index: number, label: string, event: React.MouseEvent<HTMLElement>) => void;
	className?: string;
}

const FALLOFF_CURVES: Record<Falloff, (p: number) => number> = {
	linear: (p) => p,
	smooth: (p) => p * p * (3 - 2 * p),
	sharp: (p) => p * p * p,
};

const DEFAULT_ITEMS = [
	"Overview",
	"Components",
	"Animations",
	"Backgrounds",
	"Showcase",
	"Playground",
	"Templates",
	"Changelog",
	"Community",
	"Resources",
	"Documentation",
	"Support",
];

const labelOf = (item: LineSidebarItem) => (typeof item === "string" ? item : item.label);
const hrefOf = (item: LineSidebarItem) => (typeof item === "string" ? undefined : item.href);

const LineSidebar = ({
	items = DEFAULT_ITEMS,
	accentColor = "#A855F7",
	textColor = "#c4c4c4",
	markerColor = "#6c6c6c",
	showIndex = true,
	showMarker = true,
	proximityRadius = 100,
	maxShift = 30,
	falloff = "smooth",
	markerLength = 60,
	markerGap = 0,
	tickScale = 0.5,
	scaleTick = true,
	itemGap = 20,
	fontSize = 1.1,
	smoothing = 100,
	defaultActive = null,
	active,
	revealLabels = false,
	ariaLabel,
	side = "left",
	onItemClick,
	className = "",
}: LineSidebarProps) => {
	const listRef = useRef<HTMLUListElement>(null);
	const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
	const targetsRef = useRef<number[]>([]);
	const currentRef = useRef<number[]>([]);
	const rafRef = useRef<number | null>(null);
	const lastRef = useRef(0);
	const activeRef = useRef<number | null>(active ?? defaultActive);
	const smoothingRef = useRef(smoothing);
	const [activeIndex, setActiveIndex] = useState<number | null>(active ?? defaultActive);

	activeRef.current = activeIndex;
	smoothingRef.current = smoothing;

	// Local modification: a controlled `active` wins over the internal click state.
	useEffect(() => {
		if (active !== undefined) setActiveIndex(active);
	}, [active]);

	// Single rAF loop that eases every item's --effect toward its target using
	// frame-rate independent exponential smoothing, so color, shift and scale
	// all move together without staggering CSS transitions.
	// Local modification: under reduced motion the values jump to their targets in one frame.
	const runFrame = useCallback((now: number) => {
		const dt = Math.min((now - lastRef.current) / 1000, 0.05);
		lastRef.current = now;
		const tau = Math.max(smoothingRef.current, 1) / 1000;
		const k = prefersReducedMotion() ? 1 : 1 - Math.exp(-dt / tau);

		let moving = false;
		const items = itemRefs.current;
		for (let i = 0; i < items.length; i++) {
			const el = items[i];
			if (!el) continue;
			const target = Math.max(targetsRef.current[i] || 0, activeRef.current === i ? 1 : 0);
			const cur = currentRef.current[i] || 0;
			const next = cur + (target - cur) * k;
			const settled = Math.abs(target - next) < 0.0015;
			const value = settled ? target : next;
			currentRef.current[i] = value;
			el.style.setProperty("--effect", value.toFixed(4));
			if (!settled) moving = true;
		}

		rafRef.current = moving ? requestAnimationFrame(runFrame) : null;
	}, []);

	const startLoop = useCallback(() => {
		if (rafRef.current != null) {
			cancelAnimationFrame(rafRef.current);
		}
		lastRef.current = performance.now();
		rafRef.current = requestAnimationFrame(runFrame);
	}, [runFrame]);

	const handlePointerMove = useCallback(
		(e: React.PointerEvent<HTMLUListElement>) => {
			const list = listRef.current;
			if (!list) return;
			const rect = list.getBoundingClientRect();
			const pointerY = e.clientY - rect.top;
			const ease = FALLOFF_CURVES[falloff] ?? FALLOFF_CURVES.linear;
			const items = itemRefs.current;
			for (let i = 0; i < items.length; i++) {
				const el = items[i];
				if (!el) continue;
				const center = el.offsetTop + el.offsetHeight / 2;
				const distance = Math.abs(pointerY - center);
				targetsRef.current[i] = ease(Math.max(0, 1 - distance / proximityRadius));
			}
			startLoop();
		},
		[falloff, proximityRadius, startLoop],
	);

	const handlePointerLeave = useCallback(() => {
		targetsRef.current = targetsRef.current.map(() => 0);
		startLoop();
	}, [startLoop]);

	const handleClick = useCallback(
		(index: number, label: string, event: React.MouseEvent<HTMLElement>) => {
			setActiveIndex(index);
			onItemClick?.(index, label, event);
		},
		[onItemClick],
	);

	// biome-ignore lint/correctness/useExhaustiveDependencies: upstream; the loop restarts when the active item changes
	useEffect(() => {
		startLoop();
	}, [activeIndex, startLoop]);

	useEffect(
		() => () => {
			if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
			rafRef.current = null;
		},
		[],
	);

	// Local modification: `side="right"` mirrors every horizontal rule (marker, tick, padding,
	// alignment and the hover shift); the left-side strings are upstream's.
	const right = side === "right";
	const markerEdge = right
		? "right-[calc(-1*var(--marker-length)-var(--marker-gap))] origin-right"
		: "left-[calc(-1*var(--marker-length)-var(--marker-gap))] origin-left";
	const tickClass = showMarker
		? `after:absolute ${right ? "after:right-[calc(-1*var(--marker-length)-var(--marker-gap))]" : "after:left-[calc(-1*var(--marker-length)-var(--marker-gap))]"} after:top-[calc(100%+var(--item-gap)/2)] after:h-px after:opacity-50 after:content-[''] last:after:content-none after:[background-color:var(--marker-color)] after:[width:calc(var(--marker-length)*var(--tick-scale))] ${
				scaleTick
					? `${right ? "after:origin-right" : "after:origin-left"} after:[transform:translateY(-50%)_scaleX(calc(0.7+var(--effect,0)*0.6))]`
					: "after:-translate-y-1/2"
			}`
		: "";

	// Local modification: with `revealLabels` the label block fades in only while the sidebar
	// is hovered or focused (named group on the nav), so the resting sidebar is the lines alone.
	const labelClass = `relative inline-flex items-baseline leading-[1.2] [color:color-mix(in_srgb,var(--accent-color)_calc(var(--effect,0)*100%),var(--text-color))] [font-size:var(--font-size)] ${
		right
			? "[transform:translateX(calc(-1*var(--effect,0)*var(--max-shift)))]"
			: "[transform:translateX(calc(var(--effect,0)*var(--max-shift)))]"
	}${
		revealLabels
			? " opacity-0 transition-opacity duration-200 ease-out group-hover/line-sidebar:opacity-100 group-focus-within/line-sidebar:opacity-100 motion-reduce:transition-none"
			: ""
	}`;

	return (
		<nav
			aria-label={ariaLabel}
			className={`group/line-sidebar relative flex ${right ? "justify-end" : "justify-start"}${showMarker ? (right ? " [padding-right:calc(var(--marker-length)+var(--marker-gap))]" : " [padding-left:calc(var(--marker-length)+var(--marker-gap))]") : ""}${className ? ` ${className}` : ""}`}
			style={
				{
					"--accent-color": accentColor,
					"--text-color": textColor,
					"--marker-color": markerColor,
					"--marker-length": `${markerLength}px`,
					"--marker-gap": `${markerGap}px`,
					"--tick-scale": tickScale,
					"--max-shift": `${maxShift}px`,
					"--item-gap": `${itemGap}px`,
					"--font-size": `${fontSize}rem`,
					"--smoothing": `${smoothing}ms`,
				} as CSSProperties
			}
		>
			<ul
				ref={listRef}
				onPointerMove={handlePointerMove}
				onPointerLeave={handlePointerLeave}
				className="m-0 flex list-none flex-col py-4 [gap:var(--item-gap)]"
			>
				{items.map((item, index) => {
					const label = labelOf(item);
					const href = hrefOf(item);
					const current = activeIndex === index;
					const body = (
						<>
							{showMarker && (
								<span
									aria-hidden="true"
									className={`absolute ${markerEdge} top-1/2 h-px w-[length:var(--marker-length)] [background-color:color-mix(in_srgb,var(--accent-color)_calc(var(--effect,0)*100%),var(--marker-color))] [transform:translateY(-50%)_scaleX(calc(0.7+var(--effect,0)*0.5))]`}
								/>
							)}
							<span className={labelClass}>
								{showIndex && (
									<span className="mr-[0.6rem] font-mono text-[0.85em] [opacity:calc(0.55+var(--effect,0)*0.45)]">
										{String(index + 1).padStart(2, "0")}
									</span>
								)}
								<span>{label}</span>
							</span>
						</>
					);
					return (
						// biome-ignore lint/a11y/useKeyWithClickEvents: upstream; an item with an href renders a keyboard-reachable link instead of the li click
						<li
							// biome-ignore lint/suspicious/noArrayIndexKey: upstream; labels may repeat
							key={`${label}-${index}`}
							ref={(el) => {
								itemRefs.current[index] = el;
							}}
							aria-current={!href && current ? "true" : undefined}
							onClick={href ? undefined : (event) => handleClick(index, label, event)}
							className={`relative flex cursor-pointer ${right ? "justify-end text-right" : "justify-start"} before:absolute before:-inset-x-12 before:-inset-y-[6px] before:content-[''] ${tickClass}`}
						>
							{href ? (
								// Local modification: a real link, so the item is keyboard reachable and works
								// without JavaScript; `aria-current` marks the section in view.
								<a
									href={href}
									aria-current={current ? "location" : undefined}
									onClick={(event) => handleClick(index, label, event)}
									className={`relative flex rounded ${right ? "justify-end" : "justify-start"} focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-solid focus-visible:[outline-color:var(--accent-color)]`}
								>
									{body}
								</a>
							) : (
								body
							)}
						</li>
					);
				})}
			</ul>
		</nav>
	);
};

export default LineSidebar;

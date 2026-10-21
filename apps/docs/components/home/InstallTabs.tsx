"use client";

import { Terminal } from "@/components/ui/Terminal";
import { type Agent, agents } from "@/lib/agents";
import { prefersReducedMotion, usePrefersReducedMotion } from "@/lib/motion";
import { type AnimationPlaybackControls, animate } from "motion/react";
import Link from "next/link";
import { type KeyboardEvent, useEffect, useLayoutEffect, useRef, useState } from "react";

/**
 * Install tabs (spec §4.2): the tab list is the supported-agents row, and each panel shows that
 * agent's install command. A hand-built WAI-ARIA tabs pattern (automatic activation, roving
 * tabindex) that reproduces animate-ui's base-ui Tabs behaviour without its dependency:
 *
 * 1. a soft surface pill slides behind the active tab (spring, stiffness 200, damping 25);
 * 2. the incoming panel fades in from `blur(4px)` over 0.25s;
 * 3. the panels box animates its height from the old panel's to the new one's (spring 200/30).
 *
 * animate-ui does (1) with a motion `layoutId` and (3) with `layout="size"`. Both need motion's
 * layout-projection feature, which measured about +105 KB of first-load JS for `/`. The same
 * three behaviours are driven here by motion's imperative `animate()`, which the homepage
 * already ships (`ThoughtLine`), so the tabs add almost nothing to first-load JS.
 *
 * First paint: the server HTML draws the pill as a plain element inside the active tab and
 * shows the Claude Code panel with no inline opacity, blur or height. A layout effect then swaps
 * that pill for one list-level pill placed on the same tab (before the browser paints), which is
 * the one that slides. Every hidden or in-between state is set client-side, in layout effects.
 * Reduced motion (`usePrefersReducedMotion` plus a live `prefersReducedMotion()` check): the
 * pill jumps, the panel swaps instantly with no blur, and the height snaps.
 */

const HIGHLIGHT = { type: "spring", stiffness: 200, damping: 25 } as const;
const HEIGHT = { type: "spring", stiffness: 200, damping: 30 } as const;
const PANEL = { duration: 0.25, ease: "easeOut" } as const;

const PILL =
	"pointer-events-none absolute -z-10 rounded-full border border-mp-ink/10 bg-mp-surface shadow-sm";

const tabId = (agent: Agent) => `install-tab-${agent.slug}`;
const panelId = (agent: Agent) => `install-panel-${agent.slug}`;

type Running = {
	pill?: AnimationPlaybackControls;
	panel?: AnimationPlaybackControls;
	box?: AnimationPlaybackControls;
};

/** Puts the pill exactly over `tab`, with no animation. */
function placePill(pill: HTMLElement, tab: HTMLElement) {
	pill.style.transform = `translateX(${tab.offsetLeft}px) translateY(${tab.offsetTop}px)`;
	pill.style.width = `${tab.offsetWidth}px`;
	pill.style.height = `${tab.offsetHeight}px`;
}

function AgentLabel({ agent }: { agent: Agent }) {
	if (agent.mark.kind === "svg") {
		return (
			<>
				<svg viewBox="0 0 24 24" fill="currentColor" className="size-5 shrink-0" aria-hidden="true">
					<title>{agent.mark.title}</title>
					<path d={agent.mark.path} />
				</svg>
				<span className="text-sm font-medium">{agent.name}</span>
			</>
		);
	}
	return (
		// Codex has no bundled mark (OpenAI restricts logo reuse), so the Miranda Sans wordmark
		// stands in for both the mark and the name (it is plain text, so it needs no separate
		// label). Sized so its cap height matches the marks' actual rendered ink, not just the 20px
		// icon box: measured in Chrome, the Claude/OpenCode/Cursor <path> ink is ~20-22px tall
		// inside the size-5 (20px) box (SVG getBBox scaled to the rendered box size), while
		// mirandaSans 600 "C" has a measured cap height of ~0.74em (canvas actualBoundingBoxAscent
		// + actualBoundingBoxDescent at a 100px reference, cross-checked with a pixel-ink scan) —
		// at text-base (16px) that is only ~12px, well short of the marks. 1.7rem (27.2px) closes
		// the gap: 0.74 * 27.2px ≈ 20px cap height, matching the marks' ink height.
		<span className="text-[1.7rem] leading-none font-semibold">{agent.mark.text}</span>
	);
}

export function InstallTabs() {
	const [active, setActive] = useState(0);
	// False in the server HTML and through hydration; set in a layout effect, so the list-level
	// pill replaces the in-tab one before the first client paint.
	const [mounted, setMounted] = useState(false);
	const reducedPref = usePrefersReducedMotion();

	const listRef = useRef<HTMLDivElement>(null);
	const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
	const pillRef = useRef<HTMLSpanElement>(null);
	const boxRef = useRef<HTMLDivElement>(null);
	const innerRef = useRef<HTMLDivElement>(null);
	const panelsRef = useRef<(HTMLDivElement | null)[]>([]);
	/** Index the pill and panels currently show. */
	const shownRef = useRef(0);
	/** Last measured height of the visible panel, the start of the next height animation. */
	const heightRef = useRef(0);
	const running = useRef<Running>({});

	useLayoutEffect(() => setMounted(true), []);

	useLayoutEffect(() => {
		const list = listRef.current;
		const pill = pillRef.current;
		const tab = tabsRef.current[active];
		const box = boxRef.current;
		const inner = innerRef.current;
		const panel = panelsRef.current[active];
		if (!mounted || !list || !pill || !tab || !box || !inner || !panel) return;

		const changed = shownRef.current !== active;
		shownRef.current = active;
		const run = running.current;
		run.pill?.stop();
		run.panel?.stop();
		run.box?.stop();
		run.box = undefined;

		if (!changed || reducedPref || prefersReducedMotion()) {
			placePill(pill, tab);
			panel.style.opacity = "";
			panel.style.filter = "";
			box.style.height = "";
			heightRef.current = inner.offsetHeight;
			return;
		}

		// Every animation below drives a plain number and writes the styles itself (`onUpdate`),
		// so motion never holds a stale style of its own that could land after a reset.

		// 1. Pill: from wherever it is now (mid-slide included) to the new tab.
		const at = pill.getBoundingClientRect();
		const origin = list.getBoundingClientRect();
		const a = {
			x: at.left - origin.left - list.clientLeft,
			y: at.top - origin.top - list.clientTop,
			w: pill.offsetWidth,
			h: pill.offsetHeight,
		};
		const b = { x: tab.offsetLeft, y: tab.offsetTop, w: tab.offsetWidth, h: tab.offsetHeight };
		const mix = (from: number, to: number, t: number) => from + (to - from) * t;
		run.pill = animate(0, 1, {
			...HIGHLIGHT,
			onUpdate: (t) => {
				pill.style.transform = `translateX(${mix(a.x, b.x, t)}px) translateY(${mix(a.y, b.y, t)}px)`;
				pill.style.width = `${mix(a.w, b.w, t)}px`;
				pill.style.height = `${mix(a.h, b.h, t)}px`;
			},
		});

		// 2. Panel: hidden and blurred in this frame, then fades in.
		const fade = (t: number) => {
			panel.style.opacity = String(t);
			panel.style.filter = `blur(${4 * (1 - t)}px)`;
		};
		fade(0);
		run.panel = animate(0, 1, {
			...PANEL,
			onUpdate: fade,
			onComplete: () => {
				panel.style.opacity = "";
				panel.style.filter = "";
			},
		});

		// 3. Height: hold the old height (or the mid-animation one) in this frame, then spring to
		// the new panel's height and hand the box back to `auto`.
		const from = box.style.height ? box.offsetHeight : heightRef.current;
		const to = inner.offsetHeight;
		heightRef.current = to;
		if (from > 0 && from !== to) {
			box.style.height = `${from}px`;
			run.box = animate(from, to, {
				...HEIGHT,
				onUpdate: (h) => {
					box.style.height = `${h}px`;
				},
				onComplete: () => {
					box.style.height = "";
				},
			});
		} else {
			box.style.height = "";
		}
	}, [active, mounted, reducedPref]);

	// When the tabs rewrap (resize), snap the pill to its tab; keep the panel height current.
	useEffect(() => {
		const list = listRef.current;
		const inner = innerRef.current;
		if (!mounted || !list || !inner || typeof ResizeObserver === "undefined") return;
		const observer = new ResizeObserver((entries) => {
			for (const entry of entries) {
				if (entry.target === inner) {
					heightRef.current = inner.offsetHeight;
					continue;
				}
				const pill = pillRef.current;
				const tab = tabsRef.current[shownRef.current];
				if (pill && tab) {
					running.current.pill?.stop();
					placePill(pill, tab);
				}
			}
		});
		observer.observe(list);
		observer.observe(inner);
		return () => observer.disconnect();
	}, [mounted]);

	useEffect(() => {
		const run = running.current;
		return () => {
			run.pill?.stop();
			run.panel?.stop();
			run.box?.stop();
		};
	}, []);

	const select = (index: number) => {
		const next = (index + agents.length) % agents.length;
		setActive(next);
		tabsRef.current[next]?.focus();
	};

	const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
		const keys: Record<string, number> = {
			ArrowRight: active + 1,
			ArrowLeft: active - 1,
			Home: 0,
			End: agents.length - 1,
		};
		if (!(event.key in keys)) return;
		event.preventDefault();
		select(keys[event.key]);
	};

	return (
		<div className="max-w-3xl">
			{/* Phones: the four tabs wrap to two rows; the pill follows across rows. */}
			<div
				ref={listRef}
				role="tablist"
				aria-label="Install for"
				onKeyDown={onKeyDown}
				className="relative isolate flex flex-wrap items-center gap-1"
			>
				{mounted ? (
					<span ref={pillRef} aria-hidden="true" className={`${PILL} top-0 left-0`} />
				) : null}
				{agents.map((agent, index) => {
					const selected = index === active;
					return (
						<button
							key={agent.slug}
							ref={(el) => {
								tabsRef.current[index] = el;
							}}
							type="button"
							role="tab"
							id={tabId(agent)}
							aria-selected={selected}
							aria-controls={panelId(agent)}
							tabIndex={selected ? 0 : -1}
							onClick={() => setActive(index)}
							className={[
								"relative flex h-11 items-center gap-2 rounded-full px-4 text-mp-ink transition-opacity duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mp-accent focus-visible:outline-solid",
								selected ? "opacity-100" : "opacity-60 hover:opacity-100",
							].join(" ")}
						>
							{selected && !mounted ? (
								<span aria-hidden="true" className={`${PILL} inset-0`} />
							) : null}
							<AgentLabel agent={agent} />
						</button>
					);
				})}
			</div>
			{/* The box clips while its height animates; the 4px padding (cancelled by the negative
			    margin) keeps the panel's focus ring inside the clip. */}
			<div className="mt-3">
				<div ref={boxRef} className="-m-1 overflow-hidden">
					<div ref={innerRef} className="p-1">
						{agents.map((agent, index) => (
							<div
								key={agent.slug}
								ref={(el) => {
									panelsRef.current[index] = el;
								}}
								role="tabpanel"
								id={panelId(agent)}
								aria-labelledby={tabId(agent)}
								hidden={index !== active}
								// biome-ignore lint/a11y/noNoninteractiveTabindex: WAI-ARIA tabs make the tabpanel focusable so keyboard users reach its content after the tab list
								tabIndex={0}
								className="rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mp-accent focus-visible:outline-solid"
							>
								<Terminal command={agent.install.command} note={agent.install.note} />
								<p className="mt-3 text-sm text-mp-muted">
									<Link
										href={agent.href}
										className="rounded underline-offset-4 transition-colors hover:text-mp-ink hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mp-accent focus-visible:outline-solid"
									>
										Full guide for {agent.name} →
									</Link>
								</p>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}

export default InstallTabs;

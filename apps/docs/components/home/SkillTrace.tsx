"use client";

import { TRACE_HOLD_MS, useTracePlayback } from "@/components/home/useTracePlayback";
import ThoughtLine from "@/components/motion/ThoughtLine";
import { prefersReducedMotion, usePrefersReducedMotion } from "@/lib/motion";
import { TRACE_BEAT_MS, TRACE_LABEL, TRACE_SETTLED_LABEL, TRACE_STEPS } from "@/lib/trace";
import { useLayoutEffect, useRef, useState } from "react";

/**
 * The "How it works" agent trace: one `ThoughtLine` in a surface card that plays the
 * empathize run as it scrolls in, holds the settled trace for `TRACE_HOLD_MS`, then resets and
 * plays again, for as long as it stays in view and the tab is visible (it freezes in place
 * otherwise). Server HTML is the settled trace (every step listed); see `useTracePlayback`.
 *
 * It never collapses (`collapseOnSettle={false}`); the chevron still folds it by hand. Under
 * reduced motion and without JS the settled trace stays, with every step listed.
 */
export default function SkillTrace() {
	const ref = useRef<HTMLDivElement>(null);
	const reduced = usePrefersReducedMotion();
	const [reserve, setReserve] = useState<number | null>(null);

	// Declared before `useTracePlayback`, so this layout effect runs first, while the card still
	// holds the server-rendered, fully expanded trace. That height becomes the card's permanent
	// `min-height` while the loop runs, so neither the reset to zero steps nor appending steps
	// ever moves the captions below (CLS). Only measured when a play can happen: reduced motion
	// never resets the trace.
	useLayoutEffect(() => {
		const card = ref.current;
		if (!card || reduced || prefersReducedMotion()) return;
		setReserve((current) => current ?? card.offsetHeight);
	}, [reduced]);

	const { shown, working, elapsed } = useTracePlayback({
		ref,
		steps: TRACE_STEPS,
		beatMs: TRACE_BEAT_MS,
		reduced,
		loop: true,
		holdMs: TRACE_HOLD_MS,
	});
	const holding = reserve !== null && !reduced;

	return (
		<div
			ref={ref}
			className="overflow-x-auto rounded-[20px] border border-mp-ink/10 bg-mp-surface p-5 sm:p-8 [.dark_&]:border-mp-ink/15"
			style={holding ? { minHeight: reserve } : undefined}
		>
			<ThoughtLine
				label={TRACE_LABEL}
				doneLabel={TRACE_SETTLED_LABEL}
				steps={shown}
				working={working}
				elapsed={elapsed}
				showTimer={false}
				collapsible
				collapseOnSettle={false}
				color="var(--mp-ink)"
				glyphColor="var(--mp-accent)"
				fontSize={18}
				className="[&>div:last-child]:font-mono"
			/>
		</div>
	);
}

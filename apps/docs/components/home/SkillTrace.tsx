"use client";

import { useTracePlayback } from "@/components/home/useTracePlayback";
import ThoughtLine from "@/components/motion/ThoughtLine";
import { prefersReducedMotion, usePrefersReducedMotion } from "@/lib/motion";
import { TRACE_BEAT_MS, TRACE_LABEL, TRACE_SETTLED_LABEL, TRACE_STEPS } from "@/lib/trace";
import { useLayoutEffect, useRef, useState } from "react";

/**
 * The "How it works" agent trace: one `ThoughtLine` in a surface card that plays the
 * empathize run once as it scrolls in, then settles into a single expandable line.
 * Server HTML is the settled trace (every step listed); see `useTracePlayback`.
 *
 * It collapses only after a real play (`played`): under reduced motion, without JS, and before
 * the trace has played it keeps its steps listed.
 */
export default function SkillTrace() {
	const ref = useRef<HTMLDivElement>(null);
	const reduced = usePrefersReducedMotion();
	const [reserve, setReserve] = useState<number | null>(null);

	// Declared before `useTracePlayback`, so this layout effect runs first, while the card still
	// holds the server-rendered, fully expanded trace. That height becomes the card's
	// `min-height` through the play, so appending steps never pushes the captions below down
	// (CLS). Only measured when a play can happen: reduced motion never resets the trace.
	useLayoutEffect(() => {
		const card = ref.current;
		if (!card || reduced || prefersReducedMotion()) return;
		setReserve((current) => current ?? card.offsetHeight);
	}, [reduced]);

	const { shown, working, elapsed, played } = useTracePlayback({
		ref,
		steps: TRACE_STEPS,
		beatMs: TRACE_BEAT_MS,
		reduced,
	});
	// Held from the reset until the played trace settles and collapses; then released.
	const holding = reserve !== null && !reduced && (working || !played);

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
				collapseOnSettle={played}
				color="var(--mp-ink)"
				glyphColor="var(--mp-accent)"
				fontSize={18}
				className="[&>div:last-child]:font-mono"
			/>
		</div>
	);
}

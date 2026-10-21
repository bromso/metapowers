"use client";

import { useTracePlayback } from "@/components/home/useTracePlayback";
import ThoughtLine from "@/components/motion/ThoughtLine";
import { usePrefersReducedMotion, useResolvedToken } from "@/lib/motion";
import { TRACE_BEAT_MS, TRACE_LABEL, TRACE_SETTLED_LABEL, TRACE_STEPS } from "@/lib/trace";
import { useRef } from "react";

/**
 * The "How it works" agent trace: one `ThoughtLine` in a surface card that plays the
 * empathize run once as it scrolls in, then settles into a single expandable line.
 * Server HTML is the settled trace (every step listed); see `useTracePlayback`.
 */
export default function SkillTrace() {
	const ref = useRef<HTMLDivElement>(null);
	const reduced = usePrefersReducedMotion();
	const { shown, working, elapsed } = useTracePlayback({
		ref,
		steps: TRACE_STEPS,
		beatMs: TRACE_BEAT_MS,
		reduced,
	});
	// ThoughtLine writes these into CSS variables; until the first client read they fall back
	// to the token itself, so the server markup is already on-palette.
	const ink = useResolvedToken("--mp-ink");
	const accent = useResolvedToken("--mp-accent");

	return (
		<div
			ref={ref}
			className="overflow-x-auto rounded-[20px] border border-mp-ink/10 bg-mp-surface p-5 sm:p-8 [.dark_&]:border-mp-ink/15"
		>
			<ThoughtLine
				label={TRACE_LABEL}
				doneLabel={TRACE_SETTLED_LABEL}
				steps={shown}
				working={working}
				elapsed={elapsed}
				showTimer={false}
				collapsible
				collapseOnSettle
				color={ink ?? "var(--mp-ink)"}
				glyphColor={accent ?? "var(--mp-accent)"}
				fontSize={18}
				className="[&>div:last-child]:font-mono"
			/>
		</div>
	);
}

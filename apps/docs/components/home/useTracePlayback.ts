import { prefersReducedMotion } from "@/lib/motion";
import { type RefObject, useLayoutEffect, useRef, useState } from "react";

/** What `ThoughtLine` needs from the playback: the steps so far, the working flag, the timer. */
export interface TraceState {
	shown: string[];
	working: boolean;
	elapsed: number;
}

export interface TracePlaybackOptions {
	steps: readonly string[];
	/** Interval between appended steps, in milliseconds. */
	beatMs: number;
	reduced: boolean;
}

/** Share of the element that must be on screen before the trace starts. */
export const TRACE_IN_VIEW_RATIO = 0.4;

/** The finished trace: every step listed, not working, the timer on the beat-driven total. */
export function settledTraceState(steps: readonly string[], beatMs: number): TraceState {
	return { shown: [...steps], working: false, elapsed: (steps.length * beatMs) / 1000 };
}

/**
 * Framework-free playback for the "How it works" trace, so it can be tested in Node with fake
 * timers and a fake `IntersectionObserver`.
 *
 * Under `reduced` it is settled from the start and observes nothing. Otherwise it starts at zero
 * steps and waits until `element` is at least 40% in view **and** `document.visibilityState` is
 * `"visible"`. It then lists the first step at once and appends one step per `beatMs`;
 * `elapsed` is the steps shown × `beatMs`, not a real clock. One beat after the last step it
 * settles (`working: false`). It plays once: after it starts it stops observing, so leaving
 * and re-entering the viewport never restarts it. `stop()` cancels everything; `onStart`
 * fires when playback begins, so a caller can remember that it has played, and `played()`
 * reports the same (always `false` under `reduced`, which never plays).
 */
export function createTracePlayback({
	element,
	steps,
	beatMs,
	reduced,
	onChange,
	onStart,
}: TracePlaybackOptions & {
	element: Element;
	onChange: (state: TraceState) => void;
	onStart?: () => void;
}): { getState: () => TraceState; played: () => boolean; stop: () => void } {
	if (reduced) {
		const settled = settledTraceState(steps, beatMs);
		return { getState: () => settled, played: () => false, stop: () => {} };
	}

	let state: TraceState = { shown: [], working: true, elapsed: 0 };
	let inView = false;
	let started = false;
	let stopped = false;
	let timer: ReturnType<typeof setTimeout> | undefined;

	const set = (next: TraceState) => {
		state = next;
		onChange(next);
	};

	const beat = () => {
		timer = undefined;
		if (stopped) return;
		const count = state.shown.length;
		if (count < steps.length) {
			const shown = steps.slice(0, count + 1);
			set({ shown, working: true, elapsed: (shown.length * beatMs) / 1000 });
			timer = setTimeout(beat, beatMs);
		} else {
			set({ ...state, working: false });
		}
	};

	const onVisibility = () => maybeStart();
	const observer = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				inView = entry.isIntersecting && entry.intersectionRatio >= TRACE_IN_VIEW_RATIO;
			}
			maybeStart();
		},
		{ threshold: TRACE_IN_VIEW_RATIO },
	);

	const unwatch = () => {
		observer.disconnect();
		document.removeEventListener("visibilitychange", onVisibility);
	};

	function maybeStart() {
		if (started || stopped || !inView || document.visibilityState !== "visible") return;
		started = true;
		unwatch();
		onStart?.();
		beat();
	}

	observer.observe(element);
	document.addEventListener("visibilitychange", onVisibility);

	return {
		getState: () => state,
		played: () => started,
		stop: () => {
			stopped = true;
			if (timer !== undefined) clearTimeout(timer);
			timer = undefined;
			unwatch();
		},
	};
}

/**
 * React wrapper around `createTracePlayback`. The first render (server and hydration) is the
 * settled trace, so the HTML is complete without JS. When playback will run, the layout effect
 * resets to zero steps before first paint — the documented first-paint exception, as for the
 * hero headline (see `components/motion/README.md`). A `started` ref keeps it to one play per
 * mount: once started, any re-run of the effect renders the settled trace instead.
 *
 * `played` turns `true` when a real play begins and never before: it stays `false` on the
 * server, through hydration, under reduced motion and until the trace scrolls into view. The
 * caller uses it to collapse the trace only after it has actually played, so a settled trace
 * that was never animated keeps every step listed.
 */
export function useTracePlayback({
	ref,
	steps,
	beatMs,
	reduced,
}: TracePlaybackOptions & { ref: RefObject<Element | null> }): TraceState & { played: boolean } {
	const [state, setState] = useState<TraceState>(() => settledTraceState(steps, beatMs));
	const [played, setPlayed] = useState(false);
	const started = useRef(false);

	useLayoutEffect(() => {
		const element = ref.current;
		// The hook value is `false` during hydration, so read the preference live as well.
		if (!element || reduced || prefersReducedMotion() || started.current) {
			setState(settledTraceState(steps, beatMs));
			return undefined;
		}
		const playback = createTracePlayback({
			element,
			steps,
			beatMs,
			reduced: false,
			onChange: setState,
			onStart: () => {
				started.current = true;
				setPlayed(true);
			},
		});
		setState(playback.getState());
		return () => playback.stop();
	}, [ref, steps, beatMs, reduced]);

	return { ...state, played };
}

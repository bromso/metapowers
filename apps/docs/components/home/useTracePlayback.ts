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
	/** Replay forever: after settling, hold for `holdMs`, reset to zero steps and play again. */
	loop?: boolean;
	/** How long a looping trace holds its settled state before it resets, in milliseconds. */
	holdMs?: number;
}

/** Share of the element that must be on screen before the trace starts. */
export const TRACE_IN_VIEW_RATIO = 0.4;

/** Default hold on the settled trace before a looping trace resets and plays again. */
export const TRACE_HOLD_MS = 2500;

/** The finished trace: every step listed, not working, the timer on the beat-driven total. */
export function settledTraceState(steps: readonly string[], beatMs: number): TraceState {
	return { shown: [...steps], working: false, elapsed: (steps.length * beatMs) / 1000 };
}

const EMPTY: TraceState = { shown: [], working: true, elapsed: 0 };

/**
 * Framework-free playback for the "How it works" trace, so it can be tested in Node with fake
 * timers and a fake `IntersectionObserver`.
 *
 * Under `reduced` it is settled from the start and observes nothing. Otherwise it starts at zero
 * steps and waits until `element` is at least 40% in view **and** `document.visibilityState` is
 * `"visible"`. It then lists the first step at once and appends one step per `beatMs`;
 * `elapsed` is the steps shown × `beatMs`, not a real clock. One beat after the last step it
 * settles (`working: false`).
 *
 * Without `loop` it plays once: after it starts it stops observing, so leaving and re-entering
 * the viewport never restarts it. With `loop` it holds the settled state for `holdMs`, resets to
 * zero steps, lists the first step one beat later and plays again, forever. It keeps observing:
 * whenever the element drops below 40% in view or the document is hidden, the pending beat or
 * hold is frozen (the state stays as it is) and resumes with its remaining time once both
 * conditions hold again.
 *
 * `stop()` cancels everything; `onStart` fires when the first play begins, so a caller can
 * remember that it has played, and `played()` reports the same (always `false` under
 * `reduced`, which never plays).
 */
export function createTracePlayback({
	element,
	steps,
	beatMs,
	reduced,
	loop = false,
	holdMs = TRACE_HOLD_MS,
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

	let state: TraceState = EMPTY;
	let inView = false;
	let started = false;
	let stopped = false;
	let timer: ReturnType<typeof setTimeout> | undefined;
	/** The next scheduled step of the cycle, kept while paused so it can resume. */
	let pending: { run: () => void; due: number; remaining: number } | undefined;

	const set = (next: TraceState) => {
		state = next;
		onChange(next);
	};

	const running = () => inView && document.visibilityState === "visible";

	const schedule = (run: () => void, ms: number) => {
		pending = { run, due: Date.now() + ms, remaining: ms };
		timer = setTimeout(() => {
			timer = undefined;
			pending = undefined;
			run();
		}, ms);
	};

	const pause = () => {
		if (timer === undefined || !pending) return;
		clearTimeout(timer);
		timer = undefined;
		pending.remaining = Math.max(0, pending.due - Date.now());
	};

	const resume = () => {
		if (timer !== undefined || !pending) return;
		schedule(pending.run, pending.remaining);
	};

	const restart = () => {
		if (stopped) return;
		set(EMPTY);
		schedule(beat, beatMs);
	};

	function beat() {
		if (stopped) return;
		const count = state.shown.length;
		if (count < steps.length) {
			const shown = steps.slice(0, count + 1);
			set({ shown, working: true, elapsed: (shown.length * beatMs) / 1000 });
			schedule(beat, beatMs);
		} else {
			set({ ...state, working: false });
			if (loop) schedule(restart, holdMs);
		}
	}

	const onVisibility = () => update();
	const observer = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				inView = entry.isIntersecting && entry.intersectionRatio >= TRACE_IN_VIEW_RATIO;
			}
			update();
		},
		{ threshold: TRACE_IN_VIEW_RATIO },
	);

	const unwatch = () => {
		observer.disconnect();
		document.removeEventListener("visibilitychange", onVisibility);
	};

	function update() {
		if (stopped) return;
		if (started) {
			// Only a looping trace keeps watching after it starts.
			if (running()) resume();
			else pause();
			return;
		}
		if (!running()) return;
		started = true;
		if (!loop) unwatch();
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
			pending = undefined;
			unwatch();
		},
	};
}

/**
 * React wrapper around `createTracePlayback`. The first render (server and hydration) is the
 * settled trace, so the HTML is complete without JS. When playback will run, the layout effect
 * resets to zero steps before first paint — the documented first-paint exception, as for the
 * hero headline (see `components/motion/README.md`). Without `loop`, a `started` ref keeps it to
 * one play per mount: once started, any re-run of the effect renders the settled trace instead.
 * With `loop` (the homepage), the trace cycles while in view and visible; see
 * `createTracePlayback`.
 *
 * `played` turns `true` when a real play begins and never before: it stays `false` on the
 * server, through hydration, under reduced motion and until the trace scrolls into view.
 */
export function useTracePlayback({
	ref,
	steps,
	beatMs,
	reduced,
	loop = false,
	holdMs,
}: TracePlaybackOptions & { ref: RefObject<Element | null> }): TraceState & { played: boolean } {
	const [state, setState] = useState<TraceState>(() => settledTraceState(steps, beatMs));
	const [played, setPlayed] = useState(false);
	const started = useRef(false);

	useLayoutEffect(() => {
		const element = ref.current;
		// The hook value is `false` during hydration, so read the preference live as well.
		if (!element || reduced || prefersReducedMotion() || (!loop && started.current)) {
			setState(settledTraceState(steps, beatMs));
			return undefined;
		}
		const playback = createTracePlayback({
			element,
			steps,
			beatMs,
			reduced: false,
			loop,
			holdMs,
			onChange: setState,
			onStart: () => {
				started.current = true;
				setPlayed(true);
			},
		});
		setState(playback.getState());
		return () => playback.stop();
	}, [ref, steps, beatMs, reduced, loop, holdMs]);

	return { ...state, played };
}

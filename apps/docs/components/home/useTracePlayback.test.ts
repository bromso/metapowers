import { TRACE_BEAT_MS, TRACE_SETTLE_SECONDS, TRACE_STEPS } from "@/lib/trace";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { TRACE_HOLD_MS, type TraceState, createTracePlayback } from "./useTracePlayback";

/** Minimal IntersectionObserver stand-in: the test drives `fire(ratio)` by hand. */
class FakeIntersectionObserver {
	static instances: FakeIntersectionObserver[] = [];
	readonly targets = new Set<Element>();
	disconnected = false;
	constructor(
		private readonly callback: (entries: Partial<IntersectionObserverEntry>[]) => void,
		readonly options?: IntersectionObserverInit,
	) {
		FakeIntersectionObserver.instances.push(this);
	}
	observe(target: Element) {
		this.targets.add(target);
	}
	unobserve(target: Element) {
		this.targets.delete(target);
	}
	disconnect() {
		this.disconnected = true;
		this.targets.clear();
	}
	fire(ratio: number) {
		if (this.disconnected) return;
		for (const target of this.targets) {
			this.callback([{ target, isIntersecting: ratio > 0, intersectionRatio: ratio }]);
		}
	}
}

/** Fake `document` with a settable visibility state and a real listener list. */
function createFakeDocument(initial: DocumentVisibilityState) {
	const listeners = new Set<() => void>();
	return {
		visibilityState: initial,
		addEventListener: (type: string, fn: () => void) => {
			if (type === "visibilitychange") listeners.add(fn);
		},
		removeEventListener: (type: string, fn: () => void) => {
			if (type === "visibilitychange") listeners.delete(fn);
		},
		setVisibility(next: DocumentVisibilityState) {
			this.visibilityState = next;
			for (const fn of listeners) fn();
		},
	};
}

const element = {} as Element;
const observer = () => FakeIntersectionObserver.instances.at(-1) as FakeIntersectionObserver;

let fakeDocument: ReturnType<typeof createFakeDocument>;

beforeEach(() => {
	vi.useFakeTimers();
	FakeIntersectionObserver.instances = [];
	fakeDocument = createFakeDocument("visible");
	vi.stubGlobal("IntersectionObserver", FakeIntersectionObserver);
	vi.stubGlobal("document", fakeDocument);
});

afterEach(() => {
	vi.useRealTimers();
	vi.unstubAllGlobals();
});

function start(reduced = false, loop = false) {
	const states: TraceState[] = [];
	const playback = createTracePlayback({
		element,
		steps: TRACE_STEPS,
		beatMs: TRACE_BEAT_MS,
		reduced,
		loop,
		onChange: (state) => states.push(state),
	});
	return { playback, states };
}

/** Time from the first step to the settled state: five more beats, then one to settle. */
const PLAY_MS = TRACE_STEPS.length * TRACE_BEAT_MS;

test("plays all six steps at the beat once in view and visible, then settles at 3s", () => {
	const { playback } = start();
	expect(playback.getState()).toEqual({ shown: [], working: true, elapsed: 0 });
	expect(observer().options?.threshold).toBe(0.4);

	// Below the 40% threshold nothing starts.
	observer().fire(0.2);
	vi.advanceTimersByTime(TRACE_BEAT_MS * 4);
	expect(playback.getState().shown).toHaveLength(0);

	observer().fire(0.5);
	expect(playback.getState().shown).toEqual(TRACE_STEPS.slice(0, 1));
	expect(playback.getState().working).toBe(true);

	for (let count = 2; count <= TRACE_STEPS.length; count++) {
		vi.advanceTimersByTime(TRACE_BEAT_MS - 1);
		expect(playback.getState().shown).toHaveLength(count - 1);
		vi.advanceTimersByTime(1);
		expect(playback.getState().shown).toEqual(TRACE_STEPS.slice(0, count));
		expect(playback.getState().working).toBe(true);
		expect(playback.getState().elapsed).toBe((count * TRACE_BEAT_MS) / 1000);
	}

	// One beat after the sixth step the trace settles on the beat-driven 3s.
	vi.advanceTimersByTime(TRACE_BEAT_MS);
	expect(playback.getState()).toEqual({
		shown: [...TRACE_STEPS],
		working: false,
		elapsed: TRACE_SETTLE_SECONDS,
	});
	expect(vi.getTimerCount()).toBe(0);
});

test("does not start while the document is hidden", () => {
	fakeDocument.visibilityState = "hidden";
	const { playback } = start();
	observer().fire(1);
	vi.advanceTimersByTime(TRACE_BEAT_MS * 10);
	expect(playback.getState()).toEqual({ shown: [], working: true, elapsed: 0 });

	// Becoming visible while still in view starts it.
	fakeDocument.setVisibility("visible");
	expect(playback.getState().shown).toHaveLength(1);
});

test("with loop, the cycle restarts after the hold: reset to zero steps, then replay", () => {
	const { playback, states } = start(false, true);
	expect(TRACE_HOLD_MS).toBe(2500);
	observer().fire(1);
	vi.advanceTimersByTime(PLAY_MS);
	expect(playback.getState()).toEqual({
		shown: [...TRACE_STEPS],
		working: false,
		elapsed: TRACE_SETTLE_SECONDS,
	});

	// The settled state holds for the whole hold.
	vi.advanceTimersByTime(TRACE_HOLD_MS - 1);
	expect(playback.getState().working).toBe(false);
	expect(playback.getState().shown).toHaveLength(TRACE_STEPS.length);

	// Then it resets to zero steps (working again) ...
	vi.advanceTimersByTime(1);
	expect(playback.getState()).toEqual({ shown: [], working: true, elapsed: 0 });

	// ... and one beat later lists the first step again and plays through to settle.
	vi.advanceTimersByTime(TRACE_BEAT_MS);
	expect(playback.getState().shown).toEqual(TRACE_STEPS.slice(0, 1));
	vi.advanceTimersByTime(PLAY_MS);
	expect(playback.getState().working).toBe(false);
	expect(playback.getState().shown).toHaveLength(TRACE_STEPS.length);

	// And again, forever: a third cycle starts after the next hold.
	vi.advanceTimersByTime(TRACE_HOLD_MS + TRACE_BEAT_MS);
	expect(playback.getState().shown).toEqual(TRACE_STEPS.slice(0, 1));
	expect(states.filter((state) => state.shown.length === 0)).toHaveLength(2);
	expect(states.filter((state) => state.shown.length === 1)).toHaveLength(3);
});

test("with loop, hiding the document pauses the cycle where it is and showing resumes it", () => {
	const { playback, states } = start(false, true);
	observer().fire(1);
	vi.advanceTimersByTime(TRACE_BEAT_MS * 2 + 200);
	expect(playback.getState().shown).toHaveLength(3);

	fakeDocument.setVisibility("hidden");
	const changes = states.length;
	vi.advanceTimersByTime(TRACE_BEAT_MS * 40);
	expect(states).toHaveLength(changes);
	expect(playback.getState().shown).toHaveLength(3);
	expect(vi.getTimerCount()).toBe(0);

	// Resumes with the rest of the interrupted beat (300 ms), not a fresh one.
	fakeDocument.setVisibility("visible");
	vi.advanceTimersByTime(299);
	expect(playback.getState().shown).toHaveLength(3);
	vi.advanceTimersByTime(1);
	expect(playback.getState().shown).toHaveLength(4);

	// The hold pauses too: settle, wait part of the hold, hide, wait, show, finish the hold.
	vi.advanceTimersByTime(TRACE_BEAT_MS * 3);
	expect(playback.getState().working).toBe(false);
	vi.advanceTimersByTime(1000);
	fakeDocument.setVisibility("hidden");
	vi.advanceTimersByTime(TRACE_HOLD_MS * 4);
	expect(playback.getState().working).toBe(false);
	expect(playback.getState().shown).toHaveLength(TRACE_STEPS.length);
	fakeDocument.setVisibility("visible");
	vi.advanceTimersByTime(TRACE_HOLD_MS - 1000 - 1);
	expect(playback.getState().shown).toHaveLength(TRACE_STEPS.length);
	vi.advanceTimersByTime(1);
	expect(playback.getState().shown).toHaveLength(0);
});

test("with loop, scrolling out of view freezes the cycle and scrolling back resumes it", () => {
	const { playback, states } = start(false, true);
	observer().fire(1);
	vi.advanceTimersByTime(TRACE_BEAT_MS);
	expect(playback.getState().shown).toHaveLength(2);

	// Below the 40% threshold counts as out of view.
	observer().fire(0.1);
	const changes = states.length;
	vi.advanceTimersByTime(TRACE_BEAT_MS * 40);
	expect(states).toHaveLength(changes);
	expect(vi.getTimerCount()).toBe(0);
	expect(observer().disconnected).toBe(false);

	observer().fire(0.6);
	vi.advanceTimersByTime(TRACE_BEAT_MS);
	expect(playback.getState().shown).toHaveLength(3);
});

test("without loop, it plays only once even if the element leaves and re-enters", () => {
	const { playback, states } = start();
	observer().fire(1);
	observer().fire(0);
	vi.advanceTimersByTime(TRACE_BEAT_MS * 20);
	expect(playback.getState().working).toBe(false);
	expect(playback.getState().shown).toHaveLength(TRACE_STEPS.length);
	const changes = states.length;

	observer().fire(0);
	observer().fire(1);
	fakeDocument.setVisibility("hidden");
	fakeDocument.setVisibility("visible");
	vi.advanceTimersByTime(TRACE_BEAT_MS * 20);
	expect(states).toHaveLength(changes);
	expect(states.filter((state) => state.shown.length === 1)).toHaveLength(1);
});

test("with loop, reduced motion stays settled: no loop and no reset", () => {
	const { playback, states } = start(true, true);
	vi.advanceTimersByTime((PLAY_MS + TRACE_HOLD_MS) * 3);
	fakeDocument.setVisibility("hidden");
	fakeDocument.setVisibility("visible");
	expect(playback.getState().shown).toEqual([...TRACE_STEPS]);
	expect(playback.getState().working).toBe(false);
	expect(states).toHaveLength(0);
	expect(vi.getTimerCount()).toBe(0);
});

test("reduced motion returns the settled state immediately", () => {
	const { playback, states } = start(true);
	expect(playback.getState()).toEqual({
		shown: [...TRACE_STEPS],
		working: false,
		elapsed: TRACE_SETTLE_SECONDS,
	});
	expect(FakeIntersectionObserver.instances).toHaveLength(0);
	expect(states).toHaveLength(0);
	expect(vi.getTimerCount()).toBe(0);
});

test("reduced motion starts settled and stays open: it never counts as played", () => {
	const { playback } = start(true);
	expect(playback.played()).toBe(false);
	vi.advanceTimersByTime(TRACE_BEAT_MS * 20);
	fakeDocument.setVisibility("hidden");
	fakeDocument.setVisibility("visible");
	// Still the settled trace with all six steps, and still not played, so SkillTrace passes
	// `collapseOnSettle={false}` and the steps stay listed.
	expect(playback.played()).toBe(false);
	expect(playback.getState().shown).toEqual([...TRACE_STEPS]);
	expect(playback.getState().working).toBe(false);
});

test("played turns true only when a real play begins", () => {
	const { playback } = start();
	expect(playback.played()).toBe(false);
	observer().fire(0.2);
	expect(playback.played()).toBe(false);
	observer().fire(1);
	expect(playback.played()).toBe(true);
	vi.advanceTimersByTime(TRACE_BEAT_MS * 20);
	expect(playback.getState().working).toBe(false);
	expect(playback.played()).toBe(true);
});

test("stop() cancels a playback in flight and observes nothing further", () => {
	const { playback } = start();
	observer().fire(1);
	vi.advanceTimersByTime(TRACE_BEAT_MS);
	playback.stop();
	expect(vi.getTimerCount()).toBe(0);
	expect(observer().disconnected).toBe(true);
	expect(playback.getState().shown).toHaveLength(2);
});

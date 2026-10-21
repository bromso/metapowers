import { expect, test } from "vitest";
import { TRACE_BEAT_MS, TRACE_SETTLED_LABEL, TRACE_SETTLE_SECONDS, TRACE_STEPS } from "./trace";

test("trace copy is fixed", () => {
	expect(TRACE_STEPS).toHaveLength(6);
	// The skill loads, reads Figma, then reads the WCAG file in its process step 3.
	expect(TRACE_STEPS[0]).toBe("Loaded skill: design/empathize");
	expect(TRACE_STEPS[3]).toBe(
		"Read shared/wcag-criteria.md and checked the criteria the component must meet",
	);
	expect(TRACE_STEPS[4]).toContain(".metapowers/design/date-picker/01-empathize.md");
	expect(TRACE_BEAT_MS).toBe(500);
	expect(TRACE_SETTLE_SECONDS * 1000).toBe(TRACE_STEPS.length * TRACE_BEAT_MS);
	expect(TRACE_SETTLED_LABEL).toBe("Thought for 3s · wrote 01-empathize.md");
});

/**
 * Thought Line copy for the homepage "How it works" section (spec §4.3).
 * The step list was checked against `skills/design-empathize/SKILL.md` and
 * `workflows/design.yml` — every line is something the skill really does, in the order
 * it does it. If a later change to the empathize skill makes a line untrue, rewrite the
 * line and this file's test together.
 */

/** Working label shown while the trace plays. */
export const TRACE_LABEL = "Running /design-empathize date-picker";

/** Six steps, appended one per beat; fixed by the spec and pinned by lib/trace.test.ts. */
export const TRACE_STEPS: readonly string[] = [
	"Loaded skill: design-empathize",
	"Read the Figma file through the Figma MCP server",
	"Inferred user needs, context and existing patterns",
	"Read references/wcag-criteria.md and checked the criteria the component must meet",
	"Gate passed (01-empathize needs no prior phase) · wrote .singularskills/design/date-picker/01-empathize.md",
	"Next: /design-define-component reads it",
];

/** Beat interval between appended steps, in milliseconds. */
export const TRACE_BEAT_MS = 500;

/** Fake elapsed time the trace settles on (6 steps × 500 ms beat), not a real clock. */
export const TRACE_SETTLE_SECONDS = 3;

/** Label shown once the trace has settled after its last step. */
export const TRACE_SETTLED_LABEL = "Thought for 3s · wrote 01-empathize.md";

/**
 * The three original "How it works" captions (from `components/home/HowItWorks.tsx`),
 * kept beneath the trace card so the no-JS and reduced-motion page still reads as three steps.
 */
export const TRACE_CAPTIONS: readonly [string, string, string] = [
	"Install the pack once with one command, in any agent.",
	"Run a skill with a project name and it asks for what it can't infer.",
	"Numbered artifacts land in .singularskills/, gates stop you skipping steps.",
];

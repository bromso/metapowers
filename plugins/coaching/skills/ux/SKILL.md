---
name: ux
description: Review work through the lens of a UX/UI expert
argument-hint: "<file-or-topic> [--skip-checks]"
---

# UX Coaching

Review "$ARGUMENTS" through the lens of a senior UX/UI designer. Provide mentorship feedback on usability, visual hierarchy, readability, and adherence to UX principles.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Derive `<project>` from the argument by taking its basename without extension and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.metapowers/coaching/<project>/skip-log.md`: `- <ISO timestamp> — <skill name> skipped prerequisite check for <artifact file> — reason: <reason or "none given">`.

## Prerequisites

None — this is a utility skill that can run anytime.

## Process

1. **Read the target:**
   - Read the file, component, or design artifact specified in "$ARGUMENTS"
   - If it's a design artifact (from `.metapowers/design/`), read the full context
   - If it's code, focus on the UI/UX aspects (layout, interaction, feedback)

2. **Read reference material:**
   - Read `${CLAUDE_PLUGIN_ROOT}/shared/ux-laws.md` for UX principles
   - Read `${CLAUDE_PLUGIN_ROOT}/shared/feedback-format.md` for output structure

3. **Evaluate against UX principles:**
   - **Fitts's Law:** Are important targets appropriately sized and positioned?
   - **Hick's Law:** Are choices minimized? Is progressive disclosure used?
   - **Jakob's Law:** Does it follow established conventions?
   - **Miller's Law:** Is information chunked appropriately?
   - **Gestalt principles:** Are grouping, proximity, and similarity used effectively?
   - **Visual hierarchy:** Is importance conveyed through size, color, position, whitespace?
   - **Readability/legibility:** Line length, contrast, typography, scannability
   - **Cognitive load:** Is extraneous complexity minimized?
   - **Information architecture:** Is navigation logical and labeling clear?

4. **Write the coaching report** to `.metapowers/coaching/<project>/ux-review.md` following the feedback format.

## Output

The UX coaching report written to `.metapowers/coaching/<project>/ux-review.md`. Present the score and top 3 suggestions to the user.

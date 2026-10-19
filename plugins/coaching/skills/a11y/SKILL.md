---
description: Review work through the lens of an accessibility specialist
---

# Accessibility Coaching

Review "$ARGUMENTS" through the lens of an accessibility specialist. Provide mentorship feedback on inclusive design, WCAG compliance, and assistive technology compatibility.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Derive `<project>` from the argument by taking its basename without extension and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.metapowers/coaching/<project>/skip-log.md`: `- <ISO timestamp> — <skill name> skipped prerequisite check for <artifact file> — reason: <reason or "none given">`.

## Prerequisites

None — this is a utility skill that can run anytime.

## Process

1. **Read the target:**
   - Read the file, component, or content specified in "$ARGUMENTS"

2. **Check for project accessibility context:**
   - Look for `.metapowers/accessibility/` directories for prior audit results
   - If the accessibility plugin's shared resources exist, read `${CLAUDE_PLUGIN_ROOT}/shared/wcag-21-aa-criteria.md`

3. **Read reference material:**
   - Read `${CLAUDE_PLUGIN_ROOT}/shared/feedback-format.md` for output structure

4. **Evaluate for accessibility:**
   - **Perceivable:** Alt text, captions, contrast, text resize, content reflow
   - **Operable:** Keyboard access, focus management, no traps, timing, navigation
   - **Understandable:** Language, predictability, input assistance, error messages
   - **Robust:** Valid markup, ARIA usage, name/role/value, status messages
   - **Inclusive design:** Does it work for users with visual, auditory, motor, and cognitive disabilities?
   - **Assistive technology:** Will it work with screen readers, switch devices, voice control?

5. **Write the coaching report** to `.metapowers/coaching/<project>/a11y-review.md` following the feedback format.

## Output

The accessibility coaching report written to `.metapowers/coaching/<project>/a11y-review.md`. Present the score and top 3 suggestions to the user.

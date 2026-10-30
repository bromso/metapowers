---
name: accessibility-checklist
description: Check a page, component or directory against a quick WCAG AA checklist — images, structure, contrast, keyboard, forms, ARIA, motion — reporting pass or fail with quick fixes in the chat. Use when the user wants a fast accessibility check of one piece of code rather than a formal audit. Not for a Figma design or mentoring feedback; see /design-a11y-audit or /coaching-a11y.
metadata:
  argument-hint: "<component or page>"
  stack-aware: true
---

# Checklist

Run a quick WCAG 2.1 AA accessibility checklist against "$ARGUMENTS". This is a lightweight check — use the full audit workflow (scope → evaluate → report) for comprehensive testing.

## Prerequisites

**Stack.** Before you build, test, lint, run or generate code, read the `Stack` section of the project's `AGENTS.md`, or of `CLAUDE.md` when `AGENTS.md` has none. Use its commands exactly as written, its `layout` for where files go and its `rules` as requirements. If it names a `profile`, also read the file `<profile>.md` in the `stacks` folder of this skill's bundled references for the full commands, layout and rules; the project's own keys win where both speak. If there is no `Stack` section, run the `singular-detect` skill, state what you inferred in one line, and offer to write the section with `singular-init`. Never assume a package manager, test runner or formatter the project did not declare.

None — this is a utility skill that can run anytime.

## Process

1. **Read the target:**
   - Read the source code of "$ARGUMENTS" (file, component, or page)
   - If "$ARGUMENTS" is a directory, check all relevant files

2. **Check each category:**

   **Images & Media:**
   - [ ] All images have meaningful alt text (or alt="" if decorative)
   - [ ] Videos have captions
   - [ ] Audio has transcripts

   **Structure:**
   - [ ] Page has one h1
   - [ ] Heading hierarchy is sequential (no skipped levels)
   - [ ] Landmark regions used (main, nav, header, footer)
   - [ ] Lists use proper list elements
   - [ ] Tables have headers

   **Color & Contrast:**
   - [ ] Text contrast ratio >= 4.5:1 (3:1 for large text)
   - [ ] UI component contrast >= 3:1
   - [ ] Color is not the only way information is conveyed

   **Keyboard:**
   - [ ] All interactive elements are keyboard accessible
   - [ ] Focus order is logical
   - [ ] Focus indicator is visible
   - [ ] No keyboard traps

   **Forms:**
   - [ ] All inputs have associated labels
   - [ ] Required fields are indicated
   - [ ] Error messages are descriptive and associated with inputs
   - [ ] Form validation provides suggestions

   **ARIA:**
   - [ ] ARIA roles are correct
   - [ ] ARIA states update dynamically
   - [ ] Status messages use aria-live
   - [ ] Native HTML preferred over ARIA

   **Motion:**
   - [ ] prefers-reduced-motion is respected
   - [ ] Auto-playing content can be paused

3. **Report results** directly to the user (no artifact file):
   - Checklist items passed/failed
   - Quick fixes for any failures
   - Recommendation: full audit needed? (yes/no)

## References

- `references/stacks/bun-react-ts.md` and `references/stacks/rust-gpui.md`: the shipped stack profiles

## Output

Present the checklist results directly to the user. No artifact file created — this is a quick check, not a formal audit.

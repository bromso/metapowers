---
description: Quick WCAG 2.1 AA accessibility checklist for any page or component
---

# Checklist

Run a quick WCAG 2.1 AA accessibility checklist against "$ARGUMENTS". This is a lightweight check — use the full audit workflow (scope → evaluate → report) for comprehensive testing.

## Prerequisites

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

## Output

Present the checklist results directly to the user. No artifact file created — this is a quick check, not a formal audit.

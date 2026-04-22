---
description: Generate a Figma Slides presentation summarizing a component's design journey through all 5 phases
---

# Design Review

Generate a Figma Slides presentation that summarizes the design journey for "$ARGUMENTS" — covering research, definition, ideation, prototyping, and testing.

## Prerequisites

At least the Define phase (`.design/$ARGUMENTS/02-define.md`) should exist. More phases provide a richer presentation.

## Process

1. **Read all available phase artifacts:**
   - `.design/$ARGUMENTS/01-empathize.md` (research brief)
   - `.design/$ARGUMENTS/02-define.md` (component contract)
   - `.design/$ARGUMENTS/03-ideate.md` (design options)
   - `.design/$ARGUMENTS/04-prototype.md` (prototype notes)
   - `.design/$ARGUMENTS/05-test.md` (test report)

2. **Create a title slide:**
   - Call `figma_create_slide` with name "$ARGUMENTS — Design Review"
   - Call `figma_add_text_to_slide` with the component name as the title
   - Call `figma_add_text_to_slide` with the date as a subtitle

3. **Create a slide for each completed phase:**
   - For each phase artifact that exists, create a slide summarizing the key findings
   - Call `figma_add_text_to_slide` for headings and key points
   - If the prototype exists, call `figma_export_image` to capture the component and mention it in the slide

4. **Create a summary slide:**
   - Overall status (pass/fail from test report if available)
   - Key decisions made during the process
   - Next steps or open items

5. **Set slide transitions:**
   - Call `figma_set_slide_transition` with "DISSOLVE" for each slide

6. **Present the slide deck info** to the user with the slide count and a link to view in Figma.

## Output

A Figma Slides presentation created in the current file, summarizing the design journey for "$ARGUMENTS".

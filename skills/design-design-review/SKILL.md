---
name: design-design-review
description: Create a Figma Slides deck summarizing a component's design journey — research, contract, options, prototype and test results — with title and summary slides. Use when the user needs to present a component's design work to stakeholders or walk a team through it. Not for feedback on a design; see /coaching-ux or /design-test.
metadata:
  argument-hint: "[project] [--skip-checks]"
---

# Design Review

> **Note:** Figma steps require a Figma MCP server; see the design workflow page.

Generate a Figma Slides presentation that summarizes the design journey for "$ARGUMENTS" — covering research, definition, ideation, prototyping, and testing.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"design-design-review","workflow":"design","phase":null,"project":"<project>","event":"skipped","artifact":"<artifact file>","note":"<reason or \"none given\">"}`.

## Prerequisites

At least the Define phase (`.singularskills/design/<project>/02-define.md`) should exist. More phases provide a richer presentation.

## Process

1. **Read all available phase artifacts:**
   - `.singularskills/design/<project>/01-empathize.md` (research brief)
   - `.singularskills/design/<project>/02-define.md` (component contract)
   - `.singularskills/design/<project>/03-ideate.md` (design options)
   - `.singularskills/design/<project>/04-prototype.md` (prototype notes)
   - `.singularskills/design/<project>/05-test.md` (test report)

2. **Create a title slide:**
   - Call `figma_create_slide` with name "<project> — Design Review"
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

A Figma Slides presentation created in the current file, summarizing the design journey for "<project>".

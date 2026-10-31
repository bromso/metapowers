---
name: design-design-review
description: Create a design review deck summarizing a component's design journey — research, contract, options, prototype and test results — as Markdown, and as Figma Slides when a deck link is given. Use when the user needs to present a component's design work to stakeholders or walk a team through it. Not for feedback on a design; see /coaching-ux or /design-test.
metadata:
  argument-hint: "[project]"
  figma-aware: true
---

# Design Review

Write a design review deck for "$ARGUMENTS" — covering research, definition, ideation, prototyping and testing — as a Markdown file in the project's folder, and as Figma Slides when a deck link is given. Take `$ARGUMENTS` as `<project>`; all paths below use it.

## Prerequisites

**Figma.** Steps marked *Figma* use a Figma MCP server you connect to this agent yourself; this pack ships none and makes no network calls. Before the first such step, list the tools available to you and bind each capability the step names to one tool, as `references/figma-capabilities.md`, bundled with this skill, describes: the official Figma server's tool named there, else any tool whose description plainly does the same thing. With a capability bound, take the file key and node id from the `file:` line of the `## Tools` section of the project's latest earlier artifact, else from the Figma link the user gave; when a bound capability needs one and there is none, ask for the link once, with any other question you ask. With nothing bound, never ask for a link. Record the result in a `## Tools` section after any `## Recalled` section: a `- file:` line, one line per bound capability (`- read-tokens: get_variable_defs (figma)`), and a `- created:` line for node ids you created; or the single line `No Figma server: steps marked Figma ran without one.`; a skill with no artifact says the same in its summary. For an unbound capability do what the step's *Without Figma* line says: never ask the user to connect a server, never invent values a tool would have returned, and never report a step as run when it was not.

Append this line to `.singularskills/log.jsonl` before you write the deck (create the folder and file if missing): `{"ts":"<ISO timestamp>","skill":"design-design-review","workflow":"design","phase":null,"project":"<project>","event":"started","artifact":"review-deck.md","note":""}`.

At least the Define phase (`.singularskills/design/<project>/02-define.md`) should exist. More phases provide a richer deck.

## Process

1. **Read all available phase artifacts:**
   - `.singularskills/design/<project>/01-empathize.md` (research brief)
   - `.singularskills/design/<project>/02-define.md` (component contract)
   - `.singularskills/design/<project>/03-ideate.md` (design options)
   - `.singularskills/design/<project>/04-prototype.md` (prototype notes; its `## Tools` section holds the file link and the created node ids)
   - `.singularskills/design/<project>/05-test.md` (test report)

2. **Write the deck** to `.singularskills/design/<project>/review-deck.md`: a title slide (the component name and the date), one `## ` slide per completed phase with its key findings, and a summary slide with the overall status (pass or fail from the test report, when present), the key decisions and the next steps or open items. Open it with the frontmatter and close it with the sections given under Output.

3. **Publish to Slides** (only when the request or the conversation gives a `figma.com/slides/` link). *Figma (write-slides, screenshot):* create one slide per `## ` heading with its text, put a screenshot of the prototype's node on the prototype slide, and record the slide ids in the deck's `## Tools` `created:` line. *Without Figma:* skip this step; the Markdown deck is the deliverable.

4. **Present the deck** to the user: its path, the slide count, and the Slides link when published.

## Output

The deck written to `.singularskills/design/<project>/review-deck.md`, and the Figma Slides deck when a link was given and `write-slides` was bound.

After you have written the deck, append the `started` line of Prerequisites to `.singularskills/log.jsonl` with `"event":"finished"`: `{"ts":"<ISO timestamp>","skill":"design-design-review","workflow":"design","phase":null,"project":"<project>","event":"finished","artifact":"review-deck.md","note":""}`.

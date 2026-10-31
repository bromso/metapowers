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

**Figma.** Steps marked *Figma* use a Figma MCP server you connect to this agent yourself; this pack ships none and makes no network calls. Before you ask the user anything or run the first such step, list the tools available to you and bind each capability the step names to one tool, as `references/figma-capabilities.md`, bundled with this skill, describes: the official Figma server's tool named there, else any tool whose description plainly does the same thing. With a capability bound, take the file key and node id from a Figma link in the request or the conversation, else from the `file:` line of the `## Tools` section of the latest earlier artifact of this project that has one; when a bound capability needs one and there is none, ask for the link once, with any other question you ask. With nothing bound, never ask for a link. Record the result in a `## Tools` section after any `## Recalled` section: a `- file:` line (the Design file; a board or a deck goes on a `- board:` or `- deck:` line), one line per bound capability (`- read-tokens: get_variable_defs (figma)`), and a `- created:` line for node ids you created; or the single line `No Figma server: steps marked Figma ran without one.`; a skill with no artifact says the same in its summary. For an unbound capability do what the step's *Without Figma* line says, using first any values the user gave in the request or in files it names: never ask the user to connect a server, never invent values a tool would have returned, and never report a step as run when it was not.

Append this line to `.singularskills/log.jsonl` before you write the deck (create the folder and file if missing): `{"ts":"<ISO timestamp>","skill":"design-design-review","workflow":"design","phase":null,"project":"<project>","event":"started","artifact":"review-deck.md","note":""}`.

At least the Define phase (`.singularskills/design/<project>/02-define.md`) should exist. More phases provide a richer deck.

## Process

1. **Read all available phase artifacts:**
   - `.singularskills/design/<project>/01-empathize.md` (research brief)
   - `.singularskills/design/<project>/02-define.md` (component contract)
   - `.singularskills/design/<project>/03-ideate.md` (design options)
   - `.singularskills/design/<project>/04-prototype.md` (prototype notes; its `## Tools` section holds the file link and the created node ids)
   - `.singularskills/design/<project>/05-test.md` (test report)

2. **Write the deck** to `.singularskills/design/<project>/review-deck.md`: the frontmatter given under Output, the `## Tools` section, then one `## Slide <n>: <title>` section per slide: a title slide (the component name and the date), one slide per completed phase with its key findings, and a summary slide with the overall status (pass or fail from the test report, when present), the key decisions and the next steps or open items; close with the `## Decisions` and `## Open questions` sections given under Output.

3. **Publish to Slides** (only when the request or the conversation gives a `figma.com/slides/` link). *Figma (write-slides, screenshot):* create one slide per `## Slide` section with its text, put a screenshot of the prototype's node on the prototype slide, and record the deck link on a `- deck:` line and the slide ids on the `- created:` line of the deck's `## Tools` section. *Without Figma:* skip this step; the Markdown deck is the deliverable.

4. **Present the deck** to the user: its path, the slide count, and the Slides link when published.

## Output

The deck written to `.singularskills/design/<project>/review-deck.md`, and the Figma Slides deck when a link was given and `write-slides` was bound.

After you have written the deck, append the `started` line of Prerequisites to `.singularskills/log.jsonl` with `"event":"finished"`: `{"ts":"<ISO timestamp>","skill":"design-design-review","workflow":"design","phase":null,"project":"<project>","event":"finished","artifact":"review-deck.md","note":""}`.

The deck opens with this frontmatter (`agent` is the agent you run in, or `unknown`; this utility has no gate, so `phase` is `null` and `gate` is `none`):

```yaml
---
skill: design-design-review
workflow: design
phase: null
project: <project>
started: <ISO timestamp>
finished: <ISO timestamp>
agent: <the agent you run in, or "unknown">
gate: none
---
```

The deck ends with `## Decisions` and `## Open questions`, in this shape:

```markdown
## Decisions
- <what was chosen> — <why> — <what was rejected>

## Open questions
- <what the next phase or a reviewer must settle>
```

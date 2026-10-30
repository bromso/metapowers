---
name: design-empathize
description: Research a UI component before designing it — user needs, related components in the Figma design system and applicable WCAG requirements — into a research brief. Use when the user wants to design a new component and has nothing yet beyond its name or idea. Not for starting the whole design thinking process; see /workflow.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: design
  phase: 1
  artifact: 01-empathize.md
---

# Empathize

> **Note:** Figma steps require a Figma MCP server; see the design workflow page.

Research the problem space for "$ARGUMENTS" before any design work begins. Gather user needs, existing patterns, accessibility requirements, and contextual constraints.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"design-empathize","workflow":"design","phase":1,"project":"<project>","event":"skipped","artifact":"01-empathize.md","note":"<reason or \"none given\">"}`.

## Prerequisites

**Part of a workflow.** This skill is phase 1 (Empathize) of the Design Thinking workflow (`design`); cross-domain workflows run it too. First check `.singularskills/log.jsonl` for an open run for this project: a `run-started` line with `"project":"<project>"` and no later `run-finished` line for the same `workflow` and `project`. If one exists, the conductor is running you: continue here. Otherwise, if the user asked to start, run, continue or resume a process or workflow rather than this one step, do not continue here: invoke the `workflow` skill with the workflow the user asked for, or `design` when they named none, followed by `<project>`; it runs this phase in order, asks before it writes and records the run. Otherwise, unless the user named this skill, ask one question, since this is the first phase of its workflow: "Just this step, or the whole Design Thinking workflow?" End your turn and wait; on the whole workflow, hand off the same way; on just this step, continue here.

Before you start work, append this line to `.singularskills/log.jsonl` (create the folder and file if missing): `{"ts":"<ISO timestamp>","skill":"design-empathize","workflow":"design","phase":1,"project":"<project>","event":"started","artifact":"01-empathize.md","note":""}`.

None — this is the first phase.

## Process

1. **Ask before anything else.** Ask one question at a time, in plain language, about the component's users (who picks with it and why), the contexts it appears in (which flows, platforms and locales) and known constraints (an existing component being replaced, complaints, deadlines). End your turn after the first question and wait for the answer; ask the next only if the answer leaves a gap the brief needs. Never ask about tooling: a missing Figma server or an unreadable file is noted in the brief, not raised with the user.

2. **Read the design system** via the Figma MCP tools, if a server is available:
   - Call `figma_get_design_system` to fetch existing components, tokens, and styles
   - Call `figma_get_components` to list all published components
   - Identify components that overlap with or relate to "<project>"
   - No Figma server: write one line under a **Not checked** heading in the brief and continue

3. **Inspect existing components** (if found):
   - Call `figma_get_component` and `figma_get_component_for_dev` for related components
   - Call `figma_export_image` to get visual references
   - Document what exists, what works well, and what's missing

4. **Review accessibility requirements:**
   - Read `references/wcag-criteria.md` for applicable WCAG criteria; if it cannot be read, note that under **Not checked** and apply WCAG 2.2 AA from your own knowledge
   - Call `figma_a11y_contrast_check` on any existing color pairs used in related components
   - Note specific accessibility requirements for this component type

5. **Synthesize findings** into a research brief covering:
   - User needs and common use cases for this component type
   - Existing patterns found in the design system
   - Accessibility requirements and considerations
   - Contextual constraints (design tokens available, conventions established)
   - Gaps and opportunities

6. **Write the artifact** to `.singularskills/design/<project>/01-empathize.md`

## Output

The research brief written to `.singularskills/design/<project>/01-empathize.md`. Present a summary to the user highlighting:
- Key user needs identified
- Existing components found (if any)
- Critical accessibility requirements
- Recommended approach for the Define phase

**Record the run.** After you have written the artifact, append this line to `.singularskills/log.jsonl` (the `started` line of Prerequisites, with `"event":"finished"`): `{"ts":"<ISO timestamp>","skill":"design-empathize","workflow":"design","phase":1,"project":"<project>","event":"finished","artifact":"01-empathize.md","note":""}`.

Open the artifact with this frontmatter (`agent` is the agent you run in, or `unknown`; `gate` is `none`, as this phase has no gate):

```yaml
---
skill: design-empathize
workflow: design
phase: 1
project: <project>
started: <ISO timestamp>
finished: <ISO timestamp>
agent: <the agent you run in, or "unknown">
gate: none
---
```

End the artifact with `## Decisions` and `## Open questions`, in this shape:

```markdown
## Decisions
- <what was chosen> — <why> — <what was rejected>

## Open questions
- <what the next phase or a reviewer must settle>
```

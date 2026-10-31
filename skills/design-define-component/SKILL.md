---
name: design-define-component
description: Define a component contract — typed props, variant matrix, every interaction state, design-token references, ARIA and keyboard behavior, i18n — as the single spec for building it. Use when the user knows which component they need and wants its spec pinned down before exploring visual options.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: design
  phase: 2
  artifact: 02-define.md
  figma-aware: true
---

# Define Component

Produce a complete component contract for "$ARGUMENTS" that serves as the single source of truth for prototyping, implementation, and testing.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"design-define-component","workflow":"design","phase":2,"project":"<project>","event":"skipped","artifact":"02-define.md","note":"<reason or \"none given\">"}`.

## Prerequisites

**Part of a workflow.** This skill is phase 2 (Define) of the Design Thinking workflow (`design`); cross-domain workflows run it too. First check `.singularskills/log.jsonl` for an open run for this project: a `run-started` line with `"project":"<project>"` and no later `run-finished` line for the same `workflow` and `project`. If one exists, the conductor is running you: continue here. Otherwise, if the user asked to start, run, continue or resume a process or workflow rather than this one step, do not continue here: invoke the `workflow` skill with the workflow the user asked for, or `design` when they named none, followed by `<project>`; it runs this phase in order, asks before it writes and records the run. Otherwise continue here: a later phase runs on its own, behind its gate.

**Figma.** Steps marked *Figma* use a Figma MCP server you connect to this agent yourself; this pack ships none and makes no network calls. Before the first such step, list the tools available to you and bind each capability the step names to one tool, as `references/figma-capabilities.md`, bundled with this skill, describes: the official Figma server's tool named there, else any tool whose description plainly does the same thing. With a capability bound, take the file key and node id from the `file:` line of the `## Tools` section of the project's latest earlier artifact, else from the Figma link the user gave; when a bound capability needs one and there is none, ask for the link once, with any other question you ask. With nothing bound, never ask for a link. Record the result in a `## Tools` section after any `## Recalled` section: a `- file:` line, one line per bound capability (`- read-tokens: get_variable_defs (figma)`), and a `- created:` line for node ids you created; or the single line `No Figma server: steps marked Figma ran without one.`; a skill with no artifact says the same in its summary. For an unbound capability do what the step's *Without Figma* line says: never ask the user to connect a server, never invent values a tool would have returned, and never report a step as run when it was not.

Run this skill's gate before writing: `sh <this skill's folder>/scripts/gate.sh <project> <project root>`, where `<project root>` is the folder that contains `.singularskills/` (use `.` when you are already there). If it exits non-zero, stop and tell the user what it printed, unless `--skip-checks` was given (see Arguments). On a refusal, before you stop, append this line to `.singularskills/log.jsonl` (create the folder and file if missing): `{"ts":"<ISO timestamp>","skill":"design-define-component","workflow":"design","phase":2,"project":"<project>","event":"refused","artifact":"02-define.md","note":"<what the gate printed>"}`. Once the gate has passed, or under `--skip-checks` once you have appended the `skipped` line, append this line before you start work: `{"ts":"<ISO timestamp>","skill":"design-define-component","workflow":"design","phase":2,"project":"<project>","event":"started","artifact":"02-define.md","note":""}`.

Read `.singularskills/design/<project>/01-empathize.md`. If this file does not exist, tell the user:

> Phase 1 (Empathize) has not been completed for "<project>". Run `/design-empathize <project>` first, or use `--skip-checks` to bypass.

## Process

1. **Read context files:**
   - Read `references/component-contract-template.md` for the output structure
   - Read `references/wcag-criteria.md` for accessibility requirements
   - Read `.singularskills/design/<project>/01-empathize.md` for user needs and existing patterns (if exists)

2. **Read the design system.** *Figma (read-tokens, find-components):* read the file's variables and styles and search its libraries for components that overlap with this one; note the tokens available (colours, spacing, typography, radii) and the conventions in use. *Without Figma:* read the project's own token and component sources (a `tokens` package, CSS custom properties, a Tailwind config, component folders), else note `not checked`.

3. **Produce the component contract** following the template structure. Every field must be filled — no placeholders, no TBDs. Specifically:
   - **Props:** Complete with TypeScript types. Every prop has a default value rationale.
   - **Variant matrix:** Enumerate all dimensions. Calculate total combinations. Flag any combinations that should be excluded and explain why.
   - **States:** All of: default, hover, focus, active, disabled, error, loading. For each state, specify visual changes (which tokens change) and ARIA updates.
   - **Token references:** Use only tokens from the design system. Never use raw color values, pixel values, or hardcoded strings. If a needed token doesn't exist, flag it as "MISSING TOKEN: [description]". When no tokens could be read, write `not checked` in place of a token name, never a guessed one.
   - **Accessibility:** Map each WCAG criterion from the reference file. Specify keyboard interaction model, ARIA role, all ARIA attributes, focus management strategy.
   - **i18n:** Identify all translatable strings. Specify RTL behavior. State content expansion allowance (typically 30-50% for Western to CJK).

4. **Self-review the contract:**
   - Does every variant x state combination have defined token references?
   - Are there any raw values instead of tokens?
   - Is every interactive state keyboard-accessible?
   - Are ARIA attributes specified for every state change?

5. **Write the artifact** to `.singularskills/design/<project>/02-define.md`

## Output

The component contract written to `.singularskills/design/<project>/02-define.md`. Present a summary to the user highlighting:
- Total variant combinations
- Any missing tokens flagged
- Key accessibility decisions that need validation

**Record the run.** After you have written the artifact, append this line to `.singularskills/log.jsonl` (the `started` line of Prerequisites, with `"event":"finished"`): `{"ts":"<ISO timestamp>","skill":"design-define-component","workflow":"design","phase":2,"project":"<project>","event":"finished","artifact":"02-define.md","note":""}`.

Open the artifact with this frontmatter (`agent` is the agent you run in, or `unknown`; `gate` is `passed` when the gate ran clean and `skipped` under `--skip-checks`):

```yaml
---
skill: design-define-component
workflow: design
phase: 2
project: <project>
started: <ISO timestamp>
finished: <ISO timestamp>
agent: <the agent you run in, or "unknown">
gate: <passed|skipped>
---
```

End the artifact with `## Decisions` and `## Open questions`, in this shape:

```markdown
## Decisions
- <what was chosen> — <why> — <what was rejected>

## Open questions
- <what the next phase or a reviewer must settle>
```

---
name: design-define-component
description: Define a component contract — typed props, variant matrix, every interaction state, design-token references, ARIA and keyboard behavior, i18n — as the single spec for building it. Use when the user knows which component they need and wants its spec pinned down before exploring visual options.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: design
  phase: 2
  artifact: 02-define.md
---

# Define Component

> **Note:** Figma steps require a Figma MCP server; see the design workflow page.

Produce a complete component contract for "$ARGUMENTS" that serves as the single source of truth for prototyping, implementation, and testing.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"design-define-component","workflow":"design","phase":2,"project":"<project>","event":"skipped","artifact":"02-define.md","note":"<reason or \"none given\">"}`.

## Prerequisites

Run this skill's gate before writing: `sh <this skill's folder>/scripts/gate.sh <project> <project root>`, where `<project root>` is the folder that contains `.singularskills/` (use `.` when you are already there). If it exits non-zero, stop and tell the user what it printed, unless `--skip-checks` was given (see Arguments). On a refusal, before you stop, append this line to `.singularskills/log.jsonl` (create the folder and file if missing): `{"ts":"<ISO timestamp>","skill":"design-define-component","workflow":"design","phase":2,"project":"<project>","event":"refused","artifact":"02-define.md","note":"<what the gate printed>"}`. Once the gate has passed, or under `--skip-checks` once you have appended the `skipped` line, append this line before you start work: `{"ts":"<ISO timestamp>","skill":"design-define-component","workflow":"design","phase":2,"project":"<project>","event":"started","artifact":"02-define.md","note":""}`.

Read `.singularskills/design/<project>/01-empathize.md`. If this file does not exist, tell the user:

> Phase 1 (Empathize) has not been completed for "<project>". Run `/design-empathize <project>` first, or use `--skip-checks` to bypass.

## Process

1. **Read context files:**
   - Read `references/component-contract-template.md` for the output structure
   - Read `references/wcag-criteria.md` for accessibility requirements
   - Read `.singularskills/design/<project>/01-empathize.md` for user needs and existing patterns (if exists)

2. **Read the design system** via MCP tools `figma_get_design_system` and `figma_get_variables`:
   - Existing components that overlap with this one
   - Available design tokens (colors, spacing, typography, radii)
   - Established patterns and conventions

3. **Produce the component contract** following the template structure. Every field must be filled — no placeholders, no TBDs. Specifically:
   - **Props:** Complete with TypeScript types. Every prop has a default value rationale.
   - **Variant matrix:** Enumerate all dimensions. Calculate total combinations. Flag any combinations that should be excluded and explain why.
   - **States:** All of: default, hover, focus, active, disabled, error, loading. For each state, specify visual changes (which tokens change) and ARIA updates.
   - **Token references:** Use only tokens from the design system. Never use raw color values, pixel values, or hardcoded strings. If a needed token doesn't exist, flag it as "MISSING TOKEN: [description]".
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

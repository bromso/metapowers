---
name: design-prototype
description: Build a component in Figma with every variant and state from its contract, using design-system tokens and the chosen approach. Use when a design direction has been picked and the user wants the component actually drawn on the Figma canvas.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: design
  phase: 4
  artifact: 04-prototype.md
---

# Prototype

> **Note:** Figma steps require a Figma MCP server; see the design workflow page.

Build "$ARGUMENTS" in Figma as a component with all variants and states specified in the component contract.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"design-prototype","workflow":"design","phase":4,"project":"<project>","event":"skipped","artifact":"04-prototype.md","note":"<reason or \"none given\">"}`.

## Prerequisites

Run this skill's gate before writing: `sh <this skill's folder>/scripts/gate.sh <project> <project root>`, where `<project root>` is the folder that contains `.singularskills/` (use `.` when you are already there). If it exits non-zero, stop and tell the user what it printed, unless `--skip-checks` was given (see Arguments).

Read `.singularskills/design/<project>/02-define.md` (required — hard gate enforced by hook).
Read `.singularskills/design/<project>/03-ideate.md`. If this file does not exist, tell the user:

> Phase 3 (Ideate) has not been completed for "<project>". Run `/design-ideate <project>` first, or use `--skip-checks` to bypass.

## Process

1. **Read context files:**
   - Read `.singularskills/design/<project>/02-define.md` for the component contract (props, variants, states, tokens)
   - Read `.singularskills/design/<project>/03-ideate.md` for the chosen design approach (if exists)
   - Read `references/component-contract-template.md` for reference

2. **Read the design system** via MCP tools:
   - Call `figma_get_variables` to get current token values for fills, spacing, typography
   - Call `figma_get_design_system_summary` to understand the system structure

3. **Build the base component:**
   - Call `figma_create_component` with the component name and base dimensions
   - Call `figma_set_auto_layout` to establish layout structure
   - Call `figma_create_text` for text elements
   - Call `figma_create_shape` for visual elements
   - Call `figma_apply_styles` to apply token-based fills, strokes, and effects

4. **Build variant components** for each variant dimension:
   - Create a component for each variant value
   - Call `figma_arrange_component_set` to combine as a variant set

5. **Apply states** to each variant:
   - Modify fills, opacity, and effects for hover, focus, active, disabled, error, loading states

6. **Verify the prototype:**
   - Call `figma_export_image` to capture a visual of the built component
   - Compare against the component contract requirements

7. **Write the artifact** to `.singularskills/design/<project>/04-prototype.md` with implementation notes

## Output

The Figma component built on the canvas and notes written to `.singularskills/design/<project>/04-prototype.md`. Present to the user:
- Component node ID for reference
- Visual export of the component
- Any deviations from the contract and why
- Notes for the Test phase

**Record the run.** Append each of these events to `.singularskills/log.jsonl` as one line (create the folder and file if missing):

- Before you start work (once the gate has passed or `--skip-checks` was given): `{"ts":"<ISO timestamp>","skill":"design-prototype","workflow":"design","phase":4,"project":"<project>","event":"started","artifact":"04-prototype.md","note":""}`
- After you have written the artifact: the same line with `"event":"finished"`.
- If the gate refused and the user did not bypass it: the same line with `"event":"refused"` and `"note"` set to what the gate printed, instead of the other two; then stop.

Open the artifact with this frontmatter (`agent` is the agent you run in, or `unknown`; `gate` is `passed` when the gate ran clean and `skipped` under `--skip-checks`):

```yaml
---
skill: design-prototype
workflow: design
phase: 4
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

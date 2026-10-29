---
name: design-ideate
description: Explore at least three visual and layout approaches for a specified component, compare their trade-offs against its contract and recommend one. Use when the component's spec exists and the user wants options to choose from before building it in Figma. Not for solution concepts to a broader problem; see /research-design.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: design
  phase: 3
  artifact: 03-ideate.md
---

# Ideate

> **Note:** Figma steps require a Figma MCP server; see the design workflow page.

Generate multiple design options for "$ARGUMENTS" before committing to a single approach. Encourage creative exploration by producing at least 3 distinct options.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"design-ideate","workflow":"design","phase":3,"project":"<project>","event":"skipped","artifact":"03-ideate.md","note":"<reason or \"none given\">"}`.

## Prerequisites

Run this skill's gate before writing: `sh <this skill's folder>/scripts/gate.sh <project> <project root>`, where `<project root>` is the folder that contains `.singularskills/` (use `.` when you are already there). If it exits non-zero, stop and tell the user what it printed, unless `--skip-checks` was given (see Arguments).

Read `.singularskills/design/<project>/02-define.md`. If this file does not exist, tell the user:

> Phase 2 (Define) has not been completed for "<project>". Run `/design-define-component <project>` first, or use `--skip-checks` to bypass.

## Process

1. **Read context files:**
   - Read `.singularskills/design/<project>/01-empathize.md` for research findings (if exists)
   - Read `.singularskills/design/<project>/02-define.md` for the component contract
   - Read `references/wcag-criteria.md` for accessibility constraints

2. **Read the design system** via MCP tools:
   - Call `figma_get_design_system` to understand available tokens and patterns
   - Call `figma_get_variables` with `exportFormat: "json"` to get token values

3. **Generate 3+ design options.** For each option:
   - Describe the visual approach and layout strategy
   - Map which tokens from the design system would be used
   - Evaluate against the component contract's constraints
   - Assess accessibility compliance
   - Note trade-offs (complexity, flexibility, consistency)

4. **Create a FigJam brainstorming board** (if FigJam is available):
   - Call `figjam_create_stickies` with each option as a sticky note
   - Call `figjam_create_table` with a comparison matrix

5. **Recommend one approach** with clear rationale explaining why it best satisfies the component contract.

6. **Write the artifact** to `.singularskills/design/<project>/03-ideate.md`

## Output

The ideation document written to `.singularskills/design/<project>/03-ideate.md`. Present a summary to the user highlighting:
- Number of options explored
- Recommended approach and rationale
- Key trade-offs between options
- Any contract constraints that were difficult to satisfy

**Record the run.** Append each of these events to `.singularskills/log.jsonl` as one line (create the folder and file if missing):

- Before you start work (once the gate has passed or `--skip-checks` was given): `{"ts":"<ISO timestamp>","skill":"design-ideate","workflow":"design","phase":3,"project":"<project>","event":"started","artifact":"03-ideate.md","note":""}`
- After you have written the artifact: the same line with `"event":"finished"`.
- If the gate refused and the user did not bypass it: the same line with `"event":"refused"` and `"note"` set to what the gate printed, instead of the other two; then stop.

Open the artifact with this frontmatter (`agent` is the agent you run in, or `unknown`; `gate` is `passed` when the gate ran clean and `skipped` under `--skip-checks`):

```yaml
---
skill: design-ideate
workflow: design
phase: 3
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

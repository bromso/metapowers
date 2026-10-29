---
name: design-test
description: Test a built Figma component against its contract and WCAG — props, variants, states, tokens, contrast, color blindness, focus order — with a pass or fail report. Use when the component has been prototyped and the user wants to know whether it is ready to hand off. Not for a quick check of any frame without a contract; see /design-a11y-audit.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: design
  phase: 5
  artifact: 05-test.md
---

# Test

> **Note:** Figma steps require a Figma MCP server; see the design workflow page.

Validate the "$ARGUMENTS" prototype against the component contract and WCAG accessibility criteria.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"design-test","workflow":"design","phase":5,"project":"<project>","event":"skipped","artifact":"05-test.md","note":"<reason or \"none given\">"}`.

## Prerequisites

Run this skill's gate before writing: `sh <this skill's folder>/scripts/gate.sh <project> <project root>`, where `<project root>` is the folder that contains `.singularskills/` (use `.` when you are already there). If it exits non-zero, stop and tell the user what it printed, unless `--skip-checks` was given (see Arguments). On a refusal, before you stop, append this line to `.singularskills/log.jsonl` (create the folder and file if missing): `{"ts":"<ISO timestamp>","skill":"design-test","workflow":"design","phase":5,"project":"<project>","event":"refused","artifact":"05-test.md","note":"<what the gate printed>"}`. Once the gate has passed, or under `--skip-checks` once you have appended the `skipped` line, append this line before you start work: `{"ts":"<ISO timestamp>","skill":"design-test","workflow":"design","phase":5,"project":"<project>","event":"started","artifact":"05-test.md","note":""}`.

Read `.singularskills/design/<project>/04-prototype.md`. If this file does not exist, tell the user:

> Phase 4 (Prototype) has not been completed for "<project>". Run `/design-prototype <project>` first, or use `--skip-checks` to bypass.

## Process

1. **Read context files:**
   - Read `.singularskills/design/<project>/02-define.md` for the component contract
   - Read `.singularskills/design/<project>/04-prototype.md` for prototype notes and component node ID
   - Read `references/wcag-criteria.md` for accessibility criteria

2. **Run accessibility checks** via MCP tools:
   - Call `figma_a11y_lint` with the component's node ID to check text size, touch targets, image alt text
   - Call `figma_a11y_scorecard` with the component's node ID for an overall scorecard
   - Call `figma_a11y_focus_order` with the component's node ID to validate tab order

3. **Check color contrast:**
   - Call `figma_a11y_contrast_check` for each foreground/background color pair used in the component
   - Call `figma_a11y_color_blind_sim` for primary color pairs across protanopia, deuteranopia, tritanopia

4. **Verify contract compliance.** For each requirement in the component contract:
   - Props: Are all specified props represented in the component?
   - Variants: Does the component have all variant combinations?
   - States: Are all states (hover, focus, active, disabled, error, loading) represented?
   - Tokens: Are all visual values using design system tokens?

5. **Generate the test report** with:
   - Contract compliance checklist (pass/fail per requirement)
   - WCAG validation results (from lint and contrast checks)
   - Color blindness simulation results
   - Issues found with remediation suggestions
   - Overall pass/fail status

6. **Write the artifact** to `.singularskills/design/<project>/05-test.md`

## Output

The test report written to `.singularskills/design/<project>/05-test.md`. Present to the user:
- Overall pass/fail status
- Number of issues found by category (contract, WCAG, color blindness)
- Critical issues requiring immediate attention
- Remediation suggestions for failed checks

**Record the run.** After you have written the artifact, append this line to `.singularskills/log.jsonl` (the `started` line of Prerequisites, with `"event":"finished"`): `{"ts":"<ISO timestamp>","skill":"design-test","workflow":"design","phase":5,"project":"<project>","event":"finished","artifact":"05-test.md","note":""}`.

Open the artifact with this frontmatter (`agent` is the agent you run in, or `unknown`; `gate` is `passed` when the gate ran clean and `skipped` under `--skip-checks`):

```yaml
---
skill: design-test
workflow: design
phase: 5
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

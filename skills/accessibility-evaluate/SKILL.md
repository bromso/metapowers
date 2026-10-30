---
name: accessibility-evaluate
description: Evaluate the scoped pages for accessibility barriers — keyboard, focus, reading order, forms, live regions — mapping each issue to a WCAG criterion and severity. Use when an audit scope is set and the user wants the issues in those pages found. Not for a design-stage check or feedback on one component; see /accessibility-checklist, /design-a11y-audit or /coaching-a11y.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: accessibility
  phase: 2
  artifact: 02-evaluate.md
---

# Evaluate

Evaluate "$ARGUMENTS" for accessibility issues. Run automated and manual checks, discover barriers, and map each issue to specific WCAG success criteria.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"accessibility-evaluate","workflow":"accessibility","phase":2,"project":"<project>","event":"skipped","artifact":"02-evaluate.md","note":"<reason or \"none given\">"}`.

## Prerequisites

**Part of a workflow.** This skill is phase 2 (Evaluate) of the WCAG-EM workflow (`accessibility`); cross-domain workflows run it too. Unless the user named this skill, check `.singularskills/log.jsonl` for an open run for this project: a `run-started` line with `"project":"<project>"` and no later `run-finished` line for the same `workflow` and `project`. If there is no open run, or the user asked to start, run, continue or resume a process or workflow rather than this one step, do not continue here: invoke the `workflow` skill with the workflow the user asked for, or `accessibility` when they named none, followed by `<project>`. It runs this phase in order, asks before it writes and records the run. Continue here when the user named this skill, or when an open run exists (the conductor is running you).

Run this skill's gate before writing: `sh <this skill's folder>/scripts/gate.sh <project> <project root>`, where `<project root>` is the folder that contains `.singularskills/` (use `.` when you are already there). If it exits non-zero, stop and tell the user what it printed, unless `--skip-checks` was given (see Arguments). On a refusal, before you stop, append this line to `.singularskills/log.jsonl` (create the folder and file if missing): `{"ts":"<ISO timestamp>","skill":"accessibility-evaluate","workflow":"accessibility","phase":2,"project":"<project>","event":"refused","artifact":"02-evaluate.md","note":"<what the gate printed>"}`. Once the gate has passed, or under `--skip-checks` once you have appended the `skipped` line, append this line before you start work: `{"ts":"<ISO timestamp>","skill":"accessibility-evaluate","workflow":"accessibility","phase":2,"project":"<project>","event":"started","artifact":"02-evaluate.md","note":""}`.

Read `.singularskills/accessibility/<project>/01-scope.md`. If this file does not exist, tell the user:

> Phase 1 (Scope) has not been completed for "<project>". Run `/accessibility-scope <project>` first, or use `--skip-checks` to bypass.

## Process

1. **Read context files:**
   - Read `.singularskills/accessibility/<project>/01-scope.md` for audit scope and target pages
   - Read `references/wcag-21-aa-criteria.md` for the full criteria reference

2. **Automated evaluation:**
   - Read the source code of the target pages/components
   - Check for: missing alt text, missing form labels, heading hierarchy violations, missing ARIA attributes, color contrast issues, missing lang attribute, keyboard trap risks

3. **Manual evaluation:**
   - Trace keyboard navigation flow — can all interactive elements be reached and operated?
   - Check focus visibility — is focus indicator visible on every interactive element?
   - Check reading order — does DOM order match visual order?
   - Check form error handling — are errors identified and described in text?
   - Check dynamic content — are updates announced via ARIA live regions?

4. **Map each issue to WCAG criteria:**
   - For each issue found, identify the specific WCAG success criterion violated
   - Classify severity: Critical (blocks access), Major (significant barrier), Minor (inconvenience)
   - Note the location (file, line, component)

5. **Write the artifact** to `.singularskills/accessibility/<project>/02-evaluate.md` with sections:
   - **Issues Found** — each issue with WCAG mapping, severity, location
   - **Conformance Status** — per-principle pass/fail summary
   - **Critical Barriers** — issues that completely block access
   - **Positive Findings** — what's already working well

## Output

The evaluation results written to `.singularskills/accessibility/<project>/02-evaluate.md`. Present a summary to the user highlighting:
- Total issues found by severity
- Critical barriers requiring immediate attention
- WCAG principles with most violations

**Record the run.** After you have written the artifact, append this line to `.singularskills/log.jsonl` (the `started` line of Prerequisites, with `"event":"finished"`): `{"ts":"<ISO timestamp>","skill":"accessibility-evaluate","workflow":"accessibility","phase":2,"project":"<project>","event":"finished","artifact":"02-evaluate.md","note":""}`.

Open the artifact with this frontmatter (`agent` is the agent you run in, or `unknown`; `gate` is `passed` when the gate ran clean and `skipped` under `--skip-checks`):

```yaml
---
skill: accessibility-evaluate
workflow: accessibility
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

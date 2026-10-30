---
name: accessibility-report
description: Write an accessibility audit report — executive summary, conformance status, issues by WCAG principle with code fixes, and prioritized remediation. Use when accessibility testing is done and the user needs a report stakeholders or developers can act on. Not for a design-stage check or feedback on one component; see /accessibility-checklist, /design-a11y-audit or /coaching-a11y.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: accessibility
  phase: 3
  artifact: 03-report.md
---

# Report

Generate a comprehensive accessibility audit report for "$ARGUMENTS" with executive summary, detailed findings, and prioritized remediation steps.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"accessibility-report","workflow":"accessibility","phase":3,"project":"<project>","event":"skipped","artifact":"03-report.md","note":"<reason or \"none given\">"}`.

## Prerequisites

**Part of a workflow.** This skill is phase 3 (Report) of the WCAG-EM workflow (`accessibility`); cross-domain workflows run it too. Unless the user named this skill, check `.singularskills/log.jsonl` for an open run for this project: a `run-started` line with `"project":"<project>"` and no later `run-finished` line for the same `workflow` and `project`. If there is no open run, or the user asked to start, run, continue or resume a process or workflow rather than this one step, do not continue here: invoke the `workflow` skill with the workflow the user asked for, or `accessibility` when they named none, followed by `<project>`. It runs this phase in order, asks before it writes and records the run. Continue here when the user named this skill, or when an open run exists (the conductor is running you).

Run this skill's gate before writing: `sh <this skill's folder>/scripts/gate.sh <project> <project root>`, where `<project root>` is the folder that contains `.singularskills/` (use `.` when you are already there). If it exits non-zero, stop and tell the user what it printed, unless `--skip-checks` was given (see Arguments). On a refusal, before you stop, append this line to `.singularskills/log.jsonl` (create the folder and file if missing): `{"ts":"<ISO timestamp>","skill":"accessibility-report","workflow":"accessibility","phase":3,"project":"<project>","event":"refused","artifact":"03-report.md","note":"<what the gate printed>"}`. Once the gate has passed, or under `--skip-checks` once you have appended the `skipped` line, append this line before you start work: `{"ts":"<ISO timestamp>","skill":"accessibility-report","workflow":"accessibility","phase":3,"project":"<project>","event":"started","artifact":"03-report.md","note":""}`.

Read `.singularskills/accessibility/<project>/02-evaluate.md`. If this file does not exist, tell the user:

> Phase 2 (Evaluate) has not been completed for "<project>". Run `/accessibility-evaluate <project>` first, or use `--skip-checks` to bypass.

## Process

1. **Read context files:**
   - Read `.singularskills/accessibility/<project>/01-scope.md` for audit scope
   - Read `.singularskills/accessibility/<project>/02-evaluate.md` for discovered issues
   - Read `references/audit-report-template.md` for output structure
   - Read `references/remediation-patterns.md` for fix guidance

2. **Create executive summary:**
   - Overall conformance status
   - Total issues by severity
   - Key findings in plain language
   - Business impact assessment

3. **Document detailed findings:**
   - For each issue: description, WCAG criterion, severity, location, impact, remediation steps
   - Include code examples (before/after) where applicable
   - Group by WCAG principle for easy navigation

4. **Prioritize remediation:**
   - Critical issues first (blocking access)
   - Then major issues (significant barriers)
   - Then minor issues (enhancements)
   - Estimate effort for each fix (quick fix vs. significant rework)

5. **Write the artifact** to `.singularskills/accessibility/<project>/03-report.md` following the audit report template.

## Output

The audit report written to `.singularskills/accessibility/<project>/03-report.md`. Present a summary to the user highlighting:
- Conformance status
- Top priority issues to fix
- Estimated remediation effort

**Record the run.** After you have written the artifact, append this line to `.singularskills/log.jsonl` (the `started` line of Prerequisites, with `"event":"finished"`): `{"ts":"<ISO timestamp>","skill":"accessibility-report","workflow":"accessibility","phase":3,"project":"<project>","event":"finished","artifact":"03-report.md","note":""}`.

Open the artifact with this frontmatter (`agent` is the agent you run in, or `unknown`; `gate` is `passed` when the gate ran clean and `skipped` under `--skip-checks`):

```yaml
---
skill: accessibility-report
workflow: accessibility
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

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

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"<skill name>","workflow":"accessibility","phase":<phase>,"project":"<project>","event":"skipped","artifact":"<artifact file>","note":"<reason or \"none given\">"}`.

## Prerequisites

Run `scripts/gate.sh <project>` from this skill's folder. If it exits non-zero, stop and tell the user what it printed (unless `--skip-checks`, see Arguments).

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

**Record the run.** Open the artifact with this frontmatter (`agent` is the agent you run in, or `unknown`; `gate` is `passed` when the gate ran clean and `skipped` under `--skip-checks`):

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

End the artifact (or your section of a shared artifact) with `## Decisions` and `## Open questions`, in this shape:

```markdown
## Decisions
- <what was chosen> — <why> — <what was rejected>

## Open questions
- <what the next phase or a reviewer must settle>
```

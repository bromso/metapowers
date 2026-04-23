---
description: Generate a structured accessibility audit report with remediation guidance
---

# Report

Generate a comprehensive accessibility audit report for "$ARGUMENTS" with executive summary, detailed findings, and prioritized remediation steps.

## Prerequisites

Read `.accessibility/$ARGUMENTS/02-evaluate.md`. If this file does not exist, tell the user:

> Phase 2 (Evaluate) has not been completed for "$ARGUMENTS". Run `/accessibility:evaluate $ARGUMENTS` first, or use `--skip-checks` to bypass.

If `--skip-checks` is present in $ARGUMENTS, skip this check and log to `.accessibility/$ARGUMENTS/skip-log.md`.

## Process

1. **Read context files:**
   - Read `.accessibility/$ARGUMENTS/01-scope.md` for audit scope
   - Read `.accessibility/$ARGUMENTS/02-evaluate.md` for discovered issues
   - Read `plugins/accessibility/shared/audit-report-template.md` for output structure
   - Read `plugins/accessibility/shared/remediation-patterns.md` for fix guidance

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

5. **Write the artifact** to `.accessibility/$ARGUMENTS/03-report.md` following the audit report template.

## Output

The audit report written to `.accessibility/$ARGUMENTS/03-report.md`. Present a summary to the user highlighting:
- Conformance status
- Top priority issues to fix
- Estimated remediation effort

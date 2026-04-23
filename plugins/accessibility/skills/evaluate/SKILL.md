---
description: Run accessibility checks and discover issues mapped to WCAG criteria
---

# Evaluate

Evaluate "$ARGUMENTS" for accessibility issues. Run automated and manual checks, discover barriers, and map each issue to specific WCAG success criteria.

## Prerequisites

Read `.accessibility/$ARGUMENTS/01-scope.md`. If this file does not exist, tell the user:

> Phase 1 (Scope) has not been completed for "$ARGUMENTS". Run `/accessibility:scope $ARGUMENTS` first, or use `--skip-checks` to bypass.

If `--skip-checks` is present in $ARGUMENTS, skip this check and log to `.accessibility/$ARGUMENTS/skip-log.md`.

## Process

1. **Read context files:**
   - Read `.accessibility/$ARGUMENTS/01-scope.md` for audit scope and target pages
   - Read `plugins/accessibility/shared/wcag-21-aa-criteria.md` for the full criteria reference

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

5. **Write the artifact** to `.accessibility/$ARGUMENTS/02-evaluate.md` with sections:
   - **Issues Found** — each issue with WCAG mapping, severity, location
   - **Conformance Status** — per-principle pass/fail summary
   - **Critical Barriers** — issues that completely block access
   - **Positive Findings** — what's already working well

## Output

The evaluation results written to `.accessibility/$ARGUMENTS/02-evaluate.md`. Present a summary to the user highlighting:
- Total issues found by severity
- Critical barriers requiring immediate attention
- WCAG principles with most violations

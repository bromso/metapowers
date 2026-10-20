---
description: Generate a structured accessibility audit report with remediation guidance
---

# Report

Generate a comprehensive accessibility audit report for "$ARGUMENTS" with executive summary, detailed findings, and prioritized remediation steps.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.metapowers/accessibility/<project>/skip-log.md`: `- <ISO timestamp> — <skill name> skipped prerequisite check for <artifact file> — reason: <reason or "none given">`.

## Prerequisites

Read `.metapowers/accessibility/<project>/02-evaluate.md`. If this file does not exist, tell the user:

> Phase 2 (Evaluate) has not been completed for "<project>". Run `/accessibility:evaluate <project>` first, or use `--skip-checks` to bypass.

## Process

1. **Read context files:**
   - Read `.metapowers/accessibility/<project>/01-scope.md` for audit scope
   - Read `.metapowers/accessibility/<project>/02-evaluate.md` for discovered issues
   - Read `${CLAUDE_PLUGIN_ROOT}/shared/audit-report-template.md` for output structure
   - Read `${CLAUDE_PLUGIN_ROOT}/shared/remediation-patterns.md` for fix guidance

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

5. **Write the artifact** to `.metapowers/accessibility/<project>/03-report.md` following the audit report template.

## Output

The audit report written to `.metapowers/accessibility/<project>/03-report.md`. Present a summary to the user highlighting:
- Conformance status
- Top priority issues to fix
- Estimated remediation effort

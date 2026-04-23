---
description: Fix accessibility issues with guided code changes following WCAG criteria
---

# Remediate

Fix the accessibility issues found in "$ARGUMENTS". Apply remediation patterns to resolve WCAG violations, starting with critical barriers.

## Prerequisites

Read `.accessibility/$ARGUMENTS/03-report.md`. If this file does not exist, tell the user:

> Phase 3 (Report) has not been completed for "$ARGUMENTS". Run `/accessibility:report $ARGUMENTS` first, or use `--skip-checks` to bypass.

If `--skip-checks` is present in $ARGUMENTS, skip this check and log to `.accessibility/$ARGUMENTS/skip-log.md`.

## Process

1. **Read context files:**
   - Read `.accessibility/$ARGUMENTS/03-report.md` for prioritized issues and remediation steps
   - Read `plugins/accessibility/shared/remediation-patterns.md` for common fix patterns

2. **Fix issues by priority:**
   - Start with Critical severity issues
   - Then Major, then Minor
   - For each issue:
     - Read the affected code
     - Apply the recommended fix from the report
     - Follow the remediation patterns in shared resources
     - Verify the fix doesn't introduce new issues
     - Commit each fix or group of related fixes

3. **Log remediation progress:**
   - Track each issue: fixed, deferred, or cannot fix (with reason)
   - Record commit hashes for each fix
   - Note any issues that require design changes or stakeholder decisions

4. **Write the artifact** to `.accessibility/$ARGUMENTS/04-remediate.md` with sections:
   - **Fixes Applied** — each issue with what was changed and commit hash
   - **Deferred Issues** — issues not fixed and why
   - **Design Decisions Needed** — issues requiring stakeholder input
   - **New Considerations** — any new issues discovered during remediation

## Output

The remediation log written to `.accessibility/$ARGUMENTS/04-remediate.md`. Present a summary to the user highlighting:
- Issues fixed vs. total
- Commits made
- Any deferred issues needing attention

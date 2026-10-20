---
name: remediate
description: Fix the issues from an accessibility audit report in code, critical first, committing each fix and logging what was fixed, deferred or needs a design decision. Use when the user has an accessibility audit report and asks to start fixing its issues. Not for a design-stage check or feedback on one component; see /accessibility:checklist, /design:a11y-audit or /coaching:a11y.
argument-hint: "[project] [--skip-checks]"
---

# Remediate

Fix the accessibility issues found in "$ARGUMENTS". Apply remediation patterns to resolve WCAG violations, starting with critical barriers.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.metapowers/accessibility/<project>/skip-log.md`: `- <ISO timestamp> — <skill name> skipped prerequisite check for <artifact file> — reason: <reason or "none given">`.

## Prerequisites

Read `.metapowers/accessibility/<project>/03-report.md`. If this file does not exist, tell the user:

> Phase 3 (Report) has not been completed for "<project>". Run `/accessibility:report <project>` first, or use `--skip-checks` to bypass.

## Process

1. **Read context files:**
   - Read `.metapowers/accessibility/<project>/03-report.md` for prioritized issues and remediation steps
   - Read `${CLAUDE_PLUGIN_ROOT}/shared/remediation-patterns.md` for common fix patterns

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

4. **Write the artifact** to `.metapowers/accessibility/<project>/04-remediate.md` with sections:
   - **Fixes Applied** — each issue with what was changed and commit hash
   - **Deferred Issues** — issues not fixed and why
   - **Design Decisions Needed** — issues requiring stakeholder input
   - **New Considerations** — any new issues discovered during remediation

## Output

The remediation log written to `.metapowers/accessibility/<project>/04-remediate.md`. Present a summary to the user highlighting:
- Issues fixed vs. total
- Commits made
- Any deferred issues needing attention

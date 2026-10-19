---
description: Verify accessibility fixes and produce a conformance statement
---

# Retest

Verify that accessibility fixes for "$ARGUMENTS" are effective and produce a formal conformance statement.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.metapowers/accessibility/<project>/skip-log.md`: `- <ISO timestamp> — <skill name> skipped prerequisite check for <artifact file> — reason: <reason or "none given">`.

## Prerequisites

Read all prior artifacts. If `.metapowers/accessibility/<project>/04-remediate.md` does not exist, tell the user:

> Phase 4 (Remediate) has not been completed for "<project>". Run `/accessibility:remediate <project>` first, or use `--skip-checks` to bypass.

## Process

1. **Read all prior artifacts:**
   - Read `.metapowers/accessibility/<project>/01-scope.md` for original scope
   - Read `.metapowers/accessibility/<project>/02-evaluate.md` for original issues
   - Read `.metapowers/accessibility/<project>/03-report.md` for detailed findings
   - Read `.metapowers/accessibility/<project>/04-remediate.md` for fixes applied

2. **Re-evaluate each fixed issue:**
   - Read the current code for each fixed issue
   - Verify the fix resolves the original WCAG violation
   - Check for regressions — did the fix break anything else?
   - Update issue status: verified fixed, partially fixed, or regression found

3. **Run regression checks:**
   - Re-check all WCAG criteria from the scope
   - Verify no new issues were introduced by the fixes
   - Check keyboard navigation flow end-to-end
   - Verify ARIA attributes are correct

4. **Produce conformance statement:**
   - Overall conformance level achieved
   - Per-principle conformance status
   - Known remaining issues (if any)
   - Recommendations for ongoing maintenance

5. **Write the artifact** to `.metapowers/accessibility/<project>/05-retest.md` with sections:
   - **Verification Results** — each issue with retest outcome
   - **Regression Check** — any new issues found
   - **Conformance Statement** — formal WCAG conformance declaration
   - **Remaining Issues** — known gaps with justification
   - **Maintenance Recommendations** — ongoing monitoring advice

## Output

The conformance statement written to `.metapowers/accessibility/<project>/05-retest.md`. Present a summary to the user highlighting:
- Conformance level achieved
- Issues verified as fixed
- Any remaining gaps
- Maintenance recommendations

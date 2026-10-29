---
name: accessibility-retest
description: Verify accessibility fixes against the original issues, check for regressions, and write a WCAG conformance statement with remaining gaps. Use when fixes from an accessibility audit are in and the user wants them confirmed or a conformance statement. Not for a design-stage check or feedback on one component; see /accessibility-checklist, /design-a11y-audit or /coaching-a11y.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: accessibility
  phase: 5
  artifact: 05-retest.md
---

# Retest

Verify that accessibility fixes for "$ARGUMENTS" are effective and produce a formal conformance statement.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"accessibility-retest","workflow":"accessibility","phase":5,"project":"<project>","event":"skipped","artifact":"05-retest.md","note":"<reason or \"none given\">"}`.

## Prerequisites

Run this skill's gate before writing: `sh <this skill's folder>/scripts/gate.sh <project> <project root>`, where `<project root>` is the folder that contains `.singularskills/` (use `.` when you are already there). If it exits non-zero, stop and tell the user what it printed, unless `--skip-checks` was given (see Arguments).

Read all prior artifacts. If `.singularskills/accessibility/<project>/04-remediate.md` does not exist, tell the user:

> Phase 4 (Remediate) has not been completed for "<project>". Run `/accessibility-remediate <project>` first, or use `--skip-checks` to bypass.

## Process

1. **Read all prior artifacts:**
   - Read `.singularskills/accessibility/<project>/01-scope.md` for original scope
   - Read `.singularskills/accessibility/<project>/02-evaluate.md` for original issues
   - Read `.singularskills/accessibility/<project>/03-report.md` for detailed findings
   - Read `.singularskills/accessibility/<project>/04-remediate.md` for fixes applied

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

5. **Write the artifact** to `.singularskills/accessibility/<project>/05-retest.md` with sections:
   - **Verification Results** — each issue with retest outcome
   - **Regression Check** — any new issues found
   - **Conformance Statement** — formal WCAG conformance declaration
   - **Remaining Issues** — known gaps with justification
   - **Maintenance Recommendations** — ongoing monitoring advice

## Output

The conformance statement written to `.singularskills/accessibility/<project>/05-retest.md`. Present a summary to the user highlighting:
- Conformance level achieved
- Issues verified as fixed
- Any remaining gaps
- Maintenance recommendations

**Record the run.** Append each of these events to `.singularskills/log.jsonl` as one line (create the folder and file if missing):

- Before you start work (once the gate has passed or `--skip-checks` was given): `{"ts":"<ISO timestamp>","skill":"accessibility-retest","workflow":"accessibility","phase":5,"project":"<project>","event":"started","artifact":"05-retest.md","note":""}`
- After you have written the artifact: the same line with `"event":"finished"`.
- If the gate refused and the user did not bypass it: the same line with `"event":"refused"` and `"note"` set to what the gate printed, instead of the other two; then stop.

Open the artifact with this frontmatter (`agent` is the agent you run in, or `unknown`; `gate` is `passed` when the gate ran clean and `skipped` under `--skip-checks`):

```yaml
---
skill: accessibility-retest
workflow: accessibility
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

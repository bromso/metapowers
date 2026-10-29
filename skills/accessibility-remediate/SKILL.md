---
name: accessibility-remediate
description: Fix the issues from an accessibility audit report in code, critical first, committing each fix and logging what was fixed, deferred or needs a design decision. Use when the user has an accessibility audit report and asks to start fixing its issues. Not for a design-stage check or feedback on one component; see /accessibility-checklist, /design-a11y-audit or /coaching-a11y.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: accessibility
  phase: 4
  artifact: 04-remediate.md
---

# Remediate

Fix the accessibility issues found in "$ARGUMENTS". Apply remediation patterns to resolve WCAG violations, starting with critical barriers.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"<skill name>","workflow":"accessibility","phase":<phase>,"project":"<project>","event":"skipped","artifact":"<artifact file>","note":"<reason or \"none given\">"}`.

## Prerequisites

Run `scripts/gate.sh <project>` from this skill's folder. If it exits non-zero, stop and tell the user what it printed (unless `--skip-checks`, see Arguments).

Read `.singularskills/accessibility/<project>/03-report.md`. If this file does not exist, tell the user:

> Phase 3 (Report) has not been completed for "<project>". Run `/accessibility-report <project>` first, or use `--skip-checks` to bypass.

## Process

1. **Read context files:**
   - Read `.singularskills/accessibility/<project>/03-report.md` for prioritized issues and remediation steps
   - Read `references/remediation-patterns.md` for common fix patterns

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

4. **Write the artifact** to `.singularskills/accessibility/<project>/04-remediate.md` with sections:
   - **Fixes Applied** — each issue with what was changed and commit hash
   - **Deferred Issues** — issues not fixed and why
   - **Design Decisions Needed** — issues requiring stakeholder input
   - **New Considerations** — any new issues discovered during remediation

## Output

The remediation log written to `.singularskills/accessibility/<project>/04-remediate.md`. Present a summary to the user highlighting:
- Issues fixed vs. total
- Commits made
- Any deferred issues needing attention

**Record the run.** Open the artifact with this frontmatter (`agent` is the agent you run in, or `unknown`; `gate` is `passed` when the gate ran clean and `skipped` under `--skip-checks`):

```yaml
---
skill: accessibility-remediate
workflow: accessibility
phase: 4
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

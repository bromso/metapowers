---
name: accounting-adjusted-balance
description: Prepare the adjusted trial balance by applying adjusting entries to the unadjusted balances and verifying debits still equal credits. Use when the user has recorded the period-end adjustments and wants updated balances to prepare financial statements from. Not for the pre-adjustment check; see /accounting-trial-balance.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: accounting
  phase: 6
  artifact: 06-adjusted-balance.md
---

# Adjusted Trial Balance

Prepare an adjusted trial balance for "$ARGUMENTS". Incorporate adjusting entries and verify that debits still equal credits.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"accounting-adjusted-balance","workflow":"accounting","phase":6,"project":"<project>","event":"skipped","artifact":"06-adjusted-balance.md","note":"<reason or \"none given\">"}`.

**Compute with code.** Perform every calculation (totals, balances, ratios, variances, projections) with a script — Bash, Python or a spreadsheet formula written to a file — and include the computation alongside the result. Never do arithmetic mentally.

## Prerequisites

Run this skill's gate before writing: `sh <this skill's folder>/scripts/gate.sh <project> <project root>`, where `<project root>` is the folder that contains `.singularskills/` (use `.` when you are already there). If it exits non-zero, stop and tell the user what it printed, unless `--skip-checks` was given (see Arguments).

Read `.singularskills/accounting/<project>/04-trial-balance.md` for the unadjusted balances and `.singularskills/accounting/<project>/05-adjust.md` for the adjusting entries.

## Process

1. **Apply adjusting entries:**
   - Start with the unadjusted trial balance
   - Post each adjusting entry to the affected accounts
   - Calculate new account balances incorporating all adjustments

2. **Prepare the adjusted trial balance:**
   - List every account with its adjusted balance
   - Place debit balances in the debit column and credit balances in the credit column
   - Order accounts by category: assets, liabilities, equity, revenue, expenses

3. **Verify balance:**
   - Sum all adjusted debit balances
   - Sum all adjusted credit balances
   - Confirm totals are equal
   - If not, trace the discrepancy back to the adjusting entries

4. **Write the artifact** to `.singularskills/accounting/<project>/06-adjusted-balance.md` with sections:
   - **Adjusted Trial Balance** — all accounts with unadjusted balance, adjustments, and adjusted balance columns
   - **Balance Verification** — total debits, total credits, and difference (should be zero)
   - **Adjustment Impact** — summary showing how each account changed from unadjusted to adjusted

## Output

The adjusted trial balance written to `.singularskills/accounting/<project>/06-adjusted-balance.md`. Present a summary highlighting:
- Total adjusted debits and credits
- Whether the adjusted trial balance is in balance
- Accounts most affected by adjustments

**Record the run.** Append each of these events to `.singularskills/log.jsonl` as one line (create the folder and file if missing):

- Before you start work (once the gate has passed or `--skip-checks` was given): `{"ts":"<ISO timestamp>","skill":"accounting-adjusted-balance","workflow":"accounting","phase":6,"project":"<project>","event":"started","artifact":"06-adjusted-balance.md","note":""}`
- After you have written the artifact: the same line with `"event":"finished"`.
- If the gate refused and the user did not bypass it: the same line with `"event":"refused"` and `"note"` set to what the gate printed, instead of the other two; then stop.

Open the artifact with this frontmatter (`agent` is the agent you run in, or `unknown`; `gate` is `passed` when the gate ran clean and `skipped` under `--skip-checks`):

```yaml
---
skill: accounting-adjusted-balance
workflow: accounting
phase: 6
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

End the artifact with this paragraph, verbatim:

> **Not financial or tax advice.** This artifact is generated analysis for review by a qualified accountant or financial professional before any filing, reporting or decision relies on it.

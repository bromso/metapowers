---
name: accounting-adjust
description: Record period-end adjusting entries — accruals, deferrals, depreciation, bad-debt and other estimates — with the calculation and rationale for each and the impact on net income. Use when the user has an unadjusted trial balance and needs revenue and expenses moved into the right period before statements. Not for booking the period's regular transactions; see /accounting-journal.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: accounting
  phase: 5
  artifact: 05-adjust.md
---

# Adjust

Record adjusting entries for "$ARGUMENTS". Ensure revenue and expenses are recognized in the correct period by recording accruals, deferrals, depreciation, and estimates.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"<skill name>","workflow":"accounting","phase":<phase>,"project":"<project>","event":"skipped","artifact":"<artifact file>","note":"<reason or \"none given\">"}`.

**Compute with code.** Perform every calculation (totals, balances, ratios, variances, projections) with a script — Bash, Python or a spreadsheet formula written to a file — and include the computation alongside the result. Never do arithmetic mentally.

## Prerequisites

Run `scripts/gate.sh <project>` from this skill's folder. If it exits non-zero, stop and tell the user what it printed (unless `--skip-checks`, see Arguments).

Read `.singularskills/accounting/<project>/04-trial-balance.md` for the unadjusted trial balance.

## Process

1. **Identify required adjustments:**
   - **Accrued revenues** — revenue earned but not yet billed or received
   - **Accrued expenses** — expenses incurred but not yet paid (wages, interest, taxes)
   - **Prepaid expenses** — payments made in advance that need to be expensed over time
   - **Unearned revenue** — cash received in advance that needs to be recognized as earned
   - **Depreciation** — allocate the cost of long-lived assets over their useful lives
   - **Allowances & estimates** — bad debt allowance, warranty reserves, inventory write-downs

2. **Create adjusting journal entries:**
   - For each adjustment, record:
     - **Type** — accrual, deferral, depreciation, or estimate
     - **Accounts** — debit and credit accounts
     - **Amount** — calculated adjustment amount with supporting calculation
     - **Rationale** — why this adjustment is necessary
   - Number entries sequentially (AJE-001, AJE-002, etc.)

3. **Validate adjustments:**
   - Each adjusting entry must have equal debits and credits
   - Verify that no operating transactions are included (those belong in Phase 2)
   - Confirm depreciation methods and useful lives are consistent with policy

4. **Write the artifact** to `.singularskills/accounting/<project>/05-adjust.md` with sections:
   - **Adjusting Journal Entries** — all entries with type, accounts, amounts, and rationale
   - **Adjustment Summary** — total adjustments by type
   - **Impact Analysis** — how adjustments affect net income and key account balances

## Output

The adjustments written to `.singularskills/accounting/<project>/05-adjust.md`. Present a summary highlighting:
- Number of adjusting entries by type
- Net impact on net income
- Largest adjustments by dollar amount

**Record the run.** Open the artifact with this frontmatter (`agent` is the agent you run in, or `unknown`; `gate` is `passed` when the gate ran clean and `skipped` under `--skip-checks`):

```yaml
---
skill: accounting-adjust
workflow: accounting
phase: 5
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

End the artifact with this paragraph, verbatim:

> **Not financial or tax advice.** This artifact is generated analysis for review by a qualified accountant or financial professional before any filing, reporting or decision relies on it.

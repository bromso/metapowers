---
name: adjusted-balance
description: Prepare the adjusted trial balance by applying adjusting entries to the unadjusted balances and verifying debits still equal credits. Use when the user has recorded the period-end adjustments and wants updated balances to prepare financial statements from. Not for the pre-adjustment check; see /accounting:trial-balance.
argument-hint: "[project] [--skip-checks]"
---

# Adjusted Trial Balance

Prepare an adjusted trial balance for "$ARGUMENTS". Incorporate adjusting entries and verify that debits still equal credits.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.metapowers/accounting/<project>/skip-log.md`: `- <ISO timestamp> — <skill name> skipped prerequisite check for <artifact file> — reason: <reason or "none given">`.

**Compute with code.** Perform every calculation (totals, balances, ratios, variances, projections) with a script — Bash, Python or a spreadsheet formula written to a file — and include the computation alongside the result. Never do arithmetic mentally.

## Prerequisites

Read `.metapowers/accounting/<project>/04-trial-balance.md` for the unadjusted balances and `.metapowers/accounting/<project>/05-adjust.md` for the adjusting entries.

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

4. **Write the artifact** to `.metapowers/accounting/<project>/06-adjusted-balance.md` with sections:
   - **Adjusted Trial Balance** — all accounts with unadjusted balance, adjustments, and adjusted balance columns
   - **Balance Verification** — total debits, total credits, and difference (should be zero)
   - **Adjustment Impact** — summary showing how each account changed from unadjusted to adjusted

## Output

The adjusted trial balance written to `.metapowers/accounting/<project>/06-adjusted-balance.md`. Present a summary highlighting:
- Total adjusted debits and credits
- Whether the adjusted trial balance is in balance
- Accounts most affected by adjustments

End the artifact with this paragraph, verbatim:

> **Not financial or tax advice.** This artifact is generated analysis for review by a qualified accountant or financial professional before any filing, reporting or decision relies on it.

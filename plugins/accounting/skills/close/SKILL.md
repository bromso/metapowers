---
name: close
description: Close revenue, expense and dividend accounts to retained earnings and prepare the post-closing trial balance that opens the next period. Use when the user has the period's financial statements done and wants the temporary accounts zeroed and balances rolled forward. Not for starting a period's close from source documents; see /accounting:analyze.
argument-hint: "[project] [--skip-checks]"
---

# Close

Close temporary accounts for "$ARGUMENTS". Zero out revenue, expense, and dividend accounts by transferring their balances to retained earnings.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.metapowers/accounting/<project>/skip-log.md`: `- <ISO timestamp> — <skill name> skipped prerequisite check for <artifact file> — reason: <reason or "none given">`.

**Compute with code.** Perform every calculation (totals, balances, ratios, variances, projections) with a script — Bash, Python or a spreadsheet formula written to a file — and include the computation alongside the result. Never do arithmetic mentally.

## Prerequisites

Read `.metapowers/accounting/<project>/07-statements.md` for the financial statements and `.metapowers/accounting/<project>/06-adjusted-balance.md` for the adjusted trial balance.

## Process

1. **Close revenue accounts:**
   - Debit each revenue account for its full balance
   - Credit Income Summary for the total revenue
   - All revenue accounts should now have zero balances

2. **Close expense accounts:**
   - Credit each expense account for its full balance
   - Debit Income Summary for the total expenses
   - All expense accounts should now have zero balances

3. **Close Income Summary:**
   - If Income Summary has a credit balance (net income): debit Income Summary, credit Retained Earnings
   - If Income Summary has a debit balance (net loss): credit Income Summary, debit Retained Earnings
   - Income Summary should now have a zero balance

4. **Close dividends/draws:**
   - Credit Dividends (or Owner's Draws) for its full balance
   - Debit Retained Earnings
   - Dividends account should now have a zero balance

5. **Prepare post-closing trial balance:**
   - List only permanent accounts (assets, liabilities, equity)
   - Verify debits equal credits
   - These balances become the opening balances for the next period

6. **Write the artifact** to `.metapowers/accounting/<project>/08-close.md` with sections:
   - **Closing Journal Entries** — all closing entries with accounts and amounts
   - **Post-Closing Trial Balance** — permanent accounts only
   - **Period Summary** — net income transferred, dividends closed, ending retained earnings

## Output

The closing entries written to `.metapowers/accounting/<project>/08-close.md`. Present a summary highlighting:
- Net income transferred to retained earnings
- Ending retained earnings balance
- Confirmation that all temporary accounts are zeroed

End the artifact with this paragraph, verbatim:

> **Not financial or tax advice.** This artifact is generated analysis for review by a qualified accountant or financial professional before any filing, reporting or decision relies on it.

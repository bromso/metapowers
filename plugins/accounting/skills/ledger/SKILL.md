---
name: ledger
description: Post journal entries to the general ledger by account, with running balances, closing balances and a journal-to-ledger cross-reference. Use when the user has a period's journal entries and wants them posted to ledger accounts or needs each account's balance. Not for writing the journal entries themselves; see /accounting:journal.
argument-hint: "[project] [--skip-checks]"
---

# Ledger

Post journal entries to the general ledger for "$ARGUMENTS". Organize all debits and credits by account and calculate running balances.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.metapowers/accounting/<project>/skip-log.md`: `- <ISO timestamp> — <skill name> skipped prerequisite check for <artifact file> — reason: <reason or "none given">`.

**Compute with code.** Perform every calculation (totals, balances, ratios, variances, projections) with a script — Bash, Python or a spreadsheet formula written to a file — and include the computation alongside the result. Never do arithmetic mentally.

## Prerequisites

Read `.metapowers/accounting/<project>/02-journal.md` for the journal entries.

## Process

1. **Set up ledger accounts:**
   - Create a T-account or tabular format for each account in the chart of accounts
   - Include the account number, name, and normal balance side (debit or credit)
   - Carry forward any opening balances from the prior period

2. **Post journal entries:**
   - Transfer each journal entry to the appropriate ledger accounts
   - Record the date, journal entry reference (JE-001, etc.), and amount
   - Post debits to the debit side and credits to the credit side
   - Calculate the running balance after each posting

3. **Verify completeness:**
   - Cross-reference every journal entry to confirm it has been posted
   - Check that no entries were double-posted or missed
   - Ensure running balances are mathematically correct

4. **Write the artifact** to `.metapowers/accounting/<project>/03-ledger.md` with sections:
   - **General Ledger** — each account with all postings and running balance
   - **Account Summary** — closing balance for each account
   - **Cross-Reference** — journal entry to ledger posting map

## Output

The ledger written to `.metapowers/accounting/<project>/03-ledger.md`. Present a summary highlighting:
- Number of active accounts
- Top accounts by transaction volume
- Closing balances for key accounts

End the artifact with this paragraph, verbatim:

> **Not financial or tax advice.** This artifact is generated analysis for review by a qualified accountant or financial professional before any filing, reporting or decision relies on it.

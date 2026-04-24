---
description: Verify that total debits equal total credits across all ledger accounts
---

# Trial Balance

Prepare an unadjusted trial balance for "$ARGUMENTS". List all ledger account balances and verify that total debits equal total credits.

## Prerequisites

Read `.metapowers/accounting/$ARGUMENTS/03-ledger.md` for the ledger account balances.

## Process

1. **Extract account balances:**
   - List every account from the general ledger with its closing balance
   - Place debit balances in the debit column and credit balances in the credit column
   - Order accounts by category: assets, liabilities, equity, revenue, expenses

2. **Calculate totals:**
   - Sum all debit balances
   - Sum all credit balances
   - Compare totals — they must be equal

3. **Investigate discrepancies:**
   - If totals do not match, check for:
     - Transposition errors (digits swapped)
     - Slide errors (decimal point shifted)
     - Omitted or double-posted entries
     - Entries posted to the wrong side
   - Document any corrections made

4. **Write the artifact** to `.metapowers/accounting/$ARGUMENTS/04-trial-balance.md` with sections:
   - **Unadjusted Trial Balance** — all accounts with debit and credit columns
   - **Balance Verification** — total debits, total credits, and difference (should be zero)
   - **Error Log** — any discrepancies found and corrections applied

## Output

The trial balance written to `.metapowers/accounting/$ARGUMENTS/04-trial-balance.md`. Present a summary highlighting:
- Total debits and total credits
- Whether the trial balance is in balance
- Any errors detected and corrected

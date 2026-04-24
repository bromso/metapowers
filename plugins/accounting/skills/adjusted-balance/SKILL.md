---
description: Verify updated account balances after posting adjusting entries
---

# Adjusted Trial Balance

Prepare an adjusted trial balance for "$ARGUMENTS". Incorporate adjusting entries and verify that debits still equal credits.

## Prerequisites

Read `.metapowers/accounting/$ARGUMENTS/04-trial-balance.md` for the unadjusted balances and `.metapowers/accounting/$ARGUMENTS/05-adjust.md` for the adjusting entries.

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

4. **Write the artifact** to `.metapowers/accounting/$ARGUMENTS/06-adjusted-balance.md` with sections:
   - **Adjusted Trial Balance** — all accounts with unadjusted balance, adjustments, and adjusted balance columns
   - **Balance Verification** — total debits, total credits, and difference (should be zero)
   - **Adjustment Impact** — summary showing how each account changed from unadjusted to adjusted

## Output

The adjusted trial balance written to `.metapowers/accounting/$ARGUMENTS/06-adjusted-balance.md`. Present a summary highlighting:
- Total adjusted debits and credits
- Whether the adjusted trial balance is in balance
- Accounts most affected by adjustments

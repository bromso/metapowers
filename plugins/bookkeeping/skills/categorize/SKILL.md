---
description: Assign recorded transactions to the correct accounts using double-entry principles
---

# Categorize

Assign each recorded transaction for "$ARGUMENTS" to the correct account in the chart of accounts. Apply double-entry bookkeeping so every debit has a matching credit.

## Prerequisites

Read `.metapowers/bookkeeping/$ARGUMENTS/01-record.md` for the transaction log.

## Process

1. **Load the chart of accounts:**
   - Check if a custom chart exists at `.metapowers/bookkeeping/$ARGUMENTS/chart-of-accounts.md`
   - If not, reference the shared template at `shared/chart-of-accounts-template.md`
   - Confirm account categories cover all transaction types

2. **Categorize each transaction:**
   - For every transaction in the record log, assign:
     - **Debit account** — the account being increased (assets, expenses) or decreased (liabilities, equity, revenue)
     - **Credit account** — the matching entry
     - **Category** — high-level grouping (revenue, COGS, operating expense, asset, liability)
   - Apply consistent rules for similar transactions
   - Flag ambiguous transactions for user confirmation

3. **Validate double-entry:**
   - Ensure total debits equal total credits
   - Check that no transaction is missing an account assignment
   - Verify account numbers match the chart of accounts

4. **Write the artifact** to `.metapowers/bookkeeping/$ARGUMENTS/02-categorize.md` with sections:
   - **Journal Entries** — table with date, description, debit account, credit account, amount
   - **Account Summary** — totals per account
   - **Ambiguous Items** — transactions needing user review
   - **Validation** — debit/credit balance confirmation

## Output

The categorized journal written to `.metapowers/bookkeeping/$ARGUMENTS/02-categorize.md`. Present a summary highlighting:
- Total journal entries created
- Top expense and revenue categories
- Any ambiguous items requiring decision

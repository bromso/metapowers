---
description: Match internal records against bank statements and resolve discrepancies
---

# Reconcile

Match the categorized journal entries for "$ARGUMENTS" against external statements. Identify and resolve every discrepancy before closing the period.

## Prerequisites

Read `.metapowers/bookkeeping/$ARGUMENTS/02-categorize.md` for the categorized journal entries.

## Process

1. **Gather external statements:**
   - Bank statements for the period
   - Credit card statements
   - Vendor account statements
   - Payment processor reports

2. **Match transactions:**
   - For each internal entry, find the matching external transaction
   - Mark matches as reconciled
   - Note the match method (exact amount, date + amount, reference number)

3. **Identify discrepancies:**
   - **Missing internally** — appears on statement but not in our records
   - **Missing externally** — recorded internally but not on statement (timing difference or error)
   - **Amount mismatch** — same transaction, different amounts
   - **Duplicates** — same transaction recorded more than once

4. **Resolve each discrepancy:**
   - Add missing transactions
   - Remove or merge duplicates
   - Correct amounts with source document verification
   - Note timing differences (outstanding checks, pending deposits)

5. **Write the artifact** to `.metapowers/bookkeeping/$ARGUMENTS/03-reconcile.md` with sections:
   - **Reconciliation Summary** — matched vs. unmatched counts per account
   - **Discrepancies Found** — table of issues and resolutions
   - **Adjusting Entries** — any corrections made
   - **Outstanding Items** — legitimate timing differences
   - **Reconciled Balance** — confirmed balance per account

## Output

The reconciliation written to `.metapowers/bookkeeping/$ARGUMENTS/03-reconcile.md`. Present a summary highlighting:
- Percentage of transactions matched
- Number of discrepancies found and resolved
- Final reconciled balances

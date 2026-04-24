---
description: Reconcile balances between related accounts or external statements
---

# Reconciliation

Perform account reconciliation for "$ARGUMENTS". Compare internal records against external statements or related accounts to identify and resolve differences.

## Prerequisites

None — utility skill, run anytime. Most commonly used after Phase 3 (ledger) when account balances are available.

## Process

1. **Identify accounts to reconcile:**
   - What internal account is being reconciled? (e.g., cash, accounts receivable, accounts payable, intercompany)
   - What is the external source or related account? (bank statement, customer statement, sub-ledger, vendor statement)
   - What period is being reconciled?

2. **Gather balances:**
   - Record the internal book balance (per general ledger)
   - Record the external or comparison balance (per bank/vendor/customer statement)
   - Note the difference to be explained

3. **Identify reconciling items:**
   - **Timing differences** — items recorded in one set of books but not yet in the other
     - Outstanding checks (issued but not yet cleared)
     - Deposits in transit (recorded but not yet credited)
     - Unrecorded transactions (bank fees, interest, direct deposits)
   - **Errors** — mistakes in either set of records
   - **Adjustments needed** — entries required to correct the book balance

4. **Prepare reconciliation:**
   - Start with one balance, add/subtract reconciling items to arrive at the other
   - Every dollar of difference must be explained
   - Flag any aged or unresolved reconciling items

5. **Write the artifact** to `.metapowers/accounting/$ARGUMENTS/reconciliation.md` with sections:
   - **Reconciliation Summary** — account name, period, book balance, external balance, difference
   - **Reconciliation Detail** — step-by-step reconciliation with each reconciling item
   - **Adjusting Entries Needed** — journal entries required to correct the books
   - **Aged Items** — reconciling items outstanding for more than one period

## Output

The reconciliation written to `.metapowers/accounting/$ARGUMENTS/reconciliation.md`. Present a summary highlighting:
- Book balance vs. external balance and the difference
- Number and total of reconciling items
- Any required adjusting entries

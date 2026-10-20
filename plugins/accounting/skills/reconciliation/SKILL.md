---
name: reconciliation
description: Reconcile one ledger account to its bank, customer or vendor statement or sub-ledger, explaining every difference and listing the correcting entries. Use when an account's book balance does not agree with an outside statement or sub-ledger and the user needs the gap explained. Not for matching a whole period of bookkeeping entries to statements; see /bookkeeping:reconcile.
argument-hint: "[project] [--skip-checks]"
---

# Reconciliation

Perform account reconciliation for "$ARGUMENTS". Compare internal records against external statements or related accounts to identify and resolve differences.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.metapowers/accounting/<project>/skip-log.md`: `- <ISO timestamp> — <skill name> skipped prerequisite check for <artifact file> — reason: <reason or "none given">`.

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

5. **Write the artifact** to `.metapowers/accounting/<project>/reconciliation.md` with sections:
   - **Reconciliation Summary** — account name, period, book balance, external balance, difference
   - **Reconciliation Detail** — step-by-step reconciliation with each reconciling item
   - **Adjusting Entries Needed** — journal entries required to correct the books
   - **Aged Items** — reconciling items outstanding for more than one period

## Output

The reconciliation written to `.metapowers/accounting/<project>/reconciliation.md`. Present a summary highlighting:
- Book balance vs. external balance and the difference
- Number and total of reconciling items
- Any required adjusting entries

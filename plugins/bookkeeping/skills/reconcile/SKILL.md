---
name: reconcile
description: Match internal records against bank statements and resolve discrepancies
argument-hint: "[project] [--skip-checks]"
---

# Reconcile

Match the categorized journal entries for "$ARGUMENTS" against external statements. Identify and resolve every discrepancy before closing the period.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.metapowers/bookkeeping/<project>/skip-log.md`: `- <ISO timestamp> — <skill name> skipped prerequisite check for <artifact file> — reason: <reason or "none given">`.

## Prerequisites

Read `.metapowers/bookkeeping/<project>/02-categorize.md` for the categorized journal entries.

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

5. **Write the artifact** to `.metapowers/bookkeeping/<project>/03-reconcile.md` with sections:
   - **Reconciliation Summary** — matched vs. unmatched counts per account
   - **Discrepancies Found** — table of issues and resolutions
   - **Adjusting Entries** — any corrections made
   - **Outstanding Items** — legitimate timing differences
   - **Reconciled Balance** — confirmed balance per account

## Output

The reconciliation written to `.metapowers/bookkeeping/<project>/03-reconcile.md`. Present a summary highlighting:
- Percentage of transactions matched
- Number of discrepancies found and resolved
- Final reconciled balances

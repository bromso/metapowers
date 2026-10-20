---
name: accounts-payable
description: Process vendor invoices into an aging report, verified against orders, and a payment schedule that captures early-payment discounts and flags disputes. Use when the user has unpaid bills piling up and wants to know what is due when and which to pay first.
argument-hint: "[project] [--skip-checks]"
---

# Accounts Payable

Process vendor invoices and schedule payments for "$ARGUMENTS". Track what is owed, when it is due, and optimize payment timing.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.metapowers/bookkeeping/<project>/skip-log.md`: `- <ISO timestamp> — <skill name> skipped prerequisite check for <artifact file> — reason: <reason or "none given">`.

**Compute with code.** Perform every calculation (totals, balances, ratios, variances, projections) with a script — Bash, Python or a spreadsheet formula written to a file — and include the computation alongside the result. Never do arithmetic mentally.

## Prerequisites

None — utility skill, run anytime.

## Process

1. **Collect outstanding invoices:**
   - Gather all unpaid vendor invoices
   - Record: vendor name, invoice number, date, due date, amount, terms
   - Note any early payment discounts (e.g., 2/10 net 30)

2. **Verify each invoice:**
   - Match invoice to purchase order or contract
   - Confirm goods/services were received
   - Check for duplicate invoices
   - Flag discrepancies for dispute

3. **Build payment schedule:**
   - Sort by due date
   - Prioritize based on: terms, discounts, vendor relationships, cash position
   - Group payments by payment run (weekly, biweekly)
   - Calculate cash needed per payment run

4. **Track aging:**
   - Current (0-30 days)
   - 31-60 days
   - 61-90 days
   - Over 90 days
   - Flag overdue items for immediate action

5. **Write the artifact** to `.metapowers/bookkeeping/<project>/accounts-payable.md` with sections:
   - **Outstanding Invoices** — table of all unpaid invoices
   - **Payment Schedule** — upcoming payments by date
   - **Aging Report** — amounts by aging bucket
   - **Discount Opportunities** — savings available from early payment
   - **Disputes** — invoices under review

## Output

The accounts payable report written to `.metapowers/bookkeeping/<project>/accounts-payable.md`. Present a summary highlighting:
- Total outstanding payables
- Upcoming payment obligations
- Available early payment discounts

End the artifact with this paragraph, verbatim:

> **Not financial or tax advice.** This artifact is generated analysis for review by a qualified accountant or financial professional before any filing, reporting or decision relies on it.

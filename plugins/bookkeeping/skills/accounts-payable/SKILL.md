---
description: Process vendor invoices and schedule payments to manage outgoing obligations
---

# Accounts Payable

Process vendor invoices and schedule payments for "$ARGUMENTS". Track what is owed, when it is due, and optimize payment timing.

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

5. **Write the artifact** to `.metapowers/bookkeeping/$ARGUMENTS/accounts-payable.md` with sections:
   - **Outstanding Invoices** — table of all unpaid invoices
   - **Payment Schedule** — upcoming payments by date
   - **Aging Report** — amounts by aging bucket
   - **Discount Opportunities** — savings available from early payment
   - **Disputes** — invoices under review

## Output

The accounts payable report written to `.metapowers/bookkeeping/$ARGUMENTS/accounts-payable.md`. Present a summary highlighting:
- Total outstanding payables
- Upcoming payment obligations
- Available early payment discounts

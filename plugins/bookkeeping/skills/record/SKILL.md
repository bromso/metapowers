---
name: record
description: Capture a period's financial transactions into a dated log with amount, counterparty, payment method and source document, flagging missing receipts and unusual items. Use when the user has receipts, invoices or bank lines for a month or quarter and wants them logged in one place. Not for starting a period-end double-entry close; see /accounting:analyze.
argument-hint: "[project] [--skip-checks]"
---

# Record

Capture and log all financial transactions for "$ARGUMENTS". Document each transaction with date, amount, parties, description, and source document reference.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.metapowers/bookkeeping/<project>/skip-log.md`: `- <ISO timestamp> — <skill name> skipped prerequisite check for <artifact file> — reason: <reason or "none given">`.

## Prerequisites

None — this is the first phase.

## Process

1. **Identify transaction sources:**
   - What accounts are active? (bank, credit card, cash, digital payments)
   - What period are we recording? (month, quarter, year)
   - What source documents are available? (receipts, invoices, bank feeds, contracts)

2. **Capture each transaction:**
   - **Date** — when the transaction occurred
   - **Amount** — exact figure with currency
   - **Direction** — inflow (revenue, loan) or outflow (expense, payment)
   - **Counterparty** — who paid or was paid
   - **Description** — what the transaction was for
   - **Source** — receipt number, invoice ID, or bank reference
   - **Payment method** — bank transfer, card, cash, etc.

3. **Organize the transaction log:**
   - Sort chronologically
   - Flag any transactions missing source documents
   - Note any unusual or large transactions for review
   - Identify recurring transactions (subscriptions, rent, payroll)

4. **Write the artifact** to `.metapowers/bookkeeping/<project>/01-record.md` with sections:
   - **Period** — date range covered
   - **Transaction Log** — table of all transactions
   - **Missing Documents** — transactions without source references
   - **Flags** — unusual items requiring review

## Output

The transaction log written to `.metapowers/bookkeeping/<project>/01-record.md`. Present a summary highlighting:
- Total transactions recorded
- Total inflows and outflows
- Any missing documents or flagged items

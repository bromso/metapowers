# Bookkeeping Cycle Guide

The bookkeeping cycle is a four-phase process that transforms raw financial transactions into actionable reports.

## Phase 1: Record

Capture every financial transaction as it occurs. Each entry includes the date, amount, parties involved, and a brief description. Source documents (receipts, invoices, bank notifications) are referenced for audit trail.

## Phase 2: Categorize

Assign each recorded transaction to the correct account in the chart of accounts. Apply double-entry principles — every debit has a matching credit. Ensure consistent categorization so reports are meaningful.

## Phase 3: Reconcile

Match internal records against external statements (bank, credit card, vendor). Identify discrepancies — missing entries, duplicate charges, timing differences. Resolve every variance before closing the period.

## Phase 4: Report

Generate financial statements from reconciled data:
- **Profit & Loss (Income Statement)** — revenue minus expenses for the period
- **Balance Sheet** — assets, liabilities, and equity at a point in time
- **Cash Flow Statement** — cash inflows and outflows by category

Reports should highlight trends, anomalies, and key ratios.

## Artifact Flow

Each phase produces an artifact that the next phase consumes:

```
01-record.md → 02-categorize.md → 03-reconcile.md → 04-report.md
```

All artifacts are written to `.metapowers/bookkeeping/<project>/`.

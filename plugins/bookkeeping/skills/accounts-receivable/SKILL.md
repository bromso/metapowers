---
name: accounts-receivable
description: Track outstanding customer invoices and manage collections
argument-hint: "[project] [--skip-checks]"
---

# Accounts Receivable

Track outstanding customer invoices and manage collections for "$ARGUMENTS". Monitor what is owed to you, follow up on overdue payments, and forecast incoming cash.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.metapowers/bookkeeping/<project>/skip-log.md`: `- <ISO timestamp> — <skill name> skipped prerequisite check for <artifact file> — reason: <reason or "none given">`.

## Prerequisites

None — utility skill, run anytime.

## Process

1. **Collect outstanding receivables:**
   - Gather all unpaid customer invoices
   - Record: customer name, invoice number, date, due date, amount, terms
   - Note any partial payments received

2. **Assess collection status:**
   - Current (0-30 days) — no action needed
   - 31-60 days — send reminder
   - 61-90 days — escalate follow-up
   - Over 90 days — consider collection action or write-off
   - Flag customers with recurring late payments

3. **Plan collection actions:**
   - Draft reminder messages for overdue invoices
   - Identify accounts needing phone follow-up
   - Recommend payment plan options for large balances
   - Flag potential bad debt for write-off review

4. **Forecast incoming cash:**
   - Estimate collection dates based on customer payment history
   - Calculate expected cash inflows by week/month
   - Identify concentration risk (too much owed by one customer)

5. **Write the artifact** to `.metapowers/bookkeeping/<project>/accounts-receivable.md` with sections:
   - **Outstanding Invoices** — table of all unpaid customer invoices
   - **Aging Report** — amounts by aging bucket
   - **Collection Actions** — recommended follow-up per account
   - **Cash Forecast** — expected inflows by period
   - **Bad Debt Risk** — accounts at risk of non-payment

## Output

The accounts receivable report written to `.metapowers/bookkeeping/<project>/accounts-receivable.md`. Present a summary highlighting:
- Total outstanding receivables
- Aging distribution
- Recommended collection actions

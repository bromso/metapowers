---
name: bookkeeping-chart-of-accounts
description: Design a chart of accounts for the business — numbered accounts by type and normal balance, industry-specific accounts and usage notes — adapted from a standard template. Use when the user is setting up books for a business or their current accounts no longer fit how they need to report.
metadata:
  argument-hint: "[project] [--skip-checks]"
---

# Chart of Accounts

Design a customized chart of accounts for "$ARGUMENTS". Structure the account hierarchy to match the business type, size, and reporting needs.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"bookkeeping-chart-of-accounts","workflow":"bookkeeping","phase":null,"project":"<project>","event":"skipped","artifact":"<artifact file>","note":"<reason or \"none given\">"}`.

**Compute with code.** Perform every calculation (totals, balances, ratios, variances, projections) with a script — Bash, Python or a spreadsheet formula written to a file — and include the computation alongside the result. Never do arithmetic mentally.

## Prerequisites

None — utility skill, run anytime. Should be done before starting the bookkeeping cycle.

## Process

1. **Understand the business:**
   - What type of business? (service, retail, manufacturing, SaaS, etc.)
   - What size? (solo, small team, growing company)
   - What reporting is needed? (basic P&L, departmental, project-based)
   - Any industry-specific accounts? (inventory, WIP, deferred revenue)

2. **Design account structure:**
   - Start from the shared template at `references/chart-of-accounts-template.md`
   - Add industry-specific accounts
   - Remove accounts that don't apply
   - Adjust numbering for growth (leave gaps for future accounts)
   - Consider sub-accounts for detailed tracking

3. **Define account properties:**
   - For each account: number, name, type, normal balance (debit/credit)
   - Group into categories: Assets, Liabilities, Equity, Revenue, COGS, Expenses
   - Mark which accounts are active vs. inactive
   - Note any accounts requiring special handling (tax, compliance)

4. **Validate the structure:**
   - Ensure all transaction types have a home
   - Verify numbering is consistent and allows expansion
   - Check that the chart supports required financial reports
   - Confirm alignment with tax reporting categories

5. **Write the artifact** to `.singularskills/bookkeeping/<project>/chart-of-accounts.md` with sections:
   - **Business Context** — type, size, and reporting needs
   - **Account Listing** — full chart with number, name, type, normal balance
   - **Account Groups** — summary of categories and their purpose
   - **Usage Notes** — guidance on when to use each account
   - **Customization Log** — what was changed from the template and why

## Output

The chart of accounts written to `.singularskills/bookkeeping/<project>/chart-of-accounts.md`. Present a summary highlighting:
- Total number of accounts by category
- Key customizations for this business
- Recommended accounts to add as the business grows

End the artifact with this paragraph, verbatim:

> **Not financial or tax advice.** This artifact is generated analysis for review by a qualified accountant or financial professional before any filing, reporting or decision relies on it.

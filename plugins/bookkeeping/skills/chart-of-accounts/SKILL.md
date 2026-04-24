---
description: Design a customized chart of accounts for the business
---

# Chart of Accounts

Design a customized chart of accounts for "$ARGUMENTS". Structure the account hierarchy to match the business type, size, and reporting needs.

## Prerequisites

None — utility skill, run anytime. Should be done before starting the bookkeeping cycle.

## Process

1. **Understand the business:**
   - What type of business? (service, retail, manufacturing, SaaS, etc.)
   - What size? (solo, small team, growing company)
   - What reporting is needed? (basic P&L, departmental, project-based)
   - Any industry-specific accounts? (inventory, WIP, deferred revenue)

2. **Design account structure:**
   - Start from the shared template at `shared/chart-of-accounts-template.md`
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

5. **Write the artifact** to `.metapowers/bookkeeping/$ARGUMENTS/chart-of-accounts.md` with sections:
   - **Business Context** — type, size, and reporting needs
   - **Account Listing** — full chart with number, name, type, normal balance
   - **Account Groups** — summary of categories and their purpose
   - **Usage Notes** — guidance on when to use each account
   - **Customization Log** — what was changed from the template and why

## Output

The chart of accounts written to `.metapowers/bookkeeping/$ARGUMENTS/chart-of-accounts.md`. Present a summary highlighting:
- Total number of accounts by category
- Key customizations for this business
- Recommended accounts to add as the business grows

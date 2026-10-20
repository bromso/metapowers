---
description: Design a customized chart of accounts for the business
---

# Chart of Accounts

Design a customized chart of accounts for "$ARGUMENTS". Structure the account hierarchy to match the business type, size, and reporting needs.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.metapowers/bookkeeping/<project>/skip-log.md`: `- <ISO timestamp> — <skill name> skipped prerequisite check for <artifact file> — reason: <reason or "none given">`.

## Prerequisites

None — utility skill, run anytime. Should be done before starting the bookkeeping cycle.

## Process

1. **Understand the business:**
   - What type of business? (service, retail, manufacturing, SaaS, etc.)
   - What size? (solo, small team, growing company)
   - What reporting is needed? (basic P&L, departmental, project-based)
   - Any industry-specific accounts? (inventory, WIP, deferred revenue)

2. **Design account structure:**
   - Start from the shared template at `${CLAUDE_PLUGIN_ROOT}/shared/chart-of-accounts-template.md`
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

5. **Write the artifact** to `.metapowers/bookkeeping/<project>/chart-of-accounts.md` with sections:
   - **Business Context** — type, size, and reporting needs
   - **Account Listing** — full chart with number, name, type, normal balance
   - **Account Groups** — summary of categories and their purpose
   - **Usage Notes** — guidance on when to use each account
   - **Customization Log** — what was changed from the template and why

## Output

The chart of accounts written to `.metapowers/bookkeeping/<project>/chart-of-accounts.md`. Present a summary highlighting:
- Total number of accounts by category
- Key customizations for this business
- Recommended accounts to add as the business grows

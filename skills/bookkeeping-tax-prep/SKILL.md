---
name: bookkeeping-tax-prep
description: Organize income, deductible expenses, supporting schedules and a filing checklist for a business tax return, with an estimated tax position. Use when tax season is coming and the user wants their records gathered and ready for filing or for their accountant.
metadata:
  argument-hint: "[project] [--skip-checks]"
---

# Tax Prep

Organize financial records and supporting documents for "$ARGUMENTS" to prepare for tax filing. Compile income, deductions, and credits with proper documentation.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"bookkeeping-tax-prep","workflow":"bookkeeping","phase":null,"project":"<project>","event":"skipped","artifact":"<artifact file>","note":"<reason or \"none given\">"}`.

**Compute with code.** Perform every calculation (totals, balances, ratios, variances, projections) with a script — Bash, Python or a spreadsheet formula written to a file — and include the computation alongside the result. Never do arithmetic mentally.

## Prerequisites

None — utility skill, run anytime. Works best after completing the four-phase cycle (record, categorize, reconcile, report).

## Process

1. **Determine tax obligations:**
   - Entity type (sole proprietorship, LLC, S-corp, C-corp, partnership)
   - Tax year and filing deadlines
   - Applicable tax forms (1040, 1120, 1065, etc.)
   - State and local filing requirements

2. **Compile income documentation:**
   - Revenue by source and category
   - 1099s received and issued
   - Interest and investment income
   - Other income (rental, royalties, gains)

3. **Organize deductible expenses:**
   - Operating expenses by category with totals
   - Home office deduction calculation if applicable
   - Vehicle and travel expenses with mileage logs
   - Depreciation schedules for fixed assets
   - Retirement plan contributions
   - Health insurance premiums

4. **Prepare supporting schedules:**
   - Asset register with purchase dates and cost basis
   - Loan interest statements
   - Charitable contribution receipts
   - Prior year carryforwards (losses, credits)

5. **Create filing checklist:**
   - List every document needed for filing
   - Mark what is available vs. missing
   - Note estimated tax payments already made
   - Flag items needing professional review

6. **Write the artifact** to `.singularskills/bookkeeping/<project>/tax-prep.md` with sections:
   - **Entity & Filing Info** — entity type, tax year, deadlines, forms
   - **Income Summary** — all income sources with totals
   - **Deductions Summary** — all deductible expenses with totals
   - **Supporting Schedules** — depreciation, assets, carryforwards
   - **Filing Checklist** — document readiness tracker
   - **Estimated Tax Position** — projected tax liability or refund

## Output

The tax preparation package written to `.singularskills/bookkeeping/<project>/tax-prep.md`. Present a summary highlighting:
- Total income and deductions
- Estimated tax position
- Missing documents or items needing attention

End the artifact with this paragraph, verbatim:

> **Not financial or tax advice.** This artifact is generated analysis for review by a qualified accountant or financial professional before any filing, reporting or decision relies on it.

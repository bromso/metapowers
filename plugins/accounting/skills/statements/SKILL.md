---
description: Prepare income statement, balance sheet, and cash flow statement
---

# Financial Statements

Prepare financial statements for "$ARGUMENTS". Use the adjusted trial balance to produce the income statement, balance sheet, and statement of cash flows.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.metapowers/accounting/<project>/skip-log.md`: `- <ISO timestamp> — <skill name> skipped prerequisite check for <artifact file> — reason: <reason or "none given">`.

## Prerequisites

Read `.metapowers/accounting/<project>/06-adjusted-balance.md` for the adjusted trial balance. Reference `${CLAUDE_PLUGIN_ROOT}/shared/financial-statements-template.md` for the statement format.

## Process

1. **Prepare the Income Statement:**
   - List all revenue accounts and their adjusted balances
   - List all expense accounts and their adjusted balances
   - Calculate gross profit (if applicable), operating income, and net income
   - Include earnings per share if the entity is a corporation

2. **Prepare the Balance Sheet:**
   - **Assets** — list current assets (cash, receivables, inventory, prepaid) and non-current assets (PP&E, intangibles) with subtotals
   - **Liabilities** — list current liabilities (payables, accrued, unearned) and non-current liabilities with subtotals
   - **Equity** — list contributed capital, retained earnings (including current period net income)
   - Verify that total assets equal total liabilities plus equity

3. **Prepare the Cash Flow Statement:**
   - **Operating activities** — start with net income, adjust for non-cash items and working capital changes (indirect method)
   - **Investing activities** — purchases and sales of long-term assets
   - **Financing activities** — debt proceeds/repayments, equity transactions, dividends
   - Verify ending cash matches the balance sheet cash balance

4. **Write the artifact** to `.metapowers/accounting/<project>/07-statements.md` with sections:
   - **Income Statement** — complete statement for the period
   - **Balance Sheet** — complete statement as of period end
   - **Cash Flow Statement** — complete statement for the period
   - **Notes** — significant accounting policies, footnote disclosures

## Output

The financial statements written to `.metapowers/accounting/<project>/07-statements.md`. Present a summary highlighting:
- Net income (loss) for the period
- Total assets and total liabilities
- Net cash position and change in cash

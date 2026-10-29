---
name: accounting-statements
description: Prepare the income statement, balance sheet and cash flow statement with notes from an adjusted trial balance. Use when the user has adjusted balances for a period and needs formal financial statements for it. Not for a P&L with commentary and runway straight from reconciled books, or for ratio analysis; see /bookkeeping-report or /finance-ratios.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: accounting
  phase: 7
  artifact: 07-statements.md
---

# Financial Statements

Prepare financial statements for "$ARGUMENTS". Use the adjusted trial balance to produce the income statement, balance sheet, and statement of cash flows.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"accounting-statements","workflow":"accounting","phase":7,"project":"<project>","event":"skipped","artifact":"07-statements.md","note":"<reason or \"none given\">"}`.

**Compute with code.** Perform every calculation (totals, balances, ratios, variances, projections) with a script — Bash, Python or a spreadsheet formula written to a file — and include the computation alongside the result. Never do arithmetic mentally.

## Prerequisites

Run this skill's gate before writing: `sh <this skill's folder>/scripts/gate.sh <project> <project root>`, where `<project root>` is the folder that contains `.singularskills/` (use `.` when you are already there). If it exits non-zero, stop and tell the user what it printed, unless `--skip-checks` was given (see Arguments).

Read `.singularskills/accounting/<project>/06-adjusted-balance.md` for the adjusted trial balance. Reference `references/financial-statements-template.md` for the statement format.

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

4. **Write the artifact** to `.singularskills/accounting/<project>/07-statements.md` with sections:
   - **Income Statement** — complete statement for the period
   - **Balance Sheet** — complete statement as of period end
   - **Cash Flow Statement** — complete statement for the period
   - **Notes** — significant accounting policies, footnote disclosures

## Output

The financial statements written to `.singularskills/accounting/<project>/07-statements.md`. Present a summary highlighting:
- Net income (loss) for the period
- Total assets and total liabilities
- Net cash position and change in cash

**Record the run.** Append each of these events to `.singularskills/log.jsonl` as one line (create the folder and file if missing):

- Before you start work (once the gate has passed or `--skip-checks` was given): `{"ts":"<ISO timestamp>","skill":"accounting-statements","workflow":"accounting","phase":7,"project":"<project>","event":"started","artifact":"07-statements.md","note":""}`
- After you have written the artifact: the same line with `"event":"finished"`.
- If the gate refused and the user did not bypass it: the same line with `"event":"refused"` and `"note"` set to what the gate printed, instead of the other two; then stop.

Open the artifact with this frontmatter (`agent` is the agent you run in, or `unknown`; `gate` is `passed` when the gate ran clean and `skipped` under `--skip-checks`):

```yaml
---
skill: accounting-statements
workflow: accounting
phase: 7
project: <project>
started: <ISO timestamp>
finished: <ISO timestamp>
agent: <the agent you run in, or "unknown">
gate: <passed|skipped>
---
```

End the artifact with `## Decisions` and `## Open questions`, in this shape:

```markdown
## Decisions
- <what was chosen> — <why> — <what was rejected>

## Open questions
- <what the next phase or a reviewer must settle>
```

End the artifact with this paragraph, verbatim:

> **Not financial or tax advice.** This artifact is generated analysis for review by a qualified accountant or financial professional before any filing, reporting or decision relies on it.

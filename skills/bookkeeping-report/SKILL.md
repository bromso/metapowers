---
name: bookkeeping-report
description: Generate a profit and loss, balance sheet and cash flow statement from reconciled books, with key ratios, commentary and cash runway. Use when the user has reconciled the month or quarter and wants to see how the business did and how much runway is left. Not for formal statements with policy notes, or a full baseline for planning; see /accounting-statements or /finance-assess.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: bookkeeping
  phase: 4
  artifact: 04-report.md
---

# Report

Generate financial statements for "$ARGUMENTS" from reconciled data. Produce a profit and loss statement, balance sheet, and cash flow statement with trend analysis.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"<skill name>","workflow":"bookkeeping","phase":<phase>,"project":"<project>","event":"skipped","artifact":"<artifact file>","note":"<reason or \"none given\">"}`.

**Compute with code.** Perform every calculation (totals, balances, ratios, variances, projections) with a script — Bash, Python or a spreadsheet formula written to a file — and include the computation alongside the result. Never do arithmetic mentally.

## Prerequisites

Run `scripts/gate.sh <project>` from this skill's folder. If it exits non-zero, stop and tell the user what it printed (unless `--skip-checks`, see Arguments).

Read `.singularskills/bookkeeping/<project>/03-reconcile.md` for reconciled balances and adjusting entries.

## Process

1. **Prepare trial balance:**
   - List all accounts with their reconciled balances
   - Verify total debits equal total credits
   - Apply any period-end adjustments (accruals, deferrals, depreciation)

2. **Generate Profit & Loss (Income Statement):**
   - Revenue accounts (4000-series)
   - Less: Cost of Goods Sold (5000-series)
   - Equals: Gross Profit
   - Less: Operating Expenses (6000-series)
   - Equals: Operating Income
   - Plus/Minus: Other Income/Expenses (7000-series)
   - Equals: Net Income

3. **Generate Balance Sheet:**
   - Assets (1000-series) — current and fixed
   - Liabilities (2000-series) — current and long-term
   - Equity (3000-series) — including net income from P&L
   - Verify: Assets = Liabilities + Equity

4. **Generate Cash Flow Statement:**
   - **Operating Activities** — cash from core business
   - **Investing Activities** — asset purchases and sales
   - **Financing Activities** — loans, equity, dividends
   - Net change in cash for the period

5. **Analyze and highlight:**
   - Key ratios (gross margin, net margin, current ratio, quick ratio)
   - Period-over-period trends if prior data exists
   - Anomalies or areas of concern
   - Cash runway estimate

6. **Write the artifact** to `.singularskills/bookkeeping/<project>/04-report.md` with sections:
   - **Trial Balance** — all accounts with balances
   - **Profit & Loss** — full income statement
   - **Balance Sheet** — full statement of financial position
   - **Cash Flow Statement** — cash movements by category
   - **Key Ratios** — financial health indicators
   - **Commentary** — narrative on trends and concerns

## Output

The financial report written to `.singularskills/bookkeeping/<project>/04-report.md`. Present a summary highlighting:
- Net income/loss for the period
- Total assets and liabilities
- Cash position and runway
- Key ratios and any concerns

**Record the run.** Open the artifact with this frontmatter (`agent` is the agent you run in, or `unknown`; `gate` is `passed` when the gate ran clean and `skipped` under `--skip-checks`):

```yaml
---
skill: bookkeeping-report
workflow: bookkeeping
phase: 4
project: <project>
started: <ISO timestamp>
finished: <ISO timestamp>
agent: <the agent you run in, or "unknown">
gate: <passed|skipped>
---
```

End the artifact (or your section of a shared artifact) with `## Decisions` and `## Open questions`, in this shape:

```markdown
## Decisions
- <what was chosen> — <why> — <what was rejected>

## Open questions
- <what the next phase or a reviewer must settle>
```

End the artifact with this paragraph, verbatim:

> **Not financial or tax advice.** This artifact is generated analysis for review by a qualified accountant or financial professional before any filing, reporting or decision relies on it.

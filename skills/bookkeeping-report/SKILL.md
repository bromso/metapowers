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

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"bookkeeping-report","workflow":"bookkeeping","phase":4,"project":"<project>","event":"skipped","artifact":"04-report.md","note":"<reason or \"none given\">"}`.

**Compute with code.** Perform every calculation (totals, balances, ratios, variances, projections) with a script — Bash, Python or a spreadsheet formula written to a file — and include the computation alongside the result. Never do arithmetic mentally.

## Prerequisites

**Part of a workflow.** This skill is phase 4 (Report) of the Bookkeeping Cycle workflow (`bookkeeping`); cross-domain workflows run it too. Unless the user named this skill, check `.singularskills/log.jsonl` for an open run for this project: a `run-started` line with `"project":"<project>"` and no later `run-finished` line for the same `workflow` and `project`. If there is no open run, or the user asked to start, run, continue or resume a process or workflow rather than this one step, do not continue here: invoke the `workflow` skill with the workflow the user asked for, or `bookkeeping` when they named none, followed by `<project>`. It runs this phase in order, asks before it writes and records the run. Continue here when the user named this skill, or when an open run exists (the conductor is running you).

Run this skill's gate before writing: `sh <this skill's folder>/scripts/gate.sh <project> <project root>`, where `<project root>` is the folder that contains `.singularskills/` (use `.` when you are already there). If it exits non-zero, stop and tell the user what it printed, unless `--skip-checks` was given (see Arguments). On a refusal, before you stop, append this line to `.singularskills/log.jsonl` (create the folder and file if missing): `{"ts":"<ISO timestamp>","skill":"bookkeeping-report","workflow":"bookkeeping","phase":4,"project":"<project>","event":"refused","artifact":"04-report.md","note":"<what the gate printed>"}`. Once the gate has passed, or under `--skip-checks` once you have appended the `skipped` line, append this line before you start work: `{"ts":"<ISO timestamp>","skill":"bookkeeping-report","workflow":"bookkeeping","phase":4,"project":"<project>","event":"started","artifact":"04-report.md","note":""}`.

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

**Record the run.** After you have written the artifact, append this line to `.singularskills/log.jsonl` (the `started` line of Prerequisites, with `"event":"finished"`): `{"ts":"<ISO timestamp>","skill":"bookkeeping-report","workflow":"bookkeeping","phase":4,"project":"<project>","event":"finished","artifact":"04-report.md","note":""}`.

Open the artifact with this frontmatter (`agent` is the agent you run in, or `unknown`; `gate` is `passed` when the gate ran clean and `skipped` under `--skip-checks`):

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

End the artifact with `## Decisions` and `## Open questions`, in this shape:

```markdown
## Decisions
- <what was chosen> — <why> — <what was rejected>

## Open questions
- <what the next phase or a reviewer must settle>
```

End the artifact with this paragraph, verbatim:

> **Not financial or tax advice.** This artifact is generated analysis for review by a qualified accountant or financial professional before any filing, reporting or decision relies on it.

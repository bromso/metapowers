---
name: finance-plan
description: Define the financial plan's horizon, strategic objectives, KPIs with targets and the revenue, cost and capital assumptions behind them. Use when the user has a financial baseline and wants to set financial goals and the assumptions to forecast from. Not for monthly projections or department budgets; see /finance-forecast or /finance-budget.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: finance
  phase: 2
  artifact: 02-plan.md
---

# Plan

Define the strategic financial plan for "$ARGUMENTS". Set objectives, choose KPIs, and document the assumptions that will drive the forecast and budget.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"<skill name>","workflow":"finance","phase":<phase>,"project":"<project>","event":"skipped","artifact":"<artifact file>","note":"<reason or \"none given\">"}`.

**Compute with code.** Perform every calculation (totals, balances, ratios, variances, projections) with a script — Bash, Python or a spreadsheet formula written to a file — and include the computation alongside the result. Never do arithmetic mentally.

## Prerequisites

Run `scripts/gate.sh <project>` from this skill's folder. If it exits non-zero, stop and tell the user what it printed (unless `--skip-checks`, see Arguments).

Read `.singularskills/finance/<project>/01-assess.md`. If this file does not exist, tell the user:

> Phase 1 (Assess) has not been completed for "<project>". Run `/finance-assess <project>` first, or use `--skip-checks` to bypass.

## Process

1. **Read context:**
   - Read `.singularskills/finance/<project>/01-assess.md` for baseline metrics and business profile

2. **Define strategic objectives:**
   - What is the planning horizon? (quarterly, annual, 3-year)
   - What are the top 3-5 financial goals? (growth rate, profitability, fundraise, break-even)
   - What business milestones are tied to these goals?
   - Are there external deadlines? (fundraise timeline, board commitments)

3. **Select KPIs:**
   - Choose 5-10 KPIs aligned with objectives
   - For each KPI: define the metric, target, current value, and measurement frequency
   - Categorize: growth, profitability, efficiency, liquidity
   - Identify leading vs lagging indicators

4. **Document planning assumptions:**
   - Revenue assumptions (growth rates, pricing, churn, expansion)
   - Cost assumptions (hiring plan, vendor costs, inflation)
   - Market assumptions (TAM, competitive dynamics, seasonality)
   - Capital assumptions (funding, debt, payment terms)
   - Flag which assumptions carry the most risk

5. **Write the artifact** to `.singularskills/finance/<project>/02-plan.md` with sections:
   - **Planning Horizon** — timeframe and context
   - **Strategic Objectives** — prioritized financial goals
   - **KPI Dashboard** — metrics, targets, current values
   - **Planning Assumptions** — all assumptions with risk ratings
   - **Milestones** — key dates and financial triggers

## Output

The plan written to `.singularskills/finance/<project>/02-plan.md`. Present a summary highlighting:
- Planning horizon and objectives
- Key KPIs and targets
- Highest-risk assumptions

**Record the run.** Open the artifact with this frontmatter (`agent` is the agent you run in, or `unknown`; `gate` is `passed` when the gate ran clean and `skipped` under `--skip-checks`):

```yaml
---
skill: finance-plan
workflow: finance
phase: 2
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

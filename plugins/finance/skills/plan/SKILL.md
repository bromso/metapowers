---
name: plan
description: Define the financial plan's horizon, strategic objectives, KPIs with targets and the revenue, cost and capital assumptions behind them. Use when the user has a financial baseline and wants to set financial goals and the assumptions to forecast from. Not for monthly projections or department budgets; see /finance:forecast or /finance:budget.
argument-hint: "[project] [--skip-checks]"
---

# Plan

Define the strategic financial plan for "$ARGUMENTS". Set objectives, choose KPIs, and document the assumptions that will drive the forecast and budget.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.metapowers/finance/<project>/skip-log.md`: `- <ISO timestamp> — <skill name> skipped prerequisite check for <artifact file> — reason: <reason or "none given">`.

## Prerequisites

Read `.metapowers/finance/<project>/01-assess.md`. If this file does not exist, tell the user:

> Phase 1 (Assess) has not been completed for "<project>". Run `/finance:assess <project>` first, or use `--skip-checks` to bypass.

## Process

1. **Read context:**
   - Read `.metapowers/finance/<project>/01-assess.md` for baseline metrics and business profile

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

5. **Write the artifact** to `.metapowers/finance/<project>/02-plan.md` with sections:
   - **Planning Horizon** — timeframe and context
   - **Strategic Objectives** — prioritized financial goals
   - **KPI Dashboard** — metrics, targets, current values
   - **Planning Assumptions** — all assumptions with risk ratings
   - **Milestones** — key dates and financial triggers

## Output

The plan written to `.metapowers/finance/<project>/02-plan.md`. Present a summary highlighting:
- Planning horizon and objectives
- Key KPIs and targets
- Highest-risk assumptions

---
name: forecast
description: Project monthly revenue, expenses and cash flow from the plan's drivers, with runway, break-even timing and whether KPI targets are reachable. Use when the user has planning assumptions and asks what revenue, burn and cash will look like over the coming months or years. Not for splitting spend by department; see /finance:budget.
argument-hint: "[project] [--skip-checks]"
---

# Forecast

Project the financial forecast for "$ARGUMENTS". Build a driver-based model that translates planning assumptions into monthly revenue, expense, and cash flow projections.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.metapowers/finance/<project>/skip-log.md`: `- <ISO timestamp> — <skill name> skipped prerequisite check for <artifact file> — reason: <reason or "none given">`.

## Prerequisites

Read `.metapowers/finance/<project>/02-plan.md`. If this file does not exist, tell the user:

> Phase 2 (Plan) has not been completed for "<project>". Run `/finance:plan <project>` first, or use `--skip-checks` to bypass.

## Process

1. **Read context:**
   - Read `.metapowers/finance/<project>/01-assess.md` for baseline data
   - Read `.metapowers/finance/<project>/02-plan.md` for assumptions and KPI targets

2. **Build revenue forecast:**
   - Model each revenue stream separately
   - Apply growth assumptions (new customers, churn, expansion, pricing changes)
   - Account for seasonality and ramp periods
   - Calculate monthly and annual totals
   - Reference `${CLAUDE_PLUGIN_ROOT}/shared/financial-model-template.md` for revenue model structure

3. **Build expense forecast:**
   - Project fixed costs (rent, salaries, subscriptions)
   - Project variable costs tied to revenue drivers
   - Include planned headcount additions and timing
   - Account for one-time costs (equipment, setup, legal)

4. **Build cash flow forecast:**
   - Map revenue to cash collections (considering payment terms)
   - Map expenses to cash payments
   - Include capital expenditures and financing
   - Calculate monthly net cash flow and ending balance
   - Determine runway and break-even timing

5. **Validate against KPIs:**
   - Check if the forecast achieves the KPI targets from the plan
   - Identify gaps and what would need to change
   - Note dependencies and risks

6. **Write the artifact** to `.metapowers/finance/<project>/03-forecast.md` with sections:
   - **Revenue Forecast** — monthly projections by stream
   - **Expense Forecast** — monthly projections by category
   - **Cash Flow Forecast** — monthly cash in, cash out, net, balance
   - **Key Metrics Over Time** — MRR, gross margin, burn rate, runway
   - **KPI Achievement** — projected vs target values
   - **Forecast Risks** — key sensitivities and downside scenarios

## Output

The forecast written to `.metapowers/finance/<project>/03-forecast.md`. Present a summary highlighting:
- Revenue trajectory and growth rate
- Burn rate and runway
- Whether KPI targets are achievable
- Top forecast risks

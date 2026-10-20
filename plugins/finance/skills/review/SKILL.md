---
description: Monitor performance against budget, analyze variances, and reforecast
---

# Review

Review financial performance for "$ARGUMENTS". Compare actuals to budget, analyze variances, identify trends, and update the forecast based on new information.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.metapowers/finance/<project>/skip-log.md`: `- <ISO timestamp> — <skill name> skipped prerequisite check for <artifact file> — reason: <reason or "none given">`.

## Prerequisites

Read `.metapowers/finance/<project>/05-model.md`. If this file does not exist, tell the user:

> Phase 5 (Model) has not been completed for "<project>". Run `/finance:model <project>` first, or use `--skip-checks` to bypass.

## Process

1. **Read context:**
   - Read `.metapowers/finance/<project>/02-plan.md` for KPI targets
   - Read `.metapowers/finance/<project>/03-forecast.md` for original projections
   - Read `.metapowers/finance/<project>/04-budget.md` for departmental budgets
   - Read `.metapowers/finance/<project>/05-model.md` for scenario benchmarks

2. **Collect actuals:**
   - Ask the user for actual financial results for the review period
   - Revenue actuals by stream
   - Expense actuals by department and category
   - Cash position and cash flow actuals
   - Headcount actuals

3. **Variance analysis:**
   - Calculate budget vs actual for each line item
   - Classify variances: favorable/unfavorable, timing/permanent, volume/price/mix
   - Identify the top 5 variances by dollar amount
   - Determine root causes for significant variances

4. **KPI scorecard:**
   - Update each KPI with actual values
   - Show trend (improving, stable, declining)
   - Flag any KPIs at risk of missing annual target

5. **Reforecast:**
   - Based on actuals and trends, update the remaining forecast
   - Adjust assumptions that have proven incorrect
   - Recalculate runway and break-even timing
   - Recommend budget reallocations if needed

6. **Write the artifact** to `.metapowers/finance/<project>/06-review.md` with sections:
   - **Period Summary** — review period and key headlines
   - **Variance Analysis** — budget vs actual with explanations
   - **KPI Scorecard** — target vs actual vs trend
   - **Reforecast** — updated projections for remaining periods
   - **Recommendations** — actions to take based on findings
   - **Risks and Watch Items** — emerging issues to monitor

## Output

The review written to `.metapowers/finance/<project>/06-review.md`. Present a summary highlighting:
- Performance vs budget (on track, ahead, behind)
- Largest variances and root causes
- Updated runway and key metric trajectory
- Recommended actions

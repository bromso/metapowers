---
name: finance-review
description: Review actual results against budget with variance analysis, a KPI scorecard and a reforecast of the remaining periods, plus recommended reallocations. Use when a month or quarter has closed and the user wants to know whether they are on plan and what to change. Not for explaining a single variance without reforecasting; see /accounting-variance.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: finance
  phase: 6
  artifact: 06-review.md
---

# Review

Review financial performance for "$ARGUMENTS". Compare actuals to budget, analyze variances, identify trends, and update the forecast based on new information.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"<skill name>","workflow":"finance","phase":<phase>,"project":"<project>","event":"skipped","artifact":"<artifact file>","note":"<reason or \"none given\">"}`.

**Compute with code.** Perform every calculation (totals, balances, ratios, variances, projections) with a script — Bash, Python or a spreadsheet formula written to a file — and include the computation alongside the result. Never do arithmetic mentally.

## Prerequisites

Run `scripts/gate.sh <project>` from this skill's folder. If it exits non-zero, stop and tell the user what it printed (unless `--skip-checks`, see Arguments).

Read `.singularskills/finance/<project>/05-model.md`. If this file does not exist, tell the user:

> Phase 5 (Model) has not been completed for "<project>". Run `/finance-model <project>` first, or use `--skip-checks` to bypass.

## Process

1. **Read context:**
   - Read `.singularskills/finance/<project>/02-plan.md` for KPI targets
   - Read `.singularskills/finance/<project>/03-forecast.md` for original projections
   - Read `.singularskills/finance/<project>/04-budget.md` for departmental budgets
   - Read `.singularskills/finance/<project>/05-model.md` for scenario benchmarks

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

6. **Write the artifact** to `.singularskills/finance/<project>/06-review.md` with sections:
   - **Period Summary** — review period and key headlines
   - **Variance Analysis** — budget vs actual with explanations
   - **KPI Scorecard** — target vs actual vs trend
   - **Reforecast** — updated projections for remaining periods
   - **Recommendations** — actions to take based on findings
   - **Risks and Watch Items** — emerging issues to monitor

## Output

The review written to `.singularskills/finance/<project>/06-review.md`. Present a summary highlighting:
- Performance vs budget (on track, ahead, behind)
- Largest variances and root causes
- Updated runway and key metric trajectory
- Recommended actions

**Record the run.** Open the artifact with this frontmatter (`agent` is the agent you run in, or `unknown`; `gate` is `passed` when the gate ran clean and `skipped` under `--skip-checks`):

```yaml
---
skill: finance-review
workflow: finance
phase: 6
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

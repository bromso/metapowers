# FP&A Framework Guide

A structured six-phase Financial Planning & Analysis process for building and maintaining financial models, budgets, and forecasts.

## The Six Phases

| Phase | Skill | Purpose |
|-------|-------|---------|
| 1. Assess | `/finance:assess` | Consolidate historical data, validate sources, establish baseline |
| 2. Plan | `/finance:plan` | Define strategic objectives, KPIs, and planning assumptions |
| 3. Forecast | `/finance:forecast` | Project revenue, expenses, and cash flow over planning horizon |
| 4. Budget | `/finance:budget` | Allocate expenses by department, set spending guardrails |
| 5. Model | `/finance:model` | Build valuation and scenario models, stress-test assumptions |
| 6. Review | `/finance:review` | Monitor actuals vs budget, identify variances, reforecast |

## Utility Skills

| Skill | Purpose |
|-------|---------|
| `/finance:scenario` | Best/base/worst-case scenario modeling |
| `/finance:sensitivity` | Variable impact analysis (tornado charts, data tables) |
| `/finance:cashflow-stress` | Liquidity risk modeling and runway analysis |
| `/finance:unit-economics` | CAC, LTV, margin, and payback period analysis |
| `/finance:ratios` | Liquidity, profitability, leverage, and efficiency ratios |

## Key Principles

1. **Data integrity first** — Every model starts with validated, reconciled data
2. **Assumptions are explicit** — All inputs and assumptions are documented and traceable
3. **Scenarios over point estimates** — Always model best, base, and worst cases
4. **Driver-based planning** — Link financial outputs to operational drivers
5. **Variance analysis is continuous** — Compare actuals to plan monthly, reforecast quarterly

## Artifact Structure

All artifacts are written to `.metapowers/finance/<project>/`:

```
.metapowers/finance/<project>/
├── 01-assess.md        # Financial data assessment
├── 02-plan.md          # Strategic plan and KPIs
├── 03-forecast.md      # Revenue and cash flow projections
├── 04-budget.md        # Departmental budget allocation
├── 05-model.md         # Valuation and scenario models
├── 06-review.md        # Performance review and variance analysis
├── scenario.md         # Scenario analysis output
├── sensitivity.md      # Sensitivity analysis output
├── cashflow-stress.md  # Cash flow stress test output
├── unit-economics.md   # Unit economics analysis output
├── ratios.md           # Financial ratios output
└── skip-log.md         # Skipped prerequisite log (if any)
```

## Planning Horizons

| Horizon | Use Case |
|---------|----------|
| Monthly | Cash flow management, variance reporting |
| Quarterly | Reforecasting, board reporting |
| Annual | Budget cycles, strategic planning |
| 3-5 Year | Long-range planning, fundraising models |

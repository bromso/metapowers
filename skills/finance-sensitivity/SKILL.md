---
name: finance-sensitivity
description: Analyze which input variables move financial outcomes most, with tornado-chart data, two-variable tables and a breakeven threshold per variable. Use when the user wants to know which assumptions matter most or how far a driver can fall before the business stops breaking even. Not for runway under adverse shocks; see /finance-cashflow-stress.
metadata:
  argument-hint: "[project] [--skip-checks]"
---

# Sensitivity

Analyze variable sensitivity for "$ARGUMENTS". Determine which inputs have the greatest impact on key financial outputs to prioritize risk management and decision-making.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"finance-sensitivity","workflow":"finance","phase":null,"project":"<project>","event":"skipped","artifact":"<artifact file>","note":"<reason or \"none given\">"}`.

**Compute with code.** Perform every calculation (totals, balances, ratios, variances, projections) with a script — Bash, Python or a spreadsheet formula written to a file — and include the computation alongside the result. Never do arithmetic mentally.

## Prerequisites

None — utility skill, run anytime. Works best when financial data exists in `.singularskills/finance/<project>/`.

## Process

1. **Gather context:**
   - If prior phase artifacts exist, read them for baseline assumptions
   - Identify the output metrics to test (revenue, EBITDA, cash runway, valuation)
   - Determine the base case values for all input variables

2. **Select variables to test:**
   - Revenue drivers: growth rate, churn rate, ARPU, conversion rate
   - Cost drivers: headcount, cost per hire, vendor costs, COGS
   - Capital drivers: payment terms, collection period, funding timing
   - Choose 6-10 variables with the most uncertainty

3. **Run one-at-a-time analysis:**
   - For each variable, calculate the output when the variable moves +/- 10%, 20%, 30%
   - Hold all other variables constant at base case
   - Rank variables by impact magnitude (tornado chart data)

4. **Run two-variable data tables:**
   - Pick the top 2-3 most impactful variables
   - Create data tables showing output for combinations of values
   - Identify "danger zones" where combinations produce unacceptable outcomes

5. **Identify breakeven thresholds:**
   - For each key variable, find the value at which the business breaks even
   - Calculate the margin of safety (how far current value is from breakeven)

6. **Write the artifact** to `.singularskills/finance/<project>/sensitivity.md` with sections:
   - **Variables Tested** — list of inputs, base values, and ranges
   - **Tornado Chart Data** — ranked impact of each variable on key outputs
   - **Data Tables** — two-variable sensitivity matrices
   - **Breakeven Thresholds** — critical values for each variable
   - **Risk Prioritization** — which variables to monitor most closely

## Output

The sensitivity analysis written to `.singularskills/finance/<project>/sensitivity.md`. Present a summary highlighting:
- Top 3 most impactful variables
- Breakeven thresholds for critical inputs
- Highest-risk combinations

End the artifact with this paragraph, verbatim:

> **Not financial or tax advice.** This artifact is generated analysis for review by a qualified accountant or financial professional before any filing, reporting or decision relies on it.

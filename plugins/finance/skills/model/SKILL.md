---
name: model
description: Build valuation and scenario models to stress-test financial assumptions
argument-hint: "[project] [--skip-checks]"
---

# Model

Build the financial model for "$ARGUMENTS". Create an integrated model with scenario analysis, valuation, and sensitivity testing to support decision-making and fundraising.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.metapowers/finance/<project>/skip-log.md`: `- <ISO timestamp> — <skill name> skipped prerequisite check for <artifact file> — reason: <reason or "none given">`.

## Prerequisites

Read `.metapowers/finance/<project>/04-budget.md`. If this file does not exist, tell the user:

> Phase 4 (Budget) has not been completed for "<project>". Run `/finance:budget <project>` first, or use `--skip-checks` to bypass.

## Process

1. **Read context:**
   - Read `.metapowers/finance/<project>/01-assess.md` through `04-budget.md` for complete financial picture
   - Reference `${CLAUDE_PLUGIN_ROOT}/shared/financial-model-template.md` for scenario table structure

2. **Build integrated P&L model:**
   - Revenue model with driver-based projections
   - COGS and gross profit
   - Operating expenses by category
   - EBITDA and net income
   - Project 3-5 years with monthly detail for year 1

3. **Build scenario models:**
   - **Base case:** aligned with the forecast and budget
   - **Best case:** upside assumptions (faster growth, better margins)
   - **Worst case:** downside assumptions (slower growth, higher costs, churn)
   - For each scenario: revenue, expenses, cash flow, runway, break-even
   - Reference `${CLAUDE_PLUGIN_ROOT}/shared/financial-model-template.md` for scenario table format

4. **Valuation analysis** (if applicable):
   - Revenue multiples (based on comparable companies)
   - DCF analysis with WACC assumptions
   - Last-round valuation and implied metrics
   - Cap table impact of future fundraising scenarios

5. **Sensitivity analysis:**
   - Identify the 5-8 variables with the most impact
   - Show how changes in each variable affect key outputs
   - Create tornado chart data (which inputs swing outcomes most)

6. **Write the artifact** to `.metapowers/finance/<project>/05-model.md` with sections:
   - **Integrated P&L** — multi-year income statement
   - **Scenario Analysis** — best/base/worst case summaries
   - **Valuation** — multiples, DCF, and comparable analysis
   - **Sensitivity Matrix** — variable impact on key metrics
   - **Model Assumptions Log** — every input and its source/rationale

## Output

The model written to `.metapowers/finance/<project>/05-model.md`. Present a summary highlighting:
- Base case P&L trajectory
- Scenario range (worst to best)
- Valuation range
- Most sensitive variables

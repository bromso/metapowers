---
name: variance
description: Compare actual results to budget, forecast or prior period line by line, with dollar and percentage variances and volume, price, mix or timing drivers. Use when actuals came in off plan and the user wants to know by how much and why. Not for a full performance review with KPI scorecard and reforecast; see /finance:review.
argument-hint: "[project] [--skip-checks]"
---

# Variance

Perform variance analysis for "$ARGUMENTS". Compare actual results to budget, forecast, or prior period and explain the differences.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.metapowers/accounting/<project>/skip-log.md`: `- <ISO timestamp> — <skill name> skipped prerequisite check for <artifact file> — reason: <reason or "none given">`.

**Compute with code.** Perform every calculation (totals, balances, ratios, variances, projections) with a script — Bash, Python or a spreadsheet formula written to a file — and include the computation alongside the result. Never do arithmetic mentally.

## Prerequisites

None — utility skill, run anytime. More effective when financial data is available from Phase 7 (statements) or Phase 4 (trial balance).

## Process

1. **Establish comparison basis:**
   - What are we comparing? (actual vs. budget, actual vs. forecast, actual vs. prior period)
   - What level of detail? (total entity, department, account, line item)
   - What period? (month, quarter, year)

2. **Calculate variances:**
   - For each line item, compute:
     - **Dollar variance** — actual minus budget/forecast
     - **Percentage variance** — dollar variance divided by budget/forecast
   - Classify as favorable (F) or unfavorable (U)
   - Highlight variances exceeding materiality thresholds

3. **Analyze root causes:**
   - For each significant variance, identify the driver:
     - Volume variance (more or fewer units)
     - Price variance (higher or lower unit cost/price)
     - Mix variance (different product/service mix)
     - Timing variance (recognized in a different period)
     - One-time items (non-recurring events)
   - Quantify each driver where possible

4. **Write the artifact** to `.metapowers/accounting/<project>/variance.md` with sections:
   - **Variance Summary** — high-level overview of actual vs. budget with key metrics
   - **Detailed Variance Table** — line-by-line comparison with dollar and percentage variances
   - **Root Cause Analysis** — explanation of significant variances
   - **Recommendations** — actions to address unfavorable variances or capitalize on favorable ones

## Output

The variance analysis written to `.metapowers/accounting/<project>/variance.md`. Present a summary highlighting:
- Top favorable and unfavorable variances
- Key root causes identified
- Recommended actions

End the artifact with this paragraph, verbatim:

> **Not financial or tax advice.** This artifact is generated analysis for review by a qualified accountant or financial professional before any filing, reporting or decision relies on it.

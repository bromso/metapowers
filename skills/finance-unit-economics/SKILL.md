---
name: finance-unit-economics
description: Analyze customer acquisition cost by channel, lifetime value, LTV to CAC, payback period and contribution margin to judge whether the business model scales. Use when the user asks whether each customer is profitable or whether it makes sense to spend more on acquisition.
metadata:
  argument-hint: "[project] [--skip-checks]"
---

# Unit Economics

Analyze unit economics for "$ARGUMENTS". Calculate the fundamental economics of acquiring and serving a customer to determine whether the business model is sustainable and scalable.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"<skill name>","workflow":"finance","phase":<phase>,"project":"<project>","event":"skipped","artifact":"<artifact file>","note":"<reason or \"none given\">"}`.

**Compute with code.** Perform every calculation (totals, balances, ratios, variances, projections) with a script — Bash, Python or a spreadsheet formula written to a file — and include the computation alongside the result. Never do arithmetic mentally.

## Prerequisites

None — utility skill, run anytime. Works best when financial data exists in `.singularskills/finance/<project>/`.

## Process

1. **Gather context:**
   - If prior phase artifacts exist, read them for revenue and cost data
   - Ask for customer count, revenue, and cost data
   - Determine the business model (subscription, transactional, marketplace, etc.)

2. **Calculate acquisition economics:**
   - **Customer Acquisition Cost (CAC):** total sales + marketing spend / new customers
   - Break down CAC by channel (organic, paid, referral, outbound)
   - Track CAC trend over time (improving or worsening)
   - Calculate blended and fully-loaded CAC

3. **Calculate lifetime value:**
   - **Average Revenue Per User (ARPU):** monthly and annual
   - **Gross margin per customer:** ARPU - direct costs per customer
   - **Customer lifetime:** 1 / monthly churn rate
   - **Lifetime Value (LTV):** gross margin per customer x customer lifetime
   - Segment LTV by customer cohort, plan, or channel if data available

4. **Calculate efficiency ratios:**
   - **LTV:CAC ratio:** target > 3:1
   - **CAC payback period:** CAC / monthly gross profit per customer
   - **Contribution margin:** revenue - variable costs per unit
   - **Magic number:** net new ARR / prior quarter S&M spend

5. **Assess scalability:**
   - Does CAC increase or decrease with scale?
   - Is LTV stable, growing, or declining by cohort?
   - Where are the margin expansion opportunities?
   - What is the break-even point in units/customers?

6. **Write the artifact** to `.singularskills/finance/<project>/unit-economics.md` with sections:
   - **Customer Acquisition** — CAC by channel, blended CAC, trend
   - **Lifetime Value** — ARPU, churn, LTV, cohort analysis
   - **Efficiency Ratios** — LTV:CAC, payback period, magic number
   - **Margin Analysis** — contribution margin, gross margin by segment
   - **Scalability Assessment** — how metrics change with growth
   - **Improvement Opportunities** — levers to improve unit economics

## Output

The unit economics analysis written to `.singularskills/finance/<project>/unit-economics.md`. Present a summary highlighting:
- CAC and LTV with LTV:CAC ratio
- Payback period
- Whether unit economics support growth investment
- Top improvement levers

End the artifact with this paragraph, verbatim:

> **Not financial or tax advice.** This artifact is generated analysis for review by a qualified accountant or financial professional before any filing, reporting or decision relies on it.

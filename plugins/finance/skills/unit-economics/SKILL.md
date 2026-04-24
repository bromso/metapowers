---
description: Analyze customer acquisition cost, lifetime value, margins, and payback period
---

# Unit Economics

Analyze unit economics for "$ARGUMENTS". Calculate the fundamental economics of acquiring and serving a customer to determine whether the business model is sustainable and scalable.

## Prerequisites

None — utility skill, run anytime. Works best when financial data exists in `.metapowers/finance/$ARGUMENTS/`.

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

6. **Write the artifact** to `.metapowers/finance/$ARGUMENTS/unit-economics.md` with sections:
   - **Customer Acquisition** — CAC by channel, blended CAC, trend
   - **Lifetime Value** — ARPU, churn, LTV, cohort analysis
   - **Efficiency Ratios** — LTV:CAC, payback period, magic number
   - **Margin Analysis** — contribution margin, gross margin by segment
   - **Scalability Assessment** — how metrics change with growth
   - **Improvement Opportunities** — levers to improve unit economics

## Output

The unit economics analysis written to `.metapowers/finance/$ARGUMENTS/unit-economics.md`. Present a summary highlighting:
- CAC and LTV with LTV:CAC ratio
- Payback period
- Whether unit economics support growth investment
- Top improvement levers

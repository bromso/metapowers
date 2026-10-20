---
name: cashflow-stress
description: Test cash flow under revenue shocks, late collections and cost spikes to find runway in each case, the liquidity levers available and cash trigger levels. Use when the user worries about running out of cash or asks how long their runway lasts if revenue drops. Not for general best, base and worst planning; see /finance:scenario.
argument-hint: "[project] [--skip-checks]"
---

# Cash Flow Stress

Stress-test cash flow for "$ARGUMENTS". Model adverse scenarios to understand liquidity risk, minimum cash requirements, and how long the business can survive under pressure.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.metapowers/finance/<project>/skip-log.md`: `- <ISO timestamp> — <skill name> skipped prerequisite check for <artifact file> — reason: <reason or "none given">`.

**Compute with code.** Perform every calculation (totals, balances, ratios, variances, projections) with a script — Bash, Python or a spreadsheet formula written to a file — and include the computation alongside the result. Never do arithmetic mentally.

## Prerequisites

None — utility skill, run anytime. Works best when financial data exists in `.metapowers/finance/<project>/`.

## Process

1. **Gather context:**
   - If prior phase artifacts exist, read them for cash flow baseline
   - Ask for current cash position and monthly burn rate
   - Identify known upcoming cash events (payroll, rent, debt payments, expected revenue)

2. **Define stress scenarios:**
   - **Revenue shock:** 30%, 50%, 80% revenue decline
   - **Collection delay:** customers pay 30, 60, 90 days late
   - **Cost spike:** unexpected expense increase (legal, infrastructure, emergency hire)
   - **Combined stress:** revenue decline + collection delay simultaneously
   - **Black swan:** complete revenue halt for 1-3 months

3. **Model cash runway under each scenario:**
   - Project weekly or monthly cash position
   - Identify the date cash reaches zero for each scenario
   - Calculate minimum cash balance reached
   - Determine how many months of runway exist

4. **Identify liquidity levers:**
   - What expenses can be cut and how quickly? (fixed vs variable)
   - What credit facilities or reserves are available?
   - What assets can be liquidated?
   - What revenue can be accelerated? (prepayment discounts, advance billing)
   - Estimate the cash impact and timing of each lever

5. **Define the cash management playbook:**
   - Set cash balance trigger levels (green/yellow/red zones)
   - Define actions at each trigger level
   - Identify the minimum viable cash balance

6. **Write the artifact** to `.metapowers/finance/<project>/cashflow-stress.md` with sections:
   - **Current Position** — cash balance, burn rate, baseline runway
   - **Stress Scenarios** — projected cash under each adverse scenario
   - **Runway Summary** — months of runway per scenario
   - **Liquidity Levers** — available actions ranked by impact and speed
   - **Cash Management Playbook** — trigger levels and response actions
   - **Minimum Cash Requirements** — floor balance and rationale

## Output

The cash flow stress test written to `.metapowers/finance/<project>/cashflow-stress.md`. Present a summary highlighting:
- Current runway and burn rate
- Runway under worst-case stress
- Available liquidity levers
- Recommended minimum cash balance

End the artifact with this paragraph, verbatim:

> **Not financial or tax advice.** This artifact is generated analysis for review by a qualified accountant or financial professional before any filing, reporting or decision relies on it.

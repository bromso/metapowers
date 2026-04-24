---
description: Score and prioritize security risks by likelihood and impact
---

# Risk Assessment

Score and prioritize security risks by likelihood and impact for "$ARGUMENTS". Combine inputs from threat models and vulnerability assessments into a unified risk register with treatment strategies and assigned ownership.

## Prerequisites

Read `.metapowers/security/$ARGUMENTS/00-govern.md`. If this file does not exist, tell the user:

> Phase 0 (Govern) has not been completed for "$ARGUMENTS". Run a Govern skill first (e.g., `/security:security-policy $ARGUMENTS`), or use `--skip-checks` to bypass.

If `--skip-checks` is present in $ARGUMENTS, skip this check and log to `.metapowers/security/$ARGUMENTS/skip-log.md`.

## Process

1. **Identify risks from available sources:**
   - Review threat model findings (if available in `.metapowers/security/$ARGUMENTS/01-identify.md`)
   - Review vulnerability assessment results (if available)
   - Consider operational risks: process gaps, staffing shortages, tooling limitations
   - Consider environmental risks: regulatory changes, emerging threat landscape, industry-specific threats
   - Deduplicate and consolidate related risks into distinct risk items

2. **Score each risk:**
   - **Likelihood** (1-5):
     - 1 = Rare — may occur only in exceptional circumstances
     - 2 = Unlikely — could occur but not expected
     - 3 = Possible — might occur at some time
     - 4 = Likely — will probably occur in most circumstances
     - 5 = Almost certain — expected to occur routinely
   - **Impact** (1-5):
     - 1 = Negligible — minimal effect on operations or data
     - 2 = Minor — limited impact, easily recoverable
     - 3 = Moderate — noticeable business disruption or data exposure
     - 4 = Major — significant financial, reputational, or operational damage
     - 5 = Catastrophic — existential threat, massive data breach, regulatory shutdown
   - **Risk score** = likelihood x impact (range: 1-25)

3. **Categorize risks:**
   - **Critical** (20-25) — requires immediate executive attention and action
   - **High** (12-19) — requires mitigation plan within 30 days
   - **Medium** (6-11) — managed through standard security controls and monitoring
   - **Low** (1-5) — accepted and monitored through routine processes
   - Plot risks on a 5x5 risk matrix for visual representation

4. **Define treatment strategy per risk:**
   - **Mitigate** — implement controls to reduce likelihood or impact (most common)
   - **Transfer** — shift risk to third party via insurance, outsourcing, or contractual terms
   - **Accept** — acknowledge and monitor, used when cost of mitigation exceeds potential impact
   - **Avoid** — eliminate the activity or technology creating the risk
   - For each risk, document the chosen strategy with specific actions and expected residual risk

5. **Assign risk owners and set review dates:**
   - Assign a named owner for each risk (individual, not team)
   - Set review dates based on risk level:
     - Critical: reviewed weekly until mitigated
     - High: reviewed monthly
     - Medium: reviewed quarterly
     - Low: reviewed annually
   - Define escalation criteria: when does a risk get re-scored or escalated?

6. **Write the artifact** to `.metapowers/security/$ARGUMENTS/01-identify.md` with heading:

   ## Risk Assessment

   Include sections:
   - **Risk Register** — all risks with ID, description, likelihood, impact, score, and category
   - **Risk Matrix** — 5x5 visual matrix with risk placement
   - **Treatment Strategies** — action plan per risk with expected residual risk
   - **Risk Ownership** — assigned owners and review schedule
   - **Top Risks Summary** — detailed analysis of critical and high risks

## Output

The risk assessment written to `.metapowers/security/$ARGUMENTS/01-identify.md`. Present a summary to the user highlighting:
- Total risks identified and distribution across categories
- Top 5 highest-scoring risks with treatment strategies
- Risk ownership assignments
- Recommended review cadence and next review date

---
description: Identify score and plan mitigations for project risks
---

# Risk Assessment

Identify, score, and plan mitigations for risks in "$ARGUMENTS". Brainstorm risks across categories, score each by likelihood and impact, plot on a risk matrix, define mitigation strategies for top risks, assign owners, and set a review cadence.

## Prerequisites

None — this is a utility skill. It can be run at any time, with or without existing project artifacts.

If `.project/$ARGUMENTS/` exists, read any available artifacts for context. If it does not exist, proceed based on information the user provides.

## Process

1. **Gather context:**
   - If `.project/$ARGUMENTS/` exists, read available artifacts for project scope, team, timeline, and stakeholder information
   - Ask the user about the project or initiative if no context is available
   - Understand the project phase — risks differ between early planning, active development, and delivery

2. **Brainstorm risks across categories:**
   - **Technical:** architecture complexity, dependency risks, performance bottlenecks, security vulnerabilities, tech debt, integration challenges, unfamiliar technologies
   - **People:** key-person dependency, skills gaps, team turnover, availability conflicts, onboarding delays, team morale
   - **Schedule:** deadline pressure, dependency chains between workstreams, scope creep, underestimated effort, long feedback loops
   - **Scope:** unclear or changing requirements, conflicting stakeholder priorities, gold-plating, missing acceptance criteria
   - **External:** vendor delays, third-party API changes, market shifts, regulatory changes, competitor moves, budget cuts
   - Aim for 10-20 risks across categories — enough to be thorough without being overwhelming
   - Write each risk as a specific statement: "X may happen, causing Y" (not vague concerns)

3. **Score each risk by likelihood and impact:**
   - **Likelihood** (1-5): 1 = rare, 2 = unlikely, 3 = possible, 4 = likely, 5 = almost certain
   - **Impact** (1-5): 1 = negligible, 2 = minor, 3 = moderate, 4 = major, 5 = severe
   - **Risk score** = likelihood x impact (range 1-25)
   - Document brief rationale for each score — why this likelihood? why this impact level?

4. **Plot on risk matrix and classify:**
   - **High risk (score 15-25):** requires active mitigation, regular monitoring, escalation plan
   - **Medium risk (score 8-14):** needs a mitigation plan, monitor periodically
   - **Low risk (score 1-7):** accept and monitor, revisit if conditions change
   - Present the risk matrix visually as a table with likelihood on one axis and impact on the other

5. **Define mitigation strategy for each high and medium risk:**
   - **Avoid:** eliminate the risk by changing the plan (e.g., drop a risky feature, choose a proven technology)
   - **Transfer:** shift the risk to someone else (e.g., insurance, outsource to a specialist, use a managed service)
   - **Mitigate:** reduce likelihood or impact (e.g., add testing, build a prototype, cross-train team members, add buffer)
   - **Accept:** acknowledge the risk and prepare a contingency plan if it occurs
   - For each mitigation: describe the specific action, estimated effort, and how it reduces the risk score
   - Define trigger conditions — what signals that this risk is materializing?

6. **Assign risk owners:**
   - Each high and medium risk gets a single owner (one person accountable for monitoring and mitigation)
   - The owner does not have to do all the work — they ensure the mitigation plan is executed
   - Match owners to their area of expertise or responsibility

7. **Set review cadence:**
   - **High-risk projects:** weekly risk review (5-10 minutes in standup or dedicated slot)
   - **Normal projects:** biweekly risk review
   - **Stable projects:** monthly risk review
   - At each review: check for new risks, update scores on existing risks, verify mitigations are progressing, close resolved risks

8. **Write the artifact** — save to `.project/$ARGUMENTS/risk-assessment.md`:
   - **Risk Register** — table with columns: ID, Category, Risk Statement, Likelihood, Impact, Score, Classification, Strategy, Owner
   - **Risk Matrix** — visual matrix showing risk distribution
   - **Mitigation Plans** — detailed plans for each high and medium risk
   - **Review Cadence** — frequency and format for risk reviews
   - **Next Review Date** — when to revisit this assessment

## Output

Risk assessment saved to `.project/$ARGUMENTS/risk-assessment.md`. Present a summary highlighting:
- Total risks identified and distribution across categories
- Number of high, medium, and low risks
- Top 3 risks with their scores and mitigation strategies
- Recommended review cadence

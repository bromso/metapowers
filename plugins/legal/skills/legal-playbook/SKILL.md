---
description: Create standardized legal playbook for recurring scenarios
---

# Legal Playbook

Create a standardized legal playbook for "$ARGUMENTS". Define decision trees, approval thresholds, pre-approved templates, escalation criteria, and timeline expectations for recurring legal scenarios.

> **Note:** AI-generated legal content does not constitute legal advice. Consult a qualified attorney.

## Prerequisites

Check that `.legal/$ARGUMENTS/00-assess.md` exists. If it does not exist, stop and tell the user:

> "Run an Assess skill first (e.g. `/legal:risk-assessment $ARGUMENTS`) to generate the prerequisite assessment artifact."

If the user passes `--skip-checks`, bypass this check and log the skip to `.legal/$ARGUMENTS/skip-log.md` with a timestamp and the reason "Prerequisite check skipped for legal-playbook".

## Process

1. **Read inputs:**
   - Read `.legal/$ARGUMENTS/00-assess.md` for risk context, jurisdiction, and organizational profile
   - Review any existing legal artifacts in `.legal/$ARGUMENTS/`

2. **Identify recurring legal scenarios:**
   - **Contract negotiation** — standard terms, acceptable deviations, deal-breakers
   - **Data breach response** — detection, containment, notification, remediation
   - **Employee termination** — voluntary, involuntary, for cause, layoff procedures
   - **IP dispute** — infringement claims, cease-and-desist responses, defensive actions
   - **Vendor onboarding** — due diligence, contract requirements, risk assessment
   - **M&A due diligence** — legal review scope, red flags, documentation requirements
   - **Regulatory inquiry** — response protocols, document preservation, communication rules
   - Tailor scenarios to the specific needs of "$ARGUMENTS"

3. **Create decision tree for each scenario:**
   - Define the triggering event (what initiates the scenario)
   - Map decision points with if/then logic (if X, then Y)
   - Identify the possible outcomes at each branch
   - Include time constraints at each decision point
   - Document the rationale for each recommended path

4. **Define approval thresholds:**
   - **Pre-approved actions** — what can proceed without legal review (e.g., standard NDA execution, routine contract renewals under a value threshold)
   - **Legal review required** — what needs internal legal sign-off (e.g., non-standard terms, contracts above value threshold, new vendor categories)
   - **Outside counsel required** — what needs external legal involvement (e.g., litigation, complex regulatory matters, high-value transactions)
   - Set clear monetary and risk-based thresholds for each level

5. **List pre-approved templates and fallback positions:**
   - For each scenario, identify available templates (NDAs, standard contracts, response letters)
   - Define preferred terms and acceptable fallback positions for negotiations
   - Document which template modifications are acceptable without additional review
   - Maintain version control references for all templates

6. **Set escalation criteria:**
   - Define when to involve internal legal counsel
   - Define when to involve outside counsel
   - Define when to notify executive leadership
   - Include specific triggers: monetary thresholds, reputational risk, regulatory exposure, litigation threats
   - Set maximum response times for each escalation level

7. **Include timeline expectations:**
   - Standard turnaround times for each scenario type
   - Expedited process for urgent matters
   - SLA definitions for legal team response
   - External dependencies and typical third-party timelines

8. **Organize playbook by audience:**
   - **Sales team** — contract negotiation, NDA procedures, deal approval workflows
   - **Engineering** — open-source compliance, IP considerations, security incident response
   - **HR** — employment law procedures, termination protocols, discrimination/harassment response
   - **Procurement** — vendor assessment, contract review, supplier risk management
   - Each audience section should be self-contained with relevant scenarios only

9. **Write the artifact** to `.legal/$ARGUMENTS/04-govern.md` with frontmatter:

   ```
   ---
   description: Legal playbook for $ARGUMENTS
   ---
   ```

   Include sections:
   - **Scenario Index** — overview of all covered scenarios with quick-reference links
   - **Decision Trees** — visual decision flow per scenario
   - **Approval Matrix** — thresholds and required approvals by scenario and value
   - **Templates and Fallback Positions** — available templates with modification guidelines
   - **Escalation Guide** — when and how to escalate by scenario type
   - **Timeline Expectations** — standard and expedited turnaround times
   - **Audience-Specific Guides** — tailored playbook sections per team

## Output

The legal playbook written to `.legal/$ARGUMENTS/04-govern.md`. Present a summary to the user highlighting:
- Number of scenarios covered and their categorization
- Key approval thresholds and escalation triggers
- Available pre-approved templates
- Audience-specific guide overview

---
description: Establish risk tolerance levels and acceptance criteria
---

# Risk Appetite

Establish risk tolerance levels and acceptance criteria for "$ARGUMENTS". Define how much risk the organization is willing to accept across different categories, and create a structured workflow for risk acceptance decisions.

## Prerequisites

None — this is a Phase 0 Govern skill.

## Process

1. **Define risk categories:**
   - **Operational risk** — system outages, process failures, human error
   - **Data breach risk** — unauthorized access, exfiltration, exposure of sensitive data
   - **Compliance risk** — regulatory violations, audit findings, legal penalties
   - **Reputational risk** — public incidents, customer trust erosion, media exposure
   - **Financial risk** — direct losses, remediation costs, insurance gaps
   - **Third-party risk** — vendor breaches, supply chain compromises, dependency failures

2. **Set tolerance thresholds per category:**
   - For each risk category, define four threshold levels:
     - **Critical** — unacceptable; immediate action required, escalate to executive leadership
     - **High** — requires mitigation plan within defined timeframe, senior management approval to accept
     - **Medium** — managed through standard controls, department-level acceptance
     - **Low** — accepted as cost of doing business, monitored through routine processes
   - Express thresholds in measurable terms where possible (financial impact ranges, downtime limits, data record counts)

3. **Define acceptance criteria and authority levels:**
   - **Who can accept what level** — map risk levels to required approval authority:
     - Critical: board/executive committee only
     - High: CISO or CTO with documented justification
     - Medium: department head or risk owner
     - Low: team lead or security champion
   - **Required documentation** — what must be recorded for each acceptance (risk description, justification, compensating controls, review date)
   - **Time-bound acceptance** — maximum duration before re-evaluation (critical: 30 days, high: 90 days, medium: 180 days, low: 365 days)

4. **Create risk acceptance workflow:**
   - Define the end-to-end process: identification, assessment, escalation, approval, documentation, monitoring
   - Specify required artifacts at each stage (risk register entry, impact analysis, approval record)
   - Define escalation triggers (risk level increase, new threat intelligence, audit findings)
   - Establish override and emergency procedures for time-sensitive decisions

5. **Align with business strategy:**
   - Map risk appetite to business maturity and growth stage
   - Identify areas where higher risk tolerance enables business objectives (speed to market, innovation)
   - Identify areas where zero tolerance is required (customer data protection, regulatory compliance)
   - Document trade-offs between risk reduction and business agility

6. **Write the artifact** to `.metapowers/security/$ARGUMENTS/00-govern.md` with heading:

   ## Risk Appetite Statement

   Include sections:
   - **Risk Categories** — all categories with definitions
   - **Tolerance Thresholds** — threshold matrix per category and level
   - **Acceptance Authority** — who can accept which risk levels
   - **Acceptance Workflow** — step-by-step process with required artifacts
   - **Strategic Alignment** — how risk appetite supports business objectives

## Output

The risk appetite statement written to `.metapowers/security/$ARGUMENTS/00-govern.md`. Present a summary to the user highlighting:
- Risk categories and their tolerance thresholds
- Acceptance authority matrix
- Key trade-offs between risk and business objectives
- Recommended next steps for operationalizing risk appetite

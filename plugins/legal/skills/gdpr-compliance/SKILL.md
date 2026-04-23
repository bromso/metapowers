---
description: Assess and implement GDPR compliance — data mapping, DPIA, DPA
---

# GDPR Compliance

Assess and implement GDPR compliance for "$ARGUMENTS". Conduct data mapping, evaluate DPIA requirements, define data subject rights procedures, and establish breach notification and cross-border transfer mechanisms.

> **Note:** AI-generated legal content does not constitute legal advice. Consult a qualified attorney.

## Prerequisites

Check that `.legal/$ARGUMENTS/00-assess.md` exists. If it does not exist, stop and tell the user:

> "Run an Assess skill first (e.g. `/legal:risk-assessment $ARGUMENTS`) to generate the prerequisite assessment artifact."

If the user passes `--skip-checks`, bypass this check and log the skip to `.legal/$ARGUMENTS/skip-log.md` with a timestamp and the reason "Prerequisite check skipped for gdpr-compliance".

## Process

1. **Read inputs:**
   - Read `.legal/$ARGUMENTS/00-assess.md` for risk, jurisdiction, and data practice context
   - Read any existing draft or review artifacts in `.legal/$ARGUMENTS/` for additional context

2. **Conduct data mapping:**
   - What personal data is collected (categories and specific data elements)
   - Where personal data is stored (systems, databases, third-party services, backups)
   - Who processes the data (internal teams, processors, sub-processors)
   - Retention periods per data category with justification
   - Lawful basis per processing activity (consent, contract, legitimate interest, legal obligation, vital interest, public task)
   - Data flows between systems and across borders

3. **Assess need for DPIA:**
   - Evaluate against high-risk processing criteria (systematic monitoring, large-scale processing of special categories, automated decision-making with legal effects, innovative technologies, cross-border processing, vulnerable data subjects)
   - If DPIA is required, draft DPIA including: description of processing, assessment of necessity and proportionality, risk assessment to individuals, measures to mitigate risks

4. **Define data subject rights procedures:**
   - **Right of access** (Article 15) — procedure and response timeline (one month, extendable by two)
   - **Right to rectification** (Article 16) — how inaccuracies are corrected
   - **Right to erasure** (Article 17) — grounds for erasure, exceptions, process
   - **Right to restriction** (Article 18) — when restriction applies, how data is marked
   - **Right to data portability** (Article 20) — machine-readable format, direct transfer
   - **Right to object** (Article 21) — direct marketing (absolute right), other processing (balancing test)
   - Response timelines and escalation procedures

5. **Breach notification process:**
   - Detection and assessment procedures
   - 72-hour notification requirement to supervisory authority (Article 33)
   - Notification to affected individuals without undue delay when high risk (Article 34)
   - Content of notifications (nature of breach, categories and approximate number of data subjects, likely consequences, measures taken or proposed)
   - Internal documentation requirements for all breaches regardless of notification

6. **Cross-border transfer mechanisms:**
   - Adequacy decisions (current list of adequate countries)
   - Standard Contractual Clauses (SCCs) — new 2021 modular SCCs
   - Binding Corporate Rules (BCRs) for intra-group transfers
   - Derogations for specific situations (explicit consent, contractual necessity)
   - Transfer impact assessments where required

7. **DPO appointment assessment:**
   - Evaluate whether DPO appointment is mandatory (public authority, core activities involve regular and systematic monitoring at large scale, core activities involve large-scale processing of special categories)
   - If required, define DPO role, qualifications, and reporting structure

8. **Article 30 records of processing:**
   - Draft records of processing activities for controller and processor roles
   - Include all required fields (name and contact details, purposes, categories of data subjects and personal data, recipients, transfers, retention periods, security measures)

9. **Write the artifact** to `.legal/$ARGUMENTS/03-comply.md` with frontmatter:

   ```
   ---
   description: GDPR compliance assessment for $ARGUMENTS
   ---
   ```

   Include sections:
   - **Data Mapping** — comprehensive inventory of personal data processing activities
   - **DPIA Assessment** — determination and full DPIA if required
   - **Data Subject Rights Procedures** — procedures for each right with timelines
   - **Breach Notification Plan** — detection, assessment, and notification procedures
   - **Cross-Border Transfers** — applicable mechanisms and safeguards
   - **DPO Assessment** — appointment determination and role definition
   - **Records of Processing** — Article 30 compliant records
   - **Compliance Gaps** — identified gaps with remediation recommendations

## Output

The GDPR compliance assessment written to `.legal/$ARGUMENTS/03-comply.md`. Present a summary to the user highlighting:
- Number of processing activities mapped
- Whether DPIA is required and key findings
- Data subject rights procedures defined
- Cross-border transfer mechanisms identified
- Critical compliance gaps requiring immediate attention

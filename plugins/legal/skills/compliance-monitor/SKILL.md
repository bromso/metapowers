---
description: Design ongoing compliance monitoring and reporting cadence
---

# Compliance Monitor

Design ongoing compliance monitoring and reporting for "$ARGUMENTS". Define monitoring scope per regulation, create dashboard metrics, assign compliance owners, and establish reporting cadence.

> **Note:** AI-generated legal content does not constitute legal advice. Consult a qualified attorney.

## Prerequisites

Check that `.metapowers/legal/$ARGUMENTS/00-assess.md` exists. If it does not exist, stop and tell the user:

> "Run an Assess skill first (e.g. `/legal:risk-assessment $ARGUMENTS`) to generate the prerequisite assessment artifact."

If the user passes `--skip-checks`, bypass this check and log the skip to `.metapowers/legal/$ARGUMENTS/skip-log.md` with a timestamp and the reason "Prerequisite check skipped for compliance-monitor".

## Process

1. **Read inputs:**
   - Read `.metapowers/legal/$ARGUMENTS/00-assess.md` for risk context, applicable regulations, and jurisdiction
   - Review any existing compliance artifacts in `.metapowers/legal/$ARGUMENTS/`

2. **Define monitoring scope per regulation:**
   - **GDPR:**
     - Quarterly data mapping review
     - Annual DPIA (Data Protection Impact Assessment) refresh
     - Ongoing data subject request tracking
   - **CCPA:**
     - Annual privacy policy update
     - Consumer request response time monitoring
     - Vendor data sharing audit
   - **SOC 2:**
     - Continuous control monitoring
     - Evidence collection automation
     - Exception tracking and remediation
   - **Accessibility (WCAG):**
     - Quarterly automated accessibility scan
     - Annual manual audit by qualified assessor
     - User complaint tracking and resolution
   - For each regulation, define what "compliant" looks like with measurable criteria

3. **Create compliance dashboard metrics:**
   - **% controls operating effectively** — ratio of passing controls to total controls
   - **Open findings** — count and severity of unresolved compliance findings
   - **Days to remediate** — average time from finding discovery to resolution
   - **Audit readiness score** — composite score reflecting documentation completeness, control effectiveness, and evidence availability
   - Define thresholds for each metric (green/yellow/red status)

4. **Assign compliance owners per regulation:**
   - Map each regulation to a primary compliance owner
   - Define backup owners for coverage during absences
   - Establish clear accountability for control operation, evidence collection, and issue resolution
   - Document owner responsibilities and expected time commitment

5. **Define escalation procedures for non-compliance:**
   - **Level 1** — owner self-remediates within defined timeline
   - **Level 2** — manager notification if remediation deadline missed
   - **Level 3** — executive escalation for high-severity or persistent non-compliance
   - **Level 4** — board notification for material compliance failures
   - Define what triggers each escalation level and expected response times

6. **Set reporting cadence:**
   - **Monthly** — operational compliance report to compliance team (control status, open findings, remediation progress)
   - **Quarterly** — executive compliance summary (dashboard metrics, trend analysis, risk highlights)
   - **Annual** — board-level compliance report (regulatory landscape, audit results, strategic compliance investments)
   - Define report templates and distribution lists for each cadence

7. **Create compliance calendar:**
   - Map all regulatory deadlines, filing dates, and renewal dates
   - Schedule internal audits and reviews
   - Include training deadlines and certification renewals
   - Set preparation milestones ahead of each deadline

8. **Write the artifact** to `.metapowers/legal/$ARGUMENTS/04-govern.md` with frontmatter:

   ```
   ---
   description: Compliance monitor for $ARGUMENTS
   ---
   ```

   Include sections:
   - **Monitoring Scope** — per-regulation monitoring activities and frequencies
   - **Dashboard Metrics** — metric definitions, thresholds, and data sources
   - **Compliance Owners** — responsibility matrix by regulation
   - **Escalation Procedures** — escalation levels, triggers, and response times
   - **Reporting Cadence** — report types, audiences, and schedules
   - **Compliance Calendar** — key dates and milestones

## Output

The compliance monitor written to `.metapowers/legal/$ARGUMENTS/04-govern.md`. Present a summary to the user highlighting:
- Number of regulations under active monitoring
- Key dashboard metrics and their current thresholds
- Compliance owner assignments and any gaps
- Upcoming compliance calendar deadlines

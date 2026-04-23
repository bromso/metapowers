---
description: Create data breach and security incident response plan
---

# Incident Response Plan

Create a data breach and security incident response plan for "$ARGUMENTS". Define incident classification, response procedures, notification requirements, communication templates, and post-incident review processes.

> **Note:** AI-generated legal content does not constitute legal advice. Consult a qualified attorney.

## Prerequisites

Check that `.metapowers/legal/$ARGUMENTS/00-assess.md` exists. If it does not exist, stop and tell the user:

> "Run an Assess skill first (e.g. `/legal:risk-assessment $ARGUMENTS`) to generate the prerequisite assessment artifact."

If the user passes `--skip-checks`, bypass this check and log the skip to `.metapowers/legal/$ARGUMENTS/skip-log.md` with a timestamp and the reason "Prerequisite check skipped for incident-response-plan".

## Process

1. **Read inputs:**
   - Read `.metapowers/legal/$ARGUMENTS/00-assess.md` for risk, jurisdiction, and data practice context
   - Read any existing security or compliance artifacts in `.metapowers/legal/$ARGUMENTS/` for additional context

2. **Define incident types and severity classification:**
   - **P1 — Critical:** confirmed data breach with sensitive personal data exposed, ransomware with data exfiltration, compromise of authentication systems, regulatory notification thresholds met
   - **P2 — High:** unauthorized access to systems containing personal data, significant service disruption, suspected data breach under investigation, insider threat confirmed
   - **P3 — Medium:** attempted unauthorized access (blocked but notable), minor data exposure (non-sensitive, limited scope), malware detection on non-critical systems, policy violations with data implications
   - **P4 — Low:** phishing attempts (no compromise), minor policy violations, vulnerability discovered (not exploited), suspicious activity under monitoring
   - Escalation criteria between severity levels

3. **Create detection and identification procedures:**
   - Technical detection sources (SIEM, IDS/IPS, endpoint detection, DLP, log monitoring)
   - Human reporting channels (employee reporting, customer complaints, partner notifications, threat intelligence feeds)
   - Initial triage checklist (what happened, when, what systems/data affected, is it ongoing, initial severity assessment)
   - Documentation requirements from point of detection

4. **Define incident response team:**
   - **Incident Commander** — overall coordination, decision authority, stakeholder communication
   - **Technical Lead** — technical investigation, containment, remediation
   - **Legal Counsel** — notification obligations, regulatory requirements, privilege considerations, law enforcement liaison
   - **Communications Lead** — internal and external communications, media handling
   - **Executive Sponsor** — business decisions, resource authorization, board reporting
   - Contact information and escalation paths (primary and backup for each role)
   - External resources (forensics firm, outside counsel, crisis communications, cyber insurance carrier)

5. **Containment procedures:**
   - **Immediate containment** (first 1-4 hours) — isolate affected systems, preserve evidence, block attack vectors, activate incident response team
   - **Short-term containment** (4-48 hours) — implement temporary fixes, enhanced monitoring, assess scope
   - **Long-term containment** — system rebuilds, credential resets, architecture changes
   - Decision framework for system shutdown vs. monitored containment
   - Evidence preservation requirements during containment

6. **Investigation steps:**
   - Root cause analysis methodology
   - Scope determination (what data, how many records, which individuals, geographic scope)
   - Affected data and individual identification
   - Attack vector and timeline reconstruction
   - Forensic evidence collection and chain of custody
   - Engagement criteria for external forensics

7. **Notification requirements by jurisdiction:**
   - **GDPR (EU):** 72 hours to supervisory authority (Article 33), without undue delay to individuals when high risk (Article 34)
   - **US state breach notification laws:** varies 30-90 days depending on state (document requirements for each applicable state)
   - **Sector-specific:** HIPAA — 60 days to HHS, individuals, and media (if 500+ affected); GLBA — 36 hours to primary federal regulator; PCI DSS — immediate to acquiring bank and card brands
   - **Other jurisdictions:** document notification requirements based on assessment context
   - Notification content requirements per jurisdiction
   - Attorney General notification requirements
   - Credit monitoring obligations

8. **Draft communication templates:**
   - **Regulatory notification** — nature of breach, categories and approximate number of data subjects, DPO contact, likely consequences, measures taken
   - **Affected individual notice** — plain language description, data involved, steps taken, recommended protective actions, contact information for questions
   - **Media statement** — brief factual statement, commitment to transparency, contact for inquiries
   - **Internal communication** — employee notification, management briefing, board notification
   - **Customer FAQ** — anticipated questions and approved responses
   - Version control and approval workflow for all communications

9. **Evidence preservation procedures:**
   - System logs and their retention
   - Forensic image requirements
   - Chain of custody documentation
   - Legal hold procedures
   - Attorney-client privilege considerations for investigation materials

10. **Post-incident review process:**
    - Lessons learned meeting (within 1-2 weeks of incident closure)
    - Root cause analysis documentation
    - Control improvement recommendations
    - Policy and procedure updates
    - Training needs identified
    - Metrics tracking (detection time, containment time, notification time, total resolution time)

11. **Tabletop exercise plan:**
    - Exercise scenarios (one per incident type/severity)
    - Participant roles and preparation
    - Exercise facilitation guide
    - Evaluation criteria
    - Recommended frequency (at minimum annually, quarterly for high-risk organizations)
    - Documentation and improvement tracking

12. **Write the artifact** to `.metapowers/legal/$ARGUMENTS/03-comply.md` with frontmatter:

    ```
    ---
    description: Incident response plan for $ARGUMENTS
    ---
    ```

    Include sections:
    - **Incident Classification** — types and severity levels (P1-P4)
    - **Detection and Identification** — sources, channels, and triage procedures
    - **Incident Response Team** — roles, contacts, and escalation paths
    - **Containment Procedures** — immediate, short-term, and long-term actions
    - **Investigation Framework** — root cause, scope, and forensics
    - **Notification Requirements** — jurisdiction-by-jurisdiction obligations and timelines
    - **Communication Templates** — regulatory, individual, media, and internal templates
    - **Evidence Preservation** — collection, custody, and legal hold procedures
    - **Post-Incident Review** — lessons learned and improvement process
    - **Tabletop Exercise Plan** — scenarios, facilitation, and schedule
    - **Compliance Gaps** — identified gaps with remediation recommendations

## Output

The incident response plan written to `.metapowers/legal/$ARGUMENTS/03-comply.md`. Present a summary to the user highlighting:
- Incident severity classification (P1-P4) defined
- Incident response team roles identified
- Notification requirements by jurisdiction with timelines
- Communication templates drafted
- Tabletop exercise plan and recommended frequency
- Critical gaps in current incident preparedness

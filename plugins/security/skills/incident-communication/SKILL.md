---
description: Draft communication templates for incidents
---

# Incident Communication

Draft incident communication templates for "$ARGUMENTS" covering internal alerts, management briefings, customer notifications, regulatory notifications, media statements, and post-incident summaries.

## Prerequisites

Read `.metapowers/security/$ARGUMENTS/00-govern.md`. If this file does not exist, tell the user:

> Phase 0 (Govern) has not been completed for "$ARGUMENTS". Run a Govern skill first (e.g., `/security:security-policy $ARGUMENTS`), or use `--skip-checks` to bypass.

If `--skip-checks` is present in $ARGUMENTS, skip this check and log to `.metapowers/security/$ARGUMENTS/skip-log.md`.

## Process

1. **Read context files:**
   - Read `plugins/security/shared/incident-response-template.md` for communication workflow reference
   - Read `.metapowers/security/$ARGUMENTS/00-govern.md` for organizational context and compliance requirements

2. **Create internal alert template (security team):**
   - Subject line format: `[P{severity}] {incident_type} — {affected_system}`
   - Content: detection time, detection source, initial indicators, affected systems, immediate actions taken
   - Distribution: severity-based (P1: all security + engineering leads, P2: security team + affected service owners, P3–P4: on-call responder)
   - Format for both email and chat (Slack/Teams) channels

3. **Create management briefing template:**
   - Executive summary: what happened (1–2 sentences, no jargon)
   - Business impact: affected services, users impacted, revenue implications, regulatory exposure
   - Current status: containment state, investigation progress
   - Actions taken: what the team has done so far
   - Next steps: planned actions with estimated timelines
   - ETA for resolution or next update
   - Cadence: P1 every 30 minutes, P2 every 2 hours

4. **Create customer notification template:**
   - What happened: clear, honest description in plain language
   - What data/services were affected: specific and accurate
   - What we are doing: immediate actions and ongoing investigation
   - What customers should do: password changes, monitoring recommendations, precautionary steps
   - How to get help: dedicated support channel, FAQ link
   - Timeline: when it happened, when we detected it, when we contained it
   - Follow-up commitment: when to expect the next update

5. **Create regulatory notification template:**
   - **GDPR (72-hour requirement):** nature of breach, categories and approximate number of data subjects, likely consequences, measures taken or proposed
   - **State breach notification laws:** adapt per jurisdiction (California, New York, etc.)
   - **Sector-specific (HIPAA, PCI DSS, SOX):** format per applicable regulation
   - Include: incident timeline, data types affected, affected individuals count, remedial measures
   - Legal review checkpoint before sending

6. **Create media statement template (if needed):**
   - Brief factual statement: what we can confirm
   - What we are doing: response actions in progress
   - Commitment: to transparency and protecting affected parties
   - Redirect: to official channels for updates
   - Spokesperson designation and talking points
   - What NOT to say: avoid speculation, admissions of fault, or technical details

7. **Create post-incident summary template:**
   - Incident overview: type, severity, duration, impact
   - Timeline: detection to resolution with key milestones
   - Root cause: what caused the incident
   - Response effectiveness: what went well, what could improve
   - Corrective actions: with owners and deadlines
   - Lessons learned: key takeaways for the organization

8. **Define communication approval chain:**
   - Internal alerts: security team lead approves
   - Management briefings: incident commander approves
   - Customer notifications: legal + communications lead approve
   - Regulatory notifications: legal counsel + CISO approve
   - Media statements: CEO/executive sponsor + legal + PR approve
   - Define maximum approval time per severity to avoid delays

9. **Write the artifact** to `.metapowers/security/$ARGUMENTS/04-respond.md` with heading:

   ## Incident Communication

   Include sections:
   - **Internal Alert Template** — format and distribution rules
   - **Management Briefing Template** — executive summary format and cadence
   - **Customer Notification Template** — plain-language communication format
   - **Regulatory Notification Templates** — per applicable regulation
   - **Media Statement Template** — approved messaging framework
   - **Post-Incident Summary Template** — review and lessons learned format
   - **Approval Chain** — who approves each communication type and maximum approval time

## Output

The incident communication templates written to `.metapowers/security/$ARGUMENTS/04-respond.md`. Present a summary to the user highlighting:
- Communication templates created per audience
- Regulatory notification requirements addressed
- Approval chain and maximum approval times
- Spokesperson designation and media guidance

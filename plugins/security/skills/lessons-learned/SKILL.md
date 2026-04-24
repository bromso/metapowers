---
description: Conduct post-incident review with root cause and improvement actions
---

# Lessons Learned

Conduct a blameless post-incident review for "$ARGUMENTS" with incident timeline, root cause analysis, contributing factors, and corrective actions at three levels.

## Prerequisites

Read `.metapowers/security/$ARGUMENTS/00-govern.md`. If this file does not exist, tell the user:

> Phase 0 (Govern) has not been completed for "$ARGUMENTS". Run a Govern skill first (e.g., `/security:security-policy $ARGUMENTS`), or use `--skip-checks` to bypass.

If `--skip-checks` is present in $ARGUMENTS, skip this check and log to `.metapowers/security/$ARGUMENTS/skip-log.md`.

## Process

1. **Read context files:**
   - Read `plugins/security/shared/incident-response-template.md` for post-incident review reference
   - Read `.metapowers/security/$ARGUMENTS/00-govern.md` for organizational context
   - Read `.metapowers/security/$ARGUMENTS/04-respond.md` if it exists, for incident response context

2. **Facilitate blameless post-incident review:**
   - Establish blameless culture ground rules: focus on systems and processes, not individuals
   - Gather all responders and stakeholders for input
   - Collect artifacts: logs, chat transcripts, alerts, tickets, and status updates from the incident
   - Set review scope: what happened, how we responded, what we can improve

3. **Build incident timeline (detection to resolution):**
   - Document each event chronologically with timestamps (UTC)
   - Key milestones: initial trigger, detection, first response, containment, eradication, recovery, closure
   - Note time gaps between milestones (detection delay, response delay, escalation delay)
   - Identify who did what at each stage
   - Calculate key metrics: time to detect (TTD), time to respond (TTR), time to contain (TTC), time to recover

4. **Apply 5 Whys for root cause analysis:**
   - Start with the incident symptom and ask "Why?" iteratively
   - Continue until reaching the systemic root cause (typically 3–5 levels deep)
   - Document each level with supporting evidence
   - Identify both the technical root cause and the process root cause
   - Validate root cause: if this cause were fixed, would the incident have been prevented?

5. **Identify contributing factors:**
   - **Process factors** — missing runbooks, unclear escalation paths, insufficient monitoring coverage
   - **Technology factors** — misconfiguration, unpatched vulnerability, inadequate tooling, missing automation
   - **People factors** — insufficient training, knowledge gaps, fatigue, unclear responsibilities (not blame)
   - Map contributing factors to the timeline to show where each factor increased severity or delayed response

6. **Define corrective actions at three levels:**
   - **Immediate fix** — address the specific vulnerability or gap that caused this incident (patch, config change, access revocation)
   - **Prevent recurrence** — implement controls to prevent the same type of incident (automated scanning, additional monitoring, policy update)
   - **Systemic improvement** — address the underlying organizational or architectural weakness (security architecture redesign, training program, process overhaul)
   - Each action must have: description, owner, deadline, priority, and success criteria

7. **Assign owners and track completion:**
   - Assign each corrective action to a named owner
   - Set realistic deadlines (immediate fixes: 1 week, prevent recurrence: 1 month, systemic: 1 quarter)
   - Define tracking mechanism (ticket system, review meetings)
   - Schedule follow-up review to verify completion
   - Escalate overdue actions

8. **Update playbooks based on findings:**
   - Identify gaps in existing playbooks revealed by the incident
   - Add new detection rules for indicators discovered during investigation
   - Update communication templates if communication was ineffective
   - Add decision tree entries for scenarios encountered
   - Document new forensic data sources identified during investigation

9. **Write the artifact** to `.metapowers/security/$ARGUMENTS/04-respond.md` with heading:

   ## Lessons Learned

   Include sections:
   - **Incident Summary** — type, severity, duration, and impact
   - **Timeline** — chronological event log with key metrics (TTD, TTR, TTC)
   - **Root Cause Analysis** — 5 Whys analysis with supporting evidence
   - **Contributing Factors** — process, technology, and people factors
   - **Corrective Actions** — three-level action plan with owners and deadlines
   - **Playbook Updates** — changes to existing playbooks and procedures
   - **Metrics** — incident response performance metrics and trends

## Output

The lessons learned review written to `.metapowers/security/$ARGUMENTS/04-respond.md`. Present a summary to the user highlighting:
- Root cause identified through 5 Whys analysis
- Key contributing factors by category
- Corrective actions at all three levels with owners
- Playbook and process updates recommended

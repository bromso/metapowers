---
description: Generate project status report for leadership in RAG format
---

# Status Report

Generate a project status report for "$ARGUMENTS" in RAG format (Red/Amber/Green) suitable for leadership review. Summarize progress against milestones, highlight risks and issues, note upcoming milestones, and list asks from leadership.

## Prerequisites

None — this is a utility skill. It can be run at any time, with or without existing project artifacts.

If `.project/$ARGUMENTS/` exists, read any available artifacts for context. If it does not exist, proceed based on information the user provides.

## Process

1. **Read existing context:**
   - If `.project/$ARGUMENTS/` exists, read all available artifacts for comprehensive context:
     - Project charter, roadmap, and backlog for planned scope and milestones
     - Sprint data for recent progress and velocity
     - Risk assessments for known risks
     - Decision logs for recent decisions
     - Previous status reports for trend comparison
   - If no artifacts exist, gather the information from the user through targeted questions

2. **Set overall RAG status with justification:**
   - **Green — on track:** project is progressing as planned, no significant risks or blockers, timeline confidence is high
   - **Amber — challenges but manageable:** some risks or issues exist but have mitigation plans, timeline may slip slightly, needs monitoring
   - **Red — blocked or at-risk:** significant blockers or risks threatening delivery, timeline is at serious risk, needs leadership attention or intervention
   - Provide a one-line justification for the status: "Green: delivering on schedule with all milestones met this period"
   - If the status has changed from the previous report, explain why
   - Be honest — do not default to Green to avoid difficult conversations

3. **Summarize progress against milestones:**
   - For each milestone or major deliverable:
     - **Status** — completed, in progress, not started, at risk, blocked
     - **% complete** — estimated progress
     - **Key accomplishments this period** — what was delivered or achieved since last report
   - Highlight any milestones that slipped and explain why
   - Note velocity trends: is the team accelerating, maintaining, or slowing down?

4. **List top 3 risks and issues:**
   - Distinguish between risks (potential problems) and issues (current problems)
   - For each:
     - **Description** — what is the risk or issue
     - **Impact** — what happens if it materializes or is not resolved
     - **Mitigation** — what is being done about it
     - **Owner** — who is responsible for managing it
   - Limit to top 3 — leadership does not need an exhaustive list, they need the critical items
   - If there are more than 3, note "N additional risks tracked in the risk register"

5. **Note upcoming milestones and timeline confidence:**
   - List the next 2-3 milestones with target dates
   - For each, state confidence level: high (>80% likely on time), medium (50-80%), low (<50%)
   - If any milestone is at medium or low confidence, briefly explain why
   - Note any dependencies on external teams, vendors, or decisions

6. **List asks and decisions needed from leadership:**
   - Be specific: "We need approval for X by [date]" or "We need a decision on Y to unblock Z"
   - For each ask, explain: what is needed, why, by when, and what happens if it is delayed
   - Limit to 2-3 actionable asks — this is the most important section for leadership
   - If there are no asks, explicitly state "No asks this period"

7. **Include team capacity note:**
   - Is the team fully staffed or are there gaps?
   - Note any planned or unplanned absences that affect delivery
   - Flag if the team is at capacity and new work cannot be absorbed without deprioritizing something
   - Note upcoming capacity changes (new hires, departures, leaves)

8. **Write the artifact** — save to `.project/$ARGUMENTS/status-report.md`:
   - **Report Date** — date of this report
   - **Overall Status** — RAG indicator with one-line justification
   - **Progress Summary** — milestone status with % complete and key accomplishments
   - **Risks & Issues** — top 3 with impact, mitigation, and owner
   - **Upcoming Milestones** — next 2-3 milestones with dates and confidence levels
   - **Asks from Leadership** — specific requests with deadlines
   - **Team Capacity** — staffing and availability notes
   - **Trend** — comparison with previous report status if available

## Output

Status report saved to `.project/$ARGUMENTS/status-report.md`. Present a summary highlighting:
- Overall RAG status with justification
- Key accomplishment this period
- Top risk or issue requiring attention
- Most urgent ask from leadership (if any)

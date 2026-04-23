---
description: Define team ceremonies, tools, communication norms, and rituals
---

# Ways of Working

Define the ways of working for "$ARGUMENTS". Establish sprint cadence, ceremony schedules, communication channels, tool stack, escalation paths, and team rituals.

## Prerequisites

None — this is a Phase 0 (Initiate) skill and can run first.

## Process

1. **Read shared context:**
   - Read `plugins/project-management/shared/scrum-guide.md` for ceremony guidance
   - Read `.project/$ARGUMENTS/00-initiate.md` if it exists (for project charter, team setup, and working agreements context)

2. **Define sprint cadence:**
   - Sprint length: 1 week, 2 weeks, or 3 weeks (recommend 2 weeks for most teams)
   - Sprint start day and end day (e.g., Monday start, Friday end)
   - Justify the chosen cadence based on project complexity and team experience
   - Define sprint numbering convention (e.g., Sprint 1, Sprint 2024-W03)

3. **Design ceremony schedule:**
   - **Sprint Planning:**
     - When: first day of sprint (e.g., Monday 9:00-11:00)
     - Duration: up to 2 hours per sprint week (e.g., 4 hours for 2-week sprint)
     - Format: PO presents priorities → team discusses and estimates → team commits to sprint goal
     - Inputs: refined backlog, team capacity, previous velocity
     - Outputs: sprint goal, sprint backlog, commitment
   - **Daily Standup:**
     - When: every working day (e.g., 9:30-9:45)
     - Duration: 15 minutes maximum, strictly time-boxed
     - Format: each member answers — what did I do? what will I do? any blockers?
     - Rules: standing up, no problem-solving (take it offline), focus on sprint goal progress
   - **Sprint Review:**
     - When: last day of sprint (e.g., Friday 14:00-15:00)
     - Duration: up to 1 hour per sprint week
     - Format: team demos completed work → stakeholder feedback → backlog adjustments
     - Attendees: team + stakeholders from "Keep Informed" and "Manage Closely" groups
   - **Sprint Retrospective:**
     - When: last day of sprint, after review (e.g., Friday 15:30-16:30)
     - Duration: up to 45 minutes per sprint week
     - Format: rotate between formats (Start/Stop/Continue, 4Ls, Sailboat, Mad/Sad/Glad)
     - Outputs: 2-3 actionable improvements for next sprint
   - **Backlog Refinement:**
     - When: mid-sprint (e.g., Wednesday 14:00-15:00)
     - Duration: up to 10% of sprint capacity
     - Format: PO presents upcoming stories → team discusses, estimates, and clarifies
     - Goal: ensure top of backlog is ready for next sprint planning

4. **Define communication channels:**
   - **Synchronous communication:**
     - Daily standups for team alignment
     - Ad-hoc huddles for pair programming or unblocking
     - Scheduled meetings only — no unplanned interruptions
   - **Asynchronous communication:**
     - Slack (or equivalent): day-to-day questions, quick updates, social
     - Channel structure: #project-general, #project-dev, #project-alerts
     - Email: formal communications, external stakeholders, decisions that need a record
     - Wiki/docs: persistent knowledge, decisions, architectural records
   - **Communication norms:**
     - Prefer async over sync when possible
     - Use threads in Slack to keep channels readable
     - Tag people only when action is needed
     - Acknowledge messages within agreed response window

5. **Define tool stack:**
   - **Issue tracker:** Jira, Linear, GitHub Issues — for backlog, sprint board, tracking
   - **Code repository:** GitHub, GitLab — branching strategy, PR conventions
   - **CI/CD:** GitHub Actions, Jenkins, CircleCI — pipeline stages, deployment targets
   - **Documentation:** Confluence, Notion, wiki — architecture decisions, runbooks, onboarding
   - **Communication:** Slack, Teams — channel structure defined above
   - **Design:** Figma, Miro — for mockups, diagrams, collaborative workshops
   - Document integration points between tools (e.g., PR links in issue tracker)

6. **Define escalation paths:**
   - **Blockers:** team member → Scrum Master → PO → sponsor (with SLA per level)
   - **Scope changes:** requestor → PO (assess impact) → sponsor (if above threshold)
   - **Technical decisions:** developer → tech lead → architecture review (for cross-cutting changes)
   - **People issues:** team member → SM → engineering manager → HR
   - Define expected response times for each escalation level

7. **Establish team rituals:**
   - **Knowledge sharing:** weekly tech talk or brown bag session (30 minutes)
   - **Pair programming:** scheduled pairing sessions for complex work or onboarding
   - **Team social:** regular informal time (virtual coffee, team lunch, games)
   - **Learning time:** dedicated time for skill development (e.g., Friday afternoons)
   - **Health checks:** periodic team health surveys to catch issues early

8. **Write the artifact** — append to `.project/$ARGUMENTS/00-initiate.md` under a `## Ways of Working` section:
   - **Sprint Cadence** — length, start/end days, numbering
   - **Ceremony Schedule** — planning, standup, review, retro, refinement with times and durations
   - **Communication Channels** — sync, async, norms, channel structure
   - **Tool Stack** — tools by category with integration notes
   - **Escalation Paths** — by type with SLAs
   - **Team Rituals** — knowledge sharing, pairing, social, learning

## Output

Ways of working appended to `.project/$ARGUMENTS/00-initiate.md`. Present a summary highlighting:
- Sprint length and cadence
- Ceremony schedule overview
- Key communication norms and escalation paths

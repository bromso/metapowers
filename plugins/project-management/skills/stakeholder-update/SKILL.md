---
description: Generate stakeholder status update with progress, risks, and asks
---

# Stakeholder Update

Generate a stakeholder status update for "$ARGUMENTS". Summarize sprint progress, set RAG status, list risks and mitigations, note decisions needed, and include upcoming milestones.

## Prerequisites

Check that `.project/$ARGUMENTS/00-initiate.md` exists. If it does not, tell the user to run an Initiate skill first (e.g., project-charter) and stop.

If the user passes `--skip-checks`, skip the prerequisite check and log the skip to `.project/$ARGUMENTS/skip-log.md` with a timestamp and reason.

## Process

1. **Read existing context:**
   - Read `.project/$ARGUMENTS/00-initiate.md` for stakeholder map, project charter, and team context
   - Read `.project/$ARGUMENTS/03-review.md` if it exists (for sprint review results and metrics)
   - Read `.project/$ARGUMENTS/02-sprint.md` if it exists (for sprint state, blockers, and standup history)
   - Read `.project/$ARGUMENTS/01-plan.md` if it exists (for roadmap, backlog, and milestone plan)

2. **Read stakeholder map:**
   - Identify key stakeholders from the initiate phase
   - Determine the appropriate level of detail for each audience (executive summary vs. detailed report)
   - Note each stakeholder's primary concerns and interests
   - Tailor the update tone: executives want conciseness, technical leads want specifics

3. **Summarize sprint progress:**
   - Report percentage of stories complete (completed / committed)
   - List key deliverables completed this sprint (feature names, not story IDs)
   - Note any significant achievements or milestones reached
   - If a sprint review exists, reference the commitment ratio
   - Keep the summary to 3-5 bullet points maximum

4. **Set overall RAG status:**
   - **Green:** on track, no significant risks, sprint goal achieved or on pace
   - **Amber:** minor risks or delays, sprint goal at risk but recoverable, action needed
   - **Red:** significant risks or blockers, sprint goal missed or unrecoverable, escalation needed
   - Provide a one-line justification for the RAG status
   - Compare to the previous update's RAG status (improving, stable, or declining)

5. **List key risks and mitigations (top 3):**
   - For each risk, describe: what the risk is, its likelihood (high/medium/low), its impact (high/medium/low)
   - For each risk, describe the mitigation plan or contingency action
   - Note any risks that have been resolved since the last update
   - Prioritize risks by impact — stakeholders care most about what could derail the project
   - If there are more than 3 risks, list the top 3 and note that additional risks are tracked separately

6. **Note decisions needed from stakeholders:**
   - List any decisions that are pending and blocking progress
   - For each decision, explain: what the decision is, who needs to make it, the deadline, and the impact of delay
   - Provide a recommendation for each decision (do not just present options without a suggested path)
   - Mark decisions by urgency: this week, this sprint, next sprint

7. **List upcoming milestones and timeline confidence:**
   - List the next 2-3 milestones with target dates
   - For each milestone, rate timeline confidence: high (>90%), medium (60-90%), low (<60%)
   - Note any milestones that have shifted since the last update and explain why
   - If there are dependencies on external teams or approvals, flag them here

8. **Include team capacity and morale note:**
   - Briefly note team capacity: full strength, reduced (and why), or ramping up
   - Note any morale concerns: burnout risk, sustained overtime, team changes, celebrations
   - Keep this section brief (2-3 sentences) — it provides human context to the numbers
   - If there are asks related to team needs (hiring, tools, training), include them here

9. **Write the artifact** — append to `.project/$ARGUMENTS/03-review.md` under a `## Stakeholder Update` section:
   - **RAG Status** — Green/Amber/Red with one-line justification
   - **Sprint Progress** — key deliverables and completion percentage
   - **Top Risks** — top 3 risks with likelihood, impact, and mitigation
   - **Decisions Needed** — pending decisions with owners and deadlines
   - **Upcoming Milestones** — next milestones with dates and confidence levels
   - **Team & Capacity** — capacity status and morale note

## Output

Stakeholder update appended to `.project/$ARGUMENTS/03-review.md`. Present a summary highlighting:
- RAG status with justification
- Sprint progress percentage and key deliverables
- Top risk and its mitigation
- Most urgent decision needed
- Next milestone and timeline confidence

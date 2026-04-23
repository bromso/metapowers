---
description: Facilitate daily standup — progress, plans, blockers
---

# Standup

Facilitate a daily standup for "$ARGUMENTS". For each team member capture progress, plans, and blockers. Identify patterns, flag blockers, and check sprint burndown status.

## Prerequisites

Check that `.project/$ARGUMENTS/00-initiate.md` exists. If it does not, tell the user to run an Initiate skill first (e.g., project-charter) and stop.

If the user passes `--skip-checks`, skip the prerequisite check and log the skip to `.project/$ARGUMENTS/skip-log.md` with a timestamp and reason.

## Process

1. **Read existing context:**
   - Read `.project/$ARGUMENTS/00-initiate.md` for team roster and project context
   - Read `.project/$ARGUMENTS/02-sprint.md` if it exists (for previous standups and sprint state)
   - Read `.project/$ARGUMENTS/01-plan.md` if it exists (for sprint backlog and assignments)

2. **Capture individual updates:**
   - For each team member, gather three items:
     - **Yesterday:** what they completed since the last standup
     - **Today:** what they plan to work on next
     - **Blockers:** anything preventing progress
   - Keep each person's update to 2-3 sentences maximum

3. **Identify cross-team patterns:**
   - Check if multiple people are blocked on the same thing (shared blocker)
   - Check if work is clustering on one area (too many people editing the same component)
   - Check if anyone has no clear next task (idle capacity)
   - Check if anyone is working on something not in the sprint backlog (scope creep)

4. **Flag blockers needing immediate resolution:**
   - Categorize blockers by severity: critical (blocks sprint goal), moderate (blocks one story), low (slows progress)
   - For critical blockers, identify who can resolve them and recommend immediate action
   - Note blockers that have persisted across multiple standups (stale blockers)

5. **Check sprint burndown status:**
   - Calculate ideal burndown: total points / sprint days x days elapsed
   - Compare actual completed points to ideal line
   - Classify status: ahead of schedule, on track, behind schedule, at risk
   - If behind schedule, identify the gap and what would need to change to recover

6. **Assess sprint goal risk:**
   - Based on current velocity and remaining work, is the sprint goal achievable?
   - If at risk, recommend concrete actions: cut scope, swarm on key stories, escalate blockers
   - Keep the assessment honest — early warning is better than late surprise

7. **Write the artifact** — append to `.project/$ARGUMENTS/02-sprint.md` under a `## Standup: [Date]` section:
   - **Individual Updates** — each team member's yesterday, today, and blockers
   - **Patterns** — cross-team observations
   - **Blockers** — categorized list with owners and recommended actions
   - **Burndown Status** — actual vs. ideal with classification
   - **Sprint Goal Risk** — current risk level and recommended actions

## Output

Standup appended to `.project/$ARGUMENTS/02-sprint.md`. Present a summary highlighting:
- Number of team members reporting
- Active blockers requiring immediate attention
- Burndown status (ahead/on-track/behind/at-risk)
- Sprint goal risk assessment
- Keep the standup under 15 minutes

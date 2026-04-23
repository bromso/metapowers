---
description: Analyze blockers, propose solutions, and escalation paths
---

# Blocker Resolution

Analyze blockers for "$ARGUMENTS". For each blocker, perform root cause analysis, propose resolution options, define escalation paths, and assess impact on the sprint goal.

## Prerequisites

Check that `.project/$ARGUMENTS/00-initiate.md` exists. If it does not, tell the user to run an Initiate skill first (e.g., project-charter) and stop.

If the user passes `--skip-checks`, skip the prerequisite check and log the skip to `.project/$ARGUMENTS/skip-log.md` with a timestamp and reason.

## Process

1. **Read existing context:**
   - Read `.project/$ARGUMENTS/00-initiate.md` for team structure and stakeholder contacts
   - Read `.project/$ARGUMENTS/02-sprint.md` if it exists (for standup notes, previous blockers, and sprint state)
   - Read `.project/$ARGUMENTS/01-plan.md` if it exists (for sprint goal and story details)

2. **List all current blockers:**
   - Gather blockers from standup notes, conversation, or user input
   - For each blocker, record: description, who is blocked, which story is affected, when it was first raised
   - Identify stale blockers (raised more than 2 days ago without resolution)
   - Categorize by type: technical, organizational, external, knowledge gap, resource constraint

3. **Perform root cause analysis for each blocker:**
   - **What is the blocker?** — clear, specific description of the issue
   - **Why is this blocked?** — dig into the root cause, not just the symptom
   - **Who or what controls the resolution?** — is it within the team's control or external?
   - **How long has it been blocked?** — duration affects urgency and escalation
   - Use the "5 Whys" technique when the root cause is not immediately obvious

4. **Propose resolution options:**
   - For each blocker, propose 2-3 resolution options with trade-offs:
     - **Option A:** the ideal resolution (fixes the root cause)
     - **Option B:** a workaround (unblocks progress but does not fix the root cause)
     - **Option C:** scope adjustment (remove or defer the blocked work)
   - For each option: effort required, time to resolve, risks, and impact on quality
   - Recommend the best option with rationale

5. **Define escalation paths:**
   - If a blocker is not resolved within 24 hours, define the escalation path:
     - **Level 1:** team lead or scrum master — can they unblock it?
     - **Level 2:** engineering manager or product owner — can they reprioritize or reassign?
     - **Level 3:** director or VP — organizational blockers requiring authority
   - For each level: who to contact, what to ask for, what information to provide
   - Include specific names and roles from the stakeholder map when available

6. **Assess impact on sprint goal:**
   - For each blocker, assess: does this threaten the sprint goal?
   - Calculate the blast radius: how many stories are affected directly and indirectly?
   - If the sprint goal is at risk, recommend sprint-level actions: re-plan, cut scope, or extend
   - Prioritize blocker resolution by impact: sprint-goal-threatening blockers first

7. **Assign ownership and deadlines:**
   - Each blocker must have an owner (person responsible for driving resolution)
   - Each blocker must have a target resolution date
   - Define a check-in cadence: daily for critical blockers, every other day for moderate blockers
   - The owner is not necessarily the person who will fix it — they are the person who will ensure it gets fixed

8. **Write the artifact** — append to `.project/$ARGUMENTS/02-sprint.md` under a `## Blocker Resolution` section:
   - **Blocker Inventory** — all current blockers with status, owner, and age
   - **Root Cause Analysis** — for each blocker, the root cause and category
   - **Resolution Options** — 2-3 options per blocker with trade-offs and recommendation
   - **Escalation Paths** — escalation levels with contacts and triggers
   - **Sprint Goal Impact** — risk assessment and recommended sprint-level actions
   - **Resolution Tracker** — owner, target date, and check-in cadence for each blocker

## Output

Blocker resolution appended to `.project/$ARGUMENTS/02-sprint.md`. Present a summary highlighting:
- Total number of blockers (by severity: critical, moderate, low)
- Number of stale blockers (older than 2 days)
- Sprint goal risk level (safe, at risk, compromised)
- Immediate actions required (top 1-3 things to do right now)
- Escalations needed (blockers that should be escalated today)

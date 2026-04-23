---
description: Plan the sprint — select stories, define sprint goal, assign capacity
---

# Sprint Planning

Plan a sprint for "$ARGUMENTS". Calculate team capacity, determine velocity target, select stories from the prioritized backlog, define the sprint goal, break stories into tasks, and identify sprint risks.

## Prerequisites

Check that `.project/$ARGUMENTS/00-initiate.md` exists. If it does not, tell the user to run an Initiate skill first (e.g., project-charter) and stop.

If the user passes `--skip-checks`, skip the prerequisite check and log the skip to `.project/$ARGUMENTS/skip-log.md` with a timestamp and reason.

## Process

1. **Read existing context:**
   - Read `.project/$ARGUMENTS/00-initiate.md` for charter and team context
   - Read `.project/$ARGUMENTS/01-plan.md` if it exists (for backlog, estimates, and roadmap)
   - Read `plugins/project-management/shared/scrum-guide.md` for Scrum alignment

2. **Calculate team capacity:**
   - Identify team members available for this sprint
   - For each member: available days = sprint length minus PTO, meetings, and other commitments
   - Apply focus factor: 0.6 for new teams, 0.7 for established teams, 0.8 for mature teams
   - **Team capacity** = sum of (available days x focus factor) for all members
   - Express capacity in person-days and convert to available hours (person-days x 6 productive hours)
   - Document any capacity risks (key person on vacation, new team member ramping up)

3. **Determine sprint velocity target:**
   - **New teams:** start with 20-30 story points per sprint (be conservative, use 20 for first sprint)
   - **Existing teams:** use the average velocity of the last 3 sprints
   - Adjust velocity for known capacity changes (team member absent, holiday week)
   - Set a velocity range: committed (80% of target) and stretch (100% of target)
   - Do not overcommit — it is better to finish early and pull more work than to carry over

4. **Select stories from the top of the prioritized backlog:**
   - Pull stories from the top of the backlog (highest priority first)
   - Add stories until the committed velocity is reached
   - Optionally add 1-2 stretch stories up to the full velocity target
   - Verify that selected stories have clear acceptance criteria (if not, they are not sprint-ready)
   - Check for dependencies between selected stories and stories not in the sprint
   - Ensure the selected stories form a coherent set — not just random high-priority items

5. **Define the sprint goal:**
   - Write one clear sentence describing the sprint's purpose and what the team aims to achieve
   - The goal should be outcome-oriented: what value will be delivered, not what tasks will be done
   - All selected stories should contribute to the sprint goal (or be explicitly labeled as side work)
   - Examples: "Enable users to complete the onboarding flow end-to-end" or "Deliver the core search functionality with basic filtering"
   - The sprint goal guides trade-off decisions during the sprint

6. **Break selected stories into tasks:**
   - For each story, identify the implementation tasks (development, testing, review, deployment)
   - Estimate each task in hours (not points — tasks use hours, stories use points)
   - Typical task types: design, frontend, backend, API, database, testing, documentation, review
   - Verify that total task hours do not exceed team capacity in hours
   - Assign tasks to team members based on skills and availability (if team assignments are known)

7. **Identify sprint risks and dependencies:**
   - **Internal risks:** complex stories, new technology, knowledge gaps, tight capacity
   - **External risks:** dependencies on other teams, API availability, pending approvals, data access
   - **Mitigation:** for each risk, define a mitigation action or contingency plan
   - **Dependencies:** map which stories depend on which tasks completing first
   - Define a sprint execution order: which stories should be started first based on dependencies and risk

8. **Write the artifact** — append to `.project/$ARGUMENTS/01-plan.md` under a `## Sprint Planning` section:
   - **Sprint Goal** — one clear sentence
   - **Team Capacity** — members, available days, focus factor, total capacity
   - **Velocity Target** — committed and stretch velocity with rationale
   - **Sprint Backlog** — selected stories with estimates, acceptance criteria status, and priority
   - **Task Breakdown** — tasks per story with hour estimates and assignments
   - **Risks & Dependencies** — identified risks with mitigation and dependency map
   - **Sprint Execution Order** — recommended order for starting stories

## Output

Sprint planning appended to `.project/$ARGUMENTS/01-plan.md`. Present a summary highlighting:
- Sprint goal
- Team capacity and velocity target
- Number of stories selected (committed vs. stretch)
- Total story points committed vs. team velocity
- Top sprint risks and mitigation plans

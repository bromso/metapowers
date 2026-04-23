---
description: Prepare sprint review — what was done, what wasn't, stakeholder demo plan
---

# Sprint Review

Prepare a sprint review for "$ARGUMENTS". Summarize what was completed, what was not, compare delivery to the sprint goal, and prepare a demo agenda for stakeholders.

## Prerequisites

Check that `.project/$ARGUMENTS/00-initiate.md` exists. If it does not, tell the user to run an Initiate skill first (e.g., project-charter) and stop.

If the user passes `--skip-checks`, skip the prerequisite check and log the skip to `.project/$ARGUMENTS/skip-log.md` with a timestamp and reason.

## Process

1. **Read existing context:**
   - Read `.project/$ARGUMENTS/00-initiate.md` for project charter and stakeholder context
   - Read `.project/$ARGUMENTS/01-plan.md` for sprint backlog, sprint goal, and velocity target
   - Read `.project/$ARGUMENTS/02-sprint.md` for standup history, blocker log, and WIP reviews

2. **List completed stories:**
   - For each story in the sprint backlog, determine if it is done (all acceptance criteria met)
   - For completed stories, confirm that acceptance criteria were verified (not just code-complete)
   - Note any stories that were completed but with caveats (partial scope, known issues, tech debt created)
   - Calculate total story points completed

3. **List incomplete stories:**
   - For each story not completed, explain the reason: blocked, underestimated, descoped, started late, dependency missed
   - Determine if the incomplete story should carry over to the next sprint or return to the backlog
   - Note how much work remains on each incomplete story (percentage done, remaining tasks)
   - Distinguish between stories that were never started and stories that were started but not finished

4. **Compare actual delivery to sprint goal:**
   - Restate the sprint goal from the sprint planning
   - Assess whether the sprint goal was achieved, partially achieved, or missed
   - If partially achieved, explain what parts were delivered and what was not
   - Calculate commitment ratio: completed points / committed points as a percentage
   - Note any work completed that was not in the original sprint backlog (unplanned work, stretch goals)

5. **Prepare demo agenda:**
   - Select which completed features to demo (not everything — focus on what stakeholders care about)
   - Order the demo to tell a story: start with the most impactful feature, build logically
   - For each demo item, note: what to show, the key takeaway, and expected time (2-3 minutes each)
   - Identify who will present each item (the person who built it, or a designated presenter)
   - Total demo time should be 15-20 minutes, leaving 10 minutes for questions

6. **List stakeholder questions to address:**
   - Anticipate questions stakeholders will ask based on the sprint results
   - Prepare concise answers for: why was X not completed, when will Y be ready, what changed from the plan
   - Note any decisions needed from stakeholders during or after the review
   - Identify topics that need a separate follow-up meeting (do not try to resolve everything in the review)

7. **Gather feedback themes for backlog refinement:**
   - Based on sprint outcomes, identify themes for backlog adjustment
   - Were estimates accurate? If not, what type of work was underestimated?
   - Were there recurring blockers that suggest a systemic issue?
   - Did stakeholder priorities shift during the sprint? How should the backlog reflect this?
   - Note any new work items surfaced during the sprint that should be added to the backlog

8. **Write the artifact** — append to `.project/$ARGUMENTS/03-review.md` under a `## Sprint Review` section:
   - **Sprint Goal Assessment** — goal statement, achieved/partial/missed, rationale
   - **Completed Stories** — list with acceptance criteria status and points
   - **Incomplete Stories** — list with reasons and carryover recommendation
   - **Commitment Ratio** — completed points / committed points
   - **Demo Agenda** — ordered list of features to demo with presenters and timing
   - **Stakeholder Questions** — anticipated questions with prepared answers
   - **Feedback Themes** — observations for backlog refinement

## Output

Sprint review appended to `.project/$ARGUMENTS/03-review.md`. Present a summary highlighting:
- Sprint goal achievement status
- Commitment ratio (completed vs. committed points)
- Number of stories completed vs. total
- Demo agenda overview (features and total time)
- Top feedback themes for backlog refinement

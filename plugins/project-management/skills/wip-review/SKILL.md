---
description: Review work-in-progress against sprint goal and capacity
---

# WIP Review

Review work-in-progress for "$ARGUMENTS". Count items by status, check WIP limits, compare progress to burndown, identify bottlenecks and idle capacity, and recommend adjustments.

## Prerequisites

Check that `.project/$ARGUMENTS/00-initiate.md` exists. If it does not, tell the user to run an Initiate skill first (e.g., project-charter) and stop.

If the user passes `--skip-checks`, skip the prerequisite check and log the skip to `.project/$ARGUMENTS/skip-log.md` with a timestamp and reason.

## Process

1. **Read existing context:**
   - Read `.project/$ARGUMENTS/00-initiate.md` for team roster and project context
   - Read `.project/$ARGUMENTS/02-sprint.md` if it exists (for sprint state, standups, and previous WIP reviews)
   - Read `.project/$ARGUMENTS/01-plan.md` if it exists (for sprint backlog, assignments, and capacity)

2. **Count items by status:**
   - Categorize all sprint backlog items into columns: To Do, In Progress, In Review, Done
   - Count items and story points in each column
   - Calculate percentage of total work in each status
   - Show the flow: how many items moved between columns since the last review

3. **Check WIP limits:**
   - Recommended WIP limit: no more than 2 items per person in progress at any time
   - For each team member, count their in-progress items
   - Flag anyone exceeding the WIP limit (context switching reduces productivity)
   - Flag anyone with zero in-progress items (possible idle capacity or blocker)
   - If the team as a whole has too much WIP, recommend finishing before starting

4. **Compare progress to burndown ideal line:**
   - Calculate sprint progress: % of sprint elapsed (days elapsed / total sprint days)
   - Calculate work progress: % of sprint goal completed (points done / total points committed)
   - Compare the two: work progress should be close to or ahead of sprint progress
   - Classify status:
     - **Ahead:** work progress > sprint progress + 10%
     - **On Track:** work progress within 10% of sprint progress
     - **Behind:** work progress < sprint progress - 10%
     - **At Risk:** work progress < sprint progress - 25%
   - If behind or at risk, calculate how much work needs to complete per remaining day to recover

5. **Identify bottlenecks:**
   - Where is work piling up? (e.g., many items in "In Review" means review capacity is the bottleneck)
   - Are there stories that have been in progress for more than 2 days without moving? (stuck work)
   - Is one person assigned to too many stories? (overloaded team member)
   - Is one skill area blocking others? (e.g., all backend work done but frontend is bottlenecked)
   - For each bottleneck, explain the impact and suggest a remedy

6. **Identify idle capacity:**
   - Who has bandwidth to take on more work?
   - Are there team members who completed their tasks and have nothing queued?
   - Can idle capacity be redirected to help with bottlenecks?
   - Is idle capacity a sign that work was not broken down enough (large stories blocking parallelism)?

7. **Calculate sprint goal completion percentage:**
   - % of sprint goal completed = completed story points / committed story points
   - % of sprint elapsed = days elapsed / total sprint days
   - Sprint health ratio = (% goal completed) / (% sprint elapsed)
   - Health ratio > 1.0 = ahead, 0.9-1.0 = on track, 0.7-0.9 = behind, < 0.7 = at risk
   - Project estimated completion: at current velocity, when will committed work be done?

8. **Recommend adjustments:**
   - If ahead: consider pulling stretch goals into the sprint
   - If on track: maintain current pace, no changes needed
   - If behind: recommend specific actions:
     - **Re-prioritize:** focus on sprint-goal stories, defer non-essential work
     - **Swarm:** redirect idle capacity or multiple people to the most critical stories
     - **Cut scope:** remove stretch goals or negotiate committed scope with the product owner
     - **Resolve blockers:** escalate any blockers that are slowing progress
   - If at risk: recommend an immediate conversation with the product owner about scope

9. **Write the artifact** — append to `.project/$ARGUMENTS/02-sprint.md` under a `## WIP Review` section:
   - **Status Board** — items and points by column (To Do, In Progress, In Review, Done)
   - **WIP Limit Check** — per-person WIP count with flags for violations
   - **Burndown Status** — sprint progress vs. work progress with classification
   - **Bottlenecks** — identified bottlenecks with impact and remedies
   - **Idle Capacity** — team members with bandwidth and suggested reallocation
   - **Sprint Health** — completion percentage, health ratio, and projected completion
   - **Recommended Adjustments** — specific actions based on current status

## Output

WIP review appended to `.project/$ARGUMENTS/02-sprint.md`. Present a summary highlighting:
- Sprint burndown status (ahead/on-track/behind/at-risk)
- Sprint health ratio
- Number of WIP limit violations
- Top bottleneck and recommended action
- Key adjustment recommendation

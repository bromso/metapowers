---
name: project-management-wip-review
description: Review the sprint board mid-sprint — items by status, WIP limits per person, bottlenecks, idle capacity and progress against burndown — and recommend adjustments. Use when work seems stuck in progress or review and the user wants to know if the sprint is on track and how to recover. Not for each person's daily update; see /project-management-standup.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: project-management
  phase: 2
  artifact: 02-sprint.md
---

# WIP Review

Review work-in-progress for "$ARGUMENTS". Count items by status, check WIP limits, compare progress to burndown, identify bottlenecks and idle capacity, and recommend adjustments.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"<skill name>","workflow":"project-management","phase":<phase>,"project":"<project>","event":"skipped","artifact":"<artifact file>","note":"<reason or \"none given\">"}`.

## Prerequisites

Run `scripts/gate.sh <project>` from this skill's folder. If it exits non-zero, stop and tell the user what it printed (unless `--skip-checks`, see Arguments).

Check that `.singularskills/project-management/<project>/00-initiate.md` exists. If it does not, tell the user to run an Initiate skill first (e.g., project-charter) and stop.

## Process

1. **Read existing context:**
   - Read `.singularskills/project-management/<project>/00-initiate.md` for team roster and project context
   - Read `.singularskills/project-management/<project>/02-sprint.md` if it exists (for sprint state, standups, and previous WIP reviews)
   - Read `.singularskills/project-management/<project>/01-plan.md` if it exists (for sprint backlog, assignments, and capacity)

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

9. **Write the artifact** — append to `.singularskills/project-management/<project>/02-sprint.md` under a `## WIP Review` section. Create the file with a `# Sprint — <project>` heading if it does not exist; if a `## WIP Review` section already exists, replace only that section. The section contains:
   - **Status Board** — items and points by column (To Do, In Progress, In Review, Done)
   - **WIP Limit Check** — per-person WIP count with flags for violations
   - **Burndown Status** — sprint progress vs. work progress with classification
   - **Bottlenecks** — identified bottlenecks with impact and remedies
   - **Idle Capacity** — team members with bandwidth and suggested reallocation
   - **Sprint Health** — completion percentage, health ratio, and projected completion
   - **Recommended Adjustments** — specific actions based on current status

## Output

WIP review appended to `.singularskills/project-management/<project>/02-sprint.md`. Present a summary highlighting:
- Sprint burndown status (ahead/on-track/behind/at-risk)
- Sprint health ratio
- Number of WIP limit violations
- Top bottleneck and recommended action
- Key adjustment recommendation

**Record the run.** This artifact is shared by every skill of phase 2 (Sprint). The frontmatter is written once, by whoever creates the file: if you create it, open it with the block below (`skill` is the phase title, `started` the time of that first write; `gate` is `passed` when the gate ran clean and `skipped` under `--skip-checks`); if it already exists, leave the block alone except to update `finished` and to set `gate` to the worst value among the sections (`skipped` over `passed`).

```yaml
---
skill: Sprint
workflow: project-management
phase: 2
project: <project>
started: <ISO timestamp>
finished: <ISO timestamp>
agent: <the agent you run in, or "unknown">
gate: <passed|skipped>
---
```

Open your `## WIP Review` section with one italic line, `*<skill name> · <ISO timestamp> · gate: <passed|skipped>*` (your skill name is `project-management-wip-review`).

End your section with `### Decisions` and `### Open questions` (one level under your `## WIP Review` heading, so the section stays one block), in this shape:

```markdown
### Decisions
- <what was chosen> — <why> — <what was rejected>

### Open questions
- <what the next phase or a reviewer must settle>
```

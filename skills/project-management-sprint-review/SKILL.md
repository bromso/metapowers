---
name: project-management-sprint-review
description: Prepare a sprint review — completed and unfinished stories, whether the sprint goal was met, commitment ratio, a demo agenda, stakeholder questions and backlog feedback. Use when a sprint is ending and the user is preparing the review meeting where stakeholders see what got done. Not for a full demo script with talking points; see /project-management-demo-prep.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: project-management
  phase: 3
  artifact: 03-review.md
---

# Sprint Review

Prepare a sprint review for "$ARGUMENTS". Summarize what was completed, what was not, compare delivery to the sprint goal, and prepare a demo agenda for stakeholders.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"project-management-sprint-review","workflow":"project-management","phase":3,"project":"<project>","event":"skipped","artifact":"03-review.md","note":"<reason or \"none given\">"}`.

## Prerequisites

Run this skill's gate before writing: `sh <this skill's folder>/scripts/gate.sh <project> <project root>`, where `<project root>` is the folder that contains `.singularskills/` (use `.` when you are already there). If it exits non-zero, stop and tell the user what it printed, unless `--skip-checks` was given (see Arguments).

Check that `.singularskills/project-management/<project>/00-initiate.md` exists. If it does not, tell the user to run an Initiate skill first (e.g., project-charter) and stop.

## Process

1. **Read existing context:**
   - Read `.singularskills/project-management/<project>/00-initiate.md` for project charter and stakeholder context
   - Read `.singularskills/project-management/<project>/01-plan.md` for sprint backlog, sprint goal, and velocity target
   - Read `.singularskills/project-management/<project>/02-sprint.md` for standup history, blocker log, and WIP reviews

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

8. **Write the artifact** — append to `.singularskills/project-management/<project>/03-review.md` under a `## Sprint Review` section. Create the file with a `# Review — <project>` heading if it does not exist; if a `## Sprint Review` section already exists, replace only that section. The section contains:
   - **Sprint Goal Assessment** — goal statement, achieved/partial/missed, rationale
   - **Completed Stories** — list with acceptance criteria status and points
   - **Incomplete Stories** — list with reasons and carryover recommendation
   - **Commitment Ratio** — completed points / committed points
   - **Demo Agenda** — ordered list of features to demo with presenters and timing
   - **Stakeholder Questions** — anticipated questions with prepared answers
   - **Feedback Themes** — observations for backlog refinement

## Output

Sprint review appended to `.singularskills/project-management/<project>/03-review.md`. Present a summary highlighting:
- Sprint goal achievement status
- Commitment ratio (completed vs. committed points)
- Number of stories completed vs. total
- Demo agenda overview (features and total time)
- Top feedback themes for backlog refinement

**Record the run.** Append each of these events to `.singularskills/log.jsonl` as one line (create the folder and file if missing):

- Before you start work (once the gate has passed or `--skip-checks` was given): `{"ts":"<ISO timestamp>","skill":"project-management-sprint-review","workflow":"project-management","phase":3,"project":"<project>","event":"started","artifact":"03-review.md","note":""}`
- After you have written your section: the same line with `"event":"finished"`.
- If the gate refused and the user did not bypass it: the same line with `"event":"refused"` and `"note"` set to what the gate printed, instead of the other two; then stop.

This artifact is shared by every skill of phase 3 (Review). The frontmatter is written once, by whoever creates the file: if you create it, open it with the block below (`skill` is the phase title, `started` the time of that first write; `gate` is `passed` when the gate ran clean and `skipped` under `--skip-checks`); if it already exists, leave the block alone except to update `finished` and to set `gate` to the worst value among the sections (`skipped` over `passed`).

```yaml
---
skill: Review
workflow: project-management
phase: 3
project: <project>
started: <ISO timestamp>
finished: <ISO timestamp>
agent: <the agent you run in, or "unknown">
gate: <passed|skipped>
---
```

Open your `## Sprint Review` section with one italic line, `*<skill name> · <ISO timestamp> · gate: <passed|skipped>*` (your skill name is `project-management-sprint-review`).

End your section with `### Decisions` and `### Open questions` (one level under your `## Sprint Review` heading, so the section stays one block), in this shape:

```markdown
### Decisions
- <what was chosen> — <why> — <what was rejected>

### Open questions
- <what the next phase or a reviewer must settle>
```

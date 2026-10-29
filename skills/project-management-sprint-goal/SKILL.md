---
name: project-management-sprint-goal
description: Define or refine one sprint goal — an outcome-based statement, 3-5 success criteria, committed versus stretch work and a rallying phrase. Use when the sprint's work is roughly chosen but the goal is vague or reads like a task list. Not for selecting the stories; see /project-management-sprint-planning.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: project-management
  phase: 2
  artifact: 02-sprint.md
---

# Sprint Goal

Define or refine the sprint goal for "$ARGUMENTS". Craft a clear goal statement, define success criteria, and distinguish committed work from stretch goals.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"project-management-sprint-goal","workflow":"project-management","phase":2,"project":"<project>","event":"skipped","artifact":"02-sprint.md","note":"<reason or \"none given\">"}`.

## Prerequisites

Run this skill's gate before writing: `sh <this skill's folder>/scripts/gate.sh <project> <project root>`, where `<project root>` is the folder that contains `.singularskills/` (use `.` when you are already there). If it exits non-zero, stop and tell the user what it printed, unless `--skip-checks` was given (see Arguments).

Check that `.singularskills/project-management/<project>/00-initiate.md` exists. If it does not, tell the user to run an Initiate skill first (e.g., project-charter) and stop.

## Process

1. **Read existing context:**
   - Read `.singularskills/project-management/<project>/00-initiate.md` for project vision and objectives
   - Read `.singularskills/project-management/<project>/01-plan.md` if it exists (for backlog, roadmap, and sprint planning artifacts)
   - Read `.singularskills/project-management/<project>/02-sprint.md` if it exists (for previous sprint goals and outcomes)

2. **Craft the sprint goal statement:**
   - Write one clear sentence describing what the team will deliver and why it matters
   - The goal should be outcome-oriented, not task-oriented
   - It should answer: "At the end of this sprint, what will be true that is not true today?"
   - Good examples: "Users can complete checkout end-to-end" or "Search returns relevant results within 200ms"
   - Bad examples: "Complete tickets PROJ-101 through PROJ-115" or "Work on the backend"
   - The goal must be achievable within the sprint timebox

3. **Define success criteria:**
   - List 3-5 specific, measurable criteria that define "what does success look like at sprint end"
   - Each criterion should be verifiable: someone can look at it and say yes or no
   - Include both functional criteria (features work) and quality criteria (tests pass, no regressions)
   - Examples: "User can sign up with email and password," "API response time under 500ms," "All acceptance criteria for stories X, Y, Z are met"

4. **Distinguish committed vs. stretch work:**
   - **Committed work:** stories the team is confident they will complete (80% confidence or higher)
   - **Stretch goals:** stories the team will attempt if committed work finishes early
   - Committed work should directly support the sprint goal
   - Stretch goals may support the sprint goal or address other priorities
   - Be explicit about the boundary — the team should know exactly what is committed

5. **Create a rallying statement:**
   - Distill the sprint goal into a short phrase the team can rally around
   - This is the elevator pitch version: if someone asks "what are you working on this sprint?" the answer is this phrase
   - It should be memorable and motivating, not bureaucratic

6. **Write the artifact** — append to `.singularskills/project-management/<project>/02-sprint.md` under a `## Sprint Goal` section. Create the file with a `# Sprint — <project>` heading if it does not exist; if a `## Sprint Goal` section already exists, replace only that section. The section contains:
   - **Sprint Goal Statement** — one clear sentence
   - **Success Criteria** — 3-5 measurable criteria
   - **Committed Work** — stories the team commits to completing
   - **Stretch Goals** — stories to attempt if capacity allows
   - **Rallying Statement** — short phrase for the team

## Output

Sprint goal appended to `.singularskills/project-management/<project>/02-sprint.md`. Present a summary highlighting:
- The sprint goal statement
- Number of success criteria defined
- Committed story count and point total
- Stretch goal count and point total
- The rallying statement

**Record the run.** Append each of these events to `.singularskills/log.jsonl` as one line (create the folder and file if missing):

- Before you start work (once the gate has passed or `--skip-checks` was given): `{"ts":"<ISO timestamp>","skill":"project-management-sprint-goal","workflow":"project-management","phase":2,"project":"<project>","event":"started","artifact":"02-sprint.md","note":""}`
- After you have written your section: the same line with `"event":"finished"`.
- If the gate refused and the user did not bypass it: the same line with `"event":"refused"` and `"note"` set to what the gate printed, instead of the other two; then stop.

This artifact is shared by every skill of phase 2 (Sprint). The frontmatter is written once, by whoever creates the file: if you create it, open it with the block below (`skill` is the phase title, `started` the time of that first write; `gate` is `passed` when the gate ran clean and `skipped` under `--skip-checks`); if it already exists, leave the block alone except to update `finished` and to set `gate` to the worst value among the sections (`skipped` over `passed`).

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

Open your `## Sprint Goal` section with one italic line, `*<skill name> · <ISO timestamp> · gate: <passed|skipped>*` (your skill name is `project-management-sprint-goal`).

End your section with `### Decisions` and `### Open questions` (one level under your `## Sprint Goal` heading, so the section stays one block), in this shape:

```markdown
### Decisions
- <what was chosen> — <why> — <what was rejected>

### Open questions
- <what the next phase or a reviewer must settle>
```

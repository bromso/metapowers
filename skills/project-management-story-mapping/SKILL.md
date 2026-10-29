---
name: project-management-story-mapping
description: Create a user story map — activities along the user journey, tasks beneath them, stories ranked under each task, release lines and the MVP slice. Use when the user wants the backlog laid out along the user's journey to decide release slices or find gaps. Not for building the backlog itself; see /project-management-backlog-creation.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: project-management
  phase: 1
  artifact: 01-plan.md
---

# Story Mapping

Create a user story map for "$ARGUMENTS". Define user activities and tasks, map stories under each task, draw release lines, identify MVP scope, and validate backlog completeness.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"project-management-story-mapping","workflow":"project-management","phase":1,"project":"<project>","event":"skipped","artifact":"01-plan.md","note":"<reason or \"none given\">"}`.

## Prerequisites

Run this skill's gate before writing: `sh <this skill's folder>/scripts/gate.sh <project> <project root>`, where `<project root>` is the folder that contains `.singularskills/` (use `.` when you are already there). If it exits non-zero, stop and tell the user what it printed, unless `--skip-checks` was given (see Arguments). On a refusal, before you stop, append this line to `.singularskills/log.jsonl` (create the folder and file if missing): `{"ts":"<ISO timestamp>","skill":"project-management-story-mapping","workflow":"project-management","phase":1,"project":"<project>","event":"refused","artifact":"01-plan.md","note":"<what the gate printed>"}`. Once the gate has passed, or under `--skip-checks` once you have appended the `skipped` line, append this line before you start work: `{"ts":"<ISO timestamp>","skill":"project-management-story-mapping","workflow":"project-management","phase":1,"project":"<project>","event":"started","artifact":"01-plan.md","note":""}`.

Check that `.singularskills/project-management/<project>/00-initiate.md` exists. If it does not, tell the user to run an Initiate skill first (e.g., project-charter) and stop.

## Process

1. **Read existing context:**
   - Read `.singularskills/project-management/<project>/00-initiate.md` for charter and stakeholder context
   - Read `.singularskills/project-management/<project>/01-plan.md` if it exists (for vision, roadmap, backlog, and user stories)
   - Read `references/scrum-guide.md` for Scrum alignment

2. **Define user activities (top row):**
   - Identify the major things users do with the product (3-7 activities)
   - Activities represent the user's high-level goals, read left to right as a narrative
   - Examples: "Discover product", "Sign up", "Configure settings", "Complete core task", "Review results", "Share with team"
   - Order activities chronologically along the user journey
   - Each activity should map to one or more epics from the backlog

3. **Map user tasks under each activity (second row):**
   - For each activity, list the specific tasks a user performs (2-5 tasks per activity)
   - Tasks are more granular than activities but still describe user behavior, not implementation
   - Order tasks by typical usage sequence within each activity
   - Examples under "Sign up": "Enter email", "Verify email", "Set password", "Complete profile"

4. **Map stories under each task (detail rows):**
   - Place existing user stories under the task they support
   - Stories further down represent less critical variations or enhancements
   - The vertical axis represents priority: top stories are most essential, bottom are nice-to-have
   - Identify orphan stories that do not fit any task — these may indicate missing activities or tasks

5. **Draw horizontal release lines:**
   - **Release 1 (MVP):** draw a line across the map — everything above is MVP
   - **Release 2:** draw a second line — stories between Release 1 and Release 2
   - **Release 3+:** additional release lines as needed
   - Each release should deliver a coherent, usable increment — not just a random slice
   - Align release lines with roadmap milestones where possible

6. **Identify MVP scope from the map:**
   - MVP = all stories above the first release line
   - Validate that MVP tells a complete user story from left to right (covers all activities minimally)
   - Check that no activity is completely empty above the MVP line
   - Compare MVP scope with the backlog's Must-have items — they should align
   - Flag any discrepancies between the story map MVP and the backlog MVP

7. **Identify gaps and validate completeness:**
   - **Missing activities:** are there user goals not represented?
   - **Thin activities:** activities with very few stories may indicate underexplored areas
   - **Stories without a home:** backlog stories that do not fit the map may be unnecessary or may reveal missing activities
   - **User journey gaps:** can a user complete their journey end-to-end with MVP stories?
   - Document all gaps with recommendations (add stories, remove stories, or investigate)

8. **Write the artifact** — append to `.singularskills/project-management/<project>/01-plan.md` under a `## Story Map` section. Create the file with a `# Plan — <project>` heading if it does not exist; if a `## Story Map` section already exists, replace only that section. The section contains:
   - **Activities** — top-row activities ordered by user journey
   - **Tasks** — tasks under each activity
   - **Story Map Grid** — stories placed under tasks, ordered by priority (top to bottom)
   - **Release Lines** — which stories fall into which release
   - **MVP Validation** — confirmation that MVP covers all activities end-to-end
   - **Gaps & Recommendations** — identified gaps with proposed actions

## Output

Story map appended to `.singularskills/project-management/<project>/01-plan.md`. Present a summary highlighting:
- Number of activities and tasks mapped
- MVP scope: story count and coverage across activities
- Gaps identified and recommendations
- Alignment between story map and roadmap milestones

**Record the run.** After you have written your section, append this line to `.singularskills/log.jsonl` (the `started` line of Prerequisites, with `"event":"finished"`): `{"ts":"<ISO timestamp>","skill":"project-management-story-mapping","workflow":"project-management","phase":1,"project":"<project>","event":"finished","artifact":"01-plan.md","note":""}`.

This artifact is shared by every skill of phase 1 (Plan). The frontmatter is written once, by whoever creates the file: if you create it, open it with the block below (`skill` is the phase title, `started` the time of that first write; `gate` is `passed` when the gate ran clean and `skipped` under `--skip-checks`); if it already exists, leave the block alone except to update `finished` and to set `gate` to the worst value among the sections (`skipped` over `passed`).

```yaml
---
skill: Plan
workflow: project-management
phase: 1
project: <project>
started: <ISO timestamp>
finished: <ISO timestamp>
agent: <the agent you run in, or "unknown">
gate: <passed|skipped>
---
```

Open your `## Story Map` section with one italic line, `*<skill name> · <ISO timestamp> · gate: <passed|skipped>*` (your skill name is `project-management-story-mapping`).

End your section with `### Decisions` and `### Open questions` (one level under your `## Story Map` heading, so the section stays one block), in this shape:

```markdown
### Decisions
- <what was chosen> — <why> — <what was rejected>

### Open questions
- <what the next phase or a reviewer must settle>
```

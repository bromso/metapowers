---
name: project-management-backlog-creation
description: Create the initial product backlog from the charter and roadmap — epics, user stories, MoSCoW or WSJF priority, an MVP cut and labels. Use when the user has scope or a roadmap and needs a first prioritized backlog to plan sprints from. Not for detailed acceptance criteria, or implementing one feature; see /project-management-user-stories or /development-plan.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: project-management
  phase: 1
  artifact: 01-plan.md
---

# Backlog Creation

Create and structure the initial product backlog for "$ARGUMENTS". Break roadmap themes into epics and user stories, prioritize using MoSCoW or WSJF, identify MVP scope, and tag stories with labels.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"project-management-backlog-creation","workflow":"project-management","phase":1,"project":"<project>","event":"skipped","artifact":"01-plan.md","note":"<reason or \"none given\">"}`.

## Prerequisites

**Part of a workflow.** This skill is phase 1 (Plan) of the Scrum workflow (`project-management`); cross-domain workflows run it too. Unless the user named this skill, check `.singularskills/log.jsonl` for an open run for this project: a `run-started` line with `"project":"<project>"` and no later `run-finished` line for the same `workflow` and `project`. If there is no open run, or the user asked to start, run, continue or resume a process or workflow rather than this one step, do not continue here: invoke the `workflow` skill with the workflow the user asked for, or `project-management` when they named none, followed by `<project>`. It runs this phase in order, asks before it writes and records the run. Continue here when the user named this skill, or when an open run exists (the conductor is running you).

Run this skill's gate before writing: `sh <this skill's folder>/scripts/gate.sh <project> <project root>`, where `<project root>` is the folder that contains `.singularskills/` (use `.` when you are already there). If it exits non-zero, stop and tell the user what it printed, unless `--skip-checks` was given (see Arguments). On a refusal, before you stop, append this line to `.singularskills/log.jsonl` (create the folder and file if missing): `{"ts":"<ISO timestamp>","skill":"project-management-backlog-creation","workflow":"project-management","phase":1,"project":"<project>","event":"refused","artifact":"01-plan.md","note":"<what the gate printed>"}`. Once the gate has passed, or under `--skip-checks` once you have appended the `skipped` line, append this line before you start work: `{"ts":"<ISO timestamp>","skill":"project-management-backlog-creation","workflow":"project-management","phase":1,"project":"<project>","event":"started","artifact":"01-plan.md","note":""}`.

Check that `.singularskills/project-management/<project>/00-initiate.md` exists. If it does not, tell the user to run an Initiate skill first (e.g., project-charter) and stop.

## Process

1. **Read existing context:**
   - Read `.singularskills/project-management/<project>/00-initiate.md` for charter and scope context
   - Read `.singularskills/project-management/<project>/01-plan.md` if it exists (for vision, goals, and roadmap)
   - Read `references/user-story-template.md` for story format
   - Read `references/scrum-guide.md` for Scrum alignment

2. **Break roadmap themes into epics:**
   - For each theme from the roadmap, identify constituent epics
   - For each epic: name, description, acceptance criteria, estimated size (S/M/L/XL)
   - Ensure epics are large enough to be meaningful but small enough to complete in 1-3 sprints
   - If no roadmap exists yet, derive epics directly from charter scope and objectives

3. **Break epics into user stories:**
   - Write each story in "As a [persona], I want [action], so that [benefit]" format
   - Aim for 3-8 stories per epic (split epics that generate more than 10 stories)
   - Ensure each story delivers value independently where possible
   - Add brief acceptance criteria to each story (detailed criteria come in the user-stories skill)

4. **Prioritize the backlog:**
   - Select a prioritization method:
     - **MoSCoW:** Must have, Should have, Could have, Won't have (this time)
     - **WSJF (Weighted Shortest Job First):** (Business Value + Time Criticality + Risk Reduction) / Job Size
   - Apply the method consistently across all stories
   - Document the rationale for high-priority and deprioritized items
   - Resolve priority conflicts by referencing product goals and North Star metric

5. **Structure the backlog by priority:**
   - Order stories from highest to lowest priority
   - Group by epic for readability, but maintain priority order within each epic
   - Number stories for easy reference (e.g., EPIC-001, EPIC-002)
   - Include a priority summary showing the distribution (how many Must/Should/Could/Won't)

6. **Identify MVP scope:**
   - MVP = all Must-have stories (or highest-WSJF stories that fit within first milestone)
   - Validate that MVP delivers a coherent, usable product — not just a random subset
   - Check that MVP aligns with the first release milestone from the roadmap
   - Flag any Must-have stories that feel too large or risky for MVP

7. **Tag stories with labels:**
   - **Type:** feature, bug, tech-debt, spike (research), infrastructure
   - **Component:** frontend, backend, API, database, DevOps, design
   - **Risk level:** high, medium, low
   - Ensure labels are consistent and will be useful for filtering and reporting

8. **Write the artifact** — append to `.singularskills/project-management/<project>/01-plan.md` under a `## Product Backlog` section. Create the file with a `# Plan — <project>` heading if it does not exist; if a `## Product Backlog` section already exists, replace only that section. The section contains:
   - **Epics Summary** — list of epics with size, theme, and story count
   - **Prioritized Backlog** — ordered list of stories with priority, epic, labels
   - **MVP Scope** — stories included in MVP with rationale
   - **Priority Distribution** — counts by MoSCoW category or WSJF bands
   - **Label Summary** — counts by type and component labels

## Output

Product backlog appended to `.singularskills/project-management/<project>/01-plan.md`. Present a summary highlighting:
- Total number of epics and stories created
- MVP scope: number of stories and estimated effort
- Priority distribution across MoSCoW categories
- Any gaps or risks identified during backlog creation

**Record the run.** After you have written your section, append this line to `.singularskills/log.jsonl` (the `started` line of Prerequisites, with `"event":"finished"`): `{"ts":"<ISO timestamp>","skill":"project-management-backlog-creation","workflow":"project-management","phase":1,"project":"<project>","event":"finished","artifact":"01-plan.md","note":""}`.

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

Open your `## Product Backlog` section with one italic line, `*<skill name> · <ISO timestamp> · gate: <passed|skipped>*` (your skill name is `project-management-backlog-creation`).

End your section with `### Decisions` and `### Open questions` (one level under your `## Product Backlog` heading, so the section stays one block), in this shape:

```markdown
### Decisions
- <what was chosen> — <why> — <what was rejected>

### Open questions
- <what the next phase or a reviewer must settle>
```

---
name: project-management-roadmap
description: Build a release roadmap — time horizon, themes and epics, dated milestones, dependencies, critical path and confidence levels. Use when the user is asked what will ship when over the next 3 to 12 months or needs release milestones to share. Not for breaking one feature into coding tasks; see /development-plan.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: project-management
  phase: 1
  artifact: 01-plan.md
---

# Roadmap

Build a release roadmap for "$ARGUMENTS". Define the time horizon, group work into themes and epics, set release milestones with target dates, map dependencies, identify the critical path, and mark confidence levels.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"project-management-roadmap","workflow":"project-management","phase":1,"project":"<project>","event":"skipped","artifact":"01-plan.md","note":"<reason or \"none given\">"}`.

## Prerequisites

Run this skill's gate before writing: `sh <this skill's folder>/scripts/gate.sh <project> <project root>`, where `<project root>` is the folder that contains `.singularskills/` (use `.` when you are already there). If it exits non-zero, stop and tell the user what it printed, unless `--skip-checks` was given (see Arguments). On a refusal, before you stop, append this line to `.singularskills/log.jsonl` (create the folder and file if missing): `{"ts":"<ISO timestamp>","skill":"project-management-roadmap","workflow":"project-management","phase":1,"project":"<project>","event":"refused","artifact":"01-plan.md","note":"<what the gate printed>"}`. Once the gate has passed, or under `--skip-checks` once you have appended the `skipped` line, append this line before you start work: `{"ts":"<ISO timestamp>","skill":"project-management-roadmap","workflow":"project-management","phase":1,"project":"<project>","event":"started","artifact":"01-plan.md","note":""}`.

Check that `.singularskills/project-management/<project>/00-initiate.md` exists. If it does not, tell the user to run an Initiate skill first (e.g., project-charter) and stop.

## Process

1. **Read existing context:**
   - Read `.singularskills/project-management/<project>/00-initiate.md` for charter, scope, and milestone context
   - Read `.singularskills/project-management/<project>/01-plan.md` if it exists (for product vision and goals)
   - Read `references/scrum-guide.md` for Scrum alignment

2. **Define time horizon:**
   - Select an appropriate planning horizon: 3 months (short), 6 months (medium), or 12 months (long)
   - Base the decision on project complexity, uncertainty level, and stakeholder expectations
   - Define sprint cadence (1-week or 2-week sprints recommended) and how many sprints fit the horizon
   - Identify key external dates (launches, conferences, regulatory deadlines) that constrain the timeline

3. **Group work into themes and epics:**
   - Identify 3-7 major themes (strategic focus areas) from the vision and charter
   - Break each theme into epics (large bodies of work that span multiple sprints)
   - For each epic: name, description, estimated size (S/M/L/XL), owning theme
   - Validate that themes cover all in-scope items from the charter

4. **Define release milestones:**
   - Define 3-6 milestones across the time horizon
   - For each milestone: name, target date, description, key deliverables, success criteria
   - Assign epics to milestones based on priority and dependencies
   - Ensure the first milestone is an MVP or meaningful first release
   - Include a "done" definition for each milestone

5. **Map dependencies between milestones:**
   - Identify epic-to-epic dependencies (which epics must finish before others can start)
   - Identify external dependencies (APIs, third-party services, approvals, other teams)
   - Create a dependency graph showing the order of work
   - Flag circular dependencies or bottlenecks

6. **Identify the critical path:**
   - Trace the longest sequence of dependent tasks from start to final milestone
   - Highlight tasks on the critical path — any delay here delays the entire project
   - Identify near-critical paths (tasks with minimal slack)
   - Recommend buffer or mitigation for critical path risks

7. **Mark confidence levels:**
   - **Committed** — scope is well-defined, team is confident, resources are allocated
   - **Planned** — scope is understood, details need refinement, tentatively resourced
   - **Exploratory** — scope is fuzzy, needs research or spikes, no resource commitment
   - Apply a confidence level to each milestone and each epic
   - Note: milestones further out should generally have lower confidence

8. **Write the artifact** — append to `.singularskills/project-management/<project>/01-plan.md` under a `## Roadmap` section. Create the file with a `# Plan — <project>` heading if it does not exist; if a `## Roadmap` section already exists, replace only that section. The section contains:
   - **Time Horizon** — planning window, sprint cadence, key external dates
   - **Themes & Epics** — themes with their epics, sizes, and descriptions
   - **Release Milestones** — timeline with milestones, deliverables, and success criteria
   - **Dependency Map** — epic and external dependencies
   - **Critical Path** — critical and near-critical paths highlighted
   - **Confidence Levels** — per-milestone and per-epic confidence ratings

## Output

Roadmap appended to `.singularskills/project-management/<project>/01-plan.md`. Present a summary highlighting:
- Time horizon and number of milestones
- First milestone (MVP) target date and key deliverables
- Critical path and highest-risk dependencies
- Confidence level distribution across milestones

**Record the run.** After you have written your section, append this line to `.singularskills/log.jsonl` (the `started` line of Prerequisites, with `"event":"finished"`): `{"ts":"<ISO timestamp>","skill":"project-management-roadmap","workflow":"project-management","phase":1,"project":"<project>","event":"finished","artifact":"01-plan.md","note":""}`.

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

Open your `## Roadmap` section with one italic line, `*<skill name> · <ISO timestamp> · gate: <passed|skipped>*` (your skill name is `project-management-roadmap`).

End your section with `### Decisions` and `### Open questions` (one level under your `## Roadmap` heading, so the section stays one block), in this shape:

```markdown
### Decisions
- <what was chosen> — <why> — <what was rejected>

### Open questions
- <what the next phase or a reviewer must settle>
```

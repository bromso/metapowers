---
description: Build a release roadmap with milestones, themes, and timeline
---

# Roadmap

Build a release roadmap for "$ARGUMENTS". Define the time horizon, group work into themes and epics, set release milestones with target dates, map dependencies, identify the critical path, and mark confidence levels.

## Prerequisites

Check that `.project/$ARGUMENTS/00-initiate.md` exists. If it does not, tell the user to run an Initiate skill first (e.g., project-charter) and stop.

If the user passes `--skip-checks`, skip the prerequisite check and log the skip to `.project/$ARGUMENTS/skip-log.md` with a timestamp and reason.

## Process

1. **Read existing context:**
   - Read `.project/$ARGUMENTS/00-initiate.md` for charter, scope, and milestone context
   - Read `.project/$ARGUMENTS/01-plan.md` if it exists (for product vision and goals)
   - Read `plugins/project-management/shared/scrum-guide.md` for Scrum alignment

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

8. **Write the artifact** — append to `.project/$ARGUMENTS/01-plan.md` under a `## Roadmap` section:
   - **Time Horizon** — planning window, sprint cadence, key external dates
   - **Themes & Epics** — themes with their epics, sizes, and descriptions
   - **Release Milestones** — timeline with milestones, deliverables, and success criteria
   - **Dependency Map** — epic and external dependencies
   - **Critical Path** — critical and near-critical paths highlighted
   - **Confidence Levels** — per-milestone and per-epic confidence ratings

## Output

Roadmap appended to `.project/$ARGUMENTS/01-plan.md`. Present a summary highlighting:
- Time horizon and number of milestones
- First milestone (MVP) target date and key deliverables
- Critical path and highest-risk dependencies
- Confidence level distribution across milestones

---
name: project-management-dependency-map
description: Identify story-to-story, cross-team and external dependencies in a dependency matrix with the critical path and a recommended start order. Use when stories rely on each other, other teams or vendors and the user wants to know what to start first. Not for a blocker that is already stopping work; see /project-management-blocker-resolution.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: project-management
  phase: 2
  artifact: 02-sprint.md
---

# Dependency Map

Identify and visualize dependencies for "$ARGUMENTS". Map story-to-story, cross-team, and external dependencies. Flag critical path items and recommend sequencing.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"project-management-dependency-map","workflow":"project-management","phase":2,"project":"<project>","event":"skipped","artifact":"02-sprint.md","note":"<reason or \"none given\">"}`.

## Prerequisites

Run this skill's gate before writing: `sh <this skill's folder>/scripts/gate.sh <project> <project root>`, where `<project root>` is the folder that contains `.singularskills/` (use `.` when you are already there). If it exits non-zero, stop and tell the user what it printed, unless `--skip-checks` was given (see Arguments).

Check that `.singularskills/project-management/<project>/00-initiate.md` exists. If it does not, tell the user to run an Initiate skill first (e.g., project-charter) and stop.

## Process

1. **Read existing context:**
   - Read `.singularskills/project-management/<project>/00-initiate.md` for project scope and team structure
   - Read `.singularskills/project-management/<project>/01-plan.md` if it exists (for backlog, story details, and sprint planning)
   - Read `.singularskills/project-management/<project>/02-sprint.md` if it exists (for current sprint state)

2. **Identify story-to-story dependencies:**
   - For each story in the sprint backlog, determine if it depends on another story completing first
   - Common patterns: "API must exist before frontend can consume it," "data model must be defined before services can use it," "shared component must be built before pages can use it"
   - Document each dependency as: Story A → depends on → Story B (with reason)
   - Flag circular dependencies — these must be resolved before work can proceed

3. **Identify cross-team dependencies:**
   - Dependencies on other teams within the organization (waiting on API from backend team, design from design team, infrastructure from platform team)
   - For each cross-team dependency: what is needed, from whom, by when
   - Identify the contact person and current status (requested, in progress, committed, delivered)
   - Flag dependencies where no commitment has been made — these are high risk

4. **Identify external dependencies:**
   - Vendor deliverables (third-party library updates, SaaS provider changes)
   - Third-party approvals (security review, compliance sign-off, legal review)
   - Infrastructure provisioning (cloud resources, environments, access permissions)
   - Data availability (test data, production data access, data migration)
   - For each: what is needed, expected delivery date, fallback plan if delayed

5. **Create dependency matrix:**
   - Build a matrix showing blocking relationships between all items
   - Rows and columns are stories/tasks, cells indicate dependency type (blocks, blocked-by, related)
   - Highlight the critical path: the longest chain of dependencies that determines the minimum sprint duration
   - Identify items with no dependencies (can start immediately) vs. items with multiple dependencies (high risk)

6. **Flag critical path items:**
   - The critical path is the sequence of dependent items where any delay delays the entire sprint
   - List critical path items in order with their dependencies
   - Calculate total critical path duration vs. available sprint time
   - If critical path exceeds sprint duration, the sprint goal is at risk before work begins

7. **Recommend sequencing:**
   - Based on the dependency map, recommend the order in which stories should be started
   - Stories with no dependencies should start first (unblock others)
   - Stories on the critical path should start early and be monitored closely
   - Stories with external dependencies should have their dependencies confirmed before starting
   - Identify opportunities for parallel work (stories with no shared dependencies)

8. **Write the artifact** — append to `.singularskills/project-management/<project>/02-sprint.md` under a `## Dependency Map` section. Create the file with a `# Sprint — <project>` heading if it does not exist; if a `## Dependency Map` section already exists, replace only that section. The section contains:
   - **Story-to-Story Dependencies** — list of dependencies with reasons
   - **Cross-Team Dependencies** — what, from whom, status, and risk level
   - **External Dependencies** — what, expected date, and fallback plan
   - **Dependency Matrix** — blocking relationships in table format
   - **Critical Path** — ordered list of critical path items with durations
   - **Recommended Sequencing** — suggested start order for stories

## Output

Dependency map appended to `.singularskills/project-management/<project>/02-sprint.md`. Present a summary highlighting:
- Total number of dependencies identified (by type)
- Critical path length vs. available sprint time
- Highest-risk dependencies (unconfirmed, external, or long-chain)
- Recommended first-day actions to unblock the critical path

**Record the run.** Append each of these events to `.singularskills/log.jsonl` as one line (create the folder and file if missing):

- Before you start work (once the gate has passed or `--skip-checks` was given): `{"ts":"<ISO timestamp>","skill":"project-management-dependency-map","workflow":"project-management","phase":2,"project":"<project>","event":"started","artifact":"02-sprint.md","note":""}`
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

Open your `## Dependency Map` section with one italic line, `*<skill name> · <ISO timestamp> · gate: <passed|skipped>*` (your skill name is `project-management-dependency-map`).

End your section with `### Decisions` and `### Open questions` (one level under your `## Dependency Map` heading, so the section stays one block), in this shape:

```markdown
### Decisions
- <what was chosen> — <why> — <what was rejected>

### Open questions
- <what the next phase or a reviewer must settle>
```

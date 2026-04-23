---
description: Identify and visualize cross-team and cross-story dependencies
---

# Dependency Map

Identify and visualize dependencies for "$ARGUMENTS". Map story-to-story, cross-team, and external dependencies. Flag critical path items and recommend sequencing.

## Prerequisites

Check that `.project/$ARGUMENTS/00-initiate.md` exists. If it does not, tell the user to run an Initiate skill first (e.g., project-charter) and stop.

If the user passes `--skip-checks`, skip the prerequisite check and log the skip to `.project/$ARGUMENTS/skip-log.md` with a timestamp and reason.

## Process

1. **Read existing context:**
   - Read `.project/$ARGUMENTS/00-initiate.md` for project scope and team structure
   - Read `.project/$ARGUMENTS/01-plan.md` if it exists (for backlog, story details, and sprint planning)
   - Read `.project/$ARGUMENTS/02-sprint.md` if it exists (for current sprint state)

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

8. **Write the artifact** — append to `.project/$ARGUMENTS/02-sprint.md` under a `## Dependency Map` section:
   - **Story-to-Story Dependencies** — list of dependencies with reasons
   - **Cross-Team Dependencies** — what, from whom, status, and risk level
   - **External Dependencies** — what, expected date, and fallback plan
   - **Dependency Matrix** — blocking relationships in table format
   - **Critical Path** — ordered list of critical path items with durations
   - **Recommended Sequencing** — suggested start order for stories

## Output

Dependency map appended to `.project/$ARGUMENTS/02-sprint.md`. Present a summary highlighting:
- Total number of dependencies identified (by type)
- Critical path length vs. available sprint time
- Highest-risk dependencies (unconfirmed, external, or long-chain)
- Recommended first-day actions to unblock the critical path

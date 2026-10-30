---
name: project-management-team-setup
description: Define a delivery team's Scrum roles, skills matrix and gaps, working agreements and Definition of Ready. Use when a new project team is forming and the user needs to settle who plays which role and what skills are missing. Not for the ceremony schedule and tool stack, or decision rights in a team you lead; see /project-management-ways-of-working or /leadership-build.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: project-management
  phase: 0
  artifact: 00-initiate.md
---

# Team Setup

Define the team structure for "$ARGUMENTS". Establish Scrum roles and responsibilities, create a skills matrix, identify capability gaps, and set working agreements.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"project-management-team-setup","workflow":"project-management","phase":0,"project":"<project>","event":"skipped","artifact":"00-initiate.md","note":"<reason or \"none given\">"}`.

## Prerequisites

**Part of a workflow.** This skill is phase 0 (Initiate) of the Scrum workflow (`project-management`); cross-domain workflows run it too. First check `.singularskills/log.jsonl` for an open run for this project: a `run-started` line with `"project":"<project>"` and no later `run-finished` line for the same `workflow` and `project`. If one exists, the conductor is running you: continue here. Otherwise, if the user asked to start, run, continue or resume a process or workflow rather than this one step, do not continue here: invoke the `workflow` skill with the workflow the user asked for, or `project-management` when they named none, followed by `<project>`; it runs this phase in order, asks before it writes and records the run. Otherwise, unless the user named this skill, ask one question, since this is the first phase of its workflow: "Just this step, or the whole Scrum workflow?" End your turn and wait; on the whole workflow, hand off the same way; on just this step, continue here.

**Recall.** Before you ask the user anything, look for what this repository already holds about `<project>`: if a tool is available whose description says it searches or maps this repository (a memory or repo-map server such as `repo_map` or `entities`), query it for `<project>` and this phase's subject and read what it returns, keeping only results from this repository; in every case also list `.singularskills/*/<project>/` and read the **Decisions** and **Open questions** of any artifact there, and the lines of `.singularskills/log.jsonl` whose `project` is `<project>`. After your section's italic line, add a `### Recalled` subsection of at most ten lines naming what you found and where (path or tool), or the single line `Nothing recalled: no earlier artifacts, log lines or memory results for <project>.` Ask the user only what this did not answer. The trail's shape is described in `references/memory/trail.md`, bundled with this skill.

Before you start work, append this line to `.singularskills/log.jsonl` (create the folder and file if missing): `{"ts":"<ISO timestamp>","skill":"project-management-team-setup","workflow":"project-management","phase":0,"project":"<project>","event":"started","artifact":"00-initiate.md","note":""}`.

None — this is a Phase 0 (Initiate) skill and can run first.

## Process

1. **Read existing context:**
   - Read `.singularskills/project-management/<project>/00-initiate.md` if it exists (for project charter and stakeholder context)

2. **Define Scrum roles and responsibilities:**
   - **Product Owner:**
     - Owns and prioritizes the product backlog
     - Defines acceptance criteria for user stories
     - Represents stakeholder interests
     - Makes scope and priority decisions
     - Availability commitment (e.g., accessible during sprint for clarifications)
   - **Scrum Master:**
     - Facilitates Scrum ceremonies
     - Removes impediments and blockers
     - Coaches team on Scrum practices
     - Shields team from external disruptions
     - Tracks and reports on team metrics
   - **Development Team:**
     - Cross-functional and self-organizing
     - Define team size (recommended 3-9 members)
     - List team members with their primary and secondary skill areas
     - Identify tech lead or architecture responsibilities if applicable

3. **Create skills matrix:**
   - Define key skill areas needed for the project (e.g., frontend, backend, infrastructure, testing, design, domain expertise)
   - For each team member, rate proficiency: expert, proficient, learning, none
   - Present as a team member x skill area grid
   - Identify bus factor risks (skills held by only one person)
   - Highlight cross-training opportunities

4. **Identify capability gaps and mitigation:**
   - Compare required skills against team matrix
   - For each gap, define mitigation strategy:
     - **Training:** internal knowledge sharing, courses, pair programming
     - **Hiring:** timeline and requirements for new team members
     - **External:** contractors, consultants, or partner teams
   - Prioritize gaps by impact on project delivery
   - Set target dates for closing critical gaps

5. **Set working agreements:**
   - **Core hours:** overlapping availability window for collaboration
   - **Response time expectations:** Slack (within X hours), email (within X hours), code reviews (within X hours)
   - **Code review SLAs:** maximum time to first review, approval requirements (e.g., 2 approvals)
   - **Tool usage:** which tools for what purpose, naming conventions, tagging standards
   - **Meeting etiquette:** cameras on/off, agenda required, notes published within X hours
   - **Work-in-progress limits:** maximum items per person, maximum items per sprint
   - **Definition of Ready:** criteria for stories entering a sprint
   - **Branching strategy:** trunk-based, GitFlow, or other — with naming conventions
   - **Documentation standards:** what gets documented, where, and when

6. **Write the artifact** — append to `.singularskills/project-management/<project>/00-initiate.md` under a `## Team Setup` section. Create the file with a `# Initiate — <project>` heading if it does not exist; if a `## Team Setup` section already exists, replace only that section. The section contains:
   - **Scrum Roles** — PO, SM, Dev Team with named individuals and responsibilities
   - **Skills Matrix** — team member x skill area grid with proficiency levels
   - **Capability Gaps** — identified gaps, mitigation strategy, timeline
   - **Working Agreements** — core hours, response times, review SLAs, tool usage
   - **Definition of Ready** — criteria for story readiness

## Output

Team setup appended to `.singularskills/project-management/<project>/00-initiate.md`. Present a summary highlighting:
- Team composition and role assignments
- Key capability gaps and mitigation plans
- Working agreements highlights (core hours, review SLAs, WIP limits)

**Record the run.** After you have written your section, append this line to `.singularskills/log.jsonl` (the `started` line of Prerequisites, with `"event":"finished"`): `{"ts":"<ISO timestamp>","skill":"project-management-team-setup","workflow":"project-management","phase":0,"project":"<project>","event":"finished","artifact":"00-initiate.md","note":""}`.

This artifact is shared by every skill of phase 0 (Initiate). The frontmatter is written once, by whoever creates the file: if you create it, open it with the block below (`skill` is the phase title, `started` the time of that first write; `gate` is `none`, as this phase has no gate); if it already exists, leave the block alone except to update `finished`.

```yaml
---
skill: Initiate
workflow: project-management
phase: 0
project: <project>
started: <ISO timestamp>
finished: <ISO timestamp>
agent: <the agent you run in, or "unknown">
gate: none
---
```

Open your `## Team Setup` section with one italic line, `*<skill name> · <ISO timestamp> · gate: none*` (your skill name is `project-management-team-setup`).

End your section with `### Decisions` and `### Open questions` (one level under your `## Team Setup` heading, so the section stays one block), in this shape:

```markdown
### Decisions
- <what was chosen> — <why> — <what was rejected>

### Open questions
- <what the next phase or a reviewer must settle>
```

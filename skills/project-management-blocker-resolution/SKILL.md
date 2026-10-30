---
name: project-management-blocker-resolution
description: Analyze current blockers with root cause, two to three resolution options, escalation paths, sprint goal impact, owners and deadlines. Use when work is stuck on something the team cannot clear itself and the user wants options and who to escalate to. Not for mapping dependencies before work starts; see /project-management-dependency-map.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: project-management
  phase: 2
  artifact: 02-sprint.md
---

# Blocker Resolution

Analyze blockers for "$ARGUMENTS". For each blocker, perform root cause analysis, propose resolution options, define escalation paths, and assess impact on the sprint goal.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"project-management-blocker-resolution","workflow":"project-management","phase":2,"project":"<project>","event":"skipped","artifact":"02-sprint.md","note":"<reason or \"none given\">"}`.

## Prerequisites

**Part of a workflow.** This skill is phase 2 (Sprint) of the Scrum workflow (`project-management`); cross-domain workflows run it too. First check `.singularskills/log.jsonl` for an open run for this project: a `run-started` line with `"project":"<project>"` and no later `run-finished` line for the same `workflow` and `project`. If one exists, the conductor is running you: continue here. Otherwise, if the user asked to start, run, continue or resume a process or workflow rather than this one step, do not continue here: invoke the `workflow` skill with the workflow the user asked for, or `project-management` when they named none, followed by `<project>`; it runs this phase in order, asks before it writes and records the run. Otherwise continue here: a later phase runs on its own, behind its gate.

Run this skill's gate before writing: `sh <this skill's folder>/scripts/gate.sh <project> <project root>`, where `<project root>` is the folder that contains `.singularskills/` (use `.` when you are already there). If it exits non-zero, stop and tell the user what it printed, unless `--skip-checks` was given (see Arguments). On a refusal, before you stop, append this line to `.singularskills/log.jsonl` (create the folder and file if missing): `{"ts":"<ISO timestamp>","skill":"project-management-blocker-resolution","workflow":"project-management","phase":2,"project":"<project>","event":"refused","artifact":"02-sprint.md","note":"<what the gate printed>"}`. Once the gate has passed, or under `--skip-checks` once you have appended the `skipped` line, append this line before you start work: `{"ts":"<ISO timestamp>","skill":"project-management-blocker-resolution","workflow":"project-management","phase":2,"project":"<project>","event":"started","artifact":"02-sprint.md","note":""}`.

Check that `.singularskills/project-management/<project>/00-initiate.md` exists. If it does not, tell the user to run an Initiate skill first (e.g., project-charter) and stop.

## Process

1. **Read existing context:**
   - Read `.singularskills/project-management/<project>/00-initiate.md` for team structure and stakeholder contacts
   - Read `.singularskills/project-management/<project>/02-sprint.md` if it exists (for standup notes, previous blockers, and sprint state)
   - Read `.singularskills/project-management/<project>/01-plan.md` if it exists (for sprint goal and story details)

2. **List all current blockers:**
   - Gather blockers from standup notes, conversation, or user input
   - For each blocker, record: description, who is blocked, which story is affected, when it was first raised
   - Identify stale blockers (raised more than 2 days ago without resolution)
   - Categorize by type: technical, organizational, external, knowledge gap, resource constraint

3. **Perform root cause analysis for each blocker:**
   - **What is the blocker?** — clear, specific description of the issue
   - **Why is this blocked?** — dig into the root cause, not just the symptom
   - **Who or what controls the resolution?** — is it within the team's control or external?
   - **How long has it been blocked?** — duration affects urgency and escalation
   - Use the "5 Whys" technique when the root cause is not immediately obvious

4. **Propose resolution options:**
   - For each blocker, propose 2-3 resolution options with trade-offs:
     - **Option A:** the ideal resolution (fixes the root cause)
     - **Option B:** a workaround (unblocks progress but does not fix the root cause)
     - **Option C:** scope adjustment (remove or defer the blocked work)
   - For each option: effort required, time to resolve, risks, and impact on quality
   - Recommend the best option with rationale

5. **Define escalation paths:**
   - If a blocker is not resolved within 24 hours, define the escalation path:
     - **Level 1:** team lead or scrum master — can they unblock it?
     - **Level 2:** engineering manager or product owner — can they reprioritize or reassign?
     - **Level 3:** director or VP — organizational blockers requiring authority
   - For each level: who to contact, what to ask for, what information to provide
   - Include specific names and roles from the stakeholder map when available

6. **Assess impact on sprint goal:**
   - For each blocker, assess: does this threaten the sprint goal?
   - Calculate the blast radius: how many stories are affected directly and indirectly?
   - If the sprint goal is at risk, recommend sprint-level actions: re-plan, cut scope, or extend
   - Prioritize blocker resolution by impact: sprint-goal-threatening blockers first

7. **Assign ownership and deadlines:**
   - Each blocker must have an owner (person responsible for driving resolution)
   - Each blocker must have a target resolution date
   - Define a check-in cadence: daily for critical blockers, every other day for moderate blockers
   - The owner is not necessarily the person who will fix it — they are the person who will ensure it gets fixed

8. **Write the artifact** — append to `.singularskills/project-management/<project>/02-sprint.md` under a `## Blocker Resolution` section. Create the file with a `# Sprint — <project>` heading if it does not exist; if a `## Blocker Resolution` section already exists, replace only that section. The section contains:
   - **Blocker Inventory** — all current blockers with status, owner, and age
   - **Root Cause Analysis** — for each blocker, the root cause and category
   - **Resolution Options** — 2-3 options per blocker with trade-offs and recommendation
   - **Escalation Paths** — escalation levels with contacts and triggers
   - **Sprint Goal Impact** — risk assessment and recommended sprint-level actions
   - **Resolution Tracker** — owner, target date, and check-in cadence for each blocker

## Output

Blocker resolution appended to `.singularskills/project-management/<project>/02-sprint.md`. Present a summary highlighting:
- Total number of blockers (by severity: critical, moderate, low)
- Number of stale blockers (older than 2 days)
- Sprint goal risk level (safe, at risk, compromised)
- Immediate actions required (top 1-3 things to do right now)
- Escalations needed (blockers that should be escalated today)

**Record the run.** After you have written your section, append this line to `.singularskills/log.jsonl` (the `started` line of Prerequisites, with `"event":"finished"`): `{"ts":"<ISO timestamp>","skill":"project-management-blocker-resolution","workflow":"project-management","phase":2,"project":"<project>","event":"finished","artifact":"02-sprint.md","note":""}`.

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

Open your `## Blocker Resolution` section with one italic line, `*<skill name> · <ISO timestamp> · gate: <passed|skipped>*` (your skill name is `project-management-blocker-resolution`).

End your section with `### Decisions` and `### Open questions` (one level under your `## Blocker Resolution` heading, so the section stays one block), in this shape:

```markdown
### Decisions
- <what was chosen> — <why> — <what was rejected>

### Open questions
- <what the next phase or a reviewer must settle>
```

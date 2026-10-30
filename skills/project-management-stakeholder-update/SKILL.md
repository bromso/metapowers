---
name: project-management-stakeholder-update
description: Generate an end-of-sprint stakeholder update — RAG status, progress, risks, decisions needed and milestones. Use when a sprint has finished and the user needs a written update for stakeholders on how it went. Not for the review meeting, sprint numbers or a leadership report; see /project-management-sprint-review, /project-management-sprint-metrics or /project-management-status-report.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: project-management
  phase: 3
  artifact: 03-review.md
---

# Stakeholder Update

Generate a stakeholder status update for "$ARGUMENTS". Summarize sprint progress, set RAG status, list risks and mitigations, note decisions needed, and include upcoming milestones.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"project-management-stakeholder-update","workflow":"project-management","phase":3,"project":"<project>","event":"skipped","artifact":"03-review.md","note":"<reason or \"none given\">"}`.

## Prerequisites

**Part of a workflow.** This skill is phase 3 (Review) of the Scrum workflow (`project-management`); cross-domain workflows run it too. Unless the user named this skill, check `.singularskills/log.jsonl` for an open run for this project: a `run-started` line with `"project":"<project>"` and no later `run-finished` line for the same `workflow` and `project`. If there is no open run, or the user asked to start, run, continue or resume a process or workflow rather than this one step, do not continue here: invoke the `workflow` skill with the workflow the user asked for, or `project-management` when they named none, followed by `<project>`. It runs this phase in order, asks before it writes and records the run. Continue here when the user named this skill, or when an open run exists (the conductor is running you).

Run this skill's gate before writing: `sh <this skill's folder>/scripts/gate.sh <project> <project root>`, where `<project root>` is the folder that contains `.singularskills/` (use `.` when you are already there). If it exits non-zero, stop and tell the user what it printed, unless `--skip-checks` was given (see Arguments). On a refusal, before you stop, append this line to `.singularskills/log.jsonl` (create the folder and file if missing): `{"ts":"<ISO timestamp>","skill":"project-management-stakeholder-update","workflow":"project-management","phase":3,"project":"<project>","event":"refused","artifact":"03-review.md","note":"<what the gate printed>"}`. Once the gate has passed, or under `--skip-checks` once you have appended the `skipped` line, append this line before you start work: `{"ts":"<ISO timestamp>","skill":"project-management-stakeholder-update","workflow":"project-management","phase":3,"project":"<project>","event":"started","artifact":"03-review.md","note":""}`.

Check that `.singularskills/project-management/<project>/00-initiate.md` exists. If it does not, tell the user to run an Initiate skill first (e.g., project-charter) and stop.

## Process

1. **Read existing context:**
   - Read `.singularskills/project-management/<project>/00-initiate.md` for stakeholder map, project charter, and team context
   - Read `.singularskills/project-management/<project>/03-review.md` if it exists (for sprint review results and metrics)
   - Read `.singularskills/project-management/<project>/02-sprint.md` if it exists (for sprint state, blockers, and standup history)
   - Read `.singularskills/project-management/<project>/01-plan.md` if it exists (for roadmap, backlog, and milestone plan)

2. **Read stakeholder map:**
   - Identify key stakeholders from the initiate phase
   - Determine the appropriate level of detail for each audience (executive summary vs. detailed report)
   - Note each stakeholder's primary concerns and interests
   - Tailor the update tone: executives want conciseness, technical leads want specifics

3. **Summarize sprint progress:**
   - Report percentage of stories complete (completed / committed)
   - List key deliverables completed this sprint (feature names, not story IDs)
   - Note any significant achievements or milestones reached
   - If a sprint review exists, reference the commitment ratio
   - Keep the summary to 3-5 bullet points maximum

4. **Set overall RAG status:**
   - **Green:** on track, no significant risks, sprint goal achieved or on pace
   - **Amber:** minor risks or delays, sprint goal at risk but recoverable, action needed
   - **Red:** significant risks or blockers, sprint goal missed or unrecoverable, escalation needed
   - Provide a one-line justification for the RAG status
   - Compare to the previous update's RAG status (improving, stable, or declining)

5. **List key risks and mitigations (top 3):**
   - For each risk, describe: what the risk is, its likelihood (high/medium/low), its impact (high/medium/low)
   - For each risk, describe the mitigation plan or contingency action
   - Note any risks that have been resolved since the last update
   - Prioritize risks by impact — stakeholders care most about what could derail the project
   - If there are more than 3 risks, list the top 3 and note that additional risks are tracked separately

6. **Note decisions needed from stakeholders:**
   - List any decisions that are pending and blocking progress
   - For each decision, explain: what the decision is, who needs to make it, the deadline, and the impact of delay
   - Provide a recommendation for each decision (do not just present options without a suggested path)
   - Mark decisions by urgency: this week, this sprint, next sprint

7. **List upcoming milestones and timeline confidence:**
   - List the next 2-3 milestones with target dates
   - For each milestone, rate timeline confidence: high (>90%), medium (60-90%), low (<60%)
   - Note any milestones that have shifted since the last update and explain why
   - If there are dependencies on external teams or approvals, flag them here

8. **Include team capacity and morale note:**
   - Briefly note team capacity: full strength, reduced (and why), or ramping up
   - Note any morale concerns: burnout risk, sustained overtime, team changes, celebrations
   - Keep this section brief (2-3 sentences) — it provides human context to the numbers
   - If there are asks related to team needs (hiring, tools, training), include them here

9. **Write the artifact** — append to `.singularskills/project-management/<project>/03-review.md` under a `## Stakeholder Update` section. Create the file with a `# Review — <project>` heading if it does not exist; if a `## Stakeholder Update` section already exists, replace only that section. The section contains:
   - **RAG Status** — Green/Amber/Red with one-line justification
   - **Sprint Progress** — key deliverables and completion percentage
   - **Top Risks** — top 3 risks with likelihood, impact, and mitigation
   - **Decisions Needed** — pending decisions with owners and deadlines
   - **Upcoming Milestones** — next milestones with dates and confidence levels
   - **Team & Capacity** — capacity status and morale note

## Output

Stakeholder update appended to `.singularskills/project-management/<project>/03-review.md`. Present a summary highlighting:
- RAG status with justification
- Sprint progress percentage and key deliverables
- Top risk and its mitigation
- Most urgent decision needed
- Next milestone and timeline confidence

**Record the run.** After you have written your section, append this line to `.singularskills/log.jsonl` (the `started` line of Prerequisites, with `"event":"finished"`): `{"ts":"<ISO timestamp>","skill":"project-management-stakeholder-update","workflow":"project-management","phase":3,"project":"<project>","event":"finished","artifact":"03-review.md","note":""}`.

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

Open your `## Stakeholder Update` section with one italic line, `*<skill name> · <ISO timestamp> · gate: <passed|skipped>*` (your skill name is `project-management-stakeholder-update`).

End your section with `### Decisions` and `### Open questions` (one level under your `## Stakeholder Update` heading, so the section stays one block), in this shape:

```markdown
### Decisions
- <what was chosen> — <why> — <what was rejected>

### Open questions
- <what the next phase or a reviewer must settle>
```

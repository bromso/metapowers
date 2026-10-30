---
name: project-management-team-health
description: Assess a delivery team's health on eight dimensions, from mission clarity and pace to collaboration and delivery confidence, with ratings, trend and interventions. Use when the user senses morale, pace or collaboration slipping on a delivery team and wants a structured check. Not for assessing your own leadership and each person's maturity; see /leadership-assess.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: project-management
  phase: 4
  artifact: 04-improve.md
---

# Team Health Check

Assess team health across key dimensions for "$ARGUMENTS". Evaluate 8 dimensions of team effectiveness, identify strengths and concerns, and recommend targeted interventions for improvement.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"project-management-team-health","workflow":"project-management","phase":4,"project":"<project>","event":"skipped","artifact":"04-improve.md","note":"<reason or \"none given\">"}`.

## Prerequisites

**Part of a workflow.** This skill is phase 4 (Improve) of the Scrum workflow (`project-management`); cross-domain workflows run it too. Unless the user named this skill, check `.singularskills/log.jsonl` for an open run for this project: a `run-started` line with `"project":"<project>"` and no later `run-finished` line for the same `workflow` and `project`. If there is no open run, or the user asked to start, run, continue or resume a process or workflow rather than this one step, do not continue here: invoke the `workflow` skill with the workflow the user asked for, or `project-management` when they named none, followed by `<project>`. It runs this phase in order, asks before it writes and records the run. Continue here when the user named this skill, or when an open run exists (the conductor is running you).

Run this skill's gate before writing: `sh <this skill's folder>/scripts/gate.sh <project> <project root>`, where `<project root>` is the folder that contains `.singularskills/` (use `.` when you are already there). If it exits non-zero, stop and tell the user what it printed, unless `--skip-checks` was given (see Arguments). On a refusal, before you stop, append this line to `.singularskills/log.jsonl` (create the folder and file if missing): `{"ts":"<ISO timestamp>","skill":"project-management-team-health","workflow":"project-management","phase":4,"project":"<project>","event":"refused","artifact":"04-improve.md","note":"<what the gate printed>"}`. Once the gate has passed, or under `--skip-checks` once you have appended the `skipped` line, append this line before you start work: `{"ts":"<ISO timestamp>","skill":"project-management-team-health","workflow":"project-management","phase":4,"project":"<project>","event":"started","artifact":"04-improve.md","note":""}`.

Check that `.singularskills/project-management/<project>/00-initiate.md` exists. If it does not, tell the user to run an Initiate skill first (e.g., project-charter) and stop.

## Process

1. **Read existing context:**
   - Read `.singularskills/project-management/<project>/00-initiate.md` for project context, team setup, and ways of working
   - Read `.singularskills/project-management/<project>/03-review.md` if it exists (for sprint metrics, velocity trends, and delivery performance)
   - Read `.singularskills/project-management/<project>/04-improve.md` if it exists (for retrospective themes, previous health checks, and process improvements)
   - Read `.singularskills/project-management/<project>/02-sprint.md` if it exists (for standup history, blocker patterns, and daily team interactions)

2. **Assess 8 dimensions:**
   - For each dimension, gather input from the user (or team members) and rate on a 1-5 scale
   - Apply a traffic light indicator based on the rating: green (4-5), amber (3), red (1-2)
   - Support the rating with specific evidence from sprint data, retrospectives, and observations

   **Dimension 1 — Mission clarity:**
   - Does everyone on the team understand the project's purpose and goals?
   - Can each team member articulate why the current work matters?
   - Are sprint goals connected to a larger product vision?
   - Evidence to look for: clear project charter, consistent sprint goals, team members pulling in the same direction

   **Dimension 2 — Pace sustainability:**
   - Is the team working at a pace they can maintain long-term?
   - Are people regularly working overtime or feeling burned out?
   - Has velocity been stable, or are there signs of exhaustion (declining velocity, increasing sick days)?
   - Evidence to look for: consistent velocity, no weekend work, people taking breaks and holidays

   **Dimension 3 — Collaboration quality:**
   - Do team members help each other proactively?
   - Is knowledge shared or siloed in individuals?
   - Are code reviews constructive and timely?
   - Evidence to look for: pair programming, shared ownership of code areas, quick PR turnaround, cross-training

   **Dimension 4 — Technical health:**
   - Is the codebase manageable and well-maintained?
   - Is technical debt being addressed or accumulating?
   - Are deployments smooth and low-risk?
   - Evidence to look for: test coverage trends, deployment frequency, incident rate, tech debt backlog size

   **Dimension 5 — Learning and growth:**
   - Are team members developing new skills and knowledge?
   - Is there time for experimentation and learning?
   - Do people have clear growth paths?
   - Evidence to look for: conference attendance, learning sprints, new technologies adopted, mentoring happening

   **Dimension 6 — Organizational support:**
   - Does the broader organization help or hinder the team's work?
   - Are dependencies on other teams managed effectively?
   - Does leadership shield the team from unnecessary disruptions?
   - Evidence to look for: quick decision-making from stakeholders, minimal mid-sprint scope changes, adequate tooling and infrastructure

   **Dimension 7 — Fun and engagement:**
   - Do people enjoy their work and look forward to contributing?
   - Is there a positive team culture with trust and psychological safety?
   - Do people volunteer for tasks and bring energy to discussions?
   - Evidence to look for: participation in meetings, initiative taking, social interactions, low turnover intent

   **Dimension 8 — Delivery confidence:**
   - Does the team believe it can deliver what it commits to?
   - Are estimates accurate and commitments realistic?
   - Does the team feel in control of its delivery process?
   - Evidence to look for: commitment ratio trends, sprint goal achievement rate, team's own confidence assessment

3. **Identify top strength and top concern:**
   - Select the highest-rated dimension as the team's top strength
   - Explain why this is a strength and how the team can leverage and protect it
   - Select the lowest-rated dimension as the team's top concern
   - Explain the impact of this weakness on the team's overall effectiveness
   - If multiple dimensions tie, consider which has the most downstream impact on other dimensions

4. **Compare to previous health checks:**
   - If `.singularskills/project-management/<project>/04-improve.md` contains previous team health check data, compare ratings
   - Note which dimensions improved, declined, or stayed the same
   - Correlate changes with events or interventions from the interim period
   - Flag any dimension that has been red for 2 or more consecutive health checks — this requires escalation

5. **Recommend targeted interventions:**
   - For the weakest dimension (or the two weakest if they are close), recommend 1-2 specific interventions
   - Each intervention must be:
     - **Specific** — not "improve communication" but "hold a 15-minute daily sync focused on cross-team dependencies"
     - **Actionable** — something the team can start in the next sprint
     - **Measurable** — with a clear indicator of whether it is working
     - **Time-boxed** — try it for 2-4 sprints before evaluating
   - Consider both quick fixes (address symptoms now) and root cause fixes (address underlying issues)
   - Note any interventions that require support from outside the team

6. **Write the artifact** — append to `.singularskills/project-management/<project>/04-improve.md` under a `## Team Health Check` section. Create the file with a `# Improve — <project>` heading if it does not exist; if a `## Team Health Check` section already exists, replace only that section. The section contains:
   - **Assessment Date** — when this health check was conducted
   - **Dimension Ratings** — table with all 8 dimensions, their 1-5 rating, traffic light, and key evidence
   - **Top Strength** — highest-rated dimension with explanation
   - **Top Concern** — lowest-rated dimension with impact analysis
   - **Trend Comparison** — changes from previous health check (if available)
   - **Recommended Interventions** — 1-2 specific actions for the weakest dimension(s) with success criteria
   - **Next Health Check** — recommended date for the follow-up assessment

## Output

Team health check appended to `.singularskills/project-management/<project>/04-improve.md`. Present a summary highlighting:
- All 8 dimensions with ratings and traffic lights in a table
- Top strength and top concern
- Trend direction from previous health check (if available)
- Recommended interventions with expected outcomes

**Record the run.** After you have written your section, append this line to `.singularskills/log.jsonl` (the `started` line of Prerequisites, with `"event":"finished"`): `{"ts":"<ISO timestamp>","skill":"project-management-team-health","workflow":"project-management","phase":4,"project":"<project>","event":"finished","artifact":"04-improve.md","note":""}`.

This artifact is shared by every skill of phase 4 (Improve). The frontmatter is written once, by whoever creates the file: if you create it, open it with the block below (`skill` is the phase title, `started` the time of that first write; `gate` is `passed` when the gate ran clean and `skipped` under `--skip-checks`); if it already exists, leave the block alone except to update `finished` and to set `gate` to the worst value among the sections (`skipped` over `passed`).

```yaml
---
skill: Improve
workflow: project-management
phase: 4
project: <project>
started: <ISO timestamp>
finished: <ISO timestamp>
agent: <the agent you run in, or "unknown">
gate: <passed|skipped>
---
```

Open your `## Team Health Check` section with one italic line, `*<skill name> · <ISO timestamp> · gate: <passed|skipped>*` (your skill name is `project-management-team-health`).

End your section with `### Decisions` and `### Open questions` (one level under your `## Team Health Check` heading, so the section stays one block), in this shape:

```markdown
### Decisions
- <what was chosen> — <why> — <what was rejected>

### Open questions
- <what the next phase or a reviewer must settle>
```

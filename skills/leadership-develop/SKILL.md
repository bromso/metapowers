---
name: leadership-develop
description: Create quarterly team OKRs plus an individual growth plan for each team member, with a weekly, monthly and quarterly feedback cadence. Use when the user wants to plan how each person on their team will grow this quarter alongside the team's goals. Not for writing OKRs on their own; see /leadership-okrs.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: leadership
  phase: 4
  artifact: 04-develop.md
---

# Develop

Create development plans for "$ARGUMENTS". Set OKRs, define growth paths, and establish how you'll support each team member's progression.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"leadership-develop","workflow":"leadership","phase":4,"project":"<project>","event":"skipped","artifact":"04-develop.md","note":"<reason or \"none given\">"}`.

## Prerequisites

Run this skill's gate before writing: `sh <this skill's folder>/scripts/gate.sh <project> <project root>`, where `<project root>` is the folder that contains `.singularskills/` (use `.` when you are already there). If it exits non-zero, stop and tell the user what it printed, unless `--skip-checks` was given (see Arguments). On a refusal, before you stop, append this line to `.singularskills/log.jsonl` (create the folder and file if missing): `{"ts":"<ISO timestamp>","skill":"leadership-develop","workflow":"leadership","phase":4,"project":"<project>","event":"refused","artifact":"04-develop.md","note":"<what the gate printed>"}`. Once the gate has passed, or under `--skip-checks` once you have appended the `skipped` line, append this line before you start work: `{"ts":"<ISO timestamp>","skill":"leadership-develop","workflow":"leadership","phase":4,"project":"<project>","event":"started","artifact":"04-develop.md","note":""}`.

Read `.singularskills/leadership/<project>/03-build.md`. If this file does not exist, tell the user:

> Phase 3 (Build) has not been completed for "<project>". Run `/leadership-build <project>` first, or use `--skip-checks` to bypass.

## Process

1. **Read context:**
   - Read `.singularskills/leadership/<project>/01-assess.md` for team member maturity
   - Read `.singularskills/leadership/<project>/02-vision.md` for values and success vision
   - Read `.singularskills/leadership/<project>/03-build.md` for roles and responsibilities
   - Read `references/cfr-model.md` for feedback approach

2. **Set team OKRs:**
   - Define 2-3 team-level objectives for the quarter
   - Each objective has 3-5 measurable key results
   - Align with broader organizational goals
   - Make key results specific and time-bound

3. **Create individual growth plans:**
   - For each team member:
     - Current strengths and growth areas (from Assess)
     - 1-2 development goals for the quarter
     - Specific actions to achieve them (stretch assignments, mentoring, learning)
     - How you'll measure progress

4. **Define the feedback cadence:**
   - Weekly 1:1s using the CFR model
   - Monthly progress reviews
   - Quarterly OKR check-ins

5. **Write the artifact** to `.singularskills/leadership/<project>/04-develop.md` with sections:
   - **Team OKRs** — objectives and key results
   - **Individual Growth Plans** — per-person development goals
   - **Feedback Cadence** — 1:1, monthly, quarterly schedule
   - **Support Commitments** — what you'll do to enable growth

## Output

The development plan written to `.singularskills/leadership/<project>/04-develop.md`. Present a summary highlighting:
- Team OKRs
- Growth focus per person
- Feedback cadence

**Record the run.** After you have written the artifact, append this line to `.singularskills/log.jsonl` (the `started` line of Prerequisites, with `"event":"finished"`): `{"ts":"<ISO timestamp>","skill":"leadership-develop","workflow":"leadership","phase":4,"project":"<project>","event":"finished","artifact":"04-develop.md","note":""}`.

Open the artifact with this frontmatter (`agent` is the agent you run in, or `unknown`; `gate` is `passed` when the gate ran clean and `skipped` under `--skip-checks`):

```yaml
---
skill: leadership-develop
workflow: leadership
phase: 4
project: <project>
started: <ISO timestamp>
finished: <ISO timestamp>
agent: <the agent you run in, or "unknown">
gate: <passed|skipped>
---
```

End the artifact with `## Decisions` and `## Open questions`, in this shape:

```markdown
## Decisions
- <what was chosen> — <why> — <what was rejected>

## Open questions
- <what the next phase or a reviewer must settle>
```

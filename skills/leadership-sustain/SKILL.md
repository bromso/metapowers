---
name: leadership-sustain
description: Establish ongoing leadership rituals — weekly 1:1s, biweekly retros, monthly reviews and quarterly OKR resets — plus a leader's playbook and team health metrics. Use when the user's team is set up and they want a recurring operating rhythm that keeps it healthy without burning themselves out.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: leadership
  phase: 5
  artifact: 05-sustain.md
---

# Sustain

Establish the ongoing leadership rituals for "$ARGUMENTS". Define the recurring processes that keep the team healthy, aligned, and growing.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"leadership-sustain","workflow":"leadership","phase":5,"project":"<project>","event":"skipped","artifact":"05-sustain.md","note":"<reason or \"none given\">"}`.

## Prerequisites

**Part of a workflow.** This skill is phase 5 (Sustain) of the Leadership Development workflow (`leadership`); cross-domain workflows run it too. First check `.singularskills/log.jsonl` for an open run for this project: a `run-started` line with `"project":"<project>"` and no later `run-finished` line for the same `workflow` and `project`. If one exists, the conductor is running you: continue here. Otherwise, if the user asked to start, run, continue or resume a process or workflow rather than this one step, do not continue here: invoke the `workflow` skill with the workflow the user asked for, or `leadership` when they named none, followed by `<project>`; it runs this phase in order, asks before it writes and records the run. Otherwise continue here: a later phase runs on its own, behind its gate.

Run this skill's gate before writing: `sh <this skill's folder>/scripts/gate.sh <project> <project root>`, where `<project root>` is the folder that contains `.singularskills/` (use `.` when you are already there). If it exits non-zero, stop and tell the user what it printed, unless `--skip-checks` was given (see Arguments). On a refusal, before you stop, append this line to `.singularskills/log.jsonl` (create the folder and file if missing): `{"ts":"<ISO timestamp>","skill":"leadership-sustain","workflow":"leadership","phase":5,"project":"<project>","event":"refused","artifact":"05-sustain.md","note":"<what the gate printed>"}`. Once the gate has passed, or under `--skip-checks` once you have appended the `skipped` line, append this line before you start work: `{"ts":"<ISO timestamp>","skill":"leadership-sustain","workflow":"leadership","phase":5,"project":"<project>","event":"started","artifact":"05-sustain.md","note":""}`.

Read all prior artifacts. If `.singularskills/leadership/<project>/04-develop.md` does not exist, tell the user:

> Phase 4 (Develop) has not been completed for "<project>". Run `/leadership-develop <project>` first, or use `--skip-checks` to bypass.

## Process

1. **Read all prior artifacts:**
   - Read `.singularskills/leadership/<project>/01-assess.md` through `04-develop.md`
   - Read `references/one-on-one-template.md`
   - Read `references/cfr-model.md`

2. **Define recurring rituals:**
   - **Weekly:** 1:1s (using template), team standup/sync
   - **Biweekly:** Team retrospective
   - **Monthly:** CFR review, skip-level meetings
   - **Quarterly:** OKR review and reset, team health check
   - For each ritual: purpose, format, duration, participants

3. **Create a leader's playbook:**
   - How to handle common situations: underperformance, conflict, burnout, new hire onboarding
   - When to escalate vs. handle yourself
   - How to maintain your own energy and avoid burnout

4. **Define health metrics:**
   - How will you know the team is healthy? (engagement, velocity, retention, satisfaction)
   - Warning signs to watch for
   - When to revisit earlier phases (re-assess, update vision)

5. **Write the artifact** to `.singularskills/leadership/<project>/05-sustain.md` with sections:
   - **Ritual Calendar** — all recurring meetings with cadence and format
   - **Leader's Playbook** — common situations and responses
   - **Health Metrics** — what to monitor and warning signs
   - **Renewal Triggers** — when to revisit assess/vision/build/develop

## Output

The sustainability plan written to `.singularskills/leadership/<project>/05-sustain.md`. Present a summary highlighting:
- Ritual calendar overview
- Key health metrics
- Top playbook entries

**Record the run.** After you have written the artifact, append this line to `.singularskills/log.jsonl` (the `started` line of Prerequisites, with `"event":"finished"`): `{"ts":"<ISO timestamp>","skill":"leadership-sustain","workflow":"leadership","phase":5,"project":"<project>","event":"finished","artifact":"05-sustain.md","note":""}`.

Open the artifact with this frontmatter (`agent` is the agent you run in, or `unknown`; `gate` is `passed` when the gate ran clean and `skipped` under `--skip-checks`):

```yaml
---
skill: leadership-sustain
workflow: leadership
phase: 5
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

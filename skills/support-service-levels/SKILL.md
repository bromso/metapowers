---
name: support-service-levels
description: Set support service levels — first-response and resolution targets per priority and channel, business hours, what pauses the clock, the staffing those targets imply, and what is promised to customers versus targeted internally. Use when the user needs to decide how fast support answers and whether the team can keep up. Not for measuring how support is doing now; see /support-health-review.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: support
  phase: 6
  artifact: 06-service-levels.md
---

# Service levels

Set the response and resolution targets for "$ARGUMENTS", check that the team can meet them, and separate what customers are promised from what the team aims for.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"support-service-levels","workflow":"support","phase":6,"project":"<project>","event":"skipped","artifact":"06-service-levels.md","note":"<reason or \"none given\">"}`.

**Compute with code.** Perform every calculation (totals, balances, ratios, variances, projections) with a script — Bash, Python or a spreadsheet formula written to a file — and include the computation alongside the result. Never do arithmetic mentally.

## Prerequisites

**Part of a workflow.** This skill is phase 6 (Service levels) of the Support Operations Cycle workflow (`support`); cross-domain workflows run it too. First check `.singularskills/log.jsonl` for an open run for this project: a `run-started` line with `"project":"<project>"` and no later `run-finished` line for the same `workflow` and `project`. If one exists, the conductor is running you: continue here. Otherwise, if the user asked to start, run, continue or resume a process or workflow rather than this one step, do not continue here: invoke the `workflow` skill with the workflow the user asked for, or `support` when they named none, followed by `<project>`; it runs this phase in order, asks before it writes and records the run. Otherwise continue here: a later phase runs on its own, behind its gate.

Run this skill's gate before writing: `sh <this skill's folder>/scripts/gate.sh <project> <project root>`, where `<project root>` is the folder that contains `.singularskills/` (use `.` when you are already there). If it exits non-zero, stop and tell the user what it printed, unless `--skip-checks` was given (see Arguments). On a refusal, before you stop, append this line to `.singularskills/log.jsonl` (create the folder and file if missing): `{"ts":"<ISO timestamp>","skill":"support-service-levels","workflow":"support","phase":6,"project":"<project>","event":"refused","artifact":"06-service-levels.md","note":"<what the gate printed>"}`. Once the gate has passed, or under `--skip-checks` once you have appended the `skipped` line, append this line before you start work: `{"ts":"<ISO timestamp>","skill":"support-service-levels","workflow":"support","phase":6,"project":"<project>","event":"started","artifact":"06-service-levels.md","note":""}`.

Read `.singularskills/support/<project>/02-taxonomy.md` for the priorities and `.singularskills/support/<project>/05-escalation.md` for the tiers, handoffs and on-call cover.

## Process

1. **Ask the user for the constraints:** support hours and time zones, the number of agents and their hours, any targets already promised in contracts or on the website, and plans or tiers that get faster service.

2. **Set the targets** as a table of priority × channel: first-response target and resolution target, each labelled `target`. Keep P1 targets reachable within the on-call cover in `05-escalation.md`; a P1 target that runs through hours nobody covers is not a target.

3. **Define the clock:** business hours or around the clock per priority, holidays, and what pauses it (waiting on the customer, waiting on a third party) and what never pauses it (waiting on another internal team).

4. **Estimate the staffing the targets imply.** With the arrival rate of tickets per hour (from `01-map.md` or `02-taxonomy.md` volumes, or the user's estimate) and the average handle time per ticket (from the user), compute the agent hours needed per day as arrival rate × handle time, plus the share of time agents spend on anything else. Write the script to the project folder and include it beside the result. Label the result an estimate: it ignores how tickets bunch up, so peaks need more cover than the average says. Compare it with the agent hours the user has.

5. **Separate promise from target:** what is published to customers (usually looser, and only where the team meets it reliably) and what the team aims for internally. Never publish a target the staffing estimate says the team cannot meet.

6. **Write the artifact** to `.singularskills/support/<project>/06-service-levels.md` with sections:
   - **Targets** — the priority × channel table
   - **Clock** — hours, holidays, what pauses and what never pauses it
   - **Staffing** — the estimate, its script, and the gap against current hours
   - **Published promises** — what customers are told
   - **Internal targets** — what the team aims for

## Output

The service levels written to `.singularskills/support/<project>/06-service-levels.md`. Present a summary to the user highlighting:
- The P1 and P2 first-response targets
- The staffing estimate against the hours the team has
- Any published promise the team cannot reliably meet

**Record the run.** After you have written the artifact, append this line to `.singularskills/log.jsonl` (the `started` line of Prerequisites, with `"event":"finished"`): `{"ts":"<ISO timestamp>","skill":"support-service-levels","workflow":"support","phase":6,"project":"<project>","event":"finished","artifact":"06-service-levels.md","note":""}`.

Open the artifact with this frontmatter (`agent` is the agent you run in, or `unknown`; `gate` is `passed` when the gate ran clean and `skipped` under `--skip-checks`):

```yaml
---
skill: support-service-levels
workflow: support
phase: 6
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

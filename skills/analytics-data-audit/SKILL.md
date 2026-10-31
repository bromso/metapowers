---
name: analytics-data-audit
description: Check that the data can produce each defined metric — where its inputs live, how fresh they are, and row-count, null, duplicate, range and reconciliation checks run on a sample. Use when the user has metric definitions and needs to know whether the data behind them can be trusted. Not for designing event tracking or a tracking plan; see /marketing-analytics-tracking.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: analytics
  phase: 3
  artifact: 03-data.md
---

# Data

Check the data behind every metric for "$ARGUMENTS" before anyone computes an answer from it.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"analytics-data-audit","workflow":"analytics","phase":3,"project":"<project>","event":"skipped","artifact":"03-data.md","note":"<reason or \"none given\">"}`.

**Compute with code.** Perform every calculation (totals, balances, ratios, variances, projections) with a script — Bash, Python or a spreadsheet formula written to a file — and include the computation alongside the result. Never do arithmetic mentally.

## Prerequisites

**Part of a workflow.** This skill is phase 3 (Data) of the Decision Analytics Cycle workflow (`analytics`); cross-domain workflows run it too. First check `.singularskills/log.jsonl` for an open run for this project: a `run-started` line with `"project":"<project>"` and no later `run-finished` line for the same `workflow` and `project`. If one exists, the conductor is running you: continue here. Otherwise, if the user asked to start, run, continue or resume a process or workflow rather than this one step, do not continue here: invoke the `workflow` skill with the workflow the user asked for, or `analytics` when they named none, followed by `<project>`; it runs this phase in order, asks before it writes and records the run. Otherwise continue here: a later phase runs on its own, behind its gate.

Run this skill's gate before writing: `sh <this skill's folder>/scripts/gate.sh <project> <project root>`, where `<project root>` is the folder that contains `.singularskills/` (use `.` when you are already there). If it exits non-zero, stop and tell the user what it printed, unless `--skip-checks` was given (see Arguments). On a refusal, before you stop, append this line to `.singularskills/log.jsonl` (create the folder and file if missing): `{"ts":"<ISO timestamp>","skill":"analytics-data-audit","workflow":"analytics","phase":3,"project":"<project>","event":"refused","artifact":"03-data.md","note":"<what the gate printed>"}`. Once the gate has passed, or under `--skip-checks` once you have appended the `skipped` line, append this line before you start work: `{"ts":"<ISO timestamp>","skill":"analytics-data-audit","workflow":"analytics","phase":3,"project":"<project>","event":"started","artifact":"03-data.md","note":""}`.

Read `.singularskills/analytics/<project>/02-metrics.md` for the metric definitions and their sources.

## Process

1. **Get the data:** ask the user, once and together with any other question, for exports, query results or a schema for each source the metrics name (a file path, a pasted table, DDL or a column list), and for any number they already report for one of the metrics. Read `.singularskills/marketing/<project>/` for a tracking plan if one exists.

2. **Map each metric to its inputs:** table or file, columns or events, join keys, and the time zone and grain of each. Note any metric whose inputs do not exist: those are tracking gaps.

3. **Run the checks** on the data supplied, with a script written to `.singularskills/analytics/<project>/` and included beside the results. Scripts read the user's files where they keep them and write only aggregates (counts, sums, rates and intervals): no row-level data, names, emails or raw IDs go into any file under `.singularskills/`. Per source:
   - row counts per day, and gaps
   - nulls in every column a metric uses
   - duplicates on the key
   - date range and the latest complete day
   - values outside the definition (negative amounts, unknown statuses, test accounts)
   Label each check `computed` or `not checked`, with the reason when not checked.

4. **Reconcile one number:** compute one metric the user already reports and compare. Report match, or the difference and its likely cause (a filter, a time zone, late data, a definition difference).

5. **List the tracking gaps:** events or fields a metric needs that the data does not have, with `/marketing-analytics-tracking` as the next step for instrumenting them.

6. **Write the artifact** to `.singularskills/analytics/<project>/03-data.md` with sections:
   - **Sources** — per metric: where its inputs live, freshness, time zone
   - **Checks** — each check, `computed` with its result or `not checked`
   - **Reconciliation** — the number compared and the result
   - **Tracking gaps** — what is missing and for which metric
   - **Fitness** — per metric: ready, usable with caveats, or not usable yet

## Output

The data audit written to `.singularskills/analytics/<project>/03-data.md`. Present a summary to the user highlighting:
- Which metrics are ready, which have caveats and which are not usable
- The reconciliation result
- The tracking gaps

**Record the run.** After you have written the artifact, append this line to `.singularskills/log.jsonl` (the `started` line of Prerequisites, with `"event":"finished"`): `{"ts":"<ISO timestamp>","skill":"analytics-data-audit","workflow":"analytics","phase":3,"project":"<project>","event":"finished","artifact":"03-data.md","note":""}`.

Open the artifact with this frontmatter (`agent` is the agent you run in, or `unknown`; `gate` is `passed` when the gate ran clean and `skipped` under `--skip-checks`):

```yaml
---
skill: analytics-data-audit
workflow: analytics
phase: 3
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

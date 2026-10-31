---
name: analytics-analysis
description: Answer the priority questions with the data supplied — method per question type, the result with its uncertainty, the segments that change the picture, and what the data cannot say. Use when the questions, metrics and data checks are done and the user wants the answers. Not for revenue, cost or cash forecasts; see /finance-forecast.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: analytics
  phase: 4
  artifact: 04-analysis.md
---

# Analysis

Answer the priority questions for "$ARGUMENTS" from the data, with how sure the answer is and what it cannot tell you.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"analytics-analysis","workflow":"analytics","phase":4,"project":"<project>","event":"skipped","artifact":"04-analysis.md","note":"<reason or \"none given\">"}`.

**Compute with code.** Perform every calculation (totals, balances, ratios, variances, projections) with a script — Bash, Python or a spreadsheet formula written to a file — and include the computation alongside the result. Never do arithmetic mentally.

## Prerequisites

**Part of a workflow.** This skill is phase 4 (Analysis) of the Decision Analytics Cycle workflow (`analytics`); cross-domain workflows run it too. First check `.singularskills/log.jsonl` for an open run for this project: a `run-started` line with `"project":"<project>"` and no later `run-finished` line for the same `workflow` and `project`. If one exists, the conductor is running you: continue here. Otherwise, if the user asked to start, run, continue or resume a process or workflow rather than this one step, do not continue here: invoke the `workflow` skill with the workflow the user asked for, or `analytics` when they named none, followed by `<project>`; it runs this phase in order, asks before it writes and records the run. Otherwise continue here: a later phase runs on its own, behind its gate.

Run this skill's gate before writing: `sh <this skill's folder>/scripts/gate.sh <project> <project root>`, where `<project root>` is the folder that contains `.singularskills/` (use `.` when you are already there). If it exits non-zero, stop and tell the user what it printed, unless `--skip-checks` was given (see Arguments). On a refusal, before you stop, append this line to `.singularskills/log.jsonl` (create the folder and file if missing): `{"ts":"<ISO timestamp>","skill":"analytics-analysis","workflow":"analytics","phase":4,"project":"<project>","event":"refused","artifact":"04-analysis.md","note":"<what the gate printed>"}`. Once the gate has passed, or under `--skip-checks` once you have appended the `skipped` line, append this line before you start work: `{"ts":"<ISO timestamp>","skill":"analytics-analysis","workflow":"analytics","phase":4,"project":"<project>","event":"started","artifact":"04-analysis.md","note":""}`.

Read `.singularskills/analytics/<project>/01-questions.md` for the priority questions and `.singularskills/analytics/<project>/03-data.md` for which metrics are fit to use. Read `.singularskills/analytics/<project>/02-metrics.md` for the definitions when it exists.

## Process

1. **Take the priority questions** from `01-questions.md` in rank order. Skip any whose metrics `03-data.md` marks not usable, and say so.

2. **Choose the method by question type:**
   - **describe** — the metric over the period, by the segments in its definition, against the previous period and any target
   - **diagnose** — decompose the change into segments and into mix versus rate, as `references/metric-definitions.md` shows; rule out data problems from `03-data.md` first
   - **predict** — a simple projection of the supplied history (trend or seasonal average) with a range, labelled an estimate, and its assumptions. Revenue, cost and cash projections go to `/finance-forecast` instead; say so and do not project them
   - **test** — data cannot answer it; route it to `/marketing-ab-test-setup` to design the experiment

3. **Compute every answer** with a script written to `.singularskills/analytics/<project>/` and included beside the result. Scripts read the user's files where they keep them and write only aggregates (counts, sums, rates and intervals): no row-level data, names, emails or raw IDs go into any file under `.singularskills/`. Give each result with its uncertainty: a confidence interval or range and the sample size it rests on. Label every number `computed` or `not measured`.

4. **Look for segments that change the picture:** a result that reverses or vanishes inside a segment (Simpson's paradox) is reported with the segment table.

5. **State what the data cannot say:** for describe and diagnose answers, that observational differences are not causes; any confounder you can name; and any gap from `03-data.md` that limits the answer.

6. **Write the artifact** to `.singularskills/analytics/<project>/04-analysis.md` with one section per question:
   - **Answer** — one sentence
   - **Evidence** — the computed result, its uncertainty and the script
   - **Segments** — any segment that changes the picture
   - **Limits** — what the data cannot say
   and a final **Routed** section listing questions sent to `/finance-forecast` or `/marketing-ab-test-setup`.

## Output

The analysis written to `.singularskills/analytics/<project>/04-analysis.md`. Present a summary to the user highlighting:
- The one-sentence answer to each priority question, with its uncertainty
- Any segment that reverses a result
- Questions routed elsewhere, and where

**Record the run.** After you have written the artifact, append this line to `.singularskills/log.jsonl` (the `started` line of Prerequisites, with `"event":"finished"`): `{"ts":"<ISO timestamp>","skill":"analytics-analysis","workflow":"analytics","phase":4,"project":"<project>","event":"finished","artifact":"04-analysis.md","note":""}`.

Open the artifact with this frontmatter (`agent` is the agent you run in, or `unknown`; `gate` is `passed` when the gate ran clean and `skipped` under `--skip-checks`):

```yaml
---
skill: analytics-analysis
workflow: analytics
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

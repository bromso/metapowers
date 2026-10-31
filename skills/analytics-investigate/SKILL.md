---
name: analytics-investigate
description: Investigate why a metric moved — rule out data problems first, then decompose the change by segment and into mix versus rate, then rank candidate causes with the evidence for and against each. Use when a number rose or fell unexpectedly and the user asks why. Not for checking whether one reported number is right; see /analytics-number-check.
metadata:
  argument-hint: "<metric and change> [project]"
---

# Investigate

Find out why the metric in "$ARGUMENTS" moved, in an order that catches broken data before it gets explained.

**Compute with code.** Perform every calculation (totals, balances, ratios, variances, projections) with a script — Bash, Python or a spreadsheet formula written to a file — and include the computation alongside the result. Never do arithmetic mentally.

## Prerequisites

The data: the metric's series and the rows or segment totals behind it, as files or pasted tables. When `$ARGUMENTS` or the request names a project, use that name as `<project>` whether or not its folder exists yet in `.singularskills/analytics/` (create it when you write). With no project named: with exactly one folder there, use it; with several, ask which; with no folder at all, ask for a project name.

Read `.singularskills/analytics/<project>/02-metrics.md` for the metric's definition and `03-data.md` for known data issues, when they exist.

Append this line to `.singularskills/log.jsonl` before you write the investigation (create the folder and file if missing): `{"ts":"<ISO timestamp>","skill":"analytics-investigate","workflow":"analytics","phase":null,"project":"<project>","event":"started","artifact":"investigations/<date>-<slug>.md","note":""}`, where `<date>` is today as `YYYY-MM-DD` and `<slug>` is two to four words naming the metric, never a person.

## Process

1. **Size the change:** the metric before and after, the dates, and whether the move is outside its normal range (compare with the same span in earlier periods).

2. **Rule out data problems before any cause:**
   - a tracking or logging change (an event renamed, a tag removed, a new app version)
   - late or missing data in the latest period
   - a definition change (a filter, a time zone, an exclusion) during the period
   - duplicates or test traffic
   If one explains the move, stop: report it as the cause and say what to fix.

3. **Decompose the change** with a script written to `.singularskills/analytics/<project>/` and included beside the results. Scripts read the user's files where they keep them and write only aggregates (counts, sums, rates and intervals): no row-level data, names, emails or raw IDs go into any file under `.singularskills/`. For a ratio or average, split the change into **mix** (segments' shares changed) and **rate** (the metric changed within segments), as `references/metric-definitions.md` shows; then the segments in the metric's definition (platform, country, channel, plan, new versus returning), ranked by their contribution to the change.

4. **List candidate causes** for what the decomposition shows: releases, campaigns, pricing, seasonality, outages, competitor moves, external events. For each, the evidence for and against from the data and the user's notes, and a likelihood (likely, possible, unlikely).

5. **Say what would confirm the top cause:** the check, the cut of data or the experiment that would settle it.

6. **Write the investigation** to `.singularskills/analytics/<project>/investigations/<date>-<slug>.md` with sections **Change**, **Data checks**, **Decomposition**, **Candidate causes** and **To confirm**.

## Output

The investigation written to `.singularskills/analytics/<project>/investigations/<date>-<slug>.md`. Present the most likely explanation first, with whether it is a data problem, a mix shift or a real change in behaviour, and what would confirm it.

After you have written the investigation, append the `started` line of Prerequisites to `.singularskills/log.jsonl` with `"event":"finished"`: `{"ts":"<ISO timestamp>","skill":"analytics-investigate","workflow":"analytics","phase":null,"project":"<project>","event":"finished","artifact":"investigations/<date>-<slug>.md","note":""}`.

The investigation opens with this frontmatter (`agent` is the agent you run in, or `unknown`; this utility has no gate, so `phase` is `null` and `gate` is `none`):

```yaml
---
skill: analytics-investigate
workflow: analytics
phase: null
project: <project>
started: <ISO timestamp>
finished: <ISO timestamp>
agent: <the agent you run in, or "unknown">
gate: none
---
```

The investigation ends with `## Decisions` and `## Open questions`, in this shape:

```markdown
## Decisions
- <what was chosen> — <why> — <what was rejected>

## Open questions
- <what the next phase or a reviewer must settle>
```

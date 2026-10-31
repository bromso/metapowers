---
name: support-health-review
description: Review support health from a ticket export — volumes, response and resolution times, satisfaction, SLA attainment and the churn signals that mark accounts at risk — and compare it with the previous review. Use when the user wants to know how support is performing and which customers may be about to leave. Not for designing retention offers or win-back campaigns; see /marketing-churn-prevention.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: support
  phase: 7
  artifact: 07-health.md
---

# Health

Review how support is performing for "$ARGUMENTS" over a period, against the service levels, and find the accounts whose contacts say they may be about to leave.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"support-health-review","workflow":"support","phase":7,"project":"<project>","event":"skipped","artifact":"07-health.md","note":"<reason or \"none given\">"}`.

**Compute with code.** Perform every calculation (totals, balances, ratios, variances, projections) with a script — Bash, Python or a spreadsheet formula written to a file — and include the computation alongside the result. Never do arithmetic mentally.

## Prerequisites

**Part of a workflow.** This skill is phase 7 (Health) of the Support Operations Cycle workflow (`support`); cross-domain workflows run it too. First check `.singularskills/log.jsonl` for an open run for this project: a `run-started` line with `"project":"<project>"` and no later `run-finished` line for the same `workflow` and `project`. If one exists, the conductor is running you: continue here. Otherwise, if the user asked to start, run, continue or resume a process or workflow rather than this one step, do not continue here: invoke the `workflow` skill with the workflow the user asked for, or `support` when they named none, followed by `<project>`; it runs this phase in order, asks before it writes and records the run. Otherwise continue here: a later phase runs on its own, behind its gate.

Run this skill's gate before writing: `sh <this skill's folder>/scripts/gate.sh <project> <project root>`, where `<project root>` is the folder that contains `.singularskills/` (use `.` when you are already there). If it exits non-zero, stop and tell the user what it printed, unless `--skip-checks` was given (see Arguments). On a refusal, before you stop, append this line to `.singularskills/log.jsonl` (create the folder and file if missing): `{"ts":"<ISO timestamp>","skill":"support-health-review","workflow":"support","phase":7,"project":"<project>","event":"refused","artifact":"07-health.md","note":"<what the gate printed>"}`. Once the gate has passed, or under `--skip-checks` once you have appended the `skipped` line, append this line before you start work: `{"ts":"<ISO timestamp>","skill":"support-health-review","workflow":"support","phase":7,"project":"<project>","event":"started","artifact":"07-health.md","note":""}`.

Read `.singularskills/support/<project>/02-taxonomy.md` for the categories and priorities and `.singularskills/support/<project>/06-service-levels.md` for the targets. If `.singularskills/support/<project>/07-health.md` already exists, read it before you write: it is the previous period.

## Process

1. **Get the data:** ask the user, once and together with any other question, for a ticket export covering the period (a CSV or JSON file path), the period's start and end, and the number of active customers. Without an export, write the review as a list of what to measure and mark every metric `not measured`.

2. **Compute the metrics** in `references/support-metrics.md` that the export allows, with a script written to `.singularskills/support/<project>/` and included beside the results. Scripts read the export where the user keeps it and write only aggregates (counts, times, shares and `acct-` identifiers): no ticket text, names, emails, phone numbers or raw account IDs go into any file under `.singularskills/`. The metrics: volume by category and channel, contact rate, first-response and resolution time (median and p90), first-contact resolution, reopen rate, backlog age, and CSAT (top-2-box share first, then mean, with the response count). Label every number `computed` or `not measured`, following the inputs table in that file. Never report NPS alone.

3. **Check SLA attainment** against `06-service-levels.md`: per priority, the share of tickets meeting the first-response and resolution targets, and the worst misses by category.

4. **Find what drives volume:** the categories with the most contacts and the fastest growth, and which of them look like product or documentation problems.

5. **Find the churn signals** for each account in the period: three or more contacts, an unresolved P1 or P2, a satisfaction rating of 1 or 2, or a contact whose category or text is about cancelling, downgrading or a competitor. An account with two or more signals is at risk.

6. **Identify accounts without personal data:** list each at-risk account as `acct-` followed by the first 8 hex digits of the SHA-256 of its account or customer ID, computed with the script in `references/support-metrics.md`, which goes into the artifact so the user can map identifiers back over their own export; never write its output to a file. If the export has no account or customer ID column, or its values look like emails, phone numbers or names, write `not measured: no account ID in the export` in place of the list; never hash names or emails instead. Quote from tickets only what the evidence needs, with names, emails, phone numbers and account or order numbers replaced by placeholders.

7. **Compare with the previous review** if `07-health.md` existed and its period ended before this one starts. If the previous review's period is the same as this one, later, or overlaps it, do not compare: keep the previous file as `07-health-<its start>-to-<its end>.md`, say so in the summary, and write "no earlier period to compare" under Trend. Otherwise: for each metric computed in both periods, the change; and the at-risk accounts present in both periods, which need attention first.

8. **Write the artifact** to `.singularskills/support/<project>/07-health.md`, replacing the previous one, with sections:
   - **Period** — the dates and the data used
   - **Metrics** — each metric, `computed` with the script or `not measured`
   - **SLA attainment** — per priority, with the worst misses
   - **Volume drivers** — the categories behind most contacts
   - **At-risk accounts** — identifiers, signals and evidence
   - **Trend** — the comparison with the previous period, or "first review"

## Output

The health review written to `.singularskills/support/<project>/07-health.md`. Present a summary to the user highlighting:
- CSAT top-2-box and SLA attainment for P1 and P2
- The two categories driving the most volume
- The number of at-risk accounts, and how many were at risk last period too
- When there are at-risk accounts: the next step is `/marketing-churn-prevention`, which designs the interventions

**Record the run.** After you have written the artifact, append this line to `.singularskills/log.jsonl` (the `started` line of Prerequisites, with `"event":"finished"`): `{"ts":"<ISO timestamp>","skill":"support-health-review","workflow":"support","phase":7,"project":"<project>","event":"finished","artifact":"07-health.md","note":""}`.

Open the artifact with this frontmatter (`agent` is the agent you run in, or `unknown`; `gate` is `passed` when the gate ran clean and `skipped` under `--skip-checks`):

```yaml
---
skill: support-health-review
workflow: support
phase: 7
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

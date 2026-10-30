---
name: bookkeeping-reconcile
description: Match the period's categorized entries against bank, card, vendor and processor statements, resolving missing items, mismatches and duplicates. Use when the user has categorized a period's transactions and wants them checked against bank and card statements. Not for a balance reconciliation of one ledger account with aged items; see /accounting-reconciliation.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: bookkeeping
  phase: 3
  artifact: 03-reconcile.md
---

# Reconcile

Match the categorized journal entries for "$ARGUMENTS" against external statements. Identify and resolve every discrepancy before closing the period.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"bookkeeping-reconcile","workflow":"bookkeeping","phase":3,"project":"<project>","event":"skipped","artifact":"03-reconcile.md","note":"<reason or \"none given\">"}`.

**Compute with code.** Perform every calculation (totals, balances, ratios, variances, projections) with a script — Bash, Python or a spreadsheet formula written to a file — and include the computation alongside the result. Never do arithmetic mentally.

## Prerequisites

**Part of a workflow.** This skill is phase 3 (Reconcile) of the Bookkeeping Cycle workflow (`bookkeeping`); cross-domain workflows run it too. Unless the user named this skill, check `.singularskills/log.jsonl` for an open run for this project: a `run-started` line with `"project":"<project>"` and no later `run-finished` line for the same `workflow` and `project`. If there is no open run, or the user asked to start, run, continue or resume a process or workflow rather than this one step, do not continue here: invoke the `workflow` skill with the workflow the user asked for, or `bookkeeping` when they named none, followed by `<project>`. It runs this phase in order, asks before it writes and records the run. Continue here when the user named this skill, or when an open run exists (the conductor is running you).

Run this skill's gate before writing: `sh <this skill's folder>/scripts/gate.sh <project> <project root>`, where `<project root>` is the folder that contains `.singularskills/` (use `.` when you are already there). If it exits non-zero, stop and tell the user what it printed, unless `--skip-checks` was given (see Arguments). On a refusal, before you stop, append this line to `.singularskills/log.jsonl` (create the folder and file if missing): `{"ts":"<ISO timestamp>","skill":"bookkeeping-reconcile","workflow":"bookkeeping","phase":3,"project":"<project>","event":"refused","artifact":"03-reconcile.md","note":"<what the gate printed>"}`. Once the gate has passed, or under `--skip-checks` once you have appended the `skipped` line, append this line before you start work: `{"ts":"<ISO timestamp>","skill":"bookkeeping-reconcile","workflow":"bookkeeping","phase":3,"project":"<project>","event":"started","artifact":"03-reconcile.md","note":""}`.

Read `.singularskills/bookkeeping/<project>/02-categorize.md` for the categorized journal entries.

## Process

1. **Gather external statements:**
   - Bank statements for the period
   - Credit card statements
   - Vendor account statements
   - Payment processor reports

2. **Match transactions:**
   - For each internal entry, find the matching external transaction
   - Mark matches as reconciled
   - Note the match method (exact amount, date + amount, reference number)

3. **Identify discrepancies:**
   - **Missing internally** — appears on statement but not in our records
   - **Missing externally** — recorded internally but not on statement (timing difference or error)
   - **Amount mismatch** — same transaction, different amounts
   - **Duplicates** — same transaction recorded more than once

4. **Resolve each discrepancy:**
   - Add missing transactions
   - Remove or merge duplicates
   - Correct amounts with source document verification
   - Note timing differences (outstanding checks, pending deposits)

5. **Write the artifact** to `.singularskills/bookkeeping/<project>/03-reconcile.md` with sections:
   - **Reconciliation Summary** — matched vs. unmatched counts per account
   - **Discrepancies Found** — table of issues and resolutions
   - **Adjusting Entries** — any corrections made
   - **Outstanding Items** — legitimate timing differences
   - **Reconciled Balance** — confirmed balance per account

## Output

The reconciliation written to `.singularskills/bookkeeping/<project>/03-reconcile.md`. Present a summary highlighting:
- Percentage of transactions matched
- Number of discrepancies found and resolved
- Final reconciled balances

**Record the run.** After you have written the artifact, append this line to `.singularskills/log.jsonl` (the `started` line of Prerequisites, with `"event":"finished"`): `{"ts":"<ISO timestamp>","skill":"bookkeeping-reconcile","workflow":"bookkeeping","phase":3,"project":"<project>","event":"finished","artifact":"03-reconcile.md","note":""}`.

Open the artifact with this frontmatter (`agent` is the agent you run in, or `unknown`; `gate` is `passed` when the gate ran clean and `skipped` under `--skip-checks`):

```yaml
---
skill: bookkeeping-reconcile
workflow: bookkeeping
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

End the artifact with this paragraph, verbatim:

> **Not financial or tax advice.** This artifact is generated analysis for review by a qualified accountant or financial professional before any filing, reporting or decision relies on it.

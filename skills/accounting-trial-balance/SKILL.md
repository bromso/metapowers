---
name: accounting-trial-balance
description: Prepare an unadjusted trial balance from the general ledger and verify that total debits equal total credits, tracing any error. Use when the user has posted the ledger and wants to check the books balance before making period-end adjustments. Not for balances after adjusting entries; see /accounting-adjusted-balance.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: accounting
  phase: 4
  artifact: 04-trial-balance.md
---

# Trial Balance

Prepare an unadjusted trial balance for "$ARGUMENTS". List all ledger account balances and verify that total debits equal total credits.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"accounting-trial-balance","workflow":"accounting","phase":4,"project":"<project>","event":"skipped","artifact":"04-trial-balance.md","note":"<reason or \"none given\">"}`.

**Compute with code.** Perform every calculation (totals, balances, ratios, variances, projections) with a script — Bash, Python or a spreadsheet formula written to a file — and include the computation alongside the result. Never do arithmetic mentally.

## Prerequisites

**Part of a workflow.** This skill is phase 4 (Trial Balance) of the Accounting Cycle workflow (`accounting`); cross-domain workflows run it too. Unless the user named this skill, check `.singularskills/log.jsonl` for an open run for this project: a `run-started` line with `"project":"<project>"` and no later `run-finished` line for the same `workflow` and `project`. If there is no open run, or the user asked to start, run, continue or resume a process or workflow rather than this one step, do not continue here: invoke the `workflow` skill with the workflow the user asked for, or `accounting` when they named none, followed by `<project>`. It runs this phase in order, asks before it writes and records the run. Continue here when the user named this skill, or when an open run exists (the conductor is running you).

Run this skill's gate before writing: `sh <this skill's folder>/scripts/gate.sh <project> <project root>`, where `<project root>` is the folder that contains `.singularskills/` (use `.` when you are already there). If it exits non-zero, stop and tell the user what it printed, unless `--skip-checks` was given (see Arguments). On a refusal, before you stop, append this line to `.singularskills/log.jsonl` (create the folder and file if missing): `{"ts":"<ISO timestamp>","skill":"accounting-trial-balance","workflow":"accounting","phase":4,"project":"<project>","event":"refused","artifact":"04-trial-balance.md","note":"<what the gate printed>"}`. Once the gate has passed, or under `--skip-checks` once you have appended the `skipped` line, append this line before you start work: `{"ts":"<ISO timestamp>","skill":"accounting-trial-balance","workflow":"accounting","phase":4,"project":"<project>","event":"started","artifact":"04-trial-balance.md","note":""}`.

Read `.singularskills/accounting/<project>/03-ledger.md` for the ledger account balances.

## Process

1. **Extract account balances:**
   - List every account from the general ledger with its closing balance
   - Place debit balances in the debit column and credit balances in the credit column
   - Order accounts by category: assets, liabilities, equity, revenue, expenses

2. **Calculate totals:**
   - Sum all debit balances
   - Sum all credit balances
   - Compare totals — they must be equal

3. **Investigate discrepancies:**
   - If totals do not match, check for:
     - Transposition errors (digits swapped)
     - Slide errors (decimal point shifted)
     - Omitted or double-posted entries
     - Entries posted to the wrong side
   - Document any corrections made

4. **Write the artifact** to `.singularskills/accounting/<project>/04-trial-balance.md` with sections:
   - **Unadjusted Trial Balance** — all accounts with debit and credit columns
   - **Balance Verification** — total debits, total credits, and difference (should be zero)
   - **Error Log** — any discrepancies found and corrections applied

## Output

The trial balance written to `.singularskills/accounting/<project>/04-trial-balance.md`. Present a summary highlighting:
- Total debits and total credits
- Whether the trial balance is in balance
- Any errors detected and corrected

**Record the run.** After you have written the artifact, append this line to `.singularskills/log.jsonl` (the `started` line of Prerequisites, with `"event":"finished"`): `{"ts":"<ISO timestamp>","skill":"accounting-trial-balance","workflow":"accounting","phase":4,"project":"<project>","event":"finished","artifact":"04-trial-balance.md","note":""}`.

Open the artifact with this frontmatter (`agent` is the agent you run in, or `unknown`; `gate` is `passed` when the gate ran clean and `skipped` under `--skip-checks`):

```yaml
---
skill: accounting-trial-balance
workflow: accounting
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

End the artifact with this paragraph, verbatim:

> **Not financial or tax advice.** This artifact is generated analysis for review by a qualified accountant or financial professional before any filing, reporting or decision relies on it.

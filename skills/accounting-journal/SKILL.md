---
name: accounting-journal
description: Record numbered double-entry journal entries from the analyzed transaction register, each with balanced debits and credits. Use when the user has a transaction register for a period and asks to journalize it or book the transactions. Not for sorting everyday bank lines into accounts, or posting entries to ledger accounts; see /bookkeeping-categorize or /accounting-ledger.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: accounting
  phase: 2
  artifact: 02-journal.md
---

# Journal

Record journal entries for "$ARGUMENTS". Convert analyzed transactions into formal double-entry journal entries with equal debits and credits.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"accounting-journal","workflow":"accounting","phase":2,"project":"<project>","event":"skipped","artifact":"02-journal.md","note":"<reason or \"none given\">"}`.

**Compute with code.** Perform every calculation (totals, balances, ratios, variances, projections) with a script — Bash, Python or a spreadsheet formula written to a file — and include the computation alongside the result. Never do arithmetic mentally.

## Prerequisites

**Part of a workflow.** This skill is phase 2 (Journal) of the Accounting Cycle workflow (`accounting`); cross-domain workflows run it too. Unless the user named this skill, check `.singularskills/log.jsonl` for an open run for this project: a `run-started` line with `"project":"<project>"` and no later `run-finished` line for the same `workflow` and `project`. If there is no open run, or the user asked to start, run, continue or resume a process or workflow rather than this one step, do not continue here: invoke the `workflow` skill with the workflow the user asked for, or `accounting` when they named none, followed by `<project>`. It runs this phase in order, asks before it writes and records the run. Continue here when the user named this skill, or when an open run exists (the conductor is running you).

Run this skill's gate before writing: `sh <this skill's folder>/scripts/gate.sh <project> <project root>`, where `<project root>` is the folder that contains `.singularskills/` (use `.` when you are already there). If it exits non-zero, stop and tell the user what it printed, unless `--skip-checks` was given (see Arguments). On a refusal, before you stop, append this line to `.singularskills/log.jsonl` (create the folder and file if missing): `{"ts":"<ISO timestamp>","skill":"accounting-journal","workflow":"accounting","phase":2,"project":"<project>","event":"refused","artifact":"02-journal.md","note":"<what the gate printed>"}`. Once the gate has passed, or under `--skip-checks` once you have appended the `skipped` line, append this line before you start work: `{"ts":"<ISO timestamp>","skill":"accounting-journal","workflow":"accounting","phase":2,"project":"<project>","event":"started","artifact":"02-journal.md","note":""}`.

Read `.singularskills/accounting/<project>/01-analyze.md` for the transaction register and chart of accounts.

## Process

1. **Review the transaction register:**
   - Load the analysis artifact from Phase 1
   - Confirm all transactions are accounted for
   - Resolve any flagged items before journalizing

2. **Create journal entries:**
   - For each transaction, record:
     - **Date** — when the transaction occurred
     - **Accounts** — debit account(s) and credit account(s)
     - **Amounts** — debit and credit amounts (must be equal)
     - **Description** — brief explanation of the transaction
   - Number entries sequentially (JE-001, JE-002, etc.)

3. **Validate entries:**
   - Every entry must have at least one debit and one credit
   - Total debits must equal total credits for each entry
   - Verify account names match the chart of accounts
   - Flag compound entries (more than two accounts) with clear explanations

4. **Write the artifact** to `.singularskills/accounting/<project>/02-journal.md` with sections:
   - **General Journal** — all entries in chronological order with debit/credit columns
   - **Entry Summary** — count of entries by type (revenue, expense, asset, liability)
   - **Validation** — confirmation that all entries balance

## Output

The journal written to `.singularskills/accounting/<project>/02-journal.md`. Present a summary highlighting:
- Total number of journal entries
- Total debits and credits (should match)
- Any compound or noteworthy entries

**Record the run.** After you have written the artifact, append this line to `.singularskills/log.jsonl` (the `started` line of Prerequisites, with `"event":"finished"`): `{"ts":"<ISO timestamp>","skill":"accounting-journal","workflow":"accounting","phase":2,"project":"<project>","event":"finished","artifact":"02-journal.md","note":""}`.

Open the artifact with this frontmatter (`agent` is the agent you run in, or `unknown`; `gate` is `passed` when the gate ran clean and `skipped` under `--skip-checks`):

```yaml
---
skill: accounting-journal
workflow: accounting
phase: 2
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

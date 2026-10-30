---
name: accounting-analyze
description: Analyze a period's source documents — invoices, receipts, bank statements, payroll — into an entity profile, chart of accounts and a transaction register showing the accounts each one affects. Use when the user wants to close the books for a period starting from the transactions and source documents. Not for logging day-to-day transactions as they happen; see /bookkeeping-record.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: accounting
  phase: 1
  artifact: 01-analyze.md
---

# Analyze

Analyze financial transactions for "$ARGUMENTS". Review source documents, identify events with financial impact, and determine which accounts are affected.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"accounting-analyze","workflow":"accounting","phase":1,"project":"<project>","event":"skipped","artifact":"01-analyze.md","note":"<reason or \"none given\">"}`.

**Compute with code.** Perform every calculation (totals, balances, ratios, variances, projections) with a script — Bash, Python or a spreadsheet formula written to a file — and include the computation alongside the result. Never do arithmetic mentally.

## Prerequisites

**Part of a workflow.** This skill is phase 1 (Analyze) of the Accounting Cycle workflow (`accounting`); cross-domain workflows run it too. Unless the user named this skill, check `.singularskills/log.jsonl` for an open run for this project: a `run-started` line with `"project":"<project>"` and no later `run-finished` line for the same `workflow` and `project`. If there is no open run, or the user asked to start, run, continue or resume a process or workflow rather than this one step, do not continue here: invoke the `workflow` skill with the workflow the user asked for, or `accounting` when they named none, followed by `<project>`. It runs this phase in order, asks before it writes and records the run. Continue here when the user named this skill, or when an open run exists (the conductor is running you).

Before you start work, append this line to `.singularskills/log.jsonl` (create the folder and file if missing): `{"ts":"<ISO timestamp>","skill":"accounting-analyze","workflow":"accounting","phase":1,"project":"<project>","event":"started","artifact":"01-analyze.md","note":""}`.

None — this is the first phase.

## Process

1. **Gather source documents:**
   - What type of entity is this? (sole proprietorship, LLC, corporation, nonprofit)
   - What accounting period are we covering?
   - Collect invoices, receipts, bank statements, contracts, and payroll records
   - Identify the chart of accounts in use (or create one)

2. **Classify transactions:**
   - For each document, determine the transaction date and amount
   - Identify which accounts are affected (assets, liabilities, equity, revenue, expenses)
   - Determine whether each account increases or decreases
   - Flag any unusual or complex transactions requiring further review

3. **Assess accounting basis:**
   - Is the entity using cash basis or accrual basis?
   - Are there any special recognition rules (percentage-of-completion, subscription revenue, etc.)?
   - Note any multi-currency or intercompany considerations

4. **Write the artifact** to `.singularskills/accounting/<project>/01-analyze.md` with sections:
   - **Entity Profile** — type, size, industry, accounting basis
   - **Chart of Accounts** — account categories and numbering
   - **Transaction Register** — chronological list of transactions with accounts affected
   - **Flags & Notes** — unusual items, open questions, items needing further documentation

## Output

The analysis written to `.singularskills/accounting/<project>/01-analyze.md`. Present a summary highlighting:
- Number of transactions identified
- Account categories involved
- Any flagged items requiring attention

**Record the run.** After you have written the artifact, append this line to `.singularskills/log.jsonl` (the `started` line of Prerequisites, with `"event":"finished"`): `{"ts":"<ISO timestamp>","skill":"accounting-analyze","workflow":"accounting","phase":1,"project":"<project>","event":"finished","artifact":"01-analyze.md","note":""}`.

Open the artifact with this frontmatter (`agent` is the agent you run in, or `unknown`; `gate` is `none`, as this phase has no gate):

```yaml
---
skill: accounting-analyze
workflow: accounting
phase: 1
project: <project>
started: <ISO timestamp>
finished: <ISO timestamp>
agent: <the agent you run in, or "unknown">
gate: none
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

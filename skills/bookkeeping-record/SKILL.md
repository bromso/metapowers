---
name: bookkeeping-record
description: Capture a period's financial transactions into a dated log with amount, counterparty, payment method and source document, flagging missing receipts and unusual items. Use when the user has receipts, invoices or bank lines for a month or quarter and wants them logged in one place. Not for starting a period-end double-entry close; see /accounting-analyze.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: bookkeeping
  phase: 1
  artifact: 01-record.md
---

# Record

Capture and log all financial transactions for "$ARGUMENTS". Document each transaction with date, amount, parties, description, and source document reference.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"bookkeeping-record","workflow":"bookkeeping","phase":1,"project":"<project>","event":"skipped","artifact":"01-record.md","note":"<reason or \"none given\">"}`.

**Compute with code.** Perform every calculation (totals, balances, ratios, variances, projections) with a script — Bash, Python or a spreadsheet formula written to a file — and include the computation alongside the result. Never do arithmetic mentally.

## Prerequisites

**Part of a workflow.** This skill is phase 1 (Record) of the Bookkeeping Cycle workflow (`bookkeeping`); cross-domain workflows run it too. First check `.singularskills/log.jsonl` for an open run for this project: a `run-started` line with `"project":"<project>"` and no later `run-finished` line for the same `workflow` and `project`. If one exists, the conductor is running you: continue here. Otherwise, if the user asked to start, run, continue or resume a process or workflow rather than this one step, do not continue here: invoke the `workflow` skill with the workflow the user asked for, or `bookkeeping` when they named none, followed by `<project>`; it runs this phase in order, asks before it writes and records the run. Otherwise, unless the user named this skill, ask one question, since this is the first phase of its workflow: "Just this step, or the whole Bookkeeping Cycle workflow?" End your turn and wait; on the whole workflow, hand off the same way; on just this step, continue here.

Before you start work, append this line to `.singularskills/log.jsonl` (create the folder and file if missing): `{"ts":"<ISO timestamp>","skill":"bookkeeping-record","workflow":"bookkeeping","phase":1,"project":"<project>","event":"started","artifact":"01-record.md","note":""}`.

None — this is the first phase.

## Process

1. **Identify transaction sources:**
   - What accounts are active? (bank, credit card, cash, digital payments)
   - What period are we recording? (month, quarter, year)
   - What source documents are available? (receipts, invoices, bank feeds, contracts)

2. **Capture each transaction:**
   - **Date** — when the transaction occurred
   - **Amount** — exact figure with currency
   - **Direction** — inflow (revenue, loan) or outflow (expense, payment)
   - **Counterparty** — who paid or was paid
   - **Description** — what the transaction was for
   - **Source** — receipt number, invoice ID, or bank reference
   - **Payment method** — bank transfer, card, cash, etc.

3. **Organize the transaction log:**
   - Sort chronologically
   - Flag any transactions missing source documents
   - Note any unusual or large transactions for review
   - Identify recurring transactions (subscriptions, rent, payroll)

4. **Write the artifact** to `.singularskills/bookkeeping/<project>/01-record.md` with sections:
   - **Period** — date range covered
   - **Transaction Log** — table of all transactions
   - **Missing Documents** — transactions without source references
   - **Flags** — unusual items requiring review

## Output

The transaction log written to `.singularskills/bookkeeping/<project>/01-record.md`. Present a summary highlighting:
- Total transactions recorded
- Total inflows and outflows
- Any missing documents or flagged items

**Record the run.** After you have written the artifact, append this line to `.singularskills/log.jsonl` (the `started` line of Prerequisites, with `"event":"finished"`): `{"ts":"<ISO timestamp>","skill":"bookkeeping-record","workflow":"bookkeeping","phase":1,"project":"<project>","event":"finished","artifact":"01-record.md","note":""}`.

Open the artifact with this frontmatter (`agent` is the agent you run in, or `unknown`; `gate` is `none`, as this phase has no gate):

```yaml
---
skill: bookkeeping-record
workflow: bookkeeping
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

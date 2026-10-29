---
name: bookkeeping-categorize
description: Assign each recorded transaction a debit and credit account from the chart of accounts, flagging ambiguous items and checking debits equal credits. Use when the user has logged transactions and wants them sorted into the right accounts and expense categories. Not for formal numbered journal entries in a period-end close; see /accounting-journal.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: bookkeeping
  phase: 2
  artifact: 02-categorize.md
---

# Categorize

Assign each recorded transaction for "$ARGUMENTS" to the correct account in the chart of accounts. Apply double-entry bookkeeping so every debit has a matching credit.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"<skill name>","workflow":"bookkeeping","phase":<phase>,"project":"<project>","event":"skipped","artifact":"<artifact file>","note":"<reason or \"none given\">"}`.

**Compute with code.** Perform every calculation (totals, balances, ratios, variances, projections) with a script — Bash, Python or a spreadsheet formula written to a file — and include the computation alongside the result. Never do arithmetic mentally.

## Prerequisites

Run `scripts/gate.sh <project>` from this skill's folder. If it exits non-zero, stop and tell the user what it printed (unless `--skip-checks`, see Arguments).

Read `.singularskills/bookkeeping/<project>/01-record.md` for the transaction log.

## Process

1. **Load the chart of accounts:**
   - Check if a custom chart exists at `.singularskills/bookkeeping/<project>/chart-of-accounts.md`
   - If not, reference the shared template at `references/chart-of-accounts-template.md`
   - Confirm account categories cover all transaction types

2. **Categorize each transaction:**
   - For every transaction in the record log, assign:
     - **Debit account** — the account being increased (assets, expenses) or decreased (liabilities, equity, revenue)
     - **Credit account** — the matching entry
     - **Category** — high-level grouping (revenue, COGS, operating expense, asset, liability)
   - Apply consistent rules for similar transactions
   - Flag ambiguous transactions for user confirmation

3. **Validate double-entry:**
   - Ensure total debits equal total credits
   - Check that no transaction is missing an account assignment
   - Verify account numbers match the chart of accounts

4. **Write the artifact** to `.singularskills/bookkeeping/<project>/02-categorize.md` with sections:
   - **Journal Entries** — table with date, description, debit account, credit account, amount
   - **Account Summary** — totals per account
   - **Ambiguous Items** — transactions needing user review
   - **Validation** — debit/credit balance confirmation

## Output

The categorized journal written to `.singularskills/bookkeeping/<project>/02-categorize.md`. Present a summary highlighting:
- Total journal entries created
- Top expense and revenue categories
- Any ambiguous items requiring decision

**Record the run.** Open the artifact with this frontmatter (`agent` is the agent you run in, or `unknown`; `gate` is `passed` when the gate ran clean and `skipped` under `--skip-checks`):

```yaml
---
skill: bookkeeping-categorize
workflow: bookkeeping
phase: 2
project: <project>
started: <ISO timestamp>
finished: <ISO timestamp>
agent: <the agent you run in, or "unknown">
gate: <passed|skipped>
---
```

End the artifact (or your section of a shared artifact) with `## Decisions` and `## Open questions`, in this shape:

```markdown
## Decisions
- <what was chosen> — <why> — <what was rejected>

## Open questions
- <what the next phase or a reviewer must settle>
```

End the artifact with this paragraph, verbatim:

> **Not financial or tax advice.** This artifact is generated analysis for review by a qualified accountant or financial professional before any filing, reporting or decision relies on it.

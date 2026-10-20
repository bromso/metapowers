---
name: journal
description: Record numbered double-entry journal entries from the analyzed transaction register, each with balanced debits and credits. Use when the user has a transaction register for a period and asks to journalize it or book the transactions. Not for sorting everyday bank lines into accounts, or posting entries to ledger accounts; see /bookkeeping:categorize or /accounting:ledger.
argument-hint: "[project] [--skip-checks]"
---

# Journal

Record journal entries for "$ARGUMENTS". Convert analyzed transactions into formal double-entry journal entries with equal debits and credits.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.metapowers/accounting/<project>/skip-log.md`: `- <ISO timestamp> — <skill name> skipped prerequisite check for <artifact file> — reason: <reason or "none given">`.

## Prerequisites

Read `.metapowers/accounting/<project>/01-analyze.md` for the transaction register and chart of accounts.

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

4. **Write the artifact** to `.metapowers/accounting/<project>/02-journal.md` with sections:
   - **General Journal** — all entries in chronological order with debit/credit columns
   - **Entry Summary** — count of entries by type (revenue, expense, asset, liability)
   - **Validation** — confirmation that all entries balance

## Output

The journal written to `.metapowers/accounting/<project>/02-journal.md`. Present a summary highlighting:
- Total number of journal entries
- Total debits and credits (should match)
- Any compound or noteworthy entries

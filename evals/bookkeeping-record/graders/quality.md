---
type: llm
weight: 1
focus:
  source: file
  path: .singularskills/bookkeeping/harbor-cafe/01-record.md
---

Judge the file `.singularskills/bookkeeping/harbor-cafe/01-record.md` against the request in the prompt. PASS only if every criterion holds; otherwise FAIL and name the criteria that failed.

1. It has sections for Period, Transaction Log, Missing Documents and Flags (headings may differ slightly in wording).
2. The period is September 2026.
3. The transaction log is a table with all 10 bank lines, each with date, amount, counterparty, payment method and source reference.
4. Missing Documents lists the lines that have no receipt or invoice reference in the CSV.
5. Flags call out the unusually large equipment payment or the unidentified transfer.
6. Total inflows, total outflows and the net are given, and the artifact shows how they were computed (a script, command or formula).
7. It ends with the verbatim disclaimer paragraph beginning **Not financial or tax advice.**

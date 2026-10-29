---
type: llm
weight: 1
focus: last_message
---

Judge Claude's final reply against the request in the prompt. The workspace was seeded with exactly three files and nothing else: `.singularskills/design/btn/01-empathize.md`, `.singularskills/design/btn/02-define.md` and `.singularskills/security/acme/00-govern.md`. Design has five phases (01-empathize to 05-test) and security has six (00-govern to 05-recover). Saying that other domains have no saved work is correct; it is not invention. A "last updated" value of "unknown" is acceptable, because the run cannot read file dates. PASS only if every criterion holds; otherwise FAIL and name the criteria that failed.

1. It reports the design project `btn` as in progress, with two of its five phases done (01-empathize and 02-define).
2. It reports the security project `acme` as in progress, with only the 00-govern phase done.
3. It presents the projects in a table (domain, project, progress, last updated, or similar).
4. It does not claim any project exists other than `btn` and `acme`.
5. It points out what comes next, or what is missing, for at least one project (for example 03-ideate for btn).

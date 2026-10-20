---
type: llm
weight: 1
focus: last_message
---

Judge Claude's final reply against the request in the prompt. PASS only if every criterion holds; otherwise FAIL and name the criteria that failed.

1. It reports the design project `btn` with two phases done (01-empathize and 02-define) out of five, so it is in progress.
2. It reports the security project `acme` with only the 00-govern phase done, so it is in progress.
3. It presents the projects in a table (domain, project, progress, last updated or similar).
4. It does not invent projects or domains that are not in the seeded `.metapowers/` folder.
5. It points out what comes next or what is missing for at least one project (for example 03-ideate for btn).

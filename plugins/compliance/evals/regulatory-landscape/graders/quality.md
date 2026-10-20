---
type: llm
weight: 1
focus:
  source: file
  path: .metapowers/compliance/clinicnote/00-scope.md
---

Judge the file `.metapowers/compliance/clinicnote/00-scope.md` against the request in the prompt. PASS only if every criterion holds; otherwise FAIL and name the criteria that failed.

1. It has Jurisdiction Map, Data Type Inventory, Industry Requirements, Regulation Inventory Table and Cross-Border Considerations parts (headings may differ slightly in wording).
2. It covers GDPR, including health data as a special category.
3. It addresses the California customers (for example CCPA/CPRA or HIPAA applicability) rather than ignoring them.
4. It covers card payments (PCI DSS) and the ISO 27001 customer demand.
5. The regulation inventory is a table that says, per regulation, whether it is mandatory or customer-driven.
6. It ends with the verbatim disclaimer paragraph beginning **Not legal or audit advice.**

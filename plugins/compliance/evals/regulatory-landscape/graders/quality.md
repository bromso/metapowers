---
type: llm
weight: 1
focus:
  source: file
  path: .metapowers/compliance/clinicnote/00-scope.md
---

Judge the file `.metapowers/compliance/clinicnote/00-scope.md` against the request in the prompt. A separate grader checks the section headings and the closing disclaimer, so ignore them here. The file is long: look for each criterion in the relevant section, and judge the content, not the exact wording. PASS only if every criterion holds; otherwise FAIL and name the criteria that failed.

1. It covers GDPR, including health data as special-category data (GDPR Art. 9; either wording counts).
2. It addresses the California customers (for example CCPA/CPRA, CMIA or HIPAA applicability) rather than ignoring them.
3. It covers card payments (PCI DSS) and the ISO 27001 customer demand.
4. The regulation inventory is a table that says, per regulation, whether it is mandatory or customer-driven (any equivalent status labels count).

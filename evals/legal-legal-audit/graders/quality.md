---
type: llm
weight: 1
focus:
  source: file
  path: .singularskills/legal/brightcart/00-assess.md
---

Judge the file `.singularskills/legal/brightcart/00-assess.md` against the request in the prompt. PASS only if every criterion holds; otherwise FAIL and name the criteria that failed.

1. It has Document Inventory, Standards Comparison, Gap Analysis, Severity Matrix and Remediation Priorities parts (headings may differ slightly in wording).
2. The inventory lists the documents from the request (2021 terms, 2022 template privacy policy, 9 of 12 employment contracts, expired supplier agreement).
3. Gaps include the missing data processing agreements, the missing withdrawal/returns information required for EU consumer sales, and the missing cookie policy.
4. Gaps are ranked by severity (Critical/High/Medium/Low) with the expired supplier agreement and missing DPAs rated High or Critical.
5. Remediation priorities are ordered and carry effort estimates.

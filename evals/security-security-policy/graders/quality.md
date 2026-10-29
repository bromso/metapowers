---
type: llm
weight: 1
focus:
  source: file
  path: .singularskills/security/invoicing-api/00-govern.md
---

Judge the file `.singularskills/security/invoicing-api/00-govern.md` against the request in the prompt. Separate graders check the headings, the disclaimer, the NIST CSF functions and the prompt's facts, so ignore those here. The file is long: look for each criterion in the relevant section. FAIL a criterion only if its content is missing or wrong, not for wording, ordering or extra material. PASS only if both criteria hold; otherwise FAIL and name the criterion that failed.

1. The policy inventory covers information security, acceptable use, data protection, access control, incident response and business continuity, each with an owner and a review date. Extra policies are fine.
2. The policies are written for this company: a 40-person remote team on Google Workspace and AWS that handles invoice data with names, addresses and bank details. They are not generic boilerplate.

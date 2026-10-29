---
type: llm
weight: 1
focus:
  source: file
  path: .metapowers/compliance/clinicnote/00-scope.md
---

Judge the file `.metapowers/compliance/clinicnote/00-scope.md` against the request in the prompt. Separate graders check the headings, the disclaimer and that GDPR, Art. 9, California/US law, PCI DSS and ISO 27001 are named, so ignore those here. The file is long: look for each criterion in the relevant section. FAIL a criterion only if its content is missing or wrong, not for wording, ordering or extra material. PASS only if both criteria hold; otherwise FAIL and name the criterion that failed.

1. The regulation inventory is a table that says, per regulation, whether it is mandatory or customer-driven. Equivalent status labels count.
2. It reasons about which rules apply to ClinicNote's actual situation: health data, Swedish and German clinics, two new California customers, card payments through a provider, and a hospital asking for ISO 27001. It does not just list regulations.

---
type: regex
weight: 1
pattern: '^(?=[\s\S]*GDPR)(?=[\s\S]*(?:Art(?:icle)?\.? ?9|special.categor))(?=[\s\S]*(?:CCPA|CPRA|CMIA|HIPAA))(?=[\s\S]*\bPCI DSS\b)(?=[\s\S]*27001)(?=[\s\S]*mandatory)(?=[\s\S]*(?:customer[- ]driven|contractual|voluntary))'
flags: i
match: contains
target:
  source: file
  path: .metapowers/compliance/clinicnote/00-scope.md
---

The artifact names the regulations the prompt's facts call for: GDPR with Art. 9 / special-category health data, a California or US health-privacy law, PCI DSS and ISO 27001. It also uses mandatory and customer-driven (or equivalent) labels. A regex checks these because the LLM judge is unreliable on facts buried in a long artifact.

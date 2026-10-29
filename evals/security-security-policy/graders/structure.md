---
type: regex
weight: 1
pattern: '^(?=[\s\S]*^#+[^\n]*(?:inventory))(?=[\s\S]*^#+[^\n]*(?:individual polic))(?=[\s\S]*^#+[^\n]*(?:alignment))(?=[\s\S]*^#+[^\n]*(?:review))(?=[\s\S]*^#+[^\n]*(?:exception))(?=[\s\S]*\*\*Not a penetration test or audit\.\*\*[^\n]*\s*(?![\s\S]))'
flags: im
match: contains
target:
  source: file
  path: .singularskills/security/invoicing-api/00-govern.md
---

The artifact has Policy Inventory, Individual Policies, Framework Alignment, Review Schedule and Exception Process headings, and ends with the security disclaimer paragraph. A regex checks this because the artifact is long and the LLM judge is unreliable on structure.

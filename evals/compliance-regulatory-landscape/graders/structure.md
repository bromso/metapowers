---
type: regex
weight: 1
pattern: '^(?=[\s\S]*^#+[^\n]*(?:jurisdiction))(?=[\s\S]*^#+[^\n]*(?:data type|data inventory))(?=[\s\S]*^#+[^\n]*(?:industry))(?=[\s\S]*^#+[^\n]*(?:regulation))(?=[\s\S]*^#+[^\n]*(?:cross[- ]border))(?=[\s\S]*\*\*Not legal or audit advice\.\*\*[^\n]*\s*(?![\s\S]))'
flags: im
match: contains
target:
  source: file
  path: .metapowers/compliance/clinicnote/00-scope.md
---

The artifact has Jurisdiction Map, Data Type Inventory, Industry Requirements, Regulation Inventory Table and Cross-Border Considerations headings, and ends with the compliance disclaimer paragraph. A regex checks this because the artifact is long and the LLM judge is unreliable on structure.

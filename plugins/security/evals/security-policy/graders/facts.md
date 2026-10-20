---
type: regex
weight: 1
pattern: '^(?=[\s\S]*NIST)(?=[\s\S]*(?:Govern|GV\.))(?=[\s\S]*(?:Identify|ID\.))(?=[\s\S]*(?:Protect|PR\.))(?=[\s\S]*(?:Detect|DE\.))(?=[\s\S]*(?:Respond|RS\.))(?=[\s\S]*(?:Recover|RC\.))(?=[\s\S]*bank (?:account|detail))(?=[\s\S]*\b(?:must|shall)\b)(?=[\s\S]*Google Workspace)(?=[\s\S]*AWS)'
flags: i
match: contains
target:
  source: file
  path: .metapowers/security/invoicing-api/00-govern.md
---

The artifact uses the prompt's facts and the mandatory framing: NIST with all six CSF functions, bank details, must/shall language, Google Workspace and AWS. A regex checks these because the LLM judge is unreliable on facts buried in a long artifact.

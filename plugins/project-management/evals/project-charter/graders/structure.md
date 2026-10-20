---
type: regex
weight: 1
pattern: '^(?=[\s\S]*^#+[^\n]*(?:vision))(?=[\s\S]*^#+[^\n]*(?:objective))(?=[\s\S]*^#+[^\n]*(?:scope))(?=[\s\S]*^#+[^\n]*(?:constraint))(?=[\s\S]*^#+[^\n]*(?:milestone))(?=[\s\S]*^#+[^\n]*(?:risk))'
flags: im
match: contains
target:
  source: file
  path: .metapowers/project-management/portal-relaunch/00-initiate.md
---

The artifact has Vision, Objectives, Scope, Constraints & Assumptions, Milestones and Initial Risks headings. A regex checks this because the artifact is long and the LLM judge is unreliable on structure.

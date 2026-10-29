---
type: regex
weight: 1
pattern: '^(?=[\s\S]*^#+[^\n]*(?:source))(?=[\s\S]*^#+[^\n]*(?:stakeholder))(?=[\s\S]*^#+[^\n]*(?:market|competitive|landscape))(?=[\s\S]*^#+[^\n]*(?:theme))(?=[\s\S]*^#+[^\n]*(?:surprise|contradiction))(?=[\s\S]*^#+[^\n]*(?:open question))'
flags: im
match: contains
target:
  source: file
  path: .singularskills/research/four-day-week/01-discover.md
---

The artifact has Sources, User & Stakeholder Insights, Market & Competitive Landscape, Key Themes, Surprises & Contradictions and Open Questions headings. A regex checks this because the artifact is long and the LLM judge is unreliable on structure.

---
type: regex
weight: 1
pattern: '^(?=[\s\S]*(?:Iceland|4 Day Week Global|UK (?:four-day|4-day|pilot|trial)))(?=[\s\S]*100[-:]80[-:]100)(?=[\s\S]*compress)(?=[\s\S]*manager)(?=[\s\S]*customer)(?=[\s\S]*200)'
flags: i
match: contains
target:
  source: file
  path: .metapowers/research/four-day-week/01-discover.md
---

The artifact names a known trial (Iceland, 4 Day Week Global or the UK pilot) and covers the 100-80-100 and compressed-hours setups. It mentions managers and customers as stakeholders and refers to the company's 200-person size. A regex checks these because the LLM judge is unreliable on facts buried in a long artifact.

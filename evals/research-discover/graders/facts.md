---
type: regex
weight: 1
pattern: '^(?=[\s\S]*(?:Iceland|4 Day Week Global|UK (?:four-day|4-day|pilot|trial)))(?=[\s\S]*100[-:]80[-:]100)(?=[\s\S]*compress)(?=[\s\S]*\b200[- ](?:person|people|employee|staff))(?=[\s\S]*(?:interview|survey))(?=[\s\S]*leadership)'
flags: i
match: contains
target:
  source: file
  path: .metapowers/research/four-day-week/01-discover.md
---

The artifact covers the prompt's facts:
- a known trial (Iceland, 4 Day Week Global or the UK pilot);
- the 100-80-100 and compressed-hours setups;
- the company's 200-person size;
- the leadership team that asked;
- the interviews or surveys planned as next research.

A regex checks these because the LLM judge is unreliable on facts buried in a long artifact.

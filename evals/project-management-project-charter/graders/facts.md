---
type: regex
weight: 1
pattern: '^(?=[\s\S]*180(?:[ ,.]?000|\s?k))(?=[\s\S]*squad)(?=[\s\S]*(?:30 Apr(?:il)?\.? 2027|2027-04-30))(?=[\s\S]*60 ?%)(?=[\s\S]*invoice)(?=[\s\S]*address)(?=[\s\S]*2FA)(?=[\s\S]*mobile)(?=[\s\S]*chat ?bot)'
flags: i
match: contains
target:
  source: file
  path: .singularskills/project-management/portal-relaunch/00-initiate.md
---

The artifact carries the prompt's facts: the 180k EUR budget, the squad, the 30 April 2027 hosting deadline, the 60% ticket share, the three self-service journeys, and mobile apps and the chat bot. A regex checks these because the LLM judge is unreliable on facts buried in a long artifact.

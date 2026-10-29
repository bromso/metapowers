---
type: regex
weight: 1
pattern: '"event"\s*:\s*"run-started"'
flags: m
match: contains
target:
  source: file
  path: .singularskills/log.jsonl
---

The conductor appended a `run-started` line to `.singularskills/log.jsonl` before running phase 1. A regex checks this because only the file can show it.

---
skill: marketing-convert
workflow: marketing
phase: 3
project: checkout
started: 2026-10-01T09:00:00Z
finished: 2026-10-01T10:00:00Z
agent: fixture
gate: passed
---

# Convert

## A/B Test: One-page checkout

- **Hypothesis:** a one-page checkout raises checkout conversion because it removes two steps.
- **Variants:** control (three-step checkout), treatment (one-page checkout).
- **Split:** 50/50, randomised per user.
- **Primary metric:** checkout conversion (orders ÷ users who reached checkout).
- **Guardrails:** refund rate within 14 days; support contacts about payment.
- **Sample size:** 40,000 users per arm (detects a 0.6-point lift from 9.0% at 80% power).
- **Duration:** 14 days, fixed horizon; no early stopping.
- **Decision rule:** ship if the primary metric improves at p < 0.05 and no guardrail worsens.

## Decisions
- Fixed-horizon test, 14 days — fixture — none

## Open questions
- none

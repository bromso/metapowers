---
name: marketing-churn-prevention
description: Identify churn warning signals and the reasons customers leave, then design interventions, a cancellation flow with save offers and win-back campaigns. Use when paying customers are cancelling or downgrading and the user wants to keep more of them. Not for users who never activate after signup; see /marketing-onboarding-cro.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: marketing
  phase: 4
  artifact: 04-engage.md
---

# Churn Prevention

Analyze and reduce churn for "$ARGUMENTS". Identify churn signals, design interventions, and build retention strategies.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"<skill name>","workflow":"marketing","phase":<phase>,"project":"<project>","event":"skipped","artifact":"<artifact file>","note":"<reason or \"none given\">"}`.

## Prerequisites

Run `scripts/gate.sh <project>` from this skill's folder. If it exits non-zero, stop and tell the user what it printed (unless `--skip-checks`, see Arguments).

Read `.singularskills/marketing/<project>/00-strategy.md`. If this file does not exist, tell the user:

> Phase 0 (Strategy) has not been completed for "<project>". Run `/marketing-customer-research <project>` first, or use `--skip-checks` to bypass.

## Process

1. **Read context:**
   - Read `.singularskills/marketing/<project>/00-strategy.md` for audience and product context
   - Read `.singularskills/marketing/<project>/04-engage.md` if it exists

2. **Identify churn signals:**
   - Usage decline patterns (login frequency, feature usage drop)
   - Support ticket patterns that precede churn
   - Billing signals (failed payments, downgrade inquiries)
   - Engagement signals (email opens dropping, NPS decline)

3. **Analyze churn reasons:**
   - Use WebSearch to find common churn reasons in the category
   - Map reasons to: product gaps, pricing issues, poor onboarding, competitive switching, need ended
   - Which reasons are preventable vs. natural?

4. **Design interventions:**
   - Early warning system: automated alerts on churn signals
   - Re-engagement campaigns: email, in-app, personal outreach
   - Cancellation flow optimization: save offers, feedback collection, easy pause option
   - Win-back campaigns: timing, messaging, incentives
   - Product improvements that address top churn reasons

5. **Write the artifact** — append to `.singularskills/marketing/<project>/04-engage.md` under a `## Churn Prevention` section. Create the file with a `# Engage — <project>` heading if it does not exist; if a `## Churn Prevention` section already exists, replace only that section. The section contains:
   - **Churn Signals** — early warning indicators to monitor
   - **Churn Reasons Analysis** — categorized and prioritized
   - **Intervention Playbook** — action per signal/reason
   - **Cancellation Flow Design** — save offers and feedback
   - **Win-Back Campaign** — timing and messaging
   - **Retention Metrics** — what to track

## Output

Churn prevention strategy appended to `.singularskills/marketing/<project>/04-engage.md`. Present a summary highlighting:
- Top 3 churn signals to monitor
- Most impactful intervention
- Recommended cancellation flow changes

**Record the run.** This artifact is shared by every skill of phase 4 (Engage). The frontmatter is written once, by whoever creates the file: if you create it, open it with the block below (`skill` is the phase title, `started` the time of that first write; `gate` is `passed` when the gate ran clean and `skipped` under `--skip-checks`); if it already exists, leave the block alone except to update `finished` and to set `gate` to the worst value among the sections (`skipped` over `passed`).

```yaml
---
skill: Engage
workflow: marketing
phase: 4
project: <project>
started: <ISO timestamp>
finished: <ISO timestamp>
agent: <the agent you run in, or "unknown">
gate: <passed|skipped>
---
```

Open your `## Churn Prevention` section with one italic line, `*<skill name> · <ISO timestamp> · gate: <passed|skipped>*` (your skill name is `marketing-churn-prevention`).

End your section with `### Decisions` and `### Open questions` (one level under your `## Churn Prevention` heading, so the section stays one block), in this shape:

```markdown
### Decisions
- <what was chosen> — <why> — <what was rejected>

### Open questions
- <what the next phase or a reviewer must settle>
```

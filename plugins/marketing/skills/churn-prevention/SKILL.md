---
description: Identify and reduce churn with targeted interventions
---

# Churn Prevention

Analyze and reduce churn for "$ARGUMENTS". Identify churn signals, design interventions, and build retention strategies.

## Prerequisites

Read `.metapowers/marketing/$ARGUMENTS/00-strategy.md`. If this file does not exist, tell the user:

> Phase 0 (Strategy) has not been completed for "$ARGUMENTS". Run `/marketing:customer-research $ARGUMENTS` first, or use `--skip-checks` to bypass.

If `--skip-checks` is present in $ARGUMENTS, skip this check and log to `.metapowers/marketing/$ARGUMENTS/skip-log.md`.

## Process

1. **Read context:**
   - Read `.metapowers/marketing/$ARGUMENTS/00-strategy.md` for audience and product context
   - Read `.metapowers/marketing/$ARGUMENTS/04-engage.md` if it exists

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

5. **Write the artifact** — append to `.metapowers/marketing/$ARGUMENTS/04-engage.md` under a `## Churn Prevention` section:
   - **Churn Signals** — early warning indicators to monitor
   - **Churn Reasons Analysis** — categorized and prioritized
   - **Intervention Playbook** — action per signal/reason
   - **Cancellation Flow Design** — save offers and feedback
   - **Win-Back Campaign** — timing and messaging
   - **Retention Metrics** — what to track

## Output

Churn prevention strategy written to `.metapowers/marketing/$ARGUMENTS/04-engage.md`. Present a summary highlighting:
- Top 3 churn signals to monitor
- Most impactful intervention
- Recommended cancellation flow changes

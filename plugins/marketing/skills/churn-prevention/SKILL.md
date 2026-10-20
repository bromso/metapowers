---
name: churn-prevention
description: Identify churn warning signals and the reasons customers leave, then design interventions, a cancellation flow with save offers and win-back campaigns. Use when paying customers are cancelling or downgrading and the user wants to keep more of them. Not for users who never activate after signup; see /marketing:onboarding-cro.
argument-hint: "[project] [--skip-checks]"
---

# Churn Prevention

Analyze and reduce churn for "$ARGUMENTS". Identify churn signals, design interventions, and build retention strategies.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.metapowers/marketing/<project>/skip-log.md`: `- <ISO timestamp> — <skill name> skipped prerequisite check for <artifact file> — reason: <reason or "none given">`.

## Prerequisites

Read `.metapowers/marketing/<project>/00-strategy.md`. If this file does not exist, tell the user:

> Phase 0 (Strategy) has not been completed for "<project>". Run `/marketing:customer-research <project>` first, or use `--skip-checks` to bypass.

## Process

1. **Read context:**
   - Read `.metapowers/marketing/<project>/00-strategy.md` for audience and product context
   - Read `.metapowers/marketing/<project>/04-engage.md` if it exists

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

5. **Write the artifact** — append to `.metapowers/marketing/<project>/04-engage.md` under a `## Churn Prevention` section. Create the file with a `# Engage — <project>` heading if it does not exist; if a `## Churn Prevention` section already exists, replace only that section. The section contains:
   - **Churn Signals** — early warning indicators to monitor
   - **Churn Reasons Analysis** — categorized and prioritized
   - **Intervention Playbook** — action per signal/reason
   - **Cancellation Flow Design** — save offers and feedback
   - **Win-Back Campaign** — timing and messaging
   - **Retention Metrics** — what to track

## Output

Churn prevention strategy appended to `.metapowers/marketing/<project>/04-engage.md`. Present a summary highlighting:
- Top 3 churn signals to monitor
- Most impactful intervention
- Recommended cancellation flow changes

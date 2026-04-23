---
description: Design referral and advocacy programs
---

# Referral Program

Design a referral program for "$ARGUMENTS". Create incentive structures, mechanics, and promotion strategies that turn customers into advocates.

## Prerequisites

Read `.marketing/$ARGUMENTS/00-strategy.md`. If this file does not exist, tell the user:

> Phase 0 (Strategy) has not been completed for "$ARGUMENTS". Run `/marketing:customer-research $ARGUMENTS` first, or use `--skip-checks` to bypass.

If `--skip-checks` is present in $ARGUMENTS, skip this check and log to `.marketing/$ARGUMENTS/skip-log.md`.

## Process

1. **Read context:**
   - Read `.marketing/$ARGUMENTS/00-strategy.md` for audience and product context
   - Read `.marketing/$ARGUMENTS/04-engage.md` if it exists

2. **Research referral models:**
   - Use WebSearch to find successful referral programs in the category
   - Analyze: single-sided vs. double-sided rewards, monetary vs. product-based incentives
   - What motivates users to refer? (savings, status, genuine value sharing)

3. **Design the program:**
   - Incentive structure: what does the referrer get? What does the referred get?
   - Reward type: credits, discounts, cash, extended features, swag
   - Qualification: what counts as a successful referral? (signup, activation, payment)
   - Limits: per-user caps, time limits, anti-fraud measures

4. **Mechanics and UX:**
   - Sharing mechanism: unique link, email invite, social share, in-product invite
   - Tracking and attribution
   - Where to promote the program (in-app, email, website, social)
   - Referral dashboard for users

5. **Write the artifact** — append to `.marketing/$ARGUMENTS/04-engage.md` under a `## Referral Program` section:
   - **Program Design** — incentives, mechanics, qualification
   - **UX Flow** — how users discover, share, and track referrals
   - **Promotion Plan** — where and how to promote the program
   - **Anti-Fraud Measures** — abuse prevention
   - **Success Metrics** — referral rate, viral coefficient, CAC impact

## Output

Referral program design written to `.marketing/$ARGUMENTS/04-engage.md`. Present a summary highlighting:
- Recommended incentive structure
- Expected viral coefficient
- Launch plan

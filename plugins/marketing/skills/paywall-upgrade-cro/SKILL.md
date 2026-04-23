---
description: Optimize upgrade flows and paywall design
---

# Paywall & Upgrade CRO

Optimize the paywall and upgrade experience for "$ARGUMENTS". Design upgrade triggers, pricing page optimization, and conversion flows.

## Prerequisites

Read `.marketing/$ARGUMENTS/00-strategy.md`. If this file does not exist, tell the user:

> Phase 0 (Strategy) has not been completed for "$ARGUMENTS". Run `/marketing:customer-research $ARGUMENTS` first, or use `--skip-checks` to bypass.

If `--skip-checks` is present in $ARGUMENTS, skip this check and log to `.marketing/$ARGUMENTS/skip-log.md`.

## Process

1. **Read context:**
   - Read `.marketing/$ARGUMENTS/00-strategy.md` for pricing strategy
   - Read `.marketing/$ARGUMENTS/04-engage.md` if it exists

2. **Analyze current paywall (if applicable):**
   - When and where does the user hit the paywall?
   - What's the messaging at the paywall moment?
   - Hard paywall vs. soft paywall vs. metered approach
   - How does it make the user feel? (frustrated vs. motivated)

3. **Optimize upgrade triggers:**
   - Usage-based triggers: hitting limits naturally during valuable workflows
   - Feature-based triggers: showing premium features with upgrade prompt
   - Timing-based triggers: trial ending, usage milestone
   - Social triggers: team features, collaboration needs

4. **Pricing page optimization:**
   - Tier presentation: recommended tier highlighting
   - Feature comparison clarity
   - Social proof on pricing page
   - FAQ and objection handling
   - Annual vs. monthly toggle design

5. **Write the artifact** — append to `.marketing/$ARGUMENTS/04-engage.md` under a `## Paywall & Upgrade CRO` section:
   - **Current Paywall Assessment** — strengths and friction
   - **Upgrade Trigger Design** — when and where to prompt
   - **Pricing Page Recommendations** — layout, copy, social proof
   - **A/B Test Ideas** — highest-impact tests
   - **Expected Impact** — estimated conversion lift

## Output

Paywall CRO analysis written to `.marketing/$ARGUMENTS/04-engage.md`. Present a summary highlighting:
- Top upgrade trigger opportunity
- Pricing page improvements
- Recommended first test

---
description: Optimize user onboarding for activation and retention
---

# Onboarding CRO

Optimize the user onboarding experience for "$ARGUMENTS". Design flows that get users to the "aha moment" faster and increase activation rates.

## Prerequisites

Read `.metapowers/marketing/$ARGUMENTS/00-strategy.md`. If this file does not exist, tell the user:

> Phase 0 (Strategy) has not been completed for "$ARGUMENTS". Run `/marketing:customer-research $ARGUMENTS` first, or use `--skip-checks` to bypass.

If `--skip-checks` is present in $ARGUMENTS, skip this check and log to `.metapowers/marketing/$ARGUMENTS/skip-log.md`.

## Process

1. **Read context:**
   - Read `.metapowers/marketing/$ARGUMENTS/00-strategy.md` for audience context
   - Read `.metapowers/marketing/$ARGUMENTS/03-convert.md` if it exists (for signup flow context)

2. **Define the "aha moment":**
   - What action or outcome makes users understand the product's value?
   - How quickly can a new user reach it?
   - What's the current time-to-value?

3. **Map the onboarding flow:**
   - Current onboarding steps (if URL or flow provided)
   - Where do users drop off? (identify the biggest leak)
   - Which steps are essential vs. optional?
   - Progressive disclosure: what can be deferred?

4. **Design improvements:**
   - Welcome experience: personalized based on use case or persona
   - Checklist or wizard: guided steps to activation
   - Empty states: helpful, not empty
   - Tooltips, tours, or contextual help
   - Onboarding emails: complement in-app experience
   - Success celebrations: reinforce progress

5. **Write the artifact** to `.metapowers/marketing/$ARGUMENTS/04-engage.md` under an `## Onboarding CRO` section:
   - **Aha Moment Definition** — the activation event
   - **Current Flow Assessment** — steps and drop-off points
   - **Recommended Flow** — optimized onboarding design
   - **In-App + Email Coordination** — how both channels work together
   - **Activation Metrics** — what to track

## Output

Onboarding CRO strategy written to `.metapowers/marketing/$ARGUMENTS/04-engage.md`. Present a summary highlighting:
- Defined aha moment
- Biggest onboarding friction point
- Top 3 improvements to implement

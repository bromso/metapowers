---
description: Optimize signup and trial conversion flows
---

# Signup Flow CRO

Optimize the signup and trial conversion flow for "$ARGUMENTS". Reduce friction, increase activation, and improve trial-to-paid conversion.

## Prerequisites

Read `.metapowers/marketing/$ARGUMENTS/00-strategy.md`. If this file does not exist, tell the user:

> Phase 0 (Strategy) has not been completed for "$ARGUMENTS". Run `/marketing:customer-research $ARGUMENTS` first, or use `--skip-checks` to bypass.

If `--skip-checks` is present in $ARGUMENTS, skip this check and log to `.metapowers/marketing/$ARGUMENTS/skip-log.md`.

## Process

1. **Read context:**
   - Read `.metapowers/marketing/$ARGUMENTS/00-strategy.md` for audience and pricing
   - Read `.metapowers/marketing/$ARGUMENTS/02-act.md` if it exists (for page and form CRO context)

2. **Map the current flow (if URL provided):**
   - Use WebFetch to walk through the signup flow
   - Document every step: pages, forms, emails, activation steps
   - Identify drop-off points and friction

3. **Signup page optimization:**
   - Value proposition clarity on signup page
   - Social proof placement
   - Form field minimization (name + email is ideal)
   - SSO/social login options
   - Mobile signup experience

4. **Activation optimization:**
   - What is the "aha moment"? How quickly can users reach it?
   - Onboarding checklist or wizard design
   - Empty state design — what does the user see first?
   - Time-to-value: how to reduce it

5. **Trial-to-paid conversion:**
   - Trial length recommendation
   - In-trial engagement tactics (progress emails, usage prompts)
   - Upgrade triggers: what behavior indicates readiness?
   - Pricing page from within the product
   - Payment friction reduction

6. **Write the artifact** — append to `.metapowers/marketing/$ARGUMENTS/03-convert.md` under a `## Signup Flow CRO` section:
   - **Current Flow Map** — step-by-step with friction points
   - **Signup Page Recommendations** — optimization list
   - **Activation Strategy** — path to aha moment
   - **Trial-to-Paid Plan** — engagement and conversion tactics
   - **A/B Test Ideas** — highest-impact tests

## Output

Signup flow analysis written to `.metapowers/marketing/$ARGUMENTS/03-convert.md`. Present a summary highlighting:
- Biggest friction point identified
- Recommended activation improvements
- Expected conversion lift

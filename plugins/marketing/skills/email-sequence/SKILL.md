---
description: Design email drip campaigns and automations
---

# Email Sequence

Design email drip sequences and automation flows for "$ARGUMENTS". Plan trigger-based campaigns that nurture leads through the funnel.

## Prerequisites

Read `.metapowers/marketing/$ARGUMENTS/00-strategy.md`. If this file does not exist, tell the user:

> Phase 0 (Strategy) has not been completed for "$ARGUMENTS". Run `/marketing:customer-research $ARGUMENTS` first, or use `--skip-checks` to bypass.

If `--skip-checks` is present in $ARGUMENTS, skip this check and log to `.metapowers/marketing/$ARGUMENTS/skip-log.md`.

## Process

1. **Read context:**
   - Read `.metapowers/marketing/$ARGUMENTS/00-strategy.md` for audience and messaging
   - Read `.metapowers/marketing/$ARGUMENTS/02-act.md` if it exists (for lead magnet and copy context)
   - Read `plugins/marketing/shared/campaign-plan-template.md` for structure

2. **Define sequence type:**
   - Welcome/onboarding sequence
   - Lead nurture sequence (post lead-magnet)
   - Trial-to-paid conversion sequence
   - Re-engagement/winback sequence
   - Post-purchase/retention sequence
   - Which type(s) are most needed for "$ARGUMENTS"?

3. **Design the sequence:**
   - Number of emails and timing (days between)
   - For each email: subject line, preview text, goal, key message, CTA
   - Trigger and entry conditions
   - Exit conditions (converted, unsubscribed, engaged)
   - Branch logic (if applicable): what happens based on engagement?

4. **Write email copy:**
   - Draft subject line variants for each email (2-3 per email)
   - Write full email body copy for each email
   - Apply messaging framework from strategy
   - Include personalization variables

5. **Write the artifact** — append to `.metapowers/marketing/$ARGUMENTS/03-convert.md` under a `## Email Sequence` section:
   - **Sequence Overview** — type, trigger, goal, timing
   - **Flow Diagram** — visual sequence with branches
   - **Email Details** — per email: subject, body, CTA, timing
   - **Personalization** — variables and segmentation
   - **Success Metrics** — open rate, click rate, conversion targets

## Output

Email sequence written to `.metapowers/marketing/$ARGUMENTS/03-convert.md`. Present the full sequence with subject lines and email previews.

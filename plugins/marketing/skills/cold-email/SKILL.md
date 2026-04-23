---
description: Outbound email strategy and templates
---

# Cold Email

Design cold outbound email campaigns for "$ARGUMENTS". Create personalized email templates, follow-up sequences, and targeting criteria.

## Prerequisites

Read `.metapowers/marketing/$ARGUMENTS/00-strategy.md`. If this file does not exist, tell the user:

> Phase 0 (Strategy) has not been completed for "$ARGUMENTS". Run `/marketing:customer-research $ARGUMENTS` first, or use `--skip-checks` to bypass.

If `--skip-checks` is present in $ARGUMENTS, skip this check and log to `.metapowers/marketing/$ARGUMENTS/skip-log.md`.

## Process

1. **Read context:**
   - Read `.metapowers/marketing/$ARGUMENTS/00-strategy.md` for audience and value proposition
   - Read `plugins/marketing/shared/campaign-plan-template.md` for structure

2. **Define targeting criteria:**
   - Ideal customer profile (ICP) for outbound
   - Company firmographics: size, industry, tech stack, growth signals
   - Contact persona: title, department, seniority
   - Intent signals: hiring, funding, tech changes, content engagement

3. **Design email sequence:**
   - 3-5 email sequence with timing (typically days 1, 3, 7, 14)
   - Each email: different angle or value prop
   - Personalization strategy: what's personalized per recipient?
   - Follow-up logic: when to stop, when to escalate

4. **Write email templates:**
   - For each email: subject line (2-3 variants), body, CTA
   - Keep emails short (under 150 words)
   - Lead with relevance, not pitch
   - Include specific personalization placeholders
   - Compliance: include opt-out, identify sender, no deceptive subjects

5. **Write the artifact** — append to `.metapowers/marketing/$ARGUMENTS/03-convert.md` under a `## Cold Email` section:
   - **ICP & Targeting** — who to target and why
   - **Sequence Design** — timing and logic
   - **Email Templates** — full copy for each email
   - **Personalization Guide** — what to customize per recipient
   - **Compliance Notes** — CAN-SPAM, GDPR requirements

## Output

Cold email strategy written to `.metapowers/marketing/$ARGUMENTS/03-convert.md`. Present the full email sequence for review.

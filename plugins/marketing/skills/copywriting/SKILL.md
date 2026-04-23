---
description: Write persuasive copy for any marketing surface
---

# Copywriting

Write persuasive, conversion-focused copy for "$ARGUMENTS". Apply proven copywriting frameworks to create compelling headlines, body copy, and calls to action.

## Prerequisites

Read `.metapowers/marketing/$ARGUMENTS/00-strategy.md`. If this file does not exist, tell the user:

> Phase 0 (Strategy) has not been completed for "$ARGUMENTS". Run `/marketing:customer-research $ARGUMENTS` first, or use `--skip-checks` to bypass.

If `--skip-checks` is present in $ARGUMENTS, skip this check and log to `.metapowers/marketing/$ARGUMENTS/skip-log.md`.

## Process

1. **Read context:**
   - Read `.metapowers/marketing/$ARGUMENTS/00-strategy.md` for audience, messaging, and positioning
   - Read `.metapowers/marketing/$ARGUMENTS/01-reach.md` if it exists (for content context)

2. **Define the copy brief:**
   - What surface? (landing page, email, ad, social, product)
   - Who is reading? (map to persona from strategy)
   - What's the one action they should take?
   - What's their current state of awareness? (unaware, problem-aware, solution-aware, product-aware)

3. **Apply copywriting frameworks:**
   - **Headlines:** Use PAS (Problem-Agitate-Solve), AIDA (Attention-Interest-Desire-Action), or 4U (Useful-Urgent-Unique-Ultra-specific)
   - **Body:** Lead with the biggest benefit, use social proof, address objections, create urgency
   - **CTA:** Clear, specific, benefit-oriented action verbs
   - Generate 3-5 headline variants and recommend the strongest

4. **Voice and tone calibration:**
   - Match the brand voice from the messaging framework
   - Adjust formality for the channel (email vs. social vs. landing page)
   - Use the audience's own language (from customer research)

5. **Write the artifact** — append to `.metapowers/marketing/$ARGUMENTS/02-act.md` under a `## Copywriting` section:
   - **Copy Brief** — surface, audience, action, awareness level
   - **Headlines** — 3-5 variants with framework used
   - **Body Copy** — complete draft
   - **CTA Options** — 2-3 call-to-action variants
   - **Copy Notes** — tone decisions and rationale

## Output

Copy written to `.metapowers/marketing/$ARGUMENTS/02-act.md`. Present the copy directly to the user with headline options highlighted.

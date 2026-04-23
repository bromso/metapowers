---
description: Generate ad copy and creative briefs
---

# Ad Creative

Generate ad copy and creative briefs for "$ARGUMENTS". Create platform-specific ad variations with headlines, descriptions, and creative direction.

## Prerequisites

Read `.marketing/$ARGUMENTS/00-strategy.md`. If this file does not exist, tell the user:

> Phase 0 (Strategy) has not been completed for "$ARGUMENTS". Run `/marketing:customer-research $ARGUMENTS` first, or use `--skip-checks` to bypass.

If `--skip-checks` is present in $ARGUMENTS, skip this check and log to `.marketing/$ARGUMENTS/skip-log.md`.

## Process

1. **Read context:**
   - Read `.marketing/$ARGUMENTS/00-strategy.md` for messaging and positioning
   - Read `.marketing/$ARGUMENTS/03-convert.md` if it exists (for campaign context)

2. **Define ad format requirements:**
   - Platform and ad type (search, display, social feed, video, carousel)
   - Character limits per field
   - Image/video specs if applicable
   - Number of variants needed

3. **Write ad copy variants:**
   - For search ads: 5+ headline variants (30 chars), 3+ description variants (90 chars)
   - For social ads: primary text, headline, description, CTA button
   - Apply different angles: benefit-led, problem-led, social-proof-led, urgency-led
   - Use audience language from customer research

4. **Creative brief (for visual ads):**
   - Visual direction and mood
   - Required elements (logo, product shot, CTA)
   - Color palette and brand guidelines
   - Image vs. illustration vs. video recommendation
   - A/B test variants for creative

5. **Write the artifact** — append to `.marketing/$ARGUMENTS/03-convert.md` under a `## Ad Creative` section:
   - **Ad Specs** — platform, format, character limits
   - **Copy Variants** — all headline and description options
   - **Creative Brief** — visual direction for design team
   - **A/B Test Plan** — which variants to test first
   - **Performance Hypotheses** — which angles should win and why

## Output

Ad creative written to `.marketing/$ARGUMENTS/03-convert.md`. Present all copy variants in a scannable format for easy review.

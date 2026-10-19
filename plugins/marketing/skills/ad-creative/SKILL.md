---
description: Generate ad copy and creative briefs
---

# Ad Creative

Generate ad copy and creative briefs for "$ARGUMENTS". Create platform-specific ad variations with headlines, descriptions, and creative direction.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.metapowers/marketing/<project>/skip-log.md`: `- <ISO timestamp> — <skill name> skipped prerequisite check for <artifact file> — reason: <reason or "none given">`.

## Prerequisites

Read `.metapowers/marketing/<project>/00-strategy.md`. If this file does not exist, tell the user:

> Phase 0 (Strategy) has not been completed for "<project>". Run `/marketing:customer-research <project>` first, or use `--skip-checks` to bypass.

## Process

1. **Read context:**
   - Read `.metapowers/marketing/<project>/00-strategy.md` for messaging and positioning
   - Read `.metapowers/marketing/<project>/03-convert.md` if it exists (for campaign context)

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

5. **Write the artifact** — append to `.metapowers/marketing/<project>/03-convert.md` under a `## Ad Creative` section:
   - **Ad Specs** — platform, format, character limits
   - **Copy Variants** — all headline and description options
   - **Creative Brief** — visual direction for design team
   - **A/B Test Plan** — which variants to test first
   - **Performance Hypotheses** — which angles should win and why

## Output

Ad creative appended to `.metapowers/marketing/<project>/03-convert.md`. Present all copy variants in a scannable format for easy review.

---
description: Create social media content and scheduling strategy
---

# Social Content

Develop a social media content strategy for "$ARGUMENTS". Plan content themes, formats, posting schedule, and platform-specific tactics.

## Prerequisites

Read `.metapowers/marketing/$ARGUMENTS/00-strategy.md`. If this file does not exist, tell the user:

> Phase 0 (Strategy) has not been completed for "$ARGUMENTS". Run `/marketing:customer-research $ARGUMENTS` first, or use `--skip-checks` to bypass.

If `--skip-checks` is present in $ARGUMENTS, skip this check and log to `.metapowers/marketing/$ARGUMENTS/skip-log.md`.

## Process

1. **Read context:**
   - Read `.metapowers/marketing/$ARGUMENTS/00-strategy.md` for audience personas and messaging
   - Read `.metapowers/marketing/$ARGUMENTS/01-reach.md` if it exists (for content pillars)

2. **Platform selection:**
   - Where is the target audience most active? (LinkedIn, X/Twitter, Instagram, TikTok, YouTube, Reddit)
   - Match platforms to audience personas and content types
   - Recommend primary (1-2) and secondary (1-2) platforms

3. **Content themes and formats:**
   - Map content pillars to social-native formats
   - Per platform: what formats perform best? (carousels, threads, short video, images, text)
   - Content mix: educational, entertaining, promotional, community (recommend ratio)
   - User-generated content and community engagement opportunities

4. **Create content templates:**
   - 3-5 repeatable content templates per primary platform
   - Hook formulas, caption structures, CTA patterns
   - Hashtag and keyword strategy per platform

5. **Scheduling and cadence:**
   - Recommended posting frequency per platform
   - Best posting times for the audience
   - Content batching and repurposing workflow

6. **Write the artifact** — append to `.metapowers/marketing/$ARGUMENTS/01-reach.md` under a `## Social Content` section:
   - **Platform Strategy** — selected platforms with rationale
   - **Content Themes** — mapped to pillars and formats
   - **Content Templates** — repeatable post formats
   - **Scheduling Plan** — frequency, timing, batching
   - **First 10 Posts** — specific post ideas to start with

## Output

Social content strategy appended to `.metapowers/marketing/$ARGUMENTS/01-reach.md`. Present a summary highlighting:
- Recommended platforms and why
- Content mix ratio
- First 5 post ideas to publish

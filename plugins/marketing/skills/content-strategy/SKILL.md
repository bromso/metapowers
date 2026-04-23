---
description: Plan content pillars, editorial calendar, and distribution strategy
---

# Content Strategy

Develop a comprehensive content strategy for "$ARGUMENTS". Define content pillars, plan an editorial calendar, and map distribution channels.

## Prerequisites

Read `.marketing/$ARGUMENTS/00-strategy.md`. If this file does not exist, tell the user:

> Phase 0 (Strategy) has not been completed for "$ARGUMENTS". Run `/marketing:customer-research $ARGUMENTS` first, or use `--skip-checks` to bypass.

If `--skip-checks` is present in $ARGUMENTS, skip this check and log to `.marketing/$ARGUMENTS/skip-log.md`.

## Process

1. **Read context:**
   - Read `.marketing/$ARGUMENTS/00-strategy.md` for audience, positioning, and competitive context
   - Read `plugins/marketing/shared/race-framework-guide.md` for Reach phase guidance

2. **Define content pillars:**
   - Identify 3-5 core topics that align with the product positioning and audience needs
   - Each pillar should map to a key search intent or audience pain point
   - Validate pillars against competitor content gaps

3. **Content audit (if applicable):**
   - Use WebSearch to audit existing content from "$ARGUMENTS" (if a URL is provided)
   - Identify what's performing, what's missing, and what needs updating
   - Map content gaps against the pillar strategy

4. **Plan content types and formats:**
   - Blog posts, guides, case studies, videos, podcasts, newsletters, social
   - Map formats to funnel stages (awareness, consideration, decision)
   - Identify the 80/20: which formats deliver the most value with least effort?

5. **Build editorial calendar framework:**
   - Publishing cadence recommendation (frequency per channel)
   - Content mix across pillars and formats
   - Seasonal or event-driven content opportunities
   - Repurposing strategy (one piece → multiple formats)

6. **Map distribution channels:**
   - Where does the audience consume content? (informed by customer research)
   - Owned, earned, paid distribution plan
   - SEO vs. social vs. email vs. community distribution weighting

7. **Write the artifact** to `.marketing/$ARGUMENTS/01-reach.md` under a `## Content Strategy` section:
   - **Content Pillars** — topics with rationale
   - **Content Types & Formats** — mapped to funnel stages
   - **Editorial Calendar Framework** — cadence, mix, seasonal
   - **Distribution Plan** — channels, weighting, repurposing
   - **Quick Wins** — first 5 pieces to create

## Output

Content strategy written to `.marketing/$ARGUMENTS/01-reach.md`. Present a summary highlighting:
- Content pillars defined
- Recommended publishing cadence
- Top 3 quick-win content pieces to start with

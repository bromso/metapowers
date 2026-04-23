---
description: Evaluate pricing models, tiers, and packaging strategy
---

# Pricing Strategy

Evaluate and recommend pricing strategy for "$ARGUMENTS". Analyze pricing models, tier structures, packaging, and competitive pricing.

## Prerequisites

Read `.marketing/$ARGUMENTS/00-strategy.md`. If this file does not exist, suggest running `/marketing:customer-research $ARGUMENTS` first to understand the audience.

If `--skip-checks` is present in $ARGUMENTS, skip this check and log to `.marketing/$ARGUMENTS/skip-log.md`.

## Process

1. **Read context:**
   - Read `.marketing/$ARGUMENTS/00-strategy.md` for audience and competitor data
   - Read `plugins/marketing/shared/race-framework-guide.md` for methodology reference

2. **Analyze current pricing landscape:**
   - Use WebSearch to research competitor pricing for "$ARGUMENTS" category
   - Use WebFetch to read pricing pages of top competitors
   - Document: pricing models (flat, usage, per-seat, freemium), price points, tier structures

3. **Evaluate pricing models:**
   - Which model aligns with the value metric? (what do users pay for?)
   - Flat rate vs. usage-based vs. per-seat vs. hybrid
   - Free tier / freemium considerations
   - Annual vs. monthly pricing and discount strategy

4. **Design tier structure:**
   - Recommend tier names, price points, and feature allocation
   - Apply the "good-better-best" framework
   - Identify the anchor tier (where most users should land)
   - Define upgrade triggers between tiers

5. **Pricing psychology:**
   - Anchoring: which tier makes the target tier look like a deal?
   - Charm pricing vs. round numbers for the category
   - Annual discount percentage recommendations
   - Free trial vs. freemium decision

6. **Write the artifact** — append to `.marketing/$ARGUMENTS/00-strategy.md` under a `## Pricing Strategy` section:
   - **Competitive Pricing Landscape** — what competitors charge and how
   - **Recommended Model** — pricing model with rationale
   - **Tier Structure** — tiers, price points, features per tier
   - **Pricing Psychology** — anchoring, discount strategy
   - **Risks & Considerations** — potential issues with recommended approach

## Output

Pricing strategy appended to `.marketing/$ARGUMENTS/00-strategy.md`. Present a summary highlighting:
- Recommended pricing model and why
- Proposed tier structure with price points
- Key pricing psychology tactics to apply

---
description: Create "vs" and alternatives positioning content strategy
---

# Competitor Alternatives

Develop "vs" comparison and "alternatives to" content strategy for "$ARGUMENTS". Create positioning frameworks that highlight differentiation against specific competitors.

## Prerequisites

Read `.marketing/$ARGUMENTS/00-strategy.md`. If this file does not exist or lacks a `## Competitor Analysis` section, suggest running `/marketing:competitor-profiling $ARGUMENTS` first.

If `--skip-checks` is present in $ARGUMENTS, skip this check and log to `.marketing/$ARGUMENTS/skip-log.md`.

## Process

1. **Read context:**
   - Read `.marketing/$ARGUMENTS/00-strategy.md` for competitor profiles and positioning
   - Read `plugins/marketing/shared/race-framework-guide.md` for methodology reference

2. **Identify high-value comparison targets:**
   - Use WebSearch to find which competitor comparisons have search volume
   - Prioritize competitors that share the most audience overlap
   - Identify "alternatives to [competitor]" search opportunities

3. **Build comparison frameworks:**
   - For each target competitor, create a feature comparison matrix
   - Identify the 3-5 key differentiators (where "$ARGUMENTS" wins)
   - Note honest areas where competitors are stronger (builds credibility)

4. **Draft positioning angles:**
   - For each competitor: one-sentence "why switch" message
   - Category-level "alternatives" positioning
   - Objection handling for each competitor's strengths

5. **Write the artifact** — append to `.marketing/$ARGUMENTS/00-strategy.md` under a `## Competitor Alternatives` section:
   - **Comparison Targets** — ranked by opportunity
   - **Comparison Matrices** — feature-by-feature for top competitors
   - **Positioning Angles** — per-competitor messaging
   - **Content Recommendations** — what pages/posts to create

## Output

Competitor alternatives strategy appended to `.marketing/$ARGUMENTS/00-strategy.md`. Present a summary highlighting:
- Top 3 comparison opportunities by search volume
- Strongest differentiators to lead with
- Recommended content pieces to create

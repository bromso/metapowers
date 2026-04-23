---
description: Directory and listing site submission strategy
---

# Directory Submissions

Plan a directory and listing site strategy for "$ARGUMENTS". Identify high-value directories, optimize listings, and build a submission plan.

## Prerequisites

Read `.metapowers/marketing/$ARGUMENTS/00-strategy.md`. If this file does not exist, tell the user:

> Phase 0 (Strategy) has not been completed for "$ARGUMENTS". Run `/marketing:customer-research $ARGUMENTS` first, or use `--skip-checks` to bypass.

If `--skip-checks` is present in $ARGUMENTS, skip this check and log to `.metapowers/marketing/$ARGUMENTS/skip-log.md`.

## Process

1. **Read context:**
   - Read `.metapowers/marketing/$ARGUMENTS/00-strategy.md` for product category and positioning

2. **Research directories:**
   - Use WebSearch to find relevant directories for the "$ARGUMENTS" category
   - Include: product directories (G2, Capterra, Product Hunt), industry-specific directories, startup directories, review sites
   - Evaluate each: domain authority, traffic, audience relevance, cost

3. **Prioritize submissions:**
   - Rank directories by: traffic potential, SEO value (backlinks), audience match, effort
   - Separate into tiers: must-have, nice-to-have, low-priority
   - Note submission requirements and timelines

4. **Optimize listings:**
   - Craft optimized descriptions per directory (length, keyword, tone vary)
   - Screenshot and asset requirements
   - Category and tag selection strategy
   - Review solicitation plan

5. **Write the artifact** — append to `.metapowers/marketing/$ARGUMENTS/01-reach.md` under a `## Directory Submissions` section:
   - **Directory List** — prioritized with domain authority and audience fit
   - **Submission Plan** — timeline and requirements per directory
   - **Listing Copy** — optimized descriptions per tier
   - **Review Strategy** — how to build reviews on key platforms

## Output

Directory strategy appended to `.metapowers/marketing/$ARGUMENTS/01-reach.md`. Present a summary highlighting:
- Top 5 directories to submit to first
- Estimated timeline for submissions
- Review generation recommendations

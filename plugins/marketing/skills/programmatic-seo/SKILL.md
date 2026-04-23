---
description: Template-driven pages at scale for search traffic
---

# Programmatic SEO

Design a programmatic SEO strategy for "$ARGUMENTS". Plan template-driven pages that target long-tail keywords at scale — landing pages, directories, comparison pages, or location-based pages.

## Prerequisites

Read `.metapowers/marketing/$ARGUMENTS/00-strategy.md` and `.metapowers/marketing/$ARGUMENTS/01-reach.md` (if exists). If `00-strategy.md` does not exist, tell the user:

> Phase 0 (Strategy) has not been completed for "$ARGUMENTS". Run `/marketing:customer-research $ARGUMENTS` first, or use `--skip-checks` to bypass.

If `--skip-checks` is present in $ARGUMENTS, skip this check and log to `.metapowers/marketing/$ARGUMENTS/skip-log.md`.

## Process

1. **Read context:**
   - Read `.metapowers/marketing/$ARGUMENTS/00-strategy.md` for audience and competitive data
   - Read `.metapowers/marketing/$ARGUMENTS/01-reach.md` for SEO and content context if available

2. **Identify programmatic opportunities:**
   - Use WebSearch to find long-tail keyword patterns (e.g., "[tool] for [industry]", "[tool] vs [competitor]", "[tool] in [city]")
   - Estimate total addressable keyword volume across templates
   - Prioritize by search volume, competition, and conversion intent

3. **Design page templates:**
   - For each template type: layout, required data fields, content structure
   - How will unique value be added per page? (avoid thin content)
   - Internal linking strategy between programmatic pages
   - CTA and conversion path per template

4. **Data source planning:**
   - What data populates each template? (database, API, manual, AI-generated)
   - Data quality and freshness requirements
   - Scale: how many pages in the initial launch?

5. **Quality and indexing strategy:**
   - How to avoid duplicate or thin content penalties
   - Indexing approach: sitemap, internal links, pagination
   - Content enrichment strategy per page

6. **Write the artifact** — append to `.metapowers/marketing/$ARGUMENTS/01-reach.md` under a `## Programmatic SEO` section:
   - **Keyword Patterns** — template types with volume estimates
   - **Page Templates** — layout and content structure per type
   - **Data Sources** — what populates each template
   - **Quality Plan** — how to avoid thin content
   - **Implementation Roadmap** — phases and page counts

## Output

Programmatic SEO strategy appended to `.metapowers/marketing/$ARGUMENTS/01-reach.md`. Present a summary highlighting:
- Number of template types identified
- Total estimated keyword opportunity
- Recommended first template to build

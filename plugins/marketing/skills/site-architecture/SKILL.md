---
description: Plan information architecture, URL structure, and internal linking strategy
---

# Site Architecture

Plan the information architecture for "$ARGUMENTS". Design URL structure, navigation hierarchy, and internal linking strategy for SEO and user experience.

## Prerequisites

Read `.metapowers/marketing/$ARGUMENTS/00-strategy.md`. If this file does not exist, tell the user:

> Phase 0 (Strategy) has not been completed for "$ARGUMENTS". Run `/marketing:customer-research $ARGUMENTS` first, or use `--skip-checks` to bypass.

If `--skip-checks` is present in $ARGUMENTS, skip this check and log to `.metapowers/marketing/$ARGUMENTS/skip-log.md`.

## Process

1. **Read context:**
   - Read `.metapowers/marketing/$ARGUMENTS/00-strategy.md` for audience and competitor data
   - Read `.metapowers/marketing/$ARGUMENTS/01-reach.md` if it exists (for content and SEO context)

2. **Analyze current architecture (if URL provided):**
   - Use WebFetch to crawl the site structure
   - Map the current URL hierarchy and navigation
   - Identify orphan pages, deep pages, and crawl traps

3. **Design URL structure:**
   - Clean, readable URL patterns (lowercase, hyphens, no parameters)
   - Logical hierarchy reflecting content pillars
   - Category and subcategory structure
   - URL conventions for blog, docs, landing pages, etc.

4. **Plan navigation and hierarchy:**
   - Primary navigation structure
   - Secondary navigation (footer, sidebar)
   - Breadcrumb implementation
   - Maximum click depth (aim for 3 clicks to any page)

5. **Internal linking strategy:**
   - Hub-and-spoke model: pillar pages linking to cluster pages
   - Cross-linking between related content
   - Contextual link placement recommendations
   - Link anchor text best practices

6. **Write the artifact** — append to `.metapowers/marketing/$ARGUMENTS/01-reach.md` under a `## Site Architecture` section:
   - **URL Structure** — patterns and hierarchy
   - **Navigation Plan** — primary, secondary, breadcrumbs
   - **Internal Linking Strategy** — hub-spoke model, cross-linking
   - **Sitemap Structure** — visual site map
   - **Implementation Notes** — redirects, canonical tags

## Output

Site architecture plan appended to `.metapowers/marketing/$ARGUMENTS/01-reach.md`. Present a summary highlighting:
- Proposed URL hierarchy
- Key navigation changes
- Internal linking opportunities

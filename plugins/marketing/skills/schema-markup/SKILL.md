---
description: Structured data implementation for rich search results
---

# Schema Markup

Plan and generate structured data (schema.org) for "$ARGUMENTS". Optimize for rich snippets, knowledge panels, and enhanced search results.

## Prerequisites

Read `.metapowers/marketing/$ARGUMENTS/00-strategy.md`. If this file does not exist, tell the user:

> Phase 0 (Strategy) has not been completed for "$ARGUMENTS". Run `/marketing:customer-research $ARGUMENTS` first, or use `--skip-checks` to bypass.

If `--skip-checks` is present in $ARGUMENTS, skip this check and log to `.metapowers/marketing/$ARGUMENTS/skip-log.md`.

## Process

1. **Read context:**
   - Read `.metapowers/marketing/$ARGUMENTS/00-strategy.md` for product context
   - Read `.metapowers/marketing/$ARGUMENTS/01-reach.md` if it exists (for SEO context)

2. **Identify applicable schema types:**
   - Organization, Product, SoftwareApplication, WebSite
   - Article, BlogPosting, HowTo, FAQ, Review
   - BreadcrumbList, SearchAction, VideoObject
   - Match schema types to page types

3. **Audit current markup (if URL provided):**
   - Use WebFetch to check existing structured data
   - Test with Google Rich Results Test patterns
   - Identify missing or incorrect markup

4. **Generate schema markup:**
   - Write JSON-LD for each identified page type
   - Include all recommended properties (not just required)
   - Ensure accuracy — schema must match visible page content
   - Validate against schema.org specification

5. **Write the artifact** — append to `.metapowers/marketing/$ARGUMENTS/02-act.md` under a `## Schema Markup` section:
   - **Schema Audit** — current state (if applicable)
   - **Recommended Schema Types** — per page type
   - **JSON-LD Templates** — ready-to-implement code
   - **Implementation Guide** — where and how to add each schema
   - **Testing Plan** — how to validate after implementation

## Output

Schema markup plan appended to `.metapowers/marketing/$ARGUMENTS/02-act.md`. Present the JSON-LD templates directly to the user for implementation.

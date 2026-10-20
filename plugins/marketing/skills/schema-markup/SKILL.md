---
name: schema-markup
description: Implement structured data markup for rich search results
argument-hint: "[project] [--skip-checks]"
---

# Schema Markup

Plan and generate structured data (schema.org) for "$ARGUMENTS". Optimize for rich snippets, knowledge panels, and enhanced search results.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.metapowers/marketing/<project>/skip-log.md`: `- <ISO timestamp> — <skill name> skipped prerequisite check for <artifact file> — reason: <reason or "none given">`.

## Prerequisites

Read `.metapowers/marketing/<project>/00-strategy.md`. If this file does not exist, tell the user:

> Phase 0 (Strategy) has not been completed for "<project>". Run `/marketing:customer-research <project>` first, or use `--skip-checks` to bypass.

## Process

1. **Read context:**
   - Read `.metapowers/marketing/<project>/00-strategy.md` for product context
   - Read `.metapowers/marketing/<project>/01-reach.md` if it exists (for SEO context)

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

5. **Write the artifact** — append to `.metapowers/marketing/<project>/02-act.md` under a `## Schema Markup` section. Create the file with a `# Act — <project>` heading if it does not exist; if a `## Schema Markup` section already exists, replace only that section. The section contains:
   - **Schema Audit** — current state (if applicable)
   - **Recommended Schema Types** — per page type
   - **JSON-LD Templates** — ready-to-implement code
   - **Implementation Guide** — where and how to add each schema
   - **Testing Plan** — how to validate after implementation

## Output

Schema markup plan appended to `.metapowers/marketing/<project>/02-act.md`. Present the JSON-LD templates directly to the user for implementation.

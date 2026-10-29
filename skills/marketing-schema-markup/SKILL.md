---
name: marketing-schema-markup
description: Generate schema.org JSON-LD for a site's page types — Product, FAQ, Article, Breadcrumb and more — with an audit of existing markup and a testing plan. Use when the user wants rich results such as stars or FAQ snippets in Google, or asks for structured data code.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: marketing
  phase: 2
  artifact: 02-act.md
---

# Schema Markup

Plan and generate structured data (schema.org) for "$ARGUMENTS". Optimize for rich snippets, knowledge panels, and enhanced search results.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"<skill name>","workflow":"marketing","phase":<phase>,"project":"<project>","event":"skipped","artifact":"<artifact file>","note":"<reason or \"none given\">"}`.

## Prerequisites

Run `scripts/gate.sh <project>` from this skill's folder. If it exits non-zero, stop and tell the user what it printed (unless `--skip-checks`, see Arguments).

Read `.singularskills/marketing/<project>/00-strategy.md`. If this file does not exist, tell the user:

> Phase 0 (Strategy) has not been completed for "<project>". Run `/marketing-customer-research <project>` first, or use `--skip-checks` to bypass.

## Process

1. **Read context:**
   - Read `.singularskills/marketing/<project>/00-strategy.md` for product context
   - Read `.singularskills/marketing/<project>/01-reach.md` if it exists (for SEO context)

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

5. **Write the artifact** — append to `.singularskills/marketing/<project>/02-act.md` under a `## Schema Markup` section. Create the file with a `# Act — <project>` heading if it does not exist; if a `## Schema Markup` section already exists, replace only that section. The section contains:
   - **Schema Audit** — current state (if applicable)
   - **Recommended Schema Types** — per page type
   - **JSON-LD Templates** — ready-to-implement code
   - **Implementation Guide** — where and how to add each schema
   - **Testing Plan** — how to validate after implementation

## Output

Schema markup plan appended to `.singularskills/marketing/<project>/02-act.md`. Present the JSON-LD templates directly to the user for implementation.

**Record the run.** This artifact is shared by every skill of phase 2 (Act). The frontmatter is written once, by whoever creates the file: if you create it, open it with the block below (`skill` is the phase title, `started` the time of that first write; `gate` is `passed` when the gate ran clean and `skipped` under `--skip-checks`); if it already exists, leave the block alone except to update `finished` and to set `gate` to the worst value among the sections (`skipped` over `passed`).

```yaml
---
skill: Act
workflow: marketing
phase: 2
project: <project>
started: <ISO timestamp>
finished: <ISO timestamp>
agent: <the agent you run in, or "unknown">
gate: <passed|skipped>
---
```

Open your `## Schema Markup` section with one italic line, `*<skill name> · <ISO timestamp> · gate: <passed|skipped>*` (your skill name is `marketing-schema-markup`).

End the artifact (or your section of a shared artifact) with `## Decisions` and `## Open questions`, in this shape:

```markdown
## Decisions
- <what was chosen> — <why> — <what was rejected>

## Open questions
- <what the next phase or a reviewer must settle>
```

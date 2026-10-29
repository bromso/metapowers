---
name: marketing-site-architecture
description: Plan a website's information architecture — URL patterns, navigation, breadcrumbs, click depth and hub-and-spoke internal linking. Use when the user is building or restructuring a site and asks how its pages, URLs and menus should be organized.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: marketing
  phase: 1
  artifact: 01-reach.md
---

# Site Architecture

Plan the information architecture for "$ARGUMENTS". Design URL structure, navigation hierarchy, and internal linking strategy for SEO and user experience.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"<skill name>","workflow":"marketing","phase":<phase>,"project":"<project>","event":"skipped","artifact":"<artifact file>","note":"<reason or \"none given\">"}`.

## Prerequisites

Run `scripts/gate.sh <project>` from this skill's folder. If it exits non-zero, stop and tell the user what it printed (unless `--skip-checks`, see Arguments).

Read `.singularskills/marketing/<project>/00-strategy.md`. If this file does not exist, tell the user:

> Phase 0 (Strategy) has not been completed for "<project>". Run `/marketing-customer-research <project>` first, or use `--skip-checks` to bypass.

## Process

1. **Read context:**
   - Read `.singularskills/marketing/<project>/00-strategy.md` for audience and competitor data
   - Read `.singularskills/marketing/<project>/01-reach.md` if it exists (for content and SEO context)

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

6. **Write the artifact** — append to `.singularskills/marketing/<project>/01-reach.md` under a `## Site Architecture` section. Create the file with a `# Reach — <project>` heading if it does not exist; if a `## Site Architecture` section already exists, replace only that section. The section contains:
   - **URL Structure** — patterns and hierarchy
   - **Navigation Plan** — primary, secondary, breadcrumbs
   - **Internal Linking Strategy** — hub-spoke model, cross-linking
   - **Sitemap Structure** — visual site map
   - **Implementation Notes** — redirects, canonical tags

## Output

Site architecture plan appended to `.singularskills/marketing/<project>/01-reach.md`. Present a summary highlighting:
- Proposed URL hierarchy
- Key navigation changes
- Internal linking opportunities

**Record the run.** This artifact is shared by every skill of phase 1 (Reach). The frontmatter is written once, by whoever creates the file: if you create it, open it with the block below (`skill` is the phase title, `started` the time of that first write; `gate` is `passed` when the gate ran clean and `skipped` under `--skip-checks`); if it already exists, leave the block alone except to update `finished` and to set `gate` to the worst value among the sections (`skipped` over `passed`).

```yaml
---
skill: Reach
workflow: marketing
phase: 1
project: <project>
started: <ISO timestamp>
finished: <ISO timestamp>
agent: <the agent you run in, or "unknown">
gate: <passed|skipped>
---
```

Open your `## Site Architecture` section with one italic line, `*<skill name> · <ISO timestamp> · gate: <passed|skipped>*` (your skill name is `marketing-site-architecture`).

End the artifact (or your section of a shared artifact) with `## Decisions` and `## Open questions`, in this shape:

```markdown
## Decisions
- <what was chosen> — <why> — <what was rejected>

## Open questions
- <what the next phase or a reviewer must settle>
```

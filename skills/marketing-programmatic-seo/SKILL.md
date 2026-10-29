---
name: marketing-programmatic-seo
description: Plan template-driven SEO pages at scale — long-tail keyword patterns, page templates, data sources and safeguards against thin content. Use when the user wants to generate hundreds of per-industry, per-integration or per-city pages from a dataset. Not for hand-written comparison pages against named rivals; see /marketing-competitor-alternatives.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: marketing
  phase: 1
  artifact: 01-reach.md
---

# Programmatic SEO

Design a programmatic SEO strategy for "$ARGUMENTS". Plan template-driven pages that target long-tail keywords at scale — landing pages, directories, comparison pages, or location-based pages.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"marketing-programmatic-seo","workflow":"marketing","phase":1,"project":"<project>","event":"skipped","artifact":"01-reach.md","note":"<reason or \"none given\">"}`.

## Prerequisites

Run this skill's gate before writing: `sh <this skill's folder>/scripts/gate.sh <project> <project root>`, where `<project root>` is the folder that contains `.singularskills/` (use `.` when you are already there). If it exits non-zero, stop and tell the user what it printed, unless `--skip-checks` was given (see Arguments). On a refusal, before you stop, append this line to `.singularskills/log.jsonl` (create the folder and file if missing): `{"ts":"<ISO timestamp>","skill":"marketing-programmatic-seo","workflow":"marketing","phase":1,"project":"<project>","event":"refused","artifact":"01-reach.md","note":"<what the gate printed>"}`. Once the gate has passed, or under `--skip-checks` once you have appended the `skipped` line, append this line before you start work: `{"ts":"<ISO timestamp>","skill":"marketing-programmatic-seo","workflow":"marketing","phase":1,"project":"<project>","event":"started","artifact":"01-reach.md","note":""}`.

Read `.singularskills/marketing/<project>/00-strategy.md` and `.singularskills/marketing/<project>/01-reach.md` (if exists). If `00-strategy.md` does not exist, tell the user:

> Phase 0 (Strategy) has not been completed for "<project>". Run `/marketing-customer-research <project>` first, or use `--skip-checks` to bypass.

## Process

1. **Read context:**
   - Read `.singularskills/marketing/<project>/00-strategy.md` for audience and competitive data
   - Read `.singularskills/marketing/<project>/01-reach.md` for SEO and content context if available

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

6. **Write the artifact** — append to `.singularskills/marketing/<project>/01-reach.md` under a `## Programmatic SEO` section. Create the file with a `# Reach — <project>` heading if it does not exist; if a `## Programmatic SEO` section already exists, replace only that section. The section contains:
   - **Keyword Patterns** — template types with volume estimates
   - **Page Templates** — layout and content structure per type
   - **Data Sources** — what populates each template
   - **Quality Plan** — how to avoid thin content
   - **Implementation Roadmap** — phases and page counts

## Output

Programmatic SEO strategy appended to `.singularskills/marketing/<project>/01-reach.md`. Present a summary highlighting:
- Number of template types identified
- Total estimated keyword opportunity
- Recommended first template to build

**Record the run.** After you have written your section, append this line to `.singularskills/log.jsonl` (the `started` line of Prerequisites, with `"event":"finished"`): `{"ts":"<ISO timestamp>","skill":"marketing-programmatic-seo","workflow":"marketing","phase":1,"project":"<project>","event":"finished","artifact":"01-reach.md","note":""}`.

This artifact is shared by every skill of phase 1 (Reach). The frontmatter is written once, by whoever creates the file: if you create it, open it with the block below (`skill` is the phase title, `started` the time of that first write; `gate` is `passed` when the gate ran clean and `skipped` under `--skip-checks`); if it already exists, leave the block alone except to update `finished` and to set `gate` to the worst value among the sections (`skipped` over `passed`).

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

Open your `## Programmatic SEO` section with one italic line, `*<skill name> · <ISO timestamp> · gate: <passed|skipped>*` (your skill name is `marketing-programmatic-seo`).

End your section with `### Decisions` and `### Open questions` (one level under your `## Programmatic SEO` heading, so the section stays one block), in this shape:

```markdown
### Decisions
- <what was chosen> — <why> — <what was rejected>

### Open questions
- <what the next phase or a reviewer must settle>
```

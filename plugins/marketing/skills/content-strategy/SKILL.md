---
description: Plan content pillars, editorial calendar, and distribution strategy
---

# Content Strategy

Develop a comprehensive content strategy for "$ARGUMENTS". Define content pillars, plan an editorial calendar, and map distribution channels.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.metapowers/marketing/<project>/skip-log.md`: `- <ISO timestamp> — <skill name> skipped prerequisite check for <artifact file> — reason: <reason or "none given">`.

## Prerequisites

Read `.metapowers/marketing/<project>/00-strategy.md`. If this file does not exist, tell the user:

> Phase 0 (Strategy) has not been completed for "<project>". Run `/marketing:customer-research <project>` first, or use `--skip-checks` to bypass.

## Process

1. **Read context:**
   - Read `.metapowers/marketing/<project>/00-strategy.md` for audience, positioning, and competitive context
   - Read `${CLAUDE_PLUGIN_ROOT}/shared/race-framework-guide.md` for Reach phase guidance

2. **Define content pillars:**
   - Identify 3-5 core topics that align with the product positioning and audience needs
   - Each pillar should map to a key search intent or audience pain point
   - Validate pillars against competitor content gaps

3. **Content audit (if applicable):**
   - Use WebSearch to audit existing content from "<project>" (if a URL is provided)
   - Identify what's performing, what's missing, and what needs updating
   - Map content gaps against the pillar strategy

4. **Plan content types and formats:**
   - Blog posts, guides, case studies, videos, podcasts, newsletters, social
   - Map formats to funnel stages (awareness, consideration, decision)
   - Identify the 80/20: which formats deliver the most value with least effort?

5. **Build editorial calendar framework:**
   - Publishing cadence recommendation (frequency per channel)
   - Content mix across pillars and formats
   - Seasonal or event-driven content opportunities
   - Repurposing strategy (one piece → multiple formats)

6. **Map distribution channels:**
   - Where does the audience consume content? (informed by customer research)
   - Owned, earned, paid distribution plan
   - SEO vs. social vs. email vs. community distribution weighting

7. **Write the artifact** — append to `.metapowers/marketing/<project>/01-reach.md` under a `## Content Strategy` section. Create the file with a `# Reach — <project>` heading if it does not exist; if a `## Content Strategy` section already exists, replace only that section. The section contains:
   - **Content Pillars** — topics with rationale
   - **Content Types & Formats** — mapped to funnel stages
   - **Editorial Calendar Framework** — cadence, mix, seasonal
   - **Distribution Plan** — channels, weighting, repurposing
   - **Quick Wins** — first 5 pieces to create

## Output

Content strategy appended to `.metapowers/marketing/<project>/01-reach.md`. Present a summary highlighting:
- Content pillars defined
- Recommended publishing cadence
- Top 3 quick-win content pieces to start with

---
name: marketing-content-strategy
description: Plan a content program — three to five content pillars, formats by funnel stage, an editorial calendar and owned, earned and paid distribution. Use when the user wants to know what to blog, publish or produce over the coming months and why. Not for platform-specific social posts and posting schedules; see /marketing-social-content.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: marketing
  phase: 1
  artifact: 01-reach.md
---

# Content Strategy

Develop a comprehensive content strategy for "$ARGUMENTS". Define content pillars, plan an editorial calendar, and map distribution channels.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"marketing-content-strategy","workflow":"marketing","phase":1,"project":"<project>","event":"skipped","artifact":"01-reach.md","note":"<reason or \"none given\">"}`.

## Prerequisites

Run this skill's gate before writing: `sh <this skill's folder>/scripts/gate.sh <project> <project root>`, where `<project root>` is the folder that contains `.singularskills/` (use `.` when you are already there). If it exits non-zero, stop and tell the user what it printed, unless `--skip-checks` was given (see Arguments). On a refusal, before you stop, append this line to `.singularskills/log.jsonl` (create the folder and file if missing): `{"ts":"<ISO timestamp>","skill":"marketing-content-strategy","workflow":"marketing","phase":1,"project":"<project>","event":"refused","artifact":"01-reach.md","note":"<what the gate printed>"}`. Once the gate has passed, or under `--skip-checks` once you have appended the `skipped` line, append this line before you start work: `{"ts":"<ISO timestamp>","skill":"marketing-content-strategy","workflow":"marketing","phase":1,"project":"<project>","event":"started","artifact":"01-reach.md","note":""}`.

Read `.singularskills/marketing/<project>/00-strategy.md`. If this file does not exist, tell the user:

> Phase 0 (Strategy) has not been completed for "<project>". Run `/marketing-customer-research <project>` first, or use `--skip-checks` to bypass.

## Process

1. **Read context:**
   - Read `.singularskills/marketing/<project>/00-strategy.md` for audience, positioning, and competitive context
   - Read `references/race-framework-guide.md` for Reach phase guidance

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

7. **Write the artifact** — append to `.singularskills/marketing/<project>/01-reach.md` under a `## Content Strategy` section. Create the file with a `# Reach — <project>` heading if it does not exist; if a `## Content Strategy` section already exists, replace only that section. The section contains:
   - **Content Pillars** — topics with rationale
   - **Content Types & Formats** — mapped to funnel stages
   - **Editorial Calendar Framework** — cadence, mix, seasonal
   - **Distribution Plan** — channels, weighting, repurposing
   - **Quick Wins** — first 5 pieces to create

## Output

Content strategy appended to `.singularskills/marketing/<project>/01-reach.md`. Present a summary highlighting:
- Content pillars defined
- Recommended publishing cadence
- Top 3 quick-win content pieces to start with

**Record the run.** After you have written your section, append this line to `.singularskills/log.jsonl` (the `started` line of Prerequisites, with `"event":"finished"`): `{"ts":"<ISO timestamp>","skill":"marketing-content-strategy","workflow":"marketing","phase":1,"project":"<project>","event":"finished","artifact":"01-reach.md","note":""}`.

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

Open your `## Content Strategy` section with one italic line, `*<skill name> · <ISO timestamp> · gate: <passed|skipped>*` (your skill name is `marketing-content-strategy`).

End your section with `### Decisions` and `### Open questions` (one level under your `## Content Strategy` heading, so the section stays one block), in this shape:

```markdown
### Decisions
- <what was chosen> — <why> — <what was rejected>

### Open questions
- <what the next phase or a reviewer must settle>
```

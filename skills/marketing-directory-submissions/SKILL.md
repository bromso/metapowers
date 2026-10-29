---
name: marketing-directory-submissions
description: Plan directory and review-site submissions — G2, Capterra, Product Hunt, niche directories — ranked by traffic and backlink value, with listing copy and a review plan. Use when the user wants the product listed on software directories or needs more reviews on them.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: marketing
  phase: 1
  artifact: 01-reach.md
---

# Directory Submissions

Plan a directory and listing site strategy for "$ARGUMENTS". Identify high-value directories, optimize listings, and build a submission plan.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"<skill name>","workflow":"marketing","phase":<phase>,"project":"<project>","event":"skipped","artifact":"<artifact file>","note":"<reason or \"none given\">"}`.

## Prerequisites

Run `scripts/gate.sh <project>` from this skill's folder. If it exits non-zero, stop and tell the user what it printed (unless `--skip-checks`, see Arguments).

Read `.singularskills/marketing/<project>/00-strategy.md`. If this file does not exist, tell the user:

> Phase 0 (Strategy) has not been completed for "<project>". Run `/marketing-customer-research <project>` first, or use `--skip-checks` to bypass.

## Process

1. **Read context:**
   - Read `.singularskills/marketing/<project>/00-strategy.md` for product category and positioning

2. **Research directories:**
   - Use WebSearch to find relevant directories for the "<project>" category
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

5. **Write the artifact** — append to `.singularskills/marketing/<project>/01-reach.md` under a `## Directory Submissions` section. Create the file with a `# Reach — <project>` heading if it does not exist; if a `## Directory Submissions` section already exists, replace only that section. The section contains:
   - **Directory List** — prioritized with domain authority and audience fit
   - **Submission Plan** — timeline and requirements per directory
   - **Listing Copy** — optimized descriptions per tier
   - **Review Strategy** — how to build reviews on key platforms

## Output

Directory strategy appended to `.singularskills/marketing/<project>/01-reach.md`. Present a summary highlighting:
- Top 5 directories to submit to first
- Estimated timeline for submissions
- Review generation recommendations

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

Open your `## Directory Submissions` section with one italic line, `*<skill name> · <ISO timestamp> · gate: <passed|skipped>*` (your skill name is `marketing-directory-submissions`).

End your section with `### Decisions` and `### Open questions` (one level under your `## Directory Submissions` heading, so the section stays one block), in this shape:

```markdown
### Decisions
- <what was chosen> — <why> — <what was rejected>

### Open questions
- <what the next phase or a reviewer must settle>
```

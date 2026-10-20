---
name: competitor-alternatives
description: Plan comparison and alternatives-to content against specific competitors — which rivals to target, feature matrices, why-switch messages and objection handling. Use when the user wants to rank for searches comparing them with a rival or win over a named competitor's customers. Not for mapping the whole competitive landscape; see /marketing:competitor-profiling.
argument-hint: "[project] [--skip-checks]"
---

# Competitor Alternatives

Develop "vs" comparison and "alternatives to" content strategy for "$ARGUMENTS". Create positioning frameworks that highlight differentiation against specific competitors.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.metapowers/marketing/<project>/skip-log.md`: `- <ISO timestamp> — <skill name> skipped prerequisite check for <artifact file> — reason: <reason or "none given">`.

## Prerequisites

Read `.metapowers/marketing/<project>/00-strategy.md`. If this file does not exist or lacks a `## Competitor Analysis` section, suggest running `/marketing:competitor-profiling <project>` first.

## Process

1. **Read context:**
   - Read `.metapowers/marketing/<project>/00-strategy.md` for competitor profiles and positioning
   - Read `${CLAUDE_PLUGIN_ROOT}/shared/race-framework-guide.md` for methodology reference

2. **Identify high-value comparison targets:**
   - Use WebSearch to find which competitor comparisons have search volume
   - Prioritize competitors that share the most audience overlap
   - Identify "alternatives to [competitor]" search opportunities

3. **Build comparison frameworks:**
   - For each target competitor, create a feature comparison matrix
   - Identify the 3-5 key differentiators (where "<project>" wins)
   - Note honest areas where competitors are stronger (builds credibility)

4. **Draft positioning angles:**
   - For each competitor: one-sentence "why switch" message
   - Category-level "alternatives" positioning
   - Objection handling for each competitor's strengths

5. **Write the artifact** — append to `.metapowers/marketing/<project>/00-strategy.md` under a `## Competitor Alternatives` section. Create the file with a `# Strategy — <project>` heading if it does not exist; if a `## Competitor Alternatives` section already exists, replace only that section. The section contains:
   - **Comparison Targets** — ranked by opportunity
   - **Comparison Matrices** — feature-by-feature for top competitors
   - **Positioning Angles** — per-competitor messaging
   - **Content Recommendations** — what pages/posts to create

## Output

Competitor alternatives strategy appended to `.metapowers/marketing/<project>/00-strategy.md`. Present a summary highlighting:
- Top 3 comparison opportunities by search volume
- Strongest differentiators to lead with
- Recommended content pieces to create

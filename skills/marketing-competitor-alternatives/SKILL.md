---
name: marketing-competitor-alternatives
description: Plan comparison and alternatives-to content against specific competitors — which rivals to target, feature matrices, why-switch messages and objection handling. Use when the user wants to rank for searches comparing them with a rival or win over a named competitor's customers. Not for mapping the whole competitive landscape; see /marketing-competitor-profiling.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: marketing
  phase: 0
  artifact: 00-strategy.md
---

# Competitor Alternatives

Develop "vs" comparison and "alternatives to" content strategy for "$ARGUMENTS". Create positioning frameworks that highlight differentiation against specific competitors.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"<skill name>","workflow":"marketing","phase":<phase>,"project":"<project>","event":"skipped","artifact":"<artifact file>","note":"<reason or \"none given\">"}`.

## Prerequisites

Read `.singularskills/marketing/<project>/00-strategy.md`. If this file does not exist or lacks a `## Competitor Analysis` section, suggest running `/marketing-competitor-profiling <project>` first.

## Process

1. **Read context:**
   - Read `.singularskills/marketing/<project>/00-strategy.md` for competitor profiles and positioning
   - Read `references/race-framework-guide.md` for methodology reference

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

5. **Write the artifact** — append to `.singularskills/marketing/<project>/00-strategy.md` under a `## Competitor Alternatives` section. Create the file with a `# Strategy — <project>` heading if it does not exist; if a `## Competitor Alternatives` section already exists, replace only that section. The section contains:
   - **Comparison Targets** — ranked by opportunity
   - **Comparison Matrices** — feature-by-feature for top competitors
   - **Positioning Angles** — per-competitor messaging
   - **Content Recommendations** — what pages/posts to create

## Output

Competitor alternatives strategy appended to `.singularskills/marketing/<project>/00-strategy.md`. Present a summary highlighting:
- Top 3 comparison opportunities by search volume
- Strongest differentiators to lead with
- Recommended content pieces to create

**Record the run.** This artifact is shared by every skill of phase 0 (Strategy). The frontmatter is written once, by whoever creates the file: if you create it, open it with the block below (`skill` is the phase title, `started` the time of that first write; `gate` is `none`, as this phase has no gate); if it already exists, leave the block alone except to update `finished` and to set `gate` to the worst value among the sections (`skipped` over `passed`).

```yaml
---
skill: Strategy
workflow: marketing
phase: 0
project: <project>
started: <ISO timestamp>
finished: <ISO timestamp>
agent: <the agent you run in, or "unknown">
gate: none
---
```

Open your `## Competitor Alternatives` section with one italic line, `*<skill name> · <ISO timestamp> · gate: <passed|skipped>*` (your skill name is `marketing-competitor-alternatives`).

End your section with `### Decisions` and `### Open questions` (one level under your `## Competitor Alternatives` heading, so the section stays one block), in this shape:

```markdown
### Decisions
- <what was chosen> — <why> — <what was rejected>

### Open questions
- <what the next phase or a reviewer must settle>
```

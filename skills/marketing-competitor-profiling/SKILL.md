---
name: marketing-competitor-profiling
description: Analyze five to eight competitors — positioning, pricing, audience, strengths and weaknesses — and map the landscape to find market gaps and a differentiation angle. Use when the user asks who they compete with, how rivals position themselves or where the gap in the market is. Not for comparison pages against a named rival; see /marketing-competitor-alternatives.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: marketing
  phase: 0
  artifact: 00-strategy.md
---

# Competitor Profiling

Analyze the competitive landscape for "$ARGUMENTS". Profile key competitors, map their positioning, identify strengths and weaknesses, and find market gaps.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"<skill name>","workflow":"marketing","phase":<phase>,"project":"<project>","event":"skipped","artifact":"<artifact file>","note":"<reason or \"none given\">"}`.

## Prerequisites

None — can be run independently or after customer-research.

## Process

1. **Identify competitors:**
   - Use WebSearch to find direct and indirect competitors for "<project>"
   - Categorize: direct competitors, indirect competitors, potential future competitors
   - Aim for 5-8 competitors to analyze

2. **Profile each competitor:**
   - Use WebFetch to read their website, pricing page, and key marketing pages
   - Document: value proposition, target audience, pricing model, key features, market position
   - Note their messaging tone, brand positioning, and content strategy

3. **Analyze strengths and weaknesses:**
   - What do they do well? What do customers praise?
   - Where do they fall short? What do customers complain about?
   - Use WebSearch to find reviews, comparisons, and user feedback

4. **Map the competitive landscape:**
   - Create a positioning matrix (e.g., price vs. feature depth, or ease-of-use vs. power)
   - Identify white space — underserved segments or unmet needs
   - Note emerging trends competitors are or aren't addressing

5. **Identify opportunities:**
   - Where can "<project>" differentiate?
   - What competitor weaknesses can be exploited?
   - What market gaps are no one filling?

6. **Write the artifact** — append to `.singularskills/marketing/<project>/00-strategy.md` under a `## Competitor Analysis` section. Create the file with a `# Strategy — <project>` heading if it does not exist; if a `## Competitor Analysis` section already exists, replace only that section. The section contains:
   - **Competitor Profiles** — summary of each competitor
   - **Positioning Matrix** — visual landscape map
   - **Strengths & Weaknesses** — per competitor
   - **Market Gaps** — underserved needs or segments
   - **Differentiation Opportunities** — where to win

## Output

Competitor analysis appended to `.singularskills/marketing/<project>/00-strategy.md`. Present a summary highlighting:
- Top 3 competitors and their positioning
- Biggest market gap identified
- Recommended differentiation angle

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

Open your `## Competitor Analysis` section with one italic line, `*<skill name> · <ISO timestamp> · gate: <passed|skipped>*` (your skill name is `marketing-competitor-profiling`).

End the artifact (or your section of a shared artifact) with `## Decisions` and `## Open questions`, in this shape:

```markdown
## Decisions
- <what was chosen> — <why> — <what was rejected>

## Open questions
- <what the next phase or a reviewer must settle>
```

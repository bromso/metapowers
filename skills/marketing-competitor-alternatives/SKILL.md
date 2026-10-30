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

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"marketing-competitor-alternatives","workflow":"marketing","phase":0,"project":"<project>","event":"skipped","artifact":"00-strategy.md","note":"<reason or \"none given\">"}`.

## Prerequisites

**Part of a workflow.** This skill is phase 0 (Strategy) of the RACE Framework workflow (`marketing`); cross-domain workflows run it too. Unless the user named this skill, check `.singularskills/log.jsonl` for an open run for this project: a `run-started` line with `"project":"<project>"` and no later `run-finished` line for the same `workflow` and `project`. If there is no open run, or the user asked to start, run, continue or resume a process or workflow rather than this one step, do not continue here: invoke the `workflow` skill with the workflow the user asked for, or `marketing` when they named none, followed by `<project>`. It runs this phase in order, asks before it writes and records the run. Continue here when the user named this skill, or when an open run exists (the conductor is running you).

Before you start work, append this line to `.singularskills/log.jsonl` (create the folder and file if missing): `{"ts":"<ISO timestamp>","skill":"marketing-competitor-alternatives","workflow":"marketing","phase":0,"project":"<project>","event":"started","artifact":"00-strategy.md","note":""}`.

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

**Record the run.** After you have written your section, append this line to `.singularskills/log.jsonl` (the `started` line of Prerequisites, with `"event":"finished"`): `{"ts":"<ISO timestamp>","skill":"marketing-competitor-alternatives","workflow":"marketing","phase":0,"project":"<project>","event":"finished","artifact":"00-strategy.md","note":""}`.

This artifact is shared by every skill of phase 0 (Strategy). The frontmatter is written once, by whoever creates the file: if you create it, open it with the block below (`skill` is the phase title, `started` the time of that first write; `gate` is `none`, as this phase has no gate); if it already exists, leave the block alone except to update `finished`.

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

Open your `## Competitor Alternatives` section with one italic line, `*<skill name> · <ISO timestamp> · gate: none*` (your skill name is `marketing-competitor-alternatives`).

End your section with `### Decisions` and `### Open questions` (one level under your `## Competitor Alternatives` heading, so the section stays one block), in this shape:

```markdown
### Decisions
- <what was chosen> — <why> — <what was rejected>

### Open questions
- <what the next phase or a reviewer must settle>
```

---
name: marketing-customer-research
description: Research a product's target buyers for marketing — personas, jobs-to-be-done, pain points, objections and the buyer journey. Use when the user is starting marketing for a product and needs to know who buys it, why and in what words. Not for open-ended discovery on a problem or topic; see /research-discover.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: marketing
  phase: 0
  artifact: 00-strategy.md
---

# Customer Research

Research the target audience for "$ARGUMENTS". Build detailed personas, map jobs-to-be-done, identify pain points, and understand the buyer journey.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"marketing-customer-research","workflow":"marketing","phase":0,"project":"<project>","event":"skipped","artifact":"00-strategy.md","note":"<reason or \"none given\">"}`.

## Prerequisites

None — this is typically the first Strategy skill to run.

## Process

1. **Web research** to understand the target audience:
   - Use WebSearch to find audience research, surveys, forum discussions, and industry reports about "<project>"
   - Use WebFetch to read the most relevant sources in depth (aim for 5-8 quality sources)
   - Look for: demographic data, behavioral patterns, purchase motivations, common objections

2. **Build personas:**
   - Create 2-3 detailed buyer personas based on findings
   - For each: demographics, goals, frustrations, current solutions, decision-making process
   - Identify the primary persona (highest value / most common)

3. **Map jobs-to-be-done:**
   - Identify the functional, social, and emotional jobs the audience is hiring for
   - Map the "when" — what triggers the need
   - Document desired outcomes and success metrics from the audience's perspective

4. **Identify pain points and objections:**
   - What frustrates them about current solutions?
   - What prevents them from switching or buying?
   - What questions do they ask before purchasing?
   - Mine forums, review sites, and social media for unfiltered language

5. **Map the buyer journey:**
   - Document awareness → consideration → decision stages
   - Identify touchpoints and information needs at each stage
   - Note where they research, who influences them, and what content they consume

6. **Write the artifact** — append to `.singularskills/marketing/<project>/00-strategy.md` under a `## Customer Research` section. Create the file with a `# Strategy — <project>` heading if it does not exist; if a `## Customer Research` section already exists, replace only that section. The section contains:
   - **Personas** — 2-3 detailed buyer personas
   - **Jobs to Be Done** — functional, social, emotional jobs
   - **Pain Points & Objections** — frustrations, barriers, common questions
   - **Buyer Journey** — stages, touchpoints, information needs
   - **Key Insights** — top 3-5 actionable insights

## Output

Customer research appended to `.singularskills/marketing/<project>/00-strategy.md`. Present a summary highlighting:
- Primary persona profile
- Top pain points discovered
- Most important insight for messaging

**Record the run.** Append each of these events to `.singularskills/log.jsonl` as one line (create the folder and file if missing):

- Before you start work: `{"ts":"<ISO timestamp>","skill":"marketing-customer-research","workflow":"marketing","phase":0,"project":"<project>","event":"started","artifact":"00-strategy.md","note":""}`
- After you have written your section: the same line with `"event":"finished"`.

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

Open your `## Customer Research` section with one italic line, `*<skill name> · <ISO timestamp> · gate: none*` (your skill name is `marketing-customer-research`).

End your section with `### Decisions` and `### Open questions` (one level under your `## Customer Research` heading, so the section stays one block), in this shape:

```markdown
### Decisions
- <what was chosen> — <why> — <what was rejected>

### Open questions
- <what the next phase or a reviewer must settle>
```

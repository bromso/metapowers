---
name: marketing-ad-creative
description: Generate ad copy and creative briefs per platform — headline and description variants within character limits, angles and visual direction. Use when the user needs the actual words and visuals for search, social or display ads. Not for campaign structure, targeting and budget; see /marketing-paid-ads.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: marketing
  phase: 3
  artifact: 03-convert.md
---

# Ad Creative

Generate ad copy and creative briefs for "$ARGUMENTS". Create platform-specific ad variations with headlines, descriptions, and creative direction.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"marketing-ad-creative","workflow":"marketing","phase":3,"project":"<project>","event":"skipped","artifact":"03-convert.md","note":"<reason or \"none given\">"}`.

## Prerequisites

Run this skill's gate before writing: `sh <this skill's folder>/scripts/gate.sh <project> <project root>`, where `<project root>` is the folder that contains `.singularskills/` (use `.` when you are already there). If it exits non-zero, stop and tell the user what it printed, unless `--skip-checks` was given (see Arguments). On a refusal, before you stop, append this line to `.singularskills/log.jsonl` (create the folder and file if missing): `{"ts":"<ISO timestamp>","skill":"marketing-ad-creative","workflow":"marketing","phase":3,"project":"<project>","event":"refused","artifact":"03-convert.md","note":"<what the gate printed>"}`. Once the gate has passed, or under `--skip-checks` once you have appended the `skipped` line, append this line before you start work: `{"ts":"<ISO timestamp>","skill":"marketing-ad-creative","workflow":"marketing","phase":3,"project":"<project>","event":"started","artifact":"03-convert.md","note":""}`.

Read `.singularskills/marketing/<project>/00-strategy.md`. If this file does not exist, tell the user:

> Phase 0 (Strategy) has not been completed for "<project>". Run `/marketing-customer-research <project>` first, or use `--skip-checks` to bypass.

## Process

1. **Read context:**
   - Read `.singularskills/marketing/<project>/00-strategy.md` for messaging and positioning
   - Read `.singularskills/marketing/<project>/03-convert.md` if it exists (for campaign context)

2. **Define ad format requirements:**
   - Platform and ad type (search, display, social feed, video, carousel)
   - Character limits per field
   - Image/video specs if applicable
   - Number of variants needed

3. **Write ad copy variants:**
   - For search ads: 5+ headline variants (30 chars), 3+ description variants (90 chars)
   - For social ads: primary text, headline, description, CTA button
   - Apply different angles: benefit-led, problem-led, social-proof-led, urgency-led
   - Use audience language from customer research

4. **Creative brief (for visual ads):**
   - Visual direction and mood
   - Required elements (logo, product shot, CTA)
   - Color palette and brand guidelines
   - Image vs. illustration vs. video recommendation
   - A/B test variants for creative

5. **Write the artifact** — append to `.singularskills/marketing/<project>/03-convert.md` under a `## Ad Creative` section. Create the file with a `# Convert — <project>` heading if it does not exist; if a `## Ad Creative` section already exists, replace only that section. The section contains:
   - **Ad Specs** — platform, format, character limits
   - **Copy Variants** — all headline and description options
   - **Creative Brief** — visual direction for design team
   - **A/B Test Plan** — which variants to test first
   - **Performance Hypotheses** — which angles should win and why

## Output

Ad creative appended to `.singularskills/marketing/<project>/03-convert.md`. Present all copy variants in a scannable format for easy review.

**Record the run.** After you have written your section, append this line to `.singularskills/log.jsonl` (the `started` line of Prerequisites, with `"event":"finished"`): `{"ts":"<ISO timestamp>","skill":"marketing-ad-creative","workflow":"marketing","phase":3,"project":"<project>","event":"finished","artifact":"03-convert.md","note":""}`.

This artifact is shared by every skill of phase 3 (Convert). The frontmatter is written once, by whoever creates the file: if you create it, open it with the block below (`skill` is the phase title, `started` the time of that first write; `gate` is `passed` when the gate ran clean and `skipped` under `--skip-checks`); if it already exists, leave the block alone except to update `finished` and to set `gate` to the worst value among the sections (`skipped` over `passed`).

```yaml
---
skill: Convert
workflow: marketing
phase: 3
project: <project>
started: <ISO timestamp>
finished: <ISO timestamp>
agent: <the agent you run in, or "unknown">
gate: <passed|skipped>
---
```

Open your `## Ad Creative` section with one italic line, `*<skill name> · <ISO timestamp> · gate: <passed|skipped>*` (your skill name is `marketing-ad-creative`).

End your section with `### Decisions` and `### Open questions` (one level under your `## Ad Creative` heading, so the section stays one block), in this shape:

```markdown
### Decisions
- <what was chosen> — <why> — <what was rejected>

### Open questions
- <what the next phase or a reviewer must settle>
```

---
name: marketing-social-content
description: Plan social media content — which platforms, native formats, reusable post templates and hooks, posting cadence and the first ten posts. Use when the user wants to post consistently on LinkedIn, X, Instagram, TikTok or similar and needs to know what and when. Not for overall content pillars and an editorial calendar; see /marketing-content-strategy.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: marketing
  phase: 1
  artifact: 01-reach.md
---

# Social Content

Develop a social media content strategy for "$ARGUMENTS". Plan content themes, formats, posting schedule, and platform-specific tactics.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"marketing-social-content","workflow":"marketing","phase":1,"project":"<project>","event":"skipped","artifact":"01-reach.md","note":"<reason or \"none given\">"}`.

## Prerequisites

Run this skill's gate before writing: `sh <this skill's folder>/scripts/gate.sh <project> <project root>`, where `<project root>` is the folder that contains `.singularskills/` (use `.` when you are already there). If it exits non-zero, stop and tell the user what it printed, unless `--skip-checks` was given (see Arguments). On a refusal, before you stop, append this line to `.singularskills/log.jsonl` (create the folder and file if missing): `{"ts":"<ISO timestamp>","skill":"marketing-social-content","workflow":"marketing","phase":1,"project":"<project>","event":"refused","artifact":"01-reach.md","note":"<what the gate printed>"}`. Once the gate has passed, or under `--skip-checks` once you have appended the `skipped` line, append this line before you start work: `{"ts":"<ISO timestamp>","skill":"marketing-social-content","workflow":"marketing","phase":1,"project":"<project>","event":"started","artifact":"01-reach.md","note":""}`.

Read `.singularskills/marketing/<project>/00-strategy.md`. If this file does not exist, tell the user:

> Phase 0 (Strategy) has not been completed for "<project>". Run `/marketing-customer-research <project>` first, or use `--skip-checks` to bypass.

## Process

1. **Read context:**
   - Read `.singularskills/marketing/<project>/00-strategy.md` for audience personas and messaging
   - Read `.singularskills/marketing/<project>/01-reach.md` if it exists (for content pillars)

2. **Platform selection:**
   - Where is the target audience most active? (LinkedIn, X/Twitter, Instagram, TikTok, YouTube, Reddit)
   - Match platforms to audience personas and content types
   - Recommend primary (1-2) and secondary (1-2) platforms

3. **Content themes and formats:**
   - Map content pillars to social-native formats
   - Per platform: what formats perform best? (carousels, threads, short video, images, text)
   - Content mix: educational, entertaining, promotional, community (recommend ratio)
   - User-generated content and community engagement opportunities

4. **Create content templates:**
   - 3-5 repeatable content templates per primary platform
   - Hook formulas, caption structures, CTA patterns
   - Hashtag and keyword strategy per platform

5. **Scheduling and cadence:**
   - Recommended posting frequency per platform
   - Best posting times for the audience
   - Content batching and repurposing workflow

6. **Write the artifact** — append to `.singularskills/marketing/<project>/01-reach.md` under a `## Social Content` section. Create the file with a `# Reach — <project>` heading if it does not exist; if a `## Social Content` section already exists, replace only that section. The section contains:
   - **Platform Strategy** — selected platforms with rationale
   - **Content Themes** — mapped to pillars and formats
   - **Content Templates** — repeatable post formats
   - **Scheduling Plan** — frequency, timing, batching
   - **First 10 Posts** — specific post ideas to start with

## Output

Social content strategy appended to `.singularskills/marketing/<project>/01-reach.md`. Present a summary highlighting:
- Recommended platforms and why
- Content mix ratio
- First 5 post ideas to publish

**Record the run.** After you have written your section, append this line to `.singularskills/log.jsonl` (the `started` line of Prerequisites, with `"event":"finished"`): `{"ts":"<ISO timestamp>","skill":"marketing-social-content","workflow":"marketing","phase":1,"project":"<project>","event":"finished","artifact":"01-reach.md","note":""}`.

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

Open your `## Social Content` section with one italic line, `*<skill name> · <ISO timestamp> · gate: <passed|skipped>*` (your skill name is `marketing-social-content`).

End your section with `### Decisions` and `### Open questions` (one level under your `## Social Content` heading, so the section stays one block), in this shape:

```markdown
### Decisions
- <what was chosen> — <why> — <what was rejected>

### Open questions
- <what the next phase or a reviewer must settle>
```

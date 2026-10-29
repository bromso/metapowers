---
name: marketing-community-marketing
description: Build a community-led growth strategy — where the audience already gathers, whether to own or join a community, platform choice, and ambassador, UGC and event programs. Use when the user wants to grow through a Discord, Slack, forum or user community rather than ads.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: marketing
  phase: 1
  artifact: 01-reach.md
---

# Community Marketing

Develop a community-led growth strategy for "$ARGUMENTS". Plan community channels, engagement programs, and advocacy initiatives.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"marketing-community-marketing","workflow":"marketing","phase":1,"project":"<project>","event":"skipped","artifact":"01-reach.md","note":"<reason or \"none given\">"}`.

## Prerequisites

Run this skill's gate before writing: `sh <this skill's folder>/scripts/gate.sh <project> <project root>`, where `<project root>` is the folder that contains `.singularskills/` (use `.` when you are already there). If it exits non-zero, stop and tell the user what it printed, unless `--skip-checks` was given (see Arguments). On a refusal, before you stop, append this line to `.singularskills/log.jsonl` (create the folder and file if missing): `{"ts":"<ISO timestamp>","skill":"marketing-community-marketing","workflow":"marketing","phase":1,"project":"<project>","event":"refused","artifact":"01-reach.md","note":"<what the gate printed>"}`. Once the gate has passed, or under `--skip-checks` once you have appended the `skipped` line, append this line before you start work: `{"ts":"<ISO timestamp>","skill":"marketing-community-marketing","workflow":"marketing","phase":1,"project":"<project>","event":"started","artifact":"01-reach.md","note":""}`.

Read `.singularskills/marketing/<project>/00-strategy.md`. If this file does not exist, tell the user:

> Phase 0 (Strategy) has not been completed for "<project>". Run `/marketing-customer-research <project>` first, or use `--skip-checks` to bypass.

## Process

1. **Read context:**
   - Read `.singularskills/marketing/<project>/00-strategy.md` for audience and positioning

2. **Community landscape research:**
   - Use WebSearch to find where the audience already gathers (Reddit, Discord, Slack, forums, Facebook groups)
   - Identify existing communities to participate in vs. building your own
   - Analyze successful community strategies from competitors

3. **Community strategy:**
   - Own vs. participate: should "<project>" build a community or join existing ones?
   - Platform selection for owned community (Discord, Slack, Circle, forum)
   - Community value proposition — why would someone join?
   - Moderation and governance approach

4. **Engagement programs:**
   - Ambassador or champion programs
   - User-generated content initiatives
   - Community events (AMAs, workshops, meetups)
   - Knowledge sharing and peer support

5. **Write the artifact** — append to `.singularskills/marketing/<project>/01-reach.md` under a `## Community Marketing` section. Create the file with a `# Reach — <project>` heading if it does not exist; if a `## Community Marketing` section already exists, replace only that section. The section contains:
   - **Community Landscape** — existing communities to engage with
   - **Owned Community Plan** — platform, value prop, launch plan
   - **Engagement Programs** — ambassador, UGC, events
   - **Growth Metrics** — community health metrics to track

## Output

Community marketing strategy appended to `.singularskills/marketing/<project>/01-reach.md`. Present a summary highlighting:
- Recommended community approach (own vs. participate)
- Top existing communities to engage with
- First community initiative to launch

**Record the run.** After you have written your section, append this line to `.singularskills/log.jsonl` (the `started` line of Prerequisites, with `"event":"finished"`): `{"ts":"<ISO timestamp>","skill":"marketing-community-marketing","workflow":"marketing","phase":1,"project":"<project>","event":"finished","artifact":"01-reach.md","note":""}`.

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

Open your `## Community Marketing` section with one italic line, `*<skill name> · <ISO timestamp> · gate: <passed|skipped>*` (your skill name is `marketing-community-marketing`).

End your section with `### Decisions` and `### Open questions` (one level under your `## Community Marketing` heading, so the section stays one block), in this shape:

```markdown
### Decisions
- <what was chosen> — <why> — <what was rejected>

### Open questions
- <what the next phase or a reviewer must settle>
```

---
name: marketing-launch-strategy
description: Plan a product or feature launch from pre-launch buildup through an hour-by-hour launch day to two weeks of follow-up, channel by channel. Use when the user has a launch date coming up, such as a Product Hunt launch, a new feature or a market entry. Not for brainstorming campaign ideas; see /marketing-marketing-ideas.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: marketing
  phase: 1
  artifact: 01-reach.md
---

# Launch Strategy

Plan and structure a launch campaign for "$ARGUMENTS". Cover pre-launch, launch day, and post-launch activities across all channels.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"<skill name>","workflow":"marketing","phase":<phase>,"project":"<project>","event":"skipped","artifact":"<artifact file>","note":"<reason or \"none given\">"}`.

## Prerequisites

Run `scripts/gate.sh <project>` from this skill's folder. If it exits non-zero, stop and tell the user what it printed (unless `--skip-checks`, see Arguments).

Read `.singularskills/marketing/<project>/00-strategy.md`. If this file does not exist, tell the user:

> Phase 0 (Strategy) has not been completed for "<project>". Run `/marketing-customer-research <project>` first, or use `--skip-checks` to bypass.

## Process

1. **Read context:**
   - Read `.singularskills/marketing/<project>/00-strategy.md` for positioning and audience
   - Read `.singularskills/marketing/<project>/01-reach.md` if it exists (for channel context)

2. **Define launch goals and type:**
   - Launch type: new product, new feature, major update, rebrand, or market entry
   - Primary goal: awareness, signups, revenue, press coverage
   - Success metrics with specific targets

3. **Pre-launch planning (2-4 weeks before):**
   - Waitlist or early access strategy
   - Teaser content and social buildup
   - Press and influencer outreach list
   - Product Hunt or launch platform preparation
   - Email list segmentation and pre-launch nurture
   - Internal readiness checklist

4. **Launch day execution:**
   - Hour-by-hour launch day timeline
   - Channel-specific activities (email, social, PR, paid, community)
   - Live engagement plan (social responses, community Q&A)
   - Contingency plans for common issues

5. **Post-launch follow-up (1-2 weeks after):**
   - Performance tracking and reporting
   - Follow-up content and engagement
   - User feedback collection
   - Iteration and optimization based on data

6. **Write the artifact** — append to `.singularskills/marketing/<project>/01-reach.md` under a `## Launch Strategy` section. Create the file with a `# Reach — <project>` heading if it does not exist; if a `## Launch Strategy` section already exists, replace only that section. The section contains:
   - **Launch Overview** — type, goals, success metrics
   - **Pre-Launch Plan** — timeline and activities
   - **Launch Day Playbook** — hour-by-hour execution
   - **Post-Launch Plan** — follow-up and optimization
   - **Channel Checklist** — per-channel launch activities

## Output

Launch strategy appended to `.singularskills/marketing/<project>/01-reach.md`. Present a summary highlighting:
- Launch type and primary goal
- Key pre-launch activities and timeline
- Launch day critical path

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

Open your `## Launch Strategy` section with one italic line, `*<skill name> · <ISO timestamp> · gate: <passed|skipped>*` (your skill name is `marketing-launch-strategy`).

End your section with `### Decisions` and `### Open questions` (one level under your `## Launch Strategy` heading, so the section stays one block), in this shape:

```markdown
### Decisions
- <what was chosen> — <why> — <what was rejected>

### Open questions
- <what the next phase or a reviewer must settle>
```

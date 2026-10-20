---
name: launch-strategy
description: Plan and execute product or feature launches
argument-hint: "[project] [--skip-checks]"
---

# Launch Strategy

Plan and structure a launch campaign for "$ARGUMENTS". Cover pre-launch, launch day, and post-launch activities across all channels.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.metapowers/marketing/<project>/skip-log.md`: `- <ISO timestamp> — <skill name> skipped prerequisite check for <artifact file> — reason: <reason or "none given">`.

## Prerequisites

Read `.metapowers/marketing/<project>/00-strategy.md`. If this file does not exist, tell the user:

> Phase 0 (Strategy) has not been completed for "<project>". Run `/marketing:customer-research <project>` first, or use `--skip-checks` to bypass.

## Process

1. **Read context:**
   - Read `.metapowers/marketing/<project>/00-strategy.md` for positioning and audience
   - Read `.metapowers/marketing/<project>/01-reach.md` if it exists (for channel context)

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

6. **Write the artifact** — append to `.metapowers/marketing/<project>/01-reach.md` under a `## Launch Strategy` section. Create the file with a `# Reach — <project>` heading if it does not exist; if a `## Launch Strategy` section already exists, replace only that section. The section contains:
   - **Launch Overview** — type, goals, success metrics
   - **Pre-Launch Plan** — timeline and activities
   - **Launch Day Playbook** — hour-by-hour execution
   - **Post-Launch Plan** — follow-up and optimization
   - **Channel Checklist** — per-channel launch activities

## Output

Launch strategy appended to `.metapowers/marketing/<project>/01-reach.md`. Present a summary highlighting:
- Launch type and primary goal
- Key pre-launch activities and timeline
- Launch day critical path

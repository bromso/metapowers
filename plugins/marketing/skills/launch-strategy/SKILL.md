---
description: Product or feature launch planning and execution
---

# Launch Strategy

Plan and structure a launch campaign for "$ARGUMENTS". Cover pre-launch, launch day, and post-launch activities across all channels.

## Prerequisites

Read `.metapowers/marketing/$ARGUMENTS/00-strategy.md`. If this file does not exist, tell the user:

> Phase 0 (Strategy) has not been completed for "$ARGUMENTS". Run `/marketing:customer-research $ARGUMENTS` first, or use `--skip-checks` to bypass.

If `--skip-checks` is present in $ARGUMENTS, skip this check and log to `.metapowers/marketing/$ARGUMENTS/skip-log.md`.

## Process

1. **Read context:**
   - Read `.metapowers/marketing/$ARGUMENTS/00-strategy.md` for positioning and audience
   - Read `.metapowers/marketing/$ARGUMENTS/01-reach.md` if it exists (for channel context)

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

6. **Write the artifact** — append to `.metapowers/marketing/$ARGUMENTS/01-reach.md` under a `## Launch Strategy` section:
   - **Launch Overview** — type, goals, success metrics
   - **Pre-Launch Plan** — timeline and activities
   - **Launch Day Playbook** — hour-by-hour execution
   - **Post-Launch Plan** — follow-up and optimization
   - **Channel Checklist** — per-channel launch activities

## Output

Launch strategy appended to `.metapowers/marketing/$ARGUMENTS/01-reach.md`. Present a summary highlighting:
- Launch type and primary goal
- Key pre-launch activities and timeline
- Launch day critical path

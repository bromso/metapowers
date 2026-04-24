---
description: Build community-led growth strategy — forums, Discord, events, and advocacy
---

# Community Marketing

Develop a community-led growth strategy for "$ARGUMENTS". Plan community channels, engagement programs, and advocacy initiatives.

## Prerequisites

Read `.metapowers/marketing/$ARGUMENTS/00-strategy.md`. If this file does not exist, tell the user:

> Phase 0 (Strategy) has not been completed for "$ARGUMENTS". Run `/marketing:customer-research $ARGUMENTS` first, or use `--skip-checks` to bypass.

If `--skip-checks` is present in $ARGUMENTS, skip this check and log to `.metapowers/marketing/$ARGUMENTS/skip-log.md`.

## Process

1. **Read context:**
   - Read `.metapowers/marketing/$ARGUMENTS/00-strategy.md` for audience and positioning

2. **Community landscape research:**
   - Use WebSearch to find where the audience already gathers (Reddit, Discord, Slack, forums, Facebook groups)
   - Identify existing communities to participate in vs. building your own
   - Analyze successful community strategies from competitors

3. **Community strategy:**
   - Own vs. participate: should "$ARGUMENTS" build a community or join existing ones?
   - Platform selection for owned community (Discord, Slack, Circle, forum)
   - Community value proposition — why would someone join?
   - Moderation and governance approach

4. **Engagement programs:**
   - Ambassador or champion programs
   - User-generated content initiatives
   - Community events (AMAs, workshops, meetups)
   - Knowledge sharing and peer support

5. **Write the artifact** — append to `.metapowers/marketing/$ARGUMENTS/01-reach.md` under a `## Community Marketing` section:
   - **Community Landscape** — existing communities to engage with
   - **Owned Community Plan** — platform, value prop, launch plan
   - **Engagement Programs** — ambassador, UGC, events
   - **Growth Metrics** — community health metrics to track

## Output

Community marketing strategy appended to `.metapowers/marketing/$ARGUMENTS/01-reach.md`. Present a summary highlighting:
- Recommended community approach (own vs. participate)
- Top existing communities to engage with
- First community initiative to launch

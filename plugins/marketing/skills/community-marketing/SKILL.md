---
description: Build community-led growth strategy — forums, Discord, events, and advocacy
---

# Community Marketing

Develop a community-led growth strategy for "$ARGUMENTS". Plan community channels, engagement programs, and advocacy initiatives.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.metapowers/marketing/<project>/skip-log.md`: `- <ISO timestamp> — <skill name> skipped prerequisite check for <artifact file> — reason: <reason or "none given">`.

## Prerequisites

Read `.metapowers/marketing/<project>/00-strategy.md`. If this file does not exist, tell the user:

> Phase 0 (Strategy) has not been completed for "<project>". Run `/marketing:customer-research <project>` first, or use `--skip-checks` to bypass.

## Process

1. **Read context:**
   - Read `.metapowers/marketing/<project>/00-strategy.md` for audience and positioning

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

5. **Write the artifact** — append to `.metapowers/marketing/<project>/01-reach.md` under a `## Community Marketing` section. Create the file with a `# Reach — <project>` heading if it does not exist; if a `## Community Marketing` section already exists, replace only that section. The section contains:
   - **Community Landscape** — existing communities to engage with
   - **Owned Community Plan** — platform, value prop, launch plan
   - **Engagement Programs** — ambassador, UGC, events
   - **Growth Metrics** — community health metrics to track

## Output

Community marketing strategy appended to `.metapowers/marketing/<project>/01-reach.md`. Present a summary highlighting:
- Recommended community approach (own vs. participate)
- Top existing communities to engage with
- First community initiative to launch

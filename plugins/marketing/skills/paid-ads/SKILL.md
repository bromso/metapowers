---
description: Plan and optimize paid advertising campaigns
---

# Paid Ads

Plan paid advertising campaigns for "$ARGUMENTS". Design campaign structure, targeting, budget allocation, and optimization strategy.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.metapowers/marketing/<project>/skip-log.md`: `- <ISO timestamp> — <skill name> skipped prerequisite check for <artifact file> — reason: <reason or "none given">`.

## Prerequisites

Read `.metapowers/marketing/<project>/00-strategy.md`. If this file does not exist, tell the user:

> Phase 0 (Strategy) has not been completed for "<project>". Run `/marketing:customer-research <project>` first, or use `--skip-checks` to bypass.

## Process

1. **Read context:**
   - Read `.metapowers/marketing/<project>/00-strategy.md` for audience, positioning, and competitors
   - Read `.metapowers/marketing/<project>/02-act.md` if it exists (for landing page and copy context)
   - Read `${CLAUDE_PLUGIN_ROOT}/shared/campaign-plan-template.md` for structure

2. **Platform selection:**
   - Which platforms? Google Ads, Meta (Facebook/Instagram), LinkedIn, X, TikTok, Reddit
   - Match platform to audience and intent (search intent vs. interruption marketing)
   - Budget allocation per platform

3. **Campaign structure:**
   - Campaign hierarchy: campaigns → ad groups → ads
   - Targeting strategy per campaign: keywords, audiences, demographics, interests
   - Match types (for search): broad, phrase, exact
   - Negative keyword strategy
   - Retargeting setup: website visitors, cart abandoners, engaged users

4. **Budget and bidding:**
   - Recommended daily/monthly budget
   - Bidding strategy: manual CPC, target CPA, maximize conversions
   - Budget pacing and scaling plan
   - Expected CPC and CPA ranges for the category

5. **Optimization plan:**
   - Key metrics to monitor: CTR, CPC, CPA, ROAS, quality score
   - Optimization cadence (daily, weekly, monthly actions)
   - When to scale, pause, or restructure campaigns
   - Testing plan: ad copy, audiences, landing pages

6. **Write the artifact** — append to `.metapowers/marketing/<project>/03-convert.md` under a `## Paid Ads` section:
   - **Platform Strategy** — selected platforms with rationale
   - **Campaign Structure** — hierarchy, targeting, match types
   - **Budget Plan** — allocation, bidding, pacing
   - **Ad Copy Direction** — messaging angles per campaign
   - **Optimization Playbook** — metrics, cadence, scaling rules

## Output

Paid ads strategy appended to `.metapowers/marketing/<project>/03-convert.md`. Present a summary highlighting:
- Recommended platforms and budget split
- Campaign structure overview
- Expected CPA range

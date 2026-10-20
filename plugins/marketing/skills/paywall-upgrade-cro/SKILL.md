---
name: paywall-upgrade-cro
description: Optimize upgrade flows and paywall design
argument-hint: "[project] [--skip-checks]"
---

# Paywall & Upgrade CRO

Optimize the paywall and upgrade experience for "$ARGUMENTS". Design upgrade triggers, pricing page optimization, and conversion flows.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.metapowers/marketing/<project>/skip-log.md`: `- <ISO timestamp> — <skill name> skipped prerequisite check for <artifact file> — reason: <reason or "none given">`.

## Prerequisites

Read `.metapowers/marketing/<project>/00-strategy.md`. If this file does not exist, tell the user:

> Phase 0 (Strategy) has not been completed for "<project>". Run `/marketing:customer-research <project>` first, or use `--skip-checks` to bypass.

## Process

1. **Read context:**
   - Read `.metapowers/marketing/<project>/00-strategy.md` for pricing strategy
   - Read `.metapowers/marketing/<project>/04-engage.md` if it exists

2. **Analyze current paywall (if applicable):**
   - When and where does the user hit the paywall?
   - What's the messaging at the paywall moment?
   - Hard paywall vs. soft paywall vs. metered approach
   - How does it make the user feel? (frustrated vs. motivated)

3. **Optimize upgrade triggers:**
   - Usage-based triggers: hitting limits naturally during valuable workflows
   - Feature-based triggers: showing premium features with upgrade prompt
   - Timing-based triggers: trial ending, usage milestone
   - Social triggers: team features, collaboration needs

4. **Pricing page optimization:**
   - Tier presentation: recommended tier highlighting
   - Feature comparison clarity
   - Social proof on pricing page
   - FAQ and objection handling
   - Annual vs. monthly toggle design

5. **Write the artifact** — append to `.metapowers/marketing/<project>/04-engage.md` under a `## Paywall & Upgrade CRO` section. Create the file with a `# Engage — <project>` heading if it does not exist; if a `## Paywall & Upgrade CRO` section already exists, replace only that section. The section contains:
   - **Current Paywall Assessment** — strengths and friction
   - **Upgrade Trigger Design** — when and where to prompt
   - **Pricing Page Recommendations** — layout, copy, social proof
   - **A/B Test Ideas** — highest-impact tests
   - **Expected Impact** — estimated conversion lift

## Output

Paywall CRO analysis appended to `.metapowers/marketing/<project>/04-engage.md`. Present a summary highlighting:
- Top upgrade trigger opportunity
- Pricing page improvements
- Recommended first test

---
description: Optimize user onboarding for activation and retention
---

# Onboarding CRO

Optimize the user onboarding experience for "$ARGUMENTS". Design flows that get users to the "aha moment" faster and increase activation rates.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.metapowers/marketing/<project>/skip-log.md`: `- <ISO timestamp> — <skill name> skipped prerequisite check for <artifact file> — reason: <reason or "none given">`.

## Prerequisites

Read `.metapowers/marketing/<project>/00-strategy.md`. If this file does not exist, tell the user:

> Phase 0 (Strategy) has not been completed for "<project>". Run `/marketing:customer-research <project>` first, or use `--skip-checks` to bypass.

## Process

1. **Read context:**
   - Read `.metapowers/marketing/<project>/00-strategy.md` for audience context
   - Read `.metapowers/marketing/<project>/03-convert.md` if it exists (for signup flow context)

2. **Define the "aha moment":**
   - What action or outcome makes users understand the product's value?
   - How quickly can a new user reach it?
   - What's the current time-to-value?

3. **Map the onboarding flow:**
   - Current onboarding steps (if URL or flow provided)
   - Where do users drop off? (identify the biggest leak)
   - Which steps are essential vs. optional?
   - Progressive disclosure: what can be deferred?

4. **Design improvements:**
   - Welcome experience: personalized based on use case or persona
   - Checklist or wizard: guided steps to activation
   - Empty states: helpful, not empty
   - Tooltips, tours, or contextual help
   - Onboarding emails: complement in-app experience
   - Success celebrations: reinforce progress

5. **Write the artifact** — append to `.metapowers/marketing/<project>/04-engage.md` under a `## Onboarding CRO` section. Create the file with a `# Engage — <project>` heading if it does not exist; if a `## Onboarding CRO` section already exists, replace only that section. The section contains:
   - **Aha Moment Definition** — the activation event
   - **Current Flow Assessment** — steps and drop-off points
   - **Recommended Flow** — optimized onboarding design
   - **In-App + Email Coordination** — how both channels work together
   - **Activation Metrics** — what to track

## Output

Onboarding CRO strategy appended to `.metapowers/marketing/<project>/04-engage.md`. Present a summary highlighting:
- Defined aha moment
- Biggest onboarding friction point
- Top 3 improvements to implement

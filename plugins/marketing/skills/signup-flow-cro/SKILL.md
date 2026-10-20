---
description: Optimize signup and trial conversion flows
---

# Signup Flow CRO

Optimize the signup and trial conversion flow for "$ARGUMENTS". Reduce friction, increase activation, and improve trial-to-paid conversion.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.metapowers/marketing/<project>/skip-log.md`: `- <ISO timestamp> — <skill name> skipped prerequisite check for <artifact file> — reason: <reason or "none given">`.

## Prerequisites

Read `.metapowers/marketing/<project>/00-strategy.md`. If this file does not exist, tell the user:

> Phase 0 (Strategy) has not been completed for "<project>". Run `/marketing:customer-research <project>` first, or use `--skip-checks` to bypass.

## Process

1. **Read context:**
   - Read `.metapowers/marketing/<project>/00-strategy.md` for audience and pricing
   - Read `.metapowers/marketing/<project>/02-act.md` if it exists (for page and form CRO context)

2. **Map the current flow (if URL provided):**
   - Use WebFetch to walk through the signup flow
   - Document every step: pages, forms, emails, activation steps
   - Identify drop-off points and friction

3. **Signup page optimization:**
   - Value proposition clarity on signup page
   - Social proof placement
   - Form field minimization (name + email is ideal)
   - SSO/social login options
   - Mobile signup experience

4. **Activation optimization:**
   - What is the "aha moment"? How quickly can users reach it?
   - Onboarding checklist or wizard design
   - Empty state design — what does the user see first?
   - Time-to-value: how to reduce it

5. **Trial-to-paid conversion:**
   - Trial length recommendation
   - In-trial engagement tactics (progress emails, usage prompts)
   - Upgrade triggers: what behavior indicates readiness?
   - Pricing page from within the product
   - Payment friction reduction

6. **Write the artifact** — append to `.metapowers/marketing/<project>/03-convert.md` under a `## Signup Flow CRO` section. Create the file with a `# Convert — <project>` heading if it does not exist; if a `## Signup Flow CRO` section already exists, replace only that section. The section contains:
   - **Current Flow Map** — step-by-step with friction points
   - **Signup Page Recommendations** — optimization list
   - **Activation Strategy** — path to aha moment
   - **Trial-to-Paid Plan** — engagement and conversion tactics
   - **A/B Test Ideas** — highest-impact tests

## Output

Signup flow analysis appended to `.metapowers/marketing/<project>/03-convert.md`. Present a summary highlighting:
- Biggest friction point identified
- Recommended activation improvements
- Expected conversion lift

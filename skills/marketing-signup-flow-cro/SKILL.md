---
name: marketing-signup-flow-cro
description: Optimize the in-product path from signup to paid plan for a trial product — signup friction, SSO, first steps and upgrade prompts. Use when visitors abandon signup before creating an account, or trials end without converting. Not for onboarding, a freemium paywall or trial emails; see /marketing-onboarding-cro, /marketing-paywall-upgrade-cro or /marketing-email-sequence.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: marketing
  phase: 3
  artifact: 03-convert.md
---

# Signup Flow CRO

Optimize the signup and trial conversion flow for "$ARGUMENTS". Reduce friction, increase activation, and improve trial-to-paid conversion.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"<skill name>","workflow":"marketing","phase":<phase>,"project":"<project>","event":"skipped","artifact":"<artifact file>","note":"<reason or \"none given\">"}`.

## Prerequisites

Run `scripts/gate.sh <project>` from this skill's folder. If it exits non-zero, stop and tell the user what it printed (unless `--skip-checks`, see Arguments).

Read `.singularskills/marketing/<project>/00-strategy.md`. If this file does not exist, tell the user:

> Phase 0 (Strategy) has not been completed for "<project>". Run `/marketing-customer-research <project>` first, or use `--skip-checks` to bypass.

## Process

1. **Read context:**
   - Read `.singularskills/marketing/<project>/00-strategy.md` for audience and pricing
   - Read `.singularskills/marketing/<project>/02-act.md` if it exists (for page and form CRO context)

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
   - In-trial email nudges — hand off to `/marketing-email-sequence`; keep the in-product prompts here.
   - Upgrade triggers: what behavior indicates readiness?
   - Pricing page from within the product
   - Payment friction reduction

6. **Write the artifact** — append to `.singularskills/marketing/<project>/03-convert.md` under a `## Signup Flow CRO` section. Create the file with a `# Convert — <project>` heading if it does not exist; if a `## Signup Flow CRO` section already exists, replace only that section. The section contains:
   - **Current Flow Map** — step-by-step with friction points
   - **Signup Page Recommendations** — optimization list
   - **Activation Strategy** — path to aha moment
   - **Trial-to-Paid Plan** — engagement and conversion tactics
   - **A/B Test Ideas** — highest-impact tests

## Output

Signup flow analysis appended to `.singularskills/marketing/<project>/03-convert.md`. Present a summary highlighting:
- Biggest friction point identified
- Recommended activation improvements
- Expected conversion lift

**Record the run.** This artifact is shared by every skill of phase 3 (Convert). The frontmatter is written once, by whoever creates the file: if you create it, open it with the block below (`skill` is the phase title, `started` the time of that first write; `gate` is `passed` when the gate ran clean and `skipped` under `--skip-checks`); if it already exists, leave the block alone except to update `finished` and to set `gate` to the worst value among the sections (`skipped` over `passed`).

```yaml
---
skill: Convert
workflow: marketing
phase: 3
project: <project>
started: <ISO timestamp>
finished: <ISO timestamp>
agent: <the agent you run in, or "unknown">
gate: <passed|skipped>
---
```

Open your `## Signup Flow CRO` section with one italic line, `*<skill name> · <ISO timestamp> · gate: <passed|skipped>*` (your skill name is `marketing-signup-flow-cro`).

End your section with `### Decisions` and `### Open questions` (one level under your `## Signup Flow CRO` heading, so the section stays one block), in this shape:

```markdown
### Decisions
- <what was chosen> — <why> — <what was rejected>

### Open questions
- <what the next phase or a reviewer must settle>
```

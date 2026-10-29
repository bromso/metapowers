---
name: marketing-onboarding-cro
description: Optimize the first-run experience after signup — define the aha moment, then redesign welcome, checklists, empty states, tours and onboarding emails around it. Use when new users sign up but never activate or drop off in the first days. Not for the signup or trial-to-paid step, or paying customers cancelling or downgrading; see /marketing-signup-flow-cro or /marketing-churn-prevention.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: marketing
  phase: 4
  artifact: 04-engage.md
---

# Onboarding CRO

Optimize the user onboarding experience for "$ARGUMENTS". Design flows that get users to the "aha moment" faster and increase activation rates.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"marketing-onboarding-cro","workflow":"marketing","phase":4,"project":"<project>","event":"skipped","artifact":"04-engage.md","note":"<reason or \"none given\">"}`.

## Prerequisites

Run this skill's gate before writing: `sh <this skill's folder>/scripts/gate.sh <project> <project root>`, where `<project root>` is the folder that contains `.singularskills/` (use `.` when you are already there). If it exits non-zero, stop and tell the user what it printed, unless `--skip-checks` was given (see Arguments). On a refusal, before you stop, append this line to `.singularskills/log.jsonl` (create the folder and file if missing): `{"ts":"<ISO timestamp>","skill":"marketing-onboarding-cro","workflow":"marketing","phase":4,"project":"<project>","event":"refused","artifact":"04-engage.md","note":"<what the gate printed>"}`. Once the gate has passed, or under `--skip-checks` once you have appended the `skipped` line, append this line before you start work: `{"ts":"<ISO timestamp>","skill":"marketing-onboarding-cro","workflow":"marketing","phase":4,"project":"<project>","event":"started","artifact":"04-engage.md","note":""}`.

Read `.singularskills/marketing/<project>/00-strategy.md`. If this file does not exist, tell the user:

> Phase 0 (Strategy) has not been completed for "<project>". Run `/marketing-customer-research <project>` first, or use `--skip-checks` to bypass.

## Process

1. **Read context:**
   - Read `.singularskills/marketing/<project>/00-strategy.md` for audience context
   - Read `.singularskills/marketing/<project>/03-convert.md` if it exists (for signup flow context)

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

5. **Write the artifact** — append to `.singularskills/marketing/<project>/04-engage.md` under a `## Onboarding CRO` section. Create the file with a `# Engage — <project>` heading if it does not exist; if a `## Onboarding CRO` section already exists, replace only that section. The section contains:
   - **Aha Moment Definition** — the activation event
   - **Current Flow Assessment** — steps and drop-off points
   - **Recommended Flow** — optimized onboarding design
   - **In-App + Email Coordination** — how both channels work together
   - **Activation Metrics** — what to track

## Output

Onboarding CRO strategy appended to `.singularskills/marketing/<project>/04-engage.md`. Present a summary highlighting:
- Defined aha moment
- Biggest onboarding friction point
- Top 3 improvements to implement

**Record the run.** After you have written your section, append this line to `.singularskills/log.jsonl` (the `started` line of Prerequisites, with `"event":"finished"`): `{"ts":"<ISO timestamp>","skill":"marketing-onboarding-cro","workflow":"marketing","phase":4,"project":"<project>","event":"finished","artifact":"04-engage.md","note":""}`.

This artifact is shared by every skill of phase 4 (Engage). The frontmatter is written once, by whoever creates the file: if you create it, open it with the block below (`skill` is the phase title, `started` the time of that first write; `gate` is `passed` when the gate ran clean and `skipped` under `--skip-checks`); if it already exists, leave the block alone except to update `finished` and to set `gate` to the worst value among the sections (`skipped` over `passed`).

```yaml
---
skill: Engage
workflow: marketing
phase: 4
project: <project>
started: <ISO timestamp>
finished: <ISO timestamp>
agent: <the agent you run in, or "unknown">
gate: <passed|skipped>
---
```

Open your `## Onboarding CRO` section with one italic line, `*<skill name> · <ISO timestamp> · gate: <passed|skipped>*` (your skill name is `marketing-onboarding-cro`).

End your section with `### Decisions` and `### Open questions` (one level under your `## Onboarding CRO` heading, so the section stays one block), in this shape:

```markdown
### Decisions
- <what was chosen> — <why> — <what was rejected>

### Open questions
- <what the next phase or a reviewer must settle>
```

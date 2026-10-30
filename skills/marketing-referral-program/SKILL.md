---
name: marketing-referral-program
description: Design a referral program — referrer and friend rewards, qualification rules, sharing mechanics, fraud limits and promotion. Use when the user wants existing customers to bring in new ones or asks about refer-a-friend incentives.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: marketing
  phase: 4
  artifact: 04-engage.md
---

# Referral Program

Design a referral program for "$ARGUMENTS". Create incentive structures, mechanics, and promotion strategies that turn customers into advocates.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"marketing-referral-program","workflow":"marketing","phase":4,"project":"<project>","event":"skipped","artifact":"04-engage.md","note":"<reason or \"none given\">"}`.

## Prerequisites

**Part of a workflow.** This skill is phase 4 (Engage) of the RACE Framework workflow (`marketing`); cross-domain workflows run it too. Unless the user named this skill, check `.singularskills/log.jsonl` for an open run for this project: a `run-started` line with `"project":"<project>"` and no later `run-finished` line for the same `workflow` and `project`. If there is no open run, or the user asked to start, run, continue or resume a process or workflow rather than this one step, do not continue here: invoke the `workflow` skill with the workflow the user asked for, or `marketing` when they named none, followed by `<project>`. It runs this phase in order, asks before it writes and records the run. Continue here when the user named this skill, or when an open run exists (the conductor is running you).

Run this skill's gate before writing: `sh <this skill's folder>/scripts/gate.sh <project> <project root>`, where `<project root>` is the folder that contains `.singularskills/` (use `.` when you are already there). If it exits non-zero, stop and tell the user what it printed, unless `--skip-checks` was given (see Arguments). On a refusal, before you stop, append this line to `.singularskills/log.jsonl` (create the folder and file if missing): `{"ts":"<ISO timestamp>","skill":"marketing-referral-program","workflow":"marketing","phase":4,"project":"<project>","event":"refused","artifact":"04-engage.md","note":"<what the gate printed>"}`. Once the gate has passed, or under `--skip-checks` once you have appended the `skipped` line, append this line before you start work: `{"ts":"<ISO timestamp>","skill":"marketing-referral-program","workflow":"marketing","phase":4,"project":"<project>","event":"started","artifact":"04-engage.md","note":""}`.

Read `.singularskills/marketing/<project>/00-strategy.md`. If this file does not exist, tell the user:

> Phase 0 (Strategy) has not been completed for "<project>". Run `/marketing-customer-research <project>` first, or use `--skip-checks` to bypass.

## Process

1. **Read context:**
   - Read `.singularskills/marketing/<project>/00-strategy.md` for audience and product context
   - Read `.singularskills/marketing/<project>/04-engage.md` if it exists

2. **Research referral models:**
   - Use WebSearch to find successful referral programs in the category
   - Analyze: single-sided vs. double-sided rewards, monetary vs. product-based incentives
   - What motivates users to refer? (savings, status, genuine value sharing)

3. **Design the program:**
   - Incentive structure: what does the referrer get? What does the referred get?
   - Reward type: credits, discounts, cash, extended features, swag
   - Qualification: what counts as a successful referral? (signup, activation, payment)
   - Limits: per-user caps, time limits, anti-fraud measures

4. **Mechanics and UX:**
   - Sharing mechanism: unique link, email invite, social share, in-product invite
   - Tracking and attribution
   - Where to promote the program (in-app, email, website, social)
   - Referral dashboard for users

5. **Write the artifact** — append to `.singularskills/marketing/<project>/04-engage.md` under a `## Referral Program` section. Create the file with a `# Engage — <project>` heading if it does not exist; if a `## Referral Program` section already exists, replace only that section. The section contains:
   - **Program Design** — incentives, mechanics, qualification
   - **UX Flow** — how users discover, share, and track referrals
   - **Promotion Plan** — where and how to promote the program
   - **Anti-Fraud Measures** — abuse prevention
   - **Success Metrics** — referral rate, viral coefficient, CAC impact

## Output

Referral program design appended to `.singularskills/marketing/<project>/04-engage.md`. Present a summary highlighting:
- Recommended incentive structure
- Expected viral coefficient
- Launch plan

**Record the run.** After you have written your section, append this line to `.singularskills/log.jsonl` (the `started` line of Prerequisites, with `"event":"finished"`): `{"ts":"<ISO timestamp>","skill":"marketing-referral-program","workflow":"marketing","phase":4,"project":"<project>","event":"finished","artifact":"04-engage.md","note":""}`.

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

Open your `## Referral Program` section with one italic line, `*<skill name> · <ISO timestamp> · gate: <passed|skipped>*` (your skill name is `marketing-referral-program`).

End your section with `### Decisions` and `### Open questions` (one level under your `## Referral Program` heading, so the section stays one block), in this shape:

```markdown
### Decisions
- <what was chosen> — <why> — <what was rejected>

### Open questions
- <what the next phase or a reviewer must settle>
```

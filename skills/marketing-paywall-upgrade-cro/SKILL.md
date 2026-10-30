---
name: marketing-paywall-upgrade-cro
description: Optimize the moment free users meet a paywall — upgrade triggers, limit messaging, hard versus soft paywall and pricing-page layout. Use when free or freemium users hit limits but do not upgrade, or the in-product upgrade prompt and pricing page convert poorly. Not for setting prices, tiers or packaging; see /marketing-pricing-strategy.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: marketing
  phase: 4
  artifact: 04-engage.md
---

# Paywall & Upgrade CRO

Optimize the paywall and upgrade experience for "$ARGUMENTS". Design upgrade triggers, pricing page optimization, and conversion flows.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"marketing-paywall-upgrade-cro","workflow":"marketing","phase":4,"project":"<project>","event":"skipped","artifact":"04-engage.md","note":"<reason or \"none given\">"}`.

## Prerequisites

**Part of a workflow.** This skill is phase 4 (Engage) of the RACE Framework workflow (`marketing`); cross-domain workflows run it too. First check `.singularskills/log.jsonl` for an open run for this project: a `run-started` line with `"project":"<project>"` and no later `run-finished` line for the same `workflow` and `project`. If one exists, the conductor is running you: continue here. Otherwise, if the user asked to start, run, continue or resume a process or workflow rather than this one step, do not continue here: invoke the `workflow` skill with the workflow the user asked for, or `marketing` when they named none, followed by `<project>`; it runs this phase in order, asks before it writes and records the run. Otherwise continue here: a later phase runs on its own, behind its gate.

Run this skill's gate before writing: `sh <this skill's folder>/scripts/gate.sh <project> <project root>`, where `<project root>` is the folder that contains `.singularskills/` (use `.` when you are already there). If it exits non-zero, stop and tell the user what it printed, unless `--skip-checks` was given (see Arguments). On a refusal, before you stop, append this line to `.singularskills/log.jsonl` (create the folder and file if missing): `{"ts":"<ISO timestamp>","skill":"marketing-paywall-upgrade-cro","workflow":"marketing","phase":4,"project":"<project>","event":"refused","artifact":"04-engage.md","note":"<what the gate printed>"}`. Once the gate has passed, or under `--skip-checks` once you have appended the `skipped` line, append this line before you start work: `{"ts":"<ISO timestamp>","skill":"marketing-paywall-upgrade-cro","workflow":"marketing","phase":4,"project":"<project>","event":"started","artifact":"04-engage.md","note":""}`.

Read `.singularskills/marketing/<project>/00-strategy.md`. If this file does not exist, tell the user:

> Phase 0 (Strategy) has not been completed for "<project>". Run `/marketing-customer-research <project>` first, or use `--skip-checks` to bypass.

## Process

1. **Read context:**
   - Read `.singularskills/marketing/<project>/00-strategy.md` for pricing strategy
   - Read `.singularskills/marketing/<project>/04-engage.md` if it exists

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

5. **Write the artifact** — append to `.singularskills/marketing/<project>/04-engage.md` under a `## Paywall & Upgrade CRO` section. Create the file with a `# Engage — <project>` heading if it does not exist; if a `## Paywall & Upgrade CRO` section already exists, replace only that section. The section contains:
   - **Current Paywall Assessment** — strengths and friction
   - **Upgrade Trigger Design** — when and where to prompt
   - **Pricing Page Recommendations** — layout, copy, social proof
   - **A/B Test Ideas** — highest-impact tests
   - **Expected Impact** — estimated conversion lift

## Output

Paywall CRO analysis appended to `.singularskills/marketing/<project>/04-engage.md`. Present a summary highlighting:
- Top upgrade trigger opportunity
- Pricing page improvements
- Recommended first test

**Record the run.** After you have written your section, append this line to `.singularskills/log.jsonl` (the `started` line of Prerequisites, with `"event":"finished"`): `{"ts":"<ISO timestamp>","skill":"marketing-paywall-upgrade-cro","workflow":"marketing","phase":4,"project":"<project>","event":"finished","artifact":"04-engage.md","note":""}`.

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

Open your `## Paywall & Upgrade CRO` section with one italic line, `*<skill name> · <ISO timestamp> · gate: <passed|skipped>*` (your skill name is `marketing-paywall-upgrade-cro`).

End your section with `### Decisions` and `### Open questions` (one level under your `## Paywall & Upgrade CRO` heading, so the section stays one block), in this shape:

```markdown
### Decisions
- <what was chosen> — <why> — <what was rejected>

### Open questions
- <what the next phase or a reviewer must settle>
```

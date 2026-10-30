---
name: marketing-ab-test-setup
description: Design an A/B test with a structured hypothesis, one-variable variants, primary and guardrail metrics, sample size, duration and a decision rule. Use when the user has a change in mind and asks how to test it properly or how long the experiment needs to run.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: marketing
  phase: 3
  artifact: 03-convert.md
---

# A/B Test Setup

Design rigorous A/B tests for "$ARGUMENTS". Create testable hypotheses, define variants, calculate sample sizes, and plan measurement.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"marketing-ab-test-setup","workflow":"marketing","phase":3,"project":"<project>","event":"skipped","artifact":"03-convert.md","note":"<reason or \"none given\">"}`.

## Prerequisites

**Part of a workflow.** This skill is phase 3 (Convert) of the RACE Framework workflow (`marketing`); cross-domain workflows run it too. First check `.singularskills/log.jsonl` for an open run for this project: a `run-started` line with `"project":"<project>"` and no later `run-finished` line for the same `workflow` and `project`. If one exists, the conductor is running you: continue here. Otherwise, if the user asked to start, run, continue or resume a process or workflow rather than this one step, do not continue here: invoke the `workflow` skill with the workflow the user asked for, or `marketing` when they named none, followed by `<project>`; it runs this phase in order, asks before it writes and records the run. Otherwise continue here: a later phase runs on its own, behind its gate.

Run this skill's gate before writing: `sh <this skill's folder>/scripts/gate.sh <project> <project root>`, where `<project root>` is the folder that contains `.singularskills/` (use `.` when you are already there). If it exits non-zero, stop and tell the user what it printed, unless `--skip-checks` was given (see Arguments). On a refusal, before you stop, append this line to `.singularskills/log.jsonl` (create the folder and file if missing): `{"ts":"<ISO timestamp>","skill":"marketing-ab-test-setup","workflow":"marketing","phase":3,"project":"<project>","event":"refused","artifact":"03-convert.md","note":"<what the gate printed>"}`. Once the gate has passed, or under `--skip-checks` once you have appended the `skipped` line, append this line before you start work: `{"ts":"<ISO timestamp>","skill":"marketing-ab-test-setup","workflow":"marketing","phase":3,"project":"<project>","event":"started","artifact":"03-convert.md","note":""}`.

Read `.singularskills/marketing/<project>/00-strategy.md`. If this file does not exist, tell the user:

> Phase 0 (Strategy) has not been completed for "<project>". Run `/marketing-customer-research <project>` first, or use `--skip-checks` to bypass.

## Process

1. **Read context:**
   - Read `.singularskills/marketing/<project>/00-strategy.md` for business context
   - Read `.singularskills/marketing/<project>/02-act.md` and `.singularskills/marketing/<project>/03-convert.md` if they exist (for CRO recommendations that need testing)

2. **Define the test:**
   - What are you testing? (headline, CTA, layout, pricing, flow)
   - Hypothesis format: "If we [change], then [metric] will [improve/decrease] by [amount], because [rationale]"
   - Primary metric (one clear success metric)
   - Secondary metrics (guard-rail metrics to watch)

3. **Design variants:**
   - Control (A): current experience
   - Treatment (B): specific change — one variable only
   - If multivariate: document variable matrix
   - Screenshots or mockups of each variant

4. **Statistical planning:**
   - Current baseline metric (conversion rate, click rate, etc.)
   - Minimum detectable effect (MDE): what improvement is meaningful?
   - Required sample size calculation
   - Expected test duration based on traffic
   - Statistical significance threshold (typically 95%)

5. **Implementation plan:**
   - Testing tool recommendation (if not already decided)
   - Traffic split: 50/50 or other
   - Segment targeting: who sees the test?
   - QA checklist before launch

6. **Write the artifact** — append to `.singularskills/marketing/<project>/03-convert.md` under a `## A/B Test: [Test Name]` section. Create the file with a `# Convert — <project>` heading if it does not exist; if a `## A/B Test: [Test Name]` section already exists, replace only that section. The section contains:
   - **Hypothesis** — structured hypothesis statement
   - **Variants** — control and treatment descriptions
   - **Metrics** — primary and secondary
   - **Statistical Plan** — sample size, duration, significance
   - **Implementation** — tool, targeting, QA steps
   - **Decision Framework** — what to do based on results

## Output

A/B test plan appended to `.singularskills/marketing/<project>/03-convert.md`. Present the hypothesis and expected timeline to the user.

**Record the run.** After you have written your section, append this line to `.singularskills/log.jsonl` (the `started` line of Prerequisites, with `"event":"finished"`): `{"ts":"<ISO timestamp>","skill":"marketing-ab-test-setup","workflow":"marketing","phase":3,"project":"<project>","event":"finished","artifact":"03-convert.md","note":""}`.

This artifact is shared by every skill of phase 3 (Convert). The frontmatter is written once, by whoever creates the file: if you create it, open it with the block below (`skill` is the phase title, `started` the time of that first write; `gate` is `passed` when the gate ran clean and `skipped` under `--skip-checks`); if it already exists, leave the block alone except to update `finished` and to set `gate` to the worst value among the sections (`skipped` over `passed`).

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

Open your `## A/B Test: [Test Name]` section with one italic line, `*<skill name> · <ISO timestamp> · gate: <passed|skipped>*` (your skill name is `marketing-ab-test-setup`).

End your section with `### Decisions` and `### Open questions` (one level under your `## A/B Test: [Test Name]` heading, so the section stays one block), in this shape:

```markdown
### Decisions
- <what was chosen> — <why> — <what was rejected>

### Open questions
- <what the next phase or a reviewer must settle>
```

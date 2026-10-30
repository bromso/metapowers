---
name: marketing-cold-email
description: Create cold outbound email campaigns — ICP and targeting, a three-to-five email sequence with personalization, subject lines and compliance notes. Use when the user wants to reach prospects who have never heard of them and book meetings by email. Not for emails to existing subscribers or users; see /marketing-email-sequence.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: marketing
  phase: 3
  artifact: 03-convert.md
---

# Cold Email

Design cold outbound email campaigns for "$ARGUMENTS". Create personalized email templates, follow-up sequences, and targeting criteria.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"marketing-cold-email","workflow":"marketing","phase":3,"project":"<project>","event":"skipped","artifact":"03-convert.md","note":"<reason or \"none given\">"}`.

## Prerequisites

**Part of a workflow.** This skill is phase 3 (Convert) of the RACE Framework workflow (`marketing`); cross-domain workflows run it too. Unless the user named this skill, check `.singularskills/log.jsonl` for an open run for this project: a `run-started` line with `"project":"<project>"` and no later `run-finished` line for the same `workflow` and `project`. If there is no open run, or the user asked to start, run, continue or resume a process or workflow rather than this one step, do not continue here: invoke the `workflow` skill with the workflow the user asked for, or `marketing` when they named none, followed by `<project>`. It runs this phase in order, asks before it writes and records the run. Continue here when the user named this skill, or when an open run exists (the conductor is running you).

Run this skill's gate before writing: `sh <this skill's folder>/scripts/gate.sh <project> <project root>`, where `<project root>` is the folder that contains `.singularskills/` (use `.` when you are already there). If it exits non-zero, stop and tell the user what it printed, unless `--skip-checks` was given (see Arguments). On a refusal, before you stop, append this line to `.singularskills/log.jsonl` (create the folder and file if missing): `{"ts":"<ISO timestamp>","skill":"marketing-cold-email","workflow":"marketing","phase":3,"project":"<project>","event":"refused","artifact":"03-convert.md","note":"<what the gate printed>"}`. Once the gate has passed, or under `--skip-checks` once you have appended the `skipped` line, append this line before you start work: `{"ts":"<ISO timestamp>","skill":"marketing-cold-email","workflow":"marketing","phase":3,"project":"<project>","event":"started","artifact":"03-convert.md","note":""}`.

Read `.singularskills/marketing/<project>/00-strategy.md`. If this file does not exist, tell the user:

> Phase 0 (Strategy) has not been completed for "<project>". Run `/marketing-customer-research <project>` first, or use `--skip-checks` to bypass.

## Process

1. **Read context:**
   - Read `.singularskills/marketing/<project>/00-strategy.md` for audience and value proposition
   - Read `references/campaign-plan-template.md` for structure

2. **Define targeting criteria:**
   - Ideal customer profile (ICP) for outbound
   - Company firmographics: size, industry, tech stack, growth signals
   - Contact persona: title, department, seniority
   - Intent signals: hiring, funding, tech changes, content engagement

3. **Design email sequence:**
   - 3-5 email sequence with timing (typically days 1, 3, 7, 14)
   - Each email: different angle or value prop
   - Personalization strategy: what's personalized per recipient?
   - Follow-up logic: when to stop, when to escalate

4. **Write email templates:**
   - For each email: subject line (2-3 variants), body, CTA
   - Keep emails short (under 150 words)
   - Lead with relevance, not pitch
   - Include specific personalization placeholders
   - Compliance: include opt-out, identify sender, no deceptive subjects

5. **Write the artifact** — append to `.singularskills/marketing/<project>/03-convert.md` under a `## Cold Email` section. Create the file with a `# Convert — <project>` heading if it does not exist; if a `## Cold Email` section already exists, replace only that section. The section contains:
   - **ICP & Targeting** — who to target and why
   - **Sequence Design** — timing and logic
   - **Email Templates** — full copy for each email
   - **Personalization Guide** — what to customize per recipient
   - **Compliance Notes** — CAN-SPAM, GDPR requirements

## Output

Cold email strategy appended to `.singularskills/marketing/<project>/03-convert.md`. Present the full email sequence for review.

**Record the run.** After you have written your section, append this line to `.singularskills/log.jsonl` (the `started` line of Prerequisites, with `"event":"finished"`): `{"ts":"<ISO timestamp>","skill":"marketing-cold-email","workflow":"marketing","phase":3,"project":"<project>","event":"finished","artifact":"03-convert.md","note":""}`.

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

Open your `## Cold Email` section with one italic line, `*<skill name> · <ISO timestamp> · gate: <passed|skipped>*` (your skill name is `marketing-cold-email`).

End your section with `### Decisions` and `### Open questions` (one level under your `## Cold Email` heading, so the section stays one block), in this shape:

```markdown
### Decisions
- <what was chosen> — <why> — <what was rejected>

### Open questions
- <what the next phase or a reviewer must settle>
```

---
name: leadership-sustain
description: Establish ongoing leadership rituals — weekly 1:1s, biweekly retros, monthly reviews and quarterly OKR resets — plus a leader's playbook and team health metrics. Use when the user's team is set up and they want a recurring operating rhythm that keeps it healthy without burning themselves out.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: leadership
  phase: 5
  artifact: 05-sustain.md
---

# Sustain

Establish the ongoing leadership rituals for "$ARGUMENTS". Define the recurring processes that keep the team healthy, aligned, and growing.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"<skill name>","workflow":"leadership","phase":<phase>,"project":"<project>","event":"skipped","artifact":"<artifact file>","note":"<reason or \"none given\">"}`.

## Prerequisites

Run `scripts/gate.sh <project>` from this skill's folder. If it exits non-zero, stop and tell the user what it printed (unless `--skip-checks`, see Arguments).

Read all prior artifacts. If `.singularskills/leadership/<project>/04-develop.md` does not exist, tell the user:

> Phase 4 (Develop) has not been completed for "<project>". Run `/leadership-develop <project>` first, or use `--skip-checks` to bypass.

## Process

1. **Read all prior artifacts:**
   - Read `.singularskills/leadership/<project>/01-assess.md` through `04-develop.md`
   - Read `references/one-on-one-template.md`
   - Read `references/cfr-model.md`

2. **Define recurring rituals:**
   - **Weekly:** 1:1s (using template), team standup/sync
   - **Biweekly:** Team retrospective
   - **Monthly:** CFR review, skip-level meetings
   - **Quarterly:** OKR review and reset, team health check
   - For each ritual: purpose, format, duration, participants

3. **Create a leader's playbook:**
   - How to handle common situations: underperformance, conflict, burnout, new hire onboarding
   - When to escalate vs. handle yourself
   - How to maintain your own energy and avoid burnout

4. **Define health metrics:**
   - How will you know the team is healthy? (engagement, velocity, retention, satisfaction)
   - Warning signs to watch for
   - When to revisit earlier phases (re-assess, update vision)

5. **Write the artifact** to `.singularskills/leadership/<project>/05-sustain.md` with sections:
   - **Ritual Calendar** — all recurring meetings with cadence and format
   - **Leader's Playbook** — common situations and responses
   - **Health Metrics** — what to monitor and warning signs
   - **Renewal Triggers** — when to revisit assess/vision/build/develop

## Output

The sustainability plan written to `.singularskills/leadership/<project>/05-sustain.md`. Present a summary highlighting:
- Ritual calendar overview
- Key health metrics
- Top playbook entries

**Record the run.** Open the artifact with this frontmatter (`agent` is the agent you run in, or `unknown`; `gate` is `passed` when the gate ran clean and `skipped` under `--skip-checks`):

```yaml
---
skill: leadership-sustain
workflow: leadership
phase: 5
project: <project>
started: <ISO timestamp>
finished: <ISO timestamp>
agent: <the agent you run in, or "unknown">
gate: <passed|skipped>
---
```

End the artifact (or your section of a shared artifact) with `## Decisions` and `## Open questions`, in this shape:

```markdown
## Decisions
- <what was chosen> — <why> — <what was rejected>

## Open questions
- <what the next phase or a reviewer must settle>
```

---
name: marketing-popup-cro
description: Design popups and modals — purpose, trigger, frequency, targeting, copy and mobile behavior — that capture leads without annoying visitors. Use when the user wants an exit-intent, email-capture or announcement overlay, or their current popup converts poorly or irritates people.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: marketing
  phase: 4
  artifact: 04-engage.md
---

# Popup CRO

Design effective popups and modals for "$ARGUMENTS". Create non-intrusive, high-converting overlays for lead capture, upgrades, and engagement.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"marketing-popup-cro","workflow":"marketing","phase":4,"project":"<project>","event":"skipped","artifact":"04-engage.md","note":"<reason or \"none given\">"}`.

## Prerequisites

**Part of a workflow.** This skill is phase 4 (Engage) of the RACE Framework workflow (`marketing`); cross-domain workflows run it too. First check `.singularskills/log.jsonl` for an open run for this project: a `run-started` line with `"project":"<project>"` and no later `run-finished` line for the same `workflow` and `project`. If one exists, the conductor is running you: continue here. Otherwise, if the user asked to start, run, continue or resume a process or workflow rather than this one step, do not continue here: invoke the `workflow` skill with the workflow the user asked for, or `marketing` when they named none, followed by `<project>`; it runs this phase in order, asks before it writes and records the run. Otherwise continue here: a later phase runs on its own, behind its gate.

Run this skill's gate before writing: `sh <this skill's folder>/scripts/gate.sh <project> <project root>`, where `<project root>` is the folder that contains `.singularskills/` (use `.` when you are already there). If it exits non-zero, stop and tell the user what it printed, unless `--skip-checks` was given (see Arguments). On a refusal, before you stop, append this line to `.singularskills/log.jsonl` (create the folder and file if missing): `{"ts":"<ISO timestamp>","skill":"marketing-popup-cro","workflow":"marketing","phase":4,"project":"<project>","event":"refused","artifact":"04-engage.md","note":"<what the gate printed>"}`. Once the gate has passed, or under `--skip-checks` once you have appended the `skipped` line, append this line before you start work: `{"ts":"<ISO timestamp>","skill":"marketing-popup-cro","workflow":"marketing","phase":4,"project":"<project>","event":"started","artifact":"04-engage.md","note":""}`.

Read `.singularskills/marketing/<project>/00-strategy.md`. If this file does not exist, tell the user:

> Phase 0 (Strategy) has not been completed for "<project>". Run `/marketing-customer-research <project>` first, or use `--skip-checks` to bypass.

## Process

1. **Read context:**
   - Read `.singularskills/marketing/<project>/00-strategy.md` for audience and messaging
   - Read `.singularskills/marketing/<project>/02-act.md` and `.singularskills/marketing/<project>/04-engage.md` if they exist

2. **Define popup purpose:**
   - Lead capture (email signup, lead magnet delivery)
   - Exit intent (save abandoning visitors)
   - Upgrade prompt (free-to-paid conversion)
   - Announcement (new feature, promotion)
   - Feedback collection (survey, NPS)

3. **Design popup experience:**
   - Trigger: time-based, scroll-based, exit-intent, click-triggered, page-count
   - Frequency: how often does a user see it?
   - Targeting: which pages, which segments, new vs. returning
   - Mobile experience: slide-up vs. full-screen vs. banner
   - Dismiss behavior: easy close, remember preference

4. **Create popup content:**
   - Headline (benefit-focused, under 10 words)
   - Body copy (1-2 sentences max)
   - CTA (specific action, not "Submit")
   - Visual direction
   - A/B test variants

5. **Write the artifact** — append to `.singularskills/marketing/<project>/04-engage.md` under a `## Popup CRO` section. Create the file with a `# Engage — <project>` heading if it does not exist; if a `## Popup CRO` section already exists, replace only that section. The section contains:
   - **Popup Strategy** — purpose, trigger, targeting
   - **Content** — headline, body, CTA per popup
   - **UX Rules** — frequency, dismissal, mobile behavior
   - **A/B Test Plan** — what to test first
   - **Anti-Annoyance Checklist** — ensuring popups help, not hurt

## Output

Popup strategy appended to `.singularskills/marketing/<project>/04-engage.md`. Present popup designs with copy for review.

**Record the run.** After you have written your section, append this line to `.singularskills/log.jsonl` (the `started` line of Prerequisites, with `"event":"finished"`): `{"ts":"<ISO timestamp>","skill":"marketing-popup-cro","workflow":"marketing","phase":4,"project":"<project>","event":"finished","artifact":"04-engage.md","note":""}`.

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

Open your `## Popup CRO` section with one italic line, `*<skill name> · <ISO timestamp> · gate: <passed|skipped>*` (your skill name is `marketing-popup-cro`).

End your section with `### Decisions` and `### Open questions` (one level under your `## Popup CRO` heading, so the section stays one block), in this shape:

```markdown
### Decisions
- <what was chosen> — <why> — <what was rejected>

### Open questions
- <what the next phase or a reviewer must settle>
```

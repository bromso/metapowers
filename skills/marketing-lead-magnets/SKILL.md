---
name: marketing-lead-magnets
description: Design lead magnets — checklists, templates, guides, email courses, quizzes — that trade real value for an email address, with landing page and follow-up. Use when the user wants to grow their email list or capture leads with gated content. Not for free interactive tools built for search and sharing; see /marketing-free-tool-strategy.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: marketing
  phase: 2
  artifact: 02-act.md
---

# Lead Magnets

Design high-converting lead magnets for "$ARGUMENTS". Create valuable gated content that attracts qualified leads and demonstrates expertise.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"marketing-lead-magnets","workflow":"marketing","phase":2,"project":"<project>","event":"skipped","artifact":"02-act.md","note":"<reason or \"none given\">"}`.

## Prerequisites

**Part of a workflow.** This skill is phase 2 (Act) of the RACE Framework workflow (`marketing`); cross-domain workflows run it too. First check `.singularskills/log.jsonl` for an open run for this project: a `run-started` line with `"project":"<project>"` and no later `run-finished` line for the same `workflow` and `project`. If one exists, the conductor is running you: continue here. Otherwise, if the user asked to start, run, continue or resume a process or workflow rather than this one step, do not continue here: invoke the `workflow` skill with the workflow the user asked for, or `marketing` when they named none, followed by `<project>`; it runs this phase in order, asks before it writes and records the run. Otherwise continue here: a later phase runs on its own, behind its gate.

Run this skill's gate before writing: `sh <this skill's folder>/scripts/gate.sh <project> <project root>`, where `<project root>` is the folder that contains `.singularskills/` (use `.` when you are already there). If it exits non-zero, stop and tell the user what it printed, unless `--skip-checks` was given (see Arguments). On a refusal, before you stop, append this line to `.singularskills/log.jsonl` (create the folder and file if missing): `{"ts":"<ISO timestamp>","skill":"marketing-lead-magnets","workflow":"marketing","phase":2,"project":"<project>","event":"refused","artifact":"02-act.md","note":"<what the gate printed>"}`. Once the gate has passed, or under `--skip-checks` once you have appended the `skipped` line, append this line before you start work: `{"ts":"<ISO timestamp>","skill":"marketing-lead-magnets","workflow":"marketing","phase":2,"project":"<project>","event":"started","artifact":"02-act.md","note":""}`.

Read `.singularskills/marketing/<project>/00-strategy.md`. If this file does not exist, tell the user:

> Phase 0 (Strategy) has not been completed for "<project>". Run `/marketing-customer-research <project>` first, or use `--skip-checks` to bypass.

## Process

1. **Read context:**
   - Read `.singularskills/marketing/<project>/00-strategy.md` for audience pain points and JTBD
   - Read `.singularskills/marketing/<project>/01-reach.md` if it exists (for content context)

2. **Identify lead magnet opportunities:**
   - Map audience pain points to solvable problems
   - What quick wins can you deliver? (saves time, money, or effort)
   - Use WebSearch to find what lead magnets competitors offer
   - What format best solves the problem? (template, checklist, guide, tool, quiz, calculator)

3. **Design lead magnet concepts:**
   - Create 3-5 lead magnet concepts with:
     - Title (specific and benefit-driven)
     - Format (PDF, spreadsheet, tool, email course, quiz)
     - Value proposition (what problem it solves)
     - Effort to create (low/medium/high)
     - Lead quality expectation (how qualified are leads this attracts?)

4. **Landing page and delivery:**
   - Recommended landing page structure for the lead magnet
   - Delivery mechanism (email, instant download, drip)
   - Follow-up sequence recommendation
   - Qualification: how does this lead magnet qualify leads for the next step?

5. **Write the artifact** — append to `.singularskills/marketing/<project>/02-act.md` under a `## Lead Magnets` section. Create the file with a `# Act — <project>` heading if it does not exist; if a `## Lead Magnets` section already exists, replace only that section. The section contains:
   - **Lead Magnet Concepts** — 3-5 concepts with details
   - **Recommended First Magnet** — which to build first and why
   - **Landing Page Outline** — structure and copy direction
   - **Delivery & Follow-Up** — how to deliver and nurture
   - **Lead Qualification** — how this feeds the sales/conversion funnel

## Output

Lead magnet strategy appended to `.singularskills/marketing/<project>/02-act.md`. Present a summary highlighting:
- Top lead magnet recommendation
- Expected lead quality
- Effort to create

**Record the run.** After you have written your section, append this line to `.singularskills/log.jsonl` (the `started` line of Prerequisites, with `"event":"finished"`): `{"ts":"<ISO timestamp>","skill":"marketing-lead-magnets","workflow":"marketing","phase":2,"project":"<project>","event":"finished","artifact":"02-act.md","note":""}`.

This artifact is shared by every skill of phase 2 (Act). The frontmatter is written once, by whoever creates the file: if you create it, open it with the block below (`skill` is the phase title, `started` the time of that first write; `gate` is `passed` when the gate ran clean and `skipped` under `--skip-checks`); if it already exists, leave the block alone except to update `finished` and to set `gate` to the worst value among the sections (`skipped` over `passed`).

```yaml
---
skill: Act
workflow: marketing
phase: 2
project: <project>
started: <ISO timestamp>
finished: <ISO timestamp>
agent: <the agent you run in, or "unknown">
gate: <passed|skipped>
---
```

Open your `## Lead Magnets` section with one italic line, `*<skill name> · <ISO timestamp> · gate: <passed|skipped>*` (your skill name is `marketing-lead-magnets`).

End your section with `### Decisions` and `### Open questions` (one level under your `## Lead Magnets` heading, so the section stays one block), in this shape:

```markdown
### Decisions
- <what was chosen> — <why> — <what was rejected>

### Open questions
- <what the next phase or a reviewer must settle>
```

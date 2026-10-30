---
name: marketing-copywriting
description: Write new marketing copy for a surface — landing page, homepage, email, product screen — with headline variants, body copy and CTAs matched to the reader's awareness level. Use when the user needs words written from scratch for a page or message that does not exist yet. Not for tightening a draft they already have; see /marketing-copy-editing.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: marketing
  phase: 2
  artifact: 02-act.md
---

# Copywriting

Write persuasive, conversion-focused copy for "$ARGUMENTS". Apply proven copywriting frameworks to create compelling headlines, body copy, and calls to action.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"marketing-copywriting","workflow":"marketing","phase":2,"project":"<project>","event":"skipped","artifact":"02-act.md","note":"<reason or \"none given\">"}`.

## Prerequisites

**Part of a workflow.** This skill is phase 2 (Act) of the RACE Framework workflow (`marketing`); cross-domain workflows run it too. Unless the user named this skill, check `.singularskills/log.jsonl` for an open run for this project: a `run-started` line with `"project":"<project>"` and no later `run-finished` line for the same `workflow` and `project`. If there is no open run, or the user asked to start, run, continue or resume a process or workflow rather than this one step, do not continue here: invoke the `workflow` skill with the workflow the user asked for, or `marketing` when they named none, followed by `<project>`. It runs this phase in order, asks before it writes and records the run. Continue here when the user named this skill, or when an open run exists (the conductor is running you).

Run this skill's gate before writing: `sh <this skill's folder>/scripts/gate.sh <project> <project root>`, where `<project root>` is the folder that contains `.singularskills/` (use `.` when you are already there). If it exits non-zero, stop and tell the user what it printed, unless `--skip-checks` was given (see Arguments). On a refusal, before you stop, append this line to `.singularskills/log.jsonl` (create the folder and file if missing): `{"ts":"<ISO timestamp>","skill":"marketing-copywriting","workflow":"marketing","phase":2,"project":"<project>","event":"refused","artifact":"02-act.md","note":"<what the gate printed>"}`. Once the gate has passed, or under `--skip-checks` once you have appended the `skipped` line, append this line before you start work: `{"ts":"<ISO timestamp>","skill":"marketing-copywriting","workflow":"marketing","phase":2,"project":"<project>","event":"started","artifact":"02-act.md","note":""}`.

Read `.singularskills/marketing/<project>/00-strategy.md`. If this file does not exist, tell the user:

> Phase 0 (Strategy) has not been completed for "<project>". Run `/marketing-customer-research <project>` first, or use `--skip-checks` to bypass.

## Process

1. **Read context:**
   - Read `.singularskills/marketing/<project>/00-strategy.md` for audience, messaging, and positioning
   - Read `.singularskills/marketing/<project>/01-reach.md` if it exists (for content context)

2. **Define the copy brief:**
   - What surface? (landing page, email, ad, social, product)
   - Who is reading? (map to persona from strategy)
   - What's the one action they should take?
   - What's their current state of awareness? (unaware, problem-aware, solution-aware, product-aware)

3. **Apply copywriting frameworks:**
   - **Headlines:** Use PAS (Problem-Agitate-Solve), AIDA (Attention-Interest-Desire-Action), or 4U (Useful-Urgent-Unique-Ultra-specific)
   - **Body:** Lead with the biggest benefit, use social proof, address objections, create urgency
   - **CTA:** Clear, specific, benefit-oriented action verbs
   - Generate 3-5 headline variants and recommend the strongest

4. **Voice and tone calibration:**
   - Match the brand voice from the messaging framework
   - Adjust formality for the channel (email vs. social vs. landing page)
   - Use the audience's own language (from customer research)

5. **Write the artifact** — append to `.singularskills/marketing/<project>/02-act.md` under a `## Copywriting` section. Create the file with a `# Act — <project>` heading if it does not exist; if a `## Copywriting` section already exists, replace only that section. The section contains:
   - **Copy Brief** — surface, audience, action, awareness level
   - **Headlines** — 3-5 variants with framework used
   - **Body Copy** — complete draft
   - **CTA Options** — 2-3 call-to-action variants
   - **Copy Notes** — tone decisions and rationale

## Output

Copy appended to `.singularskills/marketing/<project>/02-act.md`. Present the copy directly to the user with headline options highlighted.

**Record the run.** After you have written your section, append this line to `.singularskills/log.jsonl` (the `started` line of Prerequisites, with `"event":"finished"`): `{"ts":"<ISO timestamp>","skill":"marketing-copywriting","workflow":"marketing","phase":2,"project":"<project>","event":"finished","artifact":"02-act.md","note":""}`.

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

Open your `## Copywriting` section with one italic line, `*<skill name> · <ISO timestamp> · gate: <passed|skipped>*` (your skill name is `marketing-copywriting`).

End your section with `### Decisions` and `### Open questions` (one level under your `## Copywriting` heading, so the section stays one block), in this shape:

```markdown
### Decisions
- <what was chosen> — <why> — <what was rejected>

### Open questions
- <what the next phase or a reviewer must settle>
```

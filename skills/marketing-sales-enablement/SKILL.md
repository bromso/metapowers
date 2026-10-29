---
name: marketing-sales-enablement
description: Create sales enablement material — battle cards per competitor, an objection-handling guide, demo talking points and a collateral list. Use when the sales team is losing deals to competitors or keeps stalling on the same objections. Not for public comparison pages or a landscape map; see /marketing-competitor-alternatives or /marketing-competitor-profiling.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: marketing
  phase: 3
  artifact: 03-convert.md
---

# Sales Enablement

Create sales enablement materials for "$ARGUMENTS". Build battle cards, objection handling guides, and sales collateral that help close deals.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"marketing-sales-enablement","workflow":"marketing","phase":3,"project":"<project>","event":"skipped","artifact":"03-convert.md","note":"<reason or \"none given\">"}`.

## Prerequisites

Run this skill's gate before writing: `sh <this skill's folder>/scripts/gate.sh <project> <project root>`, where `<project root>` is the folder that contains `.singularskills/` (use `.` when you are already there). If it exits non-zero, stop and tell the user what it printed, unless `--skip-checks` was given (see Arguments).

Read `.singularskills/marketing/<project>/00-strategy.md`. If this file does not exist, tell the user:

> Phase 0 (Strategy) has not been completed for "<project>". Run `/marketing-customer-research <project>` first, or use `--skip-checks` to bypass.

## Process

1. **Read context:**
   - Read `.singularskills/marketing/<project>/00-strategy.md` for positioning, competitors, and personas

2. **Build competitive battle cards:**
   - One battle card per major competitor
   - Our strengths vs. their weaknesses
   - Their strengths and how to handle them
   - Landmines: questions to ask prospects that highlight our advantages
   - Traps: questions competitors will ask, with prepared responses

3. **Create objection handling guide:**
   - Map common objections: price, features, timing, competition, inertia
   - For each: acknowledge, reframe, respond, evidence
   - Link objections to customer research insights

4. **Sales collateral recommendations:**
   - One-pager / product overview
   - Case study templates
   - ROI calculator or business case template
   - Demo script outline
   - Proposal template

5. **Write the artifact** — append to `.singularskills/marketing/<project>/03-convert.md` under a `## Sales Enablement` section. Create the file with a `# Convert — <project>` heading if it does not exist; if a `## Sales Enablement` section already exists, replace only that section. The section contains:
   - **Battle Cards** — per competitor
   - **Objection Handling** — common objections with responses
   - **Collateral List** — recommended materials with priority
   - **Key Proof Points** — stats, quotes, case studies to reference
   - **Demo Talking Points** — key moments in the demo to highlight

## Output

Sales enablement materials appended to `.singularskills/marketing/<project>/03-convert.md`. Present battle cards and top objection responses to the user.

**Record the run.** Append each of these events to `.singularskills/log.jsonl` as one line (create the folder and file if missing):

- Before you start work (once the gate has passed or `--skip-checks` was given): `{"ts":"<ISO timestamp>","skill":"marketing-sales-enablement","workflow":"marketing","phase":3,"project":"<project>","event":"started","artifact":"03-convert.md","note":""}`
- After you have written your section: the same line with `"event":"finished"`.
- If the gate refused and the user did not bypass it: the same line with `"event":"refused"` and `"note"` set to what the gate printed, instead of the other two; then stop.

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

Open your `## Sales Enablement` section with one italic line, `*<skill name> · <ISO timestamp> · gate: <passed|skipped>*` (your skill name is `marketing-sales-enablement`).

End your section with `### Decisions` and `### Open questions` (one level under your `## Sales Enablement` heading, so the section stays one block), in this shape:

```markdown
### Decisions
- <what was chosen> — <why> — <what was rejected>

### Open questions
- <what the next phase or a reviewer must settle>
```

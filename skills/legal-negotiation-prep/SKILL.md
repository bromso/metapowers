---
name: legal-negotiation-prep
description: Prepare a negotiation strategy for a contract — ideal, compromise and walk-away positions per contentious clause, counter-arguments, redlines, trade-offs and BATNA. Use when the user is about to negotiate a specific contract with a counterparty and wants to know what to push for and what to concede.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: legal
  phase: 2
  artifact: 02-review.md
---

# Negotiation Prep

Prepare a negotiation strategy for "$ARGUMENTS". Define ideal positions, acceptable compromises, and walk-away points for each contentious clause, with counter-arguments and redline suggestions.

> **Note:** AI-generated legal content does not constitute legal advice. Consult a qualified attorney.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"legal-negotiation-prep","workflow":"legal","phase":2,"project":"<project>","event":"skipped","artifact":"02-review.md","note":"<reason or \"none given\">"}`.

## Prerequisites

**Part of a workflow.** This skill is phase 2 (Review) of the Legal Lifecycle workflow (`legal`); cross-domain workflows run it too. Unless the user named this skill, check `.singularskills/log.jsonl` for an open run for this project: a `run-started` line with `"project":"<project>"` and no later `run-finished` line for the same `workflow` and `project`. If there is no open run, or the user asked to start, run, continue or resume a process or workflow rather than this one step, do not continue here: invoke the `workflow` skill with the workflow the user asked for, or `legal` when they named none, followed by `<project>`. It runs this phase in order, asks before it writes and records the run. Continue here when the user named this skill, or when an open run exists (the conductor is running you).

Run this skill's gate before writing: `sh <this skill's folder>/scripts/gate.sh <project> <project root>`, where `<project root>` is the folder that contains `.singularskills/` (use `.` when you are already there). If it exits non-zero, stop and tell the user what it printed, unless `--skip-checks` was given (see Arguments). On a refusal, before you stop, append this line to `.singularskills/log.jsonl` (create the folder and file if missing): `{"ts":"<ISO timestamp>","skill":"legal-negotiation-prep","workflow":"legal","phase":2,"project":"<project>","event":"refused","artifact":"02-review.md","note":"<what the gate printed>"}`. Once the gate has passed, or under `--skip-checks` once you have appended the `skipped` line, append this line before you start work: `{"ts":"<ISO timestamp>","skill":"legal-negotiation-prep","workflow":"legal","phase":2,"project":"<project>","event":"started","artifact":"02-review.md","note":""}`.

Check that `.singularskills/legal/<project>/00-assess.md` exists. If it does not exist, stop and tell the user:

> "Run an Assess skill first (e.g. `/legal-risk-assessment <project>`) to generate the prerequisite assessment artifact."

## Process

1. **Read inputs:**
   - Read `.singularskills/legal/<project>/00-assess.md` for risk and jurisdiction context
   - Read `.singularskills/legal/<project>/02-review.md` if it exists (contract review or red-flag analysis)
   - Read any additional context provided by the user (business priorities, relationship dynamics)

2. **Identify contentious clauses:**
   - Extract highest-risk items from prior review or red-flag analysis
   - If no prior review exists, identify contentious clauses from the contract directly
   - Rank by business impact and legal risk

3. **For each contentious clause, define three positions:**
   - **Ideal position** — the best outcome; what you would propose in opening negotiation
   - **Acceptable compromise** — a middle ground that adequately protects interests
   - **Walk-away point** — the minimum acceptable terms; below this, decline or escalate

4. **Prepare counter-arguments for anticipated pushback:**
   - Identify likely counterparty objections to each ideal position
   - Draft responses grounded in market standards, legal precedent, or business logic
   - Prepare supporting evidence (industry benchmarks, comparable deals)

5. **Draft redline suggestions:**
   - For each contentious clause, provide specific alternative language
   - Mark additions and deletions clearly
   - Explain the rationale for each proposed change

6. **Identify trade-offs:**
   - Map concession pairs (concede X to win Y)
   - Identify low-cost concessions that have high perceived value to counterparty
   - Flag non-negotiable items that cannot be traded

7. **Define overall negotiation priorities:**
   - **Must-have** — terms that are non-negotiable; deal-breakers if not included
   - **Nice-to-have** — preferred terms that can be conceded if needed
   - **Tradeable** — terms available for concession in exchange for must-haves

8. **Prepare BATNA (Best Alternative To Negotiated Agreement):**
   - Define what happens if negotiation fails
   - Assess strength of BATNA relative to proposed deal
   - Identify whether BATNA strengthens or weakens negotiating position

9. **Write the artifact** — append to `.singularskills/legal/<project>/02-review.md` under a `## Negotiation Prep` section. Create the file with a `# Review — <project>` heading if it does not exist; if a `## Negotiation Prep` section already exists, replace only that section. The section contains:

   - **Contentious Clauses** — ranked list of clauses requiring negotiation
   - **Position Matrix** — ideal / compromise / walk-away for each clause
   - **Counter-Arguments** — anticipated objections and prepared responses
   - **Redline Suggestions** — specific alternative language per clause
   - **Trade-off Map** — concession pairs and non-negotiable items
   - **Negotiation Priorities** — must-have / nice-to-have / tradeable classification
   - **BATNA Analysis** — alternatives and their impact on negotiating leverage

## Output

The negotiation strategy appended to `.singularskills/legal/<project>/02-review.md`. Present a summary to the user highlighting:
- Number of contentious clauses identified and their ranking
- Must-have items that are non-negotiable
- Key trade-offs available (concede X to win Y)
- BATNA strength assessment

**Record the run.** After you have written your section, append this line to `.singularskills/log.jsonl` (the `started` line of Prerequisites, with `"event":"finished"`): `{"ts":"<ISO timestamp>","skill":"legal-negotiation-prep","workflow":"legal","phase":2,"project":"<project>","event":"finished","artifact":"02-review.md","note":""}`.

This artifact is shared by every skill of phase 2 (Review). The frontmatter is written once, by whoever creates the file: if you create it, open it with the block below (`skill` is the phase title, `started` the time of that first write; `gate` is `passed` when the gate ran clean and `skipped` under `--skip-checks`); if it already exists, leave the block alone except to update `finished` and to set `gate` to the worst value among the sections (`skipped` over `passed`).

```yaml
---
skill: Review
workflow: legal
phase: 2
project: <project>
started: <ISO timestamp>
finished: <ISO timestamp>
agent: <the agent you run in, or "unknown">
gate: <passed|skipped>
---
```

Open your `## Negotiation Prep` section with one italic line, `*<skill name> · <ISO timestamp> · gate: <passed|skipped>*` (your skill name is `legal-negotiation-prep`).

End your section with `### Decisions` and `### Open questions` (one level under your `## Negotiation Prep` heading, so the section stays one block), in this shape:

```markdown
### Decisions
- <what was chosen> — <why> — <what was rejected>

### Open questions
- <what the next phase or a reviewer must settle>
```

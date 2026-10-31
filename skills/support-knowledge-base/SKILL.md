---
name: support-knowledge-base
description: Plan the help centre — its structure, an article backlog ranked by the contacts each article would prevent, an article template and the rule for turning tickets into articles — with the top three articles drafted. Use when the user wants customers to answer their own questions instead of contacting support. Not for writing replies to tickets; see /support-macros.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: support
  phase: 3
  artifact: 03-knowledge.md
---

# Knowledge

Plan the help centre for "$ARGUMENTS": what it holds, in what order to write it, and how it stays current.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"support-knowledge-base","workflow":"support","phase":3,"project":"<project>","event":"skipped","artifact":"03-knowledge.md","note":"<reason or \"none given\">"}`.

**Compute with code.** Perform every calculation (totals, balances, ratios, variances, projections) with a script — Bash, Python or a spreadsheet formula written to a file — and include the computation alongside the result. Never do arithmetic mentally.

## Prerequisites

**Part of a workflow.** This skill is phase 3 (Knowledge) of the Support Operations Cycle workflow (`support`); cross-domain workflows run it too. First check `.singularskills/log.jsonl` for an open run for this project: a `run-started` line with `"project":"<project>"` and no later `run-finished` line for the same `workflow` and `project`. If one exists, the conductor is running you: continue here. Otherwise, if the user asked to start, run, continue or resume a process or workflow rather than this one step, do not continue here: invoke the `workflow` skill with the workflow the user asked for, or `support` when they named none, followed by `<project>`; it runs this phase in order, asks before it writes and records the run. Otherwise continue here: a later phase runs on its own, behind its gate.

Run this skill's gate before writing: `sh <this skill's folder>/scripts/gate.sh <project> <project root>`, where `<project root>` is the folder that contains `.singularskills/` (use `.` when you are already there). If it exits non-zero, stop and tell the user what it printed, unless `--skip-checks` was given (see Arguments). On a refusal, before you stop, append this line to `.singularskills/log.jsonl` (create the folder and file if missing): `{"ts":"<ISO timestamp>","skill":"support-knowledge-base","workflow":"support","phase":3,"project":"<project>","event":"refused","artifact":"03-knowledge.md","note":"<what the gate printed>"}`. Once the gate has passed, or under `--skip-checks` once you have appended the `skipped` line, append this line before you start work: `{"ts":"<ISO timestamp>","skill":"support-knowledge-base","workflow":"support","phase":3,"project":"<project>","event":"started","artifact":"03-knowledge.md","note":""}`.

Read `.singularskills/support/<project>/02-taxonomy.md` for the categories, their volumes and the key takeaways.

## Process

1. **Review what exists:** ask the user for the current help centre (a URL, an export or a list of article titles) and read what you are given. Note articles that are missing, outdated or answer the wrong question.

2. **Design the structure:** sections that follow the taxonomy's top-level categories in the customer's words, not the team's, with the getting-started and billing sections first if contacts cluster there.

3. **Build the article backlog:** one row per article, with the question it answers, its category, the contact volume it could deflect (the category's share in the taxonomy's test sample applied to the computed volumes in `01-map.md`, labelled `computed (from a sample)`; or `not measured`), and whether it is new or a rewrite. Rank by deflectable volume, then by how often the answer changes.

4. **Write the article template:** title as the customer's question, a one-sentence answer first, numbered steps, what to do if it did not work (with the contact route), and the date last checked.

5. **Set the rule for new articles:** when a question appears in more than a set number of tickets in a period (ask the user for the number; suggest five a month), an agent proposes an article; who approves it; and who checks each article and how often.

6. **Draft the top three articles** of the backlog in full, using the template. Keep every claim to what the user or their documents state; mark anything you could not confirm as `<check: …>`.

7. **Write the artifact** to `.singularskills/support/<project>/03-knowledge.md` with sections:
   - **Current state** — what exists and what is missing
   - **Structure** — sections and their order
   - **Article backlog** — the ranked table
   - **Article template**
   - **Maintenance** — the rule for new articles and reviews
   - **Draft articles** — the top three in full

## Output

The knowledge base plan written to `.singularskills/support/<project>/03-knowledge.md`. Present a summary to the user highlighting:
- The help centre sections
- The three highest-ranked articles and the volume each could deflect
- Every `<check: …>` placeholder in the drafts

**Record the run.** After you have written the artifact, append this line to `.singularskills/log.jsonl` (the `started` line of Prerequisites, with `"event":"finished"`): `{"ts":"<ISO timestamp>","skill":"support-knowledge-base","workflow":"support","phase":3,"project":"<project>","event":"finished","artifact":"03-knowledge.md","note":""}`.

Open the artifact with this frontmatter (`agent` is the agent you run in, or `unknown`; `gate` is `passed` when the gate ran clean and `skipped` under `--skip-checks`):

```yaml
---
skill: support-knowledge-base
workflow: support
phase: 3
project: <project>
started: <ISO timestamp>
finished: <ISO timestamp>
agent: <the agent you run in, or "unknown">
gate: <passed|skipped>
---
```

End the artifact with `## Decisions` and `## Open questions`, in this shape:

```markdown
## Decisions
- <what was chosen> — <why> — <what was rejected>

## Open questions
- <what the next phase or a reviewer must settle>
```

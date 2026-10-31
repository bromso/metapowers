---
name: analytics-questions
description: Identify the decisions a team must make, who makes each and by when, and the questions whose answers would change them, ranked and typed as describe, diagnose, predict or test. Use when the user wants data to inform decisions but has not said which decisions or which questions matter. Not for researching a problem space with users; see /research-discover.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: analytics
  phase: 1
  artifact: 01-questions.md
---

# Questions

Start the analysis for "$ARGUMENTS" from the decisions it must inform, not from the data that happens to exist.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"analytics-questions","workflow":"analytics","phase":1,"project":"<project>","event":"skipped","artifact":"01-questions.md","note":"<reason or \"none given\">"}`.

**Compute with code.** Perform every calculation (totals, balances, ratios, variances, projections) with a script — Bash, Python or a spreadsheet formula written to a file — and include the computation alongside the result. Never do arithmetic mentally.

## Prerequisites

**Part of a workflow.** This skill is phase 1 (Questions) of the Decision Analytics Cycle workflow (`analytics`); cross-domain workflows run it too. First check `.singularskills/log.jsonl` for an open run for this project: a `run-started` line with `"project":"<project>"` and no later `run-finished` line for the same `workflow` and `project`. If one exists, the conductor is running you: continue here. Otherwise, if the user asked to start, run, continue or resume a process or workflow rather than this one step, do not continue here: invoke the `workflow` skill with the workflow the user asked for, or `analytics` when they named none, followed by `<project>`; it runs this phase in order, asks before it writes and records the run. Otherwise, unless the user named this skill, ask one question, since this is the first phase of its workflow: "Just this step, or the whole Decision Analytics Cycle workflow?" End your turn and wait; on the whole workflow, hand off the same way; on just this step, continue here.

**Recall.** Before you ask the user anything, look for what this repository already holds about `<project>`: if a tool is available whose description says it searches or maps this repository (a memory or repo-map server such as `repo_map` or `entities`), query it for `<project>` and this phase's subject and read what it returns, keeping only results from this repository; in every case also list `.singularskills/*/<project>/` and read the **Decisions** and **Open questions** of any artifact there, and the lines of `.singularskills/log.jsonl` whose `project` is `<project>`. After the frontmatter and title, add a `## Recalled` section of at most ten lines naming what you found and where (path or tool), or the single line `Nothing recalled: no earlier artifacts, log lines or memory results for <project>.` Ask the user only what this did not answer. The trail's shape is described in `references/memory/trail.md`, bundled with this skill.

Before you start work, append this line to `.singularskills/log.jsonl` (create the folder and file if missing): `{"ts":"<ISO timestamp>","skill":"analytics-questions","workflow":"analytics","phase":1,"project":"<project>","event":"started","artifact":"01-questions.md","note":""}`.

None — this is the first phase.

## Process

1. **Read what exists:** artifacts in `.singularskills/research/<project>/`, `.singularskills/marketing/<project>/`, `.singularskills/finance/<project>/` and `.singularskills/support/<project>/`, for goals, KPIs, open questions and decisions already pending.

2. **Ask the user what you could not find**, once and together:
   - Which decisions does the team have to make in the next quarter (launch, price, hire, cut, invest, fix)?
   - Who makes each, and by when?
   - What do they believe today, and what would change their mind?
   - What data do they have (exports, a warehouse they can query, a tool's reports)?

3. **List the decisions:** each with its decision-maker, deadline, the options on the table and what is at stake.

4. **Write the questions behind each decision:** the ones whose answer would change which option is chosen. Phrase each so data could answer it ("Did trial-to-paid conversion fall for annual plans after the price change?", not "How are we doing?"). Type each:
   - **describe** — what happened
   - **diagnose** — why it happened
   - **predict** — what will happen
   - **test** — what would happen if we changed something (needs an experiment)

5. **Rank the questions** by decision value: how much the decision depends on the answer, the cost of being wrong, and how soon the decision is due. Mark the top five as priorities.

6. **Record what is out of scope:** questions raised but not worth answering now, and why.

7. **Write the artifact** to `.singularskills/analytics/<project>/01-questions.md` with sections:
   - **Decisions** — decision, decision-maker, deadline, options, stakes
   - **Questions** — per decision, each typed describe, diagnose, predict or test
   - **Priorities** — the top five, ranked, with why
   - **Out of scope** — and why

## Output

The questions written to `.singularskills/analytics/<project>/01-questions.md`. Present a summary to the user highlighting:
- The decisions and their deadlines
- The top five questions and their types
- Any question that needs an experiment rather than analysis

**Record the run.** After you have written the artifact, append this line to `.singularskills/log.jsonl` (the `started` line of Prerequisites, with `"event":"finished"`): `{"ts":"<ISO timestamp>","skill":"analytics-questions","workflow":"analytics","phase":1,"project":"<project>","event":"finished","artifact":"01-questions.md","note":""}`.

Open the artifact with this frontmatter (`agent` is the agent you run in, or `unknown`; `gate` is `none`, as this phase has no gate):

```yaml
---
skill: analytics-questions
workflow: analytics
phase: 1
project: <project>
started: <ISO timestamp>
finished: <ISO timestamp>
agent: <the agent you run in, or "unknown">
gate: none
---
```

End the artifact with `## Decisions` and `## Open questions`, in this shape:

```markdown
## Decisions
- <what was chosen> — <why> — <what was rejected>

## Open questions
- <what the next phase or a reviewer must settle>
```

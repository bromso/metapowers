---
name: marketing-customer-research
description: Research a product's target buyers for marketing — personas, jobs-to-be-done, pain points, objections and the buyer journey. Use when the user is starting marketing for a product and needs to know who buys it, why and in what words. Not for open-ended discovery on a problem or topic; see /research-discover.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: marketing
  phase: 0
  artifact: 00-strategy.md
---

# Customer Research

Research the target audience for "$ARGUMENTS". Build detailed personas, map jobs-to-be-done, identify pain points, and understand the buyer journey.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"marketing-customer-research","workflow":"marketing","phase":0,"project":"<project>","event":"skipped","artifact":"00-strategy.md","note":"<reason or \"none given\">"}`.

## Prerequisites

**Part of a workflow.** This skill is phase 0 (Strategy) of the RACE Framework workflow (`marketing`); cross-domain workflows run it too. First check `.singularskills/log.jsonl` for an open run for this project: a `run-started` line with `"project":"<project>"` and no later `run-finished` line for the same `workflow` and `project`. If one exists, the conductor is running you: continue here. Otherwise, if the user asked to start, run, continue or resume a process or workflow rather than this one step, do not continue here: invoke the `workflow` skill with the workflow the user asked for, or `marketing` when they named none, followed by `<project>`; it runs this phase in order, asks before it writes and records the run. Otherwise, unless the user named this skill, ask one question, since this is the first phase of its workflow: "Just this step, or the whole RACE Framework workflow?" End your turn and wait; on the whole workflow, hand off the same way; on just this step, continue here.

**Recall.** Before you ask the user anything, look for what this repository already holds about `<project>`: if a tool is available whose description says it searches or maps this repository (a memory or repo-map server such as `repo_map` or `entities`), query it for `<project>` and this phase's subject and read what it returns, keeping only results from this repository; in every case also list `.singularskills/*/<project>/` and read the **Decisions** and **Open questions** of any artifact there, and the lines of `.singularskills/log.jsonl` whose `project` is `<project>`. After your section's italic line, add a `### Recalled` subsection of at most ten lines naming what you found and where (path or tool), or the single line `Nothing recalled: no earlier artifacts, log lines or memory results for <project>.` Ask the user only what this did not answer. The trail's shape is described in `references/memory/trail.md`, bundled with this skill.

Before you start work, append this line to `.singularskills/log.jsonl` (create the folder and file if missing): `{"ts":"<ISO timestamp>","skill":"marketing-customer-research","workflow":"marketing","phase":0,"project":"<project>","event":"started","artifact":"00-strategy.md","note":""}`.

None — this is typically the first Strategy skill to run.

## Process

1. **Web research** to understand the target audience:
   - Use WebSearch to find audience research, surveys, forum discussions, and industry reports about "<project>"
   - Use WebFetch to read the most relevant sources in depth (aim for 5-8 quality sources)
   - Look for: demographic data, behavioral patterns, purchase motivations, common objections

2. **Build personas:**
   - Create 2-3 detailed buyer personas based on findings
   - For each: demographics, goals, frustrations, current solutions, decision-making process
   - Identify the primary persona (highest value / most common)

3. **Map jobs-to-be-done:**
   - Identify the functional, social, and emotional jobs the audience is hiring for
   - Map the "when" — what triggers the need
   - Document desired outcomes and success metrics from the audience's perspective

4. **Identify pain points and objections:**
   - What frustrates them about current solutions?
   - What prevents them from switching or buying?
   - What questions do they ask before purchasing?
   - Mine forums, review sites, and social media for unfiltered language

5. **Map the buyer journey:**
   - Document awareness → consideration → decision stages
   - Identify touchpoints and information needs at each stage
   - Note where they research, who influences them, and what content they consume

6. **Write the artifact** — append to `.singularskills/marketing/<project>/00-strategy.md` under a `## Customer Research` section. Create the file with a `# Strategy — <project>` heading if it does not exist; if a `## Customer Research` section already exists, replace only that section. The section contains:
   - **Personas** — 2-3 detailed buyer personas
   - **Jobs to Be Done** — functional, social, emotional jobs
   - **Pain Points & Objections** — frustrations, barriers, common questions
   - **Buyer Journey** — stages, touchpoints, information needs
   - **Key Insights** — top 3-5 actionable insights

## Output

Customer research appended to `.singularskills/marketing/<project>/00-strategy.md`. Present a summary highlighting:
- Primary persona profile
- Top pain points discovered
- Most important insight for messaging

**Record the run.** After you have written your section, append this line to `.singularskills/log.jsonl` (the `started` line of Prerequisites, with `"event":"finished"`): `{"ts":"<ISO timestamp>","skill":"marketing-customer-research","workflow":"marketing","phase":0,"project":"<project>","event":"finished","artifact":"00-strategy.md","note":""}`.

This artifact is shared by every skill of phase 0 (Strategy). The frontmatter is written once, by whoever creates the file: if you create it, open it with the block below (`skill` is the phase title, `started` the time of that first write; `gate` is `none`, as this phase has no gate); if it already exists, leave the block alone except to update `finished`.

```yaml
---
skill: Strategy
workflow: marketing
phase: 0
project: <project>
started: <ISO timestamp>
finished: <ISO timestamp>
agent: <the agent you run in, or "unknown">
gate: none
---
```

Open your `## Customer Research` section with one italic line, `*<skill name> · <ISO timestamp> · gate: none*` (your skill name is `marketing-customer-research`).

End your section with `### Decisions` and `### Open questions` (one level under your `## Customer Research` heading, so the section stays one block), in this shape:

```markdown
### Decisions
- <what was chosen> — <why> — <what was rejected>

### Open questions
- <what the next phase or a reviewer must settle>
```

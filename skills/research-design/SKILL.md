---
name: research-design
description: Generate three to five solution concepts for a defined problem and score each on feasibility, impact, effort and risk. Use when the problem statement is agreed and the user wants different ways to solve it compared side by side. Not for design options for a UI component; see /design-ideate.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: research
  phase: 3
  artifact: 03-design.md
---

# Design

Diverge on solutions for "$ARGUMENTS". Generate multiple solution concepts, evaluate feasibility, and prioritize the most promising approaches.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"research-design","workflow":"research","phase":3,"project":"<project>","event":"skipped","artifact":"03-design.md","note":"<reason or \"none given\">"}`.

## Prerequisites

Run this skill's gate before writing: `sh <this skill's folder>/scripts/gate.sh <project> <project root>`, where `<project root>` is the folder that contains `.singularskills/` (use `.` when you are already there). If it exits non-zero, stop and tell the user what it printed, unless `--skip-checks` was given (see Arguments).

Read `.singularskills/research/<project>/01-discover.md` and `.singularskills/research/<project>/02-define.md`.

If `02-define.md` does not exist, tell the user:

> Phase 2 (Define) has not been completed for "<project>". Run `/research-define <project>` first, or use `--skip-checks` to bypass.

## Process

1. **Read context files:**
   - Read `.singularskills/research/<project>/01-discover.md` for research findings
   - Read `.singularskills/research/<project>/02-define.md` for problem statement, HMW questions, and success criteria
   - Read `references/double-diamond-guide.md` for methodology reference

2. **Research existing solutions:**
   - Use WebSearch to find case studies, best practices, and proven approaches related to each HMW question
   - Use WebFetch to read detailed implementations or methodologies
   - Note what worked, what failed, and why

3. **Generate solution concepts:**
   - Create 3-5 distinct solution concepts, each addressing the problem statement from a different angle
   - For each concept: describe the approach, key components, and how it addresses the HMW questions
   - Include at least one unconventional or contrarian approach

4. **Evaluate each concept:**
   - **Feasibility:** How realistic is implementation? What resources are needed?
   - **Impact:** How well does it address the problem statement and success criteria?
   - **Effort:** What's the relative effort to implement?
   - **Risk:** What could go wrong? What assumptions are being made?

5. **Prioritize and recommend:**
   - Rank concepts by impact/feasibility balance
   - Recommend top 1-2 concepts for validation in the Deliver phase
   - Explain trade-offs between the top options

6. **Write the artifact** to `.singularskills/research/<project>/03-design.md` with sections:
   - **Problem Recap** — one-paragraph summary from Define
   - **Solution Concepts** — each concept with description and rationale
   - **Evaluation Matrix** — feasibility, impact, effort, risk per concept
   - **Recommendations** — top concepts with reasoning
   - **Validation Plan** — what to test in the Deliver phase

## Output

The solution concepts written to `.singularskills/research/<project>/03-design.md`. Present a summary to the user highlighting:
- Number of concepts generated
- Top recommendation and why
- Key trade-offs between top options
- What needs validation in the Deliver phase

**Record the run.** Append each of these events to `.singularskills/log.jsonl` as one line (create the folder and file if missing):

- Before you start work (once the gate has passed or `--skip-checks` was given): `{"ts":"<ISO timestamp>","skill":"research-design","workflow":"research","phase":3,"project":"<project>","event":"started","artifact":"03-design.md","note":""}`
- After you have written the artifact: the same line with `"event":"finished"`.
- If the gate refused and the user did not bypass it: the same line with `"event":"refused"` and `"note"` set to what the gate printed, instead of the other two; then stop.

Open the artifact with this frontmatter (`agent` is the agent you run in, or `unknown`; `gate` is `passed` when the gate ran clean and `skipped` under `--skip-checks`):

```yaml
---
skill: research-design
workflow: research
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

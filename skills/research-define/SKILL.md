---
name: research-define
description: Synthesize discovery findings into a sharp problem statement, How Might We questions, success criteria and scope. Use when research on a topic has been gathered and the user needs to narrow it down to the one problem worth solving.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: research
  phase: 2
  artifact: 02-define.md
---

# Define

Converge the broad discovery findings on "$ARGUMENTS" into a focused problem statement, "How Might We" questions, and a research plan for the solution phase.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"<skill name>","workflow":"research","phase":<phase>,"project":"<project>","event":"skipped","artifact":"<artifact file>","note":"<reason or \"none given\">"}`.

## Prerequisites

Run `scripts/gate.sh <project>` from this skill's folder. If it exits non-zero, stop and tell the user what it printed (unless `--skip-checks`, see Arguments).

Read `.singularskills/research/<project>/01-discover.md`. If this file does not exist, tell the user:

> Phase 1 (Discover) has not been completed for "<project>". Run `/research-discover <project>` first, or use `--skip-checks` to bypass.

## Process

1. **Read context files:**
   - Read `.singularskills/research/<project>/01-discover.md` for discovery findings
   - Read `references/double-diamond-guide.md` for methodology reference
   - Read `references/research-plan-template.md` for output structure

2. **Synthesize findings:**
   - Review all themes from the Discover phase
   - Identify the core tension or unmet need
   - Distinguish root causes from symptoms
   - Map relationships between themes

3. **Formulate the problem statement:**
   - Write a clear, specific, actionable problem statement
   - Avoid solution-language (the problem, not the answer)
   - Ensure it's scoped enough to be solvable

4. **Generate "How Might We" questions:**
   - Create 3-5 HMW questions that reframe the problem as opportunities
   - Each HMW should open a different solution direction
   - Avoid HMW questions that are too broad or too narrow

5. **Define success criteria and scope:**
   - What does "solved" look like? Specify measurable criteria
   - What's in scope and out of scope for the Design phase?
   - Identify constraints and assumptions

6. **Write the artifact** to `.singularskills/research/<project>/02-define.md` following the research plan template structure.

## Output

The problem definition written to `.singularskills/research/<project>/02-define.md`. Present a summary to the user highlighting:
- The problem statement
- Top HMW questions
- Key scope decisions
- Recommended focus for the Design phase

**Record the run.** Open the artifact with this frontmatter (`agent` is the agent you run in, or `unknown`; `gate` is `passed` when the gate ran clean and `skipped` under `--skip-checks`):

```yaml
---
skill: research-define
workflow: research
phase: 2
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

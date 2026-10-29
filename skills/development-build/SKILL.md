---
name: development-build
description: Execute a written implementation plan task by task with test-driven development, committing after each task and logging progress. Use when a feature plan already exists and the user says to start building, implement it or work through the tasks. Not for writing the plan; see /development-plan.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: development
  phase: 2
  artifact: 02-build.md
---

# Build

Execute the implementation plan for "$ARGUMENTS" task-by-task, following test-driven development discipline.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"<skill name>","workflow":"development","phase":<phase>,"project":"<project>","event":"skipped","artifact":"<artifact file>","note":"<reason or \"none given\">"}`.

## Prerequisites

Run `scripts/gate.sh <project>` from this skill's folder. If it exits non-zero, stop and tell the user what it printed (unless `--skip-checks`, see Arguments).

Read `.singularskills/development/<project>/01-plan.md`. If this file does not exist, tell the user:

> No plan exists for "<project>". Run `/development-plan <project>` first, or use `--skip-checks` to bypass.

## Process

For each task in the plan:

1. **Write the failing test first:**
   - Write the test that verifies the task's expected behavior
   - Run the test suite — confirm the new test fails
   - If it passes without implementation, the test isn't testing anything — rewrite it

2. **Implement the minimal code to pass:**
   - Write only what's needed to make the failing test pass
   - Don't add features, refactor, or "improve" beyond the task scope
   - Follow existing codebase patterns and conventions

3. **Verify:**
   - Run the full test suite — all tests must pass
   - If other tests broke, fix them before moving on

4. **Commit:**
   - Stage the relevant files
   - Write a clear commit message following the project's convention

5. **Log progress** — after each task, append to the execution log:
   - Task name and status (completed/skipped/blocked)
   - Commit hash
   - Any issues encountered

6. **Write the artifact** to `.singularskills/development/<project>/02-build.md`

## Output

The execution log written to `.singularskills/development/<project>/02-build.md`. Present a summary to the user highlighting:
- Tasks completed vs. total
- All commits made
- Any issues or deviations from the plan

**Record the run.** Open the artifact with this frontmatter (`agent` is the agent you run in, or `unknown`; `gate` is `passed` when the gate ran clean and `skipped` under `--skip-checks`):

```yaml
---
skill: development-build
workflow: development
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

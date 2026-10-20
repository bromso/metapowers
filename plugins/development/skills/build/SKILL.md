---
name: build
description: Execute a written implementation plan task by task with test-driven development, committing after each task and logging progress. Use when a feature plan already exists and the user says to start building, implement it or work through the tasks. Not for writing the plan; see /development:plan.
argument-hint: "[project] [--skip-checks]"
---

# Build

Execute the implementation plan for "$ARGUMENTS" task-by-task, following test-driven development discipline.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.metapowers/development/<project>/skip-log.md`: `- <ISO timestamp> — <skill name> skipped prerequisite check for <artifact file> — reason: <reason or "none given">`.

## Prerequisites

Read `.metapowers/development/<project>/01-plan.md`. If this file does not exist, tell the user:

> No plan exists for "<project>". Run `/development:plan <project>` first, or use `--skip-checks` to bypass.

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

6. **Write the artifact** to `.metapowers/development/<project>/02-build.md`

## Output

The execution log written to `.metapowers/development/<project>/02-build.md`. Present a summary to the user highlighting:
- Tasks completed vs. total
- All commits made
- Any issues or deviations from the plan

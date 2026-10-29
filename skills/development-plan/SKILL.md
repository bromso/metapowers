---
name: development-plan
description: Break a feature into an implementation plan of small tasks with exact files, tests and commits. Use when the user is about to build a feature and wants the work broken down first. Not for stories, a backlog or project scope or schedule; see /project-management-user-stories, /project-management-backlog-creation, /project-management-project-charter or /project-management-roadmap.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: development
  phase: 1
  artifact: 01-plan.md
---

# Plan

Create a detailed implementation plan for "$ARGUMENTS". Break the work into bite-sized tasks (2-5 minutes each) with exact file paths, test strategy, and commit points.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"development-plan","workflow":"development","phase":1,"project":"<project>","event":"skipped","artifact":"01-plan.md","note":"<reason or \"none given\">"}`.

## Prerequisites

Before you start work, append this line to `.singularskills/log.jsonl` (create the folder and file if missing): `{"ts":"<ISO timestamp>","skill":"development-plan","workflow":"development","phase":1,"project":"<project>","event":"started","artifact":"01-plan.md","note":""}`.

None — this is the first phase of any development effort.

## Process

1. **Understand the feature:**
   - Clarify what "<project>" means — ask the user if ambiguous
   - Identify acceptance criteria and constraints
   - Determine scope boundaries

2. **Explore the codebase:**
   - Read relevant existing code, tests, and configuration
   - Identify files to create and files to modify
   - Understand existing patterns and conventions
   - Note dependencies and potential conflicts

3. **Break into tasks:**
   - Each task should take 2-5 minutes to complete
   - Each task produces a working, committable state
   - Order tasks so each builds on the previous
   - For each task specify: files to touch, steps, expected outcome

4. **Define test strategy:**
   - What tests need to be written?
   - What existing tests might break?
   - How to verify the feature works end-to-end?

5. **Write the plan** using the template from `references/plan-template.md`

6. **Write the artifact** to `.singularskills/development/<project>/01-plan.md`

## Output

The implementation plan written to `.singularskills/development/<project>/01-plan.md`. Present a summary to the user highlighting:
- Number of tasks
- Key architectural decisions
- Test strategy
- Estimated complexity

**Record the run.** After you have written the artifact, append this line to `.singularskills/log.jsonl` (the `started` line of Prerequisites, with `"event":"finished"`): `{"ts":"<ISO timestamp>","skill":"development-plan","workflow":"development","phase":1,"project":"<project>","event":"finished","artifact":"01-plan.md","note":""}`.

Open the artifact with this frontmatter (`agent` is the agent you run in, or `unknown`; `gate` is `none`, as this phase has no gate):

```yaml
---
skill: development-plan
workflow: development
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

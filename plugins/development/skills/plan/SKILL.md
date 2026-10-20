---
name: plan
description: Break a feature into an implementation plan of small tasks with exact files, tests and commits. Use when the user is about to build a feature and wants the work broken down first. Not for stories, a backlog or project scope or schedule; see /project-management:user-stories, /project-management:backlog-creation, /project-management:project-charter or /project-management:roadmap.
argument-hint: "[project] [--skip-checks]"
---

# Plan

Create a detailed implementation plan for "$ARGUMENTS". Break the work into bite-sized tasks (2-5 minutes each) with exact file paths, test strategy, and commit points.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.metapowers/development/<project>/skip-log.md`: `- <ISO timestamp> — <skill name> skipped prerequisite check for <artifact file> — reason: <reason or "none given">`.

## Prerequisites

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

5. **Write the plan** using the template from `${CLAUDE_PLUGIN_ROOT}/shared/plan-template.md`

6. **Write the artifact** to `.metapowers/development/<project>/01-plan.md`

## Output

The implementation plan written to `.metapowers/development/<project>/01-plan.md`. Present a summary to the user highlighting:
- Number of tasks
- Key architectural decisions
- Test strategy
- Estimated complexity

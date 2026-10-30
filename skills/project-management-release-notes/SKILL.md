---
name: project-management-release-notes
description: Draft user-facing release notes — new features, improvements, bug fixes, breaking changes with migration steps and known issues — under a version and date. Use when a release or sprint has shipped and the user needs to tell users what changed. Not for merging the branch or opening the pull request; see /development-ship.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: project-management
  phase: 3
  artifact: 03-review.md
---

# Release Notes

Draft release notes for "$ARGUMENTS". List all shipped features with user-facing descriptions, note breaking changes and migration steps, list known issues, and organize by category.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"project-management-release-notes","workflow":"project-management","phase":3,"project":"<project>","event":"skipped","artifact":"03-review.md","note":"<reason or \"none given\">"}`.

## Prerequisites

**Part of a workflow.** This skill is phase 3 (Review) of the Scrum workflow (`project-management`); cross-domain workflows run it too. First check `.singularskills/log.jsonl` for an open run for this project: a `run-started` line with `"project":"<project>"` and no later `run-finished` line for the same `workflow` and `project`. If one exists, the conductor is running you: continue here. Otherwise, if the user asked to start, run, continue or resume a process or workflow rather than this one step, do not continue here: invoke the `workflow` skill with the workflow the user asked for, or `project-management` when they named none, followed by `<project>`; it runs this phase in order, asks before it writes and records the run. Otherwise continue here: a later phase runs on its own, behind its gate.

Run this skill's gate before writing: `sh <this skill's folder>/scripts/gate.sh <project> <project root>`, where `<project root>` is the folder that contains `.singularskills/` (use `.` when you are already there). If it exits non-zero, stop and tell the user what it printed, unless `--skip-checks` was given (see Arguments). On a refusal, before you stop, append this line to `.singularskills/log.jsonl` (create the folder and file if missing): `{"ts":"<ISO timestamp>","skill":"project-management-release-notes","workflow":"project-management","phase":3,"project":"<project>","event":"refused","artifact":"03-review.md","note":"<what the gate printed>"}`. Once the gate has passed, or under `--skip-checks` once you have appended the `skipped` line, append this line before you start work: `{"ts":"<ISO timestamp>","skill":"project-management-release-notes","workflow":"project-management","phase":3,"project":"<project>","event":"started","artifact":"03-review.md","note":""}`.

Check that `.singularskills/project-management/<project>/00-initiate.md` exists. If it does not, tell the user to run an Initiate skill first (e.g., project-charter) and stop.

## Process

1. **Read existing context:**
   - Read `.singularskills/project-management/<project>/00-initiate.md` for project context and product vision
   - Read `.singularskills/project-management/<project>/03-review.md` if it exists (for sprint review and completed stories)
   - Read `.singularskills/project-management/<project>/02-sprint.md` if it exists (for sprint state and delivery details)
   - Read `.singularskills/project-management/<project>/01-plan.md` if it exists (for backlog, story descriptions, and acceptance criteria)

2. **List all features shipped in the release/sprint:**
   - Gather all completed stories from the sprint review or sprint backlog
   - Include bug fixes that were resolved in this release
   - Include improvements or enhancements to existing features
   - Exclude internal-only changes (refactoring, test improvements, CI changes) unless they affect users
   - Note the version number and release date

3. **Write user-facing descriptions for each feature:**
   - Write in benefit-focused language: what the user can now do, not how it was implemented
   - Use plain language — avoid internal jargon, code references, or ticket numbers
   - Keep each description to 1-2 sentences
   - Include examples or before/after comparisons where they clarify the change
   - For technical features, explain the user-visible impact ("Faster page loads" not "Optimized database queries")

4. **Note breaking changes and migration steps:**
   - List any changes that break existing behavior, APIs, or integrations
   - For each breaking change, explain: what changed, why it changed, and what users need to do
   - Provide step-by-step migration instructions if applicable
   - Note the deprecation timeline if old behavior is being phased out gradually
   - Mark breaking changes prominently so they are not missed

5. **List known issues and workarounds:**
   - List any known bugs or limitations in this release
   - For each known issue, provide a workaround if one exists
   - Note which issues are planned to be fixed in the next release
   - Be honest about known issues — users trust transparency more than perfection

6. **Group by category:**
   - Organize release notes into clear categories:
     - **New Features** — entirely new capabilities
     - **Improvements** — enhancements to existing features
     - **Bug Fixes** — resolved issues
     - **Breaking Changes** — changes requiring user action
     - **Known Issues** — current limitations with workarounds
   - Within each category, order by user impact (most impactful first)

7. **Add version number and date:**
   - Include the version number (e.g., v1.2.0) following semantic versioning if applicable
   - Include the release date
   - If this is a pre-release or beta, note the stability level
   - Reference the previous version for context ("Changes since v1.1.0")

8. **Write the artifact** — append to `.singularskills/project-management/<project>/03-review.md` under a `## Release Notes` section. Create the file with a `# Review — <project>` heading if it does not exist; if a `## Release Notes` section already exists, replace only that section. The section contains:
   - **Version & Date** — version number, release date, previous version reference
   - **New Features** — user-facing descriptions of new capabilities
   - **Improvements** — enhancements to existing features
   - **Bug Fixes** — resolved issues with brief descriptions
   - **Breaking Changes** — changes requiring user action with migration steps
   - **Known Issues** — current limitations with workarounds

## Output

Release notes appended to `.singularskills/project-management/<project>/03-review.md`. Present a summary highlighting:
- Version number and release date
- Number of new features, improvements, and bug fixes
- Any breaking changes requiring user action
- Number of known issues
- Overall release theme (one sentence describing the release focus)

**Record the run.** After you have written your section, append this line to `.singularskills/log.jsonl` (the `started` line of Prerequisites, with `"event":"finished"`): `{"ts":"<ISO timestamp>","skill":"project-management-release-notes","workflow":"project-management","phase":3,"project":"<project>","event":"finished","artifact":"03-review.md","note":""}`.

This artifact is shared by every skill of phase 3 (Review). The frontmatter is written once, by whoever creates the file: if you create it, open it with the block below (`skill` is the phase title, `started` the time of that first write; `gate` is `passed` when the gate ran clean and `skipped` under `--skip-checks`); if it already exists, leave the block alone except to update `finished` and to set `gate` to the worst value among the sections (`skipped` over `passed`).

```yaml
---
skill: Review
workflow: project-management
phase: 3
project: <project>
started: <ISO timestamp>
finished: <ISO timestamp>
agent: <the agent you run in, or "unknown">
gate: <passed|skipped>
---
```

Open your `## Release Notes` section with one italic line, `*<skill name> · <ISO timestamp> · gate: <passed|skipped>*` (your skill name is `project-management-release-notes`).

End your section with `### Decisions` and `### Open questions` (one level under your `## Release Notes` heading, so the section stays one block), in this shape:

```markdown
### Decisions
- <what was chosen> — <why> — <what was rejected>

### Open questions
- <what the next phase or a reviewer must settle>
```

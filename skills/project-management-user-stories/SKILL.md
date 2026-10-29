---
name: project-management-user-stories
description: Write user stories in As a / I want / So that form with Given/When/Then acceptance criteria, checked against INVEST and split when too large. Use when the user needs stories written or rewritten with testable acceptance criteria, or stories are too big or vague to estimate. Not for planning how to code one feature; see /development-plan.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: project-management
  phase: 1
  artifact: 01-plan.md
---

# User Stories

Write detailed user stories for "$ARGUMENTS". Use the "As a / I want / So that" format, add Given/When/Then acceptance criteria, validate against the INVEST checklist, and split stories that are too large.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"project-management-user-stories","workflow":"project-management","phase":1,"project":"<project>","event":"skipped","artifact":"01-plan.md","note":"<reason or \"none given\">"}`.

## Prerequisites

Run this skill's gate before writing: `sh <this skill's folder>/scripts/gate.sh <project> <project root>`, where `<project root>` is the folder that contains `.singularskills/` (use `.` when you are already there). If it exits non-zero, stop and tell the user what it printed, unless `--skip-checks` was given (see Arguments). On a refusal, before you stop, append this line to `.singularskills/log.jsonl` (create the folder and file if missing): `{"ts":"<ISO timestamp>","skill":"project-management-user-stories","workflow":"project-management","phase":1,"project":"<project>","event":"refused","artifact":"01-plan.md","note":"<what the gate printed>"}`. Once the gate has passed, or under `--skip-checks` once you have appended the `skipped` line, append this line before you start work: `{"ts":"<ISO timestamp>","skill":"project-management-user-stories","workflow":"project-management","phase":1,"project":"<project>","event":"started","artifact":"01-plan.md","note":""}`.

Check that `.singularskills/project-management/<project>/00-initiate.md` exists. If it does not, tell the user to run an Initiate skill first (e.g., project-charter) and stop.

## Process

1. **Read existing context:**
   - Read `.singularskills/project-management/<project>/00-initiate.md` for charter and stakeholder context
   - Read `.singularskills/project-management/<project>/01-plan.md` if it exists (for vision, roadmap, and backlog)
   - Read `references/user-story-template.md` for the standard story format
   - Read `references/scrum-guide.md` for Scrum alignment

2. **Write stories in standard format:**
   - For each story (from the backlog, or created fresh if no backlog exists):
     - **As a** [specific persona — not just "user"], **I want** [concrete action], **so that** [measurable benefit]
   - Use personas identified in stakeholder mapping or charter
   - Ensure the "so that" clause expresses real user or business value
   - Avoid implementation details in the story statement — focus on the need, not the solution

3. **Add Given/When/Then acceptance criteria:**
   - Write 2-5 acceptance criteria per story using the Gherkin format:
     - **Given** [precondition or context]
     - **When** [action performed by the user]
     - **Then** [expected observable outcome]
   - Cover the happy path, key edge cases, and error scenarios
   - Make criteria specific and testable — avoid vague terms like "should work properly"
   - Include data examples where relevant (e.g., "Given a cart with 3 items totaling $45.00")

4. **Validate against INVEST checklist:**
   - For each story, check:
     - **Independent** — can be developed without depending on another story
     - **Negotiable** — details can be discussed; it is not a rigid specification
     - **Valuable** — delivers clear value to the user or business
     - **Estimable** — the team can reasonably estimate the effort
     - **Small** — can be completed within a single sprint
     - **Testable** — acceptance criteria are concrete enough to verify
   - Flag stories that fail any INVEST criterion and note what needs to change

5. **Add story details:**
   - **Priority:** Must / Should / Could / Won't (from backlog prioritization)
   - **Labels:** feature, bug, tech-debt, spike + component labels (frontend, backend, etc.)
   - **Dependencies:** other stories or external dependencies
   - **Size estimate:** story points using Fibonacci scale (1, 2, 3, 5, 8, 13) if known
   - **Epic:** parent epic from the backlog

6. **Split stories that are too large:**
   - Any story estimated at >13 points needs splitting
   - Splitting strategies:
     - **By workflow step:** split a multi-step process into individual steps
     - **By data variation:** handle one data type first, add others later
     - **By operation:** split CRUD into separate Create, Read, Update, Delete stories
     - **By persona:** if multiple users benefit, split by user type
     - **By acceptance criteria:** each complex criterion becomes its own story
   - After splitting, re-validate each new story against INVEST

7. **Write the artifact** — append to `.singularskills/project-management/<project>/01-plan.md` under a `## User Stories` section. Create the file with a `# Plan — <project>` heading if it does not exist; if a `## User Stories` section already exists, replace only that section. The section contains:
   - **Stories** — each story with full format: statement, acceptance criteria, INVEST status, details
   - **Split Log** — stories that were split, the strategy used, and resulting stories
   - **INVEST Violations** — any remaining violations with notes on resolution
   - **Story Count Summary** — total stories, by priority, by epic, by size

## Output

User stories appended to `.singularskills/project-management/<project>/01-plan.md`. Present a summary highlighting:
- Total number of stories written
- Stories passing all INVEST criteria vs. those with violations
- Stories that were split and why
- Distribution by priority and size estimate

**Record the run.** After you have written your section, append this line to `.singularskills/log.jsonl` (the `started` line of Prerequisites, with `"event":"finished"`): `{"ts":"<ISO timestamp>","skill":"project-management-user-stories","workflow":"project-management","phase":1,"project":"<project>","event":"finished","artifact":"01-plan.md","note":""}`.

This artifact is shared by every skill of phase 1 (Plan). The frontmatter is written once, by whoever creates the file: if you create it, open it with the block below (`skill` is the phase title, `started` the time of that first write; `gate` is `passed` when the gate ran clean and `skipped` under `--skip-checks`); if it already exists, leave the block alone except to update `finished` and to set `gate` to the worst value among the sections (`skipped` over `passed`).

```yaml
---
skill: Plan
workflow: project-management
phase: 1
project: <project>
started: <ISO timestamp>
finished: <ISO timestamp>
agent: <the agent you run in, or "unknown">
gate: <passed|skipped>
---
```

Open your `## User Stories` section with one italic line, `*<skill name> · <ISO timestamp> · gate: <passed|skipped>*` (your skill name is `project-management-user-stories`).

End your section with `### Decisions` and `### Open questions` (one level under your `## User Stories` heading, so the section stays one block), in this shape:

```markdown
### Decisions
- <what was chosen> — <why> — <what was rejected>

### Open questions
- <what the next phase or a reviewer must settle>
```

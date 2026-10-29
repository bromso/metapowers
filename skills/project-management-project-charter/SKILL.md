---
name: project-management-project-charter
description: Define a project charter — purpose, vision, SMART objectives, in- and out-of-scope items, constraints, milestones and initial risks. Use when a project is starting and the user needs its purpose, scope boundaries and milestones agreed before planning the work. Not for breaking one feature into coding tasks; see /development-plan.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: project-management
  phase: 0
  artifact: 00-initiate.md
---

# Project Charter

Define the project charter for "$ARGUMENTS". Establish the project's purpose and vision, set measurable objectives, define scope boundaries, identify constraints and assumptions, and outline an initial timeline with milestones.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"project-management-project-charter","workflow":"project-management","phase":0,"project":"<project>","event":"skipped","artifact":"00-initiate.md","note":"<reason or \"none given\">"}`.

## Prerequisites

None — this is a Phase 0 (Initiate) skill and can run first.

## Process

1. **Read shared context:**
   - Read `references/project-charter-template.md` for charter structure
   - Read `references/scrum-guide.md` for Scrum alignment
   - Read `.singularskills/project-management/<project>/00-initiate.md` if it exists (to avoid overwriting other sections)

2. **Define project purpose and vision:**
   - Articulate the problem being solved and why it matters now
   - Write a clear, concise vision statement (1-2 sentences)
   - Identify the target users or beneficiaries
   - State the expected business value or impact

3. **Set measurable objectives:**
   - Define 3-5 SMART objectives (Specific, Measurable, Achievable, Relevant, Time-bound)
   - For each objective: metric, baseline, target, target date
   - Distinguish between primary objectives (must-achieve) and stretch goals
   - Ensure objectives ladder up to the vision

4. **Define scope — in and out:**
   - **In scope:** features, deliverables, and capabilities included
   - **Out of scope:** explicitly excluded items to prevent scope creep
   - **Deferred:** items intentionally pushed to future phases
   - Document the rationale for each scope decision

5. **Identify constraints and assumptions:**
   - **Constraints:** budget, timeline, technology, regulatory, staffing
   - **Assumptions:** market conditions, dependencies, resource availability
   - **Dependencies:** external teams, third-party services, approvals needed
   - Flag high-risk assumptions that need early validation

6. **Outline high-level timeline and milestones:**
   - Define major milestones with target dates
   - Identify the critical path and key decision points
   - Map milestones to sprint boundaries where possible
   - Include go/no-go checkpoints

7. **Initial risk identification:**
   - Brainstorm top 5-10 risks using categories: technical, schedule, resource, external
   - For each risk: likelihood (high/medium/low), impact (high/medium/low), mitigation strategy
   - Identify risk owners where possible
   - Flag risks that could be project-ending

8. **Write the artifact** — append to `.singularskills/project-management/<project>/00-initiate.md` under a `## Project Charter` section. Create the file with a `# Initiate — <project>` heading if it does not exist; if a `## Project Charter` section already exists, replace only that section. The section contains:
   - **Vision** — problem statement, vision, target users
   - **Objectives** — SMART objectives table with metrics and targets
   - **Scope** — in-scope, out-of-scope, deferred items
   - **Constraints & Assumptions** — categorized list with risk flags
   - **Milestones** — timeline with key dates and checkpoints
   - **Initial Risks** — risk register with likelihood, impact, mitigation

## Output

Project charter appended to `.singularskills/project-management/<project>/00-initiate.md`. Present a summary highlighting:
- Project purpose and vision statement
- Top 3 objectives with target metrics
- Key scope decisions (what's in vs. out)

**Record the run.** Append each of these events to `.singularskills/log.jsonl` as one line (create the folder and file if missing):

- Before you start work: `{"ts":"<ISO timestamp>","skill":"project-management-project-charter","workflow":"project-management","phase":0,"project":"<project>","event":"started","artifact":"00-initiate.md","note":""}`
- After you have written your section: the same line with `"event":"finished"`.

This artifact is shared by every skill of phase 0 (Initiate). The frontmatter is written once, by whoever creates the file: if you create it, open it with the block below (`skill` is the phase title, `started` the time of that first write; `gate` is `none`, as this phase has no gate); if it already exists, leave the block alone except to update `finished`.

```yaml
---
skill: Initiate
workflow: project-management
phase: 0
project: <project>
started: <ISO timestamp>
finished: <ISO timestamp>
agent: <the agent you run in, or "unknown">
gate: none
---
```

Open your `## Project Charter` section with one italic line, `*<skill name> · <ISO timestamp> · gate: none*` (your skill name is `project-management-project-charter`).

End your section with `### Decisions` and `### Open questions` (one level under your `## Project Charter` heading, so the section stays one block), in this shape:

```markdown
### Decisions
- <what was chosen> — <why> — <what was rejected>

### Open questions
- <what the next phase or a reviewer must settle>
```

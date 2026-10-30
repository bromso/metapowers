---
name: compliance-compliance-roadmap
description: Build a phased compliance roadmap with milestones, dependencies between certifications, the critical path and a budget per phase. Use when the user asks for a plan or timeline to get several certifications, wants to know how long SOC 2 then ISO 27001 will take, or needs a compliance budget.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: compliance
  phase: 0
  artifact: 00-scope.md
---

# Compliance Roadmap

Build a phased compliance roadmap for "$ARGUMENTS" with concrete milestones, inter-certification dependencies, resource estimates, and target dates.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"compliance-compliance-roadmap","workflow":"compliance","phase":0,"project":"<project>","event":"skipped","artifact":"00-scope.md","note":"<reason or \"none given\">"}`.

## Prerequisites

**Part of a workflow.** This skill is phase 0 (Scope) of the GRC Lifecycle workflow (`compliance`); cross-domain workflows run it too. Unless the user named this skill, check `.singularskills/log.jsonl` for an open run for this project: a `run-started` line with `"project":"<project>"` and no later `run-finished` line for the same `workflow` and `project`. If there is no open run, or the user asked to start, run, continue or resume a process or workflow rather than this one step, do not continue here: invoke the `workflow` skill with the workflow the user asked for, or `compliance` when they named none, followed by `<project>`. It runs this phase in order, asks before it writes and records the run. Continue here when the user named this skill, or when an open run exists (the conductor is running you).

Before you start work, append this line to `.singularskills/log.jsonl` (create the folder and file if missing): `{"ts":"<ISO timestamp>","skill":"compliance-compliance-roadmap","workflow":"compliance","phase":0,"project":"<project>","event":"started","artifact":"00-scope.md","note":""}`.

None — this is a Phase 0 (Scope) skill.

## Process

1. **Read context files:**
   - Read `references/grc-lifecycle-guide.md` for GRC methodology reference
   - Read `.singularskills/compliance/<project>/00-scope.md` for regulation inventory, priorities, and control framework

2. **Phase 1 — Quick wins and highest-priority regulations:**
   - Select Tier 1 regulations and quick wins from the priority analysis
   - Define specific milestones with target completion dates
   - Identify controls to implement first (highest leverage points)
   - Estimate effort: internal hours, external consultant days, tool costs

3. **Phase 2 — Comprehensive coverage:**
   - Select Tier 2 regulations building on Phase 1 foundations
   - Map dependencies — which Phase 1 controls are prerequisites?
   - Define milestones with target dates accounting for Phase 1 completion
   - Estimate incremental effort (many controls already in place)

4. **Phase 3 — Advanced and sector-specific:**
   - Select Tier 3 and sector-specific regulations
   - Map dependencies on Phase 1 and Phase 2 controls
   - Define milestones with target dates
   - Estimate effort for remaining gap controls

5. **Dependency mapping:**
   - Document inter-certification dependencies (e.g., ISO 27001 before CSA STAR Level 2, SOC 2 before enterprise sales)
   - Identify critical path — which certifications gate others?
   - Flag parallel tracks that can proceed independently

6. **Resource planning:**
   - Estimate total resources: internal FTEs, external consultants, audit costs, tooling
   - Create budget breakdown by phase
   - Identify hiring or training needs
   - Recommend GRC tooling (if applicable)

7. **Write the artifact** — append to `.singularskills/compliance/<project>/00-scope.md` under a `## Compliance Roadmap` section. Create the file with a `# Scope — <project>` heading if it does not exist; if a `## Compliance Roadmap` section already exists, replace only that section. The section contains:
   - **Roadmap Overview** — visual timeline of all three phases
   - **Phase 1 Plan** — regulations, milestones, dates, resources
   - **Phase 2 Plan** — regulations, milestones, dates, resources
   - **Phase 3 Plan** — regulations, milestones, dates, resources
   - **Dependency Graph** — inter-certification dependencies and critical path
   - **Resource Summary** — total budget, FTE needs, external support

## Output

The compliance roadmap appended to `.singularskills/compliance/<project>/00-scope.md`. Present a summary to the user highlighting:
- Phase 1 target regulations and timeline
- Critical path dependencies
- Total estimated resource needs
- Recommended next step: begin Phase 1 assessments (e.g., `/compliance-soc2 <project>` or `/compliance-iso27001 <project>`)

**Record the run.** After you have written your section, append this line to `.singularskills/log.jsonl` (the `started` line of Prerequisites, with `"event":"finished"`): `{"ts":"<ISO timestamp>","skill":"compliance-compliance-roadmap","workflow":"compliance","phase":0,"project":"<project>","event":"finished","artifact":"00-scope.md","note":""}`.

This artifact is shared by every skill of phase 0 (Scope). The frontmatter is written once, by whoever creates the file: if you create it, open it with the block below (`skill` is the phase title, `started` the time of that first write; `gate` is `none`, as this phase has no gate); if it already exists, leave the block alone except to update `finished`.

```yaml
---
skill: Scope
workflow: compliance
phase: 0
project: <project>
started: <ISO timestamp>
finished: <ISO timestamp>
agent: <the agent you run in, or "unknown">
gate: none
---
```

Open your `## Compliance Roadmap` section with one italic line, `*<skill name> · <ISO timestamp> · gate: none*` (your skill name is `compliance-compliance-roadmap`).

End your section with `### Decisions` and `### Open questions` (one level under your `## Compliance Roadmap` heading, so the section stays one block), in this shape:

```markdown
### Decisions
- <what was chosen> — <why> — <what was rejected>

### Open questions
- <what the next phase or a reviewer must settle>
```

End the artifact with this paragraph, verbatim:

> **Not legal or audit advice.** This artifact supports preparation for compliance work; certification, attestation and regulatory conclusions require a qualified auditor or counsel.

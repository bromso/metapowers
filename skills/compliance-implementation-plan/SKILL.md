---
name: compliance-implementation-plan
description: Create a phased implementation plan that groups controls into three waves with steps, effort, owners, dates, resources and go/no-go checkpoints. Use when the user knows which controls they need and asks who does what by when, how many person-days remediation will take, or how to schedule it.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: compliance
  phase: 2
  artifact: 02-remediate.md
---

# Implementation Plan

Create a phased implementation plan for "$ARGUMENTS" grouping controls into implementation waves with effort estimates, dependencies, owners, and target completion dates.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"compliance-implementation-plan","workflow":"compliance","phase":2,"project":"<project>","event":"skipped","artifact":"02-remediate.md","note":"<reason or \"none given\">"}`.

## Prerequisites

**Part of a workflow.** This skill is phase 2 (Remediate) of the GRC Lifecycle workflow (`compliance`); cross-domain workflows run it too. First check `.singularskills/log.jsonl` for an open run for this project: a `run-started` line with `"project":"<project>"` and no later `run-finished` line for the same `workflow` and `project`. If one exists, the conductor is running you: continue here. Otherwise, if the user asked to start, run, continue or resume a process or workflow rather than this one step, do not continue here: invoke the `workflow` skill with the workflow the user asked for, or `compliance` when they named none, followed by `<project>`; it runs this phase in order, asks before it writes and records the run. Otherwise continue here: a later phase runs on its own, behind its gate.

Run this skill's gate before writing: `sh <this skill's folder>/scripts/gate.sh <project> <project root>`, where `<project root>` is the folder that contains `.singularskills/` (use `.` when you are already there). If it exits non-zero, stop and tell the user what it printed, unless `--skip-checks` was given (see Arguments). On a refusal, before you stop, append this line to `.singularskills/log.jsonl` (create the folder and file if missing): `{"ts":"<ISO timestamp>","skill":"compliance-implementation-plan","workflow":"compliance","phase":2,"project":"<project>","event":"refused","artifact":"02-remediate.md","note":"<what the gate printed>"}`. Once the gate has passed, or under `--skip-checks` once you have appended the `skipped` line, append this line before you start work: `{"ts":"<ISO timestamp>","skill":"compliance-implementation-plan","workflow":"compliance","phase":2,"project":"<project>","event":"started","artifact":"02-remediate.md","note":""}`.

Read `.singularskills/compliance/<project>/00-scope.md`. If this file does not exist, tell the user:

> Phase 0 (Scope) has not been completed for "<project>". Run `/compliance-regulatory-landscape <project>` first, or use `--skip-checks` to bypass.

## Process

1. **Read context files:**
   - Read `references/grc-lifecycle-guide.md` for GRC methodology reference
   - Read `.singularskills/compliance/<project>/00-scope.md` for scope and control framework context
   - Read `.singularskills/compliance/<project>/02-remediate.md` for gap register, control mapping, evidence plan, and policy gaps

2. **Group controls into implementation waves:**
   - **Wave 1 — Critical & Quick Wins (Month 1-2):** Critical gaps with regulatory urgency, quick wins (low effort, high impact), foundation controls enabling other controls
   - **Wave 2 — Core Controls (Month 3-4):** Core security and compliance controls, policy development and approval, evidence collection infrastructure
   - **Wave 3 — Advanced & Optimization (Month 5-6):** Advanced monitoring and automation, optimization of existing controls, continuous improvement processes

3. **Per-control implementation detail:**
   - Implementation steps — concrete actions to deploy the control
   - Effort estimate in person-days
   - Dependencies — other controls, tools, approvals, or resources needed first
   - Owner — team or individual responsible
   - Target completion date
   - Success criteria — how to verify the control is operating effectively

4. **Resource planning:**
   - Internal resource needs — hours by team (engineering, security, legal, HR)
   - External resource needs — consultants, auditors, tool vendors
   - Tool/platform needs — GRC tool, SIEM, identity provider, training platform
   - Budget estimate by wave

5. **Timeline and checkpoints:**
   - Create Gantt-style timeline showing waves, controls, and dependencies
   - Set progress review checkpoints (bi-weekly or monthly)
   - Define go/no-go criteria for advancing to next wave
   - Identify critical path items that could delay the overall plan

6. **Write the artifact** — append to `.singularskills/compliance/<project>/02-remediate.md` under a `## Implementation Plan` section. Create the file with a `# Remediate — <project>` heading if it does not exist; if a `## Implementation Plan` section already exists, replace only that section. The section contains:
   - **Implementation Waves** — wave 1/2/3 groupings with rationale
   - **Control Implementation Details** — per-control steps, effort, owner, target date
   - **Resource Plan** — internal and external resource requirements
   - **Timeline** — Gantt-style overview with milestones
   - **Checkpoints** — review cadence and go/no-go criteria
   - **Risk Register** — risks to the implementation plan with mitigations

## Output

The implementation plan appended to `.singularskills/compliance/<project>/02-remediate.md`. Present a summary to the user highlighting:
- Number of controls per wave
- Total estimated effort in person-days
- Critical path and key dependencies
- Recommended first actions to begin Wave 1

**Record the run.** After you have written your section, append this line to `.singularskills/log.jsonl` (the `started` line of Prerequisites, with `"event":"finished"`): `{"ts":"<ISO timestamp>","skill":"compliance-implementation-plan","workflow":"compliance","phase":2,"project":"<project>","event":"finished","artifact":"02-remediate.md","note":""}`.

This artifact is shared by every skill of phase 2 (Remediate). The frontmatter is written once, by whoever creates the file: if you create it, open it with the block below (`skill` is the phase title, `started` the time of that first write; `gate` is `passed` when the gate ran clean and `skipped` under `--skip-checks`); if it already exists, leave the block alone except to update `finished` and to set `gate` to the worst value among the sections (`skipped` over `passed`).

```yaml
---
skill: Remediate
workflow: compliance
phase: 2
project: <project>
started: <ISO timestamp>
finished: <ISO timestamp>
agent: <the agent you run in, or "unknown">
gate: <passed|skipped>
---
```

Open your `## Implementation Plan` section with one italic line, `*<skill name> · <ISO timestamp> · gate: <passed|skipped>*` (your skill name is `compliance-implementation-plan`).

End your section with `### Decisions` and `### Open questions` (one level under your `## Implementation Plan` heading, so the section stays one block), in this shape:

```markdown
### Decisions
- <what was chosen> — <why> — <what was rejected>

### Open questions
- <what the next phase or a reviewer must settle>
```

End the artifact with this paragraph, verbatim:

> **Not legal or audit advice.** This artifact supports preparation for compliance work; certification, attestation and regulatory conclusions require a qualified auditor or counsel.

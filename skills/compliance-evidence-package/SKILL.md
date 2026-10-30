---
name: compliance-evidence-package
description: Compile an auditor-ready evidence package — evidence checked for currency and completeness, organized by control, indexed to regulation clauses, with a delivery plan. Use when the auditor has asked for evidence, fieldwork is about to start, or the user needs to hand over a request list or evidence binder.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: compliance
  phase: 3
  artifact: 03-certify.md
---

# Evidence Package

Compile and organize evidence packages for "$ARGUMENTS" structured for auditor consumption, with evidence index, supporting documentation, and delivery preparation.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"compliance-evidence-package","workflow":"compliance","phase":3,"project":"<project>","event":"skipped","artifact":"03-certify.md","note":"<reason or \"none given\">"}`.

## Prerequisites

**Part of a workflow.** This skill is phase 3 (Certify) of the GRC Lifecycle workflow (`compliance`); cross-domain workflows run it too. Unless the user named this skill, check `.singularskills/log.jsonl` for an open run for this project: a `run-started` line with `"project":"<project>"` and no later `run-finished` line for the same `workflow` and `project`. If there is no open run, or the user asked to start, run, continue or resume a process or workflow rather than this one step, do not continue here: invoke the `workflow` skill with the workflow the user asked for, or `compliance` when they named none, followed by `<project>`. It runs this phase in order, asks before it writes and records the run. Continue here when the user named this skill, or when an open run exists (the conductor is running you).

Run this skill's gate before writing: `sh <this skill's folder>/scripts/gate.sh <project> <project root>`, where `<project root>` is the folder that contains `.singularskills/` (use `.` when you are already there). If it exits non-zero, stop and tell the user what it printed, unless `--skip-checks` was given (see Arguments). On a refusal, before you stop, append this line to `.singularskills/log.jsonl` (create the folder and file if missing): `{"ts":"<ISO timestamp>","skill":"compliance-evidence-package","workflow":"compliance","phase":3,"project":"<project>","event":"refused","artifact":"03-certify.md","note":"<what the gate printed>"}`. Once the gate has passed, or under `--skip-checks` once you have appended the `skipped` line, append this line before you start work: `{"ts":"<ISO timestamp>","skill":"compliance-evidence-package","workflow":"compliance","phase":3,"project":"<project>","event":"started","artifact":"03-certify.md","note":""}`.

Read `.singularskills/compliance/<project>/00-scope.md`. If this file does not exist, tell the user:

> Phase 0 (Scope) has not been completed for "<project>". Run `/compliance-regulatory-landscape <project>` first, or use `--skip-checks` to bypass.

## Process

1. **Read context files:**
   - Read `references/grc-lifecycle-guide.md` for GRC methodology reference
   - Read `references/evidence-catalog-template.md` for evidence structure
   - Read `.singularskills/compliance/<project>/00-scope.md` for scope and control framework context
   - Read `.singularskills/compliance/<project>/02-remediate.md` for evidence plan
   - Read `.singularskills/compliance/<project>/03-certify.md` for audit readiness status

2. **Gather evidence items:**
   - For each certification: collect all evidence items per the evidence plan
   - Verify each item is current (collected within the required observation period)
   - Verify each item is complete (no partial screenshots, truncated logs, or unsigned attestations)
   - Flag any missing or expired evidence items for immediate remediation

3. **Organize by control:**
   - Structure evidence in the auditor's preferred organization (by control, by domain, or by regulation requirement)
   - Group related evidence items together (e.g., policy + procedure + evidence of execution)
   - Create clear naming convention for all evidence files

4. **Create evidence index:**
   - Build table of contents mapping each control to its evidence items
   - Include evidence item name, type, date collected, collection method, location
   - Cross-reference to regulation requirements (clause numbers, criteria)
   - Note any compensating controls or exceptions with justification

5. **Supporting documentation:**
   - Include policies and procedures referenced by controls
   - Include organizational charts showing reporting lines and responsibilities
   - Include system architecture diagrams relevant to scope
   - Include risk assessment and treatment documentation

6. **Package for delivery:**
   - Define delivery method (shared drive, GRC tool export, secure file transfer, physical)
   - Create package checklist for completeness verification
   - Prepare cover letter / engagement summary for auditor
   - Set access permissions and confidentiality protections

7. **Write the artifact** — append to `.singularskills/compliance/<project>/03-certify.md` under a `## Evidence Package` section. Create the file with a `# Certify — <project>` heading if it does not exist; if a `## Evidence Package` section already exists, replace only that section. The section contains:
   - **Evidence Index** — complete mapping of controls to evidence items
   - **Evidence Status** — per-item currency and completeness verification
   - **Package Contents** — list of all documents included
   - **Supporting Documentation** — policies, procedures, diagrams included
   - **Delivery Plan** — method, timeline, access details
   - **Outstanding Items** — evidence items still needed before delivery

## Output

The evidence package plan appended to `.singularskills/compliance/<project>/03-certify.md`. Present a summary to the user highlighting:
- Total evidence items packaged
- Number of outstanding items
- Delivery method and timeline
- Any items requiring urgent attention before audit

**Record the run.** After you have written your section, append this line to `.singularskills/log.jsonl` (the `started` line of Prerequisites, with `"event":"finished"`): `{"ts":"<ISO timestamp>","skill":"compliance-evidence-package","workflow":"compliance","phase":3,"project":"<project>","event":"finished","artifact":"03-certify.md","note":""}`.

This artifact is shared by every skill of phase 3 (Certify). The frontmatter is written once, by whoever creates the file: if you create it, open it with the block below (`skill` is the phase title, `started` the time of that first write; `gate` is `passed` when the gate ran clean and `skipped` under `--skip-checks`); if it already exists, leave the block alone except to update `finished` and to set `gate` to the worst value among the sections (`skipped` over `passed`).

```yaml
---
skill: Certify
workflow: compliance
phase: 3
project: <project>
started: <ISO timestamp>
finished: <ISO timestamp>
agent: <the agent you run in, or "unknown">
gate: <passed|skipped>
---
```

Open your `## Evidence Package` section with one italic line, `*<skill name> · <ISO timestamp> · gate: <passed|skipped>*` (your skill name is `compliance-evidence-package`).

End your section with `### Decisions` and `### Open questions` (one level under your `## Evidence Package` heading, so the section stays one block), in this shape:

```markdown
### Decisions
- <what was chosen> — <why> — <what was rejected>

### Open questions
- <what the next phase or a reviewer must settle>
```

End the artifact with this paragraph, verbatim:

> **Not legal or audit advice.** This artifact supports preparation for compliance work; certification, attestation and regulatory conclusions require a qualified auditor or counsel.

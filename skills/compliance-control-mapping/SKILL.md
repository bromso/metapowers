---
name: compliance-control-mapping
description: Map each gap in the remediation register to unified controls that close it across several regulations, then sequence those controls by coverage and dependency. Use when the user has a gap register and asks which controls fix the most gaps, or in what order to implement remediation controls.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: compliance
  phase: 2
  artifact: 02-remediate.md
---

# Control Mapping

Map remediation actions for "$ARGUMENTS" to unified controls that satisfy multiple regulations simultaneously. Prioritize controls by cross-regulation coverage to maximize compliance impact per implementation effort.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"compliance-control-mapping","workflow":"compliance","phase":2,"project":"<project>","event":"skipped","artifact":"02-remediate.md","note":"<reason or \"none given\">"}`.

## Prerequisites

Run this skill's gate before writing: `sh <this skill's folder>/scripts/gate.sh <project> <project root>`, where `<project root>` is the folder that contains `.singularskills/` (use `.` when you are already there). If it exits non-zero, stop and tell the user what it printed, unless `--skip-checks` was given (see Arguments).

Read `.singularskills/compliance/<project>/00-scope.md`. If this file does not exist, tell the user:

> Phase 0 (Scope) has not been completed for "<project>". Run `/compliance-regulatory-landscape <project>` first, or use `--skip-checks` to bypass.

## Process

1. **Read context files:**
   - Read `references/grc-lifecycle-guide.md` for GRC methodology reference
   - Read `references/control-mapping-template.md` for mapping structure
   - Read `.singularskills/compliance/<project>/00-scope.md` for scope and control framework context
   - Read `.singularskills/compliance/<project>/02-remediate.md` for the gap register

2. **Map gaps to controls:**
   - For each gap in the register, identify which control(s) remediate it
   - Use the unified control framework from Phase 0 as the control taxonomy
   - Document the specific implementation needed per control to close each gap

3. **Cross-regulation mapping:**
   - For each control, map to all regulation requirements it satisfies
   - One control can close gaps across SOC 2, ISO 27001, HIPAA, GDPR simultaneously
   - Document the specific clause/criterion satisfied per regulation
   - Identify regulation-specific control variations (same control, different evidence)

4. **Prioritize by coverage:**
   - Rank controls by cross-regulation coverage count
   - Calculate coverage efficiency — number of gaps closed per control implemented
   - Identify foundation controls that enable other controls
   - Flag controls with single-regulation applicability (still necessary but lower priority)

5. **Create implementation sequence:**
   - Order controls by: dependency (foundation first), coverage (high-coverage first), effort (quick wins first within same coverage tier)
   - Identify control clusters that should be implemented together
   - Flag controls with external dependencies (vendor, tool, consultant)

6. **Write the artifact** — append to `.singularskills/compliance/<project>/02-remediate.md` under a `## Control Mapping` section. Create the file with a `# Remediate — <project>` heading if it does not exist; if a `## Control Mapping` section already exists, replace only that section. The section contains:
   - **Control-to-Gap Mapping** — table showing each control and which gaps it closes
   - **Cross-Regulation Coverage** — matrix of controls vs. regulations satisfied
   - **Implementation Sequence** — ordered list with rationale
   - **Coverage Efficiency** — controls ranked by gaps-closed-per-effort
   - **Foundation Controls** — controls that must be in place before others

## Output

The control mapping appended to `.singularskills/compliance/<project>/02-remediate.md`. Present a summary to the user highlighting:
- Total controls needed to close all gaps
- Top 5 highest-coverage controls
- Foundation controls to implement first
- Estimated coverage percentage after implementing top 10 controls

**Record the run.** Append each of these events to `.singularskills/log.jsonl` as one line (create the folder and file if missing):

- Before you start work (once the gate has passed or `--skip-checks` was given): `{"ts":"<ISO timestamp>","skill":"compliance-control-mapping","workflow":"compliance","phase":2,"project":"<project>","event":"started","artifact":"02-remediate.md","note":""}`
- After you have written your section: the same line with `"event":"finished"`.
- If the gate refused and the user did not bypass it: the same line with `"event":"refused"` and `"note"` set to what the gate printed, instead of the other two; then stop.

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

Open your `## Control Mapping` section with one italic line, `*<skill name> · <ISO timestamp> · gate: <passed|skipped>*` (your skill name is `compliance-control-mapping`).

End your section with `### Decisions` and `### Open questions` (one level under your `## Control Mapping` heading, so the section stays one block), in this shape:

```markdown
### Decisions
- <what was chosen> — <why> — <what was rejected>

### Open questions
- <what the next phase or a reviewer must settle>
```

End the artifact with this paragraph, verbatim:

> **Not legal or audit advice.** This artifact supports preparation for compliance work; certification, attestation and regulatory conclusions require a qualified auditor or counsel.

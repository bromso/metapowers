---
name: compliance-evidence-plan
description: Design the evidence collection strategy for each control — evidence type, format, frequency, owner, storage and retention, plus a collection calendar and automation options. Use when the user asks what evidence auditors will want for each control, who should collect it, or how to automate evidence collection.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: compliance
  phase: 2
  artifact: 02-remediate.md
---

# Evidence Plan

Design an evidence collection strategy for "$ARGUMENTS" defining what evidence is needed for each control, how to collect it, how often, and who owns it.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"compliance-evidence-plan","workflow":"compliance","phase":2,"project":"<project>","event":"skipped","artifact":"02-remediate.md","note":"<reason or \"none given\">"}`.

## Prerequisites

Run this skill's gate before writing: `sh <this skill's folder>/scripts/gate.sh <project> <project root>`, where `<project root>` is the folder that contains `.singularskills/` (use `.` when you are already there). If it exits non-zero, stop and tell the user what it printed, unless `--skip-checks` was given (see Arguments). On a refusal, before you stop, append this line to `.singularskills/log.jsonl` (create the folder and file if missing): `{"ts":"<ISO timestamp>","skill":"compliance-evidence-plan","workflow":"compliance","phase":2,"project":"<project>","event":"refused","artifact":"02-remediate.md","note":"<what the gate printed>"}`. Once the gate has passed, or under `--skip-checks` once you have appended the `skipped` line, append this line before you start work: `{"ts":"<ISO timestamp>","skill":"compliance-evidence-plan","workflow":"compliance","phase":2,"project":"<project>","event":"started","artifact":"02-remediate.md","note":""}`.

Read `.singularskills/compliance/<project>/00-scope.md`. If this file does not exist, tell the user:

> Phase 0 (Scope) has not been completed for "<project>". Run `/compliance-regulatory-landscape <project>` first, or use `--skip-checks` to bypass.

## Process

1. **Read context files:**
   - Read `references/grc-lifecycle-guide.md` for GRC methodology reference
   - Read `references/evidence-catalog-template.md` for evidence structure
   - Read `.singularskills/compliance/<project>/00-scope.md` for scope and control framework context
   - Read `.singularskills/compliance/<project>/02-remediate.md` for control mapping

2. **Define evidence per control:**
   - For each control: identify evidence type — policy document, configuration export, system log, screenshot, attestation form, training record, meeting minutes, risk register entry
   - Specify format requirements based on auditor expectations (PDF, CSV export, system screenshot with timestamp, signed attestation)
   - Document evidence sufficiency — what makes this evidence convincing to an auditor

3. **Collection logistics:**
   - Define collection frequency per evidence item — continuous (automated), monthly, quarterly, semi-annually, annually
   - Assign evidence owner — who is responsible for collecting and maintaining each item
   - Define storage location — GRC tool, shared drive, document management system
   - Set retention period per regulation requirement (typically 3-7 years)

4. **Evidence collection calendar:**
   - Create monthly calendar of evidence collection activities
   - Identify peak collection periods (align with audit windows)
   - Set reminder cadences for recurring collections
   - Flag evidence items approaching expiry or staleness

5. **Automation opportunities:**
   - Identify evidence that can be collected automatically (config scans, access reviews, log exports)
   - Map to GRC tooling capabilities (Vanta, Drata, Secureframe)
   - Estimate manual effort for non-automatable evidence
   - Calculate total evidence maintenance burden (hours/month)

6. **Write the artifact** — append to `.singularskills/compliance/<project>/02-remediate.md` under a `## Evidence Plan` section. Create the file with a `# Remediate — <project>` heading if it does not exist; if a `## Evidence Plan` section already exists, replace only that section. The section contains:
   - **Evidence Catalog** — table with control, evidence type, format, frequency, owner, storage, retention
   - **Collection Calendar** — month-by-month evidence collection schedule
   - **Automation Plan** — evidence items suitable for automated collection
   - **Effort Estimate** — total hours/month for evidence maintenance
   - **Evidence Gap Alert** — controls currently lacking any evidence

## Output

The evidence plan appended to `.singularskills/compliance/<project>/02-remediate.md`. Present a summary to the user highlighting:
- Total evidence items required
- Percentage automatable vs. manual
- Estimated monthly maintenance effort
- Evidence items requiring immediate attention

**Record the run.** After you have written your section, append this line to `.singularskills/log.jsonl` (the `started` line of Prerequisites, with `"event":"finished"`): `{"ts":"<ISO timestamp>","skill":"compliance-evidence-plan","workflow":"compliance","phase":2,"project":"<project>","event":"finished","artifact":"02-remediate.md","note":""}`.

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

Open your `## Evidence Plan` section with one italic line, `*<skill name> · <ISO timestamp> · gate: <passed|skipped>*` (your skill name is `compliance-evidence-plan`).

End your section with `### Decisions` and `### Open questions` (one level under your `## Evidence Plan` heading, so the section stays one block), in this shape:

```markdown
### Decisions
- <what was chosen> — <why> — <what was rejected>

### Open questions
- <what the next phase or a reviewer must settle>
```

End the artifact with this paragraph, verbatim:

> **Not legal or audit advice.** This artifact supports preparation for compliance work; certification, attestation and regulatory conclusions require a qualified auditor or counsel.

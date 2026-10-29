---
name: compliance-audit-readiness
description: Assess whether a project is ready for its formal audit — evidence completeness, control operating periods, a mock audit, readiness per regulation and a pre-audit punch list. Use when remediation is mostly done, an audit date is approaching, and the user asks if they are ready, what evidence is still missing, or when to book the auditor.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: compliance
  phase: 3
  artifact: 03-certify.md
---

# Audit Readiness

Assess audit readiness for "$ARGUMENTS" by evaluating evidence completeness, control operating effectiveness, and team preparedness for formal audit engagement.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"compliance-audit-readiness","workflow":"compliance","phase":3,"project":"<project>","event":"skipped","artifact":"03-certify.md","note":"<reason or \"none given\">"}`.

## Prerequisites

Run this skill's gate before writing: `sh <this skill's folder>/scripts/gate.sh <project> <project root>`, where `<project root>` is the folder that contains `.singularskills/` (use `.` when you are already there). If it exits non-zero, stop and tell the user what it printed, unless `--skip-checks` was given (see Arguments). On a refusal, before you stop, append this line to `.singularskills/log.jsonl` (create the folder and file if missing): `{"ts":"<ISO timestamp>","skill":"compliance-audit-readiness","workflow":"compliance","phase":3,"project":"<project>","event":"refused","artifact":"03-certify.md","note":"<what the gate printed>"}`. Once the gate has passed, or under `--skip-checks` once you have appended the `skipped` line, append this line before you start work: `{"ts":"<ISO timestamp>","skill":"compliance-audit-readiness","workflow":"compliance","phase":3,"project":"<project>","event":"started","artifact":"03-certify.md","note":""}`.

Read `.singularskills/compliance/<project>/00-scope.md`. If this file does not exist, tell the user:

> Phase 0 (Scope) has not been completed for "<project>". Run `/compliance-regulatory-landscape <project>` first, or use `--skip-checks` to bypass.

## Process

1. **Read context files:**
   - Read `references/grc-lifecycle-guide.md` for GRC methodology reference
   - Read `.singularskills/compliance/<project>/00-scope.md` for scope and control framework context
   - Read `.singularskills/compliance/<project>/02-remediate.md` for control mapping and evidence plan

2. **Evidence completeness check:**
   - For each regulation being certified: verify all required evidence items are collected
   - Check evidence currency — no expired or stale evidence items
   - Verify evidence format meets auditor expectations
   - Identify evidence gaps — missing, incomplete, or insufficient items
   - Calculate evidence completeness percentage per regulation

3. **Control operating effectiveness:**
   - Verify controls have been operating for the required period (typically 3-6 months for SOC 2 Type II, varies by standard)
   - Check for control failures or exceptions during the observation period
   - Verify compensating controls are documented for any known gaps
   - Assess control monitoring — are anomalies being detected and addressed?

4. **Mock audit simulation:**
   - Simulate auditor questions for each control domain
   - Verify document requests can be fulfilled within expected timeframes
   - Identify areas where explanations would be weak or evidence thin
   - Test team knowledge — who answers questions about which controls?

5. **Readiness scoring:**
   - Score each regulation on a readiness scale: Not Ready / Partially Ready / Audit Ready
   - Identify remaining gaps or weak areas per regulation
   - Create pre-audit remediation punch list with owners and deadlines

6. **Team readiness assessment:**
   - Identify who answers auditor questions per control domain
   - Assess team availability during planned audit window
   - Identify training needs for audit participants
   - Prepare audit logistics (room, access, schedules)

7. **Write the artifact** — append to `.singularskills/compliance/<project>/03-certify.md` under a `## Audit Readiness` section. Create the file with a `# Certify — <project>` heading if it does not exist; if a `## Audit Readiness` section already exists, replace only that section. The section contains:
   - **Evidence Completeness Matrix** — per-regulation evidence status
   - **Control Effectiveness Summary** — operating period and effectiveness assessment
   - **Mock Audit Results** — simulated findings and weak areas
   - **Readiness Scorecard** — per-regulation readiness rating
   - **Pre-Audit Punch List** — remaining items to address before audit
   - **Team Readiness** — roles, responsibilities, and preparation needs

## Output

The audit readiness assessment appended to `.singularskills/compliance/<project>/03-certify.md`. Present a summary to the user highlighting:
- Overall readiness rating per regulation
- Evidence completeness percentage
- Number of items on the pre-audit punch list
- Recommended audit start date based on readiness

**Record the run.** After you have written your section, append this line to `.singularskills/log.jsonl` (the `started` line of Prerequisites, with `"event":"finished"`): `{"ts":"<ISO timestamp>","skill":"compliance-audit-readiness","workflow":"compliance","phase":3,"project":"<project>","event":"finished","artifact":"03-certify.md","note":""}`.

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

Open your `## Audit Readiness` section with one italic line, `*<skill name> · <ISO timestamp> · gate: <passed|skipped>*` (your skill name is `compliance-audit-readiness`).

End your section with `### Decisions` and `### Open questions` (one level under your `## Audit Readiness` heading, so the section stays one block), in this shape:

```markdown
### Decisions
- <what was chosen> — <why> — <what was rejected>

### Open questions
- <what the next phase or a reviewer must settle>
```

End the artifact with this paragraph, verbatim:

> **Not legal or audit advice.** This artifact supports preparation for compliance work; certification, attestation and regulatory conclusions require a qualified auditor or counsel.

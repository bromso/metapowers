---
name: legal-compliance-monitor
description: Design a legal team's ongoing compliance oversight — monitoring scope per regulation, owners, escalation levels, board reporting and a compliance calendar. Use when the user needs to decide who owns each regulation, how non-compliance escalates and which legal deadlines to calendar. Not for automated control checks and GRC tooling; see /compliance-continuous-monitoring.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: legal
  phase: 4
  artifact: 04-govern.md
---

# Compliance Monitor

Design ongoing compliance monitoring and reporting for "$ARGUMENTS". Define monitoring scope per regulation, create dashboard metrics, assign compliance owners, and establish reporting cadence.

> **Note:** AI-generated legal content does not constitute legal advice. Consult a qualified attorney.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"legal-compliance-monitor","workflow":"legal","phase":4,"project":"<project>","event":"skipped","artifact":"04-govern.md","note":"<reason or \"none given\">"}`.

## Prerequisites

Run this skill's gate before writing: `sh <this skill's folder>/scripts/gate.sh <project> <project root>`, where `<project root>` is the folder that contains `.singularskills/` (use `.` when you are already there). If it exits non-zero, stop and tell the user what it printed, unless `--skip-checks` was given (see Arguments). On a refusal, before you stop, append this line to `.singularskills/log.jsonl` (create the folder and file if missing): `{"ts":"<ISO timestamp>","skill":"legal-compliance-monitor","workflow":"legal","phase":4,"project":"<project>","event":"refused","artifact":"04-govern.md","note":"<what the gate printed>"}`. Once the gate has passed, or under `--skip-checks` once you have appended the `skipped` line, append this line before you start work: `{"ts":"<ISO timestamp>","skill":"legal-compliance-monitor","workflow":"legal","phase":4,"project":"<project>","event":"started","artifact":"04-govern.md","note":""}`.

Check that `.singularskills/legal/<project>/00-assess.md` exists. If it does not exist, stop and tell the user:

> "Run an Assess skill first (e.g. `/legal-risk-assessment <project>`) to generate the prerequisite assessment artifact."

## Process

1. **Read inputs:**
   - Read `.singularskills/legal/<project>/00-assess.md` for risk context, applicable regulations, and jurisdiction
   - Review any existing compliance artifacts in `.singularskills/legal/<project>/`

2. **Define monitoring scope per regulation:**
   - **GDPR:**
     - Quarterly data mapping review
     - Annual DPIA (Data Protection Impact Assessment) refresh
     - Ongoing data subject request tracking
   - **CCPA:**
     - Annual privacy policy update
     - Consumer request response time monitoring
     - Vendor data sharing audit
   - **SOC 2:**
     - Continuous control monitoring
     - Evidence collection automation
     - Exception tracking and remediation
   - **Accessibility (WCAG):**
     - Quarterly automated accessibility scan
     - Annual manual audit by qualified assessor
     - User complaint tracking and resolution
   - For each regulation, define what "compliant" looks like with measurable criteria

3. **Create compliance dashboard metrics:**
   - **% controls operating effectively** — ratio of passing controls to total controls
   - **Open findings** — count and severity of unresolved compliance findings
   - **Days to remediate** — average time from finding discovery to resolution
   - **Audit readiness score** — composite score reflecting documentation completeness, control effectiveness, and evidence availability
   - Define thresholds for each metric (green/yellow/red status)

4. **Assign compliance owners per regulation:**
   - Map each regulation to a primary compliance owner
   - Define backup owners for coverage during absences
   - Establish clear accountability for control operation, evidence collection, and issue resolution
   - Document owner responsibilities and expected time commitment

5. **Define escalation procedures for non-compliance:**
   - **Level 1** — owner self-remediates within defined timeline
   - **Level 2** — manager notification if remediation deadline missed
   - **Level 3** — executive escalation for high-severity or persistent non-compliance
   - **Level 4** — board notification for material compliance failures
   - Define what triggers each escalation level and expected response times

6. **Set reporting cadence:**
   - **Monthly** — operational compliance report to compliance team (control status, open findings, remediation progress)
   - **Quarterly** — executive compliance summary (dashboard metrics, trend analysis, risk highlights)
   - **Annual** — board-level compliance report (regulatory landscape, audit results, strategic compliance investments)
   - Define report templates and distribution lists for each cadence

7. **Create compliance calendar:**
   - Map all regulatory deadlines, filing dates, and renewal dates
   - Schedule internal audits and reviews
   - Include training deadlines and certification renewals
   - Set preparation milestones ahead of each deadline

8. **Write the artifact** — append to `.singularskills/legal/<project>/04-govern.md` under a `## Compliance Monitor` section. Create the file with a `# Govern — <project>` heading if it does not exist; if a `## Compliance Monitor` section already exists, replace only that section. The section contains:

   - **Monitoring Scope** — per-regulation monitoring activities and frequencies
   - **Dashboard Metrics** — metric definitions, thresholds, and data sources
   - **Compliance Owners** — responsibility matrix by regulation
   - **Escalation Procedures** — escalation levels, triggers, and response times
   - **Reporting Cadence** — report types, audiences, and schedules
   - **Compliance Calendar** — key dates and milestones

## Output

The compliance monitor appended to `.singularskills/legal/<project>/04-govern.md`. Present a summary to the user highlighting:
- Number of regulations under active monitoring
- Key dashboard metrics and their current thresholds
- Compliance owner assignments and any gaps
- Upcoming compliance calendar deadlines

**Record the run.** After you have written your section, append this line to `.singularskills/log.jsonl` (the `started` line of Prerequisites, with `"event":"finished"`): `{"ts":"<ISO timestamp>","skill":"legal-compliance-monitor","workflow":"legal","phase":4,"project":"<project>","event":"finished","artifact":"04-govern.md","note":""}`.

This artifact is shared by every skill of phase 4 (Govern). The frontmatter is written once, by whoever creates the file: if you create it, open it with the block below (`skill` is the phase title, `started` the time of that first write; `gate` is `passed` when the gate ran clean and `skipped` under `--skip-checks`); if it already exists, leave the block alone except to update `finished` and to set `gate` to the worst value among the sections (`skipped` over `passed`).

```yaml
---
skill: Govern
workflow: legal
phase: 4
project: <project>
started: <ISO timestamp>
finished: <ISO timestamp>
agent: <the agent you run in, or "unknown">
gate: <passed|skipped>
---
```

Open your `## Compliance Monitor` section with one italic line, `*<skill name> · <ISO timestamp> · gate: <passed|skipped>*` (your skill name is `legal-compliance-monitor`).

End your section with `### Decisions` and `### Open questions` (one level under your `## Compliance Monitor` heading, so the section stays one block), in this shape:

```markdown
### Decisions
- <what was chosen> — <why> — <what was rejected>

### Open questions
- <what the next phase or a reviewer must settle>
```

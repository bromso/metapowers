---
name: compliance-continuous-monitoring
description: Design a continuous compliance monitoring program — automated control checks, dashboard metrics, alert thresholds and escalation, and GRC tooling such as Vanta or Drata. Use when the user wants to stay audit-ready between audits, automate compliance checks, or set up a compliance dashboard. Not for a legal team's monitoring cadence; see /legal-compliance-monitor.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: compliance
  phase: 4
  artifact: 04-monitor.md
---

# Continuous Monitoring

Design a continuous compliance monitoring program for "$ARGUMENTS" with automated checks, dashboard metrics, alerting thresholds, and GRC tooling integration.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"compliance-continuous-monitoring","workflow":"compliance","phase":4,"project":"<project>","event":"skipped","artifact":"04-monitor.md","note":"<reason or \"none given\">"}`.

## Prerequisites

**Part of a workflow.** This skill is phase 4 (Monitor) of the GRC Lifecycle workflow (`compliance`); cross-domain workflows run it too. Unless the user named this skill, check `.singularskills/log.jsonl` for an open run for this project: a `run-started` line with `"project":"<project>"` and no later `run-finished` line for the same `workflow` and `project`. If there is no open run, or the user asked to start, run, continue or resume a process or workflow rather than this one step, do not continue here: invoke the `workflow` skill with the workflow the user asked for, or `compliance` when they named none, followed by `<project>`. It runs this phase in order, asks before it writes and records the run. Continue here when the user named this skill, or when an open run exists (the conductor is running you).

Run this skill's gate before writing: `sh <this skill's folder>/scripts/gate.sh <project> <project root>`, where `<project root>` is the folder that contains `.singularskills/` (use `.` when you are already there). If it exits non-zero, stop and tell the user what it printed, unless `--skip-checks` was given (see Arguments). On a refusal, before you stop, append this line to `.singularskills/log.jsonl` (create the folder and file if missing): `{"ts":"<ISO timestamp>","skill":"compliance-continuous-monitoring","workflow":"compliance","phase":4,"project":"<project>","event":"refused","artifact":"04-monitor.md","note":"<what the gate printed>"}`. Once the gate has passed, or under `--skip-checks` once you have appended the `skipped` line, append this line before you start work: `{"ts":"<ISO timestamp>","skill":"compliance-continuous-monitoring","workflow":"compliance","phase":4,"project":"<project>","event":"started","artifact":"04-monitor.md","note":""}`.

Read `.singularskills/compliance/<project>/00-scope.md`. If this file does not exist, tell the user:

> Phase 0 (Scope) has not been completed for "<project>". Run `/compliance-regulatory-landscape <project>` first, or use `--skip-checks` to bypass.

## Process

1. **Read context files:**
   - Read `references/grc-lifecycle-guide.md` for GRC methodology reference
   - Read `.singularskills/compliance/<project>/00-scope.md` for scope and applicable regulations
   - Read `.singularskills/compliance/<project>/02-remediate.md` for control mapping and evidence plan
   - Read `.singularskills/compliance/<project>/03-certify.md` for certification status

2. **Define monitoring scope:**
   - For each regulation: identify checks that can be automated vs. manual
   - Automated checks: configuration scanning, access reviews, vulnerability scanning, policy acknowledgments, training completion tracking, encryption verification
   - Manual checks: policy reviews, risk assessments, vendor assessments, physical security inspections
   - Define check frequency — continuous, daily, weekly, monthly, quarterly

3. **Design automated compliance checks:**
   - Configuration scanning — infrastructure-as-code compliance, cloud security posture
   - Access reviews — periodic user access certification, privileged access monitoring
   - Policy acknowledgments — employee policy acceptance tracking
   - Training completion — security awareness, role-specific training
   - Vulnerability management — scan frequency, remediation SLAs
   - Change management — deployment tracking, approval verification

4. **Dashboard metrics:**
   - Compliance score per regulation (percentage of controls passing)
   - Open findings count and aging
   - Days to remediate (average, P95)
   - Evidence freshness — percentage of evidence current vs. stale
   - Control effectiveness rate — percentage of controls operating as designed
   - Trend lines — compliance posture over time

5. **Alerting and escalation:**
   - Define alerting thresholds (e.g., compliance score drops below 90%)
   - Set escalation paths — who gets notified at each severity level
   - Define response SLAs for compliance alerts
   - Integration with incident management (PagerDuty, Slack, email)

6. **GRC tooling integration:**
   - Assess current GRC tooling (Vanta, Drata, Secureframe, or manual)
   - Map monitoring requirements to tool capabilities
   - Identify gaps requiring custom integration or manual processes
   - Recommend tooling improvements if applicable

7. **Write the artifact** — append to `.singularskills/compliance/<project>/04-monitor.md` under a `## Continuous Monitoring` section. Create the file with a `# Monitor — <project>` heading if it does not exist; if a `## Continuous Monitoring` section already exists, replace only that section. The section contains:
   - **Monitoring Scope** — automated vs. manual checks per regulation
   - **Automated Checks** — check descriptions, frequency, tools
   - **Dashboard Design** — metrics, visualizations, and data sources
   - **Alerting Framework** — thresholds, escalation paths, SLAs
   - **GRC Tooling** — current state and integration plan
   - **Operational Cadence** — daily/weekly/monthly compliance activities

## Output

The continuous monitoring design appended to `.singularskills/compliance/<project>/04-monitor.md`. Present a summary to the user highlighting:
- Percentage of controls with automated monitoring
- Key dashboard metrics recommended
- Critical alerting thresholds
- GRC tooling recommendations

**Record the run.** After you have written your section, append this line to `.singularskills/log.jsonl` (the `started` line of Prerequisites, with `"event":"finished"`): `{"ts":"<ISO timestamp>","skill":"compliance-continuous-monitoring","workflow":"compliance","phase":4,"project":"<project>","event":"finished","artifact":"04-monitor.md","note":""}`.

This artifact is shared by every skill of phase 4 (Monitor). The frontmatter is written once, by whoever creates the file: if you create it, open it with the block below (`skill` is the phase title, `started` the time of that first write; `gate` is `passed` when the gate ran clean and `skipped` under `--skip-checks`); if it already exists, leave the block alone except to update `finished` and to set `gate` to the worst value among the sections (`skipped` over `passed`).

```yaml
---
skill: Monitor
workflow: compliance
phase: 4
project: <project>
started: <ISO timestamp>
finished: <ISO timestamp>
agent: <the agent you run in, or "unknown">
gate: <passed|skipped>
---
```

Open your `## Continuous Monitoring` section with one italic line, `*<skill name> · <ISO timestamp> · gate: <passed|skipped>*` (your skill name is `compliance-continuous-monitoring`).

End your section with `### Decisions` and `### Open questions` (one level under your `## Continuous Monitoring` heading, so the section stays one block), in this shape:

```markdown
### Decisions
- <what was chosen> — <why> — <what was rejected>

### Open questions
- <what the next phase or a reviewer must settle>
```

End the artifact with this paragraph, verbatim:

> **Not legal or audit advice.** This artifact supports preparation for compliance work; certification, attestation and regulatory conclusions require a qualified auditor or counsel.

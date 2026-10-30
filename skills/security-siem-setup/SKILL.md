---
name: security-siem-setup
description: Design a SIEM deployment — platform such as Splunk, Sentinel or Elastic, ingestion, correlation rules mapped to MITRE ATT&CK, dashboards, storage tiers and SOAR integration. Use when the user is choosing or rolling out a SIEM and needs detection rules and dashboards for it. Not for log formats, correlation IDs and tamper-proof audit trails; see /security-logging-architecture.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: security
  phase: 3
  artifact: 03-detect.md
---

# SIEM Setup

Design SIEM architecture, correlation rules, and dashboards for "$ARGUMENTS". Select a SIEM platform, define data sources and ingestion, create detection rules, and build operational dashboards.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"security-siem-setup","workflow":"security","phase":3,"project":"<project>","event":"skipped","artifact":"03-detect.md","note":"<reason or \"none given\">"}`.

## Prerequisites

**Part of a workflow.** This skill is phase 3 (Detect) of the NIST CSF workflow (`security`); cross-domain workflows run it too. First check `.singularskills/log.jsonl` for an open run for this project: a `run-started` line with `"project":"<project>"` and no later `run-finished` line for the same `workflow` and `project`. If one exists, the conductor is running you: continue here. Otherwise, if the user asked to start, run, continue or resume a process or workflow rather than this one step, do not continue here: invoke the `workflow` skill with the workflow the user asked for, or `security` when they named none, followed by `<project>`; it runs this phase in order, asks before it writes and records the run. Otherwise continue here: a later phase runs on its own, behind its gate.

Run this skill's gate before writing: `sh <this skill's folder>/scripts/gate.sh <project> <project root>`, where `<project root>` is the folder that contains `.singularskills/` (use `.` when you are already there). If it exits non-zero, stop and tell the user what it printed, unless `--skip-checks` was given (see Arguments). On a refusal, before you stop, append this line to `.singularskills/log.jsonl` (create the folder and file if missing): `{"ts":"<ISO timestamp>","skill":"security-siem-setup","workflow":"security","phase":3,"project":"<project>","event":"refused","artifact":"03-detect.md","note":"<what the gate printed>"}`. Once the gate has passed, or under `--skip-checks` once you have appended the `skipped` line, append this line before you start work: `{"ts":"<ISO timestamp>","skill":"security-siem-setup","workflow":"security","phase":3,"project":"<project>","event":"started","artifact":"03-detect.md","note":""}`.

Read `.singularskills/security/<project>/00-govern.md`. If this file does not exist, tell the user:

> Phase 0 (Govern) has not been completed for "<project>". Run a Govern skill first (e.g., `/security-security-policy <project>`), or use `--skip-checks` to bypass.

## Process

1. **Select SIEM platform:**
   - Evaluate platforms based on requirements (Splunk, Elastic SIEM, Microsoft Sentinel, Sumo Logic, Google Chronicle, IBM QRadar)
   - Consider: log volume capacity, query performance, built-in detection rules, integration ecosystem, cost model (per-GB vs. per-user vs. capacity-based)
   - Assess cloud-native vs. on-premises vs. hybrid deployment
   - Evaluate managed SIEM services vs. self-hosted for operational overhead
   - Document selection criteria and chosen platform with justification

2. **Define data sources and ingestion:**
   - Map all data sources to be ingested (firewalls, endpoints, cloud providers, applications, identity providers, network devices)
   - Define ingestion methods per source (agent-based, syslog, API, cloud-native connectors)
   - Estimate daily log volume per source for capacity planning
   - Design data normalization and enrichment pipelines (common schema, geo-IP, threat intelligence)
   - Plan for data quality monitoring (detect ingestion gaps, parsing failures, delayed logs)

3. **Create correlation rules:**
   - **Brute force detection** — multiple failed logins from same source within time window, followed by success
   - **Lateral movement** — authentication to multiple systems from a single compromised account within short period
   - **Data exfiltration** — unusual outbound data volume, connections to file sharing services, DNS tunneling indicators
   - **Privilege escalation** — new admin role assignment, sudo/runas usage outside normal patterns, group membership changes
   - **Malware indicators** — known IOC matches (IP, domain, file hash), process execution anomalies, persistence mechanisms
   - **Policy violations** — access from blocked geolocations, use of unauthorized services, data handling violations
   - Map each rule to MITRE ATT&CK techniques for coverage analysis

4. **Build dashboards:**
   - **Security posture** — overall risk score, open alerts by severity, detection coverage, SLA compliance
   - **Active incidents** — current incident timeline, affected systems, response status, assigned responders
   - **Compliance status** — control effectiveness, audit findings, policy compliance metrics
   - **Threat trends** — attack frequency over time, top threat categories, geographic distribution
   - **Data source health** — ingestion volume by source, parsing success rate, latency metrics
   - Design dashboard hierarchy (executive summary, SOC analyst view, detailed investigation view)

5. **Define retention and storage tiers:**
   - **Hot tier** (0-30 days) — full-speed search, real-time correlation, active investigation
   - **Warm tier** (30-90 days) — reduced search speed, historical investigation, trend analysis
   - **Cold tier** (90 days - 1 year) — archived, compliance retention, restored on-demand
   - **Frozen/archive** (1-7 years) — long-term compliance, minimal access, lowest cost
   - Define automated tier transition policies
   - Plan storage cost optimization (compression, deduplication, selective retention)

6. **Integrate with incident response:**
   - Connect SIEM alerts to ticketing system (Jira, ServiceNow, PagerDuty)
   - Define automated ticket creation rules by alert severity
   - Enable SOAR (Security Orchestration, Automation, and Response) playbooks for common scenarios
   - Integrate threat intelligence feeds for IOC matching and alert enrichment
   - Design investigation workflows (alert -> triage -> investigate -> contain -> remediate -> close)

7. **Write the artifact** — append to `.singularskills/security/<project>/03-detect.md` under a `## SIEM Setup` section. Create the file with a `# Detect — <project>` heading if it does not exist; if a `## SIEM Setup` section already exists, replace only that section. The section contains:

   ### SIEM Architecture

   Include sections:
   - **Platform Selection** — chosen SIEM with evaluation criteria and justification
   - **Data Sources** — all sources with ingestion method and volume estimate
   - **Correlation Rules** — detection rules with MITRE ATT&CK mapping
   - **Dashboards** — dashboard inventory with audience and key metrics
   - **Retention Strategy** — storage tiers, retention periods, and cost optimization
   - **Incident Response Integration** — ticketing, SOAR, and threat intelligence feeds
   - **Implementation Roadmap** — phased rollout plan with milestones

## Output

The SIEM architecture appended to `.singularskills/security/<project>/03-detect.md`. Present a summary to the user highlighting:
- Chosen SIEM platform and key decision factors
- Data sources to be ingested and estimated daily volume
- Correlation rules and MITRE ATT&CK coverage
- Dashboard hierarchy and key operational views

**Record the run.** After you have written your section, append this line to `.singularskills/log.jsonl` (the `started` line of Prerequisites, with `"event":"finished"`): `{"ts":"<ISO timestamp>","skill":"security-siem-setup","workflow":"security","phase":3,"project":"<project>","event":"finished","artifact":"03-detect.md","note":""}`.

This artifact is shared by every skill of phase 3 (Detect). The frontmatter is written once, by whoever creates the file: if you create it, open it with the block below (`skill` is the phase title, `started` the time of that first write; `gate` is `passed` when the gate ran clean and `skipped` under `--skip-checks`); if it already exists, leave the block alone except to update `finished` and to set `gate` to the worst value among the sections (`skipped` over `passed`).

```yaml
---
skill: Detect
workflow: security
phase: 3
project: <project>
started: <ISO timestamp>
finished: <ISO timestamp>
agent: <the agent you run in, or "unknown">
gate: <passed|skipped>
---
```

Open your `## SIEM Setup` section with one italic line, `*<skill name> · <ISO timestamp> · gate: <passed|skipped>*` (your skill name is `security-siem-setup`).

End your section with `### Decisions` and `### Open questions` (one level under your `## SIEM Setup` heading, so the section stays one block), in this shape:

```markdown
### Decisions
- <what was chosen> — <why> — <what was rejected>

### Open questions
- <what the next phase or a reviewer must settle>
```

End the artifact with this paragraph, verbatim:

> **Not a penetration test or audit.** This artifact is generated analysis; validate findings against the live system and have material controls reviewed by a qualified security professional.

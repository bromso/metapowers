---
description: Design continuous compliance monitoring
---

# Continuous Monitoring

Design a continuous compliance monitoring program for "$ARGUMENTS" with automated checks, dashboard metrics, alerting thresholds, and GRC tooling integration.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.metapowers/compliance/<project>/skip-log.md`: `- <ISO timestamp> — <skill name> skipped prerequisite check for <artifact file> — reason: <reason or "none given">`.

## Prerequisites

Read `.metapowers/compliance/<project>/00-scope.md`. If this file does not exist, tell the user:

> Phase 0 (Scope) has not been completed for "<project>". Run `/compliance:regulatory-landscape <project>` first, or use `--skip-checks` to bypass.

## Process

1. **Read context files:**
   - Read `${CLAUDE_PLUGIN_ROOT}/shared/grc-lifecycle-guide.md` for GRC methodology reference
   - Read `.metapowers/compliance/<project>/00-scope.md` for scope and applicable regulations
   - Read `.metapowers/compliance/<project>/02-remediate.md` for control mapping and evidence plan
   - Read `.metapowers/compliance/<project>/03-certify.md` for certification status

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

7. **Write the artifact** — append to `.metapowers/compliance/<project>/04-monitor.md` under a `## Continuous Monitoring` section. Create the file with a `# Monitor — <project>` heading if it does not exist; if a `## Continuous Monitoring` section already exists, replace only that section. The section contains:
   - **Monitoring Scope** — automated vs. manual checks per regulation
   - **Automated Checks** — check descriptions, frequency, tools
   - **Dashboard Design** — metrics, visualizations, and data sources
   - **Alerting Framework** — thresholds, escalation paths, SLAs
   - **GRC Tooling** — current state and integration plan
   - **Operational Cadence** — daily/weekly/monthly compliance activities

## Output

The continuous monitoring design appended to `.metapowers/compliance/<project>/04-monitor.md`. Present a summary to the user highlighting:
- Percentage of controls with automated monitoring
- Key dashboard metrics recommended
- Critical alerting thresholds
- GRC tooling recommendations

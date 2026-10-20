---
name: monitoring-strategy
description: Design security monitoring — which events to watch, alert severities and thresholds, on-call rotation and escalation, the monitoring stack, runbooks per alert, and detection and response SLOs. Use when the user asks what security events to alert on, who gets paged, or how fast they should detect and respond. Not for rolling out a SIEM; see /security:siem-setup.
argument-hint: "[project] [--skip-checks]"
---

# Monitoring Strategy

Design security monitoring, alerting, and observability for "$ARGUMENTS". Define what to monitor, set alert thresholds and severity levels, and establish on-call procedures and response runbooks.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.metapowers/security/<project>/skip-log.md`: `- <ISO timestamp> — <skill name> skipped prerequisite check for <artifact file> — reason: <reason or "none given">`.

## Prerequisites

Read `.metapowers/security/<project>/00-govern.md`. If this file does not exist, tell the user:

> Phase 0 (Govern) has not been completed for "<project>". Run a Govern skill first (e.g., `/security:security-policy <project>`), or use `--skip-checks` to bypass.

## Process

1. **Define what to monitor:**
   - **Authentication events** — login successes and failures, MFA challenges, password resets, account lockouts
   - **Authorization failures** — access denied events, privilege escalation attempts, unauthorized API calls
   - **Data access** — sensitive data reads, bulk data exports, data modification patterns
   - **Configuration changes** — infrastructure changes, security group modifications, IAM policy updates
   - **Network traffic anomalies** — unusual outbound traffic, connections to known malicious IPs, DNS anomalies
   - **Application-level events** — error rate spikes, request pattern changes, resource exhaustion

2. **Set alert thresholds and severity levels:**
   - **Critical (P1)** — active breach indicators, data exfiltration detected, privilege escalation confirmed (response: immediate, 24/7)
   - **High (P2)** — multiple failed login attempts from single source, unauthorized configuration change, known malware signature (response: within 1 hour)
   - **Medium (P3)** — unusual access pattern, new admin account created, certificate expiring soon (response: within 4 hours)
   - **Low (P4)** — informational security events, policy compliance drift, minor configuration anomaly (response: next business day)
   - Define alert deduplication and correlation to reduce noise

3. **Define on-call rotation and escalation:**
   - Design on-call rotation schedule (primary and secondary responders)
   - Define escalation paths by severity (P1 escalates to security lead and CISO)
   - Set escalation timeouts (auto-escalate if not acknowledged within defined window)
   - Ensure coverage across time zones and holidays
   - Define communication channels per severity (PagerDuty, Slack, phone)

4. **Choose monitoring stack:**
   - Evaluate monitoring platforms (Datadog, Splunk, Elastic, CloudWatch, Grafana + Prometheus)
   - Define integration requirements with existing infrastructure
   - Plan metric collection, log aggregation, and trace correlation
   - Design dashboard hierarchy (executive overview, team-specific, service-specific)
   - If the chosen platform is a SIEM, hand off its rollout (ingestion, correlation rules, SIEM dashboards) to `/security:siem-setup`

5. **Create runbooks for common alerts:**
   - Write step-by-step response procedures for each alert type
   - Include investigation steps, containment actions, and escalation criteria
   - Define automated response actions for high-confidence detections
   - Link runbooks to alert configurations for quick access during incidents

6. **Define SLOs for detection and response:**
   - Mean time to detect (MTTD) targets by threat category
   - Mean time to respond (MTTR) targets by severity level
   - Alert accuracy targets (minimize false positive rate)
   - Coverage targets (percentage of critical systems monitored)
   - Define measurement and reporting cadence

7. **Write the artifact** — append to `.metapowers/security/<project>/03-detect.md` under a `## Monitoring Strategy` section. Create the file with a `# Detect — <project>` heading if it does not exist; if a `## Monitoring Strategy` section already exists, replace only that section. The section contains:

   - **Monitoring Scope** — events and systems to monitor with rationale
   - **Alert Thresholds** — severity levels, thresholds, and response timeframes
   - **On-Call and Escalation** — rotation schedule and escalation paths
   - **Monitoring Stack** — selected tools and integration architecture
   - **Runbooks** — response procedures per alert type
   - **Detection SLOs** — MTTD, MTTR, accuracy, and coverage targets

## Output

The monitoring strategy appended to `.metapowers/security/<project>/03-detect.md`. Present a summary to the user highlighting:
- Key events and systems to be monitored
- Alert severity levels and response timeframes
- On-call structure and escalation paths
- Detection SLO targets

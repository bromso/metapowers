---
description: Design security monitoring, alerting, and observability
---

# Monitoring Strategy

Design security monitoring, alerting, and observability for "$ARGUMENTS". Define what to monitor, set alert thresholds and severity levels, and establish on-call procedures and response runbooks.

## Prerequisites

Read `.metapowers/security/$ARGUMENTS/00-govern.md`. If this file does not exist, tell the user:

> Phase 0 (Govern) has not been completed for "$ARGUMENTS". Run a Govern skill first (e.g., `/security:security-policy $ARGUMENTS`), or use `--skip-checks` to bypass.

If `--skip-checks` is present in $ARGUMENTS, skip this check and log to `.metapowers/security/$ARGUMENTS/skip-log.md`.

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

7. **Write the artifact** to `.metapowers/security/$ARGUMENTS/03-detect.md` with heading:

   ## Monitoring Strategy

   Include sections:
   - **Monitoring Scope** — events and systems to monitor with rationale
   - **Alert Thresholds** — severity levels, thresholds, and response timeframes
   - **On-Call and Escalation** — rotation schedule and escalation paths
   - **Monitoring Stack** — selected tools and integration architecture
   - **Runbooks** — response procedures per alert type
   - **Detection SLOs** — MTTD, MTTR, accuracy, and coverage targets

## Output

The monitoring strategy written to `.metapowers/security/$ARGUMENTS/03-detect.md`. Present a summary to the user highlighting:
- Key events and systems to be monitored
- Alert severity levels and response timeframes
- On-call structure and escalation paths
- Detection SLO targets

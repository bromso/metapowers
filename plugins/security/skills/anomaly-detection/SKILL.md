---
description: Define behavioral baselines and anomaly detection rules
---

# Anomaly Detection

Define behavioral baselines and anomaly detection rules for "$ARGUMENTS". Establish normal patterns, create detection rules for deviations, and configure automated responses for high-confidence anomalies.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.metapowers/security/<project>/skip-log.md`: `- <ISO timestamp> — <skill name> skipped prerequisite check for <artifact file> — reason: <reason or "none given">`.

## Prerequisites

Read `.metapowers/security/<project>/00-govern.md`. If this file does not exist, tell the user:

> Phase 0 (Govern) has not been completed for "<project>". Run a Govern skill first (e.g., `/security:security-policy <project>`), or use `--skip-checks` to bypass.

## Process

1. **Establish behavioral baselines:**
   - **Login patterns** — normal login times, locations, devices, and frequency per user population
   - **API usage patterns** — typical request rates, endpoint access distribution, payload sizes
   - **Data access patterns** — normal query volumes, data export sizes, access to sensitive resources
   - **Network patterns** — expected traffic volumes, destination IPs/domains, protocol distribution
   - **System patterns** — normal CPU/memory usage, process lists, file system activity
   - Define baseline measurement period (minimum 30 days of data, accounting for business cycles)

2. **Define anomaly detection rules:**
   - **Impossible travel** — login from geographically distant locations within an impossible timeframe
   - **Unusual hours** — access outside established working hours for the user's role and timezone
   - **Failed login spike** — sudden increase in failed authentication attempts (brute force indicator)
   - **Bulk data export** — data retrieval significantly exceeding baseline (exfiltration indicator)
   - **Privilege escalation attempts** — repeated access denied events followed by elevated access
   - **New admin accounts** — creation of privileged accounts outside change management process
   - **Lateral movement** — sequential access across multiple systems from a single compromised account
   - **DNS anomalies** — queries to newly registered domains, high-entropy domain names (DGA detection)

3. **Set detection thresholds:**
   - Define statistical thresholds (standard deviations from baseline, percentile-based)
   - Tune thresholds to minimize false positives while maintaining detection sensitivity
   - Implement different thresholds by user population (admins vs. standard users, humans vs. service accounts)
   - Define learning period for new users and systems before enforcing anomaly rules
   - Plan for seasonal adjustments (end-of-quarter, product launches, maintenance windows)

4. **Create alert correlation rules:**
   - Combine multiple low-confidence signals into high-confidence detections
   - Define attack chain correlations (reconnaissance -> initial access -> lateral movement -> exfiltration)
   - Implement time-windowed correlation (related events within a defined time period)
   - Create entity-based correlation (aggregate anomalies per user, per IP, per service)
   - Assign composite risk scores based on correlated signals

5. **Define automated response actions:**
   - **High confidence** — automatic containment (account lockout, session termination, network isolation)
   - **Medium confidence** — step-up authentication (require MFA re-verification), increase logging verbosity
   - **Low confidence** — flag for analyst review, add to watchlist for enhanced monitoring
   - Define rollback procedures if automated response was a false positive
   - Ensure all automated actions generate audit trail entries

6. **Write the artifact** — append to `.metapowers/security/<project>/03-detect.md` under a `## Anomaly Detection` section. Create the file with a `# Detect — <project>` heading if it does not exist; if a `## Anomaly Detection` section already exists, replace only that section. The section contains:

   ### Anomaly Detection

   Include sections:
   - **Behavioral Baselines** — patterns measured, data sources, and measurement methodology
   - **Detection Rules** — each anomaly rule with logic, data source, and threshold
   - **Threshold Configuration** — statistical methods, tuning approach, and false positive targets
   - **Correlation Rules** — multi-signal correlations and composite risk scoring
   - **Automated Responses** — actions by confidence level with rollback procedures
   - **Tuning Plan** — ongoing threshold adjustment and false positive reduction process

## Output

The anomaly detection plan appended to `.metapowers/security/<project>/03-detect.md`. Present a summary to the user highlighting:
- Behavioral baselines to be established and data sources
- Key anomaly detection rules and their threat coverage
- Automated response actions by confidence level
- Correlation rules for attack chain detection

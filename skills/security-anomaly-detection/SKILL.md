---
name: security-anomaly-detection
description: Define behavioral baselines and anomaly rules — impossible travel, odd-hours access, failed-login spikes, bulk exports, lateral movement, DNS anomalies — with thresholds, signal correlation and automated responses by confidence. Use when the user wants to catch unusual user, API or network behavior that fixed alert rules would miss.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: security
  phase: 3
  artifact: 03-detect.md
---

# Anomaly Detection

Define behavioral baselines and anomaly detection rules for "$ARGUMENTS". Establish normal patterns, create detection rules for deviations, and configure automated responses for high-confidence anomalies.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"security-anomaly-detection","workflow":"security","phase":3,"project":"<project>","event":"skipped","artifact":"03-detect.md","note":"<reason or \"none given\">"}`.

## Prerequisites

Run this skill's gate before writing: `sh <this skill's folder>/scripts/gate.sh <project> <project root>`, where `<project root>` is the folder that contains `.singularskills/` (use `.` when you are already there). If it exits non-zero, stop and tell the user what it printed, unless `--skip-checks` was given (see Arguments).

Read `.singularskills/security/<project>/00-govern.md`. If this file does not exist, tell the user:

> Phase 0 (Govern) has not been completed for "<project>". Run a Govern skill first (e.g., `/security-security-policy <project>`), or use `--skip-checks` to bypass.

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

6. **Write the artifact** — append to `.singularskills/security/<project>/03-detect.md` under a `## Anomaly Detection` section. Create the file with a `# Detect — <project>` heading if it does not exist; if a `## Anomaly Detection` section already exists, replace only that section. The section contains:

   - **Behavioral Baselines** — patterns measured, data sources, and measurement methodology
   - **Detection Rules** — each anomaly rule with logic, data source, and threshold
   - **Threshold Configuration** — statistical methods, tuning approach, and false positive targets
   - **Correlation Rules** — multi-signal correlations and composite risk scoring
   - **Automated Responses** — actions by confidence level with rollback procedures
   - **Tuning Plan** — ongoing threshold adjustment and false positive reduction process

## Output

The anomaly detection plan appended to `.singularskills/security/<project>/03-detect.md`. Present a summary to the user highlighting:
- Behavioral baselines to be established and data sources
- Key anomaly detection rules and their threat coverage
- Automated response actions by confidence level
- Correlation rules for attack chain detection

**Record the run.** Append each of these events to `.singularskills/log.jsonl` as one line (create the folder and file if missing):

- Before you start work (once the gate has passed or `--skip-checks` was given): `{"ts":"<ISO timestamp>","skill":"security-anomaly-detection","workflow":"security","phase":3,"project":"<project>","event":"started","artifact":"03-detect.md","note":""}`
- After you have written your section: the same line with `"event":"finished"`.
- If the gate refused and the user did not bypass it: the same line with `"event":"refused"` and `"note"` set to what the gate printed, instead of the other two; then stop.

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

Open your `## Anomaly Detection` section with one italic line, `*<skill name> · <ISO timestamp> · gate: <passed|skipped>*` (your skill name is `security-anomaly-detection`).

End your section with `### Decisions` and `### Open questions` (one level under your `## Anomaly Detection` heading, so the section stays one block), in this shape:

```markdown
### Decisions
- <what was chosen> — <why> — <what was rejected>

### Open questions
- <what the next phase or a reviewer must settle>
```

End the artifact with this paragraph, verbatim:

> **Not a penetration test or audit.** This artifact is generated analysis; validate findings against the live system and have material controls reviewed by a qualified security professional.

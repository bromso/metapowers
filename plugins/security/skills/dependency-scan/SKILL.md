---
description: Audit dependencies for known CVEs and license risks
---

# Dependency Scan

Audit dependencies for known CVEs and license risks for "$ARGUMENTS". Enumerate all direct and transitive dependencies, identify vulnerabilities and licensing concerns, and produce actionable remediation guidance.

## Prerequisites

Read `.metapowers/security/$ARGUMENTS/00-govern.md`. If this file does not exist, tell the user:

> Phase 0 (Govern) has not been completed for "$ARGUMENTS". Run a Govern skill first (e.g., `/security:security-policy $ARGUMENTS`), or use `--skip-checks` to bypass.

If `--skip-checks` is present in $ARGUMENTS, skip this check and log to `.metapowers/security/$ARGUMENTS/skip-log.md`.

## Process

1. **Enumerate all dependencies:**
   - Identify package manifests (package.json, requirements.txt, go.mod, Cargo.toml, pom.xml, etc.)
   - List all direct dependencies with pinned versions
   - Resolve transitive dependency tree to identify hidden risks
   - Note any vendored or manually included libraries

2. **Check against CVE databases:**
   - Cross-reference each dependency against NVD (National Vulnerability Database)
   - Check GitHub Advisory Database for known security advisories
   - Review language-specific advisory sources (npm audit, pip-audit, cargo-audit, etc.)
   - Score each vulnerability by CVSS (Critical >= 9.0, High 7.0-8.9, Medium 4.0-6.9, Low < 4.0)

3. **Identify license risks:**
   - Catalog the license of each dependency (MIT, Apache 2.0, GPL, LGPL, AGPL, BSL, etc.)
   - Flag copyleft licenses (GPL, AGPL) in commercial or proprietary projects
   - Identify dependencies with no declared license or custom license terms
   - Flag unmaintained packages (no commits > 2 years, archived repositories, no response to security issues)

4. **Produce remediation recommendations:**
   - For each vulnerable dependency recommend: **patch** (minor update), **upgrade** (major version), or **replace** (alternative library)
   - Assess breaking change risk for each recommended action
   - Prioritize by CVSS score and exploitability (known exploits in the wild rank higher)
   - Identify dependencies that can be removed entirely

5. **Create dependency policy:**
   - Define auto-merge rules for patch updates (automated via Dependabot, Renovate, etc.)
   - Define manual review requirements for major version updates
   - Set maximum age threshold for dependencies without security updates
   - Establish approved license list and blocked license list

6. **Write the artifact** to `.metapowers/security/$ARGUMENTS/02-protect.md` with heading:

   ## Dependency Scan

   Include sections:
   - **Dependency Inventory** — all direct and transitive dependencies with versions
   - **Vulnerability Report** — CVEs found with CVSS scores and affected versions
   - **License Audit** — license per dependency with risk flags
   - **Remediation Plan** — prioritized actions (patch, upgrade, replace) per vulnerable dependency
   - **Dependency Policy** — rules for ongoing dependency management

## Output

The dependency scan written to `.metapowers/security/$ARGUMENTS/02-protect.md`. Present a summary to the user highlighting:
- Total dependencies scanned (direct and transitive)
- Vulnerabilities found by severity (critical, high, medium, low)
- License risks identified
- Top priority remediations and estimated effort

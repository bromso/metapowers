---
description: Plan SAST, DAST, SCA, and penetration testing program
---

# Security Testing

Plan a comprehensive security testing program for "$ARGUMENTS". Define testing types, select tools, integrate into CI/CD, and establish finding triage and remediation workflows.

## Prerequisites

Read `.metapowers/security/$ARGUMENTS/00-govern.md`. If this file does not exist, tell the user:

> Phase 0 (Govern) has not been completed for "$ARGUMENTS". Run a Govern skill first (e.g., `/security:security-policy $ARGUMENTS`), or use `--skip-checks` to bypass.

If `--skip-checks` is present in $ARGUMENTS, skip this check and log to `.metapowers/security/$ARGUMENTS/skip-log.md`.

## Process

1. **Define testing types and scope:**
   - **SAST (Static Application Security Testing)** — analyze source code for vulnerabilities without executing it; run in CI on every commit
   - **DAST (Dynamic Application Security Testing)** — test running application by sending crafted requests; run against staging environment
   - **SCA (Software Composition Analysis)** — analyze dependencies for known vulnerabilities and license issues; run in CI on every commit
   - **IAST (Interactive Application Security Testing)** — instrument running application during testing to detect vulnerabilities in real-time
   - **Penetration testing** — manual and automated testing by security experts; annual minimum plus after major architectural changes
   - Define scope per testing type (which repositories, applications, environments)

2. **Select tools per testing type:**
   - **SAST** — evaluate Semgrep, CodeQL, SonarQube, Checkmarx, Snyk Code (consider language support, custom rule capability, false positive rate)
   - **DAST** — evaluate OWASP ZAP, Burp Suite, Nuclei, HCL AppScan (consider API testing support, authentication handling)
   - **SCA** — evaluate Snyk, Dependabot, Renovate, OWASP Dependency-Check (consider advisory database coverage, license detection)
   - **IAST** — evaluate Contrast Security, Hdiv (consider language support, performance overhead)
   - **Pen testing** — define in-house vs. third-party engagement model, scope, and frequency
   - Document selection criteria and chosen tools with justification

3. **Define CI/CD integration points:**
   - **Pre-commit** — secrets scanning (pre-commit hooks with tools like detect-secrets, gitleaks)
   - **Pull request** — SAST and SCA scans with inline PR comments on findings
   - **Build** — container image scanning, SBOM generation
   - **Staging deploy** — DAST scans against staging environment, IAST during integration tests
   - **Pre-production** — full regression security scan before production promotion
   - Define which checks are blocking (fail the build) vs. advisory (warn but allow)

4. **Establish finding triage process:**
   - Define severity-based SLAs: critical (fix within 48 hours), high (1 week), medium (1 sprint), low (next quarter)
   - Assign finding ownership (the team that owns the code owns the fix)
   - Create triage workflow: new finding -> validate (true/false positive) -> assign -> fix -> verify -> close
   - Define escalation path for SLA breaches
   - Track security debt alongside technical debt

5. **Manage false positives:**
   - Document process for marking false positives (requires security team approval)
   - Maintain suppression list with expiration dates (re-evaluate periodically)
   - Track false positive rate per tool to inform tuning and tool evaluation
   - Create custom rules to reduce false positives for common code patterns

6. **Define testing cadence:**
   - SAST and SCA: every commit (automated in CI)
   - DAST: weekly against staging, plus on-demand for new features
   - Penetration testing: annually minimum, plus after major changes (new auth system, new data flow, major architecture change)
   - Red team exercises: annually for mature organizations
   - Tabletop exercises: quarterly to test incident response

7. **Write the artifact** to `.metapowers/security/$ARGUMENTS/03-detect.md` with heading:

   ## Security Testing Program

   Include sections:
   - **Testing Types** — each type with scope, frequency, and environment
   - **Tool Selection** — chosen tools per type with selection rationale
   - **CI/CD Integration** — integration points, blocking vs. advisory checks
   - **Finding Triage** — severity SLAs, ownership model, and workflow
   - **False Positive Management** — suppression process and tracking
   - **Testing Cadence** — schedule for all testing activities
   - **Metrics** — KPIs for testing program effectiveness

## Output

The security testing program written to `.metapowers/security/$ARGUMENTS/03-detect.md`. Present a summary to the user highlighting:
- Testing types and their scope coverage
- Selected tools and CI/CD integration plan
- Finding severity SLAs and triage workflow
- Testing cadence and key milestones

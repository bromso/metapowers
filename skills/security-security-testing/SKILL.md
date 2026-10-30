---
name: security-security-testing
description: Plan a security testing program — SAST, DAST, SCA, IAST and pen test cadence, tool selection, CI/CD integration points, triage SLAs and false-positive handling. Use when the user wants security testing built into their pipeline or asks which scanners to run and when. Not for scoping a single penetration test engagement; see /security-pentest-plan.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: security
  phase: 3
  artifact: 03-detect.md
---

# Security Testing

Plan a comprehensive security testing program for "$ARGUMENTS". Define testing types, select tools, integrate into CI/CD, and establish finding triage and remediation workflows.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"security-security-testing","workflow":"security","phase":3,"project":"<project>","event":"skipped","artifact":"03-detect.md","note":"<reason or \"none given\">"}`.

## Prerequisites

**Part of a workflow.** This skill is phase 3 (Detect) of the NIST CSF workflow (`security`); cross-domain workflows run it too. First check `.singularskills/log.jsonl` for an open run for this project: a `run-started` line with `"project":"<project>"` and no later `run-finished` line for the same `workflow` and `project`. If one exists, the conductor is running you: continue here. Otherwise, if the user asked to start, run, continue or resume a process or workflow rather than this one step, do not continue here: invoke the `workflow` skill with the workflow the user asked for, or `security` when they named none, followed by `<project>`; it runs this phase in order, asks before it writes and records the run. Otherwise continue here: a later phase runs on its own, behind its gate.

Run this skill's gate before writing: `sh <this skill's folder>/scripts/gate.sh <project> <project root>`, where `<project root>` is the folder that contains `.singularskills/` (use `.` when you are already there). If it exits non-zero, stop and tell the user what it printed, unless `--skip-checks` was given (see Arguments). On a refusal, before you stop, append this line to `.singularskills/log.jsonl` (create the folder and file if missing): `{"ts":"<ISO timestamp>","skill":"security-security-testing","workflow":"security","phase":3,"project":"<project>","event":"refused","artifact":"03-detect.md","note":"<what the gate printed>"}`. Once the gate has passed, or under `--skip-checks` once you have appended the `skipped` line, append this line before you start work: `{"ts":"<ISO timestamp>","skill":"security-security-testing","workflow":"security","phase":3,"project":"<project>","event":"started","artifact":"03-detect.md","note":""}`.

Read `.singularskills/security/<project>/00-govern.md`. If this file does not exist, tell the user:

> Phase 0 (Govern) has not been completed for "<project>". Run a Govern skill first (e.g., `/security-security-policy <project>`), or use `--skip-checks` to bypass.

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

7. **Write the artifact** — append to `.singularskills/security/<project>/03-detect.md` under a `## Security Testing` section. Create the file with a `# Detect — <project>` heading if it does not exist; if a `## Security Testing` section already exists, replace only that section. The section contains:

   ### Security Testing Program

   Include sections:
   - **Testing Types** — each type with scope, frequency, and environment
   - **Tool Selection** — chosen tools per type with selection rationale
   - **CI/CD Integration** — integration points, blocking vs. advisory checks
   - **Finding Triage** — severity SLAs, ownership model, and workflow
   - **False Positive Management** — suppression process and tracking
   - **Testing Cadence** — schedule for all testing activities
   - **Metrics** — KPIs for testing program effectiveness

## Output

The security testing program appended to `.singularskills/security/<project>/03-detect.md`. Present a summary to the user highlighting:
- Testing types and their scope coverage
- Selected tools and CI/CD integration plan
- Finding severity SLAs and triage workflow
- Testing cadence and key milestones

**Record the run.** After you have written your section, append this line to `.singularskills/log.jsonl` (the `started` line of Prerequisites, with `"event":"finished"`): `{"ts":"<ISO timestamp>","skill":"security-security-testing","workflow":"security","phase":3,"project":"<project>","event":"finished","artifact":"03-detect.md","note":""}`.

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

Open your `## Security Testing` section with one italic line, `*<skill name> · <ISO timestamp> · gate: <passed|skipped>*` (your skill name is `security-security-testing`).

End your section with `### Decisions` and `### Open questions` (one level under your `## Security Testing` heading, so the section stays one block), in this shape:

```markdown
### Decisions
- <what was chosen> — <why> — <what was rejected>

### Open questions
- <what the next phase or a reviewer must settle>
```

End the artifact with this paragraph, verbatim:

> **Not a penetration test or audit.** This artifact is generated analysis; validate findings against the live system and have material controls reviewed by a qualified security professional.

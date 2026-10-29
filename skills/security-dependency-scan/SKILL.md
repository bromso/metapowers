---
name: security-dependency-scan
description: Audit a project's direct and transitive dependencies for known CVEs, risky or missing licenses and unmaintained packages, with patch, upgrade or replace advice and an update policy. Use when the user asks whether their npm, pip, Go or other packages have known vulnerabilities or license problems. Not for vetting vendors and services; see /security-supply-chain-security.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: security
  phase: 2
  artifact: 02-protect.md
---

# Dependency Scan

Audit dependencies for known CVEs and license risks for "$ARGUMENTS". Enumerate all direct and transitive dependencies, identify vulnerabilities and licensing concerns, and produce actionable remediation guidance.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"security-dependency-scan","workflow":"security","phase":2,"project":"<project>","event":"skipped","artifact":"02-protect.md","note":"<reason or \"none given\">"}`.

## Prerequisites

Run this skill's gate before writing: `sh <this skill's folder>/scripts/gate.sh <project> <project root>`, where `<project root>` is the folder that contains `.singularskills/` (use `.` when you are already there). If it exits non-zero, stop and tell the user what it printed, unless `--skip-checks` was given (see Arguments). On a refusal, before you stop, append this line to `.singularskills/log.jsonl` (create the folder and file if missing): `{"ts":"<ISO timestamp>","skill":"security-dependency-scan","workflow":"security","phase":2,"project":"<project>","event":"refused","artifact":"02-protect.md","note":"<what the gate printed>"}`. Once the gate has passed, or under `--skip-checks` once you have appended the `skipped` line, append this line before you start work: `{"ts":"<ISO timestamp>","skill":"security-dependency-scan","workflow":"security","phase":2,"project":"<project>","event":"started","artifact":"02-protect.md","note":""}`.

Read `.singularskills/security/<project>/00-govern.md`. If this file does not exist, tell the user:

> Phase 0 (Govern) has not been completed for "<project>". Run a Govern skill first (e.g., `/security-security-policy <project>`), or use `--skip-checks` to bypass.

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

6. **Write the artifact** — append to `.singularskills/security/<project>/02-protect.md` under a `## Dependency Scan` section. Create the file with a `# Protect — <project>` heading if it does not exist; if a `## Dependency Scan` section already exists, replace only that section. The section contains:

   - **Dependency Inventory** — all direct and transitive dependencies with versions
   - **Vulnerability Report** — CVEs found with CVSS scores and affected versions
   - **License Audit** — license per dependency with risk flags
   - **Remediation Plan** — prioritized actions (patch, upgrade, replace) per vulnerable dependency
   - **Dependency Policy** — rules for ongoing dependency management

## Output

The dependency scan appended to `.singularskills/security/<project>/02-protect.md`. Present a summary to the user highlighting:
- Total dependencies scanned (direct and transitive)
- Vulnerabilities found by severity (critical, high, medium, low)
- License risks identified
- Top priority remediations and estimated effort

**Record the run.** After you have written your section, append this line to `.singularskills/log.jsonl` (the `started` line of Prerequisites, with `"event":"finished"`): `{"ts":"<ISO timestamp>","skill":"security-dependency-scan","workflow":"security","phase":2,"project":"<project>","event":"finished","artifact":"02-protect.md","note":""}`.

This artifact is shared by every skill of phase 2 (Protect). The frontmatter is written once, by whoever creates the file: if you create it, open it with the block below (`skill` is the phase title, `started` the time of that first write; `gate` is `passed` when the gate ran clean and `skipped` under `--skip-checks`); if it already exists, leave the block alone except to update `finished` and to set `gate` to the worst value among the sections (`skipped` over `passed`).

```yaml
---
skill: Protect
workflow: security
phase: 2
project: <project>
started: <ISO timestamp>
finished: <ISO timestamp>
agent: <the agent you run in, or "unknown">
gate: <passed|skipped>
---
```

Open your `## Dependency Scan` section with one italic line, `*<skill name> · <ISO timestamp> · gate: <passed|skipped>*` (your skill name is `security-dependency-scan`).

End your section with `### Decisions` and `### Open questions` (one level under your `## Dependency Scan` heading, so the section stays one block), in this shape:

```markdown
### Decisions
- <what was chosen> — <why> — <what was rejected>

### Open questions
- <what the next phase or a reviewer must settle>
```

End the artifact with this paragraph, verbatim:

> **Not a penetration test or audit.** This artifact is generated analysis; validate findings against the live system and have material controls reviewed by a qualified security professional.

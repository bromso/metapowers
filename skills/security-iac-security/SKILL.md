---
name: security-iac-security
description: Scan infrastructure-as-code such as Terraform, CloudFormation or Helm for misconfigurations — public storage, open security groups, wildcard IAM, missing encryption — and add policy checks to CI. Use when the user asks whether their Terraform or cloud templates are secure, or wants IaC scanning in CI. Not for images or cluster runtime; see /security-container-security.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: security
  phase: 2
  artifact: 02-protect.md
---

# IaC Security

Scan infrastructure-as-code for misconfigurations for "$ARGUMENTS". Identify IaC tools in use, detect common security misconfigurations, and establish policies for secure infrastructure provisioning.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"security-iac-security","workflow":"security","phase":2,"project":"<project>","event":"skipped","artifact":"02-protect.md","note":"<reason or \"none given\">"}`.

## Prerequisites

Run this skill's gate before writing: `sh <this skill's folder>/scripts/gate.sh <project> <project root>`, where `<project root>` is the folder that contains `.singularskills/` (use `.` when you are already there). If it exits non-zero, stop and tell the user what it printed, unless `--skip-checks` was given (see Arguments).

Read `.singularskills/security/<project>/00-govern.md`. If this file does not exist, tell the user:

> Phase 0 (Govern) has not been completed for "<project>". Run a Govern skill first (e.g., `/security-security-policy <project>`), or use `--skip-checks` to bypass.

## Process

1. **Identify IaC tools and scope:**
   - Catalog IaC tools in use (Terraform, CloudFormation, Pulumi, Helm, Ansible, CDK)
   - Identify all IaC files and modules (root modules, shared modules, Helm charts)
   - Determine cloud providers targeted (AWS, Azure, GCP, multi-cloud)
   - Assess current IaC review and approval process

2. **Scan for common misconfigurations:**
   - **Storage** — public S3 buckets, unencrypted storage volumes, missing access logging
   - **Network** — open security groups (0.0.0.0/0 on sensitive ports), missing network ACLs, public subnets for internal resources
   - **Encryption** — unencrypted RDS instances, missing KMS key usage, unencrypted EBS volumes
   - **IAM** — overly permissive IAM policies (Action: *, Resource: *), missing MFA enforcement, wildcard permissions
   - **Logging** — disabled CloudTrail, missing VPC flow logs, no access logging on S3 buckets
   - **Compute** — public-facing instances with SSH open, missing patching configuration, default security groups

3. **Select and configure scanning tools:**
   - Evaluate scanning tools (Checkov, tfsec, Bridgecrew, KICS, Terrascan, Snyk IaC)
   - Configure tool with custom policies matching organizational security requirements
   - Tune rules to reduce false positives while maintaining coverage
   - Generate baseline scan results for current IaC

4. **Define IaC security policies:**
   - Create policy-as-code rules for mandatory security controls
   - Define severity levels and enforcement (block deploy for critical, warn for medium)
   - Establish exception process for intentional deviations (documented, time-limited, approved)
   - Create approved module library for common patterns (VPC, database, compute) with security built in

5. **Integrate scanning into CI/CD:**
   - Add IaC scanning as a required CI check before merge
   - Configure plan-time scanning (catch issues before apply)
   - Set up drift detection (compare deployed state against IaC definition)
   - Define remediation SLAs by severity (critical: 24 hours, high: 1 week, medium: 1 sprint)

6. **Create remediation guidance:**
   - Document fix for each common misconfiguration type
   - Provide secure-by-default code snippets and module templates
   - Create developer documentation for writing secure IaC
   - Establish peer review requirements for IaC changes

7. **Write the artifact** — append to `.singularskills/security/<project>/02-protect.md` under a `## IaC Security` section. Create the file with a `# Protect — <project>` heading if it does not exist; if a `## IaC Security` section already exists, replace only that section. The section contains:

   - **IaC Inventory** — tools, modules, and cloud providers in use
   - **Misconfiguration Findings** — all findings categorized by type and severity
   - **Scanning Tool Configuration** — selected tools, custom policies, and tuning
   - **Security Policies** — policy-as-code rules and enforcement levels
   - **CI/CD Integration** — pipeline integration and drift detection plan
   - **Remediation Guide** — fixes and secure templates per finding type

## Output

The IaC security scan appended to `.singularskills/security/<project>/02-protect.md`. Present a summary to the user highlighting:
- Total misconfigurations found by category and severity
- Most critical findings requiring immediate remediation
- Scanning tool and CI/CD integration plan
- Secure module templates available for reuse

**Record the run.** Append each of these events to `.singularskills/log.jsonl` as one line (create the folder and file if missing):

- Before you start work (once the gate has passed or `--skip-checks` was given): `{"ts":"<ISO timestamp>","skill":"security-iac-security","workflow":"security","phase":2,"project":"<project>","event":"started","artifact":"02-protect.md","note":""}`
- After you have written your section: the same line with `"event":"finished"`.
- If the gate refused and the user did not bypass it: the same line with `"event":"refused"` and `"note"` set to what the gate printed, instead of the other two; then stop.

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

Open your `## IaC Security` section with one italic line, `*<skill name> · <ISO timestamp> · gate: <passed|skipped>*` (your skill name is `security-iac-security`).

End your section with `### Decisions` and `### Open questions` (one level under your `## IaC Security` heading, so the section stays one block), in this shape:

```markdown
### Decisions
- <what was chosen> — <why> — <what was rejected>

### Open questions
- <what the next phase or a reviewer must settle>
```

End the artifact with this paragraph, verbatim:

> **Not a penetration test or audit.** This artifact is generated analysis; validate findings against the live system and have material controls reviewed by a qualified security professional.

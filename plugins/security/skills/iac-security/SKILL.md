---
description: Scan infrastructure-as-code for misconfigurations
---

# IaC Security

Scan infrastructure-as-code for misconfigurations for "$ARGUMENTS". Identify IaC tools in use, detect common security misconfigurations, and establish policies for secure infrastructure provisioning.

## Prerequisites

Read `.metapowers/security/$ARGUMENTS/00-govern.md`. If this file does not exist, tell the user:

> Phase 0 (Govern) has not been completed for "$ARGUMENTS". Run a Govern skill first (e.g., `/security:security-policy $ARGUMENTS`), or use `--skip-checks` to bypass.

If `--skip-checks` is present in $ARGUMENTS, skip this check and log to `.metapowers/security/$ARGUMENTS/skip-log.md`.

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

7. **Write the artifact** to `.metapowers/security/$ARGUMENTS/02-protect.md` with heading:

   ## IaC Security

   Include sections:
   - **IaC Inventory** — tools, modules, and cloud providers in use
   - **Misconfiguration Findings** — all findings categorized by type and severity
   - **Scanning Tool Configuration** — selected tools, custom policies, and tuning
   - **Security Policies** — policy-as-code rules and enforcement levels
   - **CI/CD Integration** — pipeline integration and drift detection plan
   - **Remediation Guide** — fixes and secure templates per finding type

## Output

The IaC security scan written to `.metapowers/security/$ARGUMENTS/02-protect.md`. Present a summary to the user highlighting:
- Total misconfigurations found by category and severity
- Most critical findings requiring immediate remediation
- Scanning tool and CI/CD integration plan
- Secure module templates available for reuse

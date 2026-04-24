---
description: Design secrets management strategy
---

# Secrets Management

Design a secrets management strategy for "$ARGUMENTS". Audit current secrets handling, identify exposed credentials, and define a secure vault and rotation strategy.

## Prerequisites

Read `.metapowers/security/$ARGUMENTS/00-govern.md`. If this file does not exist, tell the user:

> Phase 0 (Govern) has not been completed for "$ARGUMENTS". Run a Govern skill first (e.g., `/security:security-policy $ARGUMENTS`), or use `--skip-checks` to bypass.

If `--skip-checks` is present in $ARGUMENTS, skip this check and log to `.metapowers/security/$ARGUMENTS/skip-log.md`.

## Process

1. **Audit current secrets:**
   - Inventory all secret types: API keys, database credentials, tokens (OAuth, JWT signing keys), TLS certificates, SSH keys, encryption keys
   - Identify where each secret is currently stored (environment variables, config files, hardcoded in source, CI/CD variables, cloud provider secrets)
   - Check git history for previously committed secrets (even if removed from HEAD)
   - Assess current rotation practices per secret type

2. **Identify secrets exposure risks:**
   - Scan codebase for hardcoded secrets (API keys, connection strings, passwords in source)
   - Review configuration files for plaintext credentials (.env files, YAML configs, docker-compose)
   - Check CI/CD pipeline configurations for exposed secrets (build logs, artifact storage)
   - Review logging output for accidentally logged credentials
   - Assess secrets shared via insecure channels (email, Slack, shared documents)

3. **Design vault strategy:**
   - Evaluate vault solutions based on requirements (HashiCorp Vault, AWS Secrets Manager, Azure Key Vault, GCP Secret Manager, 1Password, Doppler)
   - Define secret hierarchy and namespacing (per environment, per service, per team)
   - Design access patterns (application runtime, CI/CD pipeline, developer access)
   - Plan high availability and disaster recovery for the vault

4. **Define rotation policy:**
   - Set rotation frequency per secret type (API keys: 90 days, database credentials: 30 days, TLS certificates: before expiry, signing keys: annually)
   - Design automated rotation where possible (database credential rotation, certificate renewal via ACME)
   - Define manual rotation procedures for secrets that cannot be automated
   - Plan for emergency rotation (credential compromise response)

5. **Implement least-privilege access:**
   - Define who and what can access each secret (human users, service accounts, CI/CD runners)
   - Implement short-lived credentials where possible (dynamic database credentials, temporary STS tokens)
   - Set up audit logging for all secret access and modifications
   - Design break-glass procedures for emergency access

6. **Plan secrets in CI/CD pipelines:**
   - Define how secrets are injected into build and deploy pipelines
   - Ensure secrets are never printed in build logs or stored in artifacts
   - Use pipeline-native secret management (GitHub Actions secrets, GitLab CI variables, etc.)
   - Implement secret scanning in pre-commit hooks and CI checks

7. **Write the artifact** to `.metapowers/security/$ARGUMENTS/02-protect.md` with heading:

   ## Secrets Management Strategy

   Include sections:
   - **Secrets Inventory** — all secrets by type, current storage location, and risk level
   - **Exposure Assessment** — identified secrets in code, config, logs, and history
   - **Vault Architecture** — chosen solution, hierarchy, and access patterns
   - **Rotation Policy** — rotation schedule per secret type with automation status
   - **CI/CD Integration** — how secrets flow through build and deploy pipelines
   - **Implementation Roadmap** — phased migration plan from current state to target state

## Output

The secrets management strategy written to `.metapowers/security/$ARGUMENTS/02-protect.md`. Present a summary to the user highlighting:
- Total secrets inventoried and current risk posture
- Exposed secrets requiring immediate remediation
- Chosen vault solution and key design decisions
- Rotation policy summary and automation coverage

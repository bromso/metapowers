---
name: security-secrets-management
description: Design how secrets are stored and rotated — inventory API keys, credentials, tokens and certificates, find hardcoded or leaked ones, pick a vault, set rotation and secure CI/CD use. Use when the user has credentials in code, env files or CI, asks how to rotate API keys and passwords, or is choosing a secrets vault. Not for encrypting data; see /security-encryption-strategy.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: security
  phase: 2
  artifact: 02-protect.md
---

# Secrets Management

Design a secrets management strategy for "$ARGUMENTS". Audit current secrets handling, identify exposed credentials, and define a secure vault and rotation strategy.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"security-secrets-management","workflow":"security","phase":2,"project":"<project>","event":"skipped","artifact":"02-protect.md","note":"<reason or \"none given\">"}`.

## Prerequisites

**Part of a workflow.** This skill is phase 2 (Protect) of the NIST CSF workflow (`security`); cross-domain workflows run it too. First check `.singularskills/log.jsonl` for an open run for this project: a `run-started` line with `"project":"<project>"` and no later `run-finished` line for the same `workflow` and `project`. If one exists, the conductor is running you: continue here. Otherwise, if the user asked to start, run, continue or resume a process or workflow rather than this one step, do not continue here: invoke the `workflow` skill with the workflow the user asked for, or `security` when they named none, followed by `<project>`; it runs this phase in order, asks before it writes and records the run. Otherwise continue here: a later phase runs on its own, behind its gate.

Run this skill's gate before writing: `sh <this skill's folder>/scripts/gate.sh <project> <project root>`, where `<project root>` is the folder that contains `.singularskills/` (use `.` when you are already there). If it exits non-zero, stop and tell the user what it printed, unless `--skip-checks` was given (see Arguments). On a refusal, before you stop, append this line to `.singularskills/log.jsonl` (create the folder and file if missing): `{"ts":"<ISO timestamp>","skill":"security-secrets-management","workflow":"security","phase":2,"project":"<project>","event":"refused","artifact":"02-protect.md","note":"<what the gate printed>"}`. Once the gate has passed, or under `--skip-checks` once you have appended the `skipped` line, append this line before you start work: `{"ts":"<ISO timestamp>","skill":"security-secrets-management","workflow":"security","phase":2,"project":"<project>","event":"started","artifact":"02-protect.md","note":""}`.

Read `.singularskills/security/<project>/00-govern.md`. If this file does not exist, tell the user:

> Phase 0 (Govern) has not been completed for "<project>". Run a Govern skill first (e.g., `/security-security-policy <project>`), or use `--skip-checks` to bypass.

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

7. **Write the artifact** — append to `.singularskills/security/<project>/02-protect.md` under a `## Secrets Management` section. Create the file with a `# Protect — <project>` heading if it does not exist; if a `## Secrets Management` section already exists, replace only that section. The section contains:

   ### Secrets Management Strategy

   Include sections:
   - **Secrets Inventory** — all secrets by type, current storage location, and risk level
   - **Exposure Assessment** — identified secrets in code, config, logs, and history
   - **Vault Architecture** — chosen solution, hierarchy, and access patterns
   - **Rotation Policy** — rotation schedule per secret type with automation status
   - **CI/CD Integration** — how secrets flow through build and deploy pipelines
   - **Implementation Roadmap** — phased migration plan from current state to target state

## Output

The secrets management strategy appended to `.singularskills/security/<project>/02-protect.md`. Present a summary to the user highlighting:
- Total secrets inventoried and current risk posture
- Exposed secrets requiring immediate remediation
- Chosen vault solution and key design decisions
- Rotation policy summary and automation coverage

**Record the run.** After you have written your section, append this line to `.singularskills/log.jsonl` (the `started` line of Prerequisites, with `"event":"finished"`): `{"ts":"<ISO timestamp>","skill":"security-secrets-management","workflow":"security","phase":2,"project":"<project>","event":"finished","artifact":"02-protect.md","note":""}`.

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

Open your `## Secrets Management` section with one italic line, `*<skill name> · <ISO timestamp> · gate: <passed|skipped>*` (your skill name is `security-secrets-management`).

End your section with `### Decisions` and `### Open questions` (one level under your `## Secrets Management` heading, so the section stays one block), in this shape:

```markdown
### Decisions
- <what was chosen> — <why> — <what was rejected>

### Open questions
- <what the next phase or a reviewer must settle>
```

End the artifact with this paragraph, verbatim:

> **Not a penetration test or audit.** This artifact is generated analysis; validate findings against the live system and have material controls reviewed by a qualified security professional.

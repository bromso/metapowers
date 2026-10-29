---
name: security-access-control
description: Design identity and access management — RBAC or ABAC, roles and a permissions matrix, least privilege and just-in-time access, MFA, service accounts, access reviews and break-glass access. Use when the user asks who should access what in their systems, wants MFA or least privilege, or needs to cut excess permissions. Not for who owns security work; see /security-security-roles.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: security
  phase: 2
  artifact: 02-protect.md
---

# Access Control

Design an identity and access management strategy for "$ARGUMENTS". Define the access control model, role hierarchy, least-privilege enforcement, and multi-factor authentication requirements.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"<skill name>","workflow":"security","phase":<phase>,"project":"<project>","event":"skipped","artifact":"<artifact file>","note":"<reason or \"none given\">"}`.

## Prerequisites

Run `scripts/gate.sh <project>` from this skill's folder. If it exits non-zero, stop and tell the user what it printed (unless `--skip-checks`, see Arguments).

Read `.singularskills/security/<project>/00-govern.md`. If this file does not exist, tell the user:

> Phase 0 (Govern) has not been completed for "<project>". Run a Govern skill first (e.g., `/security-security-policy <project>`), or use `--skip-checks` to bypass.

## Process

1. **Define access control model:**
   - Evaluate RBAC (Role-Based Access Control) — recommended for most organizations, simpler to manage and audit
   - Evaluate ABAC (Attribute-Based Access Control) — for complex, context-dependent access decisions (time-of-day, location, device, data sensitivity)
   - Consider hybrid approaches where RBAC provides baseline with ABAC for fine-grained decisions
   - Document the chosen model with justification

2. **Create role hierarchy and permissions matrix:**
   - Define roles aligned to job functions (not individuals)
   - Create permissions matrix mapping roles to resources and actions (read, write, delete, admin)
   - Implement role hierarchy (senior roles inherit permissions from junior roles)
   - Identify separation-of-duties constraints (no single role should both approve and execute)
   - Document role assignment and removal procedures

3. **Implement least privilege:**
   - Audit current permissions against actual usage (identify over-provisioned accounts)
   - Define minimum permissions required per role for each system and resource
   - Implement just-in-time (JIT) access for elevated privileges (time-limited, approval-required)
   - Remove standing admin access where possible in favor of on-demand elevation
   - Set up periodic access reviews to detect permission drift

4. **Define MFA requirements:**
   - Require MFA for all administrative access and privileged operations
   - Define MFA methods by access level (hardware keys for admins, authenticator apps for standard users)
   - Implement MFA for remote access, VPN, and cloud console access
   - Define backup authentication methods for MFA device loss
   - Plan phishing-resistant MFA (FIDO2/WebAuthn) adoption timeline

5. **Govern service accounts:**
   - Inventory all service accounts and their permissions
   - Assign ownership for each service account (a human is responsible)
   - Implement credential rotation for service accounts
   - Restrict service account permissions to minimum required
   - Disable interactive login for service accounts where possible

6. **Define access review and emergency procedures:**
   - Set access review cadence (quarterly for privileged access, semi-annual for standard)
   - Define access certification process (managers attest to direct reports' access)
   - Design break-glass procedure for emergency access (pre-provisioned, heavily monitored, time-limited)
   - Define offboarding procedure (immediate access revocation, credential rotation for shared resources)

7. **Write the artifact** — append to `.singularskills/security/<project>/02-protect.md` under a `## Access Control` section. Create the file with a `# Protect — <project>` heading if it does not exist; if a `## Access Control` section already exists, replace only that section. The section contains:

   ### Access Control Strategy

   Include sections:
   - **Access Control Model** — chosen model (RBAC/ABAC/hybrid) with justification
   - **Role Hierarchy** — roles, inheritance, and separation of duties
   - **Permissions Matrix** — roles mapped to resources and allowed actions
   - **Least Privilege Implementation** — JIT access, permission minimization, review cadence
   - **MFA Requirements** — MFA methods by access level with adoption timeline
   - **Service Account Governance** — inventory, ownership, and rotation policy
   - **Emergency Access** — break-glass procedures and monitoring

## Output

The access control strategy appended to `.singularskills/security/<project>/02-protect.md`. Present a summary to the user highlighting:
- Chosen access control model and key roles defined
- Least-privilege gaps identified and remediation plan
- MFA coverage and phishing-resistant MFA timeline
- Access review cadence and break-glass procedure summary

**Record the run.** This artifact is shared by every skill of phase 2 (Protect). The frontmatter is written once, by whoever creates the file: if you create it, open it with the block below (`skill` is the phase title, `started` the time of that first write; `gate` is `passed` when the gate ran clean and `skipped` under `--skip-checks`); if it already exists, leave the block alone except to update `finished` and to set `gate` to the worst value among the sections (`skipped` over `passed`).

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

Open your `## Access Control` section with one italic line, `*<skill name> · <ISO timestamp> · gate: <passed|skipped>*` (your skill name is `security-access-control`).

End the artifact (or your section of a shared artifact) with `## Decisions` and `## Open questions`, in this shape:

```markdown
## Decisions
- <what was chosen> — <why> — <what was rejected>

## Open questions
- <what the next phase or a reviewer must settle>
```

End the artifact with this paragraph, verbatim:

> **Not a penetration test or audit.** This artifact is generated analysis; validate findings against the live system and have material controls reviewed by a qualified security professional.

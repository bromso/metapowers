---
description: Design IAM, RBAC/ABAC, least privilege, and MFA strategy
---

# Access Control

Design an identity and access management strategy for "$ARGUMENTS". Define the access control model, role hierarchy, least-privilege enforcement, and multi-factor authentication requirements.

## Prerequisites

Read `.metapowers/security/$ARGUMENTS/00-govern.md`. If this file does not exist, tell the user:

> Phase 0 (Govern) has not been completed for "$ARGUMENTS". Run a Govern skill first (e.g., `/security:security-policy $ARGUMENTS`), or use `--skip-checks` to bypass.

If `--skip-checks` is present in $ARGUMENTS, skip this check and log to `.metapowers/security/$ARGUMENTS/skip-log.md`.

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

7. **Write the artifact** to `.metapowers/security/$ARGUMENTS/02-protect.md` with heading:

   ## Access Control Strategy

   Include sections:
   - **Access Control Model** — chosen model (RBAC/ABAC/hybrid) with justification
   - **Role Hierarchy** — roles, inheritance, and separation of duties
   - **Permissions Matrix** — roles mapped to resources and allowed actions
   - **Least Privilege Implementation** — JIT access, permission minimization, review cadence
   - **MFA Requirements** — MFA methods by access level with adoption timeline
   - **Service Account Governance** — inventory, ownership, and rotation policy
   - **Emergency Access** — break-glass procedures and monitoring

## Output

The access control strategy written to `.metapowers/security/$ARGUMENTS/02-protect.md`. Present a summary to the user highlighting:
- Chosen access control model and key roles defined
- Least-privilege gaps identified and remediation plan
- MFA coverage and phishing-resistant MFA timeline
- Access review cadence and break-glass procedure summary

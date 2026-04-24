---
description: Define containment, eradication, and isolation procedures
---

# Containment Strategy

Define containment, eradication, and isolation procedures for "$ARGUMENTS" covering network isolation, account lockout, service isolation, data containment, eradication steps, and recovery criteria.

## Prerequisites

Read `.metapowers/security/$ARGUMENTS/00-govern.md`. If this file does not exist, tell the user:

> Phase 0 (Govern) has not been completed for "$ARGUMENTS". Run a Govern skill first (e.g., `/security:security-policy $ARGUMENTS`), or use `--skip-checks` to bypass.

If `--skip-checks` is present in $ARGUMENTS, skip this check and log to `.metapowers/security/$ARGUMENTS/skip-log.md`.

## Process

1. **Read context files:**
   - Read `plugins/security/shared/incident-response-template.md` for containment workflow reference
   - Read `.metapowers/security/$ARGUMENTS/00-govern.md` for organizational context and risk appetite

2. **Define containment strategies by incident type:**

   **Network isolation:**
   - VLAN segmentation to isolate compromised network segments
   - Firewall rule updates to block attacker IP ranges and C2 communication
   - DNS sinkholing for known malicious domains
   - Network access control (NAC) to quarantine affected endpoints
   - Define pre-built isolation rules ready for rapid deployment

   **Account lockout:**
   - Disable compromised user accounts and service accounts immediately
   - Revoke active sessions and tokens (OAuth, JWT, API keys)
   - Force password reset for potentially affected accounts
   - Temporarily restrict privilege escalation paths
   - Define criteria for account lockout scope (individual, team, organization-wide)

   **Service isolation:**
   - Kill switches for individual features or services (feature flags)
   - API gateway rate limiting or blocking for compromised endpoints
   - Container and pod isolation (Kubernetes network policies)
   - Load balancer traffic diversion away from compromised instances
   - Define pre-configured isolation mechanisms per service

   **Data containment:**
   - Revoke access to compromised data stores
   - Encrypt exposed data if not already encrypted
   - Block data exfiltration channels (DLP rules, egress filtering)
   - Snapshot compromised data stores for forensic analysis before changes

3. **Define eradication steps:**
   - **Patch** — apply security patches for exploited vulnerabilities
   - **Rebuild** — reimage compromised systems from known-good baselines
   - **Credential rotation** — rotate all credentials that may have been exposed (passwords, API keys, certificates, tokens)
   - **Malware removal** — scan and clean affected systems, verify with multiple tools
   - **Configuration hardening** — close the attack vector that was exploited
   - **Dependency update** — update or replace compromised third-party components

4. **Define recovery criteria:**
   - When is it safe to restore? Define specific checkpoints:
     - Root cause identified and remediated
     - All compromised credentials rotated
     - Compromised systems rebuilt or verified clean
     - Monitoring enhanced for the specific attack vector
     - No further indicators of compromise detected for defined observation period
   - Define verification procedures before bringing systems back online
   - Plan for phased recovery (internal validation → limited users → full restoration)

5. **Plan for containment trade-offs:**
   - Document availability vs. security trade-offs for each containment action
   - Define decision authority for trade-offs (who can authorize service disruption for containment)
   - Pre-approve containment actions for P1 incidents (security team can act without waiting for business approval)
   - Define rollback procedures if containment causes unacceptable business impact
   - Plan for partial containment when full isolation is not feasible

6. **Write the artifact** to `.metapowers/security/$ARGUMENTS/04-respond.md` with heading:

   ## Containment Strategy

   Include sections:
   - **Containment by Incident Type** — network, account, service, and data containment procedures
   - **Pre-Built Isolation Mechanisms** — ready-to-deploy containment rules and configurations
   - **Eradication Steps** — patching, rebuilding, credential rotation, and hardening
   - **Recovery Criteria** — checkpoints and verification procedures for safe restoration
   - **Containment Trade-Offs** — availability vs. security decisions and authority matrix
   - **Phased Recovery Plan** — staged approach to bringing systems back online

## Output

The containment strategy written to `.metapowers/security/$ARGUMENTS/04-respond.md`. Present a summary to the user highlighting:
- Containment strategies per incident type
- Pre-built isolation mechanisms ready for deployment
- Eradication steps and credential rotation plan
- Recovery criteria and phased restoration approach

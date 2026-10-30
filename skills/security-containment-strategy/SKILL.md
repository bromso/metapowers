---
name: security-containment-strategy
description: Define containment and eradication procedures — network isolation, account lockout, service and data containment, patching, rebuilds and credential rotation — with criteria for when it is safe to restore and who may trade availability for security. Use when the user asks how to isolate a compromised system or account and clean it up without breaking the business.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: security
  phase: 4
  artifact: 04-respond.md
---

# Containment Strategy

Define containment, eradication, and isolation procedures for "$ARGUMENTS" covering network isolation, account lockout, service isolation, data containment, eradication steps, and recovery criteria.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"security-containment-strategy","workflow":"security","phase":4,"project":"<project>","event":"skipped","artifact":"04-respond.md","note":"<reason or \"none given\">"}`.

## Prerequisites

**Part of a workflow.** This skill is phase 4 (Respond) of the NIST CSF workflow (`security`); cross-domain workflows run it too. Unless the user named this skill, check `.singularskills/log.jsonl` for an open run for this project: a `run-started` line with `"project":"<project>"` and no later `run-finished` line for the same `workflow` and `project`. If there is no open run, or the user asked to start, run, continue or resume a process or workflow rather than this one step, do not continue here: invoke the `workflow` skill with the workflow the user asked for, or `security` when they named none, followed by `<project>`. It runs this phase in order, asks before it writes and records the run. Continue here when the user named this skill, or when an open run exists (the conductor is running you).

Run this skill's gate before writing: `sh <this skill's folder>/scripts/gate.sh <project> <project root>`, where `<project root>` is the folder that contains `.singularskills/` (use `.` when you are already there). If it exits non-zero, stop and tell the user what it printed, unless `--skip-checks` was given (see Arguments). On a refusal, before you stop, append this line to `.singularskills/log.jsonl` (create the folder and file if missing): `{"ts":"<ISO timestamp>","skill":"security-containment-strategy","workflow":"security","phase":4,"project":"<project>","event":"refused","artifact":"04-respond.md","note":"<what the gate printed>"}`. Once the gate has passed, or under `--skip-checks` once you have appended the `skipped` line, append this line before you start work: `{"ts":"<ISO timestamp>","skill":"security-containment-strategy","workflow":"security","phase":4,"project":"<project>","event":"started","artifact":"04-respond.md","note":""}`.

Read `.singularskills/security/<project>/00-govern.md`. If this file does not exist, tell the user:

> Phase 0 (Govern) has not been completed for "<project>". Run a Govern skill first (e.g., `/security-security-policy <project>`), or use `--skip-checks` to bypass.

## Process

1. **Read context files:**
   - Read `references/incident-response-template.md` for containment workflow reference
   - Read `.singularskills/security/<project>/00-govern.md` for organizational context and risk appetite

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

6. **Write the artifact** — append to `.singularskills/security/<project>/04-respond.md` under a `## Containment Strategy` section. Create the file with a `# Respond — <project>` heading if it does not exist; if a `## Containment Strategy` section already exists, replace only that section. The section contains:

   - **Containment by Incident Type** — network, account, service, and data containment procedures
   - **Pre-Built Isolation Mechanisms** — ready-to-deploy containment rules and configurations
   - **Eradication Steps** — patching, rebuilding, credential rotation, and hardening
   - **Recovery Criteria** — checkpoints and verification procedures for safe restoration
   - **Containment Trade-Offs** — availability vs. security decisions and authority matrix
   - **Phased Recovery Plan** — staged approach to bringing systems back online

## Output

The containment strategy appended to `.singularskills/security/<project>/04-respond.md`. Present a summary to the user highlighting:
- Containment strategies per incident type
- Pre-built isolation mechanisms ready for deployment
- Eradication steps and credential rotation plan
- Recovery criteria and phased restoration approach

**Record the run.** After you have written your section, append this line to `.singularskills/log.jsonl` (the `started` line of Prerequisites, with `"event":"finished"`): `{"ts":"<ISO timestamp>","skill":"security-containment-strategy","workflow":"security","phase":4,"project":"<project>","event":"finished","artifact":"04-respond.md","note":""}`.

This artifact is shared by every skill of phase 4 (Respond). The frontmatter is written once, by whoever creates the file: if you create it, open it with the block below (`skill` is the phase title, `started` the time of that first write; `gate` is `passed` when the gate ran clean and `skipped` under `--skip-checks`); if it already exists, leave the block alone except to update `finished` and to set `gate` to the worst value among the sections (`skipped` over `passed`).

```yaml
---
skill: Respond
workflow: security
phase: 4
project: <project>
started: <ISO timestamp>
finished: <ISO timestamp>
agent: <the agent you run in, or "unknown">
gate: <passed|skipped>
---
```

Open your `## Containment Strategy` section with one italic line, `*<skill name> · <ISO timestamp> · gate: <passed|skipped>*` (your skill name is `security-containment-strategy`).

End your section with `### Decisions` and `### Open questions` (one level under your `## Containment Strategy` heading, so the section stays one block), in this shape:

```markdown
### Decisions
- <what was chosen> — <why> — <what was rejected>

### Open questions
- <what the next phase or a reviewer must settle>
```

End the artifact with this paragraph, verbatim:

> **Not a penetration test or audit.** This artifact is generated analysis; validate findings against the live system and have material controls reviewed by a qualified security professional.

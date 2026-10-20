---
name: incident-response
description: Create a technical incident response plan — P1 to P4 severities, playbooks for breach, ransomware, DDoS, insider and supply chain attacks, roles, communication, escalation and decision trees. Use when the user has no plan for a security incident or asks what their team should do when an attack is detected. Not for legal notification deadlines; see /legal:incident-response-plan.
argument-hint: "[project] [--skip-checks]"
---

# Incident Response

Create an incident response plan for "$ARGUMENTS" with severity classifications, response playbooks per incident type, defined roles, communication protocols, and escalation paths.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.metapowers/security/<project>/skip-log.md`: `- <ISO timestamp> — <skill name> skipped prerequisite check for <artifact file> — reason: <reason or "none given">`.

## Prerequisites

Read `.metapowers/security/<project>/00-govern.md`. If this file does not exist, tell the user:

> Phase 0 (Govern) has not been completed for "<project>". Run a Govern skill first (e.g., `/security:security-policy <project>`), or use `--skip-checks` to bypass.

## Process

1. **Read context files:**
   - Read `${CLAUDE_PLUGIN_ROOT}/shared/incident-response-template.md` for methodology reference and output structure
   - Read `.metapowers/security/<project>/00-govern.md` for organizational context and risk appetite

2. **Define severity classification (P1–P4):**
   - **P1 — Critical:** confirmed data breach, ransomware spreading, active attacker with privileged access, complete service outage affecting all customers
   - **P2 — High:** suspected data breach under investigation, targeted attack detected, partial service outage affecting significant user segment
   - **P3 — Medium:** vulnerability actively exploited with limited impact, unauthorized access attempt partially successful, single-service degradation
   - **P4 — Low:** policy violation detected, failed attack attempt, minor security misconfiguration discovered
   - Define criteria for each level: data sensitivity, blast radius, regulatory implications, business impact

3. **Create response playbooks per incident type:**
   - **Data breach** — identify compromised data, assess scope, contain exfiltration, preserve evidence, notify affected parties and regulators
   - **DDoS attack** — activate DDoS mitigation (CDN, WAF rules, rate limiting), identify attack vectors, engage upstream providers, scale infrastructure
   - **Ransomware** — isolate affected systems immediately, assess encryption scope, activate backup recovery, engage law enforcement if appropriate
   - **Insider threat** — preserve evidence before alerting subject, restrict access silently, coordinate with HR and legal, investigate scope of access
   - **Supply chain compromise** — identify affected dependencies, assess blast radius, isolate compromised components, verify integrity of remaining systems
   - Each playbook includes: detection triggers, immediate actions (first 15 minutes), short-term containment (first hour), investigation steps, eradication, recovery

4. **Define response team roles:**
   - **Incident Commander** — owns decision-making authority, coordinates all responders, manages timeline
   - **Technical Lead** — leads investigation and containment, directs engineering response
   - **Communications Lead** — manages internal and external communications, coordinates with legal and PR
   - **Scribe** — documents timeline, decisions, actions, and evidence in real time
   - **Subject Matter Experts** — engaged as needed based on incident type (database, network, cloud, application)
   - Define backup personnel for each role and activation procedures

5. **Set communication protocols:**
   - Define communication channels by severity (P1: war room + phone bridge, P2: dedicated Slack channel, P3–P4: ticket-based)
   - Set status update cadence (P1: every 30 minutes, P2: every 2 hours, P3: daily, P4: on resolution)
   - Define who is notified at each severity level (P1: CISO + executive team, P2: security lead + engineering lead, P3: security team, P4: assigned responder)
   - Template for status updates: current status, actions taken, next steps, ETA, blockers

6. **Define escalation paths:**
   - Time-based escalation (P1 not acknowledged in 5 minutes → auto-escalate, P2 not acknowledged in 15 minutes → auto-escalate)
   - Severity-based escalation (any incident may be escalated if scope expands or new evidence emerges)
   - External escalation criteria (when to engage law enforcement, regulators, external forensic specialists, cyber insurance)
   - De-escalation criteria (when to downgrade severity based on investigation findings)

7. **Create decision trees for common scenarios:**
   - "Suspicious login detected" → verify with user → if confirmed unauthorized → P2, lock account, investigate scope
   - "Malware alert on endpoint" → isolate endpoint → determine if lateral movement occurred → if yes, escalate to P1
   - "Data exposure reported by third party" → verify claim → assess scope → if confirmed, activate data breach playbook
   - "Unusual outbound traffic" → analyze destination and volume → if exfiltration suspected → P1, block traffic, preserve logs

8. **Write the artifact** — append to `.metapowers/security/<project>/04-respond.md` under a `## Incident Response` section. Create the file with a `# Respond — <project>` heading if it does not exist; if a `## Incident Response` section already exists, replace only that section. The section contains:

   ### Incident Response Plan

   Include sections:
   - **Severity Classification** — P1–P4 definitions with criteria and examples
   - **Response Playbooks** — per incident type with step-by-step actions
   - **Response Team** — roles, responsibilities, and backup personnel
   - **Communication Protocols** — channels, cadence, and notification matrix
   - **Escalation Paths** — time-based, severity-based, and external escalation criteria
   - **Decision Trees** — common scenario flowcharts

## Output

The incident response plan appended to `.metapowers/security/<project>/04-respond.md`. Present a summary to the user highlighting:
- Severity classification criteria for P1–P4
- Playbooks created per incident type
- Response team roles and communication protocols
- Key escalation triggers and decision trees

End the artifact with this paragraph, verbatim:

> **Not a penetration test or audit.** This artifact is generated analysis; validate findings against the live system and have material controls reviewed by a qualified security professional.

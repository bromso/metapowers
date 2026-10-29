---
name: security-threat-intel
description: Research current threat intelligence for a technology, industry or threat actor — recent CVEs and exploits, attacker TTPs, MITRE ATT&CK mapping, relevance to the organization and defensive actions. Use when the user asks what threats, exploits or attacker groups are currently targeting a technology or sector they depend on.
metadata:
  argument-hint: "[project] [--skip-checks]"
---

# Threat Intelligence

Research current threat intelligence for "$ARGUMENTS" covering recent CVEs, exploits, threat actor TTPs, MITRE ATT&CK mapping, and defensive recommendations.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"<skill name>","workflow":"security","phase":<phase>,"project":"<project>","event":"skipped","artifact":"<artifact file>","note":"<reason or \"none given\">"}`.

## Process

1. **Research current threats:**
   - Use WebSearch to research current threats, vulnerabilities, and exploits targeting "<project>"
   - Search for recent CVEs (last 12 months) affecting the technology or ecosystem
   - Search for known threat actors targeting the technology or industry
   - Search for recent security advisories and vendor patches

2. **Identify recent CVEs and exploits:**
   - List relevant CVEs with: CVE ID, CVSS score, description, affected versions, exploit availability
   - Categorize by severity (Critical, High, Medium, Low)
   - Note which CVEs have known exploits in the wild
   - Identify if patches are available and their release dates
   - Check for proof-of-concept code or exploit kit inclusion

3. **Analyze threat actor TTPs (if applicable):**
   - Identify known threat actors targeting the technology or industry
   - Document their tactics, techniques, and procedures
   - Note known campaigns and their objectives (espionage, financial, disruption)
   - Assess capability and sophistication level
   - Identify indicators of compromise (IOCs) associated with known actors

4. **Map to MITRE ATT&CK framework:**
   - Map identified threats to MITRE ATT&CK techniques
   - Cover relevant tactics: Initial Access, Execution, Persistence, Privilege Escalation, Defense Evasion, Credential Access, Discovery, Lateral Movement, Collection, Exfiltration, Impact
   - Identify which ATT&CK techniques are most relevant to the organization
   - Note detection opportunities for each mapped technique

5. **Assess relevance to the organization:**
   - Evaluate which threats are most likely to affect the organization based on:
     - Technology stack overlap with targeted technologies
     - Industry alignment with threat actor targeting
     - Geographic relevance of threat actors
     - Exposure surface (internet-facing, internal only, supply chain)
   - Rate overall threat level: Critical, High, Medium, Low

6. **Recommend defensive measures:**
   - Prioritized list of defensive actions based on threat assessment
   - Immediate actions: patch critical CVEs, update detection rules, review configurations
   - Short-term: implement additional monitoring for identified TTPs, update firewall rules
   - Strategic: architecture changes to reduce attack surface, security control improvements
   - Map recommendations to specific threats for traceability

7. **Write the artifact** to `.singularskills/security/<project>/threat-intel.md` with heading:

   ## Threat Intelligence Report

   Include sections:
   - **Executive Summary** — key threats, risk level, and top recommendations
   - **CVE Analysis** — recent vulnerabilities with severity, exploit status, and patch availability
   - **Threat Actor Profile** — known actors, TTPs, and campaign history (if applicable)
   - **MITRE ATT&CK Mapping** — techniques and detection opportunities
   - **Relevance Assessment** — threat applicability to the organization
   - **Defensive Recommendations** — prioritized actions with timeline

## Output

The threat intelligence report written to `.singularskills/security/<project>/threat-intel.md`. Present a summary to the user highlighting:
- Top threats and their severity
- Critical CVEs requiring immediate attention
- Most relevant threat actor TTPs
- Priority defensive recommendations

End the artifact with this paragraph, verbatim:

> **Not a penetration test or audit.** This artifact is generated analysis; validate findings against the live system and have material controls reviewed by a qualified security professional.

---
name: compliance-fedramp
description: Assess FedRAMP and StateRAMP readiness — FIPS 199 impact level, NIST 800-53 control families, 3PAO requirements and the ATO package (SSP, POA&M, ConMon). Use when a cloud or SaaS company plans to sell to US federal agencies or state governments and wants to assess how far its own environment is from authorization.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: compliance
  phase: 1
  artifact: 01-assess/
---

# FedRAMP/StateRAMP Assessment

Assess Federal Risk and Authorization Management Program (FedRAMP) and StateRAMP readiness for "$ARGUMENTS". Determine impact level, evaluate NIST SP 800-53 control baseline, and assess ATO package readiness.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"compliance-fedramp","workflow":"compliance","phase":1,"project":"<project>","event":"skipped","artifact":"01-assess/","note":"<reason or \"none given\">"}`.

## Prerequisites

Run this skill's gate before writing: `sh <this skill's folder>/scripts/gate.sh <project> <project root>`, where `<project root>` is the folder that contains `.singularskills/` (use `.` when you are already there). If it exits non-zero, stop and tell the user what it printed, unless `--skip-checks` was given (see Arguments).

Read `.singularskills/compliance/<project>/00-scope.md`. If this file does not exist, tell the user:

> Phase 0 (Scope) has not been completed for "<project>". Run `/compliance-regulatory-landscape <project>` first, or use `--skip-checks` to bypass.

## Process

1. **Read context files:**
   - Read `references/grc-lifecycle-guide.md` for GRC methodology reference
   - Read `references/assessment-template.md` for output structure
   - Read `.singularskills/compliance/<project>/00-scope.md` for scope and control framework context

2. **Impact level determination:**
   - Assess confidentiality, integrity, and availability impact levels per FIPS 199
   - Determine overall impact level: Low, Moderate, or High
   - Evaluate if FedRAMP Tailored (Li-SaaS) applies for low-impact SaaS
   - Document impact level determination with rationale

3. **NIST SP 800-53 control baseline assessment:**
   - **Access Control (AC)** — account management, access enforcement, separation of duties, least privilege, session controls, remote access, MFA
   - **Audit and Accountability (AU)** — audit events, content, storage, review, analysis, reporting, reduction, generation, protection
   - **Security Assessment and Authorization (CA)** — security assessment plan, POA&M, continuous monitoring, penetration testing
   - **Configuration Management (CM)** — baseline configuration, change control, least functionality, software restrictions, configuration settings
   - **Contingency Planning (CP)** — contingency plan, training, testing, alternate processing/storage, system recovery
   - **Identification and Authentication (IA)** — user identification, authenticator management, device identification, MFA
   - **Incident Response (IR)** — incident response plan, training, testing, handling, monitoring, reporting
   - **Maintenance (MA)** — controlled maintenance, tools, remote maintenance, personnel
   - **Media Protection (MP)** — media access, marking, storage, transport, sanitization
   - **Physical and Environmental Protection (PE)** — access authorizations, monitoring, visitor control, emergency procedures
   - **Planning (PL)** — security plan, system security plan update, rules of behavior
   - **Program Management (PM)** — information security program plan, senior security officer, risk management strategy
   - **Risk Assessment (RA)** — risk assessment, vulnerability scanning, risk response
   - **System and Communications Protection (SC)** — application partitioning, boundary protection, cryptographic protection, network disconnect
   - **System and Information Integrity (SI)** — flaw remediation, malicious code protection, security alerts, software integrity, information input validation, error handling, memory protection
   - Score each control family: implemented / partially implemented / planned / not implemented

4. **3PAO requirements:**
   - Identify qualified Third Party Assessment Organization (3PAO) requirements
   - Assess readiness for initial assessment
   - Evaluate continuous monitoring program for ongoing authorization
   - Review annual assessment requirements

5. **ATO package readiness:**
   - Assess System Security Plan (SSP) completeness
   - Review Plan of Action and Milestones (POA&M)
   - Evaluate Continuous Monitoring (ConMon) program
   - Assess Incident Response Plan
   - Review Security Assessment Report readiness
   - Evaluate supply chain risk management documentation

6. **StateRAMP considerations:**
   - Identify StateRAMP-specific requirements beyond FedRAMP
   - Assess state-specific data residency requirements
   - Review StateRAMP verification levels (Ready, Authorized, Authorized+)
   - Evaluate reciprocity opportunities between FedRAMP and StateRAMP

7. **Write the artifact** to `.singularskills/compliance/<project>/01-assess/fedramp.md` following the assessment template structure with:
   - **Impact Level Determination** — FIPS 199 analysis and overall impact level
   - **Control Baseline Assessment** — scoring per NIST 800-53 control family
   - **3PAO Readiness** — assessment organization requirements and readiness
   - **ATO Package Status** — SSP, POA&M, ConMon, and documentation readiness
   - **StateRAMP Considerations** — additional requirements and verification level
   - **Evidence Inventory** — existing evidence and evidence gaps
   - **Remediation Priorities** — ranked list of gaps to address

## Output

The FedRAMP/StateRAMP assessment written to `.singularskills/compliance/<project>/01-assess/fedramp.md`. Present a summary to the user highlighting:
- Impact level determination (Low/Moderate/High)
- Overall control baseline compliance score — score = (implemented + 0.5 × partially implemented) ÷ assessed control families, as a percentage (planned counts as not implemented)
- ATO package readiness percentage
- Top 3 gaps requiring remediation
- Estimated timeline to authorization readiness

**Record the run.** Append each of these events to `.singularskills/log.jsonl` as one line (create the folder and file if missing):

- Before you start work (once the gate has passed or `--skip-checks` was given): `{"ts":"<ISO timestamp>","skill":"compliance-fedramp","workflow":"compliance","phase":1,"project":"<project>","event":"started","artifact":"01-assess/","note":""}`
- After you have written the artifact: the same line with `"event":"finished"`.
- If the gate refused and the user did not bypass it: the same line with `"event":"refused"` and `"note"` set to what the gate printed, instead of the other two; then stop.

Open the artifact with this frontmatter (`agent` is the agent you run in, or `unknown`; `gate` is `passed` when the gate ran clean and `skipped` under `--skip-checks`):

```yaml
---
skill: compliance-fedramp
workflow: compliance
phase: 1
project: <project>
started: <ISO timestamp>
finished: <ISO timestamp>
agent: <the agent you run in, or "unknown">
gate: <passed|skipped>
---
```

End the artifact with `## Decisions` and `## Open questions`, in this shape:

```markdown
## Decisions
- <what was chosen> — <why> — <what was rejected>

## Open questions
- <what the next phase or a reviewer must settle>
```

End the artifact with this paragraph, verbatim:

> **Not legal or audit advice.** This artifact supports preparation for compliance work; certification, attestation and regulatory conclusions require a qualified auditor or counsel.

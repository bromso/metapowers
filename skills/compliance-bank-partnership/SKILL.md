---
name: compliance-bank-partnership
description: Assess what a partner bank and its regulators expect of a fintech — OCC/FDIC third-party guidance, compliance management pass-through, UDAAP and fair lending, exam readiness and exit planning. Use when a fintech or BaaS program depends on a sponsor bank and wants to assess whether its own program meets what the bank and its examiners will require.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: compliance
  phase: 1
  artifact: 01-assess/
---

# Bank Partnership Compliance Assessment

Assess partner bank compliance requirements for "$ARGUMENTS". Evaluate regulatory expectations for bank-fintech partnerships, compliance management system pass-through, and examination readiness.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"compliance-bank-partnership","workflow":"compliance","phase":1,"project":"<project>","event":"skipped","artifact":"01-assess/","note":"<reason or \"none given\">"}`.

## Prerequisites

Run this skill's gate before writing: `sh <this skill's folder>/scripts/gate.sh <project> <project root>`, where `<project root>` is the folder that contains `.singularskills/` (use `.` when you are already there). If it exits non-zero, stop and tell the user what it printed, unless `--skip-checks` was given (see Arguments).

Read `.singularskills/compliance/<project>/00-scope.md`. If this file does not exist, tell the user:

> Phase 0 (Scope) has not been completed for "<project>". Run `/compliance-regulatory-landscape <project>` first, or use `--skip-checks` to bypass.

## Process

1. **Read context files:**
   - Read `references/grc-lifecycle-guide.md` for GRC methodology reference
   - Read `references/assessment-template.md` for output structure
   - Read `.singularskills/compliance/<project>/00-scope.md` for scope and control framework context

2. **Regulatory expectations for bank-fintech partnerships:**
   - Assess alignment with OCC Third-Party Risk Management guidance (OCC 2013-29, 2023-17)
   - Evaluate compliance with FDIC Financial Institution Letters on third-party relationships
   - Review Federal Reserve SR 13-19 guidance applicability
   - Assess interagency guidance on third-party relationships (June 2023)
   - Evaluate how the partnership model maps to regulatory definitions (critical activity, significant bank function)

3. **Compliance management system requirements:**
   - Assess compliance management system (CMS) components passed through from partner bank
   - Evaluate board/management oversight requirements imposed on the fintech
   - Review compliance policies and procedures mandated by the bank partner
   - Assess compliance monitoring and testing expectations
   - Evaluate complaint management and consumer response requirements

4. **Consumer compliance obligations:**
   - Assess UDAP (Section 5 of FTC Act) compliance in product design and marketing
   - Evaluate UDAAP (Dodd-Frank Act) compliance for unfair, deceptive, or abusive acts or practices
   - Review fair lending compliance (ECOA, Fair Housing Act) in credit products
   - Assess Community Reinvestment Act (CRA) implications and data reporting
   - Evaluate Truth in Lending (TILA), Truth in Savings (TISA), EFTA/Reg E compliance
   - Review fair debt collection practices where applicable

5. **Examination readiness:**
   - Assess preparedness for regulatory examinations (OCC/FDIC can examine the fintech through the bank)
   - Evaluate document production capabilities and response timelines
   - Review management's ability to respond to regulatory inquiries
   - Assess audit trail completeness for regulatory demonstration
   - Evaluate experience with prior examinations and findings remediation

6. **Information security requirements from partner:**
   - Assess information security standards mandated by the bank partner
   - Evaluate security assessment and penetration testing requirements
   - Review incident response and breach notification obligations to the bank
   - Assess access control and data handling requirements
   - Evaluate SOC 2 or equivalent certification requirements

7. **Data sharing and privacy obligations:**
   - Assess Gramm-Leach-Bliley Act (GLBA) privacy notice and opt-out requirements
   - Evaluate data sharing agreements and permissible use restrictions
   - Review data minimization and purpose limitation in the partnership
   - Assess cross-border data transfer restrictions imposed by the bank
   - Evaluate consumer data rights and request handling procedures

8. **Vendor oversight documentation requirements:**
   - Assess due diligence documentation maintained for the bank partner
   - Evaluate ongoing monitoring and reporting cadence (quarterly, annual reviews)
   - Review SLA compliance tracking and reporting
   - Assess subcontractor/fourth-party oversight obligations
   - Evaluate right-to-audit clauses and audit facilitation readiness

9. **Contingency and exit planning:**
   - Assess business continuity planning for partnership disruption
   - Evaluate data portability and customer transition procedures
   - Review contractual exit provisions (wind-down timelines, customer notification)
   - Assess regulatory notification requirements upon partnership termination
   - Evaluate alternative partner bank identification and transition planning

10. **Write the artifact** to `.singularskills/compliance/<project>/01-assess/bank-partnership.md` following the assessment template structure with:
    - **Regulatory Framework** — applicable guidance and partnership classification
    - **CMS Pass-Through** — compliance management system requirements and adequacy
    - **Consumer Compliance** — UDAP/UDAAP, fair lending, and consumer protection readiness
    - **Examination Readiness** — preparedness for regulatory scrutiny through the bank
    - **Information Security** — bank-mandated security requirements and compliance
    - **Data Governance** — GLBA, data sharing, and privacy obligations
    - **Vendor Oversight** — documentation, monitoring, and reporting requirements
    - **Contingency Planning** — exit strategy and business continuity
    - **Evidence Inventory** — existing evidence and evidence gaps
    - **Remediation Priorities** — ranked list of gaps to address

## Output

The bank partnership assessment written to `.singularskills/compliance/<project>/01-assess/bank-partnership.md`. Present a summary to the user highlighting:
- Overall partnership compliance maturity
- Consumer compliance readiness across key regulations
- Examination readiness assessment
- Top 3 gaps requiring remediation

**Record the run.** Append each of these events to `.singularskills/log.jsonl` as one line (create the folder and file if missing):

- Before you start work (once the gate has passed or `--skip-checks` was given): `{"ts":"<ISO timestamp>","skill":"compliance-bank-partnership","workflow":"compliance","phase":1,"project":"<project>","event":"started","artifact":"01-assess/","note":""}`
- After you have written the artifact: the same line with `"event":"finished"`.
- If the gate refused and the user did not bypass it: the same line with `"event":"refused"` and `"note"` set to what the gate printed, instead of the other two; then stop.

Open the artifact with this frontmatter (`agent` is the agent you run in, or `unknown`; `gate` is `passed` when the gate ran clean and `skipped` under `--skip-checks`):

```yaml
---
skill: compliance-bank-partnership
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

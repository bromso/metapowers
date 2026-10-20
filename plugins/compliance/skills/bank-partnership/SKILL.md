---
name: bank-partnership
description: Assess what a partner bank and its regulators expect of a fintech — OCC/FDIC third-party guidance, compliance management pass-through, UDAAP and fair lending, exam readiness and exit planning. Use when a fintech or BaaS program depends on a sponsor bank and wants to assess whether its own program meets what the bank and its examiners will require.
argument-hint: "[project] [--skip-checks]"
---

# Bank Partnership Compliance Assessment

Assess partner bank compliance requirements for "$ARGUMENTS". Evaluate regulatory expectations for bank-fintech partnerships, compliance management system pass-through, and examination readiness.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.metapowers/compliance/<project>/skip-log.md`: `- <ISO timestamp> — <skill name> skipped prerequisite check for <artifact file> — reason: <reason or "none given">`.

## Prerequisites

Read `.metapowers/compliance/<project>/00-scope.md`. If this file does not exist, tell the user:

> Phase 0 (Scope) has not been completed for "<project>". Run `/compliance:regulatory-landscape <project>` first, or use `--skip-checks` to bypass.

## Process

1. **Read context files:**
   - Read `${CLAUDE_PLUGIN_ROOT}/shared/grc-lifecycle-guide.md` for GRC methodology reference
   - Read `${CLAUDE_PLUGIN_ROOT}/shared/assessment-template.md` for output structure
   - Read `.metapowers/compliance/<project>/00-scope.md` for scope and control framework context

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

10. **Write the artifact** to `.metapowers/compliance/<project>/01-assess/bank-partnership.md` following the assessment template structure with:
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

The bank partnership assessment written to `.metapowers/compliance/<project>/01-assess/bank-partnership.md`. Present a summary to the user highlighting:
- Overall partnership compliance maturity
- Consumer compliance readiness across key regulations
- Examination readiness assessment
- Top 3 gaps requiring remediation

End the artifact with this paragraph, verbatim:

> **Not legal or audit advice.** This artifact supports preparation for compliance work; certification, attestation and regulatory conclusions require a qualified auditor or counsel.

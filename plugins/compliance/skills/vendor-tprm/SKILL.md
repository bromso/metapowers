---
description: Assess vendor/third-party risk management program
---

# Vendor / Third-Party Risk Management Assessment

Assess the vendor and third-party risk management (TPRM) program for "$ARGUMENTS". Evaluate vendor lifecycle management from identification through offboarding, including due diligence, contractual requirements, ongoing monitoring, and subprocessor management.

## Prerequisites

Read `.metapowers/compliance/$ARGUMENTS/00-scope.md`. If this file does not exist, tell the user:

> Phase 0 (Scope) has not been completed for "$ARGUMENTS". Run `/compliance:regulatory-landscape $ARGUMENTS` first, or use `--skip-checks` to bypass.

If `--skip-checks` is present in $ARGUMENTS, skip this check.

## Process

1. **Read context files:**
   - Read `plugins/compliance/shared/grc-lifecycle-guide.md` for GRC methodology reference
   - Read `plugins/compliance/shared/assessment-template.md` for output structure
   - Read `.metapowers/compliance/$ARGUMENTS/00-scope.md` for scope and control framework context

2. **Vendor identification and classification:**
   - Assess vendor inventory completeness (all third parties identified and cataloged)
   - Evaluate risk-based classification methodology (critical, high, medium, low risk)
   - Review classification criteria: data access, system connectivity, business impact, regulatory scope, replaceability
   - Assess vendor categorization by type (cloud services, SaaS, professional services, outsourced operations, subcontractors)
   - Evaluate concentration risk assessment (dependency on single vendors, geographic concentration)

3. **Due diligence process:**
   - Assess pre-engagement due diligence procedures per risk tier
   - Evaluate security questionnaire process (SIG, CAIQ, custom questionnaires)
   - Review SOC report analysis (SOC 2 Type II, SOC 1, bridging letters, complementary user entity controls)
   - Assess penetration testing and vulnerability assessment requirements for vendors
   - Evaluate financial stability assessment (credit reports, financial statements, insurance coverage)
   - Review legal and regulatory compliance verification (certifications, licenses, regulatory actions)
   - Assess business continuity and disaster recovery capability evaluation
   - Evaluate privacy impact assessment for vendors processing personal data

4. **Contractual requirements:**
   - Assess Data Processing Agreement (DPA) coverage and adequacy
   - Evaluate Service Level Agreements (SLAs) with measurable metrics and remedies
   - Review security addenda and minimum security requirements
   - Assess right-to-audit clauses and audit facilitation provisions
   - Evaluate breach notification requirements (timelines, content, cooperation)
   - Review data return/destruction clauses upon termination
   - Assess liability, indemnification, and insurance requirements
   - Evaluate subprocessor approval and notification rights

5. **Ongoing monitoring:**
   - Assess periodic reassessment cadence per risk tier (annual for critical, biennial for high, etc.)
   - Evaluate continuous monitoring signals (security ratings, breach notifications, news monitoring)
   - Review performance monitoring against SLAs and KPIs
   - Assess incident and near-miss tracking for vendor-related events
   - Evaluate vendor relationship governance (steering committees, business reviews)
   - Review compliance certificate and certification renewal tracking
   - Assess trigger-based reassessment procedures (material changes, incidents, M&A)

6. **Offboarding procedures:**
   - Assess data return and destruction procedures (certificates of destruction, verification)
   - Evaluate access revocation process (system access, physical access, credentials)
   - Review knowledge transfer requirements for critical vendors
   - Assess transition planning and migration support obligations
   - Evaluate post-termination confidentiality and data handling obligations

7. **Subprocessor management:**
   - Assess subprocessor identification and approval workflow
   - Evaluate notification obligations for subprocessor changes (advance notice period)
   - Review flow-down requirements (security, privacy, compliance obligations)
   - Assess objection rights and procedures for subprocessor changes
   - Evaluate fourth-party risk visibility and oversight

8. **Program governance:**
   - Assess TPRM policy and procedures documentation
   - Evaluate roles and responsibilities (TPRM team, business owners, legal, security, privacy)
   - Review TPRM tooling and automation (GRC platform, vendor risk management system)
   - Assess reporting and metrics (vendor risk dashboards, board reporting)
   - Evaluate exception and risk acceptance processes

9. **Write the artifact** to `.metapowers/compliance/$ARGUMENTS/01-assess/vendor-tprm.md` following the assessment template structure with:
    - **Vendor Inventory** — completeness and risk classification coverage
    - **Due Diligence** — process maturity per risk tier and assessment coverage
    - **Contractual Framework** — DPA, SLA, security, and audit clause coverage
    - **Ongoing Monitoring** — reassessment cadence, continuous monitoring, and performance tracking
    - **Offboarding** — data destruction, access revocation, and transition procedures
    - **Subprocessor Management** — identification, approval, and flow-down requirements
    - **Program Governance** — policy, roles, tooling, and reporting
    - **Evidence Inventory** — existing evidence and evidence gaps
    - **Remediation Priorities** — ranked list of gaps to address

## Output

The vendor TPRM assessment written to `.metapowers/compliance/$ARGUMENTS/01-assess/vendor-tprm.md`. Present a summary to the user highlighting:
- Vendor inventory completeness and risk classification coverage
- Due diligence and contractual coverage rates by risk tier
- Ongoing monitoring maturity and reassessment compliance
- Top 3 gaps requiring remediation

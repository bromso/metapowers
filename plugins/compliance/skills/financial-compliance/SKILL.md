---
description: Assess financial regulatory compliance — FINRA, SOX, SEC reporting requirements
---

# Financial Regulatory Compliance Assessment

Assess financial regulatory compliance for "$ARGUMENTS". Evaluate FINRA cybersecurity requirements, SOX IT controls, and SEC reporting obligations.

## Prerequisites

Read `.metapowers/compliance/$ARGUMENTS/00-scope.md`. If this file does not exist, tell the user:

> Phase 0 (Scope) has not been completed for "$ARGUMENTS". Run `/compliance:regulatory-landscape $ARGUMENTS` first, or use `--skip-checks` to bypass.

If `--skip-checks` is present in $ARGUMENTS, skip this check.

## Process

1. **Read context files:**
   - Read `plugins/compliance/shared/grc-lifecycle-guide.md` for GRC methodology reference
   - Read `plugins/compliance/shared/assessment-template.md` for output structure
   - Read `.metapowers/compliance/$ARGUMENTS/00-scope.md` for scope and control framework context

2. **Applicable regulation determination:**
   - Determine entity type (broker-dealer, investment adviser, public company, bank, fintech)
   - Identify applicable regulations based on entity type and activities
   - Assess regulatory registration status and obligations
   - Document applicable regulatory landscape

3. **FINRA compliance assessment:**
   - Assess cybersecurity program requirements (FINRA Rule 3110, Reg S-P, Reg S-ID)
   - Evaluate record retention obligations (SEC Rule 17a-4, FINRA Rule 4511)
   - Assess customer data protection and privacy (Reg S-P safeguards rule)
   - Review identity theft prevention (Red Flags Rule / Reg S-ID)
   - Evaluate breach reporting requirements
   - Assess business continuity planning (FINRA Rule 4370)
   - Review supervisory procedures for technology and cyber risks

4. **SOX (Sarbanes-Oxley) assessment:**
   - Assess IT General Controls (ITGCs) for financial reporting systems
   - Evaluate access controls to financial systems and data (logical access, segregation of duties)
   - Review change management procedures for financial applications and infrastructure
   - Assess computer operations (job scheduling, backup, batch processing)
   - Evaluate audit trail integrity and log management for financial transactions
   - Review IT risk assessment related to financial reporting
   - Assess service organization controls (SOC 1 reports from vendors)
   - Evaluate management's assessment of internal controls (Section 404)

5. **SEC reporting requirements:**
   - Assess cybersecurity disclosure rules (2023) compliance
   - Evaluate material incident reporting readiness (Form 8-K, 4 business days for material incidents)
   - Review annual cybersecurity risk management and strategy disclosure (Form 10-K)
   - Assess governance disclosure requirements (board oversight, management role)
   - Evaluate materiality determination process for cyber incidents
   - Review third-party risk disclosure obligations

6. **Cross-regulation compliance:**
   - Identify overlapping requirements across FINRA, SOX, and SEC
   - Assess unified control framework feasibility
   - Map shared controls to reduce compliance burden
   - Identify gaps unique to each regulation

7. **Write the artifact** to `.metapowers/compliance/$ARGUMENTS/01-assess/financial-compliance.md` following the assessment template structure with:
   - **Entity Classification** — type, registrations, and applicable regulations
   - **FINRA Assessment** — cybersecurity, record retention, customer protection scoring
   - **SOX ITGC Assessment** — access controls, change management, operations, audit trail
   - **SEC Reporting Readiness** — incident reporting, annual disclosure, governance
   - **Cross-Regulation Matrix** — overlapping controls and unique requirements
   - **Evidence Inventory** — existing evidence and evidence gaps
   - **Remediation Priorities** — ranked list of gaps to address

## Output

The financial regulatory compliance assessment written to `.metapowers/compliance/$ARGUMENTS/01-assess/financial-compliance.md`. Present a summary to the user highlighting:
- Applicable regulations by entity type
- Compliance score per regulatory framework (FINRA, SOX, SEC)
- SOX ITGC readiness level
- Top 3 gaps requiring remediation

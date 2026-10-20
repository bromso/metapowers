---
name: dora
description: Assess EU financial-sector ICT resilience under DORA, plus PSD2 strong customer authentication and MiFID II trading-system controls. Use when the user is an EU bank, insurer, payment or investment firm, or its ICT provider, and wants to assess how their own resilience program measures up to DORA.
argument-hint: "[project] [--skip-checks]"
---

# DORA / PSD2 / MiFID II Assessment

Assess Digital Operational Resilience Act (DORA), PSD2, and MiFID II compliance for "$ARGUMENTS". Evaluate ICT risk management, incident reporting, operational resilience testing, and third-party risk management.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.metapowers/compliance/<project>/skip-log.md`: `- <ISO timestamp> — <skill name> skipped prerequisite check for <artifact file> — reason: <reason or "none given">`.

## Prerequisites

Read `.metapowers/compliance/<project>/00-scope.md`. If this file does not exist, tell the user:

> Phase 0 (Scope) has not been completed for "<project>". Run `/compliance:regulatory-landscape <project>` first, or use `--skip-checks` to bypass.

## Process

1. **Read context files:**
   - Read `${CLAUDE_PLUGIN_ROOT}/shared/grc-lifecycle-guide.md` for GRC methodology reference
   - Read `${CLAUDE_PLUGIN_ROOT}/shared/assessment-template.md` for output structure
   - Read `.metapowers/compliance/<project>/00-scope.md` for scope and control framework context

2. **DORA (Digital Operational Resilience Act) assessment:**
   - **ICT Risk Management Framework:**
     - Assess ICT risk management strategy and policies
     - Evaluate ICT asset inventory and dependency mapping
     - Review ICT risk identification, protection, detection, response, and recovery capabilities
     - Assess business impact analysis for ICT disruptions
     - Evaluate ICT change management and patch management
   - **Incident Reporting:**
     - Assess major ICT incident classification methodology
     - Evaluate reporting timelines: initial notification (within 4 hours of classification), intermediate report (within 72 hours), final report (within 1 month)
     - Review incident root cause analysis and post-incident review processes
     - Assess significant cyber threat voluntary reporting
   - **Digital Operational Resilience Testing:**
     - Assess basic testing program (vulnerability assessments, network security, gap analysis, software security, source code reviews, performance testing)
     - Evaluate Threat-Led Penetration Testing (TLPT) requirements for significant entities
     - Review testing frequency and scope adequacy
     - Assess use of qualified external testers
   - **Third-Party Risk Management:**
     - Assess register of all ICT third-party service providers
     - Evaluate contractual arrangements with ICT providers (SLA, audit rights, exit strategies)
     - Review concentration risk assessment for critical ICT providers
     - Assess oversight of critical third-party providers by European Supervisory Authorities
   - **Information Sharing:**
     - Assess participation in cyber threat information sharing arrangements
     - Evaluate information sharing agreements and mechanisms

3. **PSD2 (Payment Services Directive 2) assessment:**
   - Assess Strong Customer Authentication (SCA) implementation
   - Evaluate SCA exemptions application (low-value, trusted beneficiary, TRA)
   - Review secure communication standards for payment initiation and account information
   - Assess incident reporting to competent authority (major operational/security incidents)
   - Evaluate fraud monitoring and reporting mechanisms
   - Review API and third-party provider (TPP) access security

4. **MiFID II assessment:**
   - Assess algorithmic trading controls and circuit breakers
   - Evaluate business continuity arrangements for trading systems
   - Review record keeping requirements (communications, transactions, orders)
   - Assess IT governance and operational risk management
   - Evaluate outsourcing arrangements for critical/important functions
   - Review disaster recovery and system resilience

5. **ICT risk management maturity:**
   - Score overall ICT risk management maturity (initial, developing, defined, managed, optimized)
   - Identify areas where maturity falls below regulatory expectations
   - Compare maturity across DORA, PSD2, and MiFID II requirements
   - Prioritize maturity improvement areas by regulatory impact

6. **Write the artifact** to `.metapowers/compliance/<project>/01-assess/dora.md` following the assessment template structure with:
   - **DORA ICT Risk Management** — framework maturity and gap assessment
   - **DORA Incident Reporting** — classification methodology and timeline readiness
   - **DORA Resilience Testing** — basic testing and TLPT readiness
   - **DORA Third-Party Risk** — provider register, contract assessment, concentration risk
   - **PSD2 Assessment** — SCA compliance, secure communication, incident reporting
   - **MiFID II Assessment** — algorithmic controls, BCP, record keeping
   - **ICT Maturity Score** — overall and per-domain maturity levels
   - **Evidence Inventory** — existing evidence and evidence gaps
   - **Remediation Priorities** — ranked list of gaps to address

## Output

The DORA/PSD2/MiFID II assessment written to `.metapowers/compliance/<project>/01-assess/dora.md`. Present a summary to the user highlighting:
- Overall ICT risk management maturity level
- DORA readiness score across all five pillars — score = (Compliant + 0.5 × Partial) ÷ applicable requirements (N/A excluded), as a percentage
- PSD2 SCA compliance status
- Top 3 gaps requiring remediation

End the artifact with this paragraph, verbatim:

> **Not legal or audit advice.** This artifact supports preparation for compliance work; certification, attestation and regulatory conclusions require a qualified auditor or counsel.

---
description: Assess gaps against security frameworks
---

# Compliance Gap

Assess compliance gaps against security frameworks for "$ARGUMENTS". Evaluate current security posture against industry standards, identify critical gaps, and prioritize remediation efforts.

## Prerequisites

Read `.metapowers/security/$ARGUMENTS/00-govern.md`. If this file does not exist, tell the user:

> Phase 0 (Govern) has not been completed for "$ARGUMENTS". Run a Govern skill first (e.g., `/security:security-policy $ARGUMENTS`), or use `--skip-checks` to bypass.

If `--skip-checks` is present in $ARGUMENTS, skip this check and log to `.metapowers/security/$ARGUMENTS/skip-log.md`.

## Process

1. **Select applicable frameworks:**
   - Evaluate which frameworks apply based on industry, geography, and business requirements:
     - **ISO 27001** — international information security management standard
     - **NIST CSF** — cybersecurity framework for risk-based security program
     - **SOC 2** — service organization controls for trust service criteria
     - **CIS Benchmarks** — prescriptive configuration and hardening guidelines
     - **PCI DSS** — payment card industry data security standard (if processing payments)
     - **HIPAA** — health insurance portability and accountability (if handling health data)
   - Prioritize frameworks by: regulatory mandate, customer requirements, business strategy

2. **Read reference materials:**
   - Read `plugins/security/shared/security-controls-matrix.md` for control mapping across frameworks
   - Cross-reference controls to identify overlapping requirements (implement once, comply with many)

3. **Assess current state against each control:**
   - For each control in the selected frameworks, evaluate:
     - **Implemented** — control is fully in place, documented, and evidenced
     - **Partially Implemented** — control exists but has gaps in scope, documentation, or enforcement
     - **Not Implemented** — control does not exist or is not operational
     - **N/A** — control is not applicable to the organization's environment
   - Document evidence for each assessment: policies, configurations, tool outputs, process documentation
   - Note where controls satisfy multiple frameworks simultaneously

4. **Score compliance posture:**
   - Calculate compliance percentage per framework: (Implemented + 0.5 x Partially) / Total Applicable
   - Identify the overall compliance maturity level:
     - >80%: Mature — focus on continuous improvement
     - 60-80%: Developing — targeted gap remediation needed
     - 40-60%: Basic — significant investment in controls required
     - <40%: Initial — foundational security program build-out needed
   - Compare across frameworks to identify which are closest to compliance

5. **Identify and prioritize critical gaps:**
   - Rank gaps by: risk severity, regulatory deadline, customer impact, implementation effort
   - Identify "quick wins" — gaps that can be closed with minimal effort but high compliance impact
   - Identify "foundational gaps" — missing capabilities that block multiple controls
   - Create a remediation roadmap with phases: immediate (0-30 days), short-term (1-3 months), medium-term (3-6 months), long-term (6-12 months)

6. **Write the artifact** to `.metapowers/security/$ARGUMENTS/01-identify.md` with heading:

   ## Compliance Gap Assessment

   Include sections:
   - **Framework Selection** — applicable frameworks with rationale
   - **Control Assessment** — status of each control per framework
   - **Compliance Scorecard** — percentage scores and maturity level per framework
   - **Critical Gaps** — prioritized list of gaps with risk and effort ratings
   - **Remediation Roadmap** — phased plan to close gaps with timelines and owners

## Output

The compliance gap assessment written to `.metapowers/security/$ARGUMENTS/01-identify.md`. Present a summary to the user highlighting:
- Frameworks assessed and compliance percentage for each
- Overall maturity level
- Top critical gaps requiring immediate attention
- Quick wins for rapid compliance improvement
- Recommended remediation roadmap

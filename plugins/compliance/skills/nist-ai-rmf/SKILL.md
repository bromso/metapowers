---
description: Assess NIST AI Risk Management Framework alignment
---

# NIST AI RMF Assessment

Assess NIST AI Risk Management Framework (AI RMF 1.0) alignment for "$ARGUMENTS". Evaluate maturity across the four core functions (Govern, Map, Measure, Manage) and assess AI trustworthiness characteristics.

## Prerequisites

Read `.metapowers/compliance/$ARGUMENTS/00-scope.md`. If this file does not exist, tell the user:

> Phase 0 (Scope) has not been completed for "$ARGUMENTS". Run `/compliance:regulatory-landscape $ARGUMENTS` first, or use `--skip-checks` to bypass.

If `--skip-checks` is present in $ARGUMENTS, skip this check.

## Process

1. **Read context files:**
   - Read `plugins/compliance/shared/grc-lifecycle-guide.md` for GRC methodology reference
   - Read `plugins/compliance/shared/assessment-template.md` for output structure
   - Read `.metapowers/compliance/$ARGUMENTS/00-scope.md` for scope and control framework context

2. **GOVERN function assessment:**
   - Assess AI governance policies and procedures (GOVERN 1)
   - Evaluate organizational roles, responsibilities, and accountability for AI risk (GOVERN 2)
   - Review workforce diversity, equity, and AI literacy programs (GOVERN 3)
   - Assess organizational culture for AI risk management (GOVERN 4)
   - Evaluate legal and regulatory compliance processes for AI (GOVERN 5)
   - Review oversight mechanisms and escalation procedures (GOVERN 6)
   - Score maturity: ad hoc, defined, managed, measured, optimized

3. **MAP function assessment:**
   - Assess AI system context establishment and intended purpose documentation (MAP 1)
   - Evaluate AI risk categorization and classification methodology (MAP 2)
   - Review stakeholder identification and engagement (MAP 3)
   - Assess AI system risk identification across the lifecycle (MAP 4)
   - Evaluate benefits and costs documentation for AI systems (MAP 5)
   - Score maturity: ad hoc, defined, managed, measured, optimized

4. **MEASURE function assessment:**
   - Assess AI risk measurement metrics and methodologies (MEASURE 1)
   - Evaluate AI system evaluation approaches (testing, red-teaming, field testing) (MEASURE 2)
   - Review AI risk tracking and monitoring mechanisms (MEASURE 3)
   - Assess feedback mechanisms for measurement improvement (MEASURE 4)
   - Score maturity: ad hoc, defined, managed, measured, optimized

5. **MANAGE function assessment:**
   - Assess AI risk prioritization and response planning (MANAGE 1)
   - Evaluate risk treatment strategies (mitigate, transfer, avoid, accept) (MANAGE 2)
   - Review incident response and escalation for AI systems (MANAGE 3)
   - Assess continuous monitoring and risk review processes (MANAGE 4)
   - Score maturity: ad hoc, defined, managed, measured, optimized

6. **AI trustworthiness characteristics assessment:**
   - **Valid and reliable:** Assess validation processes, performance benchmarks, and reliability testing
   - **Safe:** Evaluate safety requirements, testing for harmful outcomes, and fail-safe mechanisms
   - **Secure and resilient:** Assess cybersecurity measures, adversarial robustness, and resilience testing
   - **Accountable and transparent:** Evaluate accountability structures, audit trails, and transparency practices
   - **Explainable and interpretable:** Assess model interpretability, explanation methods, and user-facing explanations
   - **Privacy-enhanced:** Evaluate privacy-preserving techniques, data minimization, and privacy risk assessments
   - **Fair (bias managed):** Assess bias identification, measurement, and mitigation across the AI lifecycle

7. **Cross-function maturity summary:**
   - Create maturity heatmap across all four functions and sub-categories
   - Identify systemic gaps and organizational capability weaknesses
   - Map findings to AI trustworthiness characteristics
   - Assess overall organizational AI risk management maturity

8. **Write the artifact** to `.metapowers/compliance/$ARGUMENTS/01-assess/nist-ai-rmf.md` following the assessment template structure with:
    - **GOVERN Maturity** — policies, roles, culture, and oversight assessment
    - **MAP Maturity** — context, categorization, stakeholders, and risk identification
    - **MEASURE Maturity** — metrics, evaluation, tracking, and feedback
    - **MANAGE Maturity** — prioritization, treatment, response, and monitoring
    - **Trustworthiness Assessment** — scoring per characteristic (valid, safe, secure, accountable, explainable, privacy, fair)
    - **Maturity Heatmap** — cross-function maturity visualization
    - **Evidence Inventory** — existing evidence and evidence gaps
    - **Remediation Priorities** — ranked list of gaps to address

## Output

The NIST AI RMF assessment written to `.metapowers/compliance/$ARGUMENTS/01-assess/nist-ai-rmf.md`. Present a summary to the user highlighting:
- Overall maturity score per core function (Govern, Map, Measure, Manage)
- AI trustworthiness characteristics strengths and weaknesses
- Systemic capability gaps across functions
- Top 3 gaps requiring remediation

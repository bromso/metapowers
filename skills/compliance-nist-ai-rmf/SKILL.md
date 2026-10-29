---
name: compliance-nist-ai-rmf
description: Assess alignment with the voluntary NIST AI Risk Management Framework across Govern, Map, Measure and Manage and the trustworthiness characteristics. Use when the user wants to assess their own AI risk practices against a non-certifiable framework, often because a US customer or agency asks about NIST AI RMF. Not for a certifiable AI management system; see /compliance-iso42001.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: compliance
  phase: 1
  artifact: 01-assess/
---

# NIST AI RMF Assessment

Assess NIST AI Risk Management Framework (AI RMF 1.0) alignment for "$ARGUMENTS". Evaluate maturity across the four core functions (Govern, Map, Measure, Manage) and assess AI trustworthiness characteristics.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"compliance-nist-ai-rmf","workflow":"compliance","phase":1,"project":"<project>","event":"skipped","artifact":"01-assess/","note":"<reason or \"none given\">"}`.

## Prerequisites

Run this skill's gate before writing: `sh <this skill's folder>/scripts/gate.sh <project> <project root>`, where `<project root>` is the folder that contains `.singularskills/` (use `.` when you are already there). If it exits non-zero, stop and tell the user what it printed, unless `--skip-checks` was given (see Arguments).

Read `.singularskills/compliance/<project>/00-scope.md`. If this file does not exist, tell the user:

> Phase 0 (Scope) has not been completed for "<project>". Run `/compliance-regulatory-landscape <project>` first, or use `--skip-checks` to bypass.

## Process

1. **Read context files:**
   - Read `references/grc-lifecycle-guide.md` for GRC methodology reference
   - Read `references/assessment-template.md` for output structure
   - Read `.singularskills/compliance/<project>/00-scope.md` for scope and control framework context

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

8. **Write the artifact** to `.singularskills/compliance/<project>/01-assess/nist-ai-rmf.md` following the assessment template structure with:
    - **GOVERN Maturity** — policies, roles, culture, and oversight assessment
    - **MAP Maturity** — context, categorization, stakeholders, and risk identification
    - **MEASURE Maturity** — metrics, evaluation, tracking, and feedback
    - **MANAGE Maturity** — prioritization, treatment, response, and monitoring
    - **Trustworthiness Assessment** — scoring per characteristic (valid, safe, secure, accountable, explainable, privacy, fair)
    - **Maturity Heatmap** — cross-function maturity visualization
    - **Evidence Inventory** — existing evidence and evidence gaps
    - **Remediation Priorities** — ranked list of gaps to address

## Output

The NIST AI RMF assessment written to `.singularskills/compliance/<project>/01-assess/nist-ai-rmf.md`. Present a summary to the user highlighting:
- Overall maturity score per core function (Govern, Map, Measure, Manage)
- AI trustworthiness characteristics strengths and weaknesses
- Systemic capability gaps across functions
- Top 3 gaps requiring remediation

**Record the run.** Append each of these events to `.singularskills/log.jsonl` as one line (create the folder and file if missing):

- Before you start work (once the gate has passed or `--skip-checks` was given): `{"ts":"<ISO timestamp>","skill":"compliance-nist-ai-rmf","workflow":"compliance","phase":1,"project":"<project>","event":"started","artifact":"01-assess/","note":""}`
- After you have written the artifact: the same line with `"event":"finished"`.
- If the gate refused and the user did not bypass it: the same line with `"event":"refused"` and `"note"` set to what the gate printed, instead of the other two; then stop.

Open the artifact with this frontmatter (`agent` is the agent you run in, or `unknown`; `gate` is `passed` when the gate ran clean and `skipped` under `--skip-checks`):

```yaml
---
skill: compliance-nist-ai-rmf
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

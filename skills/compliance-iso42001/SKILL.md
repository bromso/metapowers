---
name: compliance-iso42001
description: Assess readiness for ISO/IEC 42001, the certifiable AI management system standard — AI policy, risk and impact assessment, data and lifecycle controls, third-party AI and ISMS reuse. Use when the user wants AI governance certification or a customer asks for ISO 42001 and they want to assess how far they are from it. Not for the voluntary NIST AI framework; see /compliance-nist-ai-rmf.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: compliance
  phase: 1
  artifact: 01-assess/
---

# ISO/IEC 42001 Assessment

Assess ISO/IEC 42001 AI Management System (AIMS) readiness for "$ARGUMENTS". Evaluate AI-specific management system requirements, map to existing ISO 27001 ISMS, and identify AI-specific controls beyond standard information security.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"compliance-iso42001","workflow":"compliance","phase":1,"project":"<project>","event":"skipped","artifact":"01-assess/","note":"<reason or \"none given\">"}`.

## Prerequisites

Run this skill's gate before writing: `sh <this skill's folder>/scripts/gate.sh <project> <project root>`, where `<project root>` is the folder that contains `.singularskills/` (use `.` when you are already there). If it exits non-zero, stop and tell the user what it printed, unless `--skip-checks` was given (see Arguments).

Read `.singularskills/compliance/<project>/00-scope.md`. If this file does not exist, tell the user:

> Phase 0 (Scope) has not been completed for "<project>". Run `/compliance-regulatory-landscape <project>` first, or use `--skip-checks` to bypass.

## Process

1. **Read context files:**
   - Read `references/grc-lifecycle-guide.md` for GRC methodology reference
   - Read `references/assessment-template.md` for output structure
   - Read `.singularskills/compliance/<project>/00-scope.md` for scope and control framework context

2. **AI policy and leadership (Clauses 5):**
   - Assess existence and adequacy of AI policy aligned with organizational strategy
   - Evaluate leadership commitment to responsible AI development and deployment
   - Review roles, responsibilities, and authorities for AI governance
   - Assess organizational AI objectives and planning to achieve them

3. **Context and scope (Clauses 4):**
   - Assess understanding of organizational context relevant to AI (internal/external issues)
   - Evaluate identification of interested parties and their requirements for AI
   - Review AIMS scope definition (AI systems, processes, and organizational units)
   - Assess alignment with organizational values and ethical AI principles

4. **AI risk assessment (Clause 6):**
   - Assess AI risk assessment methodology (identification, analysis, evaluation)
   - Evaluate coverage of AI-specific risks (bias, fairness, transparency, safety, privacy)
   - Review risk treatment plans and residual risk acceptance
   - Assess integration with enterprise risk management framework

5. **AI impact assessment:**
   - Assess AI impact assessment process for individuals, groups, and society
   - Evaluate consideration of ethical, social, and environmental impacts
   - Review stakeholder impact documentation and mitigation measures
   - Assess ongoing impact monitoring for deployed AI systems

6. **Data management for AI (Annex B controls):**
   - Assess data quality management for AI training, validation, and testing data
   - Evaluate data provenance and lineage tracking
   - Review data bias assessment and mitigation procedures
   - Assess data lifecycle management for AI-specific datasets
   - Evaluate data governance policies specific to AI workloads

7. **AI system lifecycle management:**
   - Assess AI system development lifecycle procedures (design, development, testing, deployment, monitoring, retirement)
   - Evaluate model validation and verification processes
   - Review AI system performance monitoring and drift detection
   - Assess change management for AI models and systems
   - Evaluate AI system documentation throughout the lifecycle

8. **Third-party AI considerations:**
   - Assess governance of third-party AI components, models, and services
   - Evaluate vendor AI risk assessment procedures
   - Review contractual requirements for third-party AI providers
   - Assess transparency and explainability requirements for third-party AI

9. **ISO 27001 integration assessment:**
   - Map shared clauses (4-10) between ISO 42001 and existing ISO 27001 ISMS
   - Identify reusable controls and documentation from existing ISMS
   - Assess gaps between current ISMS and AI-specific requirements
   - Evaluate integrated management system approach feasibility
   - Document AI-specific controls beyond standard information security (Annex A/B)

10. **Performance evaluation and improvement (Clauses 9-10):**
    - Assess monitoring, measurement, analysis, and evaluation of AIMS
    - Evaluate internal audit program for AI management
    - Review management review process for AI governance
    - Assess continual improvement mechanisms for AI management

11. **Write the artifact** to `.singularskills/compliance/<project>/01-assess/iso42001.md` following the assessment template structure with:
    - **AI Policy and Governance** — leadership commitment and organizational framework
    - **AI Risk Assessment** — methodology, coverage, and treatment plans
    - **AI Impact Assessment** — process maturity and stakeholder coverage
    - **Data Management** — AI-specific data governance and quality
    - **Lifecycle Management** — development, deployment, and monitoring procedures
    - **Third-Party AI** — governance of external AI components
    - **ISO 27001 Integration** — shared controls and AI-specific gaps
    - **Performance Evaluation** — audit and improvement mechanisms
    - **Evidence Inventory** — existing evidence and evidence gaps
    - **Remediation Priorities** — ranked list of gaps to address

## Output

The ISO 42001 assessment written to `.singularskills/compliance/<project>/01-assess/iso42001.md`. Present a summary to the user highlighting:
- Overall AIMS readiness maturity level
- ISO 27001 reuse potential (percentage of shared clauses already covered)
- AI-specific control gaps beyond existing ISMS
- Top 3 gaps requiring remediation

**Record the run.** Append each of these events to `.singularskills/log.jsonl` as one line (create the folder and file if missing):

- Before you start work (once the gate has passed or `--skip-checks` was given): `{"ts":"<ISO timestamp>","skill":"compliance-iso42001","workflow":"compliance","phase":1,"project":"<project>","event":"started","artifact":"01-assess/","note":""}`
- After you have written the artifact: the same line with `"event":"finished"`.
- If the gate refused and the user did not bypass it: the same line with `"event":"refused"` and `"note"` set to what the gate printed, instead of the other two; then stop.

Open the artifact with this frontmatter (`agent` is the agent you run in, or `unknown`; `gate` is `passed` when the gate ran clean and `skipped` under `--skip-checks`):

```yaml
---
skill: compliance-iso42001
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

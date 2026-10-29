---
name: compliance-iso27018
description: Assess ISO 27018 protection of personal data in public cloud — PII processor obligations, cloud-specific PII protections, sub-processor transparency and contract terms. Use when a cloud provider processing customers' personal data wants to assess how its own PII protections measure up for ISO 27018.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: compliance
  phase: 1
  artifact: 01-assess/
---

# ISO 27018 Assessment

Assess ISO/IEC 27018:2019 PII (Personally Identifiable Information) protection in public cloud for "$ARGUMENTS". Evaluate PII processor obligations and cloud-specific PII protections.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"<skill name>","workflow":"compliance","phase":<phase>,"project":"<project>","event":"skipped","artifact":"<artifact file>","note":"<reason or \"none given\">"}`.

## Prerequisites

Run `scripts/gate.sh <project>` from this skill's folder. If it exits non-zero, stop and tell the user what it printed (unless `--skip-checks`, see Arguments).

Read `.singularskills/compliance/<project>/00-scope.md`. If this file does not exist, tell the user:

> Phase 0 (Scope) has not been completed for "<project>". Run `/compliance-regulatory-landscape <project>` first, or use `--skip-checks` to bypass.

## Process

1. **Read context files:**
   - Read `references/grc-lifecycle-guide.md` for GRC methodology reference
   - Read `references/assessment-template.md` for output structure
   - Read `.singularskills/compliance/<project>/00-scope.md` for scope and control framework context

2. **PII processing context:**
   - Identify PII categories processed in the public cloud (names, emails, financial data, health data, etc.)
   - Determine role: PII controller, PII processor, or both
   - Map data flows showing where PII enters, is processed, stored, and exits the cloud environment
   - Identify applicable privacy regulations (GDPR, CCPA, etc.) that ISO 27018 supports

3. **PII processor obligations assessment (ISO/IEC 29100 principles):**
   - **Consent and choice** — assess mechanisms for obtaining and managing data subject consent
   - **Purpose legitimacy and specification** — assess documentation of processing purposes, limitation to stated purposes
   - **Data minimization** — assess collection limitation, data adequacy, relevance checks
   - **Use, retention, and disclosure limitation** — assess data retention policies, usage restrictions, third-party disclosure controls
   - **Accountability** — assess privacy governance, DPO appointment, privacy impact assessments
   - **Information security** — assess security controls protecting PII (encryption, access control, monitoring)
   - **Privacy compliance** — assess privacy policy publication, compliance monitoring, breach response
   - Score each principle: Compliant / Partially Compliant / Non-Compliant

4. **Cloud-specific PII protections assessment:**
   - **Data location disclosure** — assess transparency about where PII is stored and processed geographically
   - **Sub-processor transparency** — assess disclosure of sub-processors, notification of sub-processor changes, contractual flow-down requirements
   - **Breach notification to controllers** — assess incident notification procedures to PII controllers, timeline commitments, content requirements
   - **Data return and disposal** — assess data portability upon contract termination, secure deletion procedures, deletion certification
   - **Government access disclosure** — assess policy for handling government data access requests, transparency reporting
   - **PII transmission security** — assess encryption in transit, secure API design, data transfer mechanisms
   - Score each protection: Implemented / Partially Implemented / Not Implemented

5. **Contractual requirements review:**
   - Assess Data Processing Agreements (DPAs) for ISO 27018 alignment
   - Check contractual obligations with sub-processors
   - Verify controller notification procedures are contractually defined

6. **Write the artifact** to `.singularskills/compliance/<project>/01-assess/iso27018.md` following the assessment template structure with:
   - **PII Processing Context** — data types, roles, data flows
   - **PII Processor Obligations** — 7 principles scored with findings
   - **Cloud-Specific PII Protections** — cloud protections scored with findings
   - **Contractual Requirements** — DPA and sub-processor agreement review
   - **Overall Compliance Score** — score = (Compliant/Implemented + 0.5 × Partially Compliant/Implemented) ÷ assessed principles and protections, as a percentage; show it with a heatmap
   - **Remediation Priorities** — ranked list of gaps to address

## Output

The ISO 27018 assessment written to `.singularskills/compliance/<project>/01-assess/iso27018.md`. Present a summary to the user highlighting:
- PII categories and processing role identified
- Overall PII protection compliance score (percentage, as defined above)
- Top 3 PII protection gaps
- Sub-processor transparency status

**Record the run.** Open the artifact with this frontmatter (`agent` is the agent you run in, or `unknown`; `gate` is `passed` when the gate ran clean and `skipped` under `--skip-checks`):

```yaml
---
skill: compliance-iso27018
workflow: compliance
phase: 1
project: <project>
started: <ISO timestamp>
finished: <ISO timestamp>
agent: <the agent you run in, or "unknown">
gate: <passed|skipped>
---
```

End the artifact (or your section of a shared artifact) with `## Decisions` and `## Open questions`, in this shape:

```markdown
## Decisions
- <what was chosen> — <why> — <what was rejected>

## Open questions
- <what the next phase or a reviewer must settle>
```

End the artifact with this paragraph, verbatim:

> **Not legal or audit advice.** This artifact supports preparation for compliance work; certification, attestation and regulatory conclusions require a qualified auditor or counsel.

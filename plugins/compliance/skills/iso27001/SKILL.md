---
name: iso27001
description: Assess ISO/IEC 27001:2022 ISMS compliance — clauses 4 to 10, all 93 Annex A controls, a draft Statement of Applicability and the risk treatment plan. Use when the user wants ISO 27001 certification and wants to assess how far their own ISMS is from it, or needs a Statement of Applicability.
argument-hint: "[project] [--skip-checks]"
---

# ISO 27001 Assessment

Assess ISO/IEC 27001:2022 Information Security Management System (ISMS) compliance for "$ARGUMENTS". Evaluate ISMS requirements (clauses 4-10), assess all 93 Annex A controls, and draft a Statement of Applicability.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.metapowers/compliance/<project>/skip-log.md`: `- <ISO timestamp> — <skill name> skipped prerequisite check for <artifact file> — reason: <reason or "none given">`.

## Prerequisites

Read `.metapowers/compliance/<project>/00-scope.md`. If this file does not exist, tell the user:

> Phase 0 (Scope) has not been completed for "<project>". Run `/compliance:regulatory-landscape <project>` first, or use `--skip-checks` to bypass.

## Process

1. **Read context files:**
   - Read `${CLAUDE_PLUGIN_ROOT}/shared/grc-lifecycle-guide.md` for GRC methodology reference
   - Read `${CLAUDE_PLUGIN_ROOT}/shared/assessment-template.md` for output structure
   - Read `.metapowers/compliance/<project>/00-scope.md` for scope and control framework context

2. **ISMS requirements assessment (Clauses 4-10):**
   - **Clause 4: Context of the organization** — assess understanding of internal/external issues, interested party requirements, ISMS scope definition
   - **Clause 5: Leadership** — assess management commitment, information security policy, roles and responsibilities
   - **Clause 6: Planning** — assess risk assessment methodology, risk treatment plan, information security objectives
   - **Clause 7: Support** — assess resources, competence, awareness, communication, documented information
   - **Clause 8: Operation** — assess operational planning, risk assessment execution, risk treatment implementation
   - **Clause 9: Performance evaluation** — assess monitoring, measurement, internal audit, management review
   - **Clause 10: Improvement** — assess nonconformity handling, corrective actions, continual improvement
   - Score each clause: Conforming / Minor nonconformity / Major nonconformity

3. **Annex A controls assessment (93 controls, 4 themes):**
   - **Organizational controls (37 controls)** — policies, roles, asset management, access control, supplier relationships, incident management, business continuity, compliance
   - **People controls (8 controls)** — screening, employment terms, awareness, disciplinary, termination, confidentiality, remote working, event reporting
   - **Physical controls (14 controls)** — physical perimeters, entry controls, securing offices, monitoring, utilities, cabling, equipment maintenance, storage media, clear desk
   - **Technological controls (34 controls)** — endpoint devices, privileged access, access restriction, source code, authentication, capacity, malware, vulnerabilities, logging, network security, web filtering, cryptography, SDLC, testing, change management, data masking, DLP, monitoring
   - Score each control: Implemented / Partially implemented / Not implemented / Not applicable

4. **Statement of Applicability (SoA) draft:**
   - For each of the 93 Annex A controls, document: applicability (yes/no), justification for inclusion/exclusion, implementation status, control description
   - Ensure all exclusions have documented justification

5. **Risk treatment plan assessment:**
   - Assess existing risk assessment methodology
   - Evaluate risk treatment decisions (accept, mitigate, transfer, avoid)
   - Check risk register completeness and currency
   - Assess residual risk acceptance process

6. **Documentation requirements check:**
   - Verify mandatory documented information exists (policies, procedures, records)
   - Assess document control processes (versioning, review, approval, distribution)
   - Identify missing or outdated documentation

7. **Write the artifact** to `.metapowers/compliance/<project>/01-assess/iso27001.md` following the assessment template structure with:
   - **ISMS Clauses Assessment** — Clauses 4-10 scoring with findings
   - **Annex A Controls Assessment** — all 93 controls scored by theme
   - **Statement of Applicability Draft** — full SoA with applicability and status
   - **Risk Treatment Plan Review** — methodology, register, residual risk
   - **Documentation Gaps** — missing or outdated mandatory documents
   - **Overall Compliance Score** — aggregate score with heatmap
   - **Remediation Priorities** — ranked list of gaps to address

## Output

The ISO 27001 assessment written to `.metapowers/compliance/<project>/01-assess/iso27001.md`. Present a summary to the user highlighting:
- ISMS maturity level across clauses 4-10
- Annex A compliance percentage by theme
- Top 5 control gaps
- Certification readiness assessment (ready / needs work / significant gaps)

End the artifact with this paragraph, verbatim:

> **Not legal or audit advice.** This artifact supports preparation for compliance work; certification, attestation and regulatory conclusions require a qualified auditor or counsel.

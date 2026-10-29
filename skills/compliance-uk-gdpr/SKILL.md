---
name: compliance-uk-gdpr
description: Assess UK GDPR compliance — divergences from EU GDPR, ICO expectations, UK transfer mechanisms (IDTA and addendum), PECR cookie and marketing rules, and UK breach reporting. Use when the user processes personal data of people in the UK and wants to assess what their own program must change for UK GDPR and PECR beyond EU GDPR.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: compliance
  phase: 1
  artifact: 01-assess/
---

# UK GDPR Assessment

Assess UK General Data Protection Regulation compliance for "$ARGUMENTS". Evaluate UK-specific divergences from EU GDPR, ICO requirements, and UK international transfer mechanisms.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"compliance-uk-gdpr","workflow":"compliance","phase":1,"project":"<project>","event":"skipped","artifact":"01-assess/","note":"<reason or \"none given\">"}`.

## Prerequisites

Run this skill's gate before writing: `sh <this skill's folder>/scripts/gate.sh <project> <project root>`, where `<project root>` is the folder that contains `.singularskills/` (use `.` when you are already there). If it exits non-zero, stop and tell the user what it printed, unless `--skip-checks` was given (see Arguments).

Read `.singularskills/compliance/<project>/00-scope.md`. If this file does not exist, tell the user:

> Phase 0 (Scope) has not been completed for "<project>". Run `/compliance-regulatory-landscape <project>` first, or use `--skip-checks` to bypass.

## Process

1. **Read context files:**
   - Read `references/grc-lifecycle-guide.md` for GRC methodology reference
   - Read `references/assessment-template.md` for output structure
   - Read `.singularskills/compliance/<project>/00-scope.md` for scope and control framework context

2. **UK GDPR applicability and divergences:**
   - Assess whether UK GDPR applies (UK establishment, offering goods/services to UK, monitoring UK individuals)
   - Identify areas where UK GDPR diverges from EU GDPR
   - Review ICO as the supervisory authority and its enforcement approach
   - Assess dual compliance obligations if both EU and UK GDPR apply

3. **Lawful basis and consent (UK approach):**
   - Assess lawful basis per processing activity under UK GDPR
   - Evaluate UK-specific legitimate interest balancing test (ICO three-part test)
   - Review age of consent for information society services (13 in UK vs 16 in EU)
   - Assess Age Appropriate Design Code (Children's Code) applicability

4. **International transfers (UK mechanisms):**
   - Map all transfers outside the UK
   - Assess UK adequacy decisions (which countries have UK adequacy)
   - Evaluate UK International Data Transfer Agreement (IDTA) usage
   - Review UK addendum to EU Standard Contractual Clauses
   - Assess UK Transfer Risk Assessments (TRAs)
   - Evaluate transfers between UK and EEA (bridging provisions)

5. **PECR (Privacy and Electronic Communications Regulations):**
   - Assess cookie consent compliance (PECR requirements)
   - Evaluate direct marketing consent (email, SMS, phone)
   - Review electronic communication security obligations
   - Assess cookie banner implementation and consent mechanisms

6. **UK-specific governance:**
   - Assess DPO appointment under UK GDPR
   - Review ICO registration (data protection fee)
   - Evaluate UK representative appointment (if required for non-UK organizations)
   - Assess records of processing activities

7. **Breach notification (UK requirements):**
   - Assess breach notification to ICO (72 hours)
   - Evaluate data subject notification procedures
   - Review breach severity assessment aligned with ICO guidance
   - Check breach register maintenance

8. **Write the artifact** to `.singularskills/compliance/<project>/01-assess/uk-gdpr.md` following the assessment template structure with:
   - **UK Applicability** — territorial scope and dual compliance assessment
   - **Divergence Analysis** — UK vs EU GDPR differences with compliance impact
   - **Lawful Basis Assessment** — UK-specific approach including legitimate interest
   - **Transfer Mechanisms** — IDTA, UK addendum, adequacy, TRA status
   - **PECR Compliance** — cookies, direct marketing, electronic communications
   - **ICO Governance** — registration, DPO, representative requirements
   - **Breach Readiness** — ICO notification capability
   - **Evidence Inventory** — existing evidence and evidence gaps
   - **Remediation Priorities** — ranked list of gaps to address

## Output

The UK GDPR assessment written to `.singularskills/compliance/<project>/01-assess/uk-gdpr.md`. Present a summary to the user highlighting:
- Overall UK GDPR compliance score — score = (Compliant + 0.5 × Partial) ÷ applicable requirements (N/A excluded), as a percentage
- Key divergences from EU GDPR requiring separate compliance effort
- PECR compliance status
- Top 3 gaps requiring remediation

**Record the run.** Append each of these events to `.singularskills/log.jsonl` as one line (create the folder and file if missing):

- Before you start work (once the gate has passed or `--skip-checks` was given): `{"ts":"<ISO timestamp>","skill":"compliance-uk-gdpr","workflow":"compliance","phase":1,"project":"<project>","event":"started","artifact":"01-assess/","note":""}`
- After you have written the artifact: the same line with `"event":"finished"`.
- If the gate refused and the user did not bypass it: the same line with `"event":"refused"` and `"note"` set to what the gate printed, instead of the other two; then stop.

Open the artifact with this frontmatter (`agent` is the agent you run in, or `unknown`; `gate` is `passed` when the gate ran clean and `skipped` under `--skip-checks`):

```yaml
---
skill: compliance-uk-gdpr
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

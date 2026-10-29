---
name: compliance-financial-compliance
description: Assess financial regulatory compliance for broker-dealers, advisers and public companies — FINRA cybersecurity and record retention, SOX IT general controls, and SEC cyber incident disclosure. Use when a broker-dealer, adviser or public company wants to assess how its own controls measure up to SOX ITGCs, FINRA cyber rules or SEC incident disclosure.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: compliance
  phase: 1
  artifact: 01-assess/
---

# Financial Regulatory Compliance Assessment

Assess financial regulatory compliance for "$ARGUMENTS". Evaluate FINRA cybersecurity requirements, SOX IT controls, and SEC reporting obligations.

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

7. **Write the artifact** to `.singularskills/compliance/<project>/01-assess/financial-compliance.md` following the assessment template structure with:
   - **Entity Classification** — type, registrations, and applicable regulations
   - **FINRA Assessment** — cybersecurity, record retention, customer protection scoring
   - **SOX ITGC Assessment** — access controls, change management, operations, audit trail
   - **SEC Reporting Readiness** — incident reporting, annual disclosure, governance
   - **Cross-Regulation Matrix** — overlapping controls and unique requirements
   - **Evidence Inventory** — existing evidence and evidence gaps
   - **Remediation Priorities** — ranked list of gaps to address

## Output

The financial regulatory compliance assessment written to `.singularskills/compliance/<project>/01-assess/financial-compliance.md`. Present a summary to the user highlighting:
- Applicable regulations by entity type
- Compliance score per regulatory framework (FINRA, SOX, SEC) — per framework, score = (Compliant + 0.5 × Partial) ÷ applicable requirements (N/A excluded), as a percentage
- SOX ITGC readiness level
- Top 3 gaps requiring remediation

**Record the run.** Open the artifact with this frontmatter (`agent` is the agent you run in, or `unknown`; `gate` is `passed` when the gate ran clean and `skipped` under `--skip-checks`):

```yaml
---
skill: compliance-financial-compliance
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

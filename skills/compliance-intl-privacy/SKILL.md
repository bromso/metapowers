---
name: compliance-intl-privacy
description: Assess privacy compliance under Canada's PIPEDA (and provincial laws such as Quebec Law 25), Singapore's PDPA and Japan's APPI, with a cross-jurisdiction comparison matrix. Use when the user has customers or users in Canada, Singapore or Japan and wants to assess how their own privacy practices measure up there.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: compliance
  phase: 1
  artifact: 01-assess/
---

# International Privacy Assessment

Assess international privacy law compliance for "$ARGUMENTS". Evaluate requirements under PIPEDA (Canada), PDPA (Singapore), and APPI (Japan), and create a cross-jurisdiction compliance matrix.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"compliance-intl-privacy","workflow":"compliance","phase":1,"project":"<project>","event":"skipped","artifact":"01-assess/","note":"<reason or \"none given\">"}`.

## Prerequisites

Run this skill's gate before writing: `sh <this skill's folder>/scripts/gate.sh <project> <project root>`, where `<project root>` is the folder that contains `.singularskills/` (use `.` when you are already there). If it exits non-zero, stop and tell the user what it printed, unless `--skip-checks` was given (see Arguments). On a refusal, before you stop, append this line to `.singularskills/log.jsonl` (create the folder and file if missing): `{"ts":"<ISO timestamp>","skill":"compliance-intl-privacy","workflow":"compliance","phase":1,"project":"<project>","event":"refused","artifact":"01-assess/","note":"<what the gate printed>"}`. Once the gate has passed, or under `--skip-checks` once you have appended the `skipped` line, append this line before you start work: `{"ts":"<ISO timestamp>","skill":"compliance-intl-privacy","workflow":"compliance","phase":1,"project":"<project>","event":"started","artifact":"01-assess/","note":""}`.

Read `.singularskills/compliance/<project>/00-scope.md`. If this file does not exist, tell the user:

> Phase 0 (Scope) has not been completed for "<project>". Run `/compliance-regulatory-landscape <project>` first, or use `--skip-checks` to bypass.

## Process

1. **Read context files:**
   - Read `references/grc-lifecycle-guide.md` for GRC methodology reference
   - Read `references/assessment-template.md` for output structure
   - Read `.singularskills/compliance/<project>/00-scope.md` for scope and control framework context

2. **PIPEDA (Canada) assessment:**
   - Assess applicability (commercial activity, federal vs provincial jurisdiction)
   - Evaluate 10 fair information principles: accountability, identifying purposes, consent, limiting collection, limiting use/disclosure/retention, accuracy, safeguards, openness, individual access, challenging compliance
   - Assess consent requirements (express, implied, deemed, opt-out)
   - Review PIPEDA vs provincial privacy laws (Alberta PIPA, Quebec Law 25, BC PIPA)
   - Evaluate breach notification requirements (real risk of significant harm)
   - Assess cross-border transfer obligations
   - Review Privacy Commissioner complaint and investigation process readiness

3. **PDPA (Singapore) assessment:**
   - Assess applicability and exemptions
   - Evaluate consent obligations (notification, purpose limitation)
   - Assess Do Not Call (DNC) Registry compliance
   - Review data protection obligations: purpose limitation, notification, consent, access/correction, accuracy, protection, retention limitation, transfer limitation
   - Evaluate Data Protection Officer appointment
   - Assess data breach notification (notify PDPC within 3 days of assessment, notify affected individuals)
   - Review PDPC enforcement and financial penalty exposure

4. **APPI (Japan) assessment:**
   - Assess applicability under amended 2022 APPI requirements
   - Evaluate consent requirements for personal information handling
   - Assess consent for international transfers (country name disclosure, recipient's system)
   - Review pseudonymized and anonymized data processing rules
   - Evaluate individual rights (disclosure, correction, cessation of use, third-party provision record)
   - Assess Personal Information Protection Commission (PPC) compliance
   - Review data breach notification requirements (PPC notification and individual notification)
   - Evaluate academic, journalistic, and religious exemptions if applicable

5. **Cross-jurisdiction compliance matrix:**
   - Create matrix comparing: consent models, data subject rights, cross-border transfer rules, breach notification timelines, DPO requirements, enforcement mechanisms
   - Identify common baseline across all applicable jurisdictions
   - Highlight jurisdiction-specific requirements not covered by baseline
   - Score compliance per jurisdiction per requirement area

6. **Write the artifact** to `.singularskills/compliance/<project>/01-assess/intl-privacy.md` following the assessment template structure with:
   - **Applicable Jurisdictions** — which laws apply with rationale
   - **PIPEDA Assessment** — fair information principles scoring (if applicable)
   - **PDPA Assessment** — obligation scoring per category (if applicable)
   - **APPI Assessment** — requirement scoring per category (if applicable)
   - **Cross-Jurisdiction Matrix** — comparative requirement and compliance view
   - **Common Baseline** — shared requirements and unified compliance approach
   - **Jurisdiction-Specific Gaps** — unique requirements per law
   - **Evidence Inventory** — existing evidence and evidence gaps
   - **Remediation Priorities** — ranked list of gaps to address

## Output

The international privacy assessment written to `.singularskills/compliance/<project>/01-assess/intl-privacy.md`. Present a summary to the user highlighting:
- Applicable jurisdictions and overall compliance score per jurisdiction — per jurisdiction, score = (Compliant + 0.5 × Partial) ÷ applicable requirements (N/A excluded), as a percentage
- Cross-jurisdiction common baseline compliance
- Jurisdiction-specific requirements needing attention
- Top 3 gaps requiring remediation

**Record the run.** After you have written the artifact, append this line to `.singularskills/log.jsonl` (the `started` line of Prerequisites, with `"event":"finished"`): `{"ts":"<ISO timestamp>","skill":"compliance-intl-privacy","workflow":"compliance","phase":1,"project":"<project>","event":"finished","artifact":"01-assess/","note":""}`.

Open the artifact with this frontmatter (`agent` is the agent you run in, or `unknown`; `gate` is `passed` when the gate ran clean and `skipped` under `--skip-checks`):

```yaml
---
skill: compliance-intl-privacy
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

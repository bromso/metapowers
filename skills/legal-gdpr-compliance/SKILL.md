---
name: legal-gdpr-compliance
description: Analyze GDPR obligations legally — data mapping, lawful basis, DPIA and DPO needs, data subject rights procedures, breach notification, transfer mechanisms and Article 30 records. Use when the user asks how to legitimize EU data transfers, whether they need a DPIA or DPO, or what GDPR legally requires of them. Not for a scored control-gap assessment; see /compliance-gdpr.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: legal
  phase: 3
  artifact: 03-comply.md
---

# GDPR Compliance

Assess and implement GDPR compliance for "$ARGUMENTS". Conduct data mapping, evaluate DPIA requirements, define data subject rights procedures, and establish breach notification and cross-border transfer mechanisms.

See also `/compliance-gdpr` for a scored control-gap assessment of GDPR compliance area by area.

> **Note:** AI-generated legal content does not constitute legal advice. Consult a qualified attorney.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"legal-gdpr-compliance","workflow":"legal","phase":3,"project":"<project>","event":"skipped","artifact":"03-comply.md","note":"<reason or \"none given\">"}`.

## Prerequisites

Run this skill's gate before writing: `sh <this skill's folder>/scripts/gate.sh <project> <project root>`, where `<project root>` is the folder that contains `.singularskills/` (use `.` when you are already there). If it exits non-zero, stop and tell the user what it printed, unless `--skip-checks` was given (see Arguments).

Check that `.singularskills/legal/<project>/00-assess.md` exists. If it does not exist, stop and tell the user:

> "Run an Assess skill first (e.g. `/legal-risk-assessment <project>`) to generate the prerequisite assessment artifact."

## Process

1. **Read inputs:**
   - Read `.singularskills/legal/<project>/00-assess.md` for risk, jurisdiction, and data practice context
   - Read any existing draft or review artifacts in `.singularskills/legal/<project>/` for additional context

2. **Conduct data mapping:**
   - What personal data is collected (categories and specific data elements)
   - Where personal data is stored (systems, databases, third-party services, backups)
   - Who processes the data (internal teams, processors, sub-processors)
   - Retention periods per data category with justification
   - Lawful basis per processing activity (consent, contract, legitimate interest, legal obligation, vital interest, public task)
   - Data flows between systems and across borders

3. **Assess need for DPIA:**
   - Evaluate against high-risk processing criteria (systematic monitoring, large-scale processing of special categories, automated decision-making with legal effects, innovative technologies, cross-border processing, vulnerable data subjects)
   - If DPIA is required, draft DPIA including: description of processing, assessment of necessity and proportionality, risk assessment to individuals, measures to mitigate risks

4. **Define data subject rights procedures:**
   - **Right of access** (Article 15) — procedure and response timeline (one month, extendable by two)
   - **Right to rectification** (Article 16) — how inaccuracies are corrected
   - **Right to erasure** (Article 17) — grounds for erasure, exceptions, process
   - **Right to restriction** (Article 18) — when restriction applies, how data is marked
   - **Right to data portability** (Article 20) — machine-readable format, direct transfer
   - **Right to object** (Article 21) — direct marketing (absolute right), other processing (balancing test)
   - Response timelines and escalation procedures

5. **Breach notification process:**
   - Detection and assessment procedures
   - 72-hour notification requirement to supervisory authority (Article 33)
   - Notification to affected individuals without undue delay when high risk (Article 34)
   - Content of notifications (nature of breach, categories and approximate number of data subjects, likely consequences, measures taken or proposed)
   - Internal documentation requirements for all breaches regardless of notification

6. **Cross-border transfer mechanisms:**
   - Adequacy decisions (current list of adequate countries)
   - Standard Contractual Clauses (SCCs) — new 2021 modular SCCs
   - Binding Corporate Rules (BCRs) for intra-group transfers
   - Derogations for specific situations (explicit consent, contractual necessity)
   - Transfer impact assessments where required

7. **DPO appointment assessment:**
   - Evaluate whether DPO appointment is mandatory (public authority, core activities involve regular and systematic monitoring at large scale, core activities involve large-scale processing of special categories)
   - If required, define DPO role, qualifications, and reporting structure

8. **Article 30 records of processing:**
   - Draft records of processing activities for controller and processor roles
   - Include all required fields (name and contact details, purposes, categories of data subjects and personal data, recipients, transfers, retention periods, security measures)

9. **Write the artifact** — append to `.singularskills/legal/<project>/03-comply.md` under a `## GDPR Compliance` section. Create the file with a `# Comply — <project>` heading if it does not exist; if a `## GDPR Compliance` section already exists, replace only that section. The section contains:

   - **Data Mapping** — comprehensive inventory of personal data processing activities
   - **DPIA Assessment** — determination and full DPIA if required
   - **Data Subject Rights Procedures** — procedures for each right with timelines
   - **Breach Notification Plan** — detection, assessment, and notification procedures
   - **Cross-Border Transfers** — applicable mechanisms and safeguards
   - **DPO Assessment** — appointment determination and role definition
   - **Records of Processing** — Article 30 compliant records
   - **Compliance Gaps** — identified gaps with remediation recommendations

## Output

The GDPR compliance assessment appended to `.singularskills/legal/<project>/03-comply.md`. Present a summary to the user highlighting:
- Number of processing activities mapped
- Whether DPIA is required and key findings
- Data subject rights procedures defined
- Cross-border transfer mechanisms identified
- Critical compliance gaps requiring immediate attention

**Record the run.** Append each of these events to `.singularskills/log.jsonl` as one line (create the folder and file if missing):

- Before you start work (once the gate has passed or `--skip-checks` was given): `{"ts":"<ISO timestamp>","skill":"legal-gdpr-compliance","workflow":"legal","phase":3,"project":"<project>","event":"started","artifact":"03-comply.md","note":""}`
- After you have written your section: the same line with `"event":"finished"`.
- If the gate refused and the user did not bypass it: the same line with `"event":"refused"` and `"note"` set to what the gate printed, instead of the other two; then stop.

This artifact is shared by every skill of phase 3 (Comply). The frontmatter is written once, by whoever creates the file: if you create it, open it with the block below (`skill` is the phase title, `started` the time of that first write; `gate` is `passed` when the gate ran clean and `skipped` under `--skip-checks`); if it already exists, leave the block alone except to update `finished` and to set `gate` to the worst value among the sections (`skipped` over `passed`).

```yaml
---
skill: Comply
workflow: legal
phase: 3
project: <project>
started: <ISO timestamp>
finished: <ISO timestamp>
agent: <the agent you run in, or "unknown">
gate: <passed|skipped>
---
```

Open your `## GDPR Compliance` section with one italic line, `*<skill name> · <ISO timestamp> · gate: <passed|skipped>*` (your skill name is `legal-gdpr-compliance`).

End your section with `### Decisions` and `### Open questions` (one level under your `## GDPR Compliance` heading, so the section stays one block), in this shape:

```markdown
### Decisions
- <what was chosen> — <why> — <what was rejected>

### Open questions
- <what the next phase or a reviewer must settle>
```

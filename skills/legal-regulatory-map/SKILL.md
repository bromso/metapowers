---
name: legal-regulatory-map
description: Map the regulations governing a product by jurisdiction, industry and data type into a law-by-law matrix showing current compliance status and priority gaps. Use when the user wants to see, law by law, how compliant their product is today and which gaps matter most. Not for listing every regulation and certification to start a program; see /compliance-regulatory-landscape.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: legal
  phase: 0
  artifact: 00-assess.md
---

# Regulatory Map

Map all applicable regulations for "$ARGUMENTS". Identify relevant laws and requirements by jurisdiction, industry, and data type, then assess current compliance status.

> **Note:** AI-generated legal content does not constitute legal advice. Consult a qualified attorney.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"legal-regulatory-map","workflow":"legal","phase":0,"project":"<project>","event":"skipped","artifact":"00-assess.md","note":"<reason or \"none given\">"}`.

## Prerequisites

**Part of a workflow.** This skill is phase 0 (Assess) of the Legal Lifecycle workflow (`legal`); cross-domain workflows run it too. Unless the user named this skill, check `.singularskills/log.jsonl` for an open run for this project: a `run-started` line with `"project":"<project>"` and no later `run-finished` line for the same `workflow` and `project`. If there is no open run, or the user asked to start, run, continue or resume a process or workflow rather than this one step, do not continue here: invoke the `workflow` skill with the workflow the user asked for, or `legal` when they named none, followed by `<project>`. It runs this phase in order, asks before it writes and records the run. Continue here when the user named this skill, or when an open run exists (the conductor is running you).

Before you start work, append this line to `.singularskills/log.jsonl` (create the folder and file if missing): `{"ts":"<ISO timestamp>","skill":"legal-regulatory-map","workflow":"legal","phase":0,"project":"<project>","event":"started","artifact":"00-assess.md","note":""}`.

None — this is a Phase 0 Assess skill.

## Process

1. **Identify applicable regulations:**
   - Use WebSearch to find regulations relevant to "<project>"
   - Consider the business model, industry, geography, and data handling practices
   - Include both primary regulations and subsidiary rules or guidance

2. **Map by jurisdiction:**
   - **EU** — GDPR, ePrivacy Directive, Digital Services Act, AI Act
   - **US federal** — FTC Act, CAN-SPAM, COPPA, HIPAA, SOX, CCPA enforcement
   - **US state-specific** — CCPA/CPRA (California), VCDPA (Virginia), CPA (Colorado), etc.
   - **UK** — UK GDPR, Data Protection Act 2018, Online Safety Act
   - **Other jurisdictions** — as applicable to the business

3. **Map by industry:**
   - **Healthcare** — HIPAA, HITECH, state health privacy laws
   - **Finance** — SOX, Dodd-Frank, PCI DSS, state money transmitter laws
   - **Technology** — software licensing, open source compliance, export controls
   - **General** — GDPR, consumer protection, advertising standards

4. **Map by data type:**
   - **Personal data** — general PII under GDPR, CCPA
   - **Health data** — PHI under HIPAA, health data under GDPR
   - **Financial data** — payment data under PCI DSS, financial records under SOX
   - **Children's data** — COPPA, Age Appropriate Design Code

5. **Create regulation matrix:**
   - Rows: each applicable regulation
   - Columns: key requirements, applicable jurisdiction, data types covered, current compliance status
   - Rate compliance status: compliant / partially compliant / non-compliant / unknown

6. **Identify highest-priority compliance gaps:**
   - Regulations where status is non-compliant with high enforcement risk
   - Upcoming regulatory deadlines or new laws taking effect
   - Areas where multiple regulations overlap with conflicting requirements

7. **Write the artifact** — append to `.singularskills/legal/<project>/00-assess.md` under a `## Regulatory Map` section. Create the file with a `# Assess — <project>` heading if it does not exist; if a `## Regulatory Map` section already exists, replace only that section. The section contains:

   - **Applicable Regulations** — complete list with brief descriptions
   - **Jurisdiction Map** — regulations organized by jurisdiction
   - **Industry Requirements** — industry-specific regulatory obligations
   - **Data Type Matrix** — which regulations apply to which data types
   - **Compliance Status Matrix** — current status for each regulation
   - **Priority Gaps** — highest-risk compliance gaps requiring action

## Output

The regulatory map appended to `.singularskills/legal/<project>/00-assess.md`. Present a summary to the user highlighting:
- Total number of applicable regulations identified
- Current compliance status breakdown (compliant / partial / non-compliant)
- Top compliance gaps requiring immediate attention

**Record the run.** After you have written your section, append this line to `.singularskills/log.jsonl` (the `started` line of Prerequisites, with `"event":"finished"`): `{"ts":"<ISO timestamp>","skill":"legal-regulatory-map","workflow":"legal","phase":0,"project":"<project>","event":"finished","artifact":"00-assess.md","note":""}`.

This artifact is shared by every skill of phase 0 (Assess). The frontmatter is written once, by whoever creates the file: if you create it, open it with the block below (`skill` is the phase title, `started` the time of that first write; `gate` is `none`, as this phase has no gate); if it already exists, leave the block alone except to update `finished`.

```yaml
---
skill: Assess
workflow: legal
phase: 0
project: <project>
started: <ISO timestamp>
finished: <ISO timestamp>
agent: <the agent you run in, or "unknown">
gate: none
---
```

Open your `## Regulatory Map` section with one italic line, `*<skill name> · <ISO timestamp> · gate: none*` (your skill name is `legal-regulatory-map`).

End your section with `### Decisions` and `### Open questions` (one level under your `## Regulatory Map` heading, so the section stays one block), in this shape:

```markdown
### Decisions
- <what was chosen> — <why> — <what was rejected>

### Open questions
- <what the next phase or a reviewer must settle>
```

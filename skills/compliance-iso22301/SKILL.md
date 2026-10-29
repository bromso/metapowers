---
name: compliance-iso22301
description: Assess ISO 22301 business continuity management system readiness — BIA with RTO and RPO, disruption risk assessment, continuity strategies and plans, and the exercise program. Use when the user wants ISO 22301 certification or must prove a certifiable continuity program and wants to assess its own BCMS. Not for writing the continuity plan itself; see /security-business-continuity.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: compliance
  phase: 1
  artifact: 01-assess/
---

# ISO 22301 Assessment

Assess ISO 22301 Business Continuity Management System (BCMS) compliance for "$ARGUMENTS". Evaluate business impact analysis, continuity strategies, plans, exercise program, and documentation requirements.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"compliance-iso22301","workflow":"compliance","phase":1,"project":"<project>","event":"skipped","artifact":"01-assess/","note":"<reason or \"none given\">"}`.

## Prerequisites

Run this skill's gate before writing: `sh <this skill's folder>/scripts/gate.sh <project> <project root>`, where `<project root>` is the folder that contains `.singularskills/` (use `.` when you are already there). If it exits non-zero, stop and tell the user what it printed, unless `--skip-checks` was given (see Arguments).

Read `.singularskills/compliance/<project>/00-scope.md`. If this file does not exist, tell the user:

> Phase 0 (Scope) has not been completed for "<project>". Run `/compliance-regulatory-landscape <project>` first, or use `--skip-checks` to bypass.

## Process

1. **Read context files:**
   - Read `references/grc-lifecycle-guide.md` for GRC methodology reference
   - Read `references/assessment-template.md` for output structure
   - Read `.singularskills/compliance/<project>/00-scope.md` for scope and control framework context

2. **BCMS context and scope (Clauses 4-5):**
   - Assess organizational context for business continuity (internal/external issues, interested parties)
   - Evaluate BCMS scope definition (organizational units, locations, products/services)
   - Review leadership commitment and BC policy
   - Assess roles, responsibilities, and authorities for business continuity
   - Evaluate resource allocation and competency requirements

3. **Business Impact Analysis (BIA):**
   - Assess BIA methodology and completeness
   - Evaluate identification of prioritized activities and their dependencies
   - Review Maximum Tolerable Period of Disruption (MTPD) for each prioritized activity
   - Assess Recovery Time Objectives (RTO) and Recovery Point Objectives (RPO)
   - Evaluate Minimum Business Continuity Objectives (MBCO)
   - Review resource requirements for recovery (people, facilities, technology, information, suppliers)
   - Assess BIA review and update cadence

4. **Risk assessment for disruption scenarios:**
   - Assess risk assessment methodology aligned with BIA findings
   - Evaluate threat identification across categories (natural, technological, human-caused, pandemic, supply chain)
   - Review likelihood and impact scoring for disruption scenarios
   - Assess risk treatment decisions (accept, mitigate, transfer, avoid)
   - Evaluate alignment between risk assessment outcomes and continuity strategies

5. **Business continuity strategies:**
   - **Prevention and mitigation:** Assess proactive measures to reduce disruption likelihood and impact
   - **Response strategies:** Evaluate immediate response procedures for prioritized activities
   - **Recovery strategies:** Assess strategies for restoring prioritized activities within RTO
   - Evaluate strategy options analysis (cost vs. risk reduction)
   - Review resource requirements for each strategy (alternate sites, technology, staffing)
   - Assess supply chain and third-party continuity considerations

6. **Business continuity plans:**
   - **Incident response procedures:** Assess initial response, escalation, and communication procedures
   - **Crisis management:** Evaluate crisis management team structure, decision-making, and stakeholder communication
   - **Recovery procedures:** Assess step-by-step recovery plans for prioritized activities
   - Review plan activation criteria and authority
   - Evaluate plan accessibility (offline access, distributed copies, mobile access)
   - Assess plan maintenance and version control procedures

7. **Exercise program:**
   - Assess exercise program scope and frequency
   - Evaluate exercise types: desktop/tabletop exercises, simulation exercises, full-scale exercises
   - Review exercise scenarios and coverage of disruption types
   - Assess post-exercise evaluation and lessons learned documentation
   - Evaluate corrective action tracking from exercise findings
   - Review exercise participation across organizational levels

8. **Performance evaluation and improvement (Clauses 9-10):**
   - Assess monitoring, measurement, analysis, and evaluation of BCMS effectiveness
   - Evaluate internal audit program for business continuity
   - Review management review process and outcomes
   - Assess continual improvement mechanisms and corrective action procedures

9. **Documentation assessment:**
   - Evaluate BC policy documentation
   - Assess BIA results documentation and currency
   - Review risk assessment documentation
   - Evaluate recovery strategies documentation
   - Assess BC plans documentation and accessibility
   - Review exercise records and post-exercise reports
   - Evaluate change management documentation for BCMS updates

10. **Write the artifact** to `.singularskills/compliance/<project>/01-assess/iso22301.md` following the assessment template structure with:
    - **BCMS Framework** — context, scope, policy, and governance
    - **Business Impact Analysis** — methodology, MTPD/RTO/RPO coverage, and completeness
    - **Risk Assessment** — disruption scenarios, scoring, and treatment decisions
    - **Continuity Strategies** — prevention, response, and recovery approach
    - **BC Plans** — incident response, crisis management, and recovery procedures
    - **Exercise Program** — types, frequency, coverage, and lessons learned
    - **Performance Evaluation** — audit, review, and improvement mechanisms
    - **Documentation** — completeness and currency assessment
    - **Evidence Inventory** — existing evidence and evidence gaps
    - **Remediation Priorities** — ranked list of gaps to address

## Output

The ISO 22301 assessment written to `.singularskills/compliance/<project>/01-assess/iso22301.md`. Present a summary to the user highlighting:
- Overall BCMS maturity and certification readiness
- BIA completeness and RTO/RPO coverage across prioritized activities
- Exercise program effectiveness and coverage
- Top 3 gaps requiring remediation

**Record the run.** Append each of these events to `.singularskills/log.jsonl` as one line (create the folder and file if missing):

- Before you start work (once the gate has passed or `--skip-checks` was given): `{"ts":"<ISO timestamp>","skill":"compliance-iso22301","workflow":"compliance","phase":1,"project":"<project>","event":"started","artifact":"01-assess/","note":""}`
- After you have written the artifact: the same line with `"event":"finished"`.
- If the gate refused and the user did not bypass it: the same line with `"event":"refused"` and `"note"` set to what the gate printed, instead of the other two; then stop.

Open the artifact with this frontmatter (`agent` is the agent you run in, or `unknown`; `gate` is `passed` when the gate ran clean and `skipped` under `--skip-checks`):

```yaml
---
skill: compliance-iso22301
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

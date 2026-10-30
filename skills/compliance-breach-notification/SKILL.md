---
name: compliance-breach-notification
description: Assess breach notification readiness across GDPR, US state laws, HIPAA, PCI DSS, NIS2 and contractual SLAs, with a notification decision tree and template library. Use when the user wants to check who they would have to notify after a data breach and whether their own process could meet every deadline they are bound by.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: compliance
  phase: 1
  artifact: 01-assess/
---

# Breach Notification Compliance Assessment

Assess breach notification compliance for "$ARGUMENTS". Map notification requirements by jurisdiction, evaluate contractual SLA obligations, and create a notification decision tree and template library.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"compliance-breach-notification","workflow":"compliance","phase":1,"project":"<project>","event":"skipped","artifact":"01-assess/","note":"<reason or \"none given\">"}`.

## Prerequisites

**Part of a workflow.** This skill is phase 1 (Assess) of the GRC Lifecycle workflow (`compliance`); cross-domain workflows run it too. Unless the user named this skill, check `.singularskills/log.jsonl` for an open run for this project: a `run-started` line with `"project":"<project>"` and no later `run-finished` line for the same `workflow` and `project`. If there is no open run, or the user asked to start, run, continue or resume a process or workflow rather than this one step, do not continue here: invoke the `workflow` skill with the workflow the user asked for, or `compliance` when they named none, followed by `<project>`. It runs this phase in order, asks before it writes and records the run. Continue here when the user named this skill, or when an open run exists (the conductor is running you).

Run this skill's gate before writing: `sh <this skill's folder>/scripts/gate.sh <project> <project root>`, where `<project root>` is the folder that contains `.singularskills/` (use `.` when you are already there). If it exits non-zero, stop and tell the user what it printed, unless `--skip-checks` was given (see Arguments). On a refusal, before you stop, append this line to `.singularskills/log.jsonl` (create the folder and file if missing): `{"ts":"<ISO timestamp>","skill":"compliance-breach-notification","workflow":"compliance","phase":1,"project":"<project>","event":"refused","artifact":"01-assess/","note":"<what the gate printed>"}`. Once the gate has passed, or under `--skip-checks` once you have appended the `skipped` line, append this line before you start work: `{"ts":"<ISO timestamp>","skill":"compliance-breach-notification","workflow":"compliance","phase":1,"project":"<project>","event":"started","artifact":"01-assess/","note":""}`.

Read `.singularskills/compliance/<project>/00-scope.md`. If this file does not exist, tell the user:

> Phase 0 (Scope) has not been completed for "<project>". Run `/compliance-regulatory-landscape <project>` first, or use `--skip-checks` to bypass.

## Process

1. **Read context files:**
   - Read `references/grc-lifecycle-guide.md` for GRC methodology reference
   - Read `references/assessment-template.md` for output structure
   - Read `.singularskills/compliance/<project>/00-scope.md` for scope and control framework context

2. **GDPR breach notification (Art 33-34):**
   - Assess notification to supervisory authority procedures (72-hour timeline from awareness)
   - Evaluate notification content requirements (nature of breach, categories/numbers affected, DPO contact, consequences, measures taken)
   - Review notification to data subjects procedures (without undue delay if high risk to rights and freedoms)
   - Assess breach severity assessment methodology (risk to individuals determination)
   - Evaluate cross-border notification procedures (lead supervisory authority identification)
   - Review breach record-keeping obligations (all breaches, not just notifiable ones)

3. **US state breach notification laws:**
   - Map notification requirements across all applicable states
   - Assess state-specific timelines (varies 30-90 days; some states have specific deadlines: Colorado 30 days, Florida 30 days, Washington 30 days)
   - Evaluate Attorney General notification thresholds per state (e.g., 500+ individuals in many states)
   - Review definition of "personal information" variations by state (some include login credentials, biometrics, health data)
   - Assess consumer reporting agency notification requirements (typically 1,000+ individuals)
   - Evaluate encryption and redaction safe harbors by state
   - Review content requirements for notification letters per state

4. **HIPAA breach notification (if applicable):**
   - Assess individual notification procedures (60 days from discovery, written notification)
   - Evaluate HHS/OCR notification requirements (60 days for 500+ affected, annual log for under 500)
   - Review media notification requirements (500+ individuals in a single state/jurisdiction)
   - Assess breach risk assessment methodology (4-factor test: nature of PHI, unauthorized person, actual access/use, mitigation extent)
   - Evaluate Business Associate notification obligations to Covered Entity (without unreasonable delay, no later than 60 days)

5. **PCI DSS breach notification:**
   - Assess card brand notification procedures and timelines
   - Evaluate acquiring bank notification requirements
   - Review forensic investigation requirements (PFI engagement)
   - Assess card reissuance cost liability and recovery procedures
   - Evaluate PCI Forensic Investigator engagement readiness

6. **NIS2 breach notification (if applicable):**
   - Assess early warning notification procedures (24 hours to CSIRT/competent authority)
   - Evaluate incident notification requirements (72 hours with initial assessment)
   - Review final report requirements (1 month with root cause analysis, mitigation measures, cross-border impact)
   - Assess significant incident determination criteria
   - Evaluate voluntary notification provisions for near-misses

7. **Contractual SLA obligations:**
   - Map customer notification timelines from DPAs and BAAs
   - Assess vendor/partner notification obligations (upstream and downstream)
   - Evaluate contractual penalties for notification delays
   - Review cooperation and information sharing obligations with customers
   - Assess cyber insurance notification requirements and timelines
   - Evaluate board and executive notification procedures (internal escalation)

8. **Notification decision tree:**
   - Assess existence and accuracy of breach classification criteria (severity levels)
   - Evaluate decision tree for determining notification obligations by breach type and jurisdiction
   - Review escalation procedures from detection to notification decision
   - Assess parallel notification workflow management (multiple jurisdictions simultaneously)
   - Evaluate legal hold and privilege considerations in breach investigation

9. **Template library and readiness:**
   - Assess existence of pre-drafted notification templates per jurisdiction
   - Evaluate template content compliance with jurisdiction-specific requirements
   - Review communication channel readiness (email, postal, website substitute notice, media)
   - Assess call center and response team readiness for individual notifications
   - Evaluate credit monitoring and identity protection service arrangements
   - Review regulatory filing templates and portal access (state AG portals, HHS portal)

10. **Write the artifact** to `.singularskills/compliance/<project>/01-assess/breach-notification.md` following the assessment template structure with:
    - **GDPR Notification** — 72-hour process, content, and data subject notification readiness
    - **US State Laws** — jurisdiction map, timelines, AG thresholds, and safe harbors
    - **HIPAA Notification** — individual, HHS, and media notification procedures (if applicable)
    - **PCI DSS Notification** — card brand and forensic investigation readiness (if applicable)
    - **NIS2 Notification** — early warning, incident notification, and final report procedures (if applicable)
    - **Contractual SLAs** — customer and vendor notification timeline compliance
    - **Decision Tree** — breach classification, determination workflow, and escalation
    - **Template Library** — pre-drafted templates and communication readiness
    - **Evidence Inventory** — existing evidence and evidence gaps
    - **Remediation Priorities** — ranked list of gaps to address

## Output

The breach notification assessment written to `.singularskills/compliance/<project>/01-assess/breach-notification.md`. Present a summary to the user highlighting:
- Number of jurisdictions mapped and notification timeline compliance readiness
- Fastest required notification timeline and current capability to meet it
- Template and communication readiness score — score = (Compliant + 0.5 × Partial) ÷ applicable step-9 readiness items (N/A excluded), as a percentage
- Top 3 gaps requiring remediation

**Record the run.** After you have written the artifact, append this line to `.singularskills/log.jsonl` (the `started` line of Prerequisites, with `"event":"finished"`): `{"ts":"<ISO timestamp>","skill":"compliance-breach-notification","workflow":"compliance","phase":1,"project":"<project>","event":"finished","artifact":"01-assess/","note":""}`.

Open the artifact with this frontmatter (`agent` is the agent you run in, or `unknown`; `gate` is `passed` when the gate ran clean and `skipped` under `--skip-checks`):

```yaml
---
skill: compliance-breach-notification
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

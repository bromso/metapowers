---
name: security-incident-communication
description: Draft incident communication templates — internal alerts, executive briefings, customer notices, regulator notifications, media statements and post-incident summaries — with an approval chain for each. Use when the user needs ready-to-send wording for telling staff, customers, regulators or the press about a security incident.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: security
  phase: 4
  artifact: 04-respond.md
---

# Incident Communication

Draft incident communication templates for "$ARGUMENTS" covering internal alerts, management briefings, customer notifications, regulatory notifications, media statements, and post-incident summaries.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"security-incident-communication","workflow":"security","phase":4,"project":"<project>","event":"skipped","artifact":"04-respond.md","note":"<reason or \"none given\">"}`.

## Prerequisites

**Part of a workflow.** This skill is phase 4 (Respond) of the NIST CSF workflow (`security`); cross-domain workflows run it too. First check `.singularskills/log.jsonl` for an open run for this project: a `run-started` line with `"project":"<project>"` and no later `run-finished` line for the same `workflow` and `project`. If one exists, the conductor is running you: continue here. Otherwise, if the user asked to start, run, continue or resume a process or workflow rather than this one step, do not continue here: invoke the `workflow` skill with the workflow the user asked for, or `security` when they named none, followed by `<project>`; it runs this phase in order, asks before it writes and records the run. Otherwise continue here: a later phase runs on its own, behind its gate.

Run this skill's gate before writing: `sh <this skill's folder>/scripts/gate.sh <project> <project root>`, where `<project root>` is the folder that contains `.singularskills/` (use `.` when you are already there). If it exits non-zero, stop and tell the user what it printed, unless `--skip-checks` was given (see Arguments). On a refusal, before you stop, append this line to `.singularskills/log.jsonl` (create the folder and file if missing): `{"ts":"<ISO timestamp>","skill":"security-incident-communication","workflow":"security","phase":4,"project":"<project>","event":"refused","artifact":"04-respond.md","note":"<what the gate printed>"}`. Once the gate has passed, or under `--skip-checks` once you have appended the `skipped` line, append this line before you start work: `{"ts":"<ISO timestamp>","skill":"security-incident-communication","workflow":"security","phase":4,"project":"<project>","event":"started","artifact":"04-respond.md","note":""}`.

Read `.singularskills/security/<project>/00-govern.md`. If this file does not exist, tell the user:

> Phase 0 (Govern) has not been completed for "<project>". Run a Govern skill first (e.g., `/security-security-policy <project>`), or use `--skip-checks` to bypass.

## Process

1. **Read context files:**
   - Read `references/incident-response-template.md` for communication workflow reference
   - Read `.singularskills/security/<project>/00-govern.md` for organizational context and compliance requirements

2. **Create internal alert template (security team):**
   - Subject line format: `[P{severity}] {incident_type} — {affected_system}`
   - Content: detection time, detection source, initial indicators, affected systems, immediate actions taken
   - Distribution: severity-based (P1: all security + engineering leads, P2: security team + affected service owners, P3–P4: on-call responder)
   - Format for both email and chat (Slack/Teams) channels

3. **Create management briefing template:**
   - Executive summary: what happened (1–2 sentences, no jargon)
   - Business impact: affected services, users impacted, revenue implications, regulatory exposure
   - Current status: containment state, investigation progress
   - Actions taken: what the team has done so far
   - Next steps: planned actions with estimated timelines
   - ETA for resolution or next update
   - Cadence: P1 every 30 minutes, P2 every 2 hours

4. **Create customer notification template:**
   - What happened: clear, honest description in plain language
   - What data/services were affected: specific and accurate
   - What we are doing: immediate actions and ongoing investigation
   - What customers should do: password changes, monitoring recommendations, precautionary steps
   - How to get help: dedicated support channel, FAQ link
   - Timeline: when it happened, when we detected it, when we contained it
   - Follow-up commitment: when to expect the next update

5. **Create regulatory notification template:**
   - **GDPR (72-hour requirement):** nature of breach, categories and approximate number of data subjects, likely consequences, measures taken or proposed
   - **State breach notification laws:** adapt per jurisdiction (California, New York, etc.)
   - **Sector-specific (HIPAA, PCI DSS, SOX):** format per applicable regulation
   - Include: incident timeline, data types affected, affected individuals count, remedial measures
   - Legal review checkpoint before sending

6. **Create media statement template (if needed):**
   - Brief factual statement: what we can confirm
   - What we are doing: response actions in progress
   - Commitment: to transparency and protecting affected parties
   - Redirect: to official channels for updates
   - Spokesperson designation and talking points
   - What NOT to say: avoid speculation, admissions of fault, or technical details

7. **Create post-incident summary template:**
   - Incident overview: type, severity, duration, impact
   - Timeline: detection to resolution with key milestones
   - Root cause: what caused the incident
   - Response effectiveness: what went well, what could improve
   - Corrective actions: with owners and deadlines
   - Lessons learned: key takeaways for the organization

8. **Define communication approval chain:**
   - Internal alerts: security team lead approves
   - Management briefings: incident commander approves
   - Customer notifications: legal + communications lead approve
   - Regulatory notifications: legal counsel + CISO approve
   - Media statements: CEO/executive sponsor + legal + PR approve
   - Define maximum approval time per severity to avoid delays

9. **Write the artifact** — append to `.singularskills/security/<project>/04-respond.md` under a `## Incident Communication` section. Create the file with a `# Respond — <project>` heading if it does not exist; if a `## Incident Communication` section already exists, replace only that section. The section contains:

   - **Internal Alert Template** — format and distribution rules
   - **Management Briefing Template** — executive summary format and cadence
   - **Customer Notification Template** — plain-language communication format
   - **Regulatory Notification Templates** — per applicable regulation
   - **Media Statement Template** — approved messaging framework
   - **Post-Incident Summary Template** — review and lessons learned format
   - **Approval Chain** — who approves each communication type and maximum approval time

## Output

The incident communication templates appended to `.singularskills/security/<project>/04-respond.md`. Present a summary to the user highlighting:
- Communication templates created per audience
- Regulatory notification requirements addressed
- Approval chain and maximum approval times
- Spokesperson designation and media guidance

**Record the run.** After you have written your section, append this line to `.singularskills/log.jsonl` (the `started` line of Prerequisites, with `"event":"finished"`): `{"ts":"<ISO timestamp>","skill":"security-incident-communication","workflow":"security","phase":4,"project":"<project>","event":"finished","artifact":"04-respond.md","note":""}`.

This artifact is shared by every skill of phase 4 (Respond). The frontmatter is written once, by whoever creates the file: if you create it, open it with the block below (`skill` is the phase title, `started` the time of that first write; `gate` is `passed` when the gate ran clean and `skipped` under `--skip-checks`); if it already exists, leave the block alone except to update `finished` and to set `gate` to the worst value among the sections (`skipped` over `passed`).

```yaml
---
skill: Respond
workflow: security
phase: 4
project: <project>
started: <ISO timestamp>
finished: <ISO timestamp>
agent: <the agent you run in, or "unknown">
gate: <passed|skipped>
---
```

Open your `## Incident Communication` section with one italic line, `*<skill name> · <ISO timestamp> · gate: <passed|skipped>*` (your skill name is `security-incident-communication`).

End your section with `### Decisions` and `### Open questions` (one level under your `## Incident Communication` heading, so the section stays one block), in this shape:

```markdown
### Decisions
- <what was chosen> — <why> — <what was rejected>

### Open questions
- <what the next phase or a reviewer must settle>
```

End the artifact with this paragraph, verbatim:

> **Not a penetration test or audit.** This artifact is generated analysis; validate findings against the live system and have material controls reviewed by a qualified security professional.

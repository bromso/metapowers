---
name: security-lessons-learned
description: Conduct a blameless review of one security incident — timeline with detection and response times, 5 Whys root cause, contributing factors, owned corrective actions at three levels, playbook updates. Use when an incident is resolved and the user wants to know why it happened and what to change. Not for patterns across many incidents; see /security-resilience-improvement.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: security
  phase: 4
  artifact: 04-respond.md
---

# Lessons Learned

Conduct a blameless post-incident review for "$ARGUMENTS" with incident timeline, root cause analysis, contributing factors, and corrective actions at three levels.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"security-lessons-learned","workflow":"security","phase":4,"project":"<project>","event":"skipped","artifact":"04-respond.md","note":"<reason or \"none given\">"}`.

## Prerequisites

Run this skill's gate before writing: `sh <this skill's folder>/scripts/gate.sh <project> <project root>`, where `<project root>` is the folder that contains `.singularskills/` (use `.` when you are already there). If it exits non-zero, stop and tell the user what it printed, unless `--skip-checks` was given (see Arguments).

Read `.singularskills/security/<project>/00-govern.md`. If this file does not exist, tell the user:

> Phase 0 (Govern) has not been completed for "<project>". Run a Govern skill first (e.g., `/security-security-policy <project>`), or use `--skip-checks` to bypass.

## Process

1. **Read context files:**
   - Read `references/incident-response-template.md` for post-incident review reference
   - Read `.singularskills/security/<project>/00-govern.md` for organizational context
   - Read `.singularskills/security/<project>/04-respond.md` if it exists, for incident response context

2. **Facilitate blameless post-incident review:**
   - Establish blameless culture ground rules: focus on systems and processes, not individuals
   - Gather all responders and stakeholders for input
   - Collect artifacts: logs, chat transcripts, alerts, tickets, and status updates from the incident
   - Set review scope: what happened, how we responded, what we can improve

3. **Build incident timeline (detection to resolution):**
   - Document each event chronologically with timestamps (UTC)
   - Key milestones: initial trigger, detection, first response, containment, eradication, recovery, closure
   - Note time gaps between milestones (detection delay, response delay, escalation delay)
   - Identify who did what at each stage
   - Calculate key metrics: time to detect (TTD), time to respond (TTR), time to contain (TTC), time to recover

4. **Apply 5 Whys for root cause analysis:**
   - Start with the incident symptom and ask "Why?" iteratively
   - Continue until reaching the systemic root cause (typically 3–5 levels deep)
   - Document each level with supporting evidence
   - Identify both the technical root cause and the process root cause
   - Validate root cause: if this cause were fixed, would the incident have been prevented?

5. **Identify contributing factors:**
   - **Process factors** — missing runbooks, unclear escalation paths, insufficient monitoring coverage
   - **Technology factors** — misconfiguration, unpatched vulnerability, inadequate tooling, missing automation
   - **People factors** — insufficient training, knowledge gaps, fatigue, unclear responsibilities (not blame)
   - Map contributing factors to the timeline to show where each factor increased severity or delayed response

6. **Define corrective actions at three levels:**
   - **Immediate fix** — address the specific vulnerability or gap that caused this incident (patch, config change, access revocation)
   - **Prevent recurrence** — implement controls to prevent the same type of incident (automated scanning, additional monitoring, policy update)
   - **Systemic improvement** — address the underlying organizational or architectural weakness (security architecture redesign, training program, process overhaul)
   - Each action must have: description, owner, deadline, priority, and success criteria

7. **Assign owners and track completion:**
   - Assign each corrective action to a named owner
   - Set realistic deadlines (immediate fixes: 1 week, prevent recurrence: 1 month, systemic: 1 quarter)
   - Define tracking mechanism (ticket system, review meetings)
   - Schedule follow-up review to verify completion
   - Escalate overdue actions

8. **Update playbooks based on findings:**
   - Identify gaps in existing playbooks revealed by the incident
   - Add new detection rules for indicators discovered during investigation
   - Update communication templates if communication was ineffective
   - Add decision tree entries for scenarios encountered
   - Document new forensic data sources identified during investigation

9. **Write the artifact** — append to `.singularskills/security/<project>/04-respond.md` under a `## Lessons Learned` section. Create the file with a `# Respond — <project>` heading if it does not exist; if a `## Lessons Learned` section already exists, replace only that section. The section contains:

   - **Incident Summary** — type, severity, duration, and impact
   - **Timeline** — chronological event log with key metrics (TTD, TTR, TTC)
   - **Root Cause Analysis** — 5 Whys analysis with supporting evidence
   - **Contributing Factors** — process, technology, and people factors
   - **Corrective Actions** — three-level action plan with owners and deadlines
   - **Playbook Updates** — changes to existing playbooks and procedures
   - **Metrics** — incident response performance metrics and trends

## Output

The lessons learned review appended to `.singularskills/security/<project>/04-respond.md`. Present a summary to the user highlighting:
- Root cause identified through 5 Whys analysis
- Key contributing factors by category
- Corrective actions at all three levels with owners
- Playbook and process updates recommended

**Record the run.** Append each of these events to `.singularskills/log.jsonl` as one line (create the folder and file if missing):

- Before you start work (once the gate has passed or `--skip-checks` was given): `{"ts":"<ISO timestamp>","skill":"security-lessons-learned","workflow":"security","phase":4,"project":"<project>","event":"started","artifact":"04-respond.md","note":""}`
- After you have written your section: the same line with `"event":"finished"`.
- If the gate refused and the user did not bypass it: the same line with `"event":"refused"` and `"note"` set to what the gate printed, instead of the other two; then stop.

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

Open your `## Lessons Learned` section with one italic line, `*<skill name> · <ISO timestamp> · gate: <passed|skipped>*` (your skill name is `security-lessons-learned`).

End your section with `### Decisions` and `### Open questions` (one level under your `## Lessons Learned` heading, so the section stays one block), in this shape:

```markdown
### Decisions
- <what was chosen> — <why> — <what was rejected>

### Open questions
- <what the next phase or a reviewer must settle>
```

End the artifact with this paragraph, verbatim:

> **Not a penetration test or audit.** This artifact is generated analysis; validate findings against the live system and have material controls reviewed by a qualified security professional.

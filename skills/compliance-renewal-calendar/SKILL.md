---
name: compliance-renewal-calendar
description: Maintain a 12-month forward calendar of certification expiries, renewals, audit windows, surveillance visits and evidence deadlines, with workload peaks. Use when the user asks when a certification expires or is up for renewal, or wants to plan the compliance year so audits do not collide. Not for certification status and obligations; see /compliance-certification-tracker.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: compliance
  phase: 4
  artifact: 04-monitor.md
---

# Renewal Calendar

Maintain a certification and compliance renewal calendar for "$ARGUMENTS" aggregating all certification dates, audit windows, and renewal deadlines into a unified 12-month forward view.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"compliance-renewal-calendar","workflow":"compliance","phase":4,"project":"<project>","event":"skipped","artifact":"04-monitor.md","note":"<reason or \"none given\">"}`.

## Prerequisites

Run this skill's gate before writing: `sh <this skill's folder>/scripts/gate.sh <project> <project root>`, where `<project root>` is the folder that contains `.singularskills/` (use `.` when you are already there). If it exits non-zero, stop and tell the user what it printed, unless `--skip-checks` was given (see Arguments). On a refusal, before you stop, append this line to `.singularskills/log.jsonl` (create the folder and file if missing): `{"ts":"<ISO timestamp>","skill":"compliance-renewal-calendar","workflow":"compliance","phase":4,"project":"<project>","event":"refused","artifact":"04-monitor.md","note":"<what the gate printed>"}`. Once the gate has passed, or under `--skip-checks` once you have appended the `skipped` line, append this line before you start work: `{"ts":"<ISO timestamp>","skill":"compliance-renewal-calendar","workflow":"compliance","phase":4,"project":"<project>","event":"started","artifact":"04-monitor.md","note":""}`.

Read `.singularskills/compliance/<project>/00-scope.md`. If this file does not exist, tell the user:

> Phase 0 (Scope) has not been completed for "<project>". Run `/compliance-regulatory-landscape <project>` first, or use `--skip-checks` to bypass.

## Process

1. **Read context files:**
   - Read `references/grc-lifecycle-guide.md` for GRC methodology reference
   - Read `.singularskills/compliance/<project>/00-scope.md` for scope and applicable regulations
   - Read `.singularskills/compliance/<project>/03-certify.md` for certification status and dates
   - Read `.singularskills/compliance/<project>/04-monitor.md` for current monitoring cadence

2. **Aggregate dates:**
   - Certification expiry dates for all active certifications
   - Audit window dates (start and end)
   - Surveillance audit dates (ISO and similar standards)
   - Regulatory filing deadlines (annual reports, registrations, notifications)
   - Management review due dates
   - Internal audit dates
   - Evidence collection deadlines

3. **Create 12-month forward calendar:**
   - Month-by-month view of all compliance activities
   - Identify overlapping audit periods — consolidation opportunities to reduce disruption
   - Set preparation start dates (audit prep typically 2-3 months before audit)
   - Identify resource conflicts (multiple audits in same period)
   - Mark critical deadlines vs. flexible dates

4. **Annual compliance planning rhythm:**
   - Q1: Annual risk assessment, policy reviews, training planning
   - Q2: Mid-year control testing, evidence collection review
   - Q3: Audit preparation, evidence packaging, mock audits
   - Q4: Year-end assessments, renewal planning, budget for next year
   - Adapt rhythm to organization's fiscal year and audit schedule

5. **Resource planning:**
   - Identify months with highest compliance workload
   - Flag periods needing additional resources (internal or external)
   - Plan for audit firm availability (book early for peak audit seasons)
   - Budget allocation by quarter for compliance activities

6. **Write the artifact** — append to `.singularskills/compliance/<project>/04-monitor.md` under a `## Renewal Calendar` section. Create the file with a `# Monitor — <project>` heading if it does not exist; if a `## Renewal Calendar` section already exists, replace only that section. The section contains:
   - **12-Month Calendar** — month-by-month compliance activities
   - **Certification Renewals** — renewal dates and preparation windows
   - **Audit Schedule** — external and internal audit dates
   - **Consolidation Opportunities** — overlapping audits that can be combined
   - **Resource Forecast** — monthly compliance workload estimate
   - **Annual Compliance Rhythm** — quarterly planning cycle

## Output

The renewal calendar appended to `.singularskills/compliance/<project>/04-monitor.md`. Present a summary to the user highlighting:
- Upcoming renewals within 6 months
- Identified consolidation opportunities
- Months with highest compliance workload
- Recommended preparation start dates for upcoming audits

**Record the run.** After you have written your section, append this line to `.singularskills/log.jsonl` (the `started` line of Prerequisites, with `"event":"finished"`): `{"ts":"<ISO timestamp>","skill":"compliance-renewal-calendar","workflow":"compliance","phase":4,"project":"<project>","event":"finished","artifact":"04-monitor.md","note":""}`.

This artifact is shared by every skill of phase 4 (Monitor). The frontmatter is written once, by whoever creates the file: if you create it, open it with the block below (`skill` is the phase title, `started` the time of that first write; `gate` is `passed` when the gate ran clean and `skipped` under `--skip-checks`); if it already exists, leave the block alone except to update `finished` and to set `gate` to the worst value among the sections (`skipped` over `passed`).

```yaml
---
skill: Monitor
workflow: compliance
phase: 4
project: <project>
started: <ISO timestamp>
finished: <ISO timestamp>
agent: <the agent you run in, or "unknown">
gate: <passed|skipped>
---
```

Open your `## Renewal Calendar` section with one italic line, `*<skill name> · <ISO timestamp> · gate: <passed|skipped>*` (your skill name is `compliance-renewal-calendar`).

End your section with `### Decisions` and `### Open questions` (one level under your `## Renewal Calendar` heading, so the section stays one block), in this shape:

```markdown
### Decisions
- <what was chosen> — <why> — <what was rejected>

### Open questions
- <what the next phase or a reviewer must settle>
```

End the artifact with this paragraph, verbatim:

> **Not legal or audit advice.** This artifact supports preparation for compliance work; certification, attestation and regulatory conclusions require a qualified auditor or counsel.

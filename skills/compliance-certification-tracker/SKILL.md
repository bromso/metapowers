---
name: compliance-certification-tracker
description: Track the certifications and attestations a business holds — status, validity, surveillance audits, owners and between-audit obligations — in a RAG register. Use when the user asks what certifications and attestations they hold, their current status, or what obligations they owe between audits. Not for scheduling renewals and audit dates; see /compliance-renewal-calendar.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: compliance
  phase: 3
  artifact: 03-certify.md
---

# Certification Tracker

Track certification status, validity periods, and renewal dates for "$ARGUMENTS" to ensure continuous compliance and timely renewal of all certifications.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"compliance-certification-tracker","workflow":"compliance","phase":3,"project":"<project>","event":"skipped","artifact":"03-certify.md","note":"<reason or \"none given\">"}`.

## Prerequisites

Run this skill's gate before writing: `sh <this skill's folder>/scripts/gate.sh <project> <project root>`, where `<project root>` is the folder that contains `.singularskills/` (use `.` when you are already there). If it exits non-zero, stop and tell the user what it printed, unless `--skip-checks` was given (see Arguments). On a refusal, before you stop, append this line to `.singularskills/log.jsonl` (create the folder and file if missing): `{"ts":"<ISO timestamp>","skill":"compliance-certification-tracker","workflow":"compliance","phase":3,"project":"<project>","event":"refused","artifact":"03-certify.md","note":"<what the gate printed>"}`. Once the gate has passed, or under `--skip-checks` once you have appended the `skipped` line, append this line before you start work: `{"ts":"<ISO timestamp>","skill":"compliance-certification-tracker","workflow":"compliance","phase":3,"project":"<project>","event":"started","artifact":"03-certify.md","note":""}`.

Read `.singularskills/compliance/<project>/00-scope.md`. If this file does not exist, tell the user:

> Phase 0 (Scope) has not been completed for "<project>". Run `/compliance-regulatory-landscape <project>` first, or use `--skip-checks` to bypass.

## Process

1. **Read context files:**
   - Read `references/grc-lifecycle-guide.md` for GRC methodology reference
   - Read `.singularskills/compliance/<project>/00-scope.md` for scope and applicable regulations
   - Read `.singularskills/compliance/<project>/03-certify.md` for audit readiness and certification status

2. **Create certification register:**
   - For each regulation/standard: record certification status (not started, in progress, certified, expired)
   - Certificate date — when certification was granted
   - Expiry date — when certification expires
   - Renewal lead time — how far in advance to begin renewal process
   - Surveillance audit dates — for standards requiring periodic surveillance (ISO)
   - Renewal requirements — what is needed for renewal vs. initial certification
   - Assigned owner — who is responsible for maintaining this certification

3. **Maintenance requirements:**
   - Document between-audit requirements per certification
   - Continuous monitoring evidence needed
   - Management reviews required (frequency, participants)
   - Internal audit requirements
   - Corrective action tracking from previous audits

4. **Calendar and reminders:**
   - Set calendar reminders for: renewal start dates, surveillance audits, evidence collection deadlines, management review due dates
   - Identify overlapping audit periods — consolidation opportunities
   - Flag certifications approaching expiry within 6 months

5. **Status dashboard:**
   - Create at-a-glance view of all certification statuses
   - RAG (Red/Amber/Green) rating per certification
   - Days until next audit or renewal
   - Outstanding actions from previous audits

6. **Write the artifact** — append to `.singularskills/compliance/<project>/03-certify.md` under a `## Certification Tracker` section. Create the file with a `# Certify — <project>` heading if it does not exist; if a `## Certification Tracker` section already exists, replace only that section. The section contains:
   - **Certification Register** — table with status, dates, owners per certification
   - **Maintenance Requirements** — per-certification ongoing obligations
   - **Calendar** — upcoming audit dates, renewals, and preparation windows
   - **Status Dashboard** — RAG overview of all certifications
   - **Action Items** — outstanding items from previous audits

## Output

The certification tracker appended to `.singularskills/compliance/<project>/03-certify.md`. Present a summary to the user highlighting:
- Current certification status across all regulations
- Upcoming renewal dates within 12 months
- Certifications at risk (approaching expiry or with outstanding actions)
- Recommended preparation start dates

**Record the run.** After you have written your section, append this line to `.singularskills/log.jsonl` (the `started` line of Prerequisites, with `"event":"finished"`): `{"ts":"<ISO timestamp>","skill":"compliance-certification-tracker","workflow":"compliance","phase":3,"project":"<project>","event":"finished","artifact":"03-certify.md","note":""}`.

This artifact is shared by every skill of phase 3 (Certify). The frontmatter is written once, by whoever creates the file: if you create it, open it with the block below (`skill` is the phase title, `started` the time of that first write; `gate` is `passed` when the gate ran clean and `skipped` under `--skip-checks`); if it already exists, leave the block alone except to update `finished` and to set `gate` to the worst value among the sections (`skipped` over `passed`).

```yaml
---
skill: Certify
workflow: compliance
phase: 3
project: <project>
started: <ISO timestamp>
finished: <ISO timestamp>
agent: <the agent you run in, or "unknown">
gate: <passed|skipped>
---
```

Open your `## Certification Tracker` section with one italic line, `*<skill name> · <ISO timestamp> · gate: <passed|skipped>*` (your skill name is `compliance-certification-tracker`).

End your section with `### Decisions` and `### Open questions` (one level under your `## Certification Tracker` heading, so the section stays one block), in this shape:

```markdown
### Decisions
- <what was chosen> — <why> — <what was rejected>

### Open questions
- <what the next phase or a reviewer must settle>
```

End the artifact with this paragraph, verbatim:

> **Not legal or audit advice.** This artifact supports preparation for compliance work; certification, attestation and regulatory conclusions require a qualified auditor or counsel.

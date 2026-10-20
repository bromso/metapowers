---
description: Track certification status, validity periods, and renewal dates
---

# Certification Tracker

Track certification status, validity periods, and renewal dates for "$ARGUMENTS" to ensure continuous compliance and timely renewal of all certifications.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.metapowers/compliance/<project>/skip-log.md`: `- <ISO timestamp> — <skill name> skipped prerequisite check for <artifact file> — reason: <reason or "none given">`.

## Prerequisites

Read `.metapowers/compliance/<project>/00-scope.md`. If this file does not exist, tell the user:

> Phase 0 (Scope) has not been completed for "<project>". Run `/compliance:regulatory-landscape <project>` first, or use `--skip-checks` to bypass.

## Process

1. **Read context files:**
   - Read `${CLAUDE_PLUGIN_ROOT}/shared/grc-lifecycle-guide.md` for GRC methodology reference
   - Read `.metapowers/compliance/<project>/00-scope.md` for scope and applicable regulations
   - Read `.metapowers/compliance/<project>/03-certify.md` for audit readiness and certification status

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

6. **Write the artifact** — append to `.metapowers/compliance/<project>/03-certify.md` under a `## Certification Tracker` section. Create the file with a `# Certify — <project>` heading if it does not exist; if a `## Certification Tracker` section already exists, replace only that section. The section contains:
   - **Certification Register** — table with status, dates, owners per certification
   - **Maintenance Requirements** — per-certification ongoing obligations
   - **Calendar** — upcoming audit dates, renewals, and preparation windows
   - **Status Dashboard** — RAG overview of all certifications
   - **Action Items** — outstanding items from previous audits

## Output

The certification tracker appended to `.metapowers/compliance/<project>/03-certify.md`. Present a summary to the user highlighting:
- Current certification status across all regulations
- Upcoming renewal dates within 12 months
- Certifications at risk (approaching expiry or with outstanding actions)
- Recommended preparation start dates

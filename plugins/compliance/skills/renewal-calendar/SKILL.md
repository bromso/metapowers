---
name: renewal-calendar
description: Maintain a 12-month forward compliance calendar of renewals, audit windows, surveillance visits and evidence deadlines, showing workload peaks and chances to consolidate audits. Use when the user wants to plan the compliance year, see which audits fall in which month, or avoid two audits colliding.
argument-hint: "[project] [--skip-checks]"
---

# Renewal Calendar

Maintain a certification and compliance renewal calendar for "$ARGUMENTS" aggregating all certification dates, audit windows, and renewal deadlines into a unified 12-month forward view.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.metapowers/compliance/<project>/skip-log.md`: `- <ISO timestamp> — <skill name> skipped prerequisite check for <artifact file> — reason: <reason or "none given">`.

## Prerequisites

Read `.metapowers/compliance/<project>/00-scope.md`. If this file does not exist, tell the user:

> Phase 0 (Scope) has not been completed for "<project>". Run `/compliance:regulatory-landscape <project>` first, or use `--skip-checks` to bypass.

## Process

1. **Read context files:**
   - Read `${CLAUDE_PLUGIN_ROOT}/shared/grc-lifecycle-guide.md` for GRC methodology reference
   - Read `.metapowers/compliance/<project>/00-scope.md` for scope and applicable regulations
   - Read `.metapowers/compliance/<project>/03-certify.md` for certification status and dates
   - Read `.metapowers/compliance/<project>/04-monitor.md` for current monitoring cadence

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

6. **Write the artifact** — append to `.metapowers/compliance/<project>/04-monitor.md` under a `## Renewal Calendar` section. Create the file with a `# Monitor — <project>` heading if it does not exist; if a `## Renewal Calendar` section already exists, replace only that section. The section contains:
   - **12-Month Calendar** — month-by-month compliance activities
   - **Certification Renewals** — renewal dates and preparation windows
   - **Audit Schedule** — external and internal audit dates
   - **Consolidation Opportunities** — overlapping audits that can be combined
   - **Resource Forecast** — monthly compliance workload estimate
   - **Annual Compliance Rhythm** — quarterly planning cycle

## Output

The renewal calendar appended to `.metapowers/compliance/<project>/04-monitor.md`. Present a summary to the user highlighting:
- Upcoming renewals within 6 months
- Identified consolidation opportunities
- Months with highest compliance workload
- Recommended preparation start dates for upcoming audits

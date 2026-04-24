---
description: Maintain certification and compliance renewal calendar
---

# Renewal Calendar

Maintain a certification and compliance renewal calendar for "$ARGUMENTS" aggregating all certification dates, audit windows, and renewal deadlines into a unified 12-month forward view.

## Prerequisites

Read `.metapowers/compliance/$ARGUMENTS/00-scope.md`. If this file does not exist, tell the user:

> Phase 0 (Scope) has not been completed for "$ARGUMENTS". Run `/compliance:regulatory-landscape $ARGUMENTS` first, or use `--skip-checks` to bypass.

If `--skip-checks` is present in $ARGUMENTS, skip this check.

## Process

1. **Read context files:**
   - Read `plugins/compliance/shared/grc-lifecycle-guide.md` for GRC methodology reference
   - Read `.metapowers/compliance/$ARGUMENTS/00-scope.md` for scope and applicable regulations
   - Read `.metapowers/compliance/$ARGUMENTS/03-certify.md` for certification status and dates
   - Read `.metapowers/compliance/$ARGUMENTS/04-monitor.md` for current monitoring cadence

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

6. **Write the artifact** to `.metapowers/compliance/$ARGUMENTS/04-monitor.md` (append to existing) with sections:
   - **12-Month Calendar** — month-by-month compliance activities
   - **Certification Renewals** — renewal dates and preparation windows
   - **Audit Schedule** — external and internal audit dates
   - **Consolidation Opportunities** — overlapping audits that can be combined
   - **Resource Forecast** — monthly compliance workload estimate
   - **Annual Compliance Rhythm** — quarterly planning cycle

## Output

The renewal calendar appended to `.metapowers/compliance/$ARGUMENTS/04-monitor.md`. Present a summary to the user highlighting:
- Upcoming renewals within 6 months
- Identified consolidation opportunities
- Months with highest compliance workload
- Recommended preparation start dates for upcoming audits

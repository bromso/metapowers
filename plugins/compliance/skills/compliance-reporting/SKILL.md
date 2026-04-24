---
description: Generate compliance status reports for leadership and customers
---

# Compliance Reporting

Generate compliance status reports for "$ARGUMENTS" at three levels — executive summary, detailed operational, and customer-facing — to communicate compliance posture to all stakeholders.

## Prerequisites

Read `.metapowers/compliance/$ARGUMENTS/00-scope.md`. If this file does not exist, tell the user:

> Phase 0 (Scope) has not been completed for "$ARGUMENTS". Run `/compliance:regulatory-landscape $ARGUMENTS` first, or use `--skip-checks` to bypass.

If `--skip-checks` is present in $ARGUMENTS, skip this check.

## Process

1. **Read context files:**
   - Read `plugins/compliance/shared/grc-lifecycle-guide.md` for GRC methodology reference
   - Read `.metapowers/compliance/$ARGUMENTS/00-scope.md` for scope and applicable regulations
   - Read `.metapowers/compliance/$ARGUMENTS/02-remediate.md` for gap and remediation status
   - Read `.metapowers/compliance/$ARGUMENTS/03-certify.md` for certification status
   - Read `.metapowers/compliance/$ARGUMENTS/04-monitor.md` for monitoring and calendar data

2. **Executive summary report:**
   - Overall compliance score (weighted across all regulations)
   - RAG (Red/Amber/Green) status per regulation
   - Key risks requiring leadership attention
   - Resource asks — budget, headcount, tools
   - Progress since last report (trend data)
   - Upcoming milestones and deadlines

3. **Detailed operational report:**
   - Per-regulation status with control-level detail
   - Open findings with aging and remediation status
   - Evidence collection status and gaps
   - Audit preparation progress
   - Team workload and capacity
   - Detailed risk register with mitigations

4. **Customer-facing report:**
   - Trust page content — certifications held, security overview
   - SOC 2 report summary (bridge letter if report is pending)
   - Compliance certifications held with validity dates
   - Security and privacy commitments
   - Sub-processor list and data processing transparency
   - FAQ for common customer security questions

5. **Reporting cadence:**
   - Monthly: operational report to security/compliance team
   - Quarterly: executive summary to leadership/board
   - Annually: strategic compliance review
   - On-demand: customer-facing reports for sales enablement
   - Define report distribution lists and access controls

6. **Trend analysis:**
   - Compliance posture improvement over time
   - Finding closure rate trends
   - Time-to-remediate trends
   - Audit finding trends (fewer/more findings each cycle)

7. **Write the artifact** to `.metapowers/compliance/$ARGUMENTS/04-monitor.md` (append to existing) with sections:
   - **Executive Summary Template** — leadership-ready compliance overview
   - **Operational Report Template** — detailed compliance operations status
   - **Customer-Facing Report Template** — trust page and customer communication content
   - **Reporting Cadence** — schedule, audience, and distribution
   - **Trend Data** — compliance posture trends and metrics

## Output

The compliance reporting framework appended to `.metapowers/compliance/$ARGUMENTS/04-monitor.md`. Present a summary to the user highlighting:
- Overall compliance score
- RAG status across all regulations
- Key items for leadership attention
- Customer-facing compliance highlights

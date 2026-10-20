---
name: compliance-reporting
description: Generate compliance status reports at three levels — an executive RAG summary, a detailed operational report and customer-facing trust content — with a reporting cadence and trends. Use when the user needs a compliance update for leadership or the board, a monthly status report, or trust page content for customers.
argument-hint: "[project] [--skip-checks]"
---

# Compliance Reporting

Generate compliance status reports for "$ARGUMENTS" at three levels — executive summary, detailed operational, and customer-facing — to communicate compliance posture to all stakeholders.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.metapowers/compliance/<project>/skip-log.md`: `- <ISO timestamp> — <skill name> skipped prerequisite check for <artifact file> — reason: <reason or "none given">`.

## Prerequisites

Read `.metapowers/compliance/<project>/00-scope.md`. If this file does not exist, tell the user:

> Phase 0 (Scope) has not been completed for "<project>". Run `/compliance:regulatory-landscape <project>` first, or use `--skip-checks` to bypass.

## Process

1. **Read context files:**
   - Read `${CLAUDE_PLUGIN_ROOT}/shared/grc-lifecycle-guide.md` for GRC methodology reference
   - Read `.metapowers/compliance/<project>/00-scope.md` for scope and applicable regulations
   - Read `.metapowers/compliance/<project>/01-assess/*.md` for per-regulation assessment results and scores
   - Read `.metapowers/compliance/<project>/02-remediate.md` for gap and remediation status
   - Read `.metapowers/compliance/<project>/03-certify.md` for certification status
   - Read `.metapowers/compliance/<project>/04-monitor.md` for monitoring and calendar data

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

7. **Write the artifact** — append to `.metapowers/compliance/<project>/04-monitor.md` under a `## Compliance Reporting` section. Create the file with a `# Monitor — <project>` heading if it does not exist; if a `## Compliance Reporting` section already exists, replace only that section. The section contains:
   - **Executive Summary Template** — leadership-ready compliance overview
   - **Operational Report Template** — detailed compliance operations status
   - **Customer-Facing Report Template** — trust page and customer communication content
   - **Reporting Cadence** — schedule, audience, and distribution
   - **Trend Data** — compliance posture trends and metrics

## Output

The compliance reporting framework appended to `.metapowers/compliance/<project>/04-monitor.md`. Present a summary to the user highlighting:
- Overall compliance score — the weighted score computed as in `/compliance:compliance-score` (each regulation's score from its `01-assess/` artifact; weights from `00-scope.md`, else equal)
- RAG status across all regulations
- Key items for leadership attention
- Customer-facing compliance highlights

End the artifact with this paragraph, verbatim:

> **Not legal or audit advice.** This artifact supports preparation for compliance work; certification, attestation and regulatory conclusions require a qualified auditor or counsel.

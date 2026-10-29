---
name: compliance-compliance-reporting
description: Generate compliance status reports at three levels — an executive RAG summary, a detailed operational report and customer-facing trust content — with a reporting cadence and trends. Use when the user needs a compliance update for leadership or the board, a monthly status report, or trust page content for customers.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: compliance
  phase: 4
  artifact: 04-monitor.md
---

# Compliance Reporting

Generate compliance status reports for "$ARGUMENTS" at three levels — executive summary, detailed operational, and customer-facing — to communicate compliance posture to all stakeholders.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"compliance-compliance-reporting","workflow":"compliance","phase":4,"project":"<project>","event":"skipped","artifact":"04-monitor.md","note":"<reason or \"none given\">"}`.

## Prerequisites

Run this skill's gate before writing: `sh <this skill's folder>/scripts/gate.sh <project> <project root>`, where `<project root>` is the folder that contains `.singularskills/` (use `.` when you are already there). If it exits non-zero, stop and tell the user what it printed, unless `--skip-checks` was given (see Arguments). On a refusal, before you stop, append this line to `.singularskills/log.jsonl` (create the folder and file if missing): `{"ts":"<ISO timestamp>","skill":"compliance-compliance-reporting","workflow":"compliance","phase":4,"project":"<project>","event":"refused","artifact":"04-monitor.md","note":"<what the gate printed>"}`. Once the gate has passed, or under `--skip-checks` once you have appended the `skipped` line, append this line before you start work: `{"ts":"<ISO timestamp>","skill":"compliance-compliance-reporting","workflow":"compliance","phase":4,"project":"<project>","event":"started","artifact":"04-monitor.md","note":""}`.

Read `.singularskills/compliance/<project>/00-scope.md`. If this file does not exist, tell the user:

> Phase 0 (Scope) has not been completed for "<project>". Run `/compliance-regulatory-landscape <project>` first, or use `--skip-checks` to bypass.

## Process

1. **Read context files:**
   - Read `references/grc-lifecycle-guide.md` for GRC methodology reference
   - Read `.singularskills/compliance/<project>/00-scope.md` for scope and applicable regulations
   - Read `.singularskills/compliance/<project>/01-assess/*.md` for per-regulation assessment results and scores
   - Read `.singularskills/compliance/<project>/02-remediate.md` for gap and remediation status
   - Read `.singularskills/compliance/<project>/03-certify.md` for certification status
   - Read `.singularskills/compliance/<project>/04-monitor.md` for monitoring and calendar data

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

7. **Write the artifact** — append to `.singularskills/compliance/<project>/04-monitor.md` under a `## Compliance Reporting` section. Create the file with a `# Monitor — <project>` heading if it does not exist; if a `## Compliance Reporting` section already exists, replace only that section. The section contains:
   - **Executive Summary Template** — leadership-ready compliance overview
   - **Operational Report Template** — detailed compliance operations status
   - **Customer-Facing Report Template** — trust page and customer communication content
   - **Reporting Cadence** — schedule, audience, and distribution
   - **Trend Data** — compliance posture trends and metrics

## Output

The compliance reporting framework appended to `.singularskills/compliance/<project>/04-monitor.md`. Present a summary to the user highlighting:
- Overall compliance score — the weighted score computed as in `/compliance-compliance-score` (each regulation's score from its `01-assess/` artifact; weights from `00-scope.md`, else equal)
- RAG status across all regulations
- Key items for leadership attention
- Customer-facing compliance highlights

**Record the run.** After you have written your section, append this line to `.singularskills/log.jsonl` (the `started` line of Prerequisites, with `"event":"finished"`): `{"ts":"<ISO timestamp>","skill":"compliance-compliance-reporting","workflow":"compliance","phase":4,"project":"<project>","event":"finished","artifact":"04-monitor.md","note":""}`.

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

Open your `## Compliance Reporting` section with one italic line, `*<skill name> · <ISO timestamp> · gate: <passed|skipped>*` (your skill name is `compliance-compliance-reporting`).

End your section with `### Decisions` and `### Open questions` (one level under your `## Compliance Reporting` heading, so the section stays one block), in this shape:

```markdown
### Decisions
- <what was chosen> — <why> — <what was rejected>

### Open questions
- <what the next phase or a reviewer must settle>
```

End the artifact with this paragraph, verbatim:

> **Not legal or audit advice.** This artifact supports preparation for compliance work; certification, attestation and regulatory conclusions require a qualified auditor or counsel.

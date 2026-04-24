---
description: Identify and implement improvements from incidents and tests
---

# Resilience Improvement

Identify and implement resilience improvements for "$ARGUMENTS" by aggregating findings from incidents, DR tests, and penetration tests, prioritizing by risk reduction, and tracking implementation progress.

## Prerequisites

Read `.metapowers/security/$ARGUMENTS/00-govern.md`. If this file does not exist, tell the user:

> Phase 0 (Govern) has not been completed for "$ARGUMENTS". Run a Govern skill first (e.g., `/security:security-policy $ARGUMENTS`), or use `--skip-checks` to bypass.

If `--skip-checks` is present in $ARGUMENTS, skip this check and log to `.metapowers/security/$ARGUMENTS/skip-log.md`.

## Process

1. **Read context files:**
   - Read `.metapowers/security/$ARGUMENTS/00-govern.md` for organizational context and risk appetite
   - Read `.metapowers/security/$ARGUMENTS/04-respond.md` if it exists, for incident response findings
   - Read `.metapowers/security/$ARGUMENTS/05-recover.md` if it exists, for recovery test findings

2. **Aggregate findings from all sources:**
   - **Incidents** — corrective actions from post-incident reviews, root causes, contributing factors
   - **DR tests** — failures and gaps discovered during disaster recovery exercises
   - **Penetration tests** — vulnerabilities found, exploitation paths, remediation recommendations
   - **Tabletop exercises** — process gaps, communication failures, unclear responsibilities
   - **Audit findings** — compliance gaps, control deficiencies, auditor recommendations
   - Normalize findings into a common format: finding ID, source, description, severity, affected area

3. **Identify patterns and systemic weaknesses:**
   - Group findings by category (access control, monitoring, configuration, process, training)
   - Identify recurring themes across multiple sources (same weakness found by incident AND pen test)
   - Detect trends over time (are certain categories improving or degrading?)
   - Identify systemic issues vs. one-off problems
   - Map weaknesses to NIST CSF functions (Identify, Protect, Detect, Respond, Recover)

4. **Prioritize improvements by risk reduction and effort:**
   - **Risk reduction** — how much does this improvement reduce overall risk? (high/medium/low)
   - **Effort** — how much time and resources are required? (high/medium/low)
   - **Quick wins** — high risk reduction, low effort (prioritize first)
   - **Strategic investments** — high risk reduction, high effort (plan and budget)
   - **Nice-to-haves** — low risk reduction, low effort (batch with other work)
   - **Defer** — low risk reduction, high effort (reconsider later)
   - Use risk matrix to visualize prioritization

5. **Create improvement roadmap:**
   - **Immediate (0–30 days)** — quick wins and critical fixes
   - **Short-term (1–3 months)** — significant improvements requiring moderate effort
   - **Medium-term (3–6 months)** — strategic investments and architectural changes
   - **Long-term (6–12 months)** — systemic improvements and cultural changes
   - Assign each improvement: owner, deadline, resources needed, success criteria, dependencies

6. **Track implementation:**
   - Define tracking mechanism (project management tool, security dashboard, regular review meetings)
   - Set review cadence (monthly for active items, quarterly for roadmap review)
   - Escalate blocked or overdue items
   - Report progress to security leadership and stakeholders

7. **Measure improvement:**
   - **MTTR (Mean Time to Recover)** — track trend over time (should decrease)
   - **Incident frequency** — track by category (should decrease for addressed categories)
   - **Recovery success rate** — percentage of DR tests that meet RTO/RPO (should increase)
   - **Vulnerability remediation time** — time from discovery to fix (should decrease)
   - **Pen test findings** — number and severity trend over successive tests (should decrease)
   - Define baseline measurements and improvement targets

8. **Integrate findings into security strategy:**
   - Update risk register with new risks identified
   - Update security policies and standards based on lessons learned
   - Feed improvements back into security training program
   - Update threat model with newly discovered attack vectors
   - Inform budget planning with quantified risk reduction data

9. **Write the artifact** to `.metapowers/security/$ARGUMENTS/05-recover.md` with heading:

   ## Resilience Improvement

   Include sections:
   - **Findings Aggregation** — normalized findings from all sources
   - **Pattern Analysis** — recurring themes, trends, and systemic weaknesses
   - **Prioritization Matrix** — risk reduction vs. effort for each improvement
   - **Improvement Roadmap** — phased plan with owners and deadlines
   - **Metrics and Tracking** — KPIs, baselines, and targets
   - **Strategy Integration** — how findings feed back into security program

## Output

The resilience improvement plan written to `.metapowers/security/$ARGUMENTS/05-recover.md`. Present a summary to the user highlighting:
- Key patterns and systemic weaknesses identified
- Quick wins prioritized for immediate action
- Improvement roadmap with timeline and owners
- Metrics defined for measuring progress

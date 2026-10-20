---
name: controls
description: Design internal controls — segregation of duties, approvals, reconciliations, reviews — mapped to the entity's error and fraud risks in a control matrix with owners. Use when the user worries about errors or fraud in cash, payroll or reporting and wants controls to prevent or catch them. Not for assessing SOX, FINRA or SEC compliance; see /compliance:financial-compliance.
argument-hint: "[project] [--skip-checks]"
---

# Controls

Design internal controls for "$ARGUMENTS". Establish preventive and detective controls to safeguard assets, ensure accuracy, and maintain compliance.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.metapowers/accounting/<project>/skip-log.md`: `- <ISO timestamp> — <skill name> skipped prerequisite check for <artifact file> — reason: <reason or "none given">`.

**Compute with code.** Perform every calculation (totals, balances, ratios, variances, projections) with a script — Bash, Python or a spreadsheet formula written to a file — and include the computation alongside the result. Never do arithmetic mentally.

## Prerequisites

None — utility skill, run anytime. Most effective after Phase 1 (analyze) to understand the entity's operations and risk areas.

## Process

1. **Assess control environment:**
   - What processes handle cash, inventory, payroll, and financial reporting?
   - Where are the highest-risk areas for errors or fraud?
   - What controls currently exist (if any)?
   - What is the entity's size and complexity?

2. **Design preventive controls:**
   - **Segregation of duties** — separate authorization, custody, and recording
   - **Authorization controls** — approval limits and signing authority
   - **Physical controls** — locks, safes, restricted access, inventory counts
   - **IT controls** — access permissions, password policies, audit logs
   - **Documentation** — standardized forms, sequential numbering, required fields

3. **Design detective controls:**
   - **Reconciliations** — bank reconciliation, intercompany, sub-ledger to GL
   - **Reviews** — management review of reports, exception reports
   - **Audits** — internal audit schedule, surprise counts
   - **Variance analysis** — budget vs. actual monitoring

4. **Map controls to risks:**
   - For each identified risk, assign one or more controls
   - Classify controls by type (preventive/detective) and frequency (daily/weekly/monthly/annual)
   - Identify any gaps where risks lack adequate controls

5. **Write the artifact** to `.metapowers/accounting/<project>/controls.md` with sections:
   - **Control Environment Assessment** — current state and risk areas
   - **Control Matrix** — risks mapped to controls with type, frequency, and owner
   - **Implementation Plan** — priority order for implementing new or improved controls
   - **Monitoring** — how to verify controls are operating effectively

## Output

The controls design written to `.metapowers/accounting/<project>/controls.md`. Present a summary highlighting:
- Number of controls designed by type
- Highest-risk areas and their mitigating controls
- Implementation priorities

End the artifact with this paragraph, verbatim:

> **Not financial or tax advice.** This artifact is generated analysis for review by a qualified accountant or financial professional before any filing, reporting or decision relies on it.

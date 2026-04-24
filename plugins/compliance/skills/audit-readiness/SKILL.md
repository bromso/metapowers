---
description: Assess readiness for formal audit — evidence completeness, control effectiveness
---

# Audit Readiness

Assess audit readiness for "$ARGUMENTS" by evaluating evidence completeness, control operating effectiveness, and team preparedness for formal audit engagement.

## Prerequisites

Read `.metapowers/compliance/$ARGUMENTS/00-scope.md`. If this file does not exist, tell the user:

> Phase 0 (Scope) has not been completed for "$ARGUMENTS". Run `/compliance:regulatory-landscape $ARGUMENTS` first, or use `--skip-checks` to bypass.

If `--skip-checks` is present in $ARGUMENTS, skip this check.

## Process

1. **Read context files:**
   - Read `plugins/compliance/shared/grc-lifecycle-guide.md` for GRC methodology reference
   - Read `.metapowers/compliance/$ARGUMENTS/00-scope.md` for scope and control framework context
   - Read `.metapowers/compliance/$ARGUMENTS/02-remediate.md` for control mapping and evidence plan

2. **Evidence completeness check:**
   - For each regulation being certified: verify all required evidence items are collected
   - Check evidence currency — no expired or stale evidence items
   - Verify evidence format meets auditor expectations
   - Identify evidence gaps — missing, incomplete, or insufficient items
   - Calculate evidence completeness percentage per regulation

3. **Control operating effectiveness:**
   - Verify controls have been operating for the required period (typically 3-6 months for SOC 2 Type II, varies by standard)
   - Check for control failures or exceptions during the observation period
   - Verify compensating controls are documented for any known gaps
   - Assess control monitoring — are anomalies being detected and addressed?

4. **Mock audit simulation:**
   - Simulate auditor questions for each control domain
   - Verify document requests can be fulfilled within expected timeframes
   - Identify areas where explanations would be weak or evidence thin
   - Test team knowledge — who answers questions about which controls?

5. **Readiness scoring:**
   - Score each regulation on a readiness scale: Not Ready / Partially Ready / Audit Ready
   - Identify remaining gaps or weak areas per regulation
   - Create pre-audit remediation punch list with owners and deadlines

6. **Team readiness assessment:**
   - Identify who answers auditor questions per control domain
   - Assess team availability during planned audit window
   - Identify training needs for audit participants
   - Prepare audit logistics (room, access, schedules)

7. **Write the artifact** to `.metapowers/compliance/$ARGUMENTS/03-certify.md` with sections:
   - **Evidence Completeness Matrix** — per-regulation evidence status
   - **Control Effectiveness Summary** — operating period and effectiveness assessment
   - **Mock Audit Results** — simulated findings and weak areas
   - **Readiness Scorecard** — per-regulation readiness rating
   - **Pre-Audit Punch List** — remaining items to address before audit
   - **Team Readiness** — roles, responsibilities, and preparation needs

## Output

The audit readiness assessment written to `.metapowers/compliance/$ARGUMENTS/03-certify.md`. Present a summary to the user highlighting:
- Overall readiness rating per regulation
- Evidence completeness percentage
- Number of items on the pre-audit punch list
- Recommended audit start date based on readiness

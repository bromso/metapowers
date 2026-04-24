---
description: Create phased implementation plan for control deployment
---

# Implementation Plan

Create a phased implementation plan for "$ARGUMENTS" grouping controls into implementation waves with effort estimates, dependencies, owners, and target completion dates.

## Prerequisites

Read `.metapowers/compliance/$ARGUMENTS/00-scope.md`. If this file does not exist, tell the user:

> Phase 0 (Scope) has not been completed for "$ARGUMENTS". Run `/compliance:regulatory-landscape $ARGUMENTS` first, or use `--skip-checks` to bypass.

If `--skip-checks` is present in $ARGUMENTS, skip this check.

## Process

1. **Read context files:**
   - Read `plugins/compliance/shared/grc-lifecycle-guide.md` for GRC methodology reference
   - Read `.metapowers/compliance/$ARGUMENTS/00-scope.md` for scope and control framework context
   - Read `.metapowers/compliance/$ARGUMENTS/02-remediate.md` for gap register, control mapping, evidence plan, and policy gaps

2. **Group controls into implementation waves:**
   - **Wave 1 — Critical & Quick Wins (Month 1-2):** Critical gaps with regulatory urgency, quick wins (low effort, high impact), foundation controls enabling other controls
   - **Wave 2 — Core Controls (Month 3-4):** Core security and compliance controls, policy development and approval, evidence collection infrastructure
   - **Wave 3 — Advanced & Optimization (Month 5-6):** Advanced monitoring and automation, optimization of existing controls, continuous improvement processes

3. **Per-control implementation detail:**
   - Implementation steps — concrete actions to deploy the control
   - Effort estimate in person-days
   - Dependencies — other controls, tools, approvals, or resources needed first
   - Owner — team or individual responsible
   - Target completion date
   - Success criteria — how to verify the control is operating effectively

4. **Resource planning:**
   - Internal resource needs — hours by team (engineering, security, legal, HR)
   - External resource needs — consultants, auditors, tool vendors
   - Tool/platform needs — GRC tool, SIEM, identity provider, training platform
   - Budget estimate by wave

5. **Timeline and checkpoints:**
   - Create Gantt-style timeline showing waves, controls, and dependencies
   - Set progress review checkpoints (bi-weekly or monthly)
   - Define go/no-go criteria for advancing to next wave
   - Identify critical path items that could delay the overall plan

6. **Write the artifact** to `.metapowers/compliance/$ARGUMENTS/02-remediate.md` (append to existing) with sections:
   - **Implementation Waves** — wave 1/2/3 groupings with rationale
   - **Control Implementation Details** — per-control steps, effort, owner, target date
   - **Resource Plan** — internal and external resource requirements
   - **Timeline** — Gantt-style overview with milestones
   - **Checkpoints** — review cadence and go/no-go criteria
   - **Risk Register** — risks to the implementation plan with mitigations

## Output

The implementation plan appended to `.metapowers/compliance/$ARGUMENTS/02-remediate.md`. Present a summary to the user highlighting:
- Number of controls per wave
- Total estimated effort in person-days
- Critical path and key dependencies
- Recommended first actions to begin Wave 1

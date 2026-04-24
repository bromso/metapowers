---
description: Compile and organize evidence packages per regulation/auditor
---

# Evidence Package

Compile and organize evidence packages for "$ARGUMENTS" structured for auditor consumption, with evidence index, supporting documentation, and delivery preparation.

## Prerequisites

Read `.metapowers/compliance/$ARGUMENTS/00-scope.md`. If this file does not exist, tell the user:

> Phase 0 (Scope) has not been completed for "$ARGUMENTS". Run `/compliance:regulatory-landscape $ARGUMENTS` first, or use `--skip-checks` to bypass.

If `--skip-checks` is present in $ARGUMENTS, skip this check.

## Process

1. **Read context files:**
   - Read `plugins/compliance/shared/grc-lifecycle-guide.md` for GRC methodology reference
   - Read `plugins/compliance/shared/evidence-catalog-template.md` for evidence structure
   - Read `.metapowers/compliance/$ARGUMENTS/00-scope.md` for scope and control framework context
   - Read `.metapowers/compliance/$ARGUMENTS/02-remediate.md` for evidence plan
   - Read `.metapowers/compliance/$ARGUMENTS/03-certify.md` for audit readiness status

2. **Gather evidence items:**
   - For each certification: collect all evidence items per the evidence plan
   - Verify each item is current (collected within the required observation period)
   - Verify each item is complete (no partial screenshots, truncated logs, or unsigned attestations)
   - Flag any missing or expired evidence items for immediate remediation

3. **Organize by control:**
   - Structure evidence in the auditor's preferred organization (by control, by domain, or by regulation requirement)
   - Group related evidence items together (e.g., policy + procedure + evidence of execution)
   - Create clear naming convention for all evidence files

4. **Create evidence index:**
   - Build table of contents mapping each control to its evidence items
   - Include evidence item name, type, date collected, collection method, location
   - Cross-reference to regulation requirements (clause numbers, criteria)
   - Note any compensating controls or exceptions with justification

5. **Supporting documentation:**
   - Include policies and procedures referenced by controls
   - Include organizational charts showing reporting lines and responsibilities
   - Include system architecture diagrams relevant to scope
   - Include risk assessment and treatment documentation

6. **Package for delivery:**
   - Define delivery method (shared drive, GRC tool export, secure file transfer, physical)
   - Create package checklist for completeness verification
   - Prepare cover letter / engagement summary for auditor
   - Set access permissions and confidentiality protections

7. **Write the artifact** to `.metapowers/compliance/$ARGUMENTS/03-certify.md` (append to existing) with sections:
   - **Evidence Index** — complete mapping of controls to evidence items
   - **Evidence Status** — per-item currency and completeness verification
   - **Package Contents** — list of all documents included
   - **Supporting Documentation** — policies, procedures, diagrams included
   - **Delivery Plan** — method, timeline, access details
   - **Outstanding Items** — evidence items still needed before delivery

## Output

The evidence package plan appended to `.metapowers/compliance/$ARGUMENTS/03-certify.md`. Present a summary to the user highlighting:
- Total evidence items packaged
- Number of outstanding items
- Delivery method and timeline
- Any items requiring urgent attention before audit

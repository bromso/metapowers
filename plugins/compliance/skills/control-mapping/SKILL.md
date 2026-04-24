---
description: Map remediation actions to unified controls that satisfy multiple regulations
---

# Control Mapping

Map remediation actions for "$ARGUMENTS" to unified controls that satisfy multiple regulations simultaneously. Prioritize controls by cross-regulation coverage to maximize compliance impact per implementation effort.

## Prerequisites

Read `.metapowers/compliance/$ARGUMENTS/00-scope.md`. If this file does not exist, tell the user:

> Phase 0 (Scope) has not been completed for "$ARGUMENTS". Run `/compliance:regulatory-landscape $ARGUMENTS` first, or use `--skip-checks` to bypass.

If `--skip-checks` is present in $ARGUMENTS, skip this check.

## Process

1. **Read context files:**
   - Read `plugins/compliance/shared/grc-lifecycle-guide.md` for GRC methodology reference
   - Read `plugins/compliance/shared/control-mapping-template.md` for mapping structure
   - Read `.metapowers/compliance/$ARGUMENTS/00-scope.md` for scope and control framework context
   - Read `.metapowers/compliance/$ARGUMENTS/02-remediate.md` for the gap register

2. **Map gaps to controls:**
   - For each gap in the register, identify which control(s) remediate it
   - Use the unified control framework from Phase 0 as the control taxonomy
   - Document the specific implementation needed per control to close each gap

3. **Cross-regulation mapping:**
   - For each control, map to all regulation requirements it satisfies
   - One control can close gaps across SOC 2, ISO 27001, HIPAA, GDPR simultaneously
   - Document the specific clause/criterion satisfied per regulation
   - Identify regulation-specific control variations (same control, different evidence)

4. **Prioritize by coverage:**
   - Rank controls by cross-regulation coverage count
   - Calculate coverage efficiency — number of gaps closed per control implemented
   - Identify foundation controls that enable other controls
   - Flag controls with single-regulation applicability (still necessary but lower priority)

5. **Create implementation sequence:**
   - Order controls by: dependency (foundation first), coverage (high-coverage first), effort (quick wins first within same coverage tier)
   - Identify control clusters that should be implemented together
   - Flag controls with external dependencies (vendor, tool, consultant)

6. **Write the artifact** to `.metapowers/compliance/$ARGUMENTS/02-remediate.md` (append to existing) with sections:
   - **Control-to-Gap Mapping** — table showing each control and which gaps it closes
   - **Cross-Regulation Coverage** — matrix of controls vs. regulations satisfied
   - **Implementation Sequence** — ordered list with rationale
   - **Coverage Efficiency** — controls ranked by gaps-closed-per-effort
   - **Foundation Controls** — controls that must be in place before others

## Output

The control mapping appended to `.metapowers/compliance/$ARGUMENTS/02-remediate.md`. Present a summary to the user highlighting:
- Total controls needed to close all gaps
- Top 5 highest-coverage controls
- Foundation controls to implement first
- Estimated coverage percentage after implementing top 10 controls

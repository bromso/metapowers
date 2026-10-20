---
name: control-mapping
description: Map each gap in the remediation register to unified controls that close it across several regulations, then sequence those controls by coverage and dependency. Use when the user has a gap register and asks which controls fix the most gaps, or in what order to implement remediation controls.
argument-hint: "[project] [--skip-checks]"
---

# Control Mapping

Map remediation actions for "$ARGUMENTS" to unified controls that satisfy multiple regulations simultaneously. Prioritize controls by cross-regulation coverage to maximize compliance impact per implementation effort.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.metapowers/compliance/<project>/skip-log.md`: `- <ISO timestamp> — <skill name> skipped prerequisite check for <artifact file> — reason: <reason or "none given">`.

## Prerequisites

Read `.metapowers/compliance/<project>/00-scope.md`. If this file does not exist, tell the user:

> Phase 0 (Scope) has not been completed for "<project>". Run `/compliance:regulatory-landscape <project>` first, or use `--skip-checks` to bypass.

## Process

1. **Read context files:**
   - Read `${CLAUDE_PLUGIN_ROOT}/shared/grc-lifecycle-guide.md` for GRC methodology reference
   - Read `${CLAUDE_PLUGIN_ROOT}/shared/control-mapping-template.md` for mapping structure
   - Read `.metapowers/compliance/<project>/00-scope.md` for scope and control framework context
   - Read `.metapowers/compliance/<project>/02-remediate.md` for the gap register

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

6. **Write the artifact** — append to `.metapowers/compliance/<project>/02-remediate.md` under a `## Control Mapping` section. Create the file with a `# Remediate — <project>` heading if it does not exist; if a `## Control Mapping` section already exists, replace only that section. The section contains:
   - **Control-to-Gap Mapping** — table showing each control and which gaps it closes
   - **Cross-Regulation Coverage** — matrix of controls vs. regulations satisfied
   - **Implementation Sequence** — ordered list with rationale
   - **Coverage Efficiency** — controls ranked by gaps-closed-per-effort
   - **Foundation Controls** — controls that must be in place before others

## Output

The control mapping appended to `.metapowers/compliance/<project>/02-remediate.md`. Present a summary to the user highlighting:
- Total controls needed to close all gaps
- Top 5 highest-coverage controls
- Foundation controls to implement first
- Estimated coverage percentage after implementing top 10 controls

End the artifact with this paragraph, verbatim:

> **Not legal or audit advice.** This artifact supports preparation for compliance work; certification, attestation and regulatory conclusions require a qualified auditor or counsel.

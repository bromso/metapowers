---
name: control-framework
description: Select a primary control framework (ISO 27001, NIST CSF, CIS Controls, NIST 800-53 or SOC 2) and map its controls to every applicable regulation to find leverage points and gaps. Use when the user is pursuing several regulations at once and asks which control framework to build the program on. Not for a standalone crosswalk; see /compliance:cross-regulation-map.
argument-hint: "[project] [--skip-checks]"
---

# Control Framework

Select a unified control framework for "$ARGUMENTS" that maximizes regulatory coverage by mapping shared controls across multiple regulations, reducing duplication of compliance effort.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.metapowers/compliance/<project>/skip-log.md`: `- <ISO timestamp> — <skill name> skipped prerequisite check for <artifact file> — reason: <reason or "none given">`.

## Prerequisites

None — this is a Phase 0 (Scope) skill.

## Process

1. **Read context files:**
   - Read `${CLAUDE_PLUGIN_ROOT}/shared/grc-lifecycle-guide.md` for GRC methodology reference
   - Read `${CLAUDE_PLUGIN_ROOT}/shared/control-mapping-template.md` for output structure
   - Read `.metapowers/compliance/<project>/00-scope.md` for applicable regulations and priorities

2. **Framework evaluation:**
   - Evaluate candidate frameworks: ISO 27001 Annex A, NIST CSF 2.0, CIS Controls v8, NIST 800-53, SOC 2 TSC
   - Score each framework on: customer recognition, regulatory coverage breadth, implementation maturity, tooling ecosystem
   - Consider customer requirements — which frameworks do customers explicitly request?

3. **Primary framework selection:**
   - Select the primary framework based on highest regulatory overlap and customer demand
   - Document selection rationale with specific evidence
   - Identify supplementary frameworks needed for coverage gaps

4. **Control-to-regulation mapping:**
   - Map each control in the selected framework to applicable regulations
   - Identify controls that satisfy multiple regulations simultaneously (compliance leverage points)
   - Highlight controls unique to a single regulation (regulation-specific requirements)
   - Flag gaps — regulations with requirements not covered by the selected framework

5. **Coverage analysis:**
   - Calculate coverage percentage per regulation
   - Identify the minimum control set that covers the maximum number of regulations
   - Document gap-filling controls needed from supplementary frameworks

6. **Write the artifact** — append to `.metapowers/compliance/<project>/00-scope.md` under a `## Control Framework` section. Create the file with a `# Scope — <project>` heading if it does not exist; if a `## Control Framework` section already exists, replace only that section. The section contains:
   - **Framework Evaluation** — comparison table of candidate frameworks
   - **Selected Framework** — chosen framework with rationale
   - **Control-to-Regulation Map** — full mapping following the control mapping template
   - **Leverage Points** — controls satisfying 3+ regulations
   - **Coverage Gaps** — requirements needing supplementary controls

## Output

The control framework analysis appended to `.metapowers/compliance/<project>/00-scope.md`. Present a summary to the user highlighting:
- Selected primary framework and why
- Number of controls that cover multiple regulations
- Coverage gaps requiring supplementary controls
- Recommended next step: run `/compliance:compliance-roadmap <project>`

End the artifact with this paragraph, verbatim:

> **Not legal or audit advice.** This artifact supports preparation for compliance work; certification, attestation and regulatory conclusions require a qualified auditor or counsel.

---
description: Select and map a unified control framework that satisfies multiple regulations
---

# Control Framework

Select a unified control framework for "$ARGUMENTS" that maximizes regulatory coverage by mapping shared controls across multiple regulations, reducing duplication of compliance effort.

## Prerequisites

None — this is a Phase 0 (Scope) skill.

## Process

1. **Read context files:**
   - Read `plugins/compliance/shared/grc-lifecycle-guide.md` for GRC methodology reference
   - Read `plugins/compliance/shared/control-mapping-template.md` for output structure
   - Read `.metapowers/compliance/$ARGUMENTS/00-scope.md` for applicable regulations and priorities

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

6. **Write the artifact** to `.metapowers/compliance/$ARGUMENTS/00-scope.md` (append to existing) with sections:
   - **Framework Evaluation** — comparison table of candidate frameworks
   - **Selected Framework** — chosen framework with rationale
   - **Control-to-Regulation Map** — full mapping following the control mapping template
   - **Leverage Points** — controls satisfying 3+ regulations
   - **Coverage Gaps** — requirements needing supplementary controls

## Output

The control framework analysis appended to `.metapowers/compliance/$ARGUMENTS/00-scope.md`. Present a summary to the user highlighting:
- Selected primary framework and why
- Number of controls that cover multiple regulations
- Coverage gaps requiring supplementary controls
- Recommended next step: run `/compliance:compliance-roadmap $ARGUMENTS`

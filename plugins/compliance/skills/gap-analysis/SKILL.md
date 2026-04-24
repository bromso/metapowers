---
description: Aggregate findings across all assessments into a prioritized gap register
---

# Gap Analysis

Aggregate findings across all assessments for "$ARGUMENTS" into a prioritized gap register. Deduplicate gaps that appear across multiple regulations and score by risk, effort, and regulatory urgency.

## Prerequisites

Read `.metapowers/compliance/$ARGUMENTS/00-scope.md`. If this file does not exist, tell the user:

> Phase 0 (Scope) has not been completed for "$ARGUMENTS". Run `/compliance:regulatory-landscape $ARGUMENTS` first, or use `--skip-checks` to bypass.

If `--skip-checks` is present in $ARGUMENTS, skip this check.

## Process

1. **Read context files:**
   - Read `plugins/compliance/shared/grc-lifecycle-guide.md` for GRC methodology reference
   - Read `.metapowers/compliance/$ARGUMENTS/00-scope.md` for scope and control framework context
   - Read all assessment files from `.metapowers/compliance/$ARGUMENTS/01-assess/` directory

2. **Aggregate findings:**
   - Extract all non-compliant and partially-compliant findings from each assessment
   - Normalize finding descriptions for consistent comparison
   - Identify common root causes across findings

3. **Deduplicate gaps:**
   - Identify the same gap appearing across multiple regulation assessments
   - Merge duplicates into a single gap entry listing all affected regulations
   - Preserve regulation-specific nuances in the merged entry

4. **Score each gap:**
   - **Risk score (1-10):** What happens if not addressed? Consider regulatory penalties, data breach exposure, business disruption, reputational damage
   - **Effort score (1-10):** Implementation complexity — technical difficulty, organizational change required, third-party dependencies, timeline
   - **Regulatory urgency (1-10):** Deadline proximity, active enforcement, customer-blocking potential

5. **Prioritize and categorize:**
   - Calculate weighted priority score (risk 40%, urgency 35%, inverse effort 25%)
   - Identify quick wins — low effort, high risk reduction
   - Identify critical gaps — high risk regardless of effort
   - Identify strategic improvements — high effort but significant long-term value

6. **Write the artifact** to `.metapowers/compliance/$ARGUMENTS/02-remediate.md` with sections:
   - **Gap Register** — table with gap ID, description, affected regulations, risk score, effort score, urgency score, weighted priority
   - **Quick Wins** — gaps that can be closed rapidly with high impact
   - **Critical Gaps** — highest risk items requiring immediate attention
   - **Root Cause Analysis** — common themes across gaps
   - **Cross-Regulation Impact** — gaps that affect the most regulations

## Output

The gap analysis written to `.metapowers/compliance/$ARGUMENTS/02-remediate.md`. Present a summary to the user highlighting:
- Total number of unique gaps identified
- Number of quick wins
- Top 5 highest-priority gaps
- Cross-regulation coverage opportunities

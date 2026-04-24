---
description: Show how controls map across multiple regulations
---

# Cross-Regulation Map

Show how controls map across multiple regulations for "$ARGUMENTS" to identify high-coverage controls, regulation-unique requirements, and implementation priority based on coverage efficiency.

## Prerequisites

None — this is a utility skill.

## Process

1. **Read context files:**
   - Read `plugins/compliance/shared/grc-lifecycle-guide.md` for GRC methodology reference
   - Read `plugins/compliance/shared/control-mapping-template.md` for mapping structure
   - Read any existing compliance artifacts in `.metapowers/compliance/$ARGUMENTS/` for context (if they exist)

2. **Select regulations to map:**
   - Identify the regulations to include in the cross-regulation map
   - If scope file exists, use the applicable regulations from Phase 0
   - If no scope file, ask user which regulations to include or use common combinations (SOC 2 + ISO 27001 + GDPR)

3. **Create cross-regulation matrix:**
   - For each control in the unified framework: list which regulation requirements it satisfies
   - Map control to specific clause/criterion per regulation (e.g., SOC 2 CC6.1, ISO 27001 A.9.1.1, GDPR Art. 32)
   - Show coverage visually — which controls satisfy the most regulations

4. **Coverage analysis:**
   - Identify controls with highest cross-regulation coverage (implement once, satisfy many)
   - Identify regulation-unique requirements — controls only required by one regulation
   - Calculate coverage percentage — what percentage of each regulation's requirements are met by shared controls
   - Identify the minimum set of controls needed to achieve baseline compliance across all regulations

5. **Implementation priority:**
   - Rank controls by coverage efficiency — regulations satisfied per implementation effort
   - Recommend implementation sequence starting with highest-coverage controls
   - Identify foundation controls that enable compliance across all regulations
   - Flag regulation-unique controls that must still be implemented for specific certifications

6. **Write the artifact** to `.metapowers/compliance/$ARGUMENTS/cross-regulation-map.md` with sections:
   - **Cross-Regulation Matrix** — controls vs. regulations mapping
   - **High-Coverage Controls** — controls satisfying the most regulations
   - **Regulation-Unique Requirements** — requirements specific to individual regulations
   - **Coverage Analysis** — percentage of shared vs. unique requirements per regulation
   - **Implementation Priority** — recommended sequence by coverage efficiency
   - **Minimum Viable Compliance** — smallest control set for baseline compliance across all regulations

## Output

The cross-regulation map written to `.metapowers/compliance/$ARGUMENTS/cross-regulation-map.md`. Present a summary to the user highlighting:
- Number of controls mapped across regulations
- Top 5 highest-coverage controls
- Percentage of requirements shared vs. unique per regulation
- Recommended implementation starting point

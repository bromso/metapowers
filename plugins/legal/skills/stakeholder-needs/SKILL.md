---
description: Identify legal needs per business unit, product, and stakeholder group
---

# Stakeholder Legal Needs

Identify and map legal needs across all business units, products, and stakeholder groups for "$ARGUMENTS". Create a legal service catalog and prioritize support.

> **Note:** AI-generated legal content does not constitute legal advice. Consult a qualified attorney.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.metapowers/legal/<project>/skip-log.md`: `- <ISO timestamp> — <skill name> skipped prerequisite check for <artifact file> — reason: <reason or "none given">`.

## Prerequisites

None — this is a Phase 0 Assess skill.

## Process

1. **Map business units and their legal touchpoints:**
   - Identify all business units, teams, and product lines
   - For each, document current interactions with legal functions
   - Note frequency and type of legal requests

2. **For each business unit, assess:**
   - **Contracts needed** — vendor agreements, customer contracts, partner agreements, employment contracts, NDAs
   - **Compliance requirements** — industry-specific regulations, data handling obligations, reporting duties
   - **IP considerations** — patents, trademarks, copyrights, trade secrets, open source usage
   - **Regulatory exposure** — which regulations directly affect this unit's operations

3. **Create legal service catalog:**
   - List all legal services each group needs (contract review, compliance advice, IP filing, dispute resolution, etc.)
   - Map current legal support coverage for each service
   - Identify gaps where legal support is needed but not provided

4. **Identify underserved areas:**
   - Business units operating without adequate legal support
   - High-risk activities proceeding without legal review
   - Teams using outdated templates or self-service legal documents
   - Areas where legal bottlenecks slow business operations

5. **Prioritize by business impact and risk:**
   - Rank underserved areas by combination of business impact and legal risk
   - Estimate effort to close each gap
   - Recommend resourcing (in-house, outside counsel, legal tech tools)
   - Propose phased rollout of legal support improvements

6. **Write the artifact** — append to `.metapowers/legal/<project>/00-assess.md` under a `## Stakeholder Legal Needs` section. Create the file with a `# Assess — <project>` heading if it does not exist; if a `## Stakeholder Legal Needs` section already exists, replace only that section. The section contains:

   - **Business Unit Map** — all units with their legal touchpoints
   - **Needs Assessment** — contracts, compliance, IP, and regulatory needs per unit
   - **Legal Service Catalog** — comprehensive list of required legal services
   - **Coverage Gaps** — underserved areas and unmet legal needs
   - **Priority Matrix** — needs ranked by business impact and legal risk
   - **Resourcing Recommendations** — how to close gaps (in-house, outside counsel, tools)

## Output

The stakeholder legal needs assessment appended to `.metapowers/legal/<project>/00-assess.md`. Present a summary to the user highlighting:
- Total business units mapped and legal services cataloged
- Most underserved areas requiring immediate attention
- Top 3 recommended actions to improve legal coverage

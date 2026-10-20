---
name: regulatory-landscape
description: Map every regulation and certification that applies to a business from its jurisdictions, data types, industry and customer demands — the starting point of the compliance program. Use when the user asks which regulations apply to their company or product, or is starting a compliance program from scratch. Not for a per-law compliance status matrix; see /legal:regulatory-map.
argument-hint: "[project] [--skip-checks]"
---

# Regulatory Landscape

Map the full regulatory landscape for "$ARGUMENTS". Identify every applicable regulation based on where the business operates, what data it processes, what industries its customers serve, and what certifications those customers require.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.metapowers/compliance/<project>/skip-log.md`: `- <ISO timestamp> — <skill name> skipped prerequisite check for <artifact file> — reason: <reason or "none given">`.

## Prerequisites

None — this is a Phase 0 (Scope) skill.

## Process

1. **Read context files:**
   - Read `${CLAUDE_PLUGIN_ROOT}/shared/grc-lifecycle-guide.md` for GRC methodology reference

2. **Jurisdiction mapping:**
   - Identify all jurisdictions where the business operates (headquarters, offices, data centers, customers)
   - Map each jurisdiction to its regulatory requirements (EU, US federal, US state, UK, APAC, etc.)
   - Note cross-border data transfer implications

3. **Data classification:**
   - Identify data types processed (PII, PHI, PCI, financial data, children's data, biometric data, etc.)
   - Map each data type to regulations that govern it
   - Note data residency and sovereignty requirements

4. **Industry and customer analysis:**
   - Identify industries the business serves (healthcare, finance, government, education, etc.)
   - Map industry-specific regulations (HIPAA, PCI DSS, FedRAMP, FERPA, etc.)
   - Document certifications customers require or request in sales cycles

5. **Regulation inventory:**
   - Create a comprehensive regulation inventory table with columns: regulation name, jurisdiction, data types covered, industry applicability, mandatory vs. customer-driven, enforcement status
   - Map each regulation to applicability criteria specific to "<project>"
   - Flag regulations with upcoming enforcement dates or recent changes

6. **Write the artifact** — append to `.metapowers/compliance/<project>/00-scope.md` under a `## Regulatory Landscape` section. Create the file with a `# Scope — <project>` heading if it does not exist; if a `## Regulatory Landscape` section already exists, replace only that section. The section contains:
   - **Jurisdiction Map** — where the business operates and applicable jurisdictions
   - **Data Type Inventory** — data types processed and governing regulations
   - **Industry Requirements** — sector-specific regulations and customer demands
   - **Regulation Inventory Table** — full list of applicable regulations with applicability criteria
   - **Cross-Border Considerations** — data transfer and sovereignty requirements

## Output

The regulatory landscape analysis appended to `.metapowers/compliance/<project>/00-scope.md`. Present a summary to the user highlighting:
- Total number of applicable regulations identified
- Top regulations by business impact
- Any surprising applicability findings
- Recommended next step: run `/compliance:compliance-priorities <project>`

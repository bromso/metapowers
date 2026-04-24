---
description: Map controls to compliance frameworks
---

# Compliance Map

Map security controls to compliance frameworks for "$ARGUMENTS" covering framework selection, control-to-framework mapping, multi-framework coverage analysis, and gap identification.

## Process

1. **Select frameworks to map:**
   - Determine applicable frameworks based on industry, geography, and contractual requirements
   - Common frameworks: ISO 27001, NIST CSF, SOC 2, CIS Controls, PCI DSS, HIPAA, GDPR
   - If context is unclear, ask the user which frameworks are relevant
   - Read `plugins/security/shared/security-controls-matrix.md` for reference control catalog

2. **Inventory existing security controls:**
   - Read `.metapowers/security/$ARGUMENTS/` directory for existing security artifacts
   - Catalog controls already defined across all phases (Govern, Identify, Protect, Detect, Respond, Recover)
   - For each control: document control ID, description, implementation status, evidence

3. **Create control-to-framework mapping matrix:**
   - Build a matrix with controls as rows and frameworks as columns
   - Map each control to applicable framework requirements
   - Use framework-specific control references:
     - **ISO 27001** — Annex A control numbers (A.5 through A.18)
     - **NIST CSF** — function/category/subcategory (e.g., PR.AC-1)
     - **SOC 2** — Trust Service Criteria (CC1 through CC9, availability, confidentiality, privacy)
     - **CIS Controls** — control numbers (CIS 1 through CIS 18)
     - **PCI DSS** — requirement numbers (1 through 12)
     - **HIPAA** — Security Rule sections (administrative, physical, technical safeguards)

4. **Identify controls satisfying multiple frameworks:**
   - Highlight controls that map to requirements across two or more frameworks
   - Quantify multi-framework coverage efficiency (controls providing the most cross-framework coverage)
   - Prioritize these high-leverage controls for implementation and evidence collection
   - Note where a single control satisfies requirements differently per framework (may need additional evidence)

5. **Identify framework-specific gaps:**
   - For each framework, list requirements NOT covered by current controls
   - Categorize gaps by severity: critical (mandatory requirements), significant (important but compensating controls may exist), minor (best practice)
   - Note where compensating controls may partially satisfy requirements
   - Estimate effort to close each gap

6. **Prioritize gap remediation:**
   - Rank gaps by: regulatory risk (fines, penalties), audit timeline, customer requirements, effort to remediate
   - Identify gaps that can be closed by extending existing controls vs. requiring new controls
   - Create remediation plan with owners, deadlines, and resource requirements
   - Define interim risk acceptance for gaps that cannot be immediately addressed

7. **Write the artifact** to `.metapowers/security/$ARGUMENTS/compliance-map.md` with heading:

   ## Compliance Map

   Include sections:
   - **Applicable Frameworks** — selected frameworks with rationale
   - **Control Inventory** — existing controls with implementation status
   - **Mapping Matrix** — controls mapped to framework requirements
   - **Multi-Framework Coverage** — controls providing cross-framework efficiency
   - **Gap Analysis** — uncovered requirements per framework with severity
   - **Remediation Plan** — prioritized gap closure with owners and timeline

## Output

The compliance map written to `.metapowers/security/$ARGUMENTS/compliance-map.md`. Present a summary to the user highlighting:
- Frameworks mapped and overall coverage percentage per framework
- High-leverage controls providing multi-framework coverage
- Critical gaps requiring immediate attention
- Remediation priorities and timeline

---
description: Assess legal accessibility requirements — ADA, EAA, WCAG legal obligations
---

# Accessibility Compliance

Assess legal accessibility requirements for "$ARGUMENTS". Identify applicable accessibility laws, determine WCAG conformance requirements, assess current compliance, and create a remediation plan.

> **Note:** AI-generated legal content does not constitute legal advice. Consult a qualified attorney.

## Prerequisites

Check that `.metapowers/legal/$ARGUMENTS/00-assess.md` exists. If it does not exist, stop and tell the user:

> "Run an Assess skill first (e.g. `/legal:risk-assessment $ARGUMENTS`) to generate the prerequisite assessment artifact."

If the user passes `--skip-checks`, bypass this check and log the skip to `.metapowers/legal/$ARGUMENTS/skip-log.md` with a timestamp and the reason "Prerequisite check skipped for accessibility-compliance".

## Process

1. **Read inputs:**
   - Read `.metapowers/legal/$ARGUMENTS/00-assess.md` for risk, jurisdiction, and data practice context
   - Read any existing accessibility audit or review artifacts in `.metapowers/legal/$ARGUMENTS/` for additional context

2. **Identify applicable accessibility laws by jurisdiction:**
   - **United States:**
     - ADA Title III — public accommodations, DOJ web accessibility guidance, case law trends
     - Section 508 (Rehabilitation Act) — federal agencies and recipients of federal funding
     - State laws (California Unruh Act, New York accessibility requirements, etc.)
   - **European Union:**
     - European Accessibility Act (EAA) — effective June 2025, products and services requirements
     - Web Accessibility Directive — public sector websites and mobile apps
     - EN 301 549 standard
   - **United Kingdom:**
     - Equality Act 2010 — reasonable adjustments obligation
     - Public Sector Bodies Accessibility Regulations 2018
   - **Canada:**
     - Accessibility for Ontarians with Disabilities Act (AODA) — WCAG 2.0 AA for Ontario
     - Accessible Canada Act (ACA) — federal regulated organizations
   - **Other applicable jurisdictions** — document requirements based on assessment context

3. **Determine required WCAG conformance level:**
   - Identify which WCAG version applies (2.0, 2.1, 2.2) per jurisdiction
   - Typically Level AA is required by most regulations
   - Document any Level AAA requirements (rare but some jurisdictions or sectors)
   - Map WCAG success criteria to applicable legal requirements

4. **Assess current compliance status:**
   - Reference existing accessibility audit if available
   - Identify critical barriers by WCAG principle (Perceivable, Operable, Understandable, Robust)
   - Document automated scan results and manual testing findings
   - Catalog assistive technology compatibility (screen readers, keyboard navigation, voice control)

5. **Identify legal exposure:**
   - DOJ enforcement actions and guidance relevant to the business
   - Private litigation trends (ADA demand letters, structured negotiation)
   - EU fines and enforcement mechanisms under EAA and Web Accessibility Directive
   - Industry-specific enforcement (financial services, healthcare, education, government)
   - Insurance coverage considerations

6. **Create remediation priority list:**
   - **Critical barriers** (P1) — complete blockers preventing access (no keyboard access, missing alt text on critical images, inaccessible forms, no captions on essential video)
   - **Major barriers** (P2) — significant difficulty using features (poor contrast, missing form labels, inconsistent navigation)
   - **Minor barriers** (P3) — usability issues that don't block access (focus order anomalies, decorative image alt text, minor contrast issues)
   - Timeline and resource estimates for each priority level

7. **Draft accessibility statement:**
   - Commitment to accessibility and inclusion
   - Standards targeted (WCAG version and level)
   - Current conformance status
   - Known limitations and planned remediation timeline
   - Contact information for accommodation requests and feedback
   - Date of last review and update
   - Enforcement procedure references (where required by law)

8. **Design ongoing monitoring plan:**
   - Automated scanning cadence (recommended: weekly or with each deployment)
   - Manual testing schedule (recommended: quarterly)
   - User testing with people with disabilities (recommended: annually or with major changes)
   - Remediation tracking and reporting
   - Training program for development and content teams
   - Procurement requirements for third-party tools and content

9. **Write the artifact** to `.metapowers/legal/$ARGUMENTS/03-comply.md` with frontmatter:

   ```
   ---
   description: Accessibility compliance assessment for $ARGUMENTS
   ---
   ```

   Include sections:
   - **Applicable Laws** — jurisdiction-by-jurisdiction legal requirements
   - **WCAG Conformance Requirements** — version, level, and success criteria mapping
   - **Current Compliance Status** — assessment findings and barrier inventory
   - **Legal Exposure Analysis** — enforcement risk and litigation trends
   - **Remediation Priority List** — prioritized barriers with timelines
   - **Accessibility Statement** — draft statement for publication
   - **Ongoing Monitoring Plan** — testing cadence and responsibilities
   - **Compliance Gaps** — identified gaps with remediation recommendations

## Output

The accessibility compliance assessment written to `.metapowers/legal/$ARGUMENTS/03-comply.md`. Present a summary to the user highlighting:
- Applicable accessibility laws and required WCAG level
- Current compliance status (if audit data available)
- Number of barriers identified by priority level
- Key legal exposure areas
- Top remediation priorities and estimated timeline

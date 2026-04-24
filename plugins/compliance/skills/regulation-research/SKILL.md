---
description: Research a specific regulation's requirements, deadlines, and enforcement
---

# Regulation Research

Research the "$ARGUMENTS" regulation to provide a comprehensive overview of its requirements, scope, deadlines, enforcement, and practical compliance approaches.

## Prerequisites

None — this is a utility skill.

## Process

1. **Read context files:**
   - Read `plugins/compliance/shared/grc-lifecycle-guide.md` for GRC methodology reference

2. **Research the regulation:**
   - Use WebSearch to research "$ARGUMENTS" regulation
   - Search for official regulatory text, guidance documents, and FAQs
   - Search for industry analysis, implementation guides, and best practices
   - Search for recent enforcement actions and penalties

3. **Summarize key information:**
   - **Purpose** — what problem does this regulation address?
   - **Scope** — who does it apply to? Geographic, industry, size thresholds
   - **Key requirements** — major obligations organized by category
   - **Effective/enforcement dates** — when did it take effect, any phase-in periods
   - **Enforcement body** — which authority enforces, how they operate
   - **Penalties** — fines, sanctions, criminal liability, business restrictions

4. **Enforcement landscape:**
   - Recent enforcement actions — notable cases, fine amounts, violations cited
   - Enforcement trends — increasing scrutiny, new focus areas
   - Regulatory guidance — published guidance, FAQ updates, enforcement priorities
   - Industry-specific considerations — how enforcement varies by sector

5. **Practical compliance:**
   - Common compliance approaches — frameworks and methodologies used
   - Industry guidance — sector-specific implementation resources
   - Tool and service ecosystem — GRC tools, consultants, legal advisors specializing in this regulation
   - Certification or attestation options (if applicable)
   - Useful resources — official websites, industry groups, training

6. **Applicability assessment:**
   - Help user determine if this regulation applies to their organization
   - Key questions to answer: jurisdiction, data types handled, company size, industry
   - Common exemptions or safe harbors
   - Interaction with other regulations (e.g., GDPR vs. CCPA, SOC 2 vs. ISO 27001)

7. **Write the artifact** to `.metapowers/compliance/$ARGUMENTS/regulation-research.md` with sections:
   - **Regulation Overview** — purpose, scope, and key requirements
   - **Compliance Timeline** — effective dates, phase-in periods, deadlines
   - **Enforcement** — enforcement body, penalties, recent actions
   - **Compliance Approach** — common strategies and frameworks
   - **Applicability Checklist** — questions to determine if regulation applies
   - **Resources** — official sources, industry guides, tools

## Output

The regulation research written to `.metapowers/compliance/$ARGUMENTS/regulation-research.md`. Present a summary to the user highlighting:
- Regulation purpose and who it applies to
- Key requirements overview
- Enforcement status and notable penalties
- Recommended next steps if regulation is applicable

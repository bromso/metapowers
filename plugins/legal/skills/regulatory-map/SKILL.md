---
description: Map applicable regulations by jurisdiction, industry, and data type
---

# Regulatory Map

Map all applicable regulations for "$ARGUMENTS". Identify relevant laws and requirements by jurisdiction, industry, and data type, then assess current compliance status.

> **Note:** AI-generated legal content does not constitute legal advice. Consult a qualified attorney.

## Prerequisites

None — this is a Phase 0 Assess skill.

## Process

1. **Identify applicable regulations:**
   - Use WebSearch to find regulations relevant to "$ARGUMENTS"
   - Consider the business model, industry, geography, and data handling practices
   - Include both primary regulations and subsidiary rules or guidance

2. **Map by jurisdiction:**
   - **EU** — GDPR, ePrivacy Directive, Digital Services Act, AI Act
   - **US federal** — FTC Act, CAN-SPAM, COPPA, HIPAA, SOX, CCPA enforcement
   - **US state-specific** — CCPA/CPRA (California), VCDPA (Virginia), CPA (Colorado), etc.
   - **UK** — UK GDPR, Data Protection Act 2018, Online Safety Act
   - **Other jurisdictions** — as applicable to the business

3. **Map by industry:**
   - **Healthcare** — HIPAA, HITECH, state health privacy laws
   - **Finance** — SOX, Dodd-Frank, PCI DSS, state money transmitter laws
   - **Technology** — software licensing, open source compliance, export controls
   - **General** — GDPR, consumer protection, advertising standards

4. **Map by data type:**
   - **Personal data** — general PII under GDPR, CCPA
   - **Health data** — PHI under HIPAA, health data under GDPR
   - **Financial data** — payment data under PCI DSS, financial records under SOX
   - **Children's data** — COPPA, Age Appropriate Design Code

5. **Create regulation matrix:**
   - Rows: each applicable regulation
   - Columns: key requirements, applicable jurisdiction, data types covered, current compliance status
   - Rate compliance status: compliant / partially compliant / non-compliant / unknown

6. **Identify highest-priority compliance gaps:**
   - Regulations where status is non-compliant with high enforcement risk
   - Upcoming regulatory deadlines or new laws taking effect
   - Areas where multiple regulations overlap with conflicting requirements

7. **Write the artifact** to `.metapowers/legal/$ARGUMENTS/00-assess.md` with heading:

   ## Regulatory Map

   Include sections:
   - **Applicable Regulations** — complete list with brief descriptions
   - **Jurisdiction Map** — regulations organized by jurisdiction
   - **Industry Requirements** — industry-specific regulatory obligations
   - **Data Type Matrix** — which regulations apply to which data types
   - **Compliance Status Matrix** — current status for each regulation
   - **Priority Gaps** — highest-risk compliance gaps requiring action

## Output

The regulatory map written to `.metapowers/legal/$ARGUMENTS/00-assess.md`. Present a summary to the user highlighting:
- Total number of applicable regulations identified
- Current compliance status breakdown (compliant / partial / non-compliant)
- Top compliance gaps requiring immediate attention

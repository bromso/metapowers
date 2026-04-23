---
description: Draft GDPR/CCPA-compliant privacy policy
---

# Privacy Policy

Draft a GDPR/CCPA-compliant privacy policy for "$ARGUMENTS". Generate a comprehensive privacy policy that satisfies major data protection regulations.

> **Note:** AI-generated legal content does not constitute legal advice. Consult a qualified attorney.

## Prerequisites

Check that `.metapowers/legal/$ARGUMENTS/00-assess.md` exists. If it does not exist, stop and tell the user:

> "Run an Assess skill first (e.g. `/legal:risk-assessment $ARGUMENTS`) to generate the prerequisite assessment artifact."

If the user passes `--skip-checks`, bypass this check and log the skip to `.metapowers/legal/$ARGUMENTS/skip-log.md` with a timestamp and the reason "Prerequisite check skipped for privacy-policy".

## Process

1. **Read inputs:**
   - Read `.metapowers/legal/$ARGUMENTS/00-assess.md` for risk, jurisdiction, and data practice context

2. **Identify data practices:**
   - What personal data is collected (categories and specific examples)
   - How data is collected (directly from users, automatically, from third parties)
   - Purposes for processing each data category
   - Lawful basis for processing under GDPR (consent, contract, legitimate interest, legal obligation, vital interest, public task)
   - Data sharing relationships with third parties
   - Data retention timelines per category
   - International data transfer mechanisms

3. **Draft GDPR Article 13/14 compliant sections:**

   - **Data Controller Identity and Contact** — legal name, address, contact details, EU representative (if applicable)
   - **Data Collected** — categories with specific examples (identifiers, contact info, financial data, usage data, device data, location data, etc.)
   - **Purposes and Lawful Basis** — per-category breakdown of why data is processed and the legal basis for each
   - **Data Sharing with Third Parties** — who receives data, why, and in what capacity (processor vs. controller)
   - **Data Retention Periods** — per-category retention periods with rationale
   - **User Rights** — access, rectification, erasure, restriction, portability, objection, and how to exercise each right
   - **Automated Decision-Making and Profiling** — whether used, logic involved, significance and consequences, right to opt out
   - **Cookie Usage** — summary with link to full cookie policy
   - **International Data Transfers** — transfer mechanisms (SCCs, adequacy decisions, BCRs) and safeguards
   - **Children's Privacy** — age restrictions, COPPA compliance (if applicable), parental consent mechanisms
   - **Policy Updates Procedure** — how changes are communicated, effective date handling
   - **DPO / Contact Information** — Data Protection Officer details (if appointed), supervisory authority contact, complaint procedures

4. **Add CCPA-specific provisions (if applicable):**
   - Categories of personal information collected (CCPA categories)
   - Right to know, right to delete, right to opt out of sale/sharing
   - "Do Not Sell or Share My Personal Information" link requirement
   - Financial incentive disclosures (if any)
   - Authorized agent procedures
   - Non-discrimination statement

5. **Write the artifact** to `.metapowers/legal/$ARGUMENTS/01-draft.md` with frontmatter:

   ```
   ---
   description: Privacy policy draft for $ARGUMENTS
   ---
   ```

## Output

The privacy policy draft written to `.metapowers/legal/$ARGUMENTS/01-draft.md`. Present a summary to the user highlighting:
- Regulations addressed (GDPR, CCPA, others)
- Number of data categories documented
- Third-party data sharing relationships identified
- User rights enumerated
- Areas flagged for attorney review (especially lawful basis determinations and transfer mechanisms)

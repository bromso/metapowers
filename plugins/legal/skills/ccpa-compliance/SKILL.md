---
description: Assess and implement CCPA/CPRA compliance requirements
---

# CCPA/CPRA Compliance

Assess and implement CCPA/CPRA compliance for "$ARGUMENTS". Determine applicability, map consumer rights procedures, define notice requirements, and establish service provider agreements.

> **Note:** AI-generated legal content does not constitute legal advice. Consult a qualified attorney.

## Prerequisites

Check that `.legal/$ARGUMENTS/00-assess.md` exists. If it does not exist, stop and tell the user:

> "Run an Assess skill first (e.g. `/legal:risk-assessment $ARGUMENTS`) to generate the prerequisite assessment artifact."

If the user passes `--skip-checks`, bypass this check and log the skip to `.legal/$ARGUMENTS/skip-log.md` with a timestamp and the reason "Prerequisite check skipped for ccpa-compliance".

## Process

1. **Read inputs:**
   - Read `.legal/$ARGUMENTS/00-assess.md` for risk, jurisdiction, and data practice context
   - Read any existing draft or review artifacts in `.legal/$ARGUMENTS/` for additional context

2. **Determine CCPA applicability:**
   - Annual gross revenue exceeds $25 million
   - Annually buys, sells, or shares personal information of 100,000 or more consumers, households, or devices
   - Derives 50% or more of annual revenue from selling or sharing consumers' personal information
   - Document which threshold(s) are met or potentially met

3. **Map consumer rights procedures:**
   - **Right to know** (categories and specific pieces of personal information collected, sold, or disclosed) — verification procedures, response timeline (45 days, extendable by 45)
   - **Right to delete** — verification procedures, exceptions (complete transaction, security, legal obligation, etc.), service provider notification requirements
   - **Right to opt-out of sale/sharing** — mechanism for submitting opt-out requests, Global Privacy Control signal recognition
   - **Right to correct** — process for submitting and verifying correction requests
   - **Right to limit use of sensitive personal information** — categories of sensitive PI, link to limit use, processing restrictions
   - Designated methods for submitting requests (at minimum: toll-free number and website)

4. **Notice at collection requirements:**
   - Categories of personal information collected
   - Purposes for each category
   - Whether personal information is sold or shared
   - Retention period per category
   - Link to full privacy policy

5. **Service provider vs. contractor agreements:**
   - Distinguish service provider, contractor, and third-party roles
   - Required contractual provisions for service providers (prohibit selling/sharing, limit use to contracted purpose, compliance obligations, grant audit rights)
   - Required contractual provisions for contractors (same as service providers plus certification requirements)

6. **Financial incentive disclosures:**
   - Identify any loyalty programs, discounts, or price differences tied to personal information
   - Document the value of consumer data and methodology
   - Notice and opt-in consent requirements

7. **Do-not-sell/share link requirements:**
   - Clear and conspicuous "Do Not Sell or Share My Personal Information" link on homepage
   - Alternative opt-out link if using unified approach
   - Technical implementation requirements

8. **Data retention schedules:**
   - Define retention periods per category of personal information
   - Justify retention periods based on business necessity
   - Document deletion or de-identification procedures

9. **Employee and B2B data obligations:**
   - Full CCPA rights now apply to employee, applicant, and B2B data
   - Document handling procedures for these categories
   - HR and recruitment process compliance

10. **Privacy policy requirements specific to CCPA:**
    - Categories of personal information collected, sold, and shared in preceding 12 months
    - Categories of sources and third parties
    - Business or commercial purpose for collection
    - Consumer rights description and how to exercise them
    - Annual update requirement

11. **Write the artifact** to `.legal/$ARGUMENTS/03-comply.md` with frontmatter:

    ```
    ---
    description: CCPA/CPRA compliance assessment for $ARGUMENTS
    ---
    ```

    Include sections:
    - **Applicability Determination** — threshold analysis
    - **Consumer Rights Procedures** — detailed procedures for each right
    - **Notice at Collection** — required disclosures
    - **Service Provider/Contractor Agreements** — contractual requirements
    - **Financial Incentives** — disclosures and opt-in requirements
    - **Do-Not-Sell/Share Implementation** — link and mechanism requirements
    - **Data Retention Schedule** — per-category retention periods
    - **Employee/B2B Data** — handling procedures
    - **Privacy Policy Updates** — CCPA-specific content requirements
    - **Compliance Gaps** — identified gaps with remediation recommendations

## Output

The CCPA/CPRA compliance assessment written to `.legal/$ARGUMENTS/03-comply.md`. Present a summary to the user highlighting:
- Whether CCPA applies and which thresholds are triggered
- Consumer rights procedures defined
- Notice and disclosure requirements identified
- Service provider agreement requirements
- Critical compliance gaps requiring immediate attention

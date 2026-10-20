---
name: compliance-review
description: Review document for regulatory compliance (GDPR, CCPA, SOC2, etc.)
argument-hint: "[project] [--skip-checks]"
---

# Compliance Review

Review the document for "$ARGUMENTS" against applicable regulatory frameworks. Check compliance with GDPR, CCPA, SOC2, and other relevant regulations, scoring compliance level and identifying specific gaps.

> **Note:** AI-generated legal content does not constitute legal advice. Consult a qualified attorney.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.metapowers/legal/<project>/skip-log.md`: `- <ISO timestamp> — <skill name> skipped prerequisite check for <artifact file> — reason: <reason or "none given">`.

## Prerequisites

Check that `.metapowers/legal/<project>/00-assess.md` exists. If it does not exist, stop and tell the user:

> "Run an Assess skill first (e.g. `/legal:risk-assessment <project>`) to generate the prerequisite assessment artifact."

## Process

1. **Read inputs:**
   - Read `.metapowers/legal/<project>/00-assess.md` for risk and jurisdiction context
   - Read `${CLAUDE_PLUGIN_ROOT}/shared/compliance-checklist.md` for reference requirements
   - Read the document from the source provided by the user

2. **Determine applicable regulations:**
   - Based on jurisdiction, industry, and data types identified in the assessment
   - Prioritize regulations by relevance and enforcement risk

3. **Check GDPR compliance (if applicable):**
   - **Lawful basis** — is a lawful basis for processing identified (consent, legitimate interest, contract, etc.)?
   - **Data processing provisions** — are controller/processor roles defined with adequate DPA terms?
   - **Data subject rights** — are rights addressed (access, rectification, erasure, portability, objection)?
   - **International transfers** — are transfer mechanisms in place (SCCs, adequacy decisions, BCRs)?
   - **Breach notification** — are notification obligations defined (72-hour timeline, authority and data subject notification)?
   - **Data Protection Impact Assessment** — is a DPIA referenced or required for high-risk processing?
   - **Records of processing** — are record-keeping obligations addressed?

4. **Check CCPA/CPRA compliance (if applicable):**
   - **Notice at collection** — are categories of personal information and purposes disclosed?
   - **Opt-out rights** — is the right to opt out of sale/sharing of personal information addressed?
   - **Deletion rights** — are consumer deletion request procedures defined?
   - **Non-discrimination** — is there a commitment not to discriminate against consumers exercising rights?
   - **Service provider obligations** — are contractual restrictions on use of personal information included?
   - **Sensitive personal information** — are additional protections for sensitive categories addressed?

5. **Check SOC2 compliance (if applicable):**
   - **Security controls** — are security measures documented (encryption, access controls, monitoring)?
   - **Availability commitments** — are uptime and recovery commitments defined?
   - **Incident response** — is an incident response plan referenced or required?
   - **Change management** — are change control procedures addressed?
   - **Vendor management** — are sub-processor or subcontractor controls defined?

6. **Check accessibility compliance (if applicable):**
   - WCAG 2.1 AA compliance commitments
   - Accessibility testing obligations
   - Remediation timelines for accessibility issues

7. **Score compliance level per regulation:**
   - **Compliant** — all material requirements addressed with adequate provisions
   - **Partially Compliant** — some requirements addressed but with notable gaps
   - **Non-Compliant** — critical requirements missing or inadequately addressed

8. **Identify specific gaps and suggest compliant alternatives:**
   - For each gap, reference the specific regulatory requirement
   - Provide draft language or provisions that would close the gap
   - Prioritize gaps by enforcement risk and potential penalty exposure

9. **Write the artifact** — append to `.metapowers/legal/<project>/02-review.md` under a `## Compliance Review` section. Create the file with a `# Review — <project>` heading if it does not exist; if a `## Compliance Review` section already exists, replace only that section. The section contains:

   - **Applicable Regulations** — list of regulations checked and rationale for inclusion
   - **GDPR Assessment** — item-by-item compliance check (if applicable)
   - **CCPA/CPRA Assessment** — item-by-item compliance check (if applicable)
   - **SOC2 Assessment** — item-by-item compliance check (if applicable)
   - **Accessibility Assessment** — item-by-item compliance check (if applicable)
   - **Compliance Scorecard** — Compliant/Partially Compliant/Non-Compliant per regulation
   - **Gap Analysis** — specific gaps with regulatory reference and risk level
   - **Remediation Recommendations** — suggested language or provisions per gap

## Output

The compliance review appended to `.metapowers/legal/<project>/02-review.md`. Present a summary to the user highlighting:
- Compliance scorecard across all applicable regulations
- Critical gaps (Non-Compliant items) requiring immediate attention
- Number of gaps per regulation and overall compliance posture
- Top 3 remediation priorities

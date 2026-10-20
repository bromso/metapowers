---
name: terms-of-service
description: Draft or update Terms of Service for a website, app, marketplace or API — acceptance, eligibility, accounts, prohibited uses, user content, disclaimers, liability, termination and dispute resolution. Use when the user is launching a digital product and needs the public terms users accept at sign-up.
argument-hint: "[project] [--skip-checks]"
---

# Terms of Service

Draft or update Terms of Service for "$ARGUMENTS". Generate a comprehensive, jurisdiction-aware ToS document tailored to the product type and user base.

> **Note:** AI-generated legal content does not constitute legal advice. Consult a qualified attorney.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.metapowers/legal/<project>/skip-log.md`: `- <ISO timestamp> — <skill name> skipped prerequisite check for <artifact file> — reason: <reason or "none given">`.

## Prerequisites

Check that `.metapowers/legal/<project>/00-assess.md` exists. If it does not exist, stop and tell the user:

> "Run an Assess skill first (e.g. `/legal:risk-assessment <project>`) to generate the prerequisite assessment artifact."

## Process

1. **Read inputs:**
   - Read `.metapowers/legal/<project>/00-assess.md` for risk and jurisdiction context
   - Read `${CLAUDE_PLUGIN_ROOT}/shared/contract-template.md` for standard contract provisions

2. **Identify product context:**
   - Product type (web app, mobile app, marketplace, API, SaaS platform, etc.)
   - Target audience (consumers, businesses, or both)
   - Primary jurisdiction and any additional jurisdictions
   - Key features that require specific terms (payments, user content, subscriptions, etc.)

3. **Draft the following sections:**

   - **Acceptance Mechanism** — how users accept the terms (clickwrap, browsewrap, sign-in wrap) with enforceability considerations
   - **User Eligibility** — age requirements (COPPA/GDPR-K considerations), geographic restrictions, entity requirements
   - **Account Terms** — registration requirements, account security obligations, account sharing restrictions
   - **User Rights and Restrictions** — license grant to use the service, scope and limitations
   - **Prohibited Uses** — specific prohibited activities (illegal use, abuse, reverse engineering, scraping, etc.)
   - **Intellectual Property Ownership** — company IP rights, trademarks, copyright notices
   - **User-Generated Content** — if applicable: license grant from users, content moderation rights, DMCA/takedown procedures, content responsibility
   - **Disclaimers of Warranties** — "as is" / "as available" disclaimers, no warranty of uninterrupted service
   - **Limitation of Liability** — liability cap, exclusion of consequential damages, jurisdictional carve-outs where required
   - **Indemnification** — user indemnification obligations, process requirements
   - **Termination** — termination rights (by user, by company, automatic), effect of termination, data retention post-termination
   - **Governing Law and Dispute Resolution** — choice of law, forum selection or arbitration clause, class action waiver (where enforceable)
   - **Modification Procedure** — how changes are communicated, notice period, deemed acceptance mechanism

4. **Tailor to jurisdiction requirements:**
   - EU: consumer withdrawal rights, unfair terms directive compliance, GDPR cross-references
   - California: CCPA cross-references, additional consumer protections
   - Other jurisdictions identified in the assessment

5. **Write the artifact** — append to `.metapowers/legal/<project>/01-draft.md` under a `## Terms of Service` section. Create the file with a `# Draft — <project>` heading if it does not exist; if a `## Terms of Service` section already exists, replace only that section.

## Output

The Terms of Service draft appended to `.metapowers/legal/<project>/01-draft.md`. Present a summary to the user highlighting:
- Product type and primary jurisdiction identified
- Key sections included and any sections omitted with rationale
- Jurisdiction-specific provisions added
- Areas flagged for attorney review

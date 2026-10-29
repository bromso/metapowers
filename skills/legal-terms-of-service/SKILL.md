---
name: legal-terms-of-service
description: Draft or update Terms of Service for a website, app, marketplace or API — acceptance, eligibility, accounts, prohibited uses, user content, disclaimers, liability, termination and dispute resolution. Use when the user is launching a digital product and needs the public terms users accept at sign-up.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: legal
  phase: 1
  artifact: 01-draft.md
---

# Terms of Service

Draft or update Terms of Service for "$ARGUMENTS". Generate a comprehensive, jurisdiction-aware ToS document tailored to the product type and user base.

> **Note:** AI-generated legal content does not constitute legal advice. Consult a qualified attorney.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"<skill name>","workflow":"legal","phase":<phase>,"project":"<project>","event":"skipped","artifact":"<artifact file>","note":"<reason or \"none given\">"}`.

## Prerequisites

Run `scripts/gate.sh <project>` from this skill's folder. If it exits non-zero, stop and tell the user what it printed (unless `--skip-checks`, see Arguments).

Check that `.singularskills/legal/<project>/00-assess.md` exists. If it does not exist, stop and tell the user:

> "Run an Assess skill first (e.g. `/legal-risk-assessment <project>`) to generate the prerequisite assessment artifact."

## Process

1. **Read inputs:**
   - Read `.singularskills/legal/<project>/00-assess.md` for risk and jurisdiction context
   - Read `references/contract-template.md` for standard contract provisions

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

5. **Write the artifact** — append to `.singularskills/legal/<project>/01-draft.md` under a `## Terms of Service` section. Create the file with a `# Draft — <project>` heading if it does not exist; if a `## Terms of Service` section already exists, replace only that section.

## Output

The Terms of Service draft appended to `.singularskills/legal/<project>/01-draft.md`. Present a summary to the user highlighting:
- Product type and primary jurisdiction identified
- Key sections included and any sections omitted with rationale
- Jurisdiction-specific provisions added
- Areas flagged for attorney review

**Record the run.** This artifact is shared by every skill of phase 1 (Draft). The frontmatter is written once, by whoever creates the file: if you create it, open it with the block below (`skill` is the phase title, `started` the time of that first write; `gate` is `passed` when the gate ran clean and `skipped` under `--skip-checks`); if it already exists, leave the block alone except to update `finished` and to set `gate` to the worst value among the sections (`skipped` over `passed`).

```yaml
---
skill: Draft
workflow: legal
phase: 1
project: <project>
started: <ISO timestamp>
finished: <ISO timestamp>
agent: <the agent you run in, or "unknown">
gate: <passed|skipped>
---
```

Open your `## Terms of Service` section with one italic line, `*<skill name> · <ISO timestamp> · gate: <passed|skipped>*` (your skill name is `legal-terms-of-service`).

End your section with `### Decisions` and `### Open questions` (one level under your `## Terms of Service` heading, so the section stays one block), in this shape:

```markdown
### Decisions
- <what was chosen> — <why> — <what was rejected>

### Open questions
- <what the next phase or a reviewer must settle>
```

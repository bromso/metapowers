---
name: legal-cookie-policy
description: Draft a public cookie policy — what cookies are, categories, an inventory table, browser opt-out instructions, third-party disclosures and how consent is given and withdrawn. Use when the user needs the cookie policy page for their website or app written or updated. Not for building the consent banner itself; see /legal-cookie-consent.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: legal
  phase: 1
  artifact: 01-draft.md
---

# Cookie Policy

Draft a cookie consent policy and banner implementation guide for "$ARGUMENTS". Generate a comprehensive cookie policy with practical implementation guidance for consent management.

> **Note:** AI-generated legal content does not constitute legal advice. Consult a qualified attorney.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"legal-cookie-policy","workflow":"legal","phase":1,"project":"<project>","event":"skipped","artifact":"01-draft.md","note":"<reason or \"none given\">"}`.

## Prerequisites

Run this skill's gate before writing: `sh <this skill's folder>/scripts/gate.sh <project> <project root>`, where `<project root>` is the folder that contains `.singularskills/` (use `.` when you are already there). If it exits non-zero, stop and tell the user what it printed, unless `--skip-checks` was given (see Arguments). On a refusal, before you stop, append this line to `.singularskills/log.jsonl` (create the folder and file if missing): `{"ts":"<ISO timestamp>","skill":"legal-cookie-policy","workflow":"legal","phase":1,"project":"<project>","event":"refused","artifact":"01-draft.md","note":"<what the gate printed>"}`. Once the gate has passed, or under `--skip-checks` once you have appended the `skipped` line, append this line before you start work: `{"ts":"<ISO timestamp>","skill":"legal-cookie-policy","workflow":"legal","phase":1,"project":"<project>","event":"started","artifact":"01-draft.md","note":""}`.

Check that `.singularskills/legal/<project>/00-assess.md` exists. If it does not exist, stop and tell the user:

> "Run an Assess skill first (e.g. `/legal-risk-assessment <project>`) to generate the prerequisite assessment artifact."

## Process

1. **Read inputs:**
   - Read `.singularskills/legal/<project>/00-assess.md` for jurisdiction requirements and data practice context

2. **Draft cookie policy — explanatory sections:**

   - **What Cookies Are** — plain-language explanation of cookies and similar tracking technologies (pixels, web beacons, local storage, fingerprinting), accessible to non-technical readers
   - **Cookie Categories:**
     - **Strictly Necessary** — essential for site function (authentication, security, load balancing, shopping cart), cannot be disabled, no consent required
     - **Functional / Preferences** — remember user choices (language, region, display settings), enhance user experience but not essential
     - **Analytics / Performance** — measure site usage, traffic patterns, page performance (Google Analytics, Hotjar, etc.), used to improve the service
     - **Advertising / Marketing** — track users across sites, build interest profiles, deliver targeted ads, measure ad campaign effectiveness

3. **Draft cookie inventory table:**
   - For each cookie: name, provider (first-party or third-party with name), purpose, category, duration (session or persistent with expiry), data collected
   - Organize by category
   - Note: instruct the user to audit their actual cookies and update this table with real values

4. **Draft cookie management instructions:**
   - How to manage cookies through the consent banner (re-access preferences)
   - How to manage cookies per browser (Chrome, Firefox, Safari, Edge — link to browser documentation)
   - How to opt out of specific third-party cookies (Google, Meta, etc. — link to opt-out pages)
   - Impact of disabling cookies on site functionality per category

5. **Draft third-party cookie disclosures:**
   - List of third-party services that set cookies
   - Link to each third party's privacy/cookie policy
   - Purpose of each third-party integration
   - Data shared with third parties through cookies

6. **Draft consent mechanism description:**
   - How consent is collected (banner, preference center)
   - What constitutes valid consent (affirmative action, not pre-checked boxes)
   - How consent is recorded and stored
   - How users can withdraw consent
   - Consent expiry and re-consent frequency

7. **Draft policy update procedure:**
   - How changes to the cookie policy are communicated
   - Re-consent requirements when new cookie categories are added
   - Version history or changelog

8. **Draft banner implementation guide:**

   - **Consent requirements by jurisdiction:**
     - EU/EEA (ePrivacy Directive + GDPR): opt-in required for non-essential cookies, prior consent before setting cookies, granular category-level consent, no cookie walls (consent cannot be condition of access)
     - UK (UK GDPR + PECR): similar to EU, opt-in for non-essential
     - California (CCPA/CPRA): opt-out model for sale/sharing of personal information, "Do Not Sell or Share" link
     - Brazil (LGPD): consent-based, similar to GDPR approach
     - Other jurisdictions: default to opt-in as safest baseline

   - **Banner design recommendations:**
     - First layer: concise purpose statement, accept/reject buttons of equal prominence, link to cookie settings and full policy
     - Second layer (preference center): category-level toggles with descriptions, individual cookie details, save preferences button
     - Accessibility requirements: keyboard navigation, screen reader compatible, sufficient contrast
     - No dark patterns: no pre-checked boxes, no confusing button hierarchy, no hidden reject option

   - **Consent storage approach:**
     - Store consent state in a first-party cookie
     - Record consent timestamp, version, and granular choices
     - Sync consent with server-side records for audit trail
     - Recommended consent management platforms (CMP) for implementation

   - **Re-consent triggers:**
     - New cookie categories added
     - Significant changes to data processing purposes
     - Consent record older than 12 months (recommended refresh)
     - Change in applicable regulations

9. **Write the artifact** — append to `.singularskills/legal/<project>/01-draft.md` under a `## Cookie Policy` section. Create the file with a `# Draft — <project>` heading if it does not exist; if a `## Cookie Policy` section already exists, replace only that section.

## Output

The cookie policy and implementation guide draft appended to `.singularskills/legal/<project>/01-draft.md`. Present a summary to the user highlighting:
- Cookie categories defined and example cookies listed
- Jurisdictions addressed and consent model per jurisdiction
- Banner implementation recommendations
- Third-party cookie integrations identified
- Areas flagged for attorney review (especially consent mechanism compliance)

**Record the run.** After you have written your section, append this line to `.singularskills/log.jsonl` (the `started` line of Prerequisites, with `"event":"finished"`): `{"ts":"<ISO timestamp>","skill":"legal-cookie-policy","workflow":"legal","phase":1,"project":"<project>","event":"finished","artifact":"01-draft.md","note":""}`.

This artifact is shared by every skill of phase 1 (Draft). The frontmatter is written once, by whoever creates the file: if you create it, open it with the block below (`skill` is the phase title, `started` the time of that first write; `gate` is `passed` when the gate ran clean and `skipped` under `--skip-checks`); if it already exists, leave the block alone except to update `finished` and to set `gate` to the worst value among the sections (`skipped` over `passed`).

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

Open your `## Cookie Policy` section with one italic line, `*<skill name> · <ISO timestamp> · gate: <passed|skipped>*` (your skill name is `legal-cookie-policy`).

End your section with `### Decisions` and `### Open questions` (one level under your `## Cookie Policy` heading, so the section stays one block), in this shape:

```markdown
### Decisions
- <what was chosen> — <why> — <what was rejected>

### Open questions
- <what the next phase or a reviewer must settle>
```

---
description: Draft employment contract or contractor agreement
---

# Employment Agreement

Draft an employment contract or contractor agreement for "$ARGUMENTS". Generate a comprehensive agreement tailored to the employment type, role, and jurisdiction.

> **Note:** AI-generated legal content does not constitute legal advice. Consult a qualified attorney.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.metapowers/legal/<project>/skip-log.md`: `- <ISO timestamp> — <skill name> skipped prerequisite check for <artifact file> — reason: <reason or "none given">`.

## Prerequisites

Check that `.metapowers/legal/<project>/00-assess.md` exists. If it does not exist, stop and tell the user:

> "Run an Assess skill first (e.g. `/legal:risk-assessment <project>`) to generate the prerequisite assessment artifact."

## Process

1. **Read inputs:**
   - Read `.metapowers/legal/<project>/00-assess.md` for risk and jurisdiction context

2. **Determine agreement type:**
   - **Employee** — W-2 / full employment relationship
   - **Independent contractor** — 1099 / contractor relationship
   - If contractor: **flag misclassification risks** — apply IRS 20-factor test or applicable jurisdiction's test (ABC test in California, IR35 in UK), document factors supporting classification, recommend corrective action if classification appears incorrect

3. **Draft the following sections:**

   - **Position and Duties** — job title, role description, primary responsibilities, reporting obligations, full-time/part-time status, exclusivity requirements (if any)
   - **Reporting Structure** — direct supervisor/manager, organizational level, dotted-line relationships
   - **Compensation and Benefits** — base salary or contractor rate, payment frequency and method, bonus/commission structure (if applicable), equity/stock options (if applicable), benefits package summary (employee only: health, dental, vision, 401k, PTO, etc.)
   - **Work Schedule and Location** — expected hours, remote/hybrid/on-site, office location, travel requirements, flexible work arrangements
   - **Probationary Period** — if applicable: duration (typically 30-90 days), evaluation criteria, termination during probation terms, conversion to regular employment
   - **IP Assignment** — assignment of all work product created during employment/engagement, scope (present and future work related to the company's business), moral rights waiver (where applicable), prior inventions exclusion list
   - **Inventions Disclosure** — obligation to disclose inventions conceived during employment/engagement, company's right of first refusal, process for determining ownership
   - **Non-Compete and Non-Solicitation** — non-compete: scope, duration, geography (with enforceability notes by jurisdiction — note FTC developments, California ban, etc.); non-solicitation of employees: scope and duration; non-solicitation of customers/clients: scope and duration
   - **Confidentiality Obligations** — definition of confidential information, obligations during and after employment/engagement, permitted disclosures, return of materials, whistleblower protections (Defend Trade Secrets Act notice)
   - **Termination Provisions** — at-will vs. for-cause distinction (employee), notice period requirements, grounds for immediate termination, severance terms (if any), garden leave provisions (if applicable), COBRA and benefits continuation
   - **Return of Property** — obligation to return all company property, devices, access credentials, documents, and copies upon termination
   - **Governing Law** — choice of law, dispute resolution, venue selection

4. **Flag jurisdiction-specific requirements:**
   - **California** — non-compete ban (Business and Professions Code 16600), required provisions for IP assignment (Labor Code 2870), final pay timing requirements
   - **New York** — non-compete enforceability standards, wage theft prevention notice
   - **EU/UK** — mandatory minimum notice periods, working time directive, TUPE implications, statutory redundancy
   - **Other jurisdictions** — identify and address requirements from the assessment

5. **Write the artifact** — append to `.metapowers/legal/<project>/01-draft.md` under a `## Employment Agreement` section. Create the file with a `# Draft — <project>` heading if it does not exist; if a `## Employment Agreement` section already exists, replace only that section. The section contains:

   ```
   ---
   description: Employment agreement draft for <project>
   ---
   ```

## Output

The employment agreement draft appended to `.metapowers/legal/<project>/01-draft.md`. Present a summary to the user highlighting:
- Agreement type (employee vs. contractor) and misclassification risk assessment
- Compensation structure outlined
- Restrictive covenant provisions and enforceability considerations
- IP assignment scope
- Jurisdiction-specific requirements addressed
- Areas flagged for attorney review

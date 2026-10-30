---
name: legal-cookie-consent
description: Design a cookie consent implementation — cookie audit and categories, opt-in or opt-out rules per jurisdiction, banner and preference-center spec, consent records, re-consent triggers and CMP setup. Use when the user is building or fixing a cookie banner or consent manager and needs to know how it must behave. Not for writing the cookie policy text; see /legal-cookie-policy.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: legal
  phase: 3
  artifact: 03-comply.md
---

# Cookie Consent

Design a cookie consent implementation for "$ARGUMENTS". Conduct a cookie audit, categorize cookies, design consent mechanisms by jurisdiction, and create an implementation checklist.

> **Note:** AI-generated legal content does not constitute legal advice. Consult a qualified attorney.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"legal-cookie-consent","workflow":"legal","phase":3,"project":"<project>","event":"skipped","artifact":"03-comply.md","note":"<reason or \"none given\">"}`.

## Prerequisites

**Part of a workflow.** This skill is phase 3 (Comply) of the Legal Lifecycle workflow (`legal`); cross-domain workflows run it too. Unless the user named this skill, check `.singularskills/log.jsonl` for an open run for this project: a `run-started` line with `"project":"<project>"` and no later `run-finished` line for the same `workflow` and `project`. If there is no open run, or the user asked to start, run, continue or resume a process or workflow rather than this one step, do not continue here: invoke the `workflow` skill with the workflow the user asked for, or `legal` when they named none, followed by `<project>`. It runs this phase in order, asks before it writes and records the run. Continue here when the user named this skill, or when an open run exists (the conductor is running you).

Run this skill's gate before writing: `sh <this skill's folder>/scripts/gate.sh <project> <project root>`, where `<project root>` is the folder that contains `.singularskills/` (use `.` when you are already there). If it exits non-zero, stop and tell the user what it printed, unless `--skip-checks` was given (see Arguments). On a refusal, before you stop, append this line to `.singularskills/log.jsonl` (create the folder and file if missing): `{"ts":"<ISO timestamp>","skill":"legal-cookie-consent","workflow":"legal","phase":3,"project":"<project>","event":"refused","artifact":"03-comply.md","note":"<what the gate printed>"}`. Once the gate has passed, or under `--skip-checks` once you have appended the `skipped` line, append this line before you start work: `{"ts":"<ISO timestamp>","skill":"legal-cookie-consent","workflow":"legal","phase":3,"project":"<project>","event":"started","artifact":"03-comply.md","note":""}`.

Check that `.singularskills/legal/<project>/00-assess.md` exists. If it does not exist, stop and tell the user:

> "Run an Assess skill first (e.g. `/legal-risk-assessment <project>`) to generate the prerequisite assessment artifact."

## Process

1. **Read inputs:**
   - Read `.singularskills/legal/<project>/00-assess.md` for risk, jurisdiction, and data practice context
   - Read any existing cookie policy or draft artifacts in `.singularskills/legal/<project>/` for additional context

2. **Conduct cookie audit:**
   - Scan site for all cookies and similar tracking technologies (local storage, session storage, pixels, fingerprinting)
   - Document each cookie/tracker: name, provider, purpose, type (first-party vs. third-party), duration (session vs. persistent with expiry)
   - Identify all third-party services that set cookies (analytics, advertising, social media, CDN, etc.)

3. **Categorize cookies:**
   - **Strictly necessary** — essential for site functionality, no consent required (session management, authentication, security, load balancing, cookie consent preferences)
   - **Functional/Preferences** — enable enhanced functionality and personalization (language preference, region selection, user interface customization)
   - **Analytics/Performance** — collect information about site usage (page views, bounce rates, traffic sources, performance monitoring)
   - **Advertising/Marketing** — track visitors across websites for advertising purposes (ad targeting, retargeting, campaign measurement, social media sharing)

4. **Design consent mechanism by jurisdiction:**
   - **EU (ePrivacy Directive + GDPR):** opt-in required for non-essential cookies, granular category control, no cookie walls (or limited use per EDPB guidance), prior consent before cookies are set
   - **UK (UK GDPR + PECR):** similar to EU post-Brexit, opt-in for non-essential, ICO enforcement guidance
   - **US (varies by state):** California — opt-out for sale/sharing via cookies; Colorado, Connecticut, Virginia — opt-out mechanisms; no federal cookie law
   - **Other jurisdictions** — document requirements for any additional applicable jurisdictions

5. **Consent banner design:**
   - **First layer:** clear and prominent banner with Accept All, Reject All, and Customize/Manage Preferences buttons; brief explanation of cookie use
   - **Second layer (preference center):** category toggles with descriptions, list of cookies per category, ability to accept/reject per category, save preferences button
   - **Design requirements:** no dark patterns, equal prominence for accept and reject, no pre-ticked boxes, accessible design (WCAG AA), mobile-responsive

6. **Consent storage:**
   - How consent choices are recorded (consent cookie, server-side storage)
   - What information to store (timestamp, version of consent text, categories accepted/rejected, method of consent)
   - How to prove consent was obtained (audit trail)
   - Consent ID for record-keeping

7. **Re-consent triggers:**
   - New cookies or tracking technologies added
   - Change in cookie purposes or categories
   - Privacy policy or cookie policy updates
   - Time-based re-consent (recommended: 6-12 months)
   - Change in applicable regulations

8. **Implementation checklist:**
   - CMP (Consent Management Platform) selection criteria and recommendations
   - Tag manager configuration (Google Tag Manager, etc.) for consent-based firing
   - Consent-before-load enforcement (no non-essential cookies until consent obtained)
   - Server-side consent checking for backend tracking
   - Testing procedures (verify no cookies set before consent, verify categories respected)
   - Integration with analytics and advertising platforms
   - Documentation and training for content and marketing teams

9. **Write the artifact** — append to `.singularskills/legal/<project>/03-comply.md` under a `## Cookie Consent` section. Create the file with a `# Comply — <project>` heading if it does not exist; if a `## Cookie Consent` section already exists, replace only that section. The section contains:

   - **Cookie Audit Results** — complete inventory of cookies and trackers
   - **Cookie Categories** — categorization with justification
   - **Jurisdictional Requirements** — consent rules per applicable jurisdiction
   - **Banner Design Specification** — first and second layer requirements
   - **Consent Storage and Proof** — recording and audit trail design
   - **Re-Consent Policy** — triggers and timelines
   - **Implementation Checklist** — step-by-step technical implementation plan
   - **Compliance Gaps** — identified gaps with remediation recommendations

## Output

The cookie consent implementation appended to `.singularskills/legal/<project>/03-comply.md`. Present a summary to the user highlighting:
- Total number of cookies/trackers identified
- Breakdown by category (necessary, functional, analytics, advertising)
- Jurisdictions addressed and consent model per jurisdiction
- Key implementation steps and CMP recommendations
- Compliance gaps requiring attention

**Record the run.** After you have written your section, append this line to `.singularskills/log.jsonl` (the `started` line of Prerequisites, with `"event":"finished"`): `{"ts":"<ISO timestamp>","skill":"legal-cookie-consent","workflow":"legal","phase":3,"project":"<project>","event":"finished","artifact":"03-comply.md","note":""}`.

This artifact is shared by every skill of phase 3 (Comply). The frontmatter is written once, by whoever creates the file: if you create it, open it with the block below (`skill` is the phase title, `started` the time of that first write; `gate` is `passed` when the gate ran clean and `skipped` under `--skip-checks`); if it already exists, leave the block alone except to update `finished` and to set `gate` to the worst value among the sections (`skipped` over `passed`).

```yaml
---
skill: Comply
workflow: legal
phase: 3
project: <project>
started: <ISO timestamp>
finished: <ISO timestamp>
agent: <the agent you run in, or "unknown">
gate: <passed|skipped>
---
```

Open your `## Cookie Consent` section with one italic line, `*<skill name> · <ISO timestamp> · gate: <passed|skipped>*` (your skill name is `legal-cookie-consent`).

End your section with `### Decisions` and `### Open questions` (one level under your `## Cookie Consent` heading, so the section stays one block), in this shape:

```markdown
### Decisions
- <what was chosen> — <why> — <what was rejected>

### Open questions
- <what the next phase or a reviewer must settle>
```

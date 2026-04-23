---
description: Design cookie consent implementation — categories, banners, tracking
---

# Cookie Consent

Design a cookie consent implementation for "$ARGUMENTS". Conduct a cookie audit, categorize cookies, design consent mechanisms by jurisdiction, and create an implementation checklist.

> **Note:** AI-generated legal content does not constitute legal advice. Consult a qualified attorney.

## Prerequisites

Check that `.legal/$ARGUMENTS/00-assess.md` exists. If it does not exist, stop and tell the user:

> "Run an Assess skill first (e.g. `/legal:risk-assessment $ARGUMENTS`) to generate the prerequisite assessment artifact."

If the user passes `--skip-checks`, bypass this check and log the skip to `.legal/$ARGUMENTS/skip-log.md` with a timestamp and the reason "Prerequisite check skipped for cookie-consent".

## Process

1. **Read inputs:**
   - Read `.legal/$ARGUMENTS/00-assess.md` for risk, jurisdiction, and data practice context
   - Read any existing cookie policy or draft artifacts in `.legal/$ARGUMENTS/` for additional context

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

9. **Write the artifact** to `.legal/$ARGUMENTS/03-comply.md` with frontmatter:

   ```
   ---
   description: Cookie consent implementation for $ARGUMENTS
   ---
   ```

   Include sections:
   - **Cookie Audit Results** — complete inventory of cookies and trackers
   - **Cookie Categories** — categorization with justification
   - **Jurisdictional Requirements** — consent rules per applicable jurisdiction
   - **Banner Design Specification** — first and second layer requirements
   - **Consent Storage and Proof** — recording and audit trail design
   - **Re-Consent Policy** — triggers and timelines
   - **Implementation Checklist** — step-by-step technical implementation plan
   - **Compliance Gaps** — identified gaps with remediation recommendations

## Output

The cookie consent implementation written to `.legal/$ARGUMENTS/03-comply.md`. Present a summary to the user highlighting:
- Total number of cookies/trackers identified
- Breakdown by category (necessary, functional, analytics, advertising)
- Jurisdictions addressed and consent model per jurisdiction
- Key implementation steps and CMP recommendations
- Compliance gaps requiring attention

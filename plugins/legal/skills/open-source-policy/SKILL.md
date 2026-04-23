---
description: Create open-source usage and contribution policy
---

# Open-Source Policy

Create an open-source usage and contribution policy for "$ARGUMENTS". Generate a comprehensive policy governing how the organization consumes and contributes to open-source software.

> **Note:** AI-generated legal content does not constitute legal advice. Consult a qualified attorney.

## Prerequisites

Check that `.metapowers/legal/$ARGUMENTS/00-assess.md` exists. If it does not exist, stop and tell the user:

> "Run an Assess skill first (e.g. `/legal:risk-assessment $ARGUMENTS`) to generate the prerequisite assessment artifact."

If the user passes `--skip-checks`, bypass this check and log the skip to `.metapowers/legal/$ARGUMENTS/skip-log.md` with a timestamp and the reason "Prerequisite check skipped for open-source-policy".

## Process

1. **Read inputs:**
   - Read `.metapowers/legal/$ARGUMENTS/00-assess.md` for risk and business context
   - Use WebSearch to research current open-source licensing landscape, recent enforcement actions, and emerging best practices

2. **Draft approved license categories with examples:**

   - **Permissive licenses (generally approved):**
     - MIT License — minimal restrictions, compatible with proprietary use
     - Apache License 2.0 — includes patent grant, notice requirements
     - BSD 2-Clause / 3-Clause — minimal restrictions, attribution required
     - ISC License — functionally equivalent to MIT
   - **Weak copyleft licenses (conditional approval — requires review):**
     - LGPL 2.1 / 3.0 — copyleft applies to modifications of the library itself, not linking code; dynamic linking generally safe, static linking requires care
     - MPL 2.0 — file-level copyleft, modifications to MPL files must be shared, proprietary files can coexist
     - EPL 2.0 — module-level copyleft, similar to MPL but with patent provisions
   - **Strong copyleft licenses (restricted — requires legal approval):**
     - GPL 2.0 / 3.0 — copyleft extends to derivative works, use in proprietary products requires careful analysis
     - AGPL 3.0 — network use triggers copyleft, highest restriction for SaaS products
     - SSPL — controversial license, not OSI-approved, treated as restricted
   - **Prohibited licenses:**
     - Licenses with field-of-use restrictions incompatible with business purpose
     - Custom or unclear licenses without legal review
     - Licenses with viral patent retaliation clauses conflicting with company patent portfolio

3. **Draft approval process for new dependencies:**
   - Who can approve (engineering lead for permissive, legal for weak/strong copyleft)
   - Approval criteria: license compatibility, maintenance status, security track record, community health
   - Fast-track process for pre-approved permissive licenses
   - Escalation path for edge cases and unknown licenses

4. **Draft scanning and compliance procedures:**
   - Recommended scanning tools (e.g., FOSSA, Snyk, Black Duck, Licensee, license-checker)
   - CI/CD integration requirements — scan on every build, block on policy violations
   - Regular audit schedule (quarterly full scan)
   - Remediation process for discovered violations

5. **Draft contribution policy:**
   - CLA (Contributor License Agreement) requirements — when to require one, recommended CLA template
   - Contribution license — under what license employees contribute (typically same as project or Apache 2.0)
   - Approval process for contributing to external projects
   - Approval process for open-sourcing internal projects
   - Guidelines for what can and cannot be contributed (no proprietary code, no customer data, no security-sensitive code)

6. **Draft license compatibility matrix:**
   - Matrix showing which licenses can be combined in the same project
   - Inbound vs. outbound license compatibility
   - Special considerations for linking, bundling, and distribution

7. **Draft SBOM requirements:**
   - Software Bill of Materials format (SPDX, CycloneDX)
   - Generation frequency and triggers (every release, every dependency change)
   - Storage and accessibility requirements
   - Customer-facing SBOM obligations (if applicable)

8. **Draft open-source review triggers:**
   - New projects or repositories
   - Major dependency updates (major version bumps)
   - Acquisitions and mergers (audit target's OSS usage)
   - Change of distribution model (internal tool to customer-facing product)
   - Entering new markets with different regulatory requirements

9. **Write the artifact** to `.metapowers/legal/$ARGUMENTS/01-draft.md` with frontmatter:

   ```
   ---
   description: Open-source policy draft for $ARGUMENTS
   ---
   ```

## Output

The open-source policy draft written to `.metapowers/legal/$ARGUMENTS/01-draft.md`. Present a summary to the user highlighting:
- License categories and approval levels defined
- Scanning and compliance tools recommended
- Contribution policy scope
- Key review triggers established
- Areas flagged for attorney review (especially copyleft boundary analysis)

---
name: legal-open-source-policy
description: Create an open-source usage and contribution policy — approved, restricted and prohibited licenses, dependency approval, license scanning in CI, contribution and CLA rules, a compatibility matrix and SBOM requirements. Use when the user's engineers need rules on which open-source licenses they may use or how they may contribute to outside projects.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: legal
  phase: 1
  artifact: 01-draft.md
---

# Open-Source Policy

Create an open-source usage and contribution policy for "$ARGUMENTS". Generate a comprehensive policy governing how the organization consumes and contributes to open-source software.

> **Note:** AI-generated legal content does not constitute legal advice. Consult a qualified attorney.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"<skill name>","workflow":"legal","phase":<phase>,"project":"<project>","event":"skipped","artifact":"<artifact file>","note":"<reason or \"none given\">"}`.

## Prerequisites

Run `scripts/gate.sh <project>` from this skill's folder. If it exits non-zero, stop and tell the user what it printed (unless `--skip-checks`, see Arguments).

Check that `.singularskills/legal/<project>/00-assess.md` exists. If it does not exist, stop and tell the user:

> "Run an Assess skill first (e.g. `/legal-risk-assessment <project>`) to generate the prerequisite assessment artifact."

## Process

1. **Read inputs:**
   - Read `.singularskills/legal/<project>/00-assess.md` for risk and business context
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

9. **Write the artifact** — append to `.singularskills/legal/<project>/01-draft.md` under a `## Open-Source Policy` section. Create the file with a `# Draft — <project>` heading if it does not exist; if a `## Open-Source Policy` section already exists, replace only that section.

## Output

The open-source policy draft appended to `.singularskills/legal/<project>/01-draft.md`. Present a summary to the user highlighting:
- License categories and approval levels defined
- Scanning and compliance tools recommended
- Contribution policy scope
- Key review triggers established
- Areas flagged for attorney review (especially copyleft boundary analysis)

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

Open your `## Open-Source Policy` section with one italic line, `*<skill name> · <ISO timestamp> · gate: <passed|skipped>*` (your skill name is `legal-open-source-policy`).

End your section with `### Decisions` and `### Open questions` (one level under your `## Open-Source Policy` heading, so the section stays one block), in this shape:

```markdown
### Decisions
- <what was chosen> — <why> — <what was rejected>

### Open questions
- <what the next phase or a reviewer must settle>
```

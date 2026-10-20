---
name: ip-review
description: Review the intellectual property terms in an agreement — background and foreground IP, assignment and work-for-hire, license grants, open-source conflicts, freedom to operate and common IP traps. Use when the user asks who will own the work, code or inventions under a contract, or whether a license grant goes too far.
argument-hint: "[project] [--skip-checks]"
---

# IP Review

Review intellectual property provisions for "$ARGUMENTS". Analyze ownership structures, license grants, assignment provisions, and open-source implications to identify IP-related risks and traps.

> **Note:** AI-generated legal content does not constitute legal advice. Consult a qualified attorney.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.metapowers/legal/<project>/skip-log.md`: `- <ISO timestamp> — <skill name> skipped prerequisite check for <artifact file> — reason: <reason or "none given">`.

## Prerequisites

Check that `.metapowers/legal/<project>/00-assess.md` exists. If it does not exist, stop and tell the user:

> "Run an Assess skill first (e.g. `/legal:risk-assessment <project>`) to generate the prerequisite assessment artifact."

## Process

1. **Read inputs:**
   - Read `.metapowers/legal/<project>/00-assess.md` for risk and jurisdiction context
   - Read IP-related provisions from the document provided by the user

2. **Analyze ownership structure:**
   - **Background IP** — pre-existing IP each party brings to the relationship
   - **Foreground IP** — IP created during the engagement
   - **Joint IP** — IP created collaboratively (ownership, licensing, and exploitation rights)
   - Verify clear delineation between background and foreground IP

3. **Review work-for-hire vs. assignment provisions:**
   - Does the relationship qualify for work-for-hire under applicable law?
   - If assignment is used, is it present assignment ("hereby assigns") or future obligation?
   - Are moral rights addressed (waiver or retention)?
   - Is consideration adequate for the scope of assignment?

4. **Analyze license grants:**
   - **Scope** — what IP is licensed and for what purpose
   - **Exclusivity** — exclusive vs. non-exclusive
   - **Sublicensing** — right to sublicense and any restrictions
   - **Territory** — geographic scope of the license
   - **Duration** — term of the license (fixed, perpetual, tied to agreement)
   - **Revocability** — can the license be revoked and under what conditions

5. **Assess open-source implications:**
   - Do any open-source licenses conflict with IP assignment or exclusivity?
   - Are there copyleft obligations that could affect proprietary code?
   - Is there an open-source usage policy referenced or required?
   - Check for license compatibility between open-source components

6. **Evaluate freedom to operate:**
   - Can each party continue its business without infringing on rights granted?
   - Are there restrictions that limit future product development?
   - Do non-compete or non-solicit provisions affect IP exploitation?

7. **Review invention disclosure obligations:**
   - Are there obligations to disclose inventions created during the engagement?
   - What is the scope of disclosure (only related inventions or all inventions)?
   - Are there time-limited obligations that extend beyond the agreement?

8. **Flag common IP traps:**
   - Overly broad assignment (all IP, not just project-related)
   - Missing background IP carve-out (existing IP inadvertently assigned)
   - Perpetual irrevocable licenses without adequate consideration
   - Ambiguous ownership of derivative works
   - No license-back for assigned IP needed in ongoing operations
   - IP representations without adequate knowledge qualifiers

9. **Write the artifact** — append to `.metapowers/legal/<project>/02-review.md` under a `## IP Review` section. Create the file with a `# Review — <project>` heading if it does not exist; if a `## IP Review` section already exists, replace only that section. The section contains:

   - **Ownership Analysis** — background IP, foreground IP, and joint IP breakdown
   - **Assignment and Work-for-Hire** — structure, adequacy, and moral rights
   - **License Grant Summary** — scope, exclusivity, territory, duration per license
   - **Open-Source Assessment** — compatibility analysis and copyleft risks
   - **Freedom to Operate** — impact on each party's ongoing business
   - **Invention Disclosure** — obligations and scope
   - **IP Traps Identified** — flagged issues with risk explanation
   - **Recommendations** — specific actions to mitigate IP risks

## Output

The IP review appended to `.metapowers/legal/<project>/02-review.md`. Present a summary to the user highlighting:
- Ownership structure (who owns what, and is it clearly defined?)
- IP traps identified and their severity
- Open-source compatibility concerns
- Top recommendations for IP protection

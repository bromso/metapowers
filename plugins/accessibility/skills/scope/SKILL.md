---
name: scope
description: Define the scope of a full accessibility audit — target, sample pages, WCAG level, standards such as Section 508 or EN 301 549, and test methods. Use when the user wants a site or app audited for accessibility and needs a target and test plan first. Not for a quick check, a Figma design or mentoring feedback; see /accessibility:checklist, /design:a11y-audit or /coaching:a11y.
argument-hint: "[project] [--skip-checks]"
---

# Scope

Define the accessibility audit scope for "$ARGUMENTS". Determine what to test, which WCAG level to target, and what pages or features to include.

See also `/coaching:a11y` for mentoring feedback on one piece of work, `/design:a11y-audit` for a one-pass Figma check, `/compliance:ada-wcag` for an ADA lawsuit-risk assessment, or `/legal:accessibility-compliance` for a multi-market legal map, instead of scoping the full audit.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.metapowers/accessibility/<project>/skip-log.md`: `- <ISO timestamp> — <skill name> skipped prerequisite check for <artifact file> — reason: <reason or "none given">`.

## Prerequisites

None — this is the first phase.

## Process

1. **Understand the audit target:**
   - What is "<project>"? A website, app, component, feature, or page?
   - Ask the user to clarify if ambiguous

2. **Define the scope:**
   - Which pages or features to test (sample representative pages)
   - Which WCAG level to target (A, AA, or AAA — recommend AA as baseline)
   - Any specific compliance requirements (Section 508, EN 301 549, EAA)
   - Any known accessibility concerns to prioritize

3. **Identify testing approach:**
   - Automated testing: code analysis, ARIA validation, contrast checks
   - Manual testing: keyboard navigation, screen reader flow, focus management
   - Content review: alt text quality, heading structure, link text

4. **Write the artifact** to `.metapowers/accessibility/<project>/01-scope.md` with sections:
   - **Target** — what's being audited
   - **WCAG Level** — target conformance level
   - **Pages/Features** — specific items to test
   - **Compliance Requirements** — applicable standards
   - **Testing Methods** — automated + manual approach
   - **Known Concerns** — pre-existing issues to prioritize

## Output

The audit scope written to `.metapowers/accessibility/<project>/01-scope.md`. Present a summary to the user highlighting:
- Scope boundaries
- Target WCAG level
- Testing approach

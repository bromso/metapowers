---
name: accessibility-scope
description: Define the scope of a full accessibility audit — target, sample pages, WCAG level, standards such as Section 508 or EN 301 549, and test methods. Use when the user wants a site or app audited for accessibility and needs a target and test plan first. Not for a quick check, a Figma design or mentoring feedback; see /accessibility-checklist, /design-a11y-audit or /coaching-a11y.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: accessibility
  phase: 1
  artifact: 01-scope.md
---

# Scope

Define the accessibility audit scope for "$ARGUMENTS". Determine what to test, which WCAG level to target, and what pages or features to include.

See also `/coaching-a11y` for mentoring feedback on one piece of work, `/design-a11y-audit` for a one-pass Figma check, `/compliance-ada-wcag` for an ADA lawsuit-risk assessment, or `/legal-accessibility-compliance` for a multi-market legal map, instead of scoping the full audit.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"accessibility-scope","workflow":"accessibility","phase":1,"project":"<project>","event":"skipped","artifact":"01-scope.md","note":"<reason or \"none given\">"}`.

## Prerequisites

**Part of a workflow.** This skill is phase 1 (Scope) of the WCAG-EM workflow (`accessibility`); cross-domain workflows run it too. Unless the user named this skill, check `.singularskills/log.jsonl` for an open run for this project: a `run-started` line with `"project":"<project>"` and no later `run-finished` line for the same `workflow` and `project`. If there is no open run, or the user asked to start, run, continue or resume a process or workflow rather than this one step, do not continue here: invoke the `workflow` skill with the workflow the user asked for, or `accessibility` when they named none, followed by `<project>`. It runs this phase in order, asks before it writes and records the run. Continue here when the user named this skill, or when an open run exists (the conductor is running you).

Before you start work, append this line to `.singularskills/log.jsonl` (create the folder and file if missing): `{"ts":"<ISO timestamp>","skill":"accessibility-scope","workflow":"accessibility","phase":1,"project":"<project>","event":"started","artifact":"01-scope.md","note":""}`.

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

4. **Write the artifact** to `.singularskills/accessibility/<project>/01-scope.md` with sections:
   - **Target** — what's being audited
   - **WCAG Level** — target conformance level
   - **Pages/Features** — specific items to test
   - **Compliance Requirements** — applicable standards
   - **Testing Methods** — automated + manual approach
   - **Known Concerns** — pre-existing issues to prioritize

## Output

The audit scope written to `.singularskills/accessibility/<project>/01-scope.md`. Present a summary to the user highlighting:
- Scope boundaries
- Target WCAG level
- Testing approach

**Record the run.** After you have written the artifact, append this line to `.singularskills/log.jsonl` (the `started` line of Prerequisites, with `"event":"finished"`): `{"ts":"<ISO timestamp>","skill":"accessibility-scope","workflow":"accessibility","phase":1,"project":"<project>","event":"finished","artifact":"01-scope.md","note":""}`.

Open the artifact with this frontmatter (`agent` is the agent you run in, or `unknown`; `gate` is `none`, as this phase has no gate):

```yaml
---
skill: accessibility-scope
workflow: accessibility
phase: 1
project: <project>
started: <ISO timestamp>
finished: <ISO timestamp>
agent: <the agent you run in, or "unknown">
gate: none
---
```

End the artifact with `## Decisions` and `## Open questions`, in this shape:

```markdown
## Decisions
- <what was chosen> — <why> — <what was rejected>

## Open questions
- <what the next phase or a reviewer must settle>
```

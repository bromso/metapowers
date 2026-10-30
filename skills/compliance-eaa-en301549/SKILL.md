---
name: compliance-eaa-en301549
description: Assess European Accessibility Act and EN 301 549 compliance — what is in scope, WCAG 2.1 AA mapping, non-web requirements and the conformance statement. Use when the user sells digital products or services in the EU and asks which are in scope and how they measure up. Not for the audit or a multi-market legal map; see /accessibility-scope or /legal-accessibility-compliance.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: compliance
  phase: 1
  artifact: 01-assess/
---

# EAA / EN 301 549 Assessment

Assess European Accessibility Act (EAA) and EN 301 549 compliance for "$ARGUMENTS". Determine product/service scope, evaluate against EN 301 549 requirements, and assess functional accessibility across all modalities.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"compliance-eaa-en301549","workflow":"compliance","phase":1,"project":"<project>","event":"skipped","artifact":"01-assess/","note":"<reason or \"none given\">"}`.

## Prerequisites

**Part of a workflow.** This skill is phase 1 (Assess) of the GRC Lifecycle workflow (`compliance`); cross-domain workflows run it too. Unless the user named this skill, check `.singularskills/log.jsonl` for an open run for this project: a `run-started` line with `"project":"<project>"` and no later `run-finished` line for the same `workflow` and `project`. If there is no open run, or the user asked to start, run, continue or resume a process or workflow rather than this one step, do not continue here: invoke the `workflow` skill with the workflow the user asked for, or `compliance` when they named none, followed by `<project>`. It runs this phase in order, asks before it writes and records the run. Continue here when the user named this skill, or when an open run exists (the conductor is running you).

Run this skill's gate before writing: `sh <this skill's folder>/scripts/gate.sh <project> <project root>`, where `<project root>` is the folder that contains `.singularskills/` (use `.` when you are already there). If it exits non-zero, stop and tell the user what it printed, unless `--skip-checks` was given (see Arguments). On a refusal, before you stop, append this line to `.singularskills/log.jsonl` (create the folder and file if missing): `{"ts":"<ISO timestamp>","skill":"compliance-eaa-en301549","workflow":"compliance","phase":1,"project":"<project>","event":"refused","artifact":"01-assess/","note":"<what the gate printed>"}`. Once the gate has passed, or under `--skip-checks` once you have appended the `skipped` line, append this line before you start work: `{"ts":"<ISO timestamp>","skill":"compliance-eaa-en301549","workflow":"compliance","phase":1,"project":"<project>","event":"started","artifact":"01-assess/","note":""}`.

Read `.singularskills/compliance/<project>/00-scope.md`. If this file does not exist, tell the user:

> Phase 0 (Scope) has not been completed for "<project>". Run `/compliance-regulatory-landscape <project>` first, or use `--skip-checks` to bypass.

## Process

1. **Read context files:**
   - Read `references/grc-lifecycle-guide.md` for GRC methodology reference
   - Read `references/assessment-template.md` for output structure
   - Read `.singularskills/compliance/<project>/00-scope.md` for scope and control framework context

2. **EAA scope determination:**
   - Determine which products and services fall under EAA scope (effective June 2025)
   - Assess applicability across covered sectors: e-commerce services, banking and financial services, transport services, e-books and e-readers, digital communications (telephony, messaging), access to audiovisual media services
   - Evaluate micro-enterprise exemption eligibility (fewer than 10 employees and turnover/balance sheet under 2M EUR)
   - Assess disproportionate burden defense availability where applicable
   - Document in-scope products, services, and digital touchpoints

3. **EN 301 549 web and mobile assessment (mapping to WCAG 2.1 AA):**
   - Assess web content against WCAG 2.1 Level AA success criteria:
     - **Perceivable:** text alternatives, time-based media alternatives, adaptable content, distinguishable content (contrast, resize, audio control)
     - **Operable:** keyboard accessible, enough time, seizures/physical reactions, navigable, input modalities
     - **Understandable:** readable, predictable, input assistance
     - **Robust:** compatible with assistive technologies, parsing, name/role/value
   - Evaluate mobile application accessibility (native apps, hybrid apps)
   - Assess responsive design and zoom/magnification support
   - Review touch target sizes and gesture alternatives

4. **EN 301 549 non-web requirements:**
   - Assess hardware accessibility requirements (if applicable): physical controls, operable parts, tactile discernibility
   - Evaluate documentation and support service accessibility
   - Review ICT with two-way voice communication requirements (real-time text, caller ID)
   - Assess video communication accessibility (sign language, lip-reading support)
   - Evaluate authoring tools and content management system accessibility

5. **Functional accessibility requirements assessment:**
   - **Usage without vision:** Assess screen reader compatibility, audio descriptions, tactile alternatives
   - **Usage with limited vision:** Evaluate magnification support, contrast options, text resizing, spacing adjustments
   - **Usage without perception of color:** Assess color-independent information conveyance
   - **Usage without hearing:** Evaluate captions, transcripts, visual alternatives for audio content
   - **Usage with limited manipulation:** Assess alternative input methods, single-pointer operation, keyboard-only operation
   - **Usage with limited reach:** Evaluate touch target accessibility, alternative interaction methods
   - **Minimized photosensitive seizure triggers:** Assess flashing content limits (3 flashes per second threshold)
   - **Usage with limited cognition:** Evaluate plain language, consistent navigation, error prevention, sufficient time

6. **Conformance statement and documentation:**
   - Assess EU accessibility conformance statement requirements
   - Evaluate conformance assessment methodology (self-assessment or third-party)
   - Review accessibility statement content (conformance level, known issues, contact information, enforcement procedure)
   - Assess feedback mechanism for accessibility issues
   - Evaluate market surveillance and enforcement preparation

7. **Testing and monitoring:**
   - Assess current accessibility testing practices (automated, manual, user testing with assistive technologies)
   - Evaluate assistive technology testing coverage (screen readers, magnifiers, switch access, voice control)
   - Review remediation tracking and regression testing procedures
   - Assess ongoing monitoring and periodic reassessment plan

8. **Write the artifact** to `.singularskills/compliance/<project>/01-assess/eaa-en301549.md` following the assessment template structure with:
    - **EAA Scope** — in-scope products/services and exemption analysis
    - **WCAG 2.1 AA Assessment** — compliance per principle (perceivable, operable, understandable, robust)
    - **Non-Web Requirements** — hardware, documentation, and communication accessibility
    - **Functional Accessibility** — assessment per functional requirement category
    - **Conformance Statement** — documentation and declaration readiness
    - **Testing Practices** — current testing coverage and methodology
    - **Evidence Inventory** — existing evidence and evidence gaps
    - **Remediation Priorities** — ranked list of gaps to address

## Output

The EAA/EN 301 549 assessment written to `.singularskills/compliance/<project>/01-assess/eaa-en301549.md`. Present a summary to the user highlighting:
- Number of in-scope products/services and exemption applicability
- WCAG 2.1 AA compliance level per principle
- Functional accessibility coverage across all modalities
- Top 3 gaps requiring remediation

**Record the run.** After you have written the artifact, append this line to `.singularskills/log.jsonl` (the `started` line of Prerequisites, with `"event":"finished"`): `{"ts":"<ISO timestamp>","skill":"compliance-eaa-en301549","workflow":"compliance","phase":1,"project":"<project>","event":"finished","artifact":"01-assess/","note":""}`.

Open the artifact with this frontmatter (`agent` is the agent you run in, or `unknown`; `gate` is `passed` when the gate ran clean and `skipped` under `--skip-checks`):

```yaml
---
skill: compliance-eaa-en301549
workflow: compliance
phase: 1
project: <project>
started: <ISO timestamp>
finished: <ISO timestamp>
agent: <the agent you run in, or "unknown">
gate: <passed|skipped>
---
```

End the artifact with `## Decisions` and `## Open questions`, in this shape:

```markdown
## Decisions
- <what was chosen> — <why> — <what was rejected>

## Open questions
- <what the next phase or a reviewer must settle>
```

End the artifact with this paragraph, verbatim:

> **Not legal or audit advice.** This artifact supports preparation for compliance work; certification, attestation and regulatory conclusions require a qualified auditor or counsel.

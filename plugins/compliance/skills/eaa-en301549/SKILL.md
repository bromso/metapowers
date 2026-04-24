---
description: Assess European Accessibility Act / EN 301 549 compliance
---

# EAA / EN 301 549 Assessment

Assess European Accessibility Act (EAA) and EN 301 549 compliance for "$ARGUMENTS". Determine product/service scope, evaluate against EN 301 549 requirements, and assess functional accessibility across all modalities.

## Prerequisites

Read `.metapowers/compliance/$ARGUMENTS/00-scope.md`. If this file does not exist, tell the user:

> Phase 0 (Scope) has not been completed for "$ARGUMENTS". Run `/compliance:regulatory-landscape $ARGUMENTS` first, or use `--skip-checks` to bypass.

If `--skip-checks` is present in $ARGUMENTS, skip this check.

## Process

1. **Read context files:**
   - Read `plugins/compliance/shared/grc-lifecycle-guide.md` for GRC methodology reference
   - Read `plugins/compliance/shared/assessment-template.md` for output structure
   - Read `.metapowers/compliance/$ARGUMENTS/00-scope.md` for scope and control framework context

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

8. **Write the artifact** to `.metapowers/compliance/$ARGUMENTS/01-assess/eaa-en301549.md` following the assessment template structure with:
    - **EAA Scope** — in-scope products/services and exemption analysis
    - **WCAG 2.1 AA Assessment** — compliance per principle (perceivable, operable, understandable, robust)
    - **Non-Web Requirements** — hardware, documentation, and communication accessibility
    - **Functional Accessibility** — assessment per functional requirement category
    - **Conformance Statement** — documentation and declaration readiness
    - **Testing Practices** — current testing coverage and methodology
    - **Evidence Inventory** — existing evidence and evidence gaps
    - **Remediation Priorities** — ranked list of gaps to address

## Output

The EAA/EN 301 549 assessment written to `.metapowers/compliance/$ARGUMENTS/01-assess/eaa-en301549.md`. Present a summary to the user highlighting:
- Number of in-scope products/services and exemption applicability
- WCAG 2.1 AA compliance level per principle
- Functional accessibility coverage across all modalities
- Top 3 gaps requiring remediation

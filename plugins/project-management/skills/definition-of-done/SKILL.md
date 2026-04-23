---
description: Establish shared DoD criteria for stories, sprints, and releases
---

# Definition of Done

Establish the Definition of Done for "$ARGUMENTS". Define quality criteria at story, sprint, and release levels, calibrated to team maturity and project needs.

## Prerequisites

None — this is a Phase 0 (Initiate) skill and can run first.

## Process

1. **Read existing context:**
   - Read `.project/$ARGUMENTS/00-initiate.md` if it exists (for project charter, team setup, and working agreements context)

2. **Define story-level DoD:**
   - **Code quality:**
     - Code written and follows agreed coding standards
     - Peer reviewed and approved (per code review SLA)
     - No linting errors or warnings
     - Technical debt documented if introduced intentionally
   - **Testing:**
     - Unit tests written and passing
     - Integration tests written where applicable
     - Test coverage meets or exceeds team threshold (define target, e.g., 80%)
     - Edge cases and error paths tested
   - **Documentation:**
     - Code comments for complex logic
     - API documentation updated (if public-facing)
     - User-facing documentation updated (if applicable)
   - **Acceptance:**
     - Acceptance criteria met and verified
     - Product Owner has reviewed and accepted
     - Demo-ready for sprint review
   - **Deployment:**
     - Merged to main branch
     - CI pipeline passes (build, test, lint)
     - No regressions introduced

3. **Define sprint-level DoD:**
   - All committed stories meet story-level DoD
   - Sprint increment is potentially shippable
   - Demo prepared and presented in sprint review
   - No critical or high-severity bugs remaining
   - Sprint metrics updated (velocity, burndown)
   - Retrospective held and action items captured
   - Product backlog refined for next sprint (at least top items)

4. **Define release-level DoD:**
   - All sprint-level criteria met for included sprints
   - Deployed to staging and smoke-tested
   - Deployed to production successfully
   - Monitoring and alerting in place for new functionality
   - Performance benchmarks met (load time, throughput, error rate)
   - Release notes published
   - Stakeholders notified per communication plan
   - Rollback plan documented and tested
   - Support team briefed on changes

5. **Calibrate to team maturity:**
   - **New teams:** start with essential criteria, add more as team matures
   - **Experienced teams:** include advanced criteria (performance, accessibility, security)
   - Mark criteria as "required" vs. "aspirational" to set realistic expectations
   - Plan quarterly reviews to evolve the DoD as the team grows

6. **Include quality criteria where applicable:**
   - **Performance:** page load time, API response time, resource usage
   - **Accessibility:** WCAG compliance level (A, AA, AAA), screen reader testing
   - **Security:** OWASP top 10 check, dependency vulnerability scan, secrets scan
   - **Browser/device support:** define supported matrix
   - Tag criteria as applicable per project type (web, mobile, API, data pipeline)

7. **Write the artifact** — append to `.project/$ARGUMENTS/00-initiate.md` under a `## Definition of Done` section:
   - **Story-Level DoD** — checklist of criteria (code, testing, docs, acceptance, deployment)
   - **Sprint-Level DoD** — checklist of criteria (stories done, demo, bugs, metrics, retro)
   - **Release-Level DoD** — checklist of criteria (deploy, monitoring, release notes, rollback)
   - **Quality Criteria** — performance, accessibility, security thresholds
   - **Maturity Notes** — current calibration level and evolution plan

## Output

Definition of Done appended to `.project/$ARGUMENTS/00-initiate.md`. Present a summary highlighting:
- DoD checklist at each level (story, sprint, release)
- Key quality criteria and thresholds
- Maturity calibration and planned evolution

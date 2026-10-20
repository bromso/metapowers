---
description: Design legal compliance training program for the team
---

# Training Plan

Design a legal compliance training program for "$ARGUMENTS". Identify training needs by role, design training modules, set cadence and tracking, and plan delivery methods.

> **Note:** AI-generated legal content does not constitute legal advice. Consult a qualified attorney.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.metapowers/legal/<project>/skip-log.md`: `- <ISO timestamp> — <skill name> skipped prerequisite check for <artifact file> — reason: <reason or "none given">`.

## Prerequisites

Check that `.metapowers/legal/<project>/00-assess.md` exists. If it does not exist, stop and tell the user:

> "Run an Assess skill first (e.g. `/legal:risk-assessment <project>`) to generate the prerequisite assessment artifact."

## Process

1. **Read inputs:**
   - Read `.metapowers/legal/<project>/00-assess.md` for risk context, applicable regulations, and organizational profile
   - Review any existing compliance artifacts in `.metapowers/legal/<project>/`

2. **Identify training needs by role:**
   - **All employees:**
     - Data protection basics (handling personal data, recognizing data breaches)
     - Confidentiality obligations (trade secrets, proprietary information)
     - Code of conduct and ethics
     - Reporting procedures (whistleblower channels, incident reporting)
   - **Engineering:**
     - Open-source license compliance (permissive vs. copyleft, attribution requirements)
     - Security practices (secure coding, vulnerability handling, access controls)
     - Data handling in development (test data, production data separation)
     - IP considerations (invention assignments, prior art awareness)
   - **Sales:**
     - Contract terms they can and cannot negotiate
     - NDA procedures and standard terms
     - Anti-bribery and anti-corruption basics
     - Competition law essentials (pricing discussions, market allocation)
   - **HR:**
     - Employment law basics (hiring, termination, documentation)
     - Discrimination and harassment prevention and response
     - Leave and accommodation requirements
     - Employee data privacy
   - **Procurement:**
     - Vendor assessment and due diligence requirements
     - Contract review fundamentals
     - Conflict of interest policies
     - Supply chain compliance obligations

3. **Design training modules with learning objectives:**
   - For each module, define:
     - **Title** — clear, descriptive module name
     - **Target audience** — which roles must complete this module
     - **Learning objectives** — specific, measurable outcomes (e.g., "Identify the three types of personal data under GDPR")
     - **Duration** — estimated time to complete
     - **Content outline** — key topics covered
     - **Practical exercises** — scenarios, case studies, or simulations

4. **Set training cadence:**
   - **Onboarding** — required modules completed within first 30 days of employment
   - **Annual refresh** — mandatory annual recertification on core compliance topics
   - **Event-triggered training** — additional training required when:
     - New regulations take effect
     - A compliance incident occurs
     - Role changes require new competencies
     - Policy updates are implemented
   - Define grace periods and consequences for non-completion

5. **Define completion tracking and certification:**
   - Track completion status per employee per module
   - Issue certificates of completion with expiration dates
   - Generate compliance reports showing organization-wide training status
   - Set minimum passing scores for assessments
   - Maintain audit-ready training records

6. **Create assessment questions per module:**
   - Develop knowledge-check questions aligned with learning objectives
   - Include scenario-based questions testing practical application
   - Mix question formats (multiple choice, true/false, scenario response)
   - Define passing threshold (recommended: 80% minimum)
   - Create question pool for randomized assessments

7. **Identify delivery method per module:**
   - **E-learning** — self-paced online modules for foundational topics
   - **Live workshop** — interactive sessions for complex or discussion-heavy topics
   - **Documentation** — reference guides and quick-reference cards for ongoing use
   - **Micro-learning** — short, focused content for specific updates or reminders
   - Match delivery method to content complexity and audience needs

8. **Plan regulatory-specific training:**
   - **GDPR awareness** — data subject rights, lawful bases, cross-border transfers
   - **CCPA requirements** — consumer rights, opt-out mechanisms, service provider obligations
   - **SOC 2 controls** — security policies, access management, incident response
   - **Accessibility (WCAG)** — accessible design principles, testing procedures, remediation
   - Tailor regulatory training depth to each role's exposure level

9. **Write the artifact** — append to `.metapowers/legal/<project>/04-govern.md` under a `## Training Plan` section. Create the file with a `# Govern — <project>` heading if it does not exist; if a `## Training Plan` section already exists, replace only that section. The section contains:

   - **Training Needs Matrix** — role-based training requirements
   - **Module Catalog** — all training modules with objectives and durations
   - **Training Cadence** — schedule for onboarding, refresh, and event-triggered training
   - **Tracking and Certification** — completion tracking approach and reporting
   - **Assessment Framework** — sample questions and passing criteria per module
   - **Delivery Methods** — method selection rationale per module
   - **Regulatory Training Plan** — regulation-specific training details

## Output

The training plan appended to `.metapowers/legal/<project>/04-govern.md`. Present a summary to the user highlighting:
- Total number of training modules and their target audiences
- Training cadence overview (onboarding, annual, event-triggered)
- Key regulatory training requirements
- Recommended delivery methods and tracking approach

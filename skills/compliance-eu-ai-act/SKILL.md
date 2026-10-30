---
name: compliance-eu-ai-act
description: Assess EU AI Act compliance — inventory AI systems, classify them by risk tier, screen for prohibited practices, and check high-risk, GPAI and transparency obligations against the enforcement timeline. Use when the user builds or deploys AI used in the EU and wants to assess how their own systems are classified and what they must change to comply.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: compliance
  phase: 1
  artifact: 01-assess/
---

# EU AI Act Assessment

Assess EU AI Act compliance for "$ARGUMENTS". Classify AI systems by risk level, evaluate prohibited practice avoidance, assess high-risk system requirements, and review transparency obligations.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"compliance-eu-ai-act","workflow":"compliance","phase":1,"project":"<project>","event":"skipped","artifact":"01-assess/","note":"<reason or \"none given\">"}`.

## Prerequisites

**Part of a workflow.** This skill is phase 1 (Assess) of the GRC Lifecycle workflow (`compliance`); cross-domain workflows run it too. First check `.singularskills/log.jsonl` for an open run for this project: a `run-started` line with `"project":"<project>"` and no later `run-finished` line for the same `workflow` and `project`. If one exists, the conductor is running you: continue here. Otherwise, if the user asked to start, run, continue or resume a process or workflow rather than this one step, do not continue here: invoke the `workflow` skill with the workflow the user asked for, or `compliance` when they named none, followed by `<project>`; it runs this phase in order, asks before it writes and records the run. Otherwise continue here: a later phase runs on its own, behind its gate.

Run this skill's gate before writing: `sh <this skill's folder>/scripts/gate.sh <project> <project root>`, where `<project root>` is the folder that contains `.singularskills/` (use `.` when you are already there). If it exits non-zero, stop and tell the user what it printed, unless `--skip-checks` was given (see Arguments). On a refusal, before you stop, append this line to `.singularskills/log.jsonl` (create the folder and file if missing): `{"ts":"<ISO timestamp>","skill":"compliance-eu-ai-act","workflow":"compliance","phase":1,"project":"<project>","event":"refused","artifact":"01-assess/","note":"<what the gate printed>"}`. Once the gate has passed, or under `--skip-checks` once you have appended the `skipped` line, append this line before you start work: `{"ts":"<ISO timestamp>","skill":"compliance-eu-ai-act","workflow":"compliance","phase":1,"project":"<project>","event":"started","artifact":"01-assess/","note":""}`.

Read `.singularskills/compliance/<project>/00-scope.md`. If this file does not exist, tell the user:

> Phase 0 (Scope) has not been completed for "<project>". Run `/compliance-regulatory-landscape <project>` first, or use `--skip-checks` to bypass.

## Process

1. **Read context files:**
   - Read `references/grc-lifecycle-guide.md` for GRC methodology reference
   - Read `references/assessment-template.md` for output structure
   - Read `.singularskills/compliance/<project>/00-scope.md` for scope and control framework context

2. **AI system inventory and risk classification:**
   - Inventory all AI systems deployed or under development
   - Classify each system by EU AI Act risk level:
     - **Unacceptable risk (prohibited):** social scoring, real-time remote biometric identification (with exceptions), manipulation/exploitation, emotion recognition in workplace/education
     - **High-risk:** Annex III systems (biometrics, critical infrastructure, education, employment, essential services, law enforcement, migration, justice) and safety components of Annex I products
     - **Limited risk:** transparency obligations (chatbots, emotion recognition, deepfakes, AI-generated content)
     - **Minimal risk:** voluntary codes of conduct
   - Document classification rationale for each system

3. **Prohibited practices assessment:**
   - Check all AI systems against the prohibited practices list (Art 5)
   - Assess subliminal manipulation techniques, exploitation of vulnerabilities
   - Review social scoring systems or behavioral prediction for detrimental treatment
   - Evaluate real-time remote biometric identification usage and exemptions
   - Document any systems requiring immediate remediation or discontinuation

4. **High-risk system requirements (if applicable):**
   - **Risk management system (Art 9):** Assess continuous risk identification, estimation, evaluation, and mitigation throughout the AI lifecycle
   - **Data governance (Art 10):** Evaluate training, validation, and testing data quality, relevance, representativeness, and bias examination
   - **Technical documentation (Art 11):** Review documentation completeness for demonstrating conformity
   - **Record-keeping (Art 12):** Assess automatic logging capabilities for traceability
   - **Transparency to users (Art 13):** Evaluate instructions for use, intended purpose, accuracy levels, and known limitations
   - **Human oversight (Art 14):** Assess human-in-the-loop, human-on-the-loop, or human-in-command measures
   - **Accuracy, robustness, cybersecurity (Art 15):** Evaluate performance metrics, resilience to errors, and security measures

5. **General-purpose AI model obligations:**
   - Determine if any GPAI models are used or provided (Art 51-56)
   - Assess technical documentation and information sharing obligations
   - Evaluate compliance with Copyright Directive obligations
   - For GPAI with systemic risk: assess model evaluation, adversarial testing, incident reporting, and cybersecurity requirements

6. **Transparency obligations:**
   - Assess AI interaction disclosure (users must know they are interacting with AI)
   - Evaluate emotion recognition and biometric categorization disclosure
   - Review deepfake and AI-generated content labeling
   - Assess AI-generated content marking requirements

7. **Conformity assessment and registration:**
   - Determine applicable conformity assessment procedure (self-assessment or third-party)
   - Assess EU database registration requirements
   - Evaluate CE marking requirements for high-risk systems
   - Review EU representative appointment for non-EU providers

8. **Timeline and phased enforcement:**
   - Map current compliance against enforcement timeline (prohibited practices: Feb 2025, GPAI: Aug 2025, high-risk Annex III: Aug 2026, high-risk Annex I: Aug 2027)
   - Identify time-critical compliance activities
   - Assess readiness for applicable enforcement phases

9. **Write the artifact** to `.singularskills/compliance/<project>/01-assess/eu-ai-act.md` following the assessment template structure with:
    - **AI System Inventory** — complete inventory with risk classification per system
    - **Prohibited Practices** — screening results and any systems requiring action
    - **High-Risk Requirements** — assessment per Art 9-15 requirement for each high-risk system
    - **GPAI Obligations** — general-purpose AI model compliance status
    - **Transparency** — disclosure and labeling obligations coverage
    - **Conformity and Registration** — assessment procedure readiness
    - **Enforcement Timeline** — phased compliance readiness map
    - **Evidence Inventory** — existing evidence and evidence gaps
    - **Remediation Priorities** — ranked list of gaps to address

## Output

The EU AI Act assessment written to `.singularskills/compliance/<project>/01-assess/eu-ai-act.md`. Present a summary to the user highlighting:
- Number of AI systems inventoried and risk classification distribution
- Any prohibited practice concerns requiring immediate action
- High-risk system compliance readiness score — score = (Compliant + 0.5 × Partial) ÷ applicable requirements (N/A excluded), as a percentage
- Top 3 gaps requiring remediation

**Record the run.** After you have written the artifact, append this line to `.singularskills/log.jsonl` (the `started` line of Prerequisites, with `"event":"finished"`): `{"ts":"<ISO timestamp>","skill":"compliance-eu-ai-act","workflow":"compliance","phase":1,"project":"<project>","event":"finished","artifact":"01-assess/","note":""}`.

Open the artifact with this frontmatter (`agent` is the agent you run in, or `unknown`; `gate` is `passed` when the gate ran clean and `skipped` under `--skip-checks`):

```yaml
---
skill: compliance-eu-ai-act
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

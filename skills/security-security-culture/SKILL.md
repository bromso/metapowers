---
name: security-security-culture
description: Design a security culture program — awareness maturity, a security champions program, gamification and incentives, and behavior metrics such as phishing click and reporting rates. Use when security is seen as a blocker, staff rarely report problems, or the user wants security champions in teams. Not for the training curriculum itself; see /security-security-training.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: security
  phase: 0
  artifact: 00-govern.md
---

# Security Culture

Design a security awareness program and culture-building initiatives for "$ARGUMENTS". Build a human-centric security program that goes beyond compliance checkboxes to create lasting behavioral change.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"<skill name>","workflow":"security","phase":<phase>,"project":"<project>","event":"skipped","artifact":"<artifact file>","note":"<reason or \"none given\">"}`.

## Prerequisites

None — this is a Phase 0 Govern skill.

## Process

1. **Assess current security awareness level:**
   - Evaluate existing training programs, completion rates, and effectiveness
   - Review recent security incident data for human-factor trends (phishing clicks, credential sharing, data mishandling)
   - Identify the organization's security maturity stage: reactive, compliant, proactive, or embedded
   - Note cultural factors: is security seen as a blocker or an enabler?

2. **Outline the training approach (themes per audience):**
   - **All staff** — phishing awareness, password hygiene, social engineering recognition, clean desk policy, reporting procedures
   - **Developers** — secure coding practices (OWASP Top 10), dependency management, secrets handling, code review for security
   - **IT / Operations** — secure configuration, patch management, access provisioning, logging and monitoring
   - **Leadership** — risk governance, security investment decisions, regulatory obligations, incident communication
   - **New hires** — security onboarding module covering policies, tools, and expectations
   - Define delivery methods: interactive e-learning, live workshops, lunch-and-learns, hands-on labs
   - Keep this to the culture-level outline — hand off the full module catalog, cadence, completion tracking and assessments to `/security-security-training`

3. **Plan security champions program:**
   - Define champion selection criteria (interest, influence, technical aptitude)
   - Establish champion-to-team ratio (recommend 1 champion per 8-10 developers)
   - Define champion responsibilities: security review participation, team coaching, vulnerability triage, threat model facilitation
   - Create champion development path: training curriculum, certification support, community of practice
   - Plan regular champion meetups for knowledge sharing and escalation

4. **Define gamification and incentives:**
   - **Recognition programs** — security hero of the month, bug bounty leaderboard, responsible disclosure acknowledgments
   - **Competitions** — capture-the-flag events, phishing simulation contests, secure coding challenges
   - **Career incentives** — security certifications as professional development, champion role on performance reviews
   - **Team metrics** — security scorecard per team (vulnerability fix rate, training completion, incident response time)
   - Ensure incentives reward reporting, not just prevention (avoid blame culture)

5. **Set measurement criteria:**
   - **Phishing simulation results** — click rate trend over time (target: <5% click rate)
   - **Training completion rates** — percentage of staff completing required modules on time (target: >95%)
   - **Incident reporting rates** — number of security concerns reported by staff (higher is better; indicates trust)
   - **Time to report** — average time between suspicious activity and report submission
   - **Security champion engagement** — champion activity metrics (reviews conducted, issues raised, training delivered)
   - Define reporting cadence and dashboard requirements

6. **Write the artifact** — append to `.singularskills/security/<project>/00-govern.md` under a `## Security Culture` section. Create the file with a `# Govern — <project>` heading if it does not exist; if a `## Security Culture` section already exists, replace only that section. The section contains:

   ### Security Culture Program

   Include sections:
   - **Current State Assessment** — awareness maturity and key gaps
   - **Training Approach** — themes, cadence and audiences; the role-based curriculum is produced by `/security-security-training`
   - **Security Champions Program** — structure, responsibilities, and development path
   - **Gamification & Incentives** — recognition, competitions, and career incentives
   - **Measurement Framework** — KPIs, targets, and reporting cadence

## Output

The security culture program appended to `.singularskills/security/<project>/00-govern.md`. Present a summary to the user highlighting:
- Current awareness maturity assessment
- Training approach — themes, cadence and audiences (curriculum via `/security-security-training`)
- Security champions program structure
- Key metrics and measurement targets

**Record the run.** This artifact is shared by every skill of phase 0 (Govern). The frontmatter is written once, by whoever creates the file: if you create it, open it with the block below (`skill` is the phase title, `started` the time of that first write; `gate` is `none`, as this phase has no gate); if it already exists, leave the block alone except to update `finished` and to set `gate` to the worst value among the sections (`skipped` over `passed`).

```yaml
---
skill: Govern
workflow: security
phase: 0
project: <project>
started: <ISO timestamp>
finished: <ISO timestamp>
agent: <the agent you run in, or "unknown">
gate: none
---
```

Open your `## Security Culture` section with one italic line, `*<skill name> · <ISO timestamp> · gate: <passed|skipped>*` (your skill name is `security-security-culture`).

End the artifact (or your section of a shared artifact) with `## Decisions` and `## Open questions`, in this shape:

```markdown
## Decisions
- <what was chosen> — <why> — <what was rejected>

## Open questions
- <what the next phase or a reviewer must settle>
```

End the artifact with this paragraph, verbatim:

> **Not a penetration test or audit.** This artifact is generated analysis; validate findings against the live system and have material controls reviewed by a qualified security professional.

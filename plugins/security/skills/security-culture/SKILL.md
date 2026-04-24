---
description: Design security awareness program and culture-building initiatives
---

# Security Culture

Design a security awareness program and culture-building initiatives for "$ARGUMENTS". Build a human-centric security program that goes beyond compliance checkboxes to create lasting behavioral change.

## Prerequisites

None — this is a Phase 0 Govern skill.

## Process

1. **Assess current security awareness level:**
   - Evaluate existing training programs, completion rates, and effectiveness
   - Review recent security incident data for human-factor trends (phishing clicks, credential sharing, data mishandling)
   - Identify the organization's security maturity stage: reactive, compliant, proactive, or embedded
   - Note cultural factors: is security seen as a blocker or an enabler?

2. **Design role-based training program:**
   - **All staff** — phishing awareness, password hygiene, social engineering recognition, clean desk policy, reporting procedures
   - **Developers** — secure coding practices (OWASP Top 10), dependency management, secrets handling, code review for security
   - **IT / Operations** — secure configuration, patch management, access provisioning, logging and monitoring
   - **Leadership** — risk governance, security investment decisions, regulatory obligations, incident communication
   - **New hires** — security onboarding module covering policies, tools, and expectations
   - Define delivery methods: interactive e-learning, live workshops, lunch-and-learns, hands-on labs

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

6. **Write the artifact** to `.metapowers/security/$ARGUMENTS/00-govern.md` with heading:

   ## Security Culture Program

   Include sections:
   - **Current State Assessment** — awareness maturity and key gaps
   - **Training Program** — role-based curriculum with delivery methods and schedule
   - **Security Champions Program** — structure, responsibilities, and development path
   - **Gamification & Incentives** — recognition, competitions, and career incentives
   - **Measurement Framework** — KPIs, targets, and reporting cadence

## Output

The security culture program written to `.metapowers/security/$ARGUMENTS/00-govern.md`. Present a summary to the user highlighting:
- Current awareness maturity assessment
- Training modules by role with recommended delivery timeline
- Security champions program structure
- Key metrics and measurement targets

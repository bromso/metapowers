---
name: legal-legal-playbook
description: Create a legal playbook for recurring scenarios — contract negotiation, breach response, terminations, IP disputes, vendor onboarding — with decision trees, approval thresholds, escalation rules and turnaround times per team. Use when the user wants sales, HR, engineering or procurement to handle routine legal situations without asking legal every time.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: legal
  phase: 4
  artifact: 04-govern.md
---

# Legal Playbook

Create a standardized legal playbook for "$ARGUMENTS". Define decision trees, approval thresholds, pre-approved templates, escalation criteria, and timeline expectations for recurring legal scenarios.

> **Note:** AI-generated legal content does not constitute legal advice. Consult a qualified attorney.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"legal-legal-playbook","workflow":"legal","phase":4,"project":"<project>","event":"skipped","artifact":"04-govern.md","note":"<reason or \"none given\">"}`.

## Prerequisites

Run this skill's gate before writing: `sh <this skill's folder>/scripts/gate.sh <project> <project root>`, where `<project root>` is the folder that contains `.singularskills/` (use `.` when you are already there). If it exits non-zero, stop and tell the user what it printed, unless `--skip-checks` was given (see Arguments).

Check that `.singularskills/legal/<project>/00-assess.md` exists. If it does not exist, stop and tell the user:

> "Run an Assess skill first (e.g. `/legal-risk-assessment <project>`) to generate the prerequisite assessment artifact."

## Process

1. **Read inputs:**
   - Read `.singularskills/legal/<project>/00-assess.md` for risk context, jurisdiction, and organizational profile
   - Review any existing legal artifacts in `.singularskills/legal/<project>/`

2. **Identify recurring legal scenarios:**
   - **Contract negotiation** — standard terms, acceptable deviations, deal-breakers
   - **Data breach response** — detection, containment, notification, remediation
   - **Employee termination** — voluntary, involuntary, for cause, layoff procedures
   - **IP dispute** — infringement claims, cease-and-desist responses, defensive actions
   - **Vendor onboarding** — due diligence, contract requirements, risk assessment
   - **M&A due diligence** — legal review scope, red flags, documentation requirements
   - **Regulatory inquiry** — response protocols, document preservation, communication rules
   - Tailor scenarios to the specific needs of "<project>"

3. **Create decision tree for each scenario:**
   - Define the triggering event (what initiates the scenario)
   - Map decision points with if/then logic (if X, then Y)
   - Identify the possible outcomes at each branch
   - Include time constraints at each decision point
   - Document the rationale for each recommended path

4. **Define approval thresholds:**
   - **Pre-approved actions** — what can proceed without legal review (e.g., standard NDA execution, routine contract renewals under a value threshold)
   - **Legal review required** — what needs internal legal sign-off (e.g., non-standard terms, contracts above value threshold, new vendor categories)
   - **Outside counsel required** — what needs external legal involvement (e.g., litigation, complex regulatory matters, high-value transactions)
   - Set clear monetary and risk-based thresholds for each level

5. **List pre-approved templates and fallback positions:**
   - For each scenario, identify available templates (NDAs, standard contracts, response letters)
   - Define preferred terms and acceptable fallback positions for negotiations
   - Document which template modifications are acceptable without additional review
   - Maintain version control references for all templates

6. **Set escalation criteria:**
   - Define when to involve internal legal counsel
   - Define when to involve outside counsel
   - Define when to notify executive leadership
   - Include specific triggers: monetary thresholds, reputational risk, regulatory exposure, litigation threats
   - Set maximum response times for each escalation level

7. **Include timeline expectations:**
   - Standard turnaround times for each scenario type
   - Expedited process for urgent matters
   - SLA definitions for legal team response
   - External dependencies and typical third-party timelines

8. **Organize playbook by audience:**
   - **Sales team** — contract negotiation, NDA procedures, deal approval workflows
   - **Engineering** — open-source compliance, IP considerations, security incident response
   - **HR** — employment law procedures, termination protocols, discrimination/harassment response
   - **Procurement** — vendor assessment, contract review, supplier risk management
   - Each audience section should be self-contained with relevant scenarios only

9. **Write the artifact** — append to `.singularskills/legal/<project>/04-govern.md` under a `## Legal Playbook` section. Create the file with a `# Govern — <project>` heading if it does not exist; if a `## Legal Playbook` section already exists, replace only that section. The section contains:

   - **Scenario Index** — overview of all covered scenarios with quick-reference links
   - **Decision Trees** — visual decision flow per scenario
   - **Approval Matrix** — thresholds and required approvals by scenario and value
   - **Templates and Fallback Positions** — available templates with modification guidelines
   - **Escalation Guide** — when and how to escalate by scenario type
   - **Timeline Expectations** — standard and expedited turnaround times
   - **Audience-Specific Guides** — tailored playbook sections per team

## Output

The legal playbook appended to `.singularskills/legal/<project>/04-govern.md`. Present a summary to the user highlighting:
- Number of scenarios covered and their categorization
- Key approval thresholds and escalation triggers
- Available pre-approved templates
- Audience-specific guide overview

**Record the run.** Append each of these events to `.singularskills/log.jsonl` as one line (create the folder and file if missing):

- Before you start work (once the gate has passed or `--skip-checks` was given): `{"ts":"<ISO timestamp>","skill":"legal-legal-playbook","workflow":"legal","phase":4,"project":"<project>","event":"started","artifact":"04-govern.md","note":""}`
- After you have written your section: the same line with `"event":"finished"`.
- If the gate refused and the user did not bypass it: the same line with `"event":"refused"` and `"note"` set to what the gate printed, instead of the other two; then stop.

This artifact is shared by every skill of phase 4 (Govern). The frontmatter is written once, by whoever creates the file: if you create it, open it with the block below (`skill` is the phase title, `started` the time of that first write; `gate` is `passed` when the gate ran clean and `skipped` under `--skip-checks`); if it already exists, leave the block alone except to update `finished` and to set `gate` to the worst value among the sections (`skipped` over `passed`).

```yaml
---
skill: Govern
workflow: legal
phase: 4
project: <project>
started: <ISO timestamp>
finished: <ISO timestamp>
agent: <the agent you run in, or "unknown">
gate: <passed|skipped>
---
```

Open your `## Legal Playbook` section with one italic line, `*<skill name> · <ISO timestamp> · gate: <passed|skipped>*` (your skill name is `legal-legal-playbook`).

End your section with `### Decisions` and `### Open questions` (one level under your `## Legal Playbook` heading, so the section stays one block), in this shape:

```markdown
### Decisions
- <what was chosen> — <why> — <what was rejected>

### Open questions
- <what the next phase or a reviewer must settle>
```

---
name: legal-employment-agreement
description: Draft an employment contract or independent contractor agreement — duties, pay, IP assignment, restrictive covenants, confidentiality and termination, flagging misclassification risk and state or country rules. Use when the user is hiring an employee or engaging a contractor and needs the agreement written.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: legal
  phase: 1
  artifact: 01-draft.md
---

# Employment Agreement

Draft an employment contract or contractor agreement for "$ARGUMENTS". Generate a comprehensive agreement tailored to the employment type, role, and jurisdiction.

> **Note:** AI-generated legal content does not constitute legal advice. Consult a qualified attorney.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"legal-employment-agreement","workflow":"legal","phase":1,"project":"<project>","event":"skipped","artifact":"01-draft.md","note":"<reason or \"none given\">"}`.

## Prerequisites

**Part of a workflow.** This skill is phase 1 (Draft) of the Legal Lifecycle workflow (`legal`); cross-domain workflows run it too. First check `.singularskills/log.jsonl` for an open run for this project: a `run-started` line with `"project":"<project>"` and no later `run-finished` line for the same `workflow` and `project`. If one exists, the conductor is running you: continue here. Otherwise, if the user asked to start, run, continue or resume a process or workflow rather than this one step, do not continue here: invoke the `workflow` skill with the workflow the user asked for, or `legal` when they named none, followed by `<project>`; it runs this phase in order, asks before it writes and records the run. Otherwise continue here: a later phase runs on its own, behind its gate.

Run this skill's gate before writing: `sh <this skill's folder>/scripts/gate.sh <project> <project root>`, where `<project root>` is the folder that contains `.singularskills/` (use `.` when you are already there). If it exits non-zero, stop and tell the user what it printed, unless `--skip-checks` was given (see Arguments). On a refusal, before you stop, append this line to `.singularskills/log.jsonl` (create the folder and file if missing): `{"ts":"<ISO timestamp>","skill":"legal-employment-agreement","workflow":"legal","phase":1,"project":"<project>","event":"refused","artifact":"01-draft.md","note":"<what the gate printed>"}`. Once the gate has passed, or under `--skip-checks` once you have appended the `skipped` line, append this line before you start work: `{"ts":"<ISO timestamp>","skill":"legal-employment-agreement","workflow":"legal","phase":1,"project":"<project>","event":"started","artifact":"01-draft.md","note":""}`.

Check that `.singularskills/legal/<project>/00-assess.md` exists. If it does not exist, stop and tell the user:

> "Run an Assess skill first (e.g. `/legal-risk-assessment <project>`) to generate the prerequisite assessment artifact."

## Process

1. **Read inputs:**
   - Read `.singularskills/legal/<project>/00-assess.md` for risk and jurisdiction context

2. **Determine agreement type:**
   - **Employee** — W-2 / full employment relationship
   - **Independent contractor** — 1099 / contractor relationship
   - If contractor: **flag misclassification risks** — apply IRS 20-factor test or applicable jurisdiction's test (ABC test in California, IR35 in UK), document factors supporting classification, recommend corrective action if classification appears incorrect

3. **Draft the following sections:**

   - **Position and Duties** — job title, role description, primary responsibilities, reporting obligations, full-time/part-time status, exclusivity requirements (if any)
   - **Reporting Structure** — direct supervisor/manager, organizational level, dotted-line relationships
   - **Compensation and Benefits** — base salary or contractor rate, payment frequency and method, bonus/commission structure (if applicable), equity/stock options (if applicable), benefits package summary (employee only: health, dental, vision, 401k, PTO, etc.)
   - **Work Schedule and Location** — expected hours, remote/hybrid/on-site, office location, travel requirements, flexible work arrangements
   - **Probationary Period** — if applicable: duration (typically 30-90 days), evaluation criteria, termination during probation terms, conversion to regular employment
   - **IP Assignment** — assignment of all work product created during employment/engagement, scope (present and future work related to the company's business), moral rights waiver (where applicable), prior inventions exclusion list
   - **Inventions Disclosure** — obligation to disclose inventions conceived during employment/engagement, company's right of first refusal, process for determining ownership
   - **Non-Compete and Non-Solicitation** — non-compete: scope, duration, geography (with enforceability notes by jurisdiction — note FTC developments, California ban, etc.); non-solicitation of employees: scope and duration; non-solicitation of customers/clients: scope and duration
   - **Confidentiality Obligations** — definition of confidential information, obligations during and after employment/engagement, permitted disclosures, return of materials, whistleblower protections (Defend Trade Secrets Act notice)
   - **Termination Provisions** — at-will vs. for-cause distinction (employee), notice period requirements, grounds for immediate termination, severance terms (if any), garden leave provisions (if applicable), COBRA and benefits continuation
   - **Return of Property** — obligation to return all company property, devices, access credentials, documents, and copies upon termination
   - **Governing Law** — choice of law, dispute resolution, venue selection

4. **Flag jurisdiction-specific requirements:**
   - **California** — non-compete ban (Business and Professions Code 16600), required provisions for IP assignment (Labor Code 2870), final pay timing requirements
   - **New York** — non-compete enforceability standards, wage theft prevention notice
   - **EU/UK** — mandatory minimum notice periods, working time directive, TUPE implications, statutory redundancy
   - **Other jurisdictions** — identify and address requirements from the assessment

5. **Write the artifact** — append to `.singularskills/legal/<project>/01-draft.md` under a `## Employment Agreement` section. Create the file with a `# Draft — <project>` heading if it does not exist; if a `## Employment Agreement` section already exists, replace only that section.

## Output

The employment agreement draft appended to `.singularskills/legal/<project>/01-draft.md`. Present a summary to the user highlighting:
- Agreement type (employee vs. contractor) and misclassification risk assessment
- Compensation structure outlined
- Restrictive covenant provisions and enforceability considerations
- IP assignment scope
- Jurisdiction-specific requirements addressed
- Areas flagged for attorney review

**Record the run.** After you have written your section, append this line to `.singularskills/log.jsonl` (the `started` line of Prerequisites, with `"event":"finished"`): `{"ts":"<ISO timestamp>","skill":"legal-employment-agreement","workflow":"legal","phase":1,"project":"<project>","event":"finished","artifact":"01-draft.md","note":""}`.

This artifact is shared by every skill of phase 1 (Draft). The frontmatter is written once, by whoever creates the file: if you create it, open it with the block below (`skill` is the phase title, `started` the time of that first write; `gate` is `passed` when the gate ran clean and `skipped` under `--skip-checks`); if it already exists, leave the block alone except to update `finished` and to set `gate` to the worst value among the sections (`skipped` over `passed`).

```yaml
---
skill: Draft
workflow: legal
phase: 1
project: <project>
started: <ISO timestamp>
finished: <ISO timestamp>
agent: <the agent you run in, or "unknown">
gate: <passed|skipped>
---
```

Open your `## Employment Agreement` section with one italic line, `*<skill name> · <ISO timestamp> · gate: <passed|skipped>*` (your skill name is `legal-employment-agreement`).

End your section with `### Decisions` and `### Open questions` (one level under your `## Employment Agreement` heading, so the section stays one block), in this shape:

```markdown
### Decisions
- <what was chosen> — <why> — <what was rejected>

### Open questions
- <what the next phase or a reviewer must settle>
```

---
name: legal-privacy-policy
description: Draft a GDPR- and CCPA-compliant privacy policy — data collected, purposes and lawful basis, sharing, retention, user rights, transfers, children's privacy and Do Not Sell provisions. Use when the user needs a privacy policy written or updated for their website, app or product. Not for cookie-specific disclosures; see /legal-cookie-policy.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: legal
  phase: 1
  artifact: 01-draft.md
---

# Privacy Policy

Draft a GDPR/CCPA-compliant privacy policy for "$ARGUMENTS". Generate a comprehensive privacy policy that satisfies major data protection regulations.

> **Note:** AI-generated legal content does not constitute legal advice. Consult a qualified attorney.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"legal-privacy-policy","workflow":"legal","phase":1,"project":"<project>","event":"skipped","artifact":"01-draft.md","note":"<reason or \"none given\">"}`.

## Prerequisites

**Part of a workflow.** This skill is phase 1 (Draft) of the Legal Lifecycle workflow (`legal`); cross-domain workflows run it too. First check `.singularskills/log.jsonl` for an open run for this project: a `run-started` line with `"project":"<project>"` and no later `run-finished` line for the same `workflow` and `project`. If one exists, the conductor is running you: continue here. Otherwise, if the user asked to start, run, continue or resume a process or workflow rather than this one step, do not continue here: invoke the `workflow` skill with the workflow the user asked for, or `legal` when they named none, followed by `<project>`; it runs this phase in order, asks before it writes and records the run. Otherwise continue here: a later phase runs on its own, behind its gate.

Run this skill's gate before writing: `sh <this skill's folder>/scripts/gate.sh <project> <project root>`, where `<project root>` is the folder that contains `.singularskills/` (use `.` when you are already there). If it exits non-zero, stop and tell the user what it printed, unless `--skip-checks` was given (see Arguments). On a refusal, before you stop, append this line to `.singularskills/log.jsonl` (create the folder and file if missing): `{"ts":"<ISO timestamp>","skill":"legal-privacy-policy","workflow":"legal","phase":1,"project":"<project>","event":"refused","artifact":"01-draft.md","note":"<what the gate printed>"}`. Once the gate has passed, or under `--skip-checks` once you have appended the `skipped` line, append this line before you start work: `{"ts":"<ISO timestamp>","skill":"legal-privacy-policy","workflow":"legal","phase":1,"project":"<project>","event":"started","artifact":"01-draft.md","note":""}`.

Check that `.singularskills/legal/<project>/00-assess.md` exists. If it does not exist, stop and tell the user:

> "Run an Assess skill first (e.g. `/legal-risk-assessment <project>`) to generate the prerequisite assessment artifact."

## Process

1. **Read inputs:**
   - Read `.singularskills/legal/<project>/00-assess.md` for risk, jurisdiction, and data practice context

2. **Identify data practices:**
   - What personal data is collected (categories and specific examples)
   - How data is collected (directly from users, automatically, from third parties)
   - Purposes for processing each data category
   - Lawful basis for processing under GDPR (consent, contract, legitimate interest, legal obligation, vital interest, public task)
   - Data sharing relationships with third parties
   - Data retention timelines per category
   - International data transfer mechanisms

3. **Draft GDPR Article 13/14 compliant sections:**

   - **Data Controller Identity and Contact** — legal name, address, contact details, EU representative (if applicable)
   - **Data Collected** — categories with specific examples (identifiers, contact info, financial data, usage data, device data, location data, etc.)
   - **Purposes and Lawful Basis** — per-category breakdown of why data is processed and the legal basis for each
   - **Data Sharing with Third Parties** — who receives data, why, and in what capacity (processor vs. controller)
   - **Data Retention Periods** — per-category retention periods with rationale
   - **User Rights** — access, rectification, erasure, restriction, portability, objection, and how to exercise each right
   - **Automated Decision-Making and Profiling** — whether used, logic involved, significance and consequences, right to opt out
   - **Cookie Usage** — summary with link to full cookie policy
   - **International Data Transfers** — transfer mechanisms (SCCs, adequacy decisions, BCRs) and safeguards
   - **Children's Privacy** — age restrictions, COPPA compliance (if applicable), parental consent mechanisms
   - **Policy Updates Procedure** — how changes are communicated, effective date handling
   - **DPO / Contact Information** — Data Protection Officer details (if appointed), supervisory authority contact, complaint procedures

4. **Add CCPA-specific provisions (if applicable):**
   - Categories of personal information collected (CCPA categories)
   - Right to know, right to delete, right to opt out of sale/sharing
   - "Do Not Sell or Share My Personal Information" link requirement
   - Financial incentive disclosures (if any)
   - Authorized agent procedures
   - Non-discrimination statement

5. **Write the artifact** — append to `.singularskills/legal/<project>/01-draft.md` under a `## Privacy Policy` section. Create the file with a `# Draft — <project>` heading if it does not exist; if a `## Privacy Policy` section already exists, replace only that section.

## Output

The privacy policy draft appended to `.singularskills/legal/<project>/01-draft.md`. Present a summary to the user highlighting:
- Regulations addressed (GDPR, CCPA, others)
- Number of data categories documented
- Third-party data sharing relationships identified
- User rights enumerated
- Areas flagged for attorney review (especially lawful basis determinations and transfer mechanisms)

**Record the run.** After you have written your section, append this line to `.singularskills/log.jsonl` (the `started` line of Prerequisites, with `"event":"finished"`): `{"ts":"<ISO timestamp>","skill":"legal-privacy-policy","workflow":"legal","phase":1,"project":"<project>","event":"finished","artifact":"01-draft.md","note":""}`.

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

Open your `## Privacy Policy` section with one italic line, `*<skill name> · <ISO timestamp> · gate: <passed|skipped>*` (your skill name is `legal-privacy-policy`).

End your section with `### Decisions` and `### Open questions` (one level under your `## Privacy Policy` heading, so the section stays one block), in this shape:

```markdown
### Decisions
- <what was chosen> — <why> — <what was rejected>

### Open questions
- <what the next phase or a reviewer must settle>
```

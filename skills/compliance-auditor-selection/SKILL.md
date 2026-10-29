---
name: compliance-auditor-selection
description: Evaluate and shortlist audit firms with weighted selection criteria, an RFP template and a scoring matrix, including combined SOC 2 and ISO 27001 engagements. Use when the user needs to pick an auditor or certification body, compare audit firm quotes, or write an RFP for an audit.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: compliance
  phase: 3
  artifact: 03-certify.md
---

# Auditor Selection

Evaluate and select audit firms for "$ARGUMENTS" based on industry expertise, regulation experience, cost, and timeline to find the best fit for the organization's certification goals.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"<skill name>","workflow":"compliance","phase":<phase>,"project":"<project>","event":"skipped","artifact":"<artifact file>","note":"<reason or \"none given\">"}`.

## Prerequisites

Run `scripts/gate.sh <project>` from this skill's folder. If it exits non-zero, stop and tell the user what it printed (unless `--skip-checks`, see Arguments).

Read `.singularskills/compliance/<project>/00-scope.md`. If this file does not exist, tell the user:

> Phase 0 (Scope) has not been completed for "<project>". Run `/compliance-regulatory-landscape <project>` first, or use `--skip-checks` to bypass.

## Process

1. **Read context files:**
   - Read `references/grc-lifecycle-guide.md` for GRC methodology reference
   - Read `.singularskills/compliance/<project>/00-scope.md` for scope and applicable regulations
   - Read `.singularskills/compliance/<project>/03-certify.md` for audit readiness status

2. **Define selection criteria:**
   - Industry expertise — experience with organization's sector
   - Regulation experience — certifications the firm can audit (SOC 2, ISO 27001, HIPAA, etc.)
   - Geographic coverage — can they audit all relevant locations?
   - Team size and availability — can they staff the engagement in the desired window?
   - Cost — engagement fees, travel costs, additional charges
   - Timeline — availability for desired audit window
   - References — client references in similar industry/size
   - Combined audit capability — can they audit multiple standards simultaneously?

3. **Create shortlist:**
   - Identify 3-5 candidate audit firms
   - Research firm reputation, specializations, and recent engagements
   - Consider Big 4, mid-tier, and boutique firms based on organization size and needs
   - Check for conflicts of interest

4. **Prepare RFP:**
   - Define scope — regulations, locations, systems in scope
   - Define timeline — desired audit window, report delivery date
   - Define deliverables — audit report, management letter, certificate
   - Request pricing structure — fixed fee vs. hourly, payment terms
   - Request team qualifications — lead auditor experience, certifications held
   - Request references — 2-3 comparable clients

5. **Evaluation framework:**
   - Score each firm against selection criteria (weighted scoring)
   - Evaluate RFP responses for completeness and quality
   - Check references — ask about responsiveness, thoroughness, communication
   - Negotiate terms — scope, timeline, pricing, re-audit clauses
   - Consider combined audits (SOC 2 + ISO 27001 with same firm for efficiency and cost savings)

6. **Write the artifact** — append to `.singularskills/compliance/<project>/03-certify.md` under a `## Auditor Selection` section. Create the file with a `# Certify — <project>` heading if it does not exist; if a `## Auditor Selection` section already exists, replace only that section. The section contains:
   - **Selection Criteria** — weighted criteria with scoring methodology
   - **Candidate Shortlist** — firms under consideration with profiles
   - **RFP Template** — prepared RFP for distribution
   - **Evaluation Matrix** — scoring framework for comparing responses
   - **Combined Audit Opportunities** — multi-standard audit possibilities
   - **Recommended Next Steps** — timeline for RFP distribution, evaluation, and selection

## Output

The auditor selection plan appended to `.singularskills/compliance/<project>/03-certify.md`. Present a summary to the user highlighting:
- Selection criteria and weights
- Recommended number of firms to evaluate
- Combined audit opportunities identified
- Suggested timeline for selection process

**Record the run.** This artifact is shared by every skill of phase 3 (Certify). The frontmatter is written once, by whoever creates the file: if you create it, open it with the block below (`skill` is the phase title, `started` the time of that first write; `gate` is `passed` when the gate ran clean and `skipped` under `--skip-checks`); if it already exists, leave the block alone except to update `finished` and to set `gate` to the worst value among the sections (`skipped` over `passed`).

```yaml
---
skill: Certify
workflow: compliance
phase: 3
project: <project>
started: <ISO timestamp>
finished: <ISO timestamp>
agent: <the agent you run in, or "unknown">
gate: <passed|skipped>
---
```

Open your `## Auditor Selection` section with one italic line, `*<skill name> · <ISO timestamp> · gate: <passed|skipped>*` (your skill name is `compliance-auditor-selection`).

End your section with `### Decisions` and `### Open questions` (one level under your `## Auditor Selection` heading, so the section stays one block), in this shape:

```markdown
### Decisions
- <what was chosen> — <why> — <what was rejected>

### Open questions
- <what the next phase or a reviewer must settle>
```

End the artifact with this paragraph, verbatim:

> **Not legal or audit advice.** This artifact supports preparation for compliance work; certification, attestation and regulatory conclusions require a qualified auditor or counsel.

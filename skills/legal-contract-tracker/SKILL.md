---
name: legal-contract-tracker
description: Set up contract management — a contract register, 90/60/30-day renewal and expiration alerts, renegotiation candidates, obligation tracking and a recommended tool or process. Use when the user keeps missing renewal or notice deadlines, or needs a handle on all their contracts and what each one commits them to.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: legal
  phase: 4
  artifact: 04-govern.md
---

# Contract Tracker

Set up contract management for "$ARGUMENTS". Create a contract register, configure renewal and expiration alerts, identify contracts needing renegotiation, and track ongoing obligations.

> **Note:** AI-generated legal content does not constitute legal advice. Consult a qualified attorney.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"<skill name>","workflow":"legal","phase":<phase>,"project":"<project>","event":"skipped","artifact":"<artifact file>","note":"<reason or \"none given\">"}`.

## Prerequisites

Run `scripts/gate.sh <project>` from this skill's folder. If it exits non-zero, stop and tell the user what it printed (unless `--skip-checks`, see Arguments).

Check that `.singularskills/legal/<project>/00-assess.md` exists. If it does not exist, stop and tell the user:

> "Run an Assess skill first (e.g. `/legal-risk-assessment <project>`) to generate the prerequisite assessment artifact."

## Process

1. **Read inputs:**
   - Read `.singularskills/legal/<project>/00-assess.md` for risk context, jurisdiction, and regulatory landscape
   - Gather information about the organization's existing contracts and management processes

2. **Create contract register:**
   - Define register fields:
     - **Contract ID** — unique identifier for each contract
     - **Parties** — all parties to the contract
     - **Type** — contract category (SaaS, vendor, employment, NDA, etc.)
     - **Effective date** — when the contract takes effect
     - **Expiration date** — when the contract ends
     - **Auto-renewal terms** — whether the contract auto-renews and under what conditions
     - **Notice period for non-renewal** — deadline to provide notice to prevent auto-renewal
     - **Contract value** — total or annual contract value
     - **Key obligations** — critical deliverables and commitments per party
     - **Assigned owner** — internal owner responsible for managing the contract

3. **Set up renewal and expiration alert schedule:**
   - **90 days before expiration** — initial alert to assigned owner for review and planning
   - **60 days before expiration** — escalation alert for renegotiation or renewal decision
   - **30 days before expiration** — final alert with action deadline
   - For contracts with non-renewal notice periods, align alerts to precede the notice deadline
   - Flag auto-renewing contracts that require proactive cancellation

4. **Identify contracts needing renegotiation:**
   - **Unfavorable terms** — contracts with terms flagged during prior review phases
   - **Market changes** — contracts where pricing or terms no longer reflect market conditions
   - **Business changes** — contracts misaligned with current business strategy or operations
   - Prioritize renegotiation candidates by contract value and risk exposure

5. **Track ongoing obligations and deliverables:**
   - For each active contract, list all ongoing obligations per party
   - Set milestone dates for deliverables and compliance checkpoints
   - Identify obligations at risk of non-performance
   - Define consequence triggers for missed obligations

6. **Recommend contract management tool or process:**
   - Evaluate organization size and contract volume
   - Recommend appropriate solution (spreadsheet tracker for small portfolios, dedicated CLM software for large portfolios)
   - Define workflow for contract intake, review, approval, and storage
   - Establish naming conventions and filing structure

7. **Write the artifact** — append to `.singularskills/legal/<project>/04-govern.md` under a `## Contract Tracker` section. Create the file with a `# Govern — <project>` heading if it does not exist; if a `## Contract Tracker` section already exists, replace only that section. The section contains:

   - **Contract Register Template** — field definitions and sample entries
   - **Alert Schedule** — renewal and expiration notification timeline
   - **Renegotiation Candidates** — prioritized list with rationale
   - **Obligation Tracker** — ongoing obligations by contract
   - **Recommended Tools and Process** — contract management recommendations

## Output

The contract tracker appended to `.singularskills/legal/<project>/04-govern.md`. Present a summary to the user highlighting:
- Total contracts catalogued and their distribution by type
- Upcoming expirations requiring immediate attention
- Contracts flagged for renegotiation with priority ranking
- Recommended contract management approach

**Record the run.** This artifact is shared by every skill of phase 4 (Govern). The frontmatter is written once, by whoever creates the file: if you create it, open it with the block below (`skill` is the phase title, `started` the time of that first write; `gate` is `passed` when the gate ran clean and `skipped` under `--skip-checks`); if it already exists, leave the block alone except to update `finished` and to set `gate` to the worst value among the sections (`skipped` over `passed`).

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

Open your `## Contract Tracker` section with one italic line, `*<skill name> · <ISO timestamp> · gate: <passed|skipped>*` (your skill name is `legal-contract-tracker`).

End your section with `### Decisions` and `### Open questions` (one level under your `## Contract Tracker` heading, so the section stays one block), in this shape:

```markdown
### Decisions
- <what was chosen> — <why> — <what was rejected>

### Open questions
- <what the next phase or a reviewer must settle>
```

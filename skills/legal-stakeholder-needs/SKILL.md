---
name: legal-stakeholder-needs
description: Identify the legal needs of each business unit, product and stakeholder group, build a legal service catalog, find underserved areas, and recommend in-house, outside counsel or tooling to cover them. Use when the user is setting up or scaling a legal function and asks which teams need what kind of legal support.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: legal
  phase: 0
  artifact: 00-assess.md
---

# Stakeholder Legal Needs

Identify and map legal needs across all business units, products, and stakeholder groups for "$ARGUMENTS". Create a legal service catalog and prioritize support.

> **Note:** AI-generated legal content does not constitute legal advice. Consult a qualified attorney.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"legal-stakeholder-needs","workflow":"legal","phase":0,"project":"<project>","event":"skipped","artifact":"00-assess.md","note":"<reason or \"none given\">"}`.

## Prerequisites

**Part of a workflow.** This skill is phase 0 (Assess) of the Legal Lifecycle workflow (`legal`); cross-domain workflows run it too. Unless the user named this skill, check `.singularskills/log.jsonl` for an open run for this project: a `run-started` line with `"project":"<project>"` and no later `run-finished` line for the same `workflow` and `project`. If there is no open run, or the user asked to start, run, continue or resume a process or workflow rather than this one step, do not continue here: invoke the `workflow` skill with the workflow the user asked for, or `legal` when they named none, followed by `<project>`. It runs this phase in order, asks before it writes and records the run. Continue here when the user named this skill, or when an open run exists (the conductor is running you).

Before you start work, append this line to `.singularskills/log.jsonl` (create the folder and file if missing): `{"ts":"<ISO timestamp>","skill":"legal-stakeholder-needs","workflow":"legal","phase":0,"project":"<project>","event":"started","artifact":"00-assess.md","note":""}`.

None — this is a Phase 0 Assess skill.

## Process

1. **Map business units and their legal touchpoints:**
   - Identify all business units, teams, and product lines
   - For each, document current interactions with legal functions
   - Note frequency and type of legal requests

2. **For each business unit, assess:**
   - **Contracts needed** — vendor agreements, customer contracts, partner agreements, employment contracts, NDAs
   - **Compliance requirements** — industry-specific regulations, data handling obligations, reporting duties
   - **IP considerations** — patents, trademarks, copyrights, trade secrets, open source usage
   - **Regulatory exposure** — which regulations directly affect this unit's operations

3. **Create legal service catalog:**
   - List all legal services each group needs (contract review, compliance advice, IP filing, dispute resolution, etc.)
   - Map current legal support coverage for each service
   - Identify gaps where legal support is needed but not provided

4. **Identify underserved areas:**
   - Business units operating without adequate legal support
   - High-risk activities proceeding without legal review
   - Teams using outdated templates or self-service legal documents
   - Areas where legal bottlenecks slow business operations

5. **Prioritize by business impact and risk:**
   - Rank underserved areas by combination of business impact and legal risk
   - Estimate effort to close each gap
   - Recommend resourcing (in-house, outside counsel, legal tech tools)
   - Propose phased rollout of legal support improvements

6. **Write the artifact** — append to `.singularskills/legal/<project>/00-assess.md` under a `## Stakeholder Legal Needs` section. Create the file with a `# Assess — <project>` heading if it does not exist; if a `## Stakeholder Legal Needs` section already exists, replace only that section. The section contains:

   - **Business Unit Map** — all units with their legal touchpoints
   - **Needs Assessment** — contracts, compliance, IP, and regulatory needs per unit
   - **Legal Service Catalog** — comprehensive list of required legal services
   - **Coverage Gaps** — underserved areas and unmet legal needs
   - **Priority Matrix** — needs ranked by business impact and legal risk
   - **Resourcing Recommendations** — how to close gaps (in-house, outside counsel, tools)

## Output

The stakeholder legal needs assessment appended to `.singularskills/legal/<project>/00-assess.md`. Present a summary to the user highlighting:
- Total business units mapped and legal services cataloged
- Most underserved areas requiring immediate attention
- Top 3 recommended actions to improve legal coverage

**Record the run.** After you have written your section, append this line to `.singularskills/log.jsonl` (the `started` line of Prerequisites, with `"event":"finished"`): `{"ts":"<ISO timestamp>","skill":"legal-stakeholder-needs","workflow":"legal","phase":0,"project":"<project>","event":"finished","artifact":"00-assess.md","note":""}`.

This artifact is shared by every skill of phase 0 (Assess). The frontmatter is written once, by whoever creates the file: if you create it, open it with the block below (`skill` is the phase title, `started` the time of that first write; `gate` is `none`, as this phase has no gate); if it already exists, leave the block alone except to update `finished`.

```yaml
---
skill: Assess
workflow: legal
phase: 0
project: <project>
started: <ISO timestamp>
finished: <ISO timestamp>
agent: <the agent you run in, or "unknown">
gate: none
---
```

Open your `## Stakeholder Legal Needs` section with one italic line, `*<skill name> · <ISO timestamp> · gate: none*` (your skill name is `legal-stakeholder-needs`).

End your section with `### Decisions` and `### Open questions` (one level under your `## Stakeholder Legal Needs` heading, so the section stays one block), in this shape:

```markdown
### Decisions
- <what was chosen> — <why> — <what was rejected>

### Open questions
- <what the next phase or a reviewer must settle>
```

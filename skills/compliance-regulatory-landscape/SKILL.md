---
name: compliance-regulatory-landscape
description: Map every regulation and certification that applies to a business from its jurisdictions, data types, industry and customer demands — the starting point of the compliance program. Use when the user asks which regulations apply to their company or product, or is starting a compliance program from scratch. Not for a per-law compliance status matrix; see /legal-regulatory-map.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: compliance
  phase: 0
  artifact: 00-scope.md
---

# Regulatory Landscape

Map the full regulatory landscape for "$ARGUMENTS". Identify every applicable regulation based on where the business operates, what data it processes, what industries its customers serve, and what certifications those customers require.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"compliance-regulatory-landscape","workflow":"compliance","phase":0,"project":"<project>","event":"skipped","artifact":"00-scope.md","note":"<reason or \"none given\">"}`.

## Prerequisites

**Part of a workflow.** This skill is phase 0 (Scope) of the GRC Lifecycle workflow (`compliance`); cross-domain workflows run it too. Unless the user named this skill, check `.singularskills/log.jsonl` for an open run for this project: a `run-started` line with `"project":"<project>"` and no later `run-finished` line for the same `workflow` and `project`. If there is no open run, or the user asked to start, run, continue or resume a process or workflow rather than this one step, do not continue here: invoke the `workflow` skill with the workflow the user asked for, or `compliance` when they named none, followed by `<project>`. It runs this phase in order, asks before it writes and records the run. Continue here when the user named this skill, or when an open run exists (the conductor is running you).

Before you start work, append this line to `.singularskills/log.jsonl` (create the folder and file if missing): `{"ts":"<ISO timestamp>","skill":"compliance-regulatory-landscape","workflow":"compliance","phase":0,"project":"<project>","event":"started","artifact":"00-scope.md","note":""}`.

None — this is a Phase 0 (Scope) skill.

## Process

1. **Read context files:**
   - Read `references/grc-lifecycle-guide.md` for GRC methodology reference

2. **Jurisdiction mapping:**
   - Identify all jurisdictions where the business operates (headquarters, offices, data centers, customers)
   - Map each jurisdiction to its regulatory requirements (EU, US federal, US state, UK, APAC, etc.)
   - Note cross-border data transfer implications

3. **Data classification:**
   - Identify data types processed (PII, PHI, PCI, financial data, children's data, biometric data, etc.)
   - Map each data type to regulations that govern it
   - Note data residency and sovereignty requirements

4. **Industry and customer analysis:**
   - Identify industries the business serves (healthcare, finance, government, education, etc.)
   - Map industry-specific regulations (HIPAA, PCI DSS, FedRAMP, FERPA, etc.)
   - Document certifications customers require or request in sales cycles

5. **Regulation inventory:**
   - Create a comprehensive regulation inventory table with columns: regulation name, jurisdiction, data types covered, industry applicability, mandatory vs. customer-driven, enforcement status
   - Map each regulation to applicability criteria specific to "<project>"
   - Flag regulations with upcoming enforcement dates or recent changes

6. **Write the artifact** — append to `.singularskills/compliance/<project>/00-scope.md` under a `## Regulatory Landscape` section. Create the file with a `# Scope — <project>` heading if it does not exist; if a `## Regulatory Landscape` section already exists, replace only that section. The section contains:
   - **Jurisdiction Map** — where the business operates and applicable jurisdictions
   - **Data Type Inventory** — data types processed and governing regulations
   - **Industry Requirements** — sector-specific regulations and customer demands
   - **Regulation Inventory Table** — full list of applicable regulations with applicability criteria
   - **Cross-Border Considerations** — data transfer and sovereignty requirements

## Output

The regulatory landscape analysis appended to `.singularskills/compliance/<project>/00-scope.md`. Present a summary to the user highlighting:
- Total number of applicable regulations identified
- Top regulations by business impact
- Any surprising applicability findings
- Recommended next step: run `/compliance-compliance-priorities <project>`

**Record the run.** After you have written your section, append this line to `.singularskills/log.jsonl` (the `started` line of Prerequisites, with `"event":"finished"`): `{"ts":"<ISO timestamp>","skill":"compliance-regulatory-landscape","workflow":"compliance","phase":0,"project":"<project>","event":"finished","artifact":"00-scope.md","note":""}`.

This artifact is shared by every skill of phase 0 (Scope). The frontmatter is written once, by whoever creates the file: if you create it, open it with the block below (`skill` is the phase title, `started` the time of that first write; `gate` is `none`, as this phase has no gate); if it already exists, leave the block alone except to update `finished`.

```yaml
---
skill: Scope
workflow: compliance
phase: 0
project: <project>
started: <ISO timestamp>
finished: <ISO timestamp>
agent: <the agent you run in, or "unknown">
gate: none
---
```

Open your `## Regulatory Landscape` section with one italic line, `*<skill name> · <ISO timestamp> · gate: none*` (your skill name is `compliance-regulatory-landscape`).

End your section with `### Decisions` and `### Open questions` (one level under your `## Regulatory Landscape` heading, so the section stays one block), in this shape:

```markdown
### Decisions
- <what was chosen> — <why> — <what was rejected>

### Open questions
- <what the next phase or a reviewer must settle>
```

End the artifact with this paragraph, verbatim:

> **Not legal or audit advice.** This artifact supports preparation for compliance work; certification, attestation and regulatory conclusions require a qualified auditor or counsel.

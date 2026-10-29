---
name: compliance-control-framework
description: Select a primary control framework (ISO 27001, NIST CSF, CIS Controls, NIST 800-53 or SOC 2) and map its controls to every applicable regulation to find leverage points and gaps. Use when the user is pursuing several regulations at once and asks which control framework to build the program on. Not for a standalone crosswalk; see /compliance-cross-regulation-map.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: compliance
  phase: 0
  artifact: 00-scope.md
---

# Control Framework

Select a unified control framework for "$ARGUMENTS" that maximizes regulatory coverage by mapping shared controls across multiple regulations, reducing duplication of compliance effort.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"compliance-control-framework","workflow":"compliance","phase":0,"project":"<project>","event":"skipped","artifact":"00-scope.md","note":"<reason or \"none given\">"}`.

## Prerequisites

Before you start work, append this line to `.singularskills/log.jsonl` (create the folder and file if missing): `{"ts":"<ISO timestamp>","skill":"compliance-control-framework","workflow":"compliance","phase":0,"project":"<project>","event":"started","artifact":"00-scope.md","note":""}`.

None — this is a Phase 0 (Scope) skill.

## Process

1. **Read context files:**
   - Read `references/grc-lifecycle-guide.md` for GRC methodology reference
   - Read `references/control-mapping-template.md` for output structure
   - Read `.singularskills/compliance/<project>/00-scope.md` for applicable regulations and priorities

2. **Framework evaluation:**
   - Evaluate candidate frameworks: ISO 27001 Annex A, NIST CSF 2.0, CIS Controls v8, NIST 800-53, SOC 2 TSC
   - Score each framework on: customer recognition, regulatory coverage breadth, implementation maturity, tooling ecosystem
   - Consider customer requirements — which frameworks do customers explicitly request?

3. **Primary framework selection:**
   - Select the primary framework based on highest regulatory overlap and customer demand
   - Document selection rationale with specific evidence
   - Identify supplementary frameworks needed for coverage gaps

4. **Control-to-regulation mapping:**
   - Map each control in the selected framework to applicable regulations
   - Identify controls that satisfy multiple regulations simultaneously (compliance leverage points)
   - Highlight controls unique to a single regulation (regulation-specific requirements)
   - Flag gaps — regulations with requirements not covered by the selected framework

5. **Coverage analysis:**
   - Calculate coverage percentage per regulation
   - Identify the minimum control set that covers the maximum number of regulations
   - Document gap-filling controls needed from supplementary frameworks

6. **Write the artifact** — append to `.singularskills/compliance/<project>/00-scope.md` under a `## Control Framework` section. Create the file with a `# Scope — <project>` heading if it does not exist; if a `## Control Framework` section already exists, replace only that section. The section contains:
   - **Framework Evaluation** — comparison table of candidate frameworks
   - **Selected Framework** — chosen framework with rationale
   - **Control-to-Regulation Map** — full mapping following the control mapping template
   - **Leverage Points** — controls satisfying 3+ regulations
   - **Coverage Gaps** — requirements needing supplementary controls

## Output

The control framework analysis appended to `.singularskills/compliance/<project>/00-scope.md`. Present a summary to the user highlighting:
- Selected primary framework and why
- Number of controls that cover multiple regulations
- Coverage gaps requiring supplementary controls
- Recommended next step: run `/compliance-compliance-roadmap <project>`

**Record the run.** After you have written your section, append this line to `.singularskills/log.jsonl` (the `started` line of Prerequisites, with `"event":"finished"`): `{"ts":"<ISO timestamp>","skill":"compliance-control-framework","workflow":"compliance","phase":0,"project":"<project>","event":"finished","artifact":"00-scope.md","note":""}`.

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

Open your `## Control Framework` section with one italic line, `*<skill name> · <ISO timestamp> · gate: none*` (your skill name is `compliance-control-framework`).

End your section with `### Decisions` and `### Open questions` (one level under your `## Control Framework` heading, so the section stays one block), in this shape:

```markdown
### Decisions
- <what was chosen> — <why> — <what was rejected>

### Open questions
- <what the next phase or a reviewer must settle>
```

End the artifact with this paragraph, verbatim:

> **Not legal or audit advice.** This artifact supports preparation for compliance work; certification, attestation and regulatory conclusions require a qualified auditor or counsel.

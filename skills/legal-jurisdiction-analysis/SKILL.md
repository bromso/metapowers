---
name: legal-jurisdiction-analysis
description: Analyze legal requirements across every country or state a business touches — registration, data protection, employment and consumer law — with a comparison matrix, conflicts and a recommended baseline. Use when the user operates, hires or stores data in several countries or states and asks how their obligations differ or conflict.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: legal
  phase: 0
  artifact: 00-assess.md
---

# Jurisdiction Analysis

Analyze legal requirements across all relevant jurisdictions for "$ARGUMENTS". Compare obligations, identify conflicts, and recommend a baseline standard.

> **Note:** AI-generated legal content does not constitute legal advice. Consult a qualified attorney.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"<skill name>","workflow":"legal","phase":<phase>,"project":"<project>","event":"skipped","artifact":"<artifact file>","note":"<reason or \"none given\">"}`.

## Prerequisites

None — this is a Phase 0 Assess skill.

## Process

1. **Identify all relevant jurisdictions:**
   - Where the business has offices or physical presence
   - Where customers or users are located
   - Where data is stored or processed
   - Where employees or contractors are based
   - Where partners or vendors operate

2. **For each jurisdiction, document:**
   - **Key legal requirements** — primary laws governing business operations
   - **Registration and filing obligations** — business registration, tax filings, annual reports
   - **Data protection laws** — privacy regulations, data localization requirements, breach notification rules
   - **Employment laws** — hiring requirements, worker classification, benefits mandates, termination rules
   - **Consumer protection laws** — disclosure requirements, refund policies, advertising standards

3. **Compare requirements across jurisdictions:**
   - Create a comparison matrix (jurisdiction x requirement area)
   - Identify where requirements align across jurisdictions
   - Identify where requirements diverge or conflict

4. **Identify conflicts:**
   - Stricter vs. more permissive requirements for the same obligation
   - Mutually exclusive requirements (where complying with one violates another)
   - Data localization conflicts (data must stay in country A but also be accessible in country B)
   - Employment law conflicts across remote-work jurisdictions

5. **Recommend baseline standard:**
   - Typically adopt the strictest jurisdiction's standard as the baseline
   - Document where jurisdiction-specific exceptions or adaptations are needed
   - Identify cost and operational implications of the recommended baseline
   - Flag areas where legal counsel must resolve genuine conflicts

6. **Write the artifact** — append to `.singularskills/legal/<project>/00-assess.md` under a `## Jurisdiction Analysis` section. Create the file with a `# Assess — <project>` heading if it does not exist; if a `## Jurisdiction Analysis` section already exists, replace only that section. The section contains:

   - **Jurisdiction Inventory** — all jurisdictions with basis for inclusion
   - **Requirements by Jurisdiction** — legal obligations per jurisdiction
   - **Comparison Matrix** — side-by-side comparison of key requirements
   - **Conflicts and Tensions** — where requirements diverge or conflict
   - **Recommended Baseline** — proposed standard with rationale
   - **Jurisdiction-Specific Exceptions** — where the baseline needs adaptation

## Output

The jurisdiction analysis appended to `.singularskills/legal/<project>/00-assess.md`. Present a summary to the user highlighting:
- Total jurisdictions analyzed
- Key conflicts or tensions identified
- Recommended baseline jurisdiction and rationale

**Record the run.** This artifact is shared by every skill of phase 0 (Assess). The frontmatter is written once, by whoever creates the file: if you create it, open it with the block below (`skill` is the phase title, `started` the time of that first write; `gate` is `none`, as this phase has no gate); if it already exists, leave the block alone except to update `finished` and to set `gate` to the worst value among the sections (`skipped` over `passed`).

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

Open your `## Jurisdiction Analysis` section with one italic line, `*<skill name> · <ISO timestamp> · gate: <passed|skipped>*` (your skill name is `legal-jurisdiction-analysis`).

End your section with `### Decisions` and `### Open questions` (one level under your `## Jurisdiction Analysis` heading, so the section stays one block), in this shape:

```markdown
### Decisions
- <what was chosen> — <why> — <what was rejected>

### Open questions
- <what the next phase or a reviewer must settle>
```

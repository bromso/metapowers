---
name: legal-risk-assessment
description: Score legal risks — regulatory, contractual, IP, employment, privacy and litigation — on a likelihood-impact matrix weighted by jurisdiction, with mitigations. Use when the user asks where their biggest legal or regulatory exposure lies and what to tackle first. Not for security threats or delivery risks; see /security-risk-assessment or /project-management-risk-assessment.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: legal
  phase: 0
  artifact: 00-assess.md
---

# Risk Assessment

Identify and score legal risks for "$ARGUMENTS". Evaluate each risk by likelihood, impact, and jurisdictional factors, then define mitigation strategies for the highest-priority items.

See also `/security-risk-assessment` for a security risk register built from threat and vulnerability findings, or `/project-management-risk-assessment` for delivery risks to timeline and scope.

> **Note:** AI-generated legal content does not constitute legal advice. Consult a qualified attorney.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"legal-risk-assessment","workflow":"legal","phase":0,"project":"<project>","event":"skipped","artifact":"00-assess.md","note":"<reason or \"none given\">"}`.

## Prerequisites

Before you start work, append this line to `.singularskills/log.jsonl` (create the folder and file if missing): `{"ts":"<ISO timestamp>","skill":"legal-risk-assessment","workflow":"legal","phase":0,"project":"<project>","event":"started","artifact":"00-assess.md","note":""}`.

None — this is a Phase 0 Assess skill.

## Process

1. **Brainstorm risks across categories:**
   - **Regulatory** — non-compliance with applicable laws and regulations
   - **Contractual** — breaches, unfavorable terms, missing agreements
   - **Intellectual property** — infringement, inadequate protection, trade secrets
   - **Employment** — misclassification, discrimination, workplace safety
   - **Data privacy** — unauthorized processing, breach exposure, consent gaps
   - **Litigation** — pending or potential lawsuits, dispute exposure

2. **Score each risk:**
   - Read `references/risk-matrix-template.md` for reference
   - **Likelihood** (1-5): 1 = rare, 2 = unlikely, 3 = possible, 4 = likely, 5 = almost certain
   - **Impact** (1-5): 1 = negligible, 2 = minor, 3 = moderate, 4 = major, 5 = catastrophic
   - **Jurisdiction modifier** (1.0-1.5x): adjust based on regulatory strictness of applicable jurisdictions
   - **Risk score** = likelihood x impact x jurisdiction modifier

3. **Plot on risk matrix:**
   - Create a 5x5 likelihood vs. impact matrix
   - Place each risk on the matrix
   - Identify clusters of risk in high-severity zones

4. **Define mitigation strategies for top risks:**
   - **Avoid** — eliminate the activity creating the risk
   - **Transfer** — shift risk via insurance, indemnification, or outsourcing
   - **Mitigate** — reduce likelihood or impact through controls
   - **Accept** — acknowledge and monitor risks below threshold
   - Assign an owner for each top risk

5. **Write the artifact** — append to `.singularskills/legal/<project>/00-assess.md` under a `## Risk Assessment` section. Create the file with a `# Assess — <project>` heading if it does not exist; if a `## Risk Assessment` section already exists, replace only that section. The section contains:

   - **Risk Inventory** — all identified risks by category
   - **Risk Scoring** — likelihood, impact, jurisdiction modifier, and total score per risk
   - **Risk Matrix** — visual 5x5 matrix with risk placement
   - **Top Risks** — highest-scoring risks with detailed analysis
   - **Mitigation Strategies** — action plan for each top risk with assigned owners

## Output

The risk assessment appended to `.singularskills/legal/<project>/00-assess.md`. Present a summary to the user highlighting:
- Total risks identified and distribution across categories
- Top 5 highest-scoring risks
- Recommended mitigation strategies for critical items

**Record the run.** After you have written your section, append this line to `.singularskills/log.jsonl` (the `started` line of Prerequisites, with `"event":"finished"`): `{"ts":"<ISO timestamp>","skill":"legal-risk-assessment","workflow":"legal","phase":0,"project":"<project>","event":"finished","artifact":"00-assess.md","note":""}`.

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

Open your `## Risk Assessment` section with one italic line, `*<skill name> · <ISO timestamp> · gate: none*` (your skill name is `legal-risk-assessment`).

End your section with `### Decisions` and `### Open questions` (one level under your `## Risk Assessment` heading, so the section stays one block), in this shape:

```markdown
### Decisions
- <what was chosen> — <why> — <what was rejected>

### Open questions
- <what the next phase or a reviewer must settle>
```

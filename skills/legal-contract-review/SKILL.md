---
name: legal-contract-review
description: Review a whole contract section by section — missing standard clauses, unfavorable terms, unclear language and cross-references — with a Low/Medium/High risk rating and prioritized revisions. Use when the user shares a contract and wants a thorough review of everything in it, including what is missing. Not for a quick sign-or-walk verdict; see /legal-red-flag-detection.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: legal
  phase: 2
  artifact: 02-review.md
---

# Contract Review

Review the contract for "$ARGUMENTS". Analyze each section against best practices, identify missing standard clauses, flag unfavorable terms, and score overall risk.

> **Note:** AI-generated legal content does not constitute legal advice. Consult a qualified attorney.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"legal-contract-review","workflow":"legal","phase":2,"project":"<project>","event":"skipped","artifact":"02-review.md","note":"<reason or \"none given\">"}`.

## Prerequisites

Run this skill's gate before writing: `sh <this skill's folder>/scripts/gate.sh <project> <project root>`, where `<project root>` is the folder that contains `.singularskills/` (use `.` when you are already there). If it exits non-zero, stop and tell the user what it printed, unless `--skip-checks` was given (see Arguments). On a refusal, before you stop, append this line to `.singularskills/log.jsonl` (create the folder and file if missing): `{"ts":"<ISO timestamp>","skill":"legal-contract-review","workflow":"legal","phase":2,"project":"<project>","event":"refused","artifact":"02-review.md","note":"<what the gate printed>"}`. Once the gate has passed, or under `--skip-checks` once you have appended the `skipped` line, append this line before you start work: `{"ts":"<ISO timestamp>","skill":"legal-contract-review","workflow":"legal","phase":2,"project":"<project>","event":"started","artifact":"02-review.md","note":""}`.

Check that `.singularskills/legal/<project>/00-assess.md` exists. If it does not exist, stop and tell the user:

> "Run an Assess skill first (e.g. `/legal-risk-assessment <project>`) to generate the prerequisite assessment artifact."

## Process

1. **Read inputs:**
   - Read `.singularskills/legal/<project>/00-assess.md` for risk and jurisdiction context
   - Read `references/contract-template.md` for standard contract provisions
   - Read the contract from the source provided by the user (file path, URL, or inline text)

2. **Check each section against best practices:**
   - Compare contract structure to the standard template
   - Verify each clause uses clear, unambiguous language
   - Confirm defined terms are used consistently throughout
   - Check that cross-references are accurate

3. **Identify missing standard clauses:**
   - **Indemnification** — mutual or one-sided indemnification obligations
   - **Limitation of liability** — liability cap and exclusions
   - **Intellectual property** — ownership, licensing, and assignment provisions
   - **Confidentiality** — scope, duration, and exceptions
   - **Termination** — rights, notice periods, and consequences

4. **Flag unfavorable terms:**
   - **Unlimited liability** — no cap on damages or liability exposure
   - **Broad indemnification** — disproportionate indemnification obligations
   - **Unilateral amendments** — one party can modify terms without consent
   - **Auto-renewal traps** — automatic renewal with punitive exit terms
   - **Excessive exclusivity** — unreasonable exclusivity scope or duration
   - **One-sided termination** — asymmetric termination rights

5. **Score overall risk:**
   - **Low** — contract follows best practices with minor improvements suggested
   - **Medium** — contract has notable gaps or moderately unfavorable terms requiring negotiation
   - **High** — contract contains significant risk exposure or multiple missing critical clauses

6. **Provide section-by-section commentary:**
   - For each contract section, note: status (acceptable/needs revision/missing), specific issues found, and concrete recommendations

7. **Write the artifact** — append to `.singularskills/legal/<project>/02-review.md` under a `## Contract Review` section. Create the file with a `# Review — <project>` heading if it does not exist; if a `## Contract Review` section already exists, replace only that section. The section contains:

   - **Contract Overview** — parties, type, effective date, term
   - **Section-by-Section Analysis** — commentary per contract section
   - **Missing Clauses** — standard clauses not present in the contract
   - **Unfavorable Terms** — flagged terms with risk explanation
   - **Overall Risk Score** — Low/Medium/High with justification
   - **Recommendations** — prioritized action items for revision

## Output

The contract review appended to `.singularskills/legal/<project>/02-review.md`. Present a summary to the user highlighting:
- Overall risk score and top contributing factors
- Missing standard clauses that should be added
- Most critical unfavorable terms requiring immediate attention
- Top 3 recommended revisions

**Record the run.** After you have written your section, append this line to `.singularskills/log.jsonl` (the `started` line of Prerequisites, with `"event":"finished"`): `{"ts":"<ISO timestamp>","skill":"legal-contract-review","workflow":"legal","phase":2,"project":"<project>","event":"finished","artifact":"02-review.md","note":""}`.

This artifact is shared by every skill of phase 2 (Review). The frontmatter is written once, by whoever creates the file: if you create it, open it with the block below (`skill` is the phase title, `started` the time of that first write; `gate` is `passed` when the gate ran clean and `skipped` under `--skip-checks`); if it already exists, leave the block alone except to update `finished` and to set `gate` to the worst value among the sections (`skipped` over `passed`).

```yaml
---
skill: Review
workflow: legal
phase: 2
project: <project>
started: <ISO timestamp>
finished: <ISO timestamp>
agent: <the agent you run in, or "unknown">
gate: <passed|skipped>
---
```

Open your `## Contract Review` section with one italic line, `*<skill name> · <ISO timestamp> · gate: <passed|skipped>*` (your skill name is `legal-contract-review`).

End your section with `### Decisions` and `### Open questions` (one level under your `## Contract Review` heading, so the section stays one block), in this shape:

```markdown
### Decisions
- <what was chosen> — <why> — <what was rejected>

### Open questions
- <what the next phase or a reviewer must settle>
```

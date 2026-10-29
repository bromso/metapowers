---
name: legal-red-flag-detection
description: Scan an agreement for high-risk and non-standard terms — liability, auto-renewal, restrictive covenants, IP grabs, one-sided termination, data and dispute clauses — rated Red, Amber or Green. Use when the user wants a quick verdict on whether to sign, negotiate or walk away from an agreement they received. Not for a full section-by-section review; see /legal-contract-review.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: legal
  phase: 2
  artifact: 02-review.md
---

# Red Flag Detection

Scan the agreement for "$ARGUMENTS" to identify high-risk clauses and non-standard terms. Systematically check for common contractual red flags and score each finding using a RAG (Red/Amber/Green) framework.

> **Note:** AI-generated legal content does not constitute legal advice. Consult a qualified attorney.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"legal-red-flag-detection","workflow":"legal","phase":2,"project":"<project>","event":"skipped","artifact":"02-review.md","note":"<reason or \"none given\">"}`.

## Prerequisites

Run this skill's gate before writing: `sh <this skill's folder>/scripts/gate.sh <project> <project root>`, where `<project root>` is the folder that contains `.singularskills/` (use `.` when you are already there). If it exits non-zero, stop and tell the user what it printed, unless `--skip-checks` was given (see Arguments). On a refusal, before you stop, append this line to `.singularskills/log.jsonl` (create the folder and file if missing): `{"ts":"<ISO timestamp>","skill":"legal-red-flag-detection","workflow":"legal","phase":2,"project":"<project>","event":"refused","artifact":"02-review.md","note":"<what the gate printed>"}`. Once the gate has passed, or under `--skip-checks` once you have appended the `skipped` line, append this line before you start work: `{"ts":"<ISO timestamp>","skill":"legal-red-flag-detection","workflow":"legal","phase":2,"project":"<project>","event":"started","artifact":"02-review.md","note":""}`.

Check that `.singularskills/legal/<project>/00-assess.md` exists. If it does not exist, stop and tell the user:

> "Run an Assess skill first (e.g. `/legal-risk-assessment <project>`) to generate the prerequisite assessment artifact."

## Process

1. **Read inputs:**
   - Read `.singularskills/legal/<project>/00-assess.md` for risk and jurisdiction context
   - Read the agreement from the source provided by the user

2. **Scan systematically for red flags across categories:**

   **Liability and Indemnification:**
   - Unlimited liability exposure (no cap on damages)
   - Broad indemnification obligations (disproportionate to party's role)
   - Missing limitation of liability cap
   - Indemnification for third-party claims without control of defense

   **Amendment and Renewal:**
   - Unilateral amendment rights (one party can change terms without consent)
   - Automatic renewal with penalty (difficult or costly to exit)
   - Silent renewal clauses with short opt-out windows

   **Restrictive Covenants:**
   - Non-compete overreach (excessive scope, geography, or duration)
   - Non-solicit provisions extending beyond reasonable limits
   - Exclusivity requirements disproportionate to the relationship

   **Intellectual Property:**
   - IP assignment beyond the scope of work
   - Overly broad license grants (perpetual, irrevocable, sublicensable)
   - Missing background IP carve-outs
   - Work-for-hire misclassification

   **Termination:**
   - One-sided termination rights (asymmetric rights favoring counterparty)
   - Termination for convenience without reasonable notice
   - Punitive post-termination obligations

   **Data and Audit:**
   - Ambiguous data ownership provisions
   - Unreasonable audit rights (scope, frequency, cost allocation)
   - Missing data breach notification requirements

   **Dispute Resolution:**
   - Missing governing law clause
   - Missing dispute resolution mechanism
   - Mandatory arbitration with unfavorable forum or rules
   - Class action waiver in consumer contracts

3. **RAG score each finding:**
   - **Red** — immediate risk requiring resolution before signing; material exposure
   - **Amber** — should be negotiated; risk is manageable but not ideal
   - **Green** — acceptable; standard or low-risk provision

4. **Summarize overall risk profile:**
   - Count of Red/Amber/Green findings
   - Overall recommendation (sign/negotiate/walk away)
   - Priority-ordered list of items to address

5. **Write the artifact** — append to `.singularskills/legal/<project>/02-review.md` under a `## Red Flag Detection` section. Create the file with a `# Review — <project>` heading if it does not exist; if a `## Red Flag Detection` section already exists, replace only that section. The section contains:

   - **Scan Summary** — total findings by RAG category
   - **Red Flags** — all Red-scored items with clause reference, risk explanation, and recommended action
   - **Amber Items** — all Amber-scored items with clause reference and negotiation suggestion
   - **Green Items** — all Green-scored items (brief confirmation)
   - **Overall Risk Profile** — aggregate assessment and recommendation
   - **Priority Action List** — ordered items to address before execution

## Output

The red flag analysis appended to `.singularskills/legal/<project>/02-review.md`. Present a summary to the user highlighting:
- Total Red/Amber/Green count
- All Red-flagged items with brief risk descriptions
- Overall recommendation (sign, negotiate, or walk away)
- Top 3 priority items to address

**Record the run.** After you have written your section, append this line to `.singularskills/log.jsonl` (the `started` line of Prerequisites, with `"event":"finished"`): `{"ts":"<ISO timestamp>","skill":"legal-red-flag-detection","workflow":"legal","phase":2,"project":"<project>","event":"finished","artifact":"02-review.md","note":""}`.

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

Open your `## Red Flag Detection` section with one italic line, `*<skill name> · <ISO timestamp> · gate: <passed|skipped>*` (your skill name is `legal-red-flag-detection`).

End your section with `### Decisions` and `### Open questions` (one level under your `## Red Flag Detection` heading, so the section stays one block), in this shape:

```markdown
### Decisions
- <what was chosen> — <why> — <what was rejected>

### Open questions
- <what the next phase or a reviewer must settle>
```

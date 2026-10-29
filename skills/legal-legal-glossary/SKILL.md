---
name: legal-legal-glossary
description: Generate a plain-language glossary of legal terms by area — contracts, privacy, IP, employment, compliance and corporate — with an example and why each term matters to non-lawyers. Use when the user or their team keeps hitting legal jargon and wants the terms explained in everyday words.
metadata:
  argument-hint: "[project] [--skip-checks]"
---

# Legal Glossary

Generate a glossary of legal terms for "$ARGUMENTS". Define terms in plain language, organized by legal area, with practical examples and context for non-lawyers.

> **Note:** AI-generated legal content does not constitute legal advice. Definitions are simplified for accessibility and may not capture every legal nuance.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"legal-legal-glossary","workflow":"legal","phase":null,"project":"<project>","event":"skipped","artifact":"<artifact file>","note":"<reason or \"none given\">"}`.

## Prerequisites

None — this is a utility skill.

## Process

1. **Determine scope:**
   - Parse "<project>" to identify which legal area(s) or terms to cover
   - If a broad topic is requested, cover terms across all relevant legal areas
   - If a specific area is requested, provide deeper coverage of that area

2. **Organize terms by legal area:**
   - **Contract Law** — offer, acceptance, consideration, breach, damages, indemnification, force majeure, assignment, waiver, severability
   - **Privacy and Data Protection** — personal data, data controller, data processor, consent, data subject rights, breach notification, cross-border transfer, data minimization
   - **Intellectual Property** — copyright, trademark, patent, trade secret, licensing, fair use, infringement, prior art, work for hire
   - **Employment Law** — at-will employment, wrongful termination, non-compete, non-solicitation, independent contractor, misclassification, FLSA, harassment, accommodation
   - **Compliance and Regulatory** — due diligence, fiduciary duty, regulatory filing, audit, whistleblower, sanctions, anti-corruption, know your customer (KYC)
   - **Corporate Law** — incorporation, bylaws, fiduciary duty, shareholder, board resolution, articles of incorporation, operating agreement, capitalization, vesting

3. **For each term, provide:**
   - **Definition** — one sentence in plain language, avoiding legalese in the definition itself
   - **Example** — a practical example of how the term is used in a real-world scenario
   - **Why it matters** — why a non-lawyer should understand this term and when they might encounter it
   - **Jurisdiction note** (where applicable) — flag when a term has different meanings, scope, or enforceability in different jurisdictions or legal contexts

4. **Ensure accessibility:**
   - Use everyday language in definitions
   - Avoid circular definitions (do not define a legal term using other undefined legal terms)
   - Where a legal term must reference another term, ensure that term is also defined in the glossary
   - Order terms logically within each section (foundational terms first)

## Output

Present the glossary directly to the user. Do not write to a file unless the user explicitly requests it. If the user requests a file, write to `.singularskills/legal/<project>/legal-glossary.md`, starting with `# Legal Glossary — <project>`.

Highlight to the user:
- Total terms defined and legal areas covered
- Any terms with significant jurisdictional variation
- Suggestions for additional terms the user may want to explore

---
name: legal-clause-library
description: Build or extend a library of approved contract clauses, each in standard, protective and minimum-acceptable versions with jurisdiction notes and usage guidance. Use when the user wants reusable fallback language their team can pull into any contract. Not for positions on one specific deal; see /legal-negotiation-prep.
metadata:
  argument-hint: "[project] [--skip-checks]"
---

# Clause Library

Build or extend a library of approved contract clauses for "$ARGUMENTS". Provide multiple versions of each clause type with jurisdiction considerations and usage guidance.

> **Note:** AI-generated legal content does not constitute legal advice. All clauses should be reviewed by a qualified attorney before use in binding agreements.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"<skill name>","workflow":"legal","phase":<phase>,"project":"<project>","event":"skipped","artifact":"<artifact file>","note":"<reason or \"none given\">"}`.

## Prerequisites

None — this is a utility skill.

## Process

1. **Determine scope:**
   - Parse "<project>" to identify which clause types or contract context to focus on
   - If a clause library already exists at `.singularskills/legal/<project>/clause-library.md`, read it and extend rather than replace

2. **Organize clauses by type:**
   - **Indemnification** — allocation of liability for third-party claims
   - **Limitation of Liability** — caps on damages and liability exposure
   - **Confidentiality** — scope, duration, and exceptions for confidential information
   - **Termination** — rights, notice periods, cure periods, and post-termination obligations
   - **IP Assignment** — ownership and assignment of intellectual property created under the agreement
   - **Data Protection** — data processing obligations, security requirements, and breach notification
   - **Force Majeure** — excused performance due to extraordinary events beyond control
   - **Governing Law** — choice of law and venue selection
   - **Dispute Resolution** — arbitration, mediation, litigation, and escalation procedures
   - **Non-Compete** — restrictions on competitive activity post-termination
   - **Non-Solicitation** — restrictions on soliciting employees or customers
   - **Warranty** — representations, warranties, and disclaimers

3. **For each clause type, provide 3 versions:**
   - **Standard** — balanced language protecting both parties fairly; suitable for most negotiations
   - **Protective** — language that favors our side; use when negotiating from a position of strength or when risk exposure is high
   - **Minimum Acceptable** — the bottom-line position; the least favorable terms we would accept before walking away

4. **Note jurisdiction considerations per clause:**
   - Enforceability limitations in specific jurisdictions (e.g., non-compete restrictions vary widely by state)
   - Mandatory legal requirements that override contractual terms
   - Jurisdictions where certain clause types require specific language or formalities

5. **Include usage guidance:**
   - When to use each version (standard vs. protective vs. minimum)
   - Common negotiation patterns and fallback positions
   - Red flags that indicate the other party's clause is unacceptable

6. **Mark clauses requiring legal review:**
   - Flag any clause that involves regulatory compliance obligations
   - Flag clauses with jurisdiction-specific enforceability concerns
   - Flag clauses dealing with liability caps above or below industry norms

7. **Write the artifact** to `.singularskills/legal/<project>/clause-library.md`, starting with `# Clause Library — <project>`.

   Include for each clause type:
   - **Clause Name and Purpose** — what the clause does and why it matters
   - **Standard Version** — balanced clause text
   - **Protective Version** — clause text favoring our position
   - **Minimum Acceptable Version** — bottom-line clause text
   - **Jurisdiction Notes** — enforceability considerations by jurisdiction
   - **Usage Guidance** — when to use which version
   - **Legal Review Required** — yes/no with explanation

## Output

The clause library written to `.singularskills/legal/<project>/clause-library.md`. Present a summary to the user highlighting:
- Total clause types covered
- Clauses flagged as requiring legal review before use
- Key jurisdiction-specific enforceability concerns
- Recommended starting position for each clause type

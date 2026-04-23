---
description: Research a specific legal question with jurisdiction context
---

# Legal Research

Research the legal question "$ARGUMENTS". Identify applicable statutes, regulations, case law, and expert commentary, then synthesize findings into an actionable analysis.

> **Note:** AI-generated legal content does not constitute legal advice. Consult a qualified attorney for complex matters, high-stakes decisions, or novel legal questions.

## Prerequisites

None — this is a utility skill.

## Process

1. **Define the legal question and jurisdiction(s):**
   - Parse "$ARGUMENTS" to identify the core legal question
   - Determine applicable jurisdiction(s) (federal, state, country, or multi-jurisdictional)
   - Note any specific industry or regulatory context that narrows the scope

2. **Research relevant sources:**
   - Use WebSearch to find relevant statutes, regulations, case law, and expert commentary
   - Search across multiple source types: primary law (statutes, regulations), secondary sources (treatises, law review articles), and practitioner commentary
   - Prioritize authoritative sources (official government sites, established legal publishers, bar association resources)

3. **Read key sources in depth:**
   - Use WebFetch to read the full text of the most relevant statutes and regulations
   - Use WebFetch to read key case holdings and reasoning
   - Cross-reference sources to confirm accuracy and identify conflicts

4. **Synthesize findings:**
   - **What the law says** — the black-letter rule from statutes and regulations
   - **How it's been interpreted** — key court decisions and administrative guidance
   - **How it applies to "$ARGUMENTS"** — specific application to the user's question
   - **Areas of ambiguity** — unsettled questions, circuit splits, ongoing legal debates, or pending legislation

5. **Rate confidence level:**
   - **High** — well-established law with consistent interpretation and directly applicable authority
   - **Medium** — clear general rule but limited authority on the specific question or some jurisdictional variation
   - **Low** — unsettled area of law, conflicting authority, or rapidly evolving regulatory landscape

6. **Flag when an attorney should be consulted:**
   - Complex matters involving multiple interacting legal frameworks
   - High-stakes decisions with significant financial or operational exposure
   - Novel questions without clear precedent
   - Situations where the law varies significantly by jurisdiction
   - Any matter that could result in litigation or regulatory action

7. **Write the artifact** to `.metapowers/legal/$ARGUMENTS/legal-research.md` with frontmatter:

   ```
   ---
   description: Legal research for $ARGUMENTS
   ---
   ```

   Include sections:
   - **Research Question** — the legal question as framed
   - **Applicable Jurisdiction(s)** — jurisdictions covered
   - **Statutory and Regulatory Framework** — relevant statutes and regulations with citations
   - **Case Law and Interpretive Guidance** — key decisions and administrative guidance
   - **Analysis** — synthesis of how the law applies to the question
   - **Areas of Ambiguity** — open questions and ongoing debates
   - **Confidence Level** — High/Medium/Low with justification
   - **Attorney Consultation Recommended** — whether and why professional counsel is advised
   - **Sources** — list of all sources consulted with links where available

## Output

The legal research written to `.metapowers/legal/$ARGUMENTS/legal-research.md`. Present a summary to the user highlighting:
- The core legal rule and how it applies
- Confidence level and key factors affecting it
- Areas of ambiguity or risk that warrant further attention
- Whether attorney consultation is recommended and why

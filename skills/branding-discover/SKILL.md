---
name: branding-discover
description: Research the landscape for a brand — the business, existing brand assets, competitor brands, audience and market gaps — into a discovery brief. Use when the user is creating or reworking a brand and first needs to understand the current brand, competitors and audience. Not for open-ended research or checking content against guidelines; see /research-discover or /branding-audit.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: branding
  phase: 1
  artifact: 01-discover.md
---

# Discover

Research the brand landscape for "$ARGUMENTS". Gather insights about the business, audience, competitors, and market to inform brand strategy.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"<skill name>","workflow":"branding","phase":<phase>,"project":"<project>","event":"skipped","artifact":"<artifact file>","note":"<reason or \"none given\">"}`.

## Prerequisites

None — this is the first phase.

## Process

1. **Ask the user key discovery questions:**
   - What does the business do? What problem does it solve?
   - Who is the target audience? (demographics, psychographics)
   - Who are the main competitors?
   - What makes this business different?
   - Are there existing brand elements to audit? (logo, colors, messaging)
   - What is the brand's aspiration? Where should it be in 3-5 years?

2. **If existing brand assets exist:**
   - Ask the user to place assets in `.singularskills/branding/<project>/assets/` (logo/, fonts/, imagery/)
   - Review and document what exists
   - Assess current brand strengths and weaknesses

3. **Competitive brand analysis:**
   - Use WebSearch to research competitor brands
   - Document their positioning, visual identity, and messaging
   - Identify gaps and opportunities for differentiation

4. **Audience research:**
   - Use WebSearch to understand the target audience's preferences, behaviors, and expectations
   - Document audience personas with needs and pain points

5. **Write the artifact** to `.singularskills/branding/<project>/01-discover.md` with sections:
   - **Business Overview** — what the business does, its goals
   - **Existing Brand Audit** — current assets, strengths, weaknesses (if applicable)
   - **Competitive Landscape** — competitor brand analysis
   - **Target Audience** — personas, needs, expectations
   - **Market Insights** — trends, opportunities, gaps
   - **Key Takeaways** — most important findings for the Strategy phase

## Output

The discovery brief written to `.singularskills/branding/<project>/01-discover.md`. Present a summary to the user highlighting:
- Key audience insights
- Competitive positioning gaps
- Biggest brand opportunity identified

**Record the run.** Open the artifact with this frontmatter (`agent` is the agent you run in, or `unknown`; `gate` is `none`, as this phase has no gate):

```yaml
---
skill: branding-discover
workflow: branding
phase: 1
project: <project>
started: <ISO timestamp>
finished: <ISO timestamp>
agent: <the agent you run in, or "unknown">
gate: none
---
```

End the artifact (or your section of a shared artifact) with `## Decisions` and `## Open questions`, in this shape:

```markdown
## Decisions
- <what was chosen> — <why> — <what was rejected>

## Open questions
- <what the next phase or a reviewer must settle>
```

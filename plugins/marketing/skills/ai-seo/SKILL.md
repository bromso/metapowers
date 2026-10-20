---
name: ai-seo
description: Optimize a brand's visibility in AI search — ChatGPT, Perplexity, Google AI Overviews — by checking where it is cited and planning LLM-friendly content and entity signals. Use when the user asks why AI assistants do not mention their product or how to get cited in AI answers. Not for classic Google rankings; see /marketing:seo-audit.
argument-hint: "[project] [--skip-checks]"
---

# AI SEO

Optimize "$ARGUMENTS" for AI-powered search — LLM citations, Google AI Overviews, ChatGPT, Perplexity, and other AI search surfaces.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.metapowers/marketing/<project>/skip-log.md`: `- <ISO timestamp> — <skill name> skipped prerequisite check for <artifact file> — reason: <reason or "none given">`.

## Prerequisites

Read `.metapowers/marketing/<project>/00-strategy.md`. If this file does not exist, tell the user:

> Phase 0 (Strategy) has not been completed for "<project>". Run `/marketing:customer-research <project>` first, or use `--skip-checks` to bypass.

## Process

1. **Read context:**
   - Read `.metapowers/marketing/<project>/00-strategy.md` for positioning and audience
   - Read `.metapowers/marketing/<project>/01-reach.md` if it exists (for content and SEO context)
   - Read `${CLAUDE_PLUGIN_ROOT}/shared/seo-checklist.md` for AI search section

2. **Audit current AI visibility:**
   - Use WebSearch to check if "<project>" appears in AI-generated answers
   - Test key queries in multiple AI search tools
   - Note which competitors are being cited by AI

3. **Analyze AI citation patterns:**
   - What content structure gets cited by LLMs? (lists, definitions, comparisons, data)
   - Which domains are most frequently cited in the category?
   - What makes content "LLM-friendly"? (clear structure, authoritative sources, direct answers)

4. **Develop optimization strategy:**
   - Content structure recommendations (clear H2s, direct answers, FAQ format)
   - Entity optimization (be clearly identifiable as an entity with consistent naming)
   - E-E-A-T signals (experience, expertise, authority, trust markers)
   - Structured data to aid AI understanding
   - Citation-worthy content types (original research, data, tools, definitions)

5. **Write the artifact** — append to `.metapowers/marketing/<project>/01-reach.md` under a `## AI SEO` section. Create the file with a `# Reach — <project>` heading if it does not exist; if a `## AI SEO` section already exists, replace only that section. The section contains:
   - **Current AI Visibility** — where "<project>" appears (or doesn't) in AI answers
   - **Citation Patterns** — what gets cited in this category
   - **Optimization Strategy** — content structure, entity, E-E-A-T recommendations
   - **Content Recommendations** — specific content to create for AI visibility
   - **Monitoring Plan** — how to track AI search presence

## Output

AI SEO strategy appended to `.metapowers/marketing/<project>/01-reach.md`. Present a summary highlighting:
- Current AI search visibility status
- Top 3 optimization opportunities
- Most impactful content type to create

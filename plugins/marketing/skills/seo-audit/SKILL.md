---
name: seo-audit
description: Audit a website's search performance — technical SEO, on-page tags and headings, and keyword gaps against competitors — into a prioritized fix list. Use when the user's site is not ranking or getting organic traffic and they want to know what to fix first. Not for AI search, schema or URL structure; see /marketing:ai-seo, /marketing:schema-markup or /marketing:site-architecture.
argument-hint: "[project] [--skip-checks]"
---

# SEO Audit

Conduct a comprehensive SEO audit for "$ARGUMENTS". Analyze technical SEO, on-page optimization, and content gaps to identify improvement opportunities.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.metapowers/marketing/<project>/skip-log.md`: `- <ISO timestamp> — <skill name> skipped prerequisite check for <artifact file> — reason: <reason or "none given">`.

## Prerequisites

Read `.metapowers/marketing/<project>/00-strategy.md`. If this file does not exist, tell the user:

> Phase 0 (Strategy) has not been completed for "<project>". Run `/marketing:customer-research <project>` first, or use `--skip-checks` to bypass.

## Process

1. **Read context:**
   - Read `.metapowers/marketing/<project>/00-strategy.md` for audience and competitor data
   - Read `${CLAUDE_PLUGIN_ROOT}/shared/seo-checklist.md` for the audit framework
   - Read `${CLAUDE_PLUGIN_ROOT}/shared/race-framework-guide.md` for Reach phase guidance

2. **Technical SEO analysis:**
   - If a URL is provided, use WebFetch to analyze the site
   - Check against the technical SEO checklist: site speed, mobile-friendliness, HTTPS, sitemaps, robots.txt
   - Identify crawlability and indexability issues
   - Check Core Web Vitals status

3. **On-page SEO analysis:**
   - Evaluate title tags, meta descriptions, heading structure
   - Check keyword usage and content optimization
   - Analyze internal linking structure
   - Review image optimization (alt text, file size, format)

4. **Content gap analysis:**
   - Use WebSearch to identify high-value keywords competitors rank for
   - Find "low-hanging fruit" — keywords with search volume and low competition
   - Map content gaps to content pillars (if content-strategy has been run)

5. **Prioritize recommendations:**
   - Score each issue by impact (traffic potential) and effort (implementation difficulty)
   - Create a prioritized action list: quick wins first, then strategic investments
   - Estimate traffic impact of top recommendations

6. **Write the artifact** — append to `.metapowers/marketing/<project>/01-reach.md` under a `## SEO Audit` section. Create the file with a `# Reach — <project>` heading if it does not exist; if a `## SEO Audit` section already exists, replace only that section. The section contains:
   - **Technical SEO** — issues found, severity, fix recommendations
   - **On-Page SEO** — optimization gaps per page
   - **Content Gaps** — keyword opportunities with search volume estimates
   - **Prioritized Action Plan** — ranked by impact/effort
   - **Estimated Impact** — traffic potential of top fixes

## Output

SEO audit appended to `.metapowers/marketing/<project>/01-reach.md`. Present a summary highlighting:
- Critical technical issues (if any)
- Top 5 keyword opportunities
- Recommended first actions

---
name: marketing-seo-audit
description: Audit a website's search performance — technical SEO, on-page tags and headings, and keyword gaps against competitors — into a prioritized fix list. Use when the user's site is not ranking or getting organic traffic and they want to know what to fix first. Not for AI search, schema or URL structure; see /marketing-ai-seo, /marketing-schema-markup or /marketing-site-architecture.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: marketing
  phase: 1
  artifact: 01-reach.md
---

# SEO Audit

Conduct a comprehensive SEO audit for "$ARGUMENTS". Analyze technical SEO, on-page optimization, and content gaps to identify improvement opportunities.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"marketing-seo-audit","workflow":"marketing","phase":1,"project":"<project>","event":"skipped","artifact":"01-reach.md","note":"<reason or \"none given\">"}`.

## Prerequisites

**Part of a workflow.** This skill is phase 1 (Reach) of the RACE Framework workflow (`marketing`); cross-domain workflows run it too. First check `.singularskills/log.jsonl` for an open run for this project: a `run-started` line with `"project":"<project>"` and no later `run-finished` line for the same `workflow` and `project`. If one exists, the conductor is running you: continue here. Otherwise, if the user asked to start, run, continue or resume a process or workflow rather than this one step, do not continue here: invoke the `workflow` skill with the workflow the user asked for, or `marketing` when they named none, followed by `<project>`; it runs this phase in order, asks before it writes and records the run. Otherwise continue here: a later phase runs on its own, behind its gate.

Run this skill's gate before writing: `sh <this skill's folder>/scripts/gate.sh <project> <project root>`, where `<project root>` is the folder that contains `.singularskills/` (use `.` when you are already there). If it exits non-zero, stop and tell the user what it printed, unless `--skip-checks` was given (see Arguments). On a refusal, before you stop, append this line to `.singularskills/log.jsonl` (create the folder and file if missing): `{"ts":"<ISO timestamp>","skill":"marketing-seo-audit","workflow":"marketing","phase":1,"project":"<project>","event":"refused","artifact":"01-reach.md","note":"<what the gate printed>"}`. Once the gate has passed, or under `--skip-checks` once you have appended the `skipped` line, append this line before you start work: `{"ts":"<ISO timestamp>","skill":"marketing-seo-audit","workflow":"marketing","phase":1,"project":"<project>","event":"started","artifact":"01-reach.md","note":""}`.

Read `.singularskills/marketing/<project>/00-strategy.md`. If this file does not exist, tell the user:

> Phase 0 (Strategy) has not been completed for "<project>". Run `/marketing-customer-research <project>` first, or use `--skip-checks` to bypass.

## Process

1. **Read context:**
   - Read `.singularskills/marketing/<project>/00-strategy.md` for audience and competitor data
   - Read `references/seo-checklist.md` for the audit framework
   - Read `references/race-framework-guide.md` for Reach phase guidance

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

6. **Write the artifact** — append to `.singularskills/marketing/<project>/01-reach.md` under a `## SEO Audit` section. Create the file with a `# Reach — <project>` heading if it does not exist; if a `## SEO Audit` section already exists, replace only that section. The section contains:
   - **Technical SEO** — issues found, severity, fix recommendations
   - **On-Page SEO** — optimization gaps per page
   - **Content Gaps** — keyword opportunities with search volume estimates
   - **Prioritized Action Plan** — ranked by impact/effort
   - **Estimated Impact** — traffic potential of top fixes

## Output

SEO audit appended to `.singularskills/marketing/<project>/01-reach.md`. Present a summary highlighting:
- Critical technical issues (if any)
- Top 5 keyword opportunities
- Recommended first actions

**Record the run.** After you have written your section, append this line to `.singularskills/log.jsonl` (the `started` line of Prerequisites, with `"event":"finished"`): `{"ts":"<ISO timestamp>","skill":"marketing-seo-audit","workflow":"marketing","phase":1,"project":"<project>","event":"finished","artifact":"01-reach.md","note":""}`.

This artifact is shared by every skill of phase 1 (Reach). The frontmatter is written once, by whoever creates the file: if you create it, open it with the block below (`skill` is the phase title, `started` the time of that first write; `gate` is `passed` when the gate ran clean and `skipped` under `--skip-checks`); if it already exists, leave the block alone except to update `finished` and to set `gate` to the worst value among the sections (`skipped` over `passed`).

```yaml
---
skill: Reach
workflow: marketing
phase: 1
project: <project>
started: <ISO timestamp>
finished: <ISO timestamp>
agent: <the agent you run in, or "unknown">
gate: <passed|skipped>
---
```

Open your `## SEO Audit` section with one italic line, `*<skill name> · <ISO timestamp> · gate: <passed|skipped>*` (your skill name is `marketing-seo-audit`).

End your section with `### Decisions` and `### Open questions` (one level under your `## SEO Audit` heading, so the section stays one block), in this shape:

```markdown
### Decisions
- <what was chosen> — <why> — <what was rejected>

### Open questions
- <what the next phase or a reviewer must settle>
```

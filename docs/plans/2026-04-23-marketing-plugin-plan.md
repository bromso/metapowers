# Marketing Plugin Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Create a 33-skill marketing plugin implementing the RACE Framework, plus documentation in apps/docs.

**Architecture:** Claude Code plugin following the existing metapowers pattern — SKILL.md files with YAML frontmatter, shared templates, hooks for phase gating, MCP config for analytics. Documentation as MDX pages in Fumadocs.

**Tech Stack:** Markdown (SKILL.md), Bash (hooks), JSON (manifests), MDX (docs)

---

### Task 1: Plugin scaffold — manifest, hooks, MCP config

**Files:**
- Create: `plugins/marketing/.claude-plugin/plugin.json`
- Create: `plugins/marketing/.mcp.json`
- Create: `plugins/marketing/hooks/hooks.json`
- Create: `plugins/marketing/hooks/check-strategy-exists.sh`
- Modify: `.claude-plugin/marketplace.json`

**Step 1: Create plugin.json**

```bash
mkdir -p plugins/marketing/.claude-plugin plugins/marketing/hooks plugins/marketing/shared plugins/marketing/skills plugins/marketing/commands plugins/marketing/agents
```

Write `plugins/marketing/.claude-plugin/plugin.json`:
```json
{
  "name": "marketing",
  "version": "0.1.0",
  "description": "RACE Framework marketing process — strategy, reach, act, convert, engage with 33 skills",
  "author": {
    "name": "Jonas Broms"
  },
  "repository": "https://github.com/bromso/metapowers",
  "license": "MIT",
  "skills": "../skills/",
  "commands": "../commands/",
  "agents": "../agents/",
  "hooks": "../hooks/hooks.json",
  "mcpServers": "../.mcp.json"
}
```

**Step 2: Create .mcp.json**

Write `plugins/marketing/.mcp.json`:
```json
{
  "mcpServers": {
    "metapowers-analytics": {
      "command": "node",
      "args": ["${CLAUDE_PLUGIN_ROOT}/../../packages/analytics-mcp/dist/index.js"],
      "env": {
        "GOOGLE_ANALYTICS_CREDENTIALS": "${GOOGLE_ANALYTICS_CREDENTIALS}"
      }
    }
  }
}
```

**Step 3: Create hooks.json**

Write `plugins/marketing/hooks/hooks.json`:
```json
{
  "hooks": {}
}
```

Note: hooks.json is empty for now (same as research plugin). Phase gating is handled via prerequisite checks in SKILL.md files. The hooks.json can be extended later when the analytics MCP server is built to gate MCP calls on strategy completion.

**Step 4: Create check-strategy-exists.sh**

Write `plugins/marketing/hooks/check-strategy-exists.sh`:
```bash
#!/usr/bin/env bash
set -euo pipefail

# Allow bypass via env var
if [[ "${MARKETING_SKIP_CHECKS:-}" == "1" ]]; then
  exit 0
fi

# Try to find .marketing/<name>/ directories to infer current topic
TOPIC_DIR=$(find .marketing -mindepth 1 -maxdepth 1 -type d 2>/dev/null | head -1)

if [[ -z "$TOPIC_DIR" ]]; then
  echo "BLOCKED: No .marketing/ directory found. Run /marketing:customer-research first." >&2
  exit 1
fi

TOPIC=$(basename "$TOPIC_DIR")
STRATEGY_FILE=".marketing/${TOPIC}/00-strategy.md"

if [[ ! -f "$STRATEGY_FILE" ]]; then
  echo "BLOCKED: ${STRATEGY_FILE} not found." >&2
  echo "" >&2
  echo "The Strategy phase must be completed before running this skill." >&2
  echo "Run a Strategy skill first (e.g., /marketing:customer-research ${TOPIC})" >&2
  echo "" >&2
  echo "To bypass: export MARKETING_SKIP_CHECKS=1" >&2
  exit 1
fi

exit 0
```

Make executable: `chmod +x plugins/marketing/hooks/check-strategy-exists.sh`

**Step 5: Register in marketplace.json**

Add to the `plugins` array in `.claude-plugin/marketplace.json`:
```json
{
  "name": "marketing",
  "source": "./plugins/marketing",
  "description": "RACE Framework marketing process — strategy, reach, act, convert, engage with 33 skills",
  "version": "0.1.0",
  "keywords": ["marketing", "growth", "seo", "cro", "race-framework", "digital-marketing"],
  "category": "marketing"
}
```

**Step 6: Commit**

```bash
git add plugins/marketing/ .claude-plugin/marketplace.json
git commit -m "feat(marketing): scaffold plugin with manifest, hooks, and MCP config"
```

---

### Task 2: Shared templates

**Files:**
- Create: `plugins/marketing/shared/race-framework-guide.md`
- Create: `plugins/marketing/shared/marketing-brief-template.md`
- Create: `plugins/marketing/shared/campaign-plan-template.md`
- Create: `plugins/marketing/shared/seo-checklist.md`

**Step 1: Create race-framework-guide.md**

Write `plugins/marketing/shared/race-framework-guide.md`:
```markdown
# RACE Framework

The RACE Framework is a practical digital marketing planning framework developed by Smart Insights. It structures marketing activity across four lifecycle stages, preceded by a Strategy phase.

## Strategy (Phase 0 — Plan)

Define the audience, market context, competitive positioning, and goals before any marketing activity. Without strategy, tactics are guesswork.

**Key activities:** customer research, competitor analysis, pricing evaluation, value proposition definition, messaging framework, GTM planning

**Success metrics:** documented personas, clear positioning statement, defined KPIs per RACE phase

## Reach (Phase 1 — Attract)

Build visibility and attract the right audience. Create awareness through content, search, social, and community channels.

**Key activities:** content strategy, SEO (technical + content), social media, community building, PR, directory listings, launch campaigns

**Success metrics:** organic traffic, search rankings, social reach, brand awareness, share of voice

## Act (Phase 2 — Interact)

Encourage interaction on your website or platforms. Optimize touchpoints to generate interest, leads, and engagement.

**Key activities:** copywriting, landing page optimization, form optimization, lead magnets, free tools, behavioral psychology, structured data

**Success metrics:** bounce rate, pages per session, lead generation rate, content engagement, time on site

## Convert (Phase 3 — Close)

Turn interest into revenue. Run campaigns, nurture leads, and optimize conversion flows.

**Key activities:** email sequences, paid advertising, outbound, signup flow optimization, A/B testing, sales enablement

**Success metrics:** conversion rate, cost per acquisition, email open/click rates, ROAS, trial-to-paid rate

## Engage (Phase 4 — Retain & Grow)

Retain customers, reduce churn, and turn customers into advocates. Maximize lifetime value.

**Key activities:** onboarding optimization, churn prevention, referral programs, upgrade flow optimization, loyalty programs

**Success metrics:** retention rate, churn rate, NPS, referral rate, customer lifetime value, expansion revenue
```

**Step 2: Create marketing-brief-template.md**

Write `plugins/marketing/shared/marketing-brief-template.md`:
```markdown
# Marketing Brief: [Topic]

## Target Audience
### Primary Persona
- **Who:** [Role, demographics]
- **Jobs to be done:** [What they're trying to accomplish]
- **Pain points:** [What frustrates them today]
- **Current solutions:** [How they solve this now]

### Secondary Persona(s)
- [If applicable]

## Value Proposition
- **For** [target audience]
- **Who** [need or opportunity]
- **Our** [product/service]
- **Is a** [category]
- **That** [key benefit]
- **Unlike** [alternatives]
- **We** [key differentiator]

## Messaging Framework
| Audience | Key Message | Proof Points | Tone |
|----------|-------------|--------------|------|
| | | | |

## Competitive Positioning
| Competitor | Strengths | Weaknesses | Our Advantage |
|-----------|-----------|------------|---------------|
| | | | |

## Success Metrics (KPIs)
| RACE Phase | KPI | Current | Target | Timeline |
|------------|-----|---------|--------|----------|
| Reach | | | | |
| Act | | | | |
| Convert | | | | |
| Engage | | | | |

## Budget & Resources
| Item | Budget | Owner |
|------|--------|-------|
| | | |

## Timeline
| Milestone | Date | Status |
|-----------|------|--------|
| | | |
```

**Step 3: Create campaign-plan-template.md**

Write `plugins/marketing/shared/campaign-plan-template.md`:
```markdown
# Campaign Plan: [Campaign Name]

## Objective & Hypothesis
**Objective:** [What this campaign aims to achieve]
**Hypothesis:** If we [action], then [audience] will [desired outcome], because [rationale].

## Target Segment
- **Audience:** [Who]
- **Segment size:** [Estimated reach]
- **Current behavior:** [What they do now]
- **Desired behavior:** [What we want them to do]

## Channels & Tactics
| Channel | Tactic | Budget | Timeline | Owner |
|---------|--------|--------|----------|-------|
| | | | | |

## Creative Requirements
| Asset | Format | Specs | Status |
|-------|--------|-------|--------|
| | | | |

## Budget Allocation
| Category | Amount | % of Total |
|----------|--------|------------|
| | | |
| **Total** | | 100% |

## Measurement Plan
### Primary Metrics
| Metric | Baseline | Target | Measurement Method |
|--------|----------|--------|--------------------|
| | | | |

### Secondary Metrics
| Metric | Baseline | Target | Measurement Method |
|--------|----------|--------|--------------------|
| | | | |

## A/B Test Plan
| Element | Variant A | Variant B | Hypothesis | Success Metric |
|---------|-----------|-----------|------------|----------------|
| | | | | |

## Risks & Mitigations
| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| | | | |
```

**Step 4: Create seo-checklist.md**

Write `plugins/marketing/shared/seo-checklist.md`:
```markdown
# SEO Checklist

## Technical SEO
- [ ] Site loads in under 3 seconds (Core Web Vitals: LCP < 2.5s)
- [ ] Mobile-responsive design (passes Google Mobile-Friendly Test)
- [ ] HTTPS enabled across all pages
- [ ] XML sitemap submitted to Google Search Console
- [ ] robots.txt properly configured
- [ ] No broken links (4xx errors)
- [ ] No redirect chains (max 1 redirect hop)
- [ ] Canonical tags on all pages
- [ ] Hreflang tags for multi-language sites
- [ ] Structured data (schema.org) on key pages
- [ ] Clean URL structure (readable, lowercase, hyphens)
- [ ] Proper 301 redirects for moved content

## On-Page SEO
- [ ] Unique title tag per page (50-60 characters)
- [ ] Unique meta description per page (150-160 characters)
- [ ] One H1 per page containing primary keyword
- [ ] Logical heading hierarchy (H1 → H2 → H3)
- [ ] Primary keyword in first 100 words
- [ ] Internal links to related content (3-5 per page)
- [ ] Descriptive alt text on all images
- [ ] Optimized image file sizes (WebP format preferred)
- [ ] Content length appropriate for search intent

## Content SEO
- [ ] Content matches search intent (informational, transactional, navigational)
- [ ] Comprehensive topic coverage (vs. top-ranking competitors)
- [ ] Original research, data, or insights where possible
- [ ] Updated publication date on refreshed content
- [ ] FAQ section for "People Also Ask" targeting
- [ ] Clear calls to action

## AI Search Optimization
- [ ] Clear, direct answers to common questions (AI Overview targeting)
- [ ] Structured content with clear section headings
- [ ] Authoritative citations and data sources
- [ ] Entity-rich content (people, organizations, concepts)
- [ ] Content that demonstrates E-E-A-T (Experience, Expertise, Authority, Trust)

## Off-Page SEO
- [ ] Google Business Profile (if applicable)
- [ ] Consistent NAP across directories (if local)
- [ ] Quality backlink profile (no toxic links)
- [ ] Social signals (shareable content, social profiles linked)
```

**Step 5: Commit**

```bash
git add plugins/marketing/shared/
git commit -m "feat(marketing): add shared templates — RACE guide, brief, campaign plan, SEO checklist"
```

---

### Task 3: Phase 0 — Strategy skills (5 skills)

**Files:**
- Create: `plugins/marketing/skills/customer-research/SKILL.md`
- Create: `plugins/marketing/skills/competitor-profiling/SKILL.md`
- Create: `plugins/marketing/skills/competitor-alternatives/SKILL.md`
- Create: `plugins/marketing/skills/pricing-strategy/SKILL.md`
- Create: `plugins/marketing/skills/product-marketing-context/SKILL.md`

**Step 1: Create customer-research/SKILL.md**

```bash
mkdir -p plugins/marketing/skills/customer-research
```

Write `plugins/marketing/skills/customer-research/SKILL.md`:
```markdown
---
description: Deep-dive into target audience — personas, jobs-to-be-done, pain points
---

# Customer Research

Research the target audience for "$ARGUMENTS". Build detailed personas, map jobs-to-be-done, identify pain points, and understand the buyer journey.

## Prerequisites

None — this is typically the first Strategy skill to run.

## Process

1. **Web research** to understand the target audience:
   - Use WebSearch to find audience research, surveys, forum discussions, and industry reports about "$ARGUMENTS"
   - Use WebFetch to read the most relevant sources in depth (aim for 5-8 quality sources)
   - Look for: demographic data, behavioral patterns, purchase motivations, common objections

2. **Build personas:**
   - Create 2-3 detailed buyer personas based on findings
   - For each: demographics, goals, frustrations, current solutions, decision-making process
   - Identify the primary persona (highest value / most common)

3. **Map jobs-to-be-done:**
   - Identify the functional, social, and emotional jobs the audience is hiring for
   - Map the "when" — what triggers the need
   - Document desired outcomes and success metrics from the audience's perspective

4. **Identify pain points and objections:**
   - What frustrates them about current solutions?
   - What prevents them from switching or buying?
   - What questions do they ask before purchasing?
   - Mine forums, review sites, and social media for unfiltered language

5. **Map the buyer journey:**
   - Document awareness → consideration → decision stages
   - Identify touchpoints and information needs at each stage
   - Note where they research, who influences them, and what content they consume

6. **Write the artifact** — append to `.marketing/$ARGUMENTS/00-strategy.md` under a `## Customer Research` section:
   - **Personas** — 2-3 detailed buyer personas
   - **Jobs to Be Done** — functional, social, emotional jobs
   - **Pain Points & Objections** — frustrations, barriers, common questions
   - **Buyer Journey** — stages, touchpoints, information needs
   - **Key Insights** — top 3-5 actionable insights

## Output

Customer research appended to `.marketing/$ARGUMENTS/00-strategy.md`. Present a summary highlighting:
- Primary persona profile
- Top pain points discovered
- Most important insight for messaging
```

**Step 2: Create competitor-profiling/SKILL.md**

```bash
mkdir -p plugins/marketing/skills/competitor-profiling
```

Write `plugins/marketing/skills/competitor-profiling/SKILL.md`:
```markdown
---
description: Map competitive landscape — positioning, strengths, gaps, and opportunities
---

# Competitor Profiling

Analyze the competitive landscape for "$ARGUMENTS". Profile key competitors, map their positioning, identify strengths and weaknesses, and find market gaps.

## Prerequisites

None — can be run independently or after customer-research.

## Process

1. **Identify competitors:**
   - Use WebSearch to find direct and indirect competitors for "$ARGUMENTS"
   - Categorize: direct competitors, indirect competitors, potential future competitors
   - Aim for 5-8 competitors to analyze

2. **Profile each competitor:**
   - Use WebFetch to read their website, pricing page, and key marketing pages
   - Document: value proposition, target audience, pricing model, key features, market position
   - Note their messaging tone, brand positioning, and content strategy

3. **Analyze strengths and weaknesses:**
   - What do they do well? What do customers praise?
   - Where do they fall short? What do customers complain about?
   - Use WebSearch to find reviews, comparisons, and user feedback

4. **Map the competitive landscape:**
   - Create a positioning matrix (e.g., price vs. feature depth, or ease-of-use vs. power)
   - Identify white space — underserved segments or unmet needs
   - Note emerging trends competitors are or aren't addressing

5. **Identify opportunities:**
   - Where can "$ARGUMENTS" differentiate?
   - What competitor weaknesses can be exploited?
   - What market gaps are no one filling?

6. **Write the artifact** — append to `.marketing/$ARGUMENTS/00-strategy.md` under a `## Competitor Analysis` section:
   - **Competitor Profiles** — summary of each competitor
   - **Positioning Matrix** — visual landscape map
   - **Strengths & Weaknesses** — per competitor
   - **Market Gaps** — underserved needs or segments
   - **Differentiation Opportunities** — where to win

## Output

Competitor analysis appended to `.marketing/$ARGUMENTS/00-strategy.md`. Present a summary highlighting:
- Top 3 competitors and their positioning
- Biggest market gap identified
- Recommended differentiation angle
```

**Step 3: Create competitor-alternatives/SKILL.md**

```bash
mkdir -p plugins/marketing/skills/competitor-alternatives
```

Write `plugins/marketing/skills/competitor-alternatives/SKILL.md`:
```markdown
---
description: Create "vs" and alternatives positioning content strategy
---

# Competitor Alternatives

Develop "vs" comparison and "alternatives to" content strategy for "$ARGUMENTS". Create positioning frameworks that highlight differentiation against specific competitors.

## Prerequisites

Read `.marketing/$ARGUMENTS/00-strategy.md`. If this file does not exist or lacks a `## Competitor Analysis` section, suggest running `/marketing:competitor-profiling $ARGUMENTS` first.

If `--skip-checks` is present in $ARGUMENTS, skip this check and log to `.marketing/$ARGUMENTS/skip-log.md`.

## Process

1. **Read context:**
   - Read `.marketing/$ARGUMENTS/00-strategy.md` for competitor profiles and positioning
   - Read `plugins/marketing/shared/race-framework-guide.md` for methodology reference

2. **Identify high-value comparison targets:**
   - Use WebSearch to find which competitor comparisons have search volume
   - Prioritize competitors that share the most audience overlap
   - Identify "alternatives to [competitor]" search opportunities

3. **Build comparison frameworks:**
   - For each target competitor, create a feature comparison matrix
   - Identify the 3-5 key differentiators (where "$ARGUMENTS" wins)
   - Note honest areas where competitors are stronger (builds credibility)

4. **Draft positioning angles:**
   - For each competitor: one-sentence "why switch" message
   - Category-level "alternatives" positioning
   - Objection handling for each competitor's strengths

5. **Write the artifact** — append to `.marketing/$ARGUMENTS/00-strategy.md` under a `## Competitor Alternatives` section:
   - **Comparison Targets** — ranked by opportunity
   - **Comparison Matrices** — feature-by-feature for top competitors
   - **Positioning Angles** — per-competitor messaging
   - **Content Recommendations** — what pages/posts to create

## Output

Competitor alternatives strategy appended to `.marketing/$ARGUMENTS/00-strategy.md`. Present a summary highlighting:
- Top 3 comparison opportunities by search volume
- Strongest differentiators to lead with
- Recommended content pieces to create
```

**Step 4: Create pricing-strategy/SKILL.md**

```bash
mkdir -p plugins/marketing/skills/pricing-strategy
```

Write `plugins/marketing/skills/pricing-strategy/SKILL.md`:
```markdown
---
description: Evaluate pricing models, tiers, and packaging strategy
---

# Pricing Strategy

Evaluate and recommend pricing strategy for "$ARGUMENTS". Analyze pricing models, tier structures, packaging, and competitive pricing.

## Prerequisites

Read `.marketing/$ARGUMENTS/00-strategy.md`. If this file does not exist, suggest running `/marketing:customer-research $ARGUMENTS` first to understand the audience.

If `--skip-checks` is present in $ARGUMENTS, skip this check and log to `.marketing/$ARGUMENTS/skip-log.md`.

## Process

1. **Read context:**
   - Read `.marketing/$ARGUMENTS/00-strategy.md` for audience and competitor data
   - Read `plugins/marketing/shared/race-framework-guide.md` for methodology reference

2. **Analyze current pricing landscape:**
   - Use WebSearch to research competitor pricing for "$ARGUMENTS" category
   - Use WebFetch to read pricing pages of top competitors
   - Document: pricing models (flat, usage, per-seat, freemium), price points, tier structures

3. **Evaluate pricing models:**
   - Which model aligns with the value metric? (what do users pay for?)
   - Flat rate vs. usage-based vs. per-seat vs. hybrid
   - Free tier / freemium considerations
   - Annual vs. monthly pricing and discount strategy

4. **Design tier structure:**
   - Recommend tier names, price points, and feature allocation
   - Apply the "good-better-best" framework
   - Identify the anchor tier (where most users should land)
   - Define upgrade triggers between tiers

5. **Pricing psychology:**
   - Anchoring: which tier makes the target tier look like a deal?
   - Charm pricing vs. round numbers for the category
   - Annual discount percentage recommendations
   - Free trial vs. freemium decision

6. **Write the artifact** — append to `.marketing/$ARGUMENTS/00-strategy.md` under a `## Pricing Strategy` section:
   - **Competitive Pricing Landscape** — what competitors charge and how
   - **Recommended Model** — pricing model with rationale
   - **Tier Structure** — tiers, price points, features per tier
   - **Pricing Psychology** — anchoring, discount strategy
   - **Risks & Considerations** — potential issues with recommended approach

## Output

Pricing strategy appended to `.marketing/$ARGUMENTS/00-strategy.md`. Present a summary highlighting:
- Recommended pricing model and why
- Proposed tier structure with price points
- Key pricing psychology tactics to apply
```

**Step 5: Create product-marketing-context/SKILL.md**

```bash
mkdir -p plugins/marketing/skills/product-marketing-context
```

Write `plugins/marketing/skills/product-marketing-context/SKILL.md`:
```markdown
---
description: Define value propositions, messaging framework, and go-to-market context
---

# Product Marketing Context

Define the core product marketing foundation for "$ARGUMENTS". Create value propositions, messaging framework, positioning statement, and go-to-market context.

## Prerequisites

Read `.marketing/$ARGUMENTS/00-strategy.md`. This skill works best after customer-research and competitor-profiling have been run, but can be used standalone.

If `--skip-checks` is present in $ARGUMENTS, skip this check and log to `.marketing/$ARGUMENTS/skip-log.md`.

## Process

1. **Read context:**
   - Read `.marketing/$ARGUMENTS/00-strategy.md` for all prior strategy work
   - Read `plugins/marketing/shared/marketing-brief-template.md` for output structure
   - Read `plugins/marketing/shared/race-framework-guide.md` for methodology reference

2. **Craft the positioning statement:**
   - Use the format: For [target], who [need], [product] is a [category] that [key benefit]. Unlike [alternatives], we [differentiator].
   - Test it against: Is it specific? Defensible? Meaningful to the audience?

3. **Build the messaging framework:**
   - Define 3-5 key messages, each with proof points
   - Map messages to personas (which message resonates with which audience?)
   - Define tone and voice guidelines for this product/campaign
   - Create a message hierarchy: primary → supporting → proof points

4. **Define the value proposition:**
   - What is the core value delivered?
   - What are the functional, emotional, and social benefits?
   - What is the "so what?" for each feature?

5. **Go-to-market context:**
   - What channels will be used? (informed by competitor analysis)
   - What is the launch or growth motion?
   - What are the key milestones and success metrics?

6. **Write the artifact** — append to `.marketing/$ARGUMENTS/00-strategy.md` under a `## Product Marketing Context` section. Also compile the full strategy into a marketing brief using the template structure:
   - **Positioning Statement** — the core positioning
   - **Value Proposition** — core + supporting benefits
   - **Messaging Framework** — messages, proof points, tone
   - **Go-to-Market Context** — channels, motion, milestones
   - **Marketing Brief Summary** — compiled brief following `marketing-brief-template.md`

## Output

Product marketing context appended to `.marketing/$ARGUMENTS/00-strategy.md`. Present a summary highlighting:
- The positioning statement
- Top 3 key messages
- Recommended go-to-market motion
```

**Step 6: Commit**

```bash
git add plugins/marketing/skills/customer-research/ plugins/marketing/skills/competitor-profiling/ plugins/marketing/skills/competitor-alternatives/ plugins/marketing/skills/pricing-strategy/ plugins/marketing/skills/product-marketing-context/
git commit -m "feat(marketing): add Phase 0 Strategy skills (5 skills)"
```

---

### Task 4: Phase 1 — Reach skills (9 skills)

**Files:**
- Create: `plugins/marketing/skills/content-strategy/SKILL.md`
- Create: `plugins/marketing/skills/seo-audit/SKILL.md`
- Create: `plugins/marketing/skills/ai-seo/SKILL.md`
- Create: `plugins/marketing/skills/programmatic-seo/SKILL.md`
- Create: `plugins/marketing/skills/site-architecture/SKILL.md`
- Create: `plugins/marketing/skills/social-content/SKILL.md`
- Create: `plugins/marketing/skills/community-marketing/SKILL.md`
- Create: `plugins/marketing/skills/directory-submissions/SKILL.md`
- Create: `plugins/marketing/skills/launch-strategy/SKILL.md`

**Step 1: Create content-strategy/SKILL.md**

```bash
mkdir -p plugins/marketing/skills/content-strategy
```

Write `plugins/marketing/skills/content-strategy/SKILL.md`:
```markdown
---
description: Plan content pillars, editorial calendar, and distribution strategy
---

# Content Strategy

Develop a comprehensive content strategy for "$ARGUMENTS". Define content pillars, plan an editorial calendar, and map distribution channels.

## Prerequisites

Read `.marketing/$ARGUMENTS/00-strategy.md`. If this file does not exist, tell the user:

> Phase 0 (Strategy) has not been completed for "$ARGUMENTS". Run `/marketing:customer-research $ARGUMENTS` first, or use `--skip-checks` to bypass.

If `--skip-checks` is present in $ARGUMENTS, skip this check and log to `.marketing/$ARGUMENTS/skip-log.md`.

## Process

1. **Read context:**
   - Read `.marketing/$ARGUMENTS/00-strategy.md` for audience, positioning, and competitive context
   - Read `plugins/marketing/shared/race-framework-guide.md` for Reach phase guidance

2. **Define content pillars:**
   - Identify 3-5 core topics that align with the product positioning and audience needs
   - Each pillar should map to a key search intent or audience pain point
   - Validate pillars against competitor content gaps

3. **Content audit (if applicable):**
   - Use WebSearch to audit existing content from "$ARGUMENTS" (if a URL is provided)
   - Identify what's performing, what's missing, and what needs updating
   - Map content gaps against the pillar strategy

4. **Plan content types and formats:**
   - Blog posts, guides, case studies, videos, podcasts, newsletters, social
   - Map formats to funnel stages (awareness, consideration, decision)
   - Identify the 80/20: which formats deliver the most value with least effort?

5. **Build editorial calendar framework:**
   - Publishing cadence recommendation (frequency per channel)
   - Content mix across pillars and formats
   - Seasonal or event-driven content opportunities
   - Repurposing strategy (one piece → multiple formats)

6. **Map distribution channels:**
   - Where does the audience consume content? (informed by customer research)
   - Owned, earned, paid distribution plan
   - SEO vs. social vs. email vs. community distribution weighting

7. **Write the artifact** to `.marketing/$ARGUMENTS/01-reach.md` under a `## Content Strategy` section:
   - **Content Pillars** — topics with rationale
   - **Content Types & Formats** — mapped to funnel stages
   - **Editorial Calendar Framework** — cadence, mix, seasonal
   - **Distribution Plan** — channels, weighting, repurposing
   - **Quick Wins** — first 5 pieces to create

## Output

Content strategy written to `.marketing/$ARGUMENTS/01-reach.md`. Present a summary highlighting:
- Content pillars defined
- Recommended publishing cadence
- Top 3 quick-win content pieces to start with
```

**Step 2: Create seo-audit/SKILL.md**

```bash
mkdir -p plugins/marketing/skills/seo-audit
```

Write `plugins/marketing/skills/seo-audit/SKILL.md`:
```markdown
---
description: Technical SEO, on-page SEO, and content gap analysis
---

# SEO Audit

Conduct a comprehensive SEO audit for "$ARGUMENTS". Analyze technical SEO, on-page optimization, and content gaps to identify improvement opportunities.

## Prerequisites

Read `.marketing/$ARGUMENTS/00-strategy.md`. If this file does not exist, tell the user:

> Phase 0 (Strategy) has not been completed for "$ARGUMENTS". Run `/marketing:customer-research $ARGUMENTS` first, or use `--skip-checks` to bypass.

If `--skip-checks` is present in $ARGUMENTS, skip this check and log to `.marketing/$ARGUMENTS/skip-log.md`.

## Process

1. **Read context:**
   - Read `.marketing/$ARGUMENTS/00-strategy.md` for audience and competitor data
   - Read `plugins/marketing/shared/seo-checklist.md` for the audit framework
   - Read `plugins/marketing/shared/race-framework-guide.md` for Reach phase guidance

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

6. **Write the artifact** — append to `.marketing/$ARGUMENTS/01-reach.md` under a `## SEO Audit` section:
   - **Technical SEO** — issues found, severity, fix recommendations
   - **On-Page SEO** — optimization gaps per page
   - **Content Gaps** — keyword opportunities with search volume estimates
   - **Prioritized Action Plan** — ranked by impact/effort
   - **Estimated Impact** — traffic potential of top fixes

## Output

SEO audit appended to `.marketing/$ARGUMENTS/01-reach.md`. Present a summary highlighting:
- Critical technical issues (if any)
- Top 5 keyword opportunities
- Recommended first actions
```

**Step 3: Create ai-seo/SKILL.md**

```bash
mkdir -p plugins/marketing/skills/ai-seo
```

Write `plugins/marketing/skills/ai-seo/SKILL.md`:
```markdown
---
description: AI-search optimization — LLM visibility, AI Overviews, and citation strategy
---

# AI SEO

Optimize "$ARGUMENTS" for AI-powered search — LLM citations, Google AI Overviews, ChatGPT, Perplexity, and other AI search surfaces.

## Prerequisites

Read `.marketing/$ARGUMENTS/00-strategy.md`. If this file does not exist, tell the user:

> Phase 0 (Strategy) has not been completed for "$ARGUMENTS". Run `/marketing:customer-research $ARGUMENTS` first, or use `--skip-checks` to bypass.

If `--skip-checks` is present in $ARGUMENTS, skip this check and log to `.marketing/$ARGUMENTS/skip-log.md`.

## Process

1. **Read context:**
   - Read `.marketing/$ARGUMENTS/00-strategy.md` for positioning and audience
   - Read `.marketing/$ARGUMENTS/01-reach.md` if it exists (for content and SEO context)
   - Read `plugins/marketing/shared/seo-checklist.md` for AI search section

2. **Audit current AI visibility:**
   - Use WebSearch to check if "$ARGUMENTS" appears in AI-generated answers
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

5. **Write the artifact** — append to `.marketing/$ARGUMENTS/01-reach.md` under a `## AI SEO` section:
   - **Current AI Visibility** — where "$ARGUMENTS" appears (or doesn't) in AI answers
   - **Citation Patterns** — what gets cited in this category
   - **Optimization Strategy** — content structure, entity, E-E-A-T recommendations
   - **Content Recommendations** — specific content to create for AI visibility
   - **Monitoring Plan** — how to track AI search presence

## Output

AI SEO strategy appended to `.marketing/$ARGUMENTS/01-reach.md`. Present a summary highlighting:
- Current AI search visibility status
- Top 3 optimization opportunities
- Most impactful content type to create
```

**Step 4: Create programmatic-seo/SKILL.md**

```bash
mkdir -p plugins/marketing/skills/programmatic-seo
```

Write `plugins/marketing/skills/programmatic-seo/SKILL.md`:
```markdown
---
description: Template-driven pages at scale for search traffic
---

# Programmatic SEO

Design a programmatic SEO strategy for "$ARGUMENTS". Plan template-driven pages that target long-tail keywords at scale — landing pages, directories, comparison pages, or location-based pages.

## Prerequisites

Read `.marketing/$ARGUMENTS/00-strategy.md` and `.marketing/$ARGUMENTS/01-reach.md` (if exists). If `00-strategy.md` does not exist, tell the user:

> Phase 0 (Strategy) has not been completed for "$ARGUMENTS". Run `/marketing:customer-research $ARGUMENTS` first, or use `--skip-checks` to bypass.

If `--skip-checks` is present in $ARGUMENTS, skip this check and log to `.marketing/$ARGUMENTS/skip-log.md`.

## Process

1. **Read context:**
   - Read `.marketing/$ARGUMENTS/00-strategy.md` for audience and competitive data
   - Read `.marketing/$ARGUMENTS/01-reach.md` for SEO and content context if available

2. **Identify programmatic opportunities:**
   - Use WebSearch to find long-tail keyword patterns (e.g., "[tool] for [industry]", "[tool] vs [competitor]", "[tool] in [city]")
   - Estimate total addressable keyword volume across templates
   - Prioritize by search volume, competition, and conversion intent

3. **Design page templates:**
   - For each template type: layout, required data fields, content structure
   - How will unique value be added per page? (avoid thin content)
   - Internal linking strategy between programmatic pages
   - CTA and conversion path per template

4. **Data source planning:**
   - What data populates each template? (database, API, manual, AI-generated)
   - Data quality and freshness requirements
   - Scale: how many pages in the initial launch?

5. **Quality and indexing strategy:**
   - How to avoid duplicate or thin content penalties
   - Indexing approach: sitemap, internal links, pagination
   - Content enrichment strategy per page

6. **Write the artifact** — append to `.marketing/$ARGUMENTS/01-reach.md` under a `## Programmatic SEO` section:
   - **Keyword Patterns** — template types with volume estimates
   - **Page Templates** — layout and content structure per type
   - **Data Sources** — what populates each template
   - **Quality Plan** — how to avoid thin content
   - **Implementation Roadmap** — phases and page counts

## Output

Programmatic SEO strategy appended to `.marketing/$ARGUMENTS/01-reach.md`. Present a summary highlighting:
- Number of template types identified
- Total estimated keyword opportunity
- Recommended first template to build
```

**Step 5: Create site-architecture/SKILL.md**

```bash
mkdir -p plugins/marketing/skills/site-architecture
```

Write `plugins/marketing/skills/site-architecture/SKILL.md`:
```markdown
---
description: Information architecture, URL structure, and internal linking strategy
---

# Site Architecture

Plan the information architecture for "$ARGUMENTS". Design URL structure, navigation hierarchy, and internal linking strategy for SEO and user experience.

## Prerequisites

Read `.marketing/$ARGUMENTS/00-strategy.md`. If this file does not exist, tell the user:

> Phase 0 (Strategy) has not been completed for "$ARGUMENTS". Run `/marketing:customer-research $ARGUMENTS` first, or use `--skip-checks` to bypass.

If `--skip-checks` is present in $ARGUMENTS, skip this check and log to `.marketing/$ARGUMENTS/skip-log.md`.

## Process

1. **Read context:**
   - Read `.marketing/$ARGUMENTS/00-strategy.md` for audience and competitor data
   - Read `.marketing/$ARGUMENTS/01-reach.md` if it exists (for content and SEO context)

2. **Analyze current architecture (if URL provided):**
   - Use WebFetch to crawl the site structure
   - Map the current URL hierarchy and navigation
   - Identify orphan pages, deep pages, and crawl traps

3. **Design URL structure:**
   - Clean, readable URL patterns (lowercase, hyphens, no parameters)
   - Logical hierarchy reflecting content pillars
   - Category and subcategory structure
   - URL conventions for blog, docs, landing pages, etc.

4. **Plan navigation and hierarchy:**
   - Primary navigation structure
   - Secondary navigation (footer, sidebar)
   - Breadcrumb implementation
   - Maximum click depth (aim for 3 clicks to any page)

5. **Internal linking strategy:**
   - Hub-and-spoke model: pillar pages linking to cluster pages
   - Cross-linking between related content
   - Contextual link placement recommendations
   - Link anchor text best practices

6. **Write the artifact** — append to `.marketing/$ARGUMENTS/01-reach.md` under a `## Site Architecture` section:
   - **URL Structure** — patterns and hierarchy
   - **Navigation Plan** — primary, secondary, breadcrumbs
   - **Internal Linking Strategy** — hub-spoke model, cross-linking
   - **Sitemap Structure** — visual site map
   - **Implementation Notes** — redirects, canonical tags

## Output

Site architecture plan appended to `.marketing/$ARGUMENTS/01-reach.md`. Present a summary highlighting:
- Proposed URL hierarchy
- Key navigation changes
- Internal linking opportunities
```

**Step 6: Create social-content/SKILL.md**

```bash
mkdir -p plugins/marketing/skills/social-content
```

Write `plugins/marketing/skills/social-content/SKILL.md`:
```markdown
---
description: Social media content creation and scheduling strategy
---

# Social Content

Develop a social media content strategy for "$ARGUMENTS". Plan content themes, formats, posting schedule, and platform-specific tactics.

## Prerequisites

Read `.marketing/$ARGUMENTS/00-strategy.md`. If this file does not exist, tell the user:

> Phase 0 (Strategy) has not been completed for "$ARGUMENTS". Run `/marketing:customer-research $ARGUMENTS` first, or use `--skip-checks` to bypass.

If `--skip-checks` is present in $ARGUMENTS, skip this check and log to `.marketing/$ARGUMENTS/skip-log.md`.

## Process

1. **Read context:**
   - Read `.marketing/$ARGUMENTS/00-strategy.md` for audience personas and messaging
   - Read `.marketing/$ARGUMENTS/01-reach.md` if it exists (for content pillars)

2. **Platform selection:**
   - Where is the target audience most active? (LinkedIn, X/Twitter, Instagram, TikTok, YouTube, Reddit)
   - Match platforms to audience personas and content types
   - Recommend primary (1-2) and secondary (1-2) platforms

3. **Content themes and formats:**
   - Map content pillars to social-native formats
   - Per platform: what formats perform best? (carousels, threads, short video, images, text)
   - Content mix: educational, entertaining, promotional, community (recommend ratio)
   - User-generated content and community engagement opportunities

4. **Create content templates:**
   - 3-5 repeatable content templates per primary platform
   - Hook formulas, caption structures, CTA patterns
   - Hashtag and keyword strategy per platform

5. **Scheduling and cadence:**
   - Recommended posting frequency per platform
   - Best posting times for the audience
   - Content batching and repurposing workflow

6. **Write the artifact** — append to `.marketing/$ARGUMENTS/01-reach.md` under a `## Social Content` section:
   - **Platform Strategy** — selected platforms with rationale
   - **Content Themes** — mapped to pillars and formats
   - **Content Templates** — repeatable post formats
   - **Scheduling Plan** — frequency, timing, batching
   - **First 10 Posts** — specific post ideas to start with

## Output

Social content strategy appended to `.marketing/$ARGUMENTS/01-reach.md`. Present a summary highlighting:
- Recommended platforms and why
- Content mix ratio
- First 5 post ideas to publish
```

**Step 7: Create community-marketing/SKILL.md**

```bash
mkdir -p plugins/marketing/skills/community-marketing
```

Write `plugins/marketing/skills/community-marketing/SKILL.md`:
```markdown
---
description: Community-led growth strategy — forums, Discord, events, and advocacy
---

# Community Marketing

Develop a community-led growth strategy for "$ARGUMENTS". Plan community channels, engagement programs, and advocacy initiatives.

## Prerequisites

Read `.marketing/$ARGUMENTS/00-strategy.md`. If this file does not exist, tell the user:

> Phase 0 (Strategy) has not been completed for "$ARGUMENTS". Run `/marketing:customer-research $ARGUMENTS` first, or use `--skip-checks` to bypass.

If `--skip-checks` is present in $ARGUMENTS, skip this check and log to `.marketing/$ARGUMENTS/skip-log.md`.

## Process

1. **Read context:**
   - Read `.marketing/$ARGUMENTS/00-strategy.md` for audience and positioning

2. **Community landscape research:**
   - Use WebSearch to find where the audience already gathers (Reddit, Discord, Slack, forums, Facebook groups)
   - Identify existing communities to participate in vs. building your own
   - Analyze successful community strategies from competitors

3. **Community strategy:**
   - Own vs. participate: should "$ARGUMENTS" build a community or join existing ones?
   - Platform selection for owned community (Discord, Slack, Circle, forum)
   - Community value proposition — why would someone join?
   - Moderation and governance approach

4. **Engagement programs:**
   - Ambassador or champion programs
   - User-generated content initiatives
   - Community events (AMAs, workshops, meetups)
   - Knowledge sharing and peer support

5. **Write the artifact** — append to `.marketing/$ARGUMENTS/01-reach.md` under a `## Community Marketing` section:
   - **Community Landscape** — existing communities to engage with
   - **Owned Community Plan** — platform, value prop, launch plan
   - **Engagement Programs** — ambassador, UGC, events
   - **Growth Metrics** — community health metrics to track

## Output

Community marketing strategy appended to `.marketing/$ARGUMENTS/01-reach.md`. Present a summary highlighting:
- Recommended community approach (own vs. participate)
- Top existing communities to engage with
- First community initiative to launch
```

**Step 8: Create directory-submissions/SKILL.md**

```bash
mkdir -p plugins/marketing/skills/directory-submissions
```

Write `plugins/marketing/skills/directory-submissions/SKILL.md`:
```markdown
---
description: Directory and listing site submission strategy
---

# Directory Submissions

Plan a directory and listing site strategy for "$ARGUMENTS". Identify high-value directories, optimize listings, and build a submission plan.

## Prerequisites

Read `.marketing/$ARGUMENTS/00-strategy.md`. If this file does not exist, tell the user:

> Phase 0 (Strategy) has not been completed for "$ARGUMENTS". Run `/marketing:customer-research $ARGUMENTS` first, or use `--skip-checks` to bypass.

If `--skip-checks` is present in $ARGUMENTS, skip this check and log to `.marketing/$ARGUMENTS/skip-log.md`.

## Process

1. **Read context:**
   - Read `.marketing/$ARGUMENTS/00-strategy.md` for product category and positioning

2. **Research directories:**
   - Use WebSearch to find relevant directories for the "$ARGUMENTS" category
   - Include: product directories (G2, Capterra, Product Hunt), industry-specific directories, startup directories, review sites
   - Evaluate each: domain authority, traffic, audience relevance, cost

3. **Prioritize submissions:**
   - Rank directories by: traffic potential, SEO value (backlinks), audience match, effort
   - Separate into tiers: must-have, nice-to-have, low-priority
   - Note submission requirements and timelines

4. **Optimize listings:**
   - Craft optimized descriptions per directory (length, keyword, tone vary)
   - Screenshot and asset requirements
   - Category and tag selection strategy
   - Review solicitation plan

5. **Write the artifact** — append to `.marketing/$ARGUMENTS/01-reach.md` under a `## Directory Submissions` section:
   - **Directory List** — prioritized with domain authority and audience fit
   - **Submission Plan** — timeline and requirements per directory
   - **Listing Copy** — optimized descriptions per tier
   - **Review Strategy** — how to build reviews on key platforms

## Output

Directory strategy appended to `.marketing/$ARGUMENTS/01-reach.md`. Present a summary highlighting:
- Top 5 directories to submit to first
- Estimated timeline for submissions
- Review generation recommendations
```

**Step 9: Create launch-strategy/SKILL.md**

```bash
mkdir -p plugins/marketing/skills/launch-strategy
```

Write `plugins/marketing/skills/launch-strategy/SKILL.md`:
```markdown
---
description: Product or feature launch planning and execution
---

# Launch Strategy

Plan and structure a launch campaign for "$ARGUMENTS". Cover pre-launch, launch day, and post-launch activities across all channels.

## Prerequisites

Read `.marketing/$ARGUMENTS/00-strategy.md`. If this file does not exist, tell the user:

> Phase 0 (Strategy) has not been completed for "$ARGUMENTS". Run `/marketing:customer-research $ARGUMENTS` first, or use `--skip-checks` to bypass.

If `--skip-checks` is present in $ARGUMENTS, skip this check and log to `.marketing/$ARGUMENTS/skip-log.md`.

## Process

1. **Read context:**
   - Read `.marketing/$ARGUMENTS/00-strategy.md` for positioning and audience
   - Read `.marketing/$ARGUMENTS/01-reach.md` if it exists (for channel context)

2. **Define launch goals and type:**
   - Launch type: new product, new feature, major update, rebrand, or market entry
   - Primary goal: awareness, signups, revenue, press coverage
   - Success metrics with specific targets

3. **Pre-launch planning (2-4 weeks before):**
   - Waitlist or early access strategy
   - Teaser content and social buildup
   - Press and influencer outreach list
   - Product Hunt or launch platform preparation
   - Email list segmentation and pre-launch nurture
   - Internal readiness checklist

4. **Launch day execution:**
   - Hour-by-hour launch day timeline
   - Channel-specific activities (email, social, PR, paid, community)
   - Live engagement plan (social responses, community Q&A)
   - Contingency plans for common issues

5. **Post-launch follow-up (1-2 weeks after):**
   - Performance tracking and reporting
   - Follow-up content and engagement
   - User feedback collection
   - Iteration and optimization based on data

6. **Write the artifact** — append to `.marketing/$ARGUMENTS/01-reach.md` under a `## Launch Strategy` section:
   - **Launch Overview** — type, goals, success metrics
   - **Pre-Launch Plan** — timeline and activities
   - **Launch Day Playbook** — hour-by-hour execution
   - **Post-Launch Plan** — follow-up and optimization
   - **Channel Checklist** — per-channel launch activities

## Output

Launch strategy appended to `.marketing/$ARGUMENTS/01-reach.md`. Present a summary highlighting:
- Launch type and primary goal
- Key pre-launch activities and timeline
- Launch day critical path
```

**Step 10: Commit**

```bash
git add plugins/marketing/skills/content-strategy/ plugins/marketing/skills/seo-audit/ plugins/marketing/skills/ai-seo/ plugins/marketing/skills/programmatic-seo/ plugins/marketing/skills/site-architecture/ plugins/marketing/skills/social-content/ plugins/marketing/skills/community-marketing/ plugins/marketing/skills/directory-submissions/ plugins/marketing/skills/launch-strategy/
git commit -m "feat(marketing): add Phase 1 Reach skills (9 skills)"
```

---

### Task 5: Phase 2 — Act skills (7 skills)

**Files:**
- Create: `plugins/marketing/skills/copywriting/SKILL.md`
- Create: `plugins/marketing/skills/marketing-psychology/SKILL.md`
- Create: `plugins/marketing/skills/page-cro/SKILL.md`
- Create: `plugins/marketing/skills/form-cro/SKILL.md`
- Create: `plugins/marketing/skills/lead-magnets/SKILL.md`
- Create: `plugins/marketing/skills/free-tool-strategy/SKILL.md`
- Create: `plugins/marketing/skills/schema-markup/SKILL.md`

**Step 1: Create all 7 Act skill directories**

```bash
mkdir -p plugins/marketing/skills/{copywriting,marketing-psychology,page-cro,form-cro,lead-magnets,free-tool-strategy,schema-markup}
```

**Step 2: Create copywriting/SKILL.md**

Write `plugins/marketing/skills/copywriting/SKILL.md`:
```markdown
---
description: Write persuasive copy for any marketing surface
---

# Copywriting

Write persuasive, conversion-focused copy for "$ARGUMENTS". Apply proven copywriting frameworks to create compelling headlines, body copy, and calls to action.

## Prerequisites

Read `.marketing/$ARGUMENTS/00-strategy.md`. If this file does not exist, tell the user:

> Phase 0 (Strategy) has not been completed for "$ARGUMENTS". Run `/marketing:customer-research $ARGUMENTS` first, or use `--skip-checks` to bypass.

If `--skip-checks` is present in $ARGUMENTS, skip this check and log to `.marketing/$ARGUMENTS/skip-log.md`.

## Process

1. **Read context:**
   - Read `.marketing/$ARGUMENTS/00-strategy.md` for audience, messaging, and positioning
   - Read `.marketing/$ARGUMENTS/01-reach.md` if it exists (for content context)

2. **Define the copy brief:**
   - What surface? (landing page, email, ad, social, product)
   - Who is reading? (map to persona from strategy)
   - What's the one action they should take?
   - What's their current state of awareness? (unaware, problem-aware, solution-aware, product-aware)

3. **Apply copywriting frameworks:**
   - **Headlines:** Use PAS (Problem-Agitate-Solve), AIDA (Attention-Interest-Desire-Action), or 4U (Useful-Urgent-Unique-Ultra-specific)
   - **Body:** Lead with the biggest benefit, use social proof, address objections, create urgency
   - **CTA:** Clear, specific, benefit-oriented action verbs
   - Generate 3-5 headline variants and recommend the strongest

4. **Voice and tone calibration:**
   - Match the brand voice from the messaging framework
   - Adjust formality for the channel (email vs. social vs. landing page)
   - Use the audience's own language (from customer research)

5. **Write the artifact** — append to `.marketing/$ARGUMENTS/02-act.md` under a `## Copywriting` section:
   - **Copy Brief** — surface, audience, action, awareness level
   - **Headlines** — 3-5 variants with framework used
   - **Body Copy** — complete draft
   - **CTA Options** — 2-3 call-to-action variants
   - **Copy Notes** — tone decisions and rationale

## Output

Copy written to `.marketing/$ARGUMENTS/02-act.md`. Present the copy directly to the user with headline options highlighted.
```

**Step 3: Create marketing-psychology/SKILL.md**

Write `plugins/marketing/skills/marketing-psychology/SKILL.md`:
```markdown
---
description: Apply behavioral psychology principles to marketing
---

# Marketing Psychology

Apply behavioral psychology and persuasion principles to "$ARGUMENTS". Identify which psychological triggers to use and how to implement them ethically.

## Prerequisites

Read `.marketing/$ARGUMENTS/00-strategy.md`. If this file does not exist, tell the user:

> Phase 0 (Strategy) has not been completed for "$ARGUMENTS". Run `/marketing:customer-research $ARGUMENTS` first, or use `--skip-checks` to bypass.

If `--skip-checks` is present in $ARGUMENTS, skip this check and log to `.marketing/$ARGUMENTS/skip-log.md`.

## Process

1. **Read context:**
   - Read `.marketing/$ARGUMENTS/00-strategy.md` for audience and positioning
   - Read `.marketing/$ARGUMENTS/02-act.md` if it exists

2. **Audit current psychology usage:**
   - If a URL or existing content is provided, identify what principles are already in use
   - Identify missed opportunities

3. **Recommend applicable principles:**
   - **Social proof:** testimonials, user counts, logos, case studies
   - **Scarcity & urgency:** limited time, limited quantity, exclusive access
   - **Reciprocity:** free value before asking (lead magnets, tools, content)
   - **Authority:** credentials, press mentions, certifications, expert endorsements
   - **Loss aversion:** frame benefits as losses avoided
   - **Anchoring:** price anchoring, feature anchoring, comparison anchoring
   - **Commitment & consistency:** micro-commitments, progressive disclosure
   - **Default effect:** pre-selected options, recommended tiers
   - For each: specific implementation recommendation for "$ARGUMENTS"

4. **Ethical guardrails:**
   - Flag any dark patterns or manipulative implementations
   - Ensure all claims are truthful and verifiable
   - Recommend transparent use of urgency/scarcity

5. **Write the artifact** — append to `.marketing/$ARGUMENTS/02-act.md` under a `## Marketing Psychology` section:
   - **Applicable Principles** — ranked by expected impact
   - **Implementation Recommendations** — specific, actionable per principle
   - **Ethical Considerations** — guardrails and transparency notes
   - **Priority Actions** — top 3 psychology-driven changes to make

## Output

Psychology recommendations appended to `.marketing/$ARGUMENTS/02-act.md`. Present a summary highlighting:
- Top 3 applicable principles
- Highest-impact implementation recommendation
- Any ethical concerns to address
```

**Step 4: Create page-cro/SKILL.md**

Write `plugins/marketing/skills/page-cro/SKILL.md`:
```markdown
---
description: Conversion rate optimization for landing and product pages
---

# Page CRO

Optimize landing pages and product pages for "$ARGUMENTS". Analyze current conversion performance and recommend improvements to increase conversion rate.

## Prerequisites

Read `.marketing/$ARGUMENTS/00-strategy.md`. If this file does not exist, tell the user:

> Phase 0 (Strategy) has not been completed for "$ARGUMENTS". Run `/marketing:customer-research $ARGUMENTS` first, or use `--skip-checks` to bypass.

If `--skip-checks` is present in $ARGUMENTS, skip this check and log to `.marketing/$ARGUMENTS/skip-log.md`.

## Process

1. **Read context:**
   - Read `.marketing/$ARGUMENTS/00-strategy.md` for audience and positioning
   - Read `.marketing/$ARGUMENTS/02-act.md` if it exists

2. **Page audit (if URL provided):**
   - Use WebFetch to analyze the page
   - Evaluate: headline clarity, value proposition visibility, CTA prominence, social proof, objection handling
   - Check page speed and mobile experience
   - Identify friction points in the conversion path

3. **Analyze page structure:**
   - Above-the-fold content: does it answer "what, who, why"?
   - Information hierarchy: is the most important content most prominent?
   - Visual flow: does the eye naturally reach the CTA?
   - Content length: appropriate for the decision complexity?

4. **CRO recommendations:**
   - Headline and subheadline improvements
   - CTA placement, copy, and design recommendations
   - Social proof placement and type
   - Objection handling and FAQ placement
   - Trust signals (security badges, guarantees, testimonials)
   - Page speed and technical improvements

5. **A/B test suggestions:**
   - Identify the highest-impact elements to test
   - For each: hypothesis, variant description, expected impact
   - Prioritize by potential uplift and ease of implementation

6. **Write the artifact** — append to `.marketing/$ARGUMENTS/02-act.md` under a `## Page CRO` section:
   - **Current State Assessment** — strengths and weaknesses
   - **Recommendations** — prioritized by impact
   - **A/B Test Suggestions** — with hypotheses
   - **Wireframe Notes** — suggested layout changes
   - **Expected Impact** — estimated conversion lift per change

## Output

Page CRO analysis appended to `.marketing/$ARGUMENTS/02-act.md`. Present a summary highlighting:
- Top 3 conversion blockers identified
- Highest-impact recommendation
- Suggested first A/B test
```

**Step 5: Create form-cro/SKILL.md**

Write `plugins/marketing/skills/form-cro/SKILL.md`:
```markdown
---
description: Optimize forms for completion rate
---

# Form CRO

Optimize forms for "$ARGUMENTS" to maximize completion rate. Analyze form design, field selection, and user experience to reduce abandonment.

## Prerequisites

Read `.marketing/$ARGUMENTS/00-strategy.md`. If this file does not exist, tell the user:

> Phase 0 (Strategy) has not been completed for "$ARGUMENTS". Run `/marketing:customer-research $ARGUMENTS` first, or use `--skip-checks` to bypass.

If `--skip-checks` is present in $ARGUMENTS, skip this check and log to `.marketing/$ARGUMENTS/skip-log.md`.

## Process

1. **Read context:**
   - Read `.marketing/$ARGUMENTS/00-strategy.md` for audience context
   - Read `.marketing/$ARGUMENTS/02-act.md` if it exists

2. **Form audit (if URL or form provided):**
   - Evaluate number of fields (every field is friction)
   - Check field labels and placeholder text clarity
   - Analyze validation feedback and error messages
   - Review mobile form experience

3. **Field optimization:**
   - Which fields are truly necessary? Remove everything else
   - Multi-step vs. single-step form decision
   - Smart defaults and auto-fill opportunities
   - Progressive profiling (ask more over time, not all at once)

4. **UX improvements:**
   - Clear form title and context (why should they fill this out?)
   - Progress indicators for multi-step forms
   - Inline validation vs. submit-time validation
   - Submit button copy (specific benefit, not "Submit")
   - Social proof near the form (trust signals)
   - Privacy assurance near email fields

5. **Write the artifact** — append to `.marketing/$ARGUMENTS/02-act.md` under a `## Form CRO` section:
   - **Current Form Assessment** — field count, friction points
   - **Field Recommendations** — what to keep, remove, add
   - **UX Improvements** — layout, validation, copy
   - **Multi-Step Recommendation** — if applicable
   - **Expected Impact** — estimated completion rate improvement

## Output

Form CRO analysis appended to `.marketing/$ARGUMENTS/02-act.md`. Present a summary highlighting:
- Number of unnecessary fields identified
- Top UX improvement
- Recommended form structure
```

**Step 6: Create lead-magnets/SKILL.md**

Write `plugins/marketing/skills/lead-magnets/SKILL.md`:
```markdown
---
description: Design lead magnets — guides, tools, templates, and gated content
---

# Lead Magnets

Design high-converting lead magnets for "$ARGUMENTS". Create valuable gated content that attracts qualified leads and demonstrates expertise.

## Prerequisites

Read `.marketing/$ARGUMENTS/00-strategy.md`. If this file does not exist, tell the user:

> Phase 0 (Strategy) has not been completed for "$ARGUMENTS". Run `/marketing:customer-research $ARGUMENTS` first, or use `--skip-checks` to bypass.

If `--skip-checks` is present in $ARGUMENTS, skip this check and log to `.marketing/$ARGUMENTS/skip-log.md`.

## Process

1. **Read context:**
   - Read `.marketing/$ARGUMENTS/00-strategy.md` for audience pain points and JTBD
   - Read `.marketing/$ARGUMENTS/01-reach.md` if it exists (for content context)

2. **Identify lead magnet opportunities:**
   - Map audience pain points to solvable problems
   - What quick wins can you deliver? (saves time, money, or effort)
   - Use WebSearch to find what lead magnets competitors offer
   - What format best solves the problem? (template, checklist, guide, tool, quiz, calculator)

3. **Design lead magnet concepts:**
   - Create 3-5 lead magnet concepts with:
     - Title (specific and benefit-driven)
     - Format (PDF, spreadsheet, tool, email course, quiz)
     - Value proposition (what problem it solves)
     - Effort to create (low/medium/high)
     - Lead quality expectation (how qualified are leads this attracts?)

4. **Landing page and delivery:**
   - Recommended landing page structure for the lead magnet
   - Delivery mechanism (email, instant download, drip)
   - Follow-up sequence recommendation
   - Qualification: how does this lead magnet qualify leads for the next step?

5. **Write the artifact** — append to `.marketing/$ARGUMENTS/02-act.md` under a `## Lead Magnets` section:
   - **Lead Magnet Concepts** — 3-5 concepts with details
   - **Recommended First Magnet** — which to build first and why
   - **Landing Page Outline** — structure and copy direction
   - **Delivery & Follow-Up** — how to deliver and nurture
   - **Lead Qualification** — how this feeds the sales/conversion funnel

## Output

Lead magnet strategy appended to `.marketing/$ARGUMENTS/02-act.md`. Present a summary highlighting:
- Top lead magnet recommendation
- Expected lead quality
- Effort to create
```

**Step 7: Create free-tool-strategy/SKILL.md**

Write `plugins/marketing/skills/free-tool-strategy/SKILL.md`:
```markdown
---
description: Plan free tools and calculators for acquisition
---

# Free Tool Strategy

Design a free tool or calculator strategy for "$ARGUMENTS". Plan tools that attract users, demonstrate product value, and drive conversions.

## Prerequisites

Read `.marketing/$ARGUMENTS/00-strategy.md`. If this file does not exist, tell the user:

> Phase 0 (Strategy) has not been completed for "$ARGUMENTS". Run `/marketing:customer-research $ARGUMENTS` first, or use `--skip-checks` to bypass.

If `--skip-checks` is present in $ARGUMENTS, skip this check and log to `.marketing/$ARGUMENTS/skip-log.md`.

## Process

1. **Read context:**
   - Read `.marketing/$ARGUMENTS/00-strategy.md` for audience and product context

2. **Identify tool opportunities:**
   - What calculations, assessments, or tasks does the audience do manually?
   - Use WebSearch to find successful free tools in the category
   - What tools do competitors offer? What's missing?
   - Which tools naturally lead to the paid product? (product-led growth alignment)

3. **Design tool concepts:**
   - Create 2-3 free tool concepts with:
     - Tool name and description
     - Core functionality
     - Input/output design
     - How it connects to the paid product
     - SEO and viral potential (is it linkable? shareable?)
     - Build effort estimate

4. **Growth mechanics:**
   - SEO: will people search for this tool?
   - Virality: does the output encourage sharing?
   - Data capture: what user data does it naturally collect?
   - Upsell path: how does it lead to the paid product?

5. **Write the artifact** — append to `.marketing/$ARGUMENTS/02-act.md` under a `## Free Tool Strategy` section:
   - **Tool Concepts** — 2-3 concepts with details
   - **Recommended Tool** — which to build first and why
   - **Growth Mechanics** — SEO, virality, data capture
   - **Upsell Path** — how it leads to conversion
   - **Technical Requirements** — high-level build spec

## Output

Free tool strategy appended to `.marketing/$ARGUMENTS/02-act.md`. Present a summary highlighting:
- Recommended tool to build
- Expected traffic and conversion potential
- Connection to paid product
```

**Step 8: Create schema-markup/SKILL.md**

Write `plugins/marketing/skills/schema-markup/SKILL.md`:
```markdown
---
description: Structured data implementation for rich search results
---

# Schema Markup

Plan and generate structured data (schema.org) for "$ARGUMENTS". Optimize for rich snippets, knowledge panels, and enhanced search results.

## Prerequisites

Read `.marketing/$ARGUMENTS/00-strategy.md`. If this file does not exist, tell the user:

> Phase 0 (Strategy) has not been completed for "$ARGUMENTS". Run `/marketing:customer-research $ARGUMENTS` first, or use `--skip-checks` to bypass.

If `--skip-checks` is present in $ARGUMENTS, skip this check and log to `.marketing/$ARGUMENTS/skip-log.md`.

## Process

1. **Read context:**
   - Read `.marketing/$ARGUMENTS/00-strategy.md` for product context
   - Read `.marketing/$ARGUMENTS/01-reach.md` if it exists (for SEO context)

2. **Identify applicable schema types:**
   - Organization, Product, SoftwareApplication, WebSite
   - Article, BlogPosting, HowTo, FAQ, Review
   - BreadcrumbList, SearchAction, VideoObject
   - Match schema types to page types

3. **Audit current markup (if URL provided):**
   - Use WebFetch to check existing structured data
   - Test with Google Rich Results Test patterns
   - Identify missing or incorrect markup

4. **Generate schema markup:**
   - Write JSON-LD for each identified page type
   - Include all recommended properties (not just required)
   - Ensure accuracy — schema must match visible page content
   - Validate against schema.org specification

5. **Write the artifact** — append to `.marketing/$ARGUMENTS/02-act.md` under a `## Schema Markup` section:
   - **Schema Audit** — current state (if applicable)
   - **Recommended Schema Types** — per page type
   - **JSON-LD Templates** — ready-to-implement code
   - **Implementation Guide** — where and how to add each schema
   - **Testing Plan** — how to validate after implementation

## Output

Schema markup plan appended to `.marketing/$ARGUMENTS/02-act.md`. Present the JSON-LD templates directly to the user for implementation.
```

**Step 9: Commit**

```bash
git add plugins/marketing/skills/copywriting/ plugins/marketing/skills/marketing-psychology/ plugins/marketing/skills/page-cro/ plugins/marketing/skills/form-cro/ plugins/marketing/skills/lead-magnets/ plugins/marketing/skills/free-tool-strategy/ plugins/marketing/skills/schema-markup/
git commit -m "feat(marketing): add Phase 2 Act skills (7 skills)"
```

---

### Task 6: Phase 3 — Convert skills (7 skills)

**Files:**
- Create: `plugins/marketing/skills/email-sequence/SKILL.md`
- Create: `plugins/marketing/skills/paid-ads/SKILL.md`
- Create: `plugins/marketing/skills/ad-creative/SKILL.md`
- Create: `plugins/marketing/skills/cold-email/SKILL.md`
- Create: `plugins/marketing/skills/signup-flow-cro/SKILL.md`
- Create: `plugins/marketing/skills/ab-test-setup/SKILL.md`
- Create: `plugins/marketing/skills/sales-enablement/SKILL.md`

**Step 1: Create all 7 Convert skill directories**

```bash
mkdir -p plugins/marketing/skills/{email-sequence,paid-ads,ad-creative,cold-email,signup-flow-cro,ab-test-setup,sales-enablement}
```

**Step 2: Create email-sequence/SKILL.md**

Write `plugins/marketing/skills/email-sequence/SKILL.md`:
```markdown
---
description: Design email drip campaigns and automations
---

# Email Sequence

Design email drip sequences and automation flows for "$ARGUMENTS". Plan trigger-based campaigns that nurture leads through the funnel.

## Prerequisites

Read `.marketing/$ARGUMENTS/00-strategy.md`. If this file does not exist, tell the user:

> Phase 0 (Strategy) has not been completed for "$ARGUMENTS". Run `/marketing:customer-research $ARGUMENTS` first, or use `--skip-checks` to bypass.

If `--skip-checks` is present in $ARGUMENTS, skip this check and log to `.marketing/$ARGUMENTS/skip-log.md`.

## Process

1. **Read context:**
   - Read `.marketing/$ARGUMENTS/00-strategy.md` for audience and messaging
   - Read `.marketing/$ARGUMENTS/02-act.md` if it exists (for lead magnet and copy context)
   - Read `plugins/marketing/shared/campaign-plan-template.md` for structure

2. **Define sequence type:**
   - Welcome/onboarding sequence
   - Lead nurture sequence (post lead-magnet)
   - Trial-to-paid conversion sequence
   - Re-engagement/winback sequence
   - Post-purchase/retention sequence
   - Which type(s) are most needed for "$ARGUMENTS"?

3. **Design the sequence:**
   - Number of emails and timing (days between)
   - For each email: subject line, preview text, goal, key message, CTA
   - Trigger and entry conditions
   - Exit conditions (converted, unsubscribed, engaged)
   - Branch logic (if applicable): what happens based on engagement?

4. **Write email copy:**
   - Draft subject line variants for each email (2-3 per email)
   - Write full email body copy for each email
   - Apply messaging framework from strategy
   - Include personalization variables

5. **Write the artifact** — append to `.marketing/$ARGUMENTS/03-convert.md` under a `## Email Sequence` section:
   - **Sequence Overview** — type, trigger, goal, timing
   - **Flow Diagram** — visual sequence with branches
   - **Email Details** — per email: subject, body, CTA, timing
   - **Personalization** — variables and segmentation
   - **Success Metrics** — open rate, click rate, conversion targets

## Output

Email sequence written to `.marketing/$ARGUMENTS/03-convert.md`. Present the full sequence with subject lines and email previews.
```

**Step 3: Create paid-ads/SKILL.md**

Write `plugins/marketing/skills/paid-ads/SKILL.md`:
```markdown
---
description: Plan and optimize paid advertising campaigns
---

# Paid Ads

Plan paid advertising campaigns for "$ARGUMENTS". Design campaign structure, targeting, budget allocation, and optimization strategy.

## Prerequisites

Read `.marketing/$ARGUMENTS/00-strategy.md`. If this file does not exist, tell the user:

> Phase 0 (Strategy) has not been completed for "$ARGUMENTS". Run `/marketing:customer-research $ARGUMENTS` first, or use `--skip-checks` to bypass.

If `--skip-checks` is present in $ARGUMENTS, skip this check and log to `.marketing/$ARGUMENTS/skip-log.md`.

## Process

1. **Read context:**
   - Read `.marketing/$ARGUMENTS/00-strategy.md` for audience, positioning, and competitors
   - Read `.marketing/$ARGUMENTS/02-act.md` if it exists (for landing page and copy context)
   - Read `plugins/marketing/shared/campaign-plan-template.md` for structure

2. **Platform selection:**
   - Which platforms? Google Ads, Meta (Facebook/Instagram), LinkedIn, X, TikTok, Reddit
   - Match platform to audience and intent (search intent vs. interruption marketing)
   - Budget allocation per platform

3. **Campaign structure:**
   - Campaign hierarchy: campaigns → ad groups → ads
   - Targeting strategy per campaign: keywords, audiences, demographics, interests
   - Match types (for search): broad, phrase, exact
   - Negative keyword strategy
   - Retargeting setup: website visitors, cart abandoners, engaged users

4. **Budget and bidding:**
   - Recommended daily/monthly budget
   - Bidding strategy: manual CPC, target CPA, maximize conversions
   - Budget pacing and scaling plan
   - Expected CPC and CPA ranges for the category

5. **Optimization plan:**
   - Key metrics to monitor: CTR, CPC, CPA, ROAS, quality score
   - Optimization cadence (daily, weekly, monthly actions)
   - When to scale, pause, or restructure campaigns
   - Testing plan: ad copy, audiences, landing pages

6. **Write the artifact** — append to `.marketing/$ARGUMENTS/03-convert.md` under a `## Paid Ads` section:
   - **Platform Strategy** — selected platforms with rationale
   - **Campaign Structure** — hierarchy, targeting, match types
   - **Budget Plan** — allocation, bidding, pacing
   - **Ad Copy Direction** — messaging angles per campaign
   - **Optimization Playbook** — metrics, cadence, scaling rules

## Output

Paid ads strategy written to `.marketing/$ARGUMENTS/03-convert.md`. Present a summary highlighting:
- Recommended platforms and budget split
- Campaign structure overview
- Expected CPA range
```

**Step 4: Create ad-creative/SKILL.md**

Write `plugins/marketing/skills/ad-creative/SKILL.md`:
```markdown
---
description: Generate ad copy and creative briefs
---

# Ad Creative

Generate ad copy and creative briefs for "$ARGUMENTS". Create platform-specific ad variations with headlines, descriptions, and creative direction.

## Prerequisites

Read `.marketing/$ARGUMENTS/00-strategy.md`. If this file does not exist, tell the user:

> Phase 0 (Strategy) has not been completed for "$ARGUMENTS". Run `/marketing:customer-research $ARGUMENTS` first, or use `--skip-checks` to bypass.

If `--skip-checks` is present in $ARGUMENTS, skip this check and log to `.marketing/$ARGUMENTS/skip-log.md`.

## Process

1. **Read context:**
   - Read `.marketing/$ARGUMENTS/00-strategy.md` for messaging and positioning
   - Read `.marketing/$ARGUMENTS/03-convert.md` if it exists (for campaign context)

2. **Define ad format requirements:**
   - Platform and ad type (search, display, social feed, video, carousel)
   - Character limits per field
   - Image/video specs if applicable
   - Number of variants needed

3. **Write ad copy variants:**
   - For search ads: 5+ headline variants (30 chars), 3+ description variants (90 chars)
   - For social ads: primary text, headline, description, CTA button
   - Apply different angles: benefit-led, problem-led, social-proof-led, urgency-led
   - Use audience language from customer research

4. **Creative brief (for visual ads):**
   - Visual direction and mood
   - Required elements (logo, product shot, CTA)
   - Color palette and brand guidelines
   - Image vs. illustration vs. video recommendation
   - A/B test variants for creative

5. **Write the artifact** — append to `.marketing/$ARGUMENTS/03-convert.md` under a `## Ad Creative` section:
   - **Ad Specs** — platform, format, character limits
   - **Copy Variants** — all headline and description options
   - **Creative Brief** — visual direction for design team
   - **A/B Test Plan** — which variants to test first
   - **Performance Hypotheses** — which angles should win and why

## Output

Ad creative written to `.marketing/$ARGUMENTS/03-convert.md`. Present all copy variants in a scannable format for easy review.
```

**Step 5: Create cold-email/SKILL.md**

Write `plugins/marketing/skills/cold-email/SKILL.md`:
```markdown
---
description: Outbound email strategy and templates
---

# Cold Email

Design cold outbound email campaigns for "$ARGUMENTS". Create personalized email templates, follow-up sequences, and targeting criteria.

## Prerequisites

Read `.marketing/$ARGUMENTS/00-strategy.md`. If this file does not exist, tell the user:

> Phase 0 (Strategy) has not been completed for "$ARGUMENTS". Run `/marketing:customer-research $ARGUMENTS` first, or use `--skip-checks` to bypass.

If `--skip-checks` is present in $ARGUMENTS, skip this check and log to `.marketing/$ARGUMENTS/skip-log.md`.

## Process

1. **Read context:**
   - Read `.marketing/$ARGUMENTS/00-strategy.md` for audience and value proposition
   - Read `plugins/marketing/shared/campaign-plan-template.md` for structure

2. **Define targeting criteria:**
   - Ideal customer profile (ICP) for outbound
   - Company firmographics: size, industry, tech stack, growth signals
   - Contact persona: title, department, seniority
   - Intent signals: hiring, funding, tech changes, content engagement

3. **Design email sequence:**
   - 3-5 email sequence with timing (typically days 1, 3, 7, 14)
   - Each email: different angle or value prop
   - Personalization strategy: what's personalized per recipient?
   - Follow-up logic: when to stop, when to escalate

4. **Write email templates:**
   - For each email: subject line (2-3 variants), body, CTA
   - Keep emails short (under 150 words)
   - Lead with relevance, not pitch
   - Include specific personalization placeholders
   - Compliance: include opt-out, identify sender, no deceptive subjects

5. **Write the artifact** — append to `.marketing/$ARGUMENTS/03-convert.md` under a `## Cold Email` section:
   - **ICP & Targeting** — who to target and why
   - **Sequence Design** — timing and logic
   - **Email Templates** — full copy for each email
   - **Personalization Guide** — what to customize per recipient
   - **Compliance Notes** — CAN-SPAM, GDPR requirements

## Output

Cold email strategy written to `.marketing/$ARGUMENTS/03-convert.md`. Present the full email sequence for review.
```

**Step 6: Create signup-flow-cro/SKILL.md**

Write `plugins/marketing/skills/signup-flow-cro/SKILL.md`:
```markdown
---
description: Optimize signup and trial conversion flows
---

# Signup Flow CRO

Optimize the signup and trial conversion flow for "$ARGUMENTS". Reduce friction, increase activation, and improve trial-to-paid conversion.

## Prerequisites

Read `.marketing/$ARGUMENTS/00-strategy.md`. If this file does not exist, tell the user:

> Phase 0 (Strategy) has not been completed for "$ARGUMENTS". Run `/marketing:customer-research $ARGUMENTS` first, or use `--skip-checks` to bypass.

If `--skip-checks` is present in $ARGUMENTS, skip this check and log to `.marketing/$ARGUMENTS/skip-log.md`.

## Process

1. **Read context:**
   - Read `.marketing/$ARGUMENTS/00-strategy.md` for audience and pricing
   - Read `.marketing/$ARGUMENTS/02-act.md` if it exists (for page and form CRO context)

2. **Map the current flow (if URL provided):**
   - Use WebFetch to walk through the signup flow
   - Document every step: pages, forms, emails, activation steps
   - Identify drop-off points and friction

3. **Signup page optimization:**
   - Value proposition clarity on signup page
   - Social proof placement
   - Form field minimization (name + email is ideal)
   - SSO/social login options
   - Mobile signup experience

4. **Activation optimization:**
   - What is the "aha moment"? How quickly can users reach it?
   - Onboarding checklist or wizard design
   - Empty state design — what does the user see first?
   - Time-to-value: how to reduce it

5. **Trial-to-paid conversion:**
   - Trial length recommendation
   - In-trial engagement tactics (progress emails, usage prompts)
   - Upgrade triggers: what behavior indicates readiness?
   - Pricing page from within the product
   - Payment friction reduction

6. **Write the artifact** — append to `.marketing/$ARGUMENTS/03-convert.md` under a `## Signup Flow CRO` section:
   - **Current Flow Map** — step-by-step with friction points
   - **Signup Page Recommendations** — optimization list
   - **Activation Strategy** — path to aha moment
   - **Trial-to-Paid Plan** — engagement and conversion tactics
   - **A/B Test Ideas** — highest-impact tests

## Output

Signup flow analysis written to `.marketing/$ARGUMENTS/03-convert.md`. Present a summary highlighting:
- Biggest friction point identified
- Recommended activation improvements
- Expected conversion lift
```

**Step 7: Create ab-test-setup/SKILL.md**

Write `plugins/marketing/skills/ab-test-setup/SKILL.md`:
```markdown
---
description: Design A/B tests with hypothesis, measurement, and statistical rigor
---

# A/B Test Setup

Design rigorous A/B tests for "$ARGUMENTS". Create testable hypotheses, define variants, calculate sample sizes, and plan measurement.

## Prerequisites

Read `.marketing/$ARGUMENTS/00-strategy.md`. If this file does not exist, tell the user:

> Phase 0 (Strategy) has not been completed for "$ARGUMENTS". Run `/marketing:customer-research $ARGUMENTS` first, or use `--skip-checks` to bypass.

If `--skip-checks` is present in $ARGUMENTS, skip this check and log to `.marketing/$ARGUMENTS/skip-log.md`.

## Process

1. **Read context:**
   - Read `.marketing/$ARGUMENTS/00-strategy.md` for business context
   - Read `.marketing/$ARGUMENTS/02-act.md` and `.marketing/$ARGUMENTS/03-convert.md` if they exist (for CRO recommendations that need testing)

2. **Define the test:**
   - What are you testing? (headline, CTA, layout, pricing, flow)
   - Hypothesis format: "If we [change], then [metric] will [improve/decrease] by [amount], because [rationale]"
   - Primary metric (one clear success metric)
   - Secondary metrics (guard-rail metrics to watch)

3. **Design variants:**
   - Control (A): current experience
   - Treatment (B): specific change — one variable only
   - If multivariate: document variable matrix
   - Screenshots or mockups of each variant

4. **Statistical planning:**
   - Current baseline metric (conversion rate, click rate, etc.)
   - Minimum detectable effect (MDE): what improvement is meaningful?
   - Required sample size calculation
   - Expected test duration based on traffic
   - Statistical significance threshold (typically 95%)

5. **Implementation plan:**
   - Testing tool recommendation (if not already decided)
   - Traffic split: 50/50 or other
   - Segment targeting: who sees the test?
   - QA checklist before launch

6. **Write the artifact** — append to `.marketing/$ARGUMENTS/03-convert.md` under a `## A/B Test: [Test Name]` section:
   - **Hypothesis** — structured hypothesis statement
   - **Variants** — control and treatment descriptions
   - **Metrics** — primary and secondary
   - **Statistical Plan** — sample size, duration, significance
   - **Implementation** — tool, targeting, QA steps
   - **Decision Framework** — what to do based on results

## Output

A/B test plan written to `.marketing/$ARGUMENTS/03-convert.md`. Present the hypothesis and expected timeline to the user.
```

**Step 8: Create sales-enablement/SKILL.md**

Write `plugins/marketing/skills/sales-enablement/SKILL.md`:
```markdown
---
description: Create sales collateral, battle cards, and objection handling guides
---

# Sales Enablement

Create sales enablement materials for "$ARGUMENTS". Build battle cards, objection handling guides, and sales collateral that help close deals.

## Prerequisites

Read `.marketing/$ARGUMENTS/00-strategy.md`. If this file does not exist, tell the user:

> Phase 0 (Strategy) has not been completed for "$ARGUMENTS". Run `/marketing:customer-research $ARGUMENTS` first, or use `--skip-checks` to bypass.

If `--skip-checks` is present in $ARGUMENTS, skip this check and log to `.marketing/$ARGUMENTS/skip-log.md`.

## Process

1. **Read context:**
   - Read `.marketing/$ARGUMENTS/00-strategy.md` for positioning, competitors, and personas

2. **Build competitive battle cards:**
   - One battle card per major competitor
   - Our strengths vs. their weaknesses
   - Their strengths and how to handle them
   - Landmines: questions to ask prospects that highlight our advantages
   - Traps: questions competitors will ask, with prepared responses

3. **Create objection handling guide:**
   - Map common objections: price, features, timing, competition, inertia
   - For each: acknowledge, reframe, respond, evidence
   - Link objections to customer research insights

4. **Sales collateral recommendations:**
   - One-pager / product overview
   - Case study templates
   - ROI calculator or business case template
   - Demo script outline
   - Proposal template

5. **Write the artifact** — append to `.marketing/$ARGUMENTS/03-convert.md` under a `## Sales Enablement` section:
   - **Battle Cards** — per competitor
   - **Objection Handling** — common objections with responses
   - **Collateral List** — recommended materials with priority
   - **Key Proof Points** — stats, quotes, case studies to reference
   - **Demo Talking Points** — key moments in the demo to highlight

## Output

Sales enablement materials written to `.marketing/$ARGUMENTS/03-convert.md`. Present battle cards and top objection responses to the user.
```

**Step 9: Commit**

```bash
git add plugins/marketing/skills/email-sequence/ plugins/marketing/skills/paid-ads/ plugins/marketing/skills/ad-creative/ plugins/marketing/skills/cold-email/ plugins/marketing/skills/signup-flow-cro/ plugins/marketing/skills/ab-test-setup/ plugins/marketing/skills/sales-enablement/
git commit -m "feat(marketing): add Phase 3 Convert skills (7 skills)"
```

---

### Task 7: Phase 4 — Engage skills (5 skills)

**Files:**
- Create: `plugins/marketing/skills/onboarding-cro/SKILL.md`
- Create: `plugins/marketing/skills/churn-prevention/SKILL.md`
- Create: `plugins/marketing/skills/referral-program/SKILL.md`
- Create: `plugins/marketing/skills/paywall-upgrade-cro/SKILL.md`
- Create: `plugins/marketing/skills/popup-cro/SKILL.md`

**Step 1: Create all 5 Engage skill directories**

```bash
mkdir -p plugins/marketing/skills/{onboarding-cro,churn-prevention,referral-program,paywall-upgrade-cro,popup-cro}
```

**Step 2: Create onboarding-cro/SKILL.md**

Write `plugins/marketing/skills/onboarding-cro/SKILL.md`:
```markdown
---
description: Optimize user onboarding for activation and retention
---

# Onboarding CRO

Optimize the user onboarding experience for "$ARGUMENTS". Design flows that get users to the "aha moment" faster and increase activation rates.

## Prerequisites

Read `.marketing/$ARGUMENTS/00-strategy.md`. If this file does not exist, tell the user:

> Phase 0 (Strategy) has not been completed for "$ARGUMENTS". Run `/marketing:customer-research $ARGUMENTS` first, or use `--skip-checks` to bypass.

If `--skip-checks` is present in $ARGUMENTS, skip this check and log to `.marketing/$ARGUMENTS/skip-log.md`.

## Process

1. **Read context:**
   - Read `.marketing/$ARGUMENTS/00-strategy.md` for audience context
   - Read `.marketing/$ARGUMENTS/03-convert.md` if it exists (for signup flow context)

2. **Define the "aha moment":**
   - What action or outcome makes users understand the product's value?
   - How quickly can a new user reach it?
   - What's the current time-to-value?

3. **Map the onboarding flow:**
   - Current onboarding steps (if URL or flow provided)
   - Where do users drop off? (identify the biggest leak)
   - Which steps are essential vs. optional?
   - Progressive disclosure: what can be deferred?

4. **Design improvements:**
   - Welcome experience: personalized based on use case or persona
   - Checklist or wizard: guided steps to activation
   - Empty states: helpful, not empty
   - Tooltips, tours, or contextual help
   - Onboarding emails: complement in-app experience
   - Success celebrations: reinforce progress

5. **Write the artifact** to `.marketing/$ARGUMENTS/04-engage.md` under an `## Onboarding CRO` section:
   - **Aha Moment Definition** — the activation event
   - **Current Flow Assessment** — steps and drop-off points
   - **Recommended Flow** — optimized onboarding design
   - **In-App + Email Coordination** — how both channels work together
   - **Activation Metrics** — what to track

## Output

Onboarding CRO strategy written to `.marketing/$ARGUMENTS/04-engage.md`. Present a summary highlighting:
- Defined aha moment
- Biggest onboarding friction point
- Top 3 improvements to implement
```

**Step 3: Create churn-prevention/SKILL.md**

Write `plugins/marketing/skills/churn-prevention/SKILL.md`:
```markdown
---
description: Identify and reduce churn with targeted interventions
---

# Churn Prevention

Analyze and reduce churn for "$ARGUMENTS". Identify churn signals, design interventions, and build retention strategies.

## Prerequisites

Read `.marketing/$ARGUMENTS/00-strategy.md`. If this file does not exist, tell the user:

> Phase 0 (Strategy) has not been completed for "$ARGUMENTS". Run `/marketing:customer-research $ARGUMENTS` first, or use `--skip-checks` to bypass.

If `--skip-checks` is present in $ARGUMENTS, skip this check and log to `.marketing/$ARGUMENTS/skip-log.md`.

## Process

1. **Read context:**
   - Read `.marketing/$ARGUMENTS/00-strategy.md` for audience and product context
   - Read `.marketing/$ARGUMENTS/04-engage.md` if it exists

2. **Identify churn signals:**
   - Usage decline patterns (login frequency, feature usage drop)
   - Support ticket patterns that precede churn
   - Billing signals (failed payments, downgrade inquiries)
   - Engagement signals (email opens dropping, NPS decline)

3. **Analyze churn reasons:**
   - Use WebSearch to find common churn reasons in the category
   - Map reasons to: product gaps, pricing issues, poor onboarding, competitive switching, need ended
   - Which reasons are preventable vs. natural?

4. **Design interventions:**
   - Early warning system: automated alerts on churn signals
   - Re-engagement campaigns: email, in-app, personal outreach
   - Cancellation flow optimization: save offers, feedback collection, easy pause option
   - Win-back campaigns: timing, messaging, incentives
   - Product improvements that address top churn reasons

5. **Write the artifact** — append to `.marketing/$ARGUMENTS/04-engage.md` under a `## Churn Prevention` section:
   - **Churn Signals** — early warning indicators to monitor
   - **Churn Reasons Analysis** — categorized and prioritized
   - **Intervention Playbook** — action per signal/reason
   - **Cancellation Flow Design** — save offers and feedback
   - **Win-Back Campaign** — timing and messaging
   - **Retention Metrics** — what to track

## Output

Churn prevention strategy written to `.marketing/$ARGUMENTS/04-engage.md`. Present a summary highlighting:
- Top 3 churn signals to monitor
- Most impactful intervention
- Recommended cancellation flow changes
```

**Step 4: Create referral-program/SKILL.md**

Write `plugins/marketing/skills/referral-program/SKILL.md`:
```markdown
---
description: Design referral and advocacy programs
---

# Referral Program

Design a referral program for "$ARGUMENTS". Create incentive structures, mechanics, and promotion strategies that turn customers into advocates.

## Prerequisites

Read `.marketing/$ARGUMENTS/00-strategy.md`. If this file does not exist, tell the user:

> Phase 0 (Strategy) has not been completed for "$ARGUMENTS". Run `/marketing:customer-research $ARGUMENTS` first, or use `--skip-checks` to bypass.

If `--skip-checks` is present in $ARGUMENTS, skip this check and log to `.marketing/$ARGUMENTS/skip-log.md`.

## Process

1. **Read context:**
   - Read `.marketing/$ARGUMENTS/00-strategy.md` for audience and product context
   - Read `.marketing/$ARGUMENTS/04-engage.md` if it exists

2. **Research referral models:**
   - Use WebSearch to find successful referral programs in the category
   - Analyze: single-sided vs. double-sided rewards, monetary vs. product-based incentives
   - What motivates users to refer? (savings, status, genuine value sharing)

3. **Design the program:**
   - Incentive structure: what does the referrer get? What does the referred get?
   - Reward type: credits, discounts, cash, extended features, swag
   - Qualification: what counts as a successful referral? (signup, activation, payment)
   - Limits: per-user caps, time limits, anti-fraud measures

4. **Mechanics and UX:**
   - Sharing mechanism: unique link, email invite, social share, in-product invite
   - Tracking and attribution
   - Where to promote the program (in-app, email, website, social)
   - Referral dashboard for users

5. **Write the artifact** — append to `.marketing/$ARGUMENTS/04-engage.md` under a `## Referral Program` section:
   - **Program Design** — incentives, mechanics, qualification
   - **UX Flow** — how users discover, share, and track referrals
   - **Promotion Plan** — where and how to promote the program
   - **Anti-Fraud Measures** — abuse prevention
   - **Success Metrics** — referral rate, viral coefficient, CAC impact

## Output

Referral program design written to `.marketing/$ARGUMENTS/04-engage.md`. Present a summary highlighting:
- Recommended incentive structure
- Expected viral coefficient
- Launch plan
```

**Step 5: Create paywall-upgrade-cro/SKILL.md**

Write `plugins/marketing/skills/paywall-upgrade-cro/SKILL.md`:
```markdown
---
description: Optimize upgrade flows and paywall design
---

# Paywall & Upgrade CRO

Optimize the paywall and upgrade experience for "$ARGUMENTS". Design upgrade triggers, pricing page optimization, and conversion flows.

## Prerequisites

Read `.marketing/$ARGUMENTS/00-strategy.md`. If this file does not exist, tell the user:

> Phase 0 (Strategy) has not been completed for "$ARGUMENTS". Run `/marketing:customer-research $ARGUMENTS` first, or use `--skip-checks` to bypass.

If `--skip-checks` is present in $ARGUMENTS, skip this check and log to `.marketing/$ARGUMENTS/skip-log.md`.

## Process

1. **Read context:**
   - Read `.marketing/$ARGUMENTS/00-strategy.md` for pricing strategy
   - Read `.marketing/$ARGUMENTS/04-engage.md` if it exists

2. **Analyze current paywall (if applicable):**
   - When and where does the user hit the paywall?
   - What's the messaging at the paywall moment?
   - Hard paywall vs. soft paywall vs. metered approach
   - How does it make the user feel? (frustrated vs. motivated)

3. **Optimize upgrade triggers:**
   - Usage-based triggers: hitting limits naturally during valuable workflows
   - Feature-based triggers: showing premium features with upgrade prompt
   - Timing-based triggers: trial ending, usage milestone
   - Social triggers: team features, collaboration needs

4. **Pricing page optimization:**
   - Tier presentation: recommended tier highlighting
   - Feature comparison clarity
   - Social proof on pricing page
   - FAQ and objection handling
   - Annual vs. monthly toggle design

5. **Write the artifact** — append to `.marketing/$ARGUMENTS/04-engage.md` under a `## Paywall & Upgrade CRO` section:
   - **Current Paywall Assessment** — strengths and friction
   - **Upgrade Trigger Design** — when and where to prompt
   - **Pricing Page Recommendations** — layout, copy, social proof
   - **A/B Test Ideas** — highest-impact tests
   - **Expected Impact** — estimated conversion lift

## Output

Paywall CRO analysis written to `.marketing/$ARGUMENTS/04-engage.md`. Present a summary highlighting:
- Top upgrade trigger opportunity
- Pricing page improvements
- Recommended first test
```

**Step 6: Create popup-cro/SKILL.md**

Write `plugins/marketing/skills/popup-cro/SKILL.md`:
```markdown
---
description: Design high-converting popups and modals
---

# Popup CRO

Design effective popups and modals for "$ARGUMENTS". Create non-intrusive, high-converting overlays for lead capture, upgrades, and engagement.

## Prerequisites

Read `.marketing/$ARGUMENTS/00-strategy.md`. If this file does not exist, tell the user:

> Phase 0 (Strategy) has not been completed for "$ARGUMENTS". Run `/marketing:customer-research $ARGUMENTS` first, or use `--skip-checks` to bypass.

If `--skip-checks` is present in $ARGUMENTS, skip this check and log to `.marketing/$ARGUMENTS/skip-log.md`.

## Process

1. **Read context:**
   - Read `.marketing/$ARGUMENTS/00-strategy.md` for audience and messaging
   - Read `.marketing/$ARGUMENTS/02-act.md` and `.marketing/$ARGUMENTS/04-engage.md` if they exist

2. **Define popup purpose:**
   - Lead capture (email signup, lead magnet delivery)
   - Exit intent (save abandoning visitors)
   - Upgrade prompt (free-to-paid conversion)
   - Announcement (new feature, promotion)
   - Feedback collection (survey, NPS)

3. **Design popup experience:**
   - Trigger: time-based, scroll-based, exit-intent, click-triggered, page-count
   - Frequency: how often does a user see it?
   - Targeting: which pages, which segments, new vs. returning
   - Mobile experience: slide-up vs. full-screen vs. banner
   - Dismiss behavior: easy close, remember preference

4. **Create popup content:**
   - Headline (benefit-focused, under 10 words)
   - Body copy (1-2 sentences max)
   - CTA (specific action, not "Submit")
   - Visual direction
   - A/B test variants

5. **Write the artifact** — append to `.marketing/$ARGUMENTS/04-engage.md` under a `## Popup CRO` section:
   - **Popup Strategy** — purpose, trigger, targeting
   - **Content** — headline, body, CTA per popup
   - **UX Rules** — frequency, dismissal, mobile behavior
   - **A/B Test Plan** — what to test first
   - **Anti-Annoyance Checklist** — ensuring popups help, not hurt

## Output

Popup strategy written to `.marketing/$ARGUMENTS/04-engage.md`. Present popup designs with copy for review.
```

**Step 7: Commit**

```bash
git add plugins/marketing/skills/onboarding-cro/ plugins/marketing/skills/churn-prevention/ plugins/marketing/skills/referral-program/ plugins/marketing/skills/paywall-upgrade-cro/ plugins/marketing/skills/popup-cro/
git commit -m "feat(marketing): add Phase 4 Engage skills (5 skills)"
```

---

### Task 8: Utility skills (4 skills)

**Files:**
- Create: `plugins/marketing/skills/analytics-tracking/SKILL.md`
- Create: `plugins/marketing/skills/copy-editing/SKILL.md`
- Create: `plugins/marketing/skills/marketing-ideas/SKILL.md`
- Create: `plugins/marketing/skills/revops/SKILL.md`

**Step 1: Create all 4 utility skill directories**

```bash
mkdir -p plugins/marketing/skills/{analytics-tracking,copy-editing,marketing-ideas,revops}
```

**Step 2: Create analytics-tracking/SKILL.md**

Write `plugins/marketing/skills/analytics-tracking/SKILL.md`:
```markdown
---
description: Set up analytics, event tracking, and attribution
---

# Analytics Tracking

Plan analytics and event tracking for "$ARGUMENTS". Design measurement frameworks, event taxonomies, and attribution models.

## Prerequisites

None — this is a utility skill that works across all phases.

## Process

1. **Read context** (if available):
   - Read `.marketing/$ARGUMENTS/00-strategy.md` for KPIs and success metrics
   - Read any existing phase artifacts for metrics mentioned

2. **Define measurement framework:**
   - What business questions need answering?
   - Map KPIs to RACE phases: Reach, Act, Convert, Engage
   - Identify leading vs. lagging indicators
   - Define the conversion funnel with measurable steps

3. **Design event taxonomy:**
   - Naming convention: `category_action_label` or `object.action`
   - Core events: page views, signups, activations, conversions, upgrades, churns
   - Engagement events: feature usage, content consumption, sharing
   - Campaign events: UTM tracking, ad clicks, email opens
   - Properties per event: what metadata to capture

4. **Attribution model:**
   - First-touch vs. last-touch vs. multi-touch attribution
   - UTM parameter strategy
   - Cross-device and cross-session tracking considerations
   - Privacy and consent requirements (GDPR, CCPA)

5. **Tool recommendations:**
   - Analytics platform (GA4, Mixpanel, Amplitude, PostHog)
   - Tag management (GTM)
   - Data layer design
   - Dashboard and reporting recommendations

6. **Write the artifact** — write to `.marketing/$ARGUMENTS/analytics-tracking.md`:
   - **Measurement Framework** — KPIs per RACE phase
   - **Event Taxonomy** — full event list with properties
   - **Attribution Model** — recommended model with rationale
   - **Implementation Guide** — tool setup and tag management
   - **Dashboard Plan** — what dashboards to build

## Output

Analytics plan written to `.marketing/$ARGUMENTS/analytics-tracking.md`. Present a summary highlighting:
- Core events to implement
- Recommended analytics stack
- Attribution model choice
```

**Step 3: Create copy-editing/SKILL.md**

Write `plugins/marketing/skills/copy-editing/SKILL.md`:
```markdown
---
description: Edit and refine existing marketing copy for clarity and impact
---

# Copy Editing

Edit and refine marketing copy for "$ARGUMENTS". Improve clarity, persuasiveness, and brand consistency of existing content.

## Prerequisites

None — this is a utility skill. Provide the copy to edit as "$ARGUMENTS" or as content in the conversation.

## Process

1. **Read the copy:**
   - If a file path is provided, read the file
   - If a URL is provided, use WebFetch to read the page content
   - If copy is provided inline, work with that directly

2. **Read context** (if available):
   - Read `.marketing/$ARGUMENTS/00-strategy.md` for brand voice and messaging guidelines
   - Check for tone, audience, and positioning context

3. **Edit for clarity:**
   - Remove jargon and unnecessary complexity
   - Shorten sentences (aim for 15-20 words average)
   - Use active voice
   - Eliminate weasel words and filler
   - Ensure logical flow between paragraphs

4. **Edit for persuasion:**
   - Is the value proposition clear in the first sentence?
   - Are benefits emphasized over features?
   - Is social proof present and specific?
   - Is the CTA clear and compelling?
   - Does the copy address the reader's objections?

5. **Edit for consistency:**
   - Consistent terminology throughout
   - Brand voice alignment
   - Formatting and style consistency
   - Grammar and punctuation

6. **Present the edit:**
   - Show the edited copy with changes highlighted
   - Explain the rationale for major changes
   - Flag any areas where the editor needs more context

## Output

Present the edited copy directly to the user with key changes explained. If context files exist, also save to `.marketing/$ARGUMENTS/copy-edits.md`.
```

**Step 4: Create marketing-ideas/SKILL.md**

Write `plugins/marketing/skills/marketing-ideas/SKILL.md`:
```markdown
---
description: Generate creative marketing campaign ideas
---

# Marketing Ideas

Generate creative marketing campaign and growth ideas for "$ARGUMENTS". Brainstorm unconventional approaches, viral mechanics, and high-impact tactics.

## Prerequisites

None — this is a utility skill. Works best with strategy context but can run standalone.

## Process

1. **Read context** (if available):
   - Read `.marketing/$ARGUMENTS/00-strategy.md` for audience and positioning
   - Read any existing phase artifacts for current marketing state

2. **Research inspiration:**
   - Use WebSearch to find creative campaigns in the category and adjacent categories
   - Look for viral marketing examples, growth hacks, and unconventional tactics
   - Study what's working NOW, not just classic case studies

3. **Generate ideas across categories:**
   - **Content marketing:** viral content formats, interactive content, data-driven content
   - **Community:** grassroots campaigns, user challenges, co-creation
   - **Partnerships:** co-marketing, influencer collaborations, integrations
   - **Product-led:** built-in virality, referral mechanics, freemium hooks
   - **Guerrilla:** unexpected channels, stunts, creative real-world activations
   - **Data & tools:** free tools, reports, benchmarks that attract attention

4. **Evaluate and rank:**
   - For each idea: expected impact, effort, cost, risk, timeline
   - Score by ICE (Impact, Confidence, Ease) framework
   - Identify the "unfair advantage" ideas — things only "$ARGUMENTS" could do

5. **Present to the user:**
   - Top 10 ideas ranked by ICE score
   - For each: one-paragraph description, expected outcome, first step to execute
   - Highlight the top 3 recommendations

## Output

Present ideas directly to the user, ranked by potential. If context files exist, also save to `.marketing/$ARGUMENTS/marketing-ideas.md`.
```

**Step 5: Create revops/SKILL.md**

Write `plugins/marketing/skills/revops/SKILL.md`:
```markdown
---
description: Revenue operations — pipeline, attribution, and reporting
---

# RevOps

Design revenue operations processes for "$ARGUMENTS". Plan pipeline management, attribution, reporting, and marketing-sales alignment.

## Prerequisites

None — this is a utility skill. Works best with strategy and analytics context.

## Process

1. **Read context** (if available):
   - Read `.marketing/$ARGUMENTS/00-strategy.md` for business context
   - Read `.marketing/$ARGUMENTS/analytics-tracking.md` if it exists

2. **Define the revenue funnel:**
   - Map stages: visitor → lead → MQL → SQL → opportunity → customer
   - Define stage criteria: what qualifies a lead for each stage?
   - Conversion rate benchmarks per stage
   - Handoff process between marketing and sales

3. **Lead scoring model:**
   - Demographic scoring: how well does the lead match ICP?
   - Behavioral scoring: what actions indicate intent?
   - Score thresholds for MQL and SQL
   - Score decay: how scores change over time with inactivity

4. **Attribution and reporting:**
   - Revenue attribution model: how is marketing credit assigned?
   - Key reports: pipeline, velocity, conversion rates, CAC, LTV
   - Dashboard design: what does leadership need to see?
   - Reporting cadence: daily, weekly, monthly, quarterly

5. **Process design:**
   - Lead routing: how are leads assigned to sales?
   - SLA: marketing response time, sales follow-up time
   - Feedback loops: how does sales inform marketing on lead quality?
   - Tech stack recommendations: CRM, marketing automation, BI tools

6. **Write the artifact** — write to `.marketing/$ARGUMENTS/revops.md`:
   - **Revenue Funnel** — stages, criteria, benchmarks
   - **Lead Scoring Model** — scoring framework
   - **Attribution & Reporting** — model, dashboards, cadence
   - **Processes** — routing, SLAs, feedback loops
   - **Tech Stack** — recommended tools

## Output

RevOps plan written to `.marketing/$ARGUMENTS/revops.md`. Present a summary highlighting:
- Funnel stages with conversion benchmarks
- Lead scoring model overview
- Key reports to build
```

**Step 6: Commit**

```bash
git add plugins/marketing/skills/analytics-tracking/ plugins/marketing/skills/copy-editing/ plugins/marketing/skills/marketing-ideas/ plugins/marketing/skills/revops/
git commit -m "feat(marketing): add utility skills (4 skills)"
```

---

### Task 9: Documentation — marketing overview and phase pages

**Files:**
- Modify: `apps/docs/content/docs/marketing/index.mdx`
- Modify: `apps/docs/content/docs/marketing/meta.json`
- Create: `apps/docs/content/docs/marketing/strategy.mdx`
- Create: `apps/docs/content/docs/marketing/reach.mdx`
- Create: `apps/docs/content/docs/marketing/act.mdx`
- Create: `apps/docs/content/docs/marketing/convert.mdx`
- Create: `apps/docs/content/docs/marketing/engage.mdx`
- Create: `apps/docs/content/docs/marketing/utilities.mdx`

**Step 1: Update index.mdx**

Replace the content of `apps/docs/content/docs/marketing/index.mdx` with:
```mdx
---
title: Marketing Domain Overview
description: A five-phase RACE Framework marketing process with 33 skills for growth marketing.
---

The Marketing plugin implements the RACE Framework with a Strategy phase, providing structured workflows for the full growth marketing lifecycle — from audience research to retention and advocacy.

## The Five Phases

| Phase | Command Prefix | Purpose |
|-------|---------------|---------|
| Strategy | `/marketing:customer-research`, etc. | Audience, competitors, positioning, pricing |
| Reach | `/marketing:content-strategy`, etc. | Build visibility through content, SEO, social, community |
| Act | `/marketing:copywriting`, etc. | Optimize touchpoints to generate leads and engagement |
| Convert | `/marketing:email-sequence`, etc. | Turn interest into revenue through campaigns and optimization |
| Engage | `/marketing:onboarding-cro`, etc. | Retain customers, reduce churn, drive referrals |

## The RACE Framework

The methodology follows the digital marketing lifecycle developed by Smart Insights:

**Strategy (Phase 0):** Define who you're marketing to, how you're positioned, and what success looks like — before any marketing activity.

**Reach (Phase 1):** Build awareness and attract the right audience through organic and paid channels.

**Act (Phase 2):** Encourage interaction — optimize pages, forms, and content to generate interest and leads.

**Convert (Phase 3):** Close the deal — run campaigns, nurture leads, and optimize conversion flows.

**Engage (Phase 4):** Retain and grow — reduce churn, drive referrals, and increase lifetime value.

## Artifact Flow

Each phase reads from previous phases and writes to `.marketing/<topic>/`:

```
.marketing/product-launch/
  00-strategy.md      ← Strategy phase output
  01-reach.md         ← Reach phase output
  02-act.md           ← Act phase output
  03-convert.md       ← Convert phase output
  04-engage.md        ← Engage phase output
```

## Utility Skills

Four utility skills work across all phases without prerequisites:

- `/marketing:analytics-tracking` — Set up measurement and attribution
- `/marketing:copy-editing` — Edit and refine existing marketing copy
- `/marketing:marketing-ideas` — Generate creative campaign ideas
- `/marketing:revops` — Revenue operations and pipeline design

## Quality Gates

The plugin enforces phase ordering:

- **Soft gates** check that Strategy artifacts exist before running later phases
- You can bypass with `--skip-checks` when needed (logged to `skip-log.md`)
- Utility skills have no prerequisites
```

**Step 2: Update meta.json**

Replace the content of `apps/docs/content/docs/marketing/meta.json` with:
```json
{
  "title": "Marketing",
  "description": "RACE Framework marketing process",
  "icon": "Megaphone",
  "root": true,
  "pages": [
    "index",
    "---Phases---",
    "strategy",
    "reach",
    "act",
    "convert",
    "engage",
    "---Other---",
    "utilities"
  ]
}
```

**Step 3: Create strategy.mdx**

Write `apps/docs/content/docs/marketing/strategy.mdx`:
```mdx
---
title: "Phase 0: Strategy"
description: Understand audience, competitors, positioning, and pricing before any marketing activity.
---

## Purpose

The Strategy phase establishes the marketing foundation. Before running any campaigns or creating content, you need to understand who you're marketing to, how you're positioned, and what success looks like.

## Skills

### Customer Research

```
/marketing:customer-research <topic>
```

Deep-dive into the target audience. Builds personas, maps jobs-to-be-done, identifies pain points, and documents the buyer journey.

**Output:** Personas, JTBD mapping, pain points, buyer journey → `.marketing/<topic>/00-strategy.md`

### Competitor Profiling

```
/marketing:competitor-profiling <topic>
```

Maps the competitive landscape. Profiles 5-8 competitors, analyzes strengths and weaknesses, identifies market gaps and differentiation opportunities.

**Output:** Competitor profiles, positioning matrix, market gaps → `.marketing/<topic>/00-strategy.md`

### Competitor Alternatives

```
/marketing:competitor-alternatives <topic>
```

Develops "vs" comparison and "alternatives to" content strategy. Creates feature comparison matrices and positioning angles per competitor.

**Prerequisites:** Works best after `/marketing:competitor-profiling`

**Output:** Comparison matrices, positioning angles, content recommendations → `.marketing/<topic>/00-strategy.md`

### Pricing Strategy

```
/marketing:pricing-strategy <topic>
```

Evaluates pricing models, tier structures, and packaging. Analyzes competitor pricing and applies pricing psychology principles.

**Output:** Pricing model recommendation, tier structure, psychology tactics → `.marketing/<topic>/00-strategy.md`

### Product Marketing Context

```
/marketing:product-marketing-context <topic>
```

Defines the core positioning statement, value proposition, messaging framework, and go-to-market context. Compiles all strategy work into a marketing brief.

**Output:** Positioning, messaging framework, GTM context, marketing brief → `.marketing/<topic>/00-strategy.md`

## Next Phase

After Strategy, proceed to [Reach](/docs/marketing/reach) to build visibility and attract the right audience.
```

**Step 4: Create reach.mdx**

Write `apps/docs/content/docs/marketing/reach.mdx`:
```mdx
---
title: "Phase 1: Reach"
description: Build visibility and attract the right audience through content, SEO, social, and community.
---

## Purpose

The Reach phase builds awareness and attracts the right audience. It covers all the channels and tactics for getting found — organic search, content, social media, community, and launches.

## Skills

### Content Strategy

```
/marketing:content-strategy <topic>
```

Plans content pillars, editorial calendar, format mix, and distribution strategy.

**Output:** Content pillars, editorial calendar, distribution plan → `.marketing/<topic>/01-reach.md`

### SEO Audit

```
/marketing:seo-audit <topic>
```

Comprehensive SEO analysis — technical SEO, on-page optimization, and content gap analysis with prioritized recommendations.

**Output:** Technical issues, on-page gaps, keyword opportunities → `.marketing/<topic>/01-reach.md`

### AI SEO

```
/marketing:ai-seo <topic>
```

Optimizes for AI-powered search — LLM citations, Google AI Overviews, ChatGPT, and Perplexity visibility.

**Output:** AI visibility audit, optimization strategy, content recommendations → `.marketing/<topic>/01-reach.md`

### Programmatic SEO

```
/marketing:programmatic-seo <topic>
```

Plans template-driven pages at scale for long-tail keyword targeting — landing pages, directories, comparison pages.

**Output:** Keyword patterns, page templates, data sources, quality plan → `.marketing/<topic>/01-reach.md`

### Site Architecture

```
/marketing:site-architecture <topic>
```

Designs URL structure, navigation hierarchy, and internal linking strategy.

**Output:** URL structure, navigation plan, internal linking strategy → `.marketing/<topic>/01-reach.md`

### Social Content

```
/marketing:social-content <topic>
```

Plans social media content — platform selection, content themes, posting templates, and scheduling.

**Output:** Platform strategy, content templates, scheduling plan → `.marketing/<topic>/01-reach.md`

### Community Marketing

```
/marketing:community-marketing <topic>
```

Community-led growth — identifies existing communities, designs owned community strategy, plans engagement programs.

**Output:** Community landscape, owned community plan, engagement programs → `.marketing/<topic>/01-reach.md`

### Directory Submissions

```
/marketing:directory-submissions <topic>
```

Plans directory and listing site strategy — identifies directories, optimizes listings, plans review generation.

**Output:** Directory list, submission plan, listing copy → `.marketing/<topic>/01-reach.md`

### Launch Strategy

```
/marketing:launch-strategy <topic>
```

Plans product or feature launches — pre-launch buildup, launch day execution, and post-launch follow-up.

**Output:** Launch plan, day-of playbook, channel checklist → `.marketing/<topic>/01-reach.md`

## Next Phase

After Reach, proceed to [Act](/docs/marketing/act) to optimize touchpoints for interaction and lead generation.
```

**Step 5: Create act.mdx**

Write `apps/docs/content/docs/marketing/act.mdx`:
```mdx
---
title: "Phase 2: Act"
description: Optimize touchpoints to generate interest, leads, and engagement.
---

## Purpose

The Act phase encourages interaction. It optimizes the touchpoints where visitors become leads — through compelling copy, optimized pages, lead magnets, and smart conversion design.

## Skills

### Copywriting

```
/marketing:copywriting <topic>
```

Writes persuasive copy using proven frameworks (PAS, AIDA, 4U). Generates headline variants, body copy, and CTAs.

**Output:** Copy brief, headline variants, body copy, CTA options → `.marketing/<topic>/02-act.md`

### Marketing Psychology

```
/marketing:marketing-psychology <topic>
```

Applies behavioral psychology principles — social proof, scarcity, reciprocity, anchoring, and more — with ethical guardrails.

**Output:** Applicable principles, implementation recommendations, ethical notes → `.marketing/<topic>/02-act.md`

### Page CRO

```
/marketing:page-cro <topic>
```

Conversion rate optimization for landing and product pages. Audits current performance and recommends improvements.

**Output:** Page assessment, recommendations, A/B test suggestions → `.marketing/<topic>/02-act.md`

### Form CRO

```
/marketing:form-cro <topic>
```

Optimizes forms for completion rate — field reduction, UX improvements, multi-step recommendations.

**Output:** Form assessment, field recommendations, UX improvements → `.marketing/<topic>/02-act.md`

### Lead Magnets

```
/marketing:lead-magnets <topic>
```

Designs lead magnets — guides, templates, tools, and gated content that attract qualified leads.

**Output:** Lead magnet concepts, landing page outline, delivery plan → `.marketing/<topic>/02-act.md`

### Free Tool Strategy

```
/marketing:free-tool-strategy <topic>
```

Plans free tools and calculators for acquisition with built-in growth mechanics and upsell paths.

**Output:** Tool concepts, growth mechanics, upsell path → `.marketing/<topic>/02-act.md`

### Schema Markup

```
/marketing:schema-markup <topic>
```

Plans and generates structured data (JSON-LD) for rich search results — FAQ, Product, Article, and more.

**Output:** Schema types, JSON-LD templates, implementation guide → `.marketing/<topic>/02-act.md`

## Next Phase

After Act, proceed to [Convert](/docs/marketing/convert) to turn interest into revenue.
```

**Step 6: Create convert.mdx**

Write `apps/docs/content/docs/marketing/convert.mdx`:
```mdx
---
title: "Phase 3: Convert"
description: Turn interest into revenue through campaigns, email, ads, and optimized flows.
---

## Purpose

The Convert phase turns interest into revenue. It covers campaign execution — email sequences, paid advertising, outbound, and conversion flow optimization.

## Skills

### Email Sequence

```
/marketing:email-sequence <topic>
```

Designs email drip campaigns — welcome, nurture, trial-to-paid, re-engagement, and post-purchase sequences with full copy.

**Output:** Sequence design, email copy, personalization guide → `.marketing/<topic>/03-convert.md`

### Paid Ads

```
/marketing:paid-ads <topic>
```

Plans paid advertising campaigns — platform selection, campaign structure, targeting, budget, and optimization playbook.

**Output:** Platform strategy, campaign structure, budget plan → `.marketing/<topic>/03-convert.md`

### Ad Creative

```
/marketing:ad-creative <topic>
```

Generates ad copy variants and creative briefs for search, social, and display ads.

**Output:** Copy variants, creative brief, A/B test plan → `.marketing/<topic>/03-convert.md`

### Cold Email

```
/marketing:cold-email <topic>
```

Designs cold outbound email campaigns — ICP targeting, email templates, personalization, and compliance.

**Output:** ICP definition, email templates, personalization guide → `.marketing/<topic>/03-convert.md`

### Signup Flow CRO

```
/marketing:signup-flow-cro <topic>
```

Optimizes signup and trial conversion flows — reduces friction, improves activation, and increases trial-to-paid conversion.

**Output:** Flow map, signup recommendations, activation strategy → `.marketing/<topic>/03-convert.md`

### A/B Test Setup

```
/marketing:ab-test-setup <topic>
```

Designs rigorous A/B tests — hypotheses, variants, sample size calculations, and measurement plans.

**Output:** Hypothesis, variants, statistical plan, decision framework → `.marketing/<topic>/03-convert.md`

### Sales Enablement

```
/marketing:sales-enablement <topic>
```

Creates sales collateral — competitive battle cards, objection handling guides, and demo talking points.

**Output:** Battle cards, objection handling, collateral recommendations → `.marketing/<topic>/03-convert.md`

## Next Phase

After Convert, proceed to [Engage](/docs/marketing/engage) to retain customers and drive advocacy.
```

**Step 7: Create engage.mdx**

Write `apps/docs/content/docs/marketing/engage.mdx`:
```mdx
---
title: "Phase 4: Engage"
description: Retain customers, reduce churn, and turn customers into advocates.
---

## Purpose

The Engage phase maximizes customer lifetime value. It covers retention, churn prevention, referral programs, and upgrade optimization — turning customers into long-term advocates.

## Skills

### Onboarding CRO

```
/marketing:onboarding-cro <topic>
```

Optimizes user onboarding for activation. Defines the "aha moment" and designs flows to reach it faster.

**Output:** Aha moment definition, flow assessment, recommended improvements → `.marketing/<topic>/04-engage.md`

### Churn Prevention

```
/marketing:churn-prevention <topic>
```

Identifies churn signals, analyzes reasons, and designs intervention playbooks including cancellation flow and win-back campaigns.

**Output:** Churn signals, intervention playbook, cancellation flow design → `.marketing/<topic>/04-engage.md`

### Referral Program

```
/marketing:referral-program <topic>
```

Designs referral and advocacy programs — incentive structures, mechanics, promotion strategy, and anti-fraud measures.

**Output:** Program design, UX flow, promotion plan, success metrics → `.marketing/<topic>/04-engage.md`

### Paywall & Upgrade CRO

```
/marketing:paywall-upgrade-cro <topic>
```

Optimizes paywall and upgrade experiences — upgrade triggers, pricing page design, and conversion flow improvements.

**Output:** Paywall assessment, upgrade triggers, pricing page recommendations → `.marketing/<topic>/04-engage.md`

### Popup CRO

```
/marketing:popup-cro <topic>
```

Designs high-converting popups and modals — lead capture, exit intent, upgrade prompts — with anti-annoyance guardrails.

**Output:** Popup strategy, content, UX rules, A/B test plan → `.marketing/<topic>/04-engage.md`

## After Engage

The RACE cycle is complete. Use [Utility Skills](/docs/marketing/utilities) for ongoing optimization and measurement.
```

**Step 8: Create utilities.mdx**

Write `apps/docs/content/docs/marketing/utilities.mdx`:
```mdx
---
title: Utility Skills
description: Cross-phase marketing utilities for analytics, copy editing, ideation, and revenue operations.
---

## Purpose

Utility skills work across all RACE phases. They have no prerequisites and can be run anytime — for measurement, editing, brainstorming, or operations.

## Skills

### Analytics Tracking

```
/marketing:analytics-tracking <topic>
```

Plans analytics setup — measurement frameworks, event taxonomies, attribution models, and dashboard design.

**Output:** Measurement framework, event taxonomy, attribution model → `.marketing/<topic>/analytics-tracking.md`

### Copy Editing

```
/marketing:copy-editing <topic or content>
```

Edits and refines existing marketing copy for clarity, persuasiveness, and brand consistency. Can work with files, URLs, or inline text.

**Output:** Edited copy with changes explained

### Marketing Ideas

```
/marketing:marketing-ideas <topic>
```

Generates creative marketing campaign ideas across categories — content, community, partnerships, product-led, guerrilla. Ranked by ICE score.

**Output:** Top 10 ideas ranked by impact, confidence, and ease

### RevOps

```
/marketing:revops <topic>
```

Designs revenue operations — funnel stages, lead scoring, attribution, reporting, and marketing-sales handoff processes.

**Output:** Revenue funnel, lead scoring model, reporting plan → `.marketing/<topic>/revops.md`
```

**Step 9: Commit**

```bash
git add apps/docs/content/docs/marketing/
git commit -m "feat(marketing): add documentation pages for all phases and utilities"
```

---

### Task 10: Final verification

**Step 1: Verify file count**

```bash
find plugins/marketing/skills -name "SKILL.md" | wc -l
```

Expected: `33`

**Step 2: Verify all skill directories exist**

```bash
ls plugins/marketing/skills/
```

Expected: 33 directories matching the design doc inventory.

**Step 3: Verify shared templates**

```bash
ls plugins/marketing/shared/
```

Expected: `campaign-plan-template.md  marketing-brief-template.md  race-framework-guide.md  seo-checklist.md`

**Step 4: Verify docs pages**

```bash
ls apps/docs/content/docs/marketing/
```

Expected: `act.mdx  convert.mdx  engage.mdx  index.mdx  meta.json  reach.mdx  strategy.mdx  utilities.mdx`

**Step 5: Verify plugin registration**

```bash
cat .claude-plugin/marketplace.json | grep marketing
```

Expected: marketing plugin entry visible.

**Step 6: Verify hooks**

```bash
ls plugins/marketing/hooks/
```

Expected: `check-strategy-exists.sh  hooks.json`

```bash
test -x plugins/marketing/hooks/check-strategy-exists.sh && echo "executable" || echo "not executable"
```

Expected: `executable`

**Step 7: Commit if any verification fixes were needed, otherwise done**

```bash
git log --oneline -10
```

Expected: 8 commits for this feature (scaffold, templates, phases 0-4, utilities, docs).

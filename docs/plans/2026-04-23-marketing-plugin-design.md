# Marketing Plugin Design

**Date:** 2026-04-23
**Status:** Approved
**Methodology:** RACE Framework (Smart Insights)

## Overview

A comprehensive marketing plugin for Metapowers implementing the RACE Framework — the industry-standard digital marketing methodology. Provides 33 skills organized across 5 phases (Strategy + 4 RACE phases) plus utilities, covering the full growth marketing lifecycle from audience research to retention and advocacy.

## Methodology: RACE Framework

The RACE Framework (Reach, Act, Convert, Engage) was developed by Smart Insights as a practical planning framework for digital marketing. We prepend a **Strategy** phase to establish context before execution — mirroring how the Design plugin starts with "Empathize" before the core Design Thinking phases.

```
Strategy → Reach → Act → Convert → Engage
(Phase 0)  (Phase 1) (Phase 2) (Phase 3) (Phase 4)
```

- **Strategy (Phase 0):** Understand audience, competitors, positioning, and pricing before any marketing activity.
- **Reach (Phase 1):** Build visibility and attract the right audience through content, SEO, social, and community.
- **Act (Phase 2):** Encourage interaction — optimize pages, forms, and touchpoints to generate interest and leads.
- **Convert (Phase 3):** Turn interest into revenue through campaigns, email, ads, and optimized signup flows.
- **Engage (Phase 4):** Retain customers, reduce churn, drive referrals, and increase lifetime value.

## Artifact Structure

All skills write markdown artifacts to `.marketing/$ARGUMENTS/`:

| File | Phase | Description |
|------|-------|-------------|
| `00-strategy.md` | Strategy | Market context, audience, competitive positioning |
| `01-reach.md` | Reach | Channels, content plan, SEO strategy |
| `02-act.md` | Act | Conversion touchpoints, landing pages, lead magnets |
| `03-convert.md` | Convert | Campaigns, email sequences, paid strategy |
| `04-engage.md` | Engage | Retention, referral, loyalty programs |
| `skip-log.md` | — | Log of skipped prerequisite checks |

## Skill Inventory (33 skills)

### Phase 0: Strategy (5 skills)

| Skill | Command | Description |
|-------|---------|-------------|
| `customer-research` | `/marketing:customer-research <topic>` | Deep-dive into target audience: personas, jobs-to-be-done, pain points |
| `competitor-profiling` | `/marketing:competitor-profiling <topic>` | Map competitive landscape: positioning, strengths, gaps |
| `competitor-alternatives` | `/marketing:competitor-alternatives <topic>` | Create "vs" and alternatives positioning content |
| `pricing-strategy` | `/marketing:pricing-strategy <topic>` | Evaluate pricing models, tiers, and packaging |
| `product-marketing-context` | `/marketing:product-marketing-context <topic>` | Define value propositions, messaging framework, GTM context |

### Phase 1: Reach (9 skills)

| Skill | Command | Description |
|-------|---------|-------------|
| `content-strategy` | `/marketing:content-strategy <topic>` | Plan content pillars, editorial calendar, distribution |
| `seo-audit` | `/marketing:seo-audit <topic>` | Technical SEO, on-page, and content gap analysis |
| `ai-seo` | `/marketing:ai-seo <topic>` | AI-search optimization (LLM visibility, AI Overviews) |
| `programmatic-seo` | `/marketing:programmatic-seo <topic>` | Template-driven pages at scale (landing pages, directories) |
| `site-architecture` | `/marketing:site-architecture <topic>` | Information architecture, URL structure, internal linking |
| `social-content` | `/marketing:social-content <topic>` | Social media content creation and scheduling strategy |
| `community-marketing` | `/marketing:community-marketing <topic>` | Community-led growth: forums, Discord, events |
| `directory-submissions` | `/marketing:directory-submissions <topic>` | Directory and listing site strategy |
| `launch-strategy` | `/marketing:launch-strategy <topic>` | Product/feature launch planning and execution |

### Phase 2: Act (7 skills)

| Skill | Command | Description |
|-------|---------|-------------|
| `copywriting` | `/marketing:copywriting <topic>` | Write persuasive copy for any marketing surface |
| `marketing-psychology` | `/marketing:marketing-psychology <topic>` | Apply behavioral psychology principles to marketing |
| `page-cro` | `/marketing:page-cro <topic>` | Conversion rate optimization for landing/product pages |
| `form-cro` | `/marketing:form-cro <topic>` | Optimize forms for completion rate |
| `lead-magnets` | `/marketing:lead-magnets <topic>` | Design lead magnets: guides, tools, templates |
| `free-tool-strategy` | `/marketing:free-tool-strategy <topic>` | Plan free tools/calculators for acquisition |
| `schema-markup` | `/marketing:schema-markup <topic>` | Structured data for rich search results |

### Phase 3: Convert (7 skills)

| Skill | Command | Description |
|-------|---------|-------------|
| `email-sequence` | `/marketing:email-sequence <topic>` | Design email drip campaigns and automations |
| `paid-ads` | `/marketing:paid-ads <topic>` | Plan and optimize paid advertising campaigns |
| `ad-creative` | `/marketing:ad-creative <topic>` | Generate ad copy and creative briefs |
| `cold-email` | `/marketing:cold-email <topic>` | Outbound email strategy and templates |
| `signup-flow-cro` | `/marketing:signup-flow-cro <topic>` | Optimize signup and trial flows |
| `ab-test-setup` | `/marketing:ab-test-setup <topic>` | Design A/B tests with hypothesis and measurement |
| `sales-enablement` | `/marketing:sales-enablement <topic>` | Create sales collateral, battle cards, objection handling |

### Phase 4: Engage (5 skills)

| Skill | Command | Description |
|-------|---------|-------------|
| `onboarding-cro` | `/marketing:onboarding-cro <topic>` | Optimize user onboarding for activation |
| `churn-prevention` | `/marketing:churn-prevention <topic>` | Identify and reduce churn with targeted interventions |
| `referral-program` | `/marketing:referral-program <topic>` | Design referral/advocacy programs |
| `paywall-upgrade-cro` | `/marketing:paywall-upgrade-cro <topic>` | Optimize upgrade flows and paywall design |
| `popup-cro` | `/marketing:popup-cro <topic>` | Design high-converting popups and modals |

### Utilities (4 skills — no phase gating)

| Skill | Command | Description |
|-------|---------|-------------|
| `analytics-tracking` | `/marketing:analytics-tracking <topic>` | Set up analytics, events, and attribution |
| `copy-editing` | `/marketing:copy-editing <topic>` | Edit and refine existing marketing copy |
| `marketing-ideas` | `/marketing:marketing-ideas <topic>` | Generate creative marketing campaign ideas |
| `revops` | `/marketing:revops <topic>` | Revenue operations: pipeline, attribution, reporting |

## Plugin Structure

```
plugins/marketing/
├── .claude-plugin/
│   └── plugin.json
├── .mcp.json
├── hooks/
│   ├── hooks.json
│   └── check-strategy-exists.sh
├── shared/
│   ├── race-framework-guide.md
│   ├── marketing-brief-template.md
│   ├── campaign-plan-template.md
│   └── seo-checklist.md
├── skills/
│   ├── customer-research/SKILL.md
│   ├── competitor-profiling/SKILL.md
│   ├── competitor-alternatives/SKILL.md
│   ├── pricing-strategy/SKILL.md
│   ├── product-marketing-context/SKILL.md
│   ├── content-strategy/SKILL.md
│   ├── seo-audit/SKILL.md
│   ├── ai-seo/SKILL.md
│   ├── programmatic-seo/SKILL.md
│   ├── site-architecture/SKILL.md
│   ├── social-content/SKILL.md
│   ├── community-marketing/SKILL.md
│   ├── directory-submissions/SKILL.md
│   ├── launch-strategy/SKILL.md
│   ├── copywriting/SKILL.md
│   ├── marketing-psychology/SKILL.md
│   ├── page-cro/SKILL.md
│   ├── form-cro/SKILL.md
│   ├── lead-magnets/SKILL.md
│   ├── free-tool-strategy/SKILL.md
│   ├── schema-markup/SKILL.md
│   ├── email-sequence/SKILL.md
│   ├── paid-ads/SKILL.md
│   ├── ad-creative/SKILL.md
│   ├── cold-email/SKILL.md
│   ├── signup-flow-cro/SKILL.md
│   ├── ab-test-setup/SKILL.md
│   ├── sales-enablement/SKILL.md
│   ├── onboarding-cro/SKILL.md
│   ├── churn-prevention/SKILL.md
│   ├── referral-program/SKILL.md
│   ├── paywall-upgrade-cro/SKILL.md
│   ├── popup-cro/SKILL.md
│   ├── analytics-tracking/SKILL.md
│   ├── copy-editing/SKILL.md
│   ├── marketing-ideas/SKILL.md
│   └── revops/SKILL.md
├── commands/
└── agents/
```

## Shared Templates

### race-framework-guide.md
Reference guide explaining the RACE methodology — purpose of each phase, key activities, success metrics. Used by all phase skills for context.

### marketing-brief-template.md
Template for Strategy phase output:
- Target Audience (Personas, JTBD)
- Value Proposition & Messaging
- Competitive Positioning
- Success Metrics (KPIs per RACE phase)
- Budget & Resources
- Timeline

### campaign-plan-template.md
Template for campaign-level planning (Convert phase):
- Objective & Hypothesis
- Target Segment
- Channels & Tactics
- Creative Requirements
- Budget Allocation
- Measurement Plan
- A/B Test Plan

### seo-checklist.md
Technical and on-page SEO reference checklist for seo-audit, ai-seo, and site-architecture skills.

## Hooks

### check-strategy-exists.sh
- Checks for `.marketing/$TOPIC/00-strategy.md`
- Blocks Phase 2+ skills if Strategy phase incomplete
- Bypass: `MARKETING_SKIP_CHECKS=1`
- Logs bypass to `.marketing/$TOPIC/skip-log.md`

### hooks.json
Phase gating hooks — prevents running Act/Convert/Engage skills without completed Strategy phase. Uses `PreToolUse` matcher pattern.

## MCP Integration

### Google Analytics / Search Console
- Package: `packages/analytics-mcp/`
- Provides data-driven insights for SEO, CRO, and analytics skills
- Configured via `.mcp.json` with `GOOGLE_ANALYTICS_CREDENTIALS` env var
- Skills work without MCP (graceful degradation) — MCP enhances with real data

## Documentation (apps/docs)

### Structure
```
apps/docs/content/docs/marketing/
├── index.mdx              # RACE overview, getting started
├── meta.json              # Navigation
├── strategy/
│   ├── index.mdx          # Phase 0: all 5 skills
│   └── meta.json
├── reach/
│   ├── index.mdx          # Phase 1: all 9 skills
│   └── meta.json
├── act/
│   ├── index.mdx          # Phase 2: all 7 skills
│   └── meta.json
├── convert/
│   ├── index.mdx          # Phase 3: all 7 skills
│   └── meta.json
├── engage/
│   ├── index.mdx          # Phase 4: all 5 skills
│   └── meta.json
└── utilities/
    ├── index.mdx          # Utility skills: all 4
    └── meta.json
```

### Content per page
- Phase purpose and methodology context
- All skills in that phase with: command, description, example output, prerequisites
- How skills connect to adjacent phases

## Marketplace Registration

Add to `.claude-plugin/marketplace.json`:
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

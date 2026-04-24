# Companion Tools Page Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a curated "Companion Tools" MDX page to the Fumadocs site listing third-party tools that enhance Claude Code alongside Metapowers.

**Architecture:** Single MDX page at `apps/docs/content/docs/overview/companion-tools.mdx`, registered in the overview `meta.json`. Uses plain MDX with H2 category headings, H3 tool entries, fenced bash install blocks, and blockquote "Pairs well with" notes. No custom components.

**Tech Stack:** MDX, Fumadocs, Next.js 16

---

### Task 1: Add companion-tools to sidebar navigation

**Files:**
- Modify: `apps/docs/content/docs/overview/meta.json`

**Step 1: Update meta.json pages array**

Insert `"companion-tools"` after `"comparisons"` and before `"installation"` in the `pages` array:

```json
{
  "title": "Overview",
  "description": "Introduction and getting started",
  "icon": "BookOpen",
  "root": true,
  "pages": ["index", "what-is-metapowers", "comparisons", "companion-tools", "installation", "---Quick Start---", "guides", "prompting", "---Memory---", "artifacts", "storage", "---Meta Skills---", "status", "init", "report", "workflow", "...reference"]
}
```

**Step 2: Verify the file is valid JSON**

Run: `cat apps/docs/content/docs/overview/meta.json | python3 -m json.tool > /dev/null && echo "Valid JSON"`
Expected: `Valid JSON`

**Step 3: Commit**

```bash
git add apps/docs/content/docs/overview/meta.json
git commit -m "docs: add companion-tools to overview sidebar nav"
```

---

### Task 2: Create the companion-tools MDX page

**Files:**
- Create: `apps/docs/content/docs/overview/companion-tools.mdx`

**Step 1: Write the full MDX file**

```mdx
---
title: Companion Tools
description: Complementary frameworks and tools that enhance your Claude Code experience alongside Metapowers.
---

> **Note:** These are third-party community and official tools — not maintained by the Metapowers project. Links and install commands were accurate at time of writing. Always check the source repository for the latest instructions.

## Usage & Cost Monitoring

Track token spend, session costs, and rate limits.

### ccflare

Usage dashboard with a web UI — more visual than ccusage. Acts as a proxy between Claude Code and the Anthropic API with real-time analytics and intelligent load balancing.

```bash
git clone https://github.com/snipeship/ccflare && cd ccflare
```

[GitHub](https://github.com/snipeship/ccflare) · [Website](https://ccflare.com)

> **Pairs well with:** Any metapowers domain — monitor token costs across long design sprints or legal review sessions.

### ccusage

CLI tool that analyzes Claude Code token usage and costs from local JSONL files. Supports daily, monthly, and session views. Privacy-first — no data leaves your machine.

```bash
npx ccusage
```

[GitHub](https://github.com/ryoppippi/ccusage) · [Website](https://ccusage.com)

> **Pairs well with:** Any metapowers domain — quick cost check after a multi-phase workflow.

### Claude Code Usage Monitor

Real-time terminal monitor with Rich UI showing token consumption, burn rate, cost analysis, and ML-based predictions about session limits.

```bash
uv tool install claude-monitor
```

[GitHub](https://github.com/Maciek-roboblog/Claude-Code-Usage-Monitor)

> **Pairs well with:** Long-running sessions like `/legal:draft` or `/project-management:sprint` where token pacing matters.

---

## Status & Developer Experience

See what's happening at a glance — context usage, active tools, running agents, and todo progress.

### claude-hud

Shows context usage, active tools, running agents, and todo progress in your terminal status line.

```bash
# Configure via Claude Code's /statusline command
```

[GitHub](https://github.com/jarrodwatts/claude-hud)

> **Pairs well with:** Multi-step workflows like `/design:empathize` → `/design:prototype` where tracking agent progress helps.

### ClaudeCodeStatusLine

Displays model, tokens, rate limits, and git info with automatic update checks.

```bash
# Configure via Claude Code's /statusline command
```

[GitHub](https://github.com/daniel3303/ClaudeCodeStatusLine)

> **Pairs well with:** Any domain — useful baseline status info during all metapowers sessions.

### ccstatusline

Powerline-compatible status line with theme support and high customizability.

```bash
# Configure via Claude Code's /statusline command
```

[GitHub](https://github.com/sirmalloc/ccstatusline)

> **Pairs well with:** Any domain — for users who want a polished, themed terminal experience.

---

## Token Optimization

Reduce output token consumption without losing technical accuracy.

### caveman

Makes Claude respond in compressed "caveman" language, cutting ~75% of output tokens. Code blocks, URLs, file paths, and commands pass through untouched — only prose is compressed.

```bash
# Auto-activates via Claude Code SessionStart hook
# See repo for installation instructions
```

[GitHub](https://github.com/JuliusBrussee/caveman)

> **Pairs well with:** Token-heavy domains like `/marketing:strategy` or `/legal:assess` where prose output is significant.

---

## Skill & Plugin Discovery

Find and install community-built skills and plugins.

### skills.sh

Skill marketplace and leaderboard run by Vercel. Supports 19+ AI agents including Claude Code. Tracks actual install counts. Uses the SKILL.md open standard.

```bash
npx skills add owner/repo
```

[Website](https://skills.sh)

> **Pairs well with:** Extending metapowers with additional community skills for specialized workflows.

### awesome-claude-plugins

Curated registry of production-ready Claude Code plugins by ComposioHQ. Includes the Composio Tool Router connecting Claude to 500+ external apps (Slack, GitHub, email, etc.).

```bash
git clone https://github.com/ComposioHQ/awesome-claude-plugins
claude --plugin-dir ./connect-apps
```

[GitHub](https://github.com/ComposioHQ/awesome-claude-plugins)

> **Pairs well with:** `/marketing:reach` and `/marketing:engage` — connect to marketing platforms via the Tool Router.

### ClaudePluginHub

Web directory for Claude Code plugins with semantic search and AI-powered relevance ranking. Can generate custom plugins from a GitHub URL.

```bash
npx claudepluginhub owner/repo --plugin name
```

[Website](https://www.claudepluginhub.com)

> **Pairs well with:** Discovering domain-specific plugins that complement metapowers workflows.

---

## Official Marketplaces

Anthropic-maintained plugin collections with verified quality.

### claude-plugins-official

The official Anthropic plugin marketplace with ~100+ verified plugins covering LSP integrations, GitHub, Playwright, Slack, and more. Auto-updates enabled by default.

```bash
/plugin install name@claude-plugins-official
```

[GitHub](https://github.com/anthropics/claude-plugins-official)

> **Pairs well with:** `/development:build` and `/development:test` — official tooling integrations for the development workflow.

### knowledge-work-plugins

14 role-based plugins for sales, marketing, finance, legal, HR, and brand voice. Each includes skills, slash commands, MCP connectors, and sub-agents tailored to a domain.

```bash
claude plugin marketplace add anthropics/knowledge-work-plugins
claude plugin install sales@knowledge-work-plugins
```

[GitHub](https://github.com/anthropics/knowledge-work-plugins)

> **Pairs well with:** `/marketing`, `/legal`, and `/branding` domains — official role-based plugins that complement metapowers' methodology-driven approach.
```

**Step 2: Verify the file renders (dev server)**

Run: `cd apps/docs && bun run dev`
Expected: Dev server starts. Navigate to `/docs/overview/companion-tools` — page renders with all categories and tool cards.

**Step 3: Commit**

```bash
git add apps/docs/content/docs/overview/companion-tools.mdx
git commit -m "docs: add companion tools page with 12 curated tools"
```

---

### Task 3: Verify sidebar navigation and page links

**Step 1: Check sidebar order in dev server**

Run: `cd apps/docs && bun run dev` (if not already running)
Expected: Sidebar shows: What is Metapowers → Comparisons → **Companion Tools** → Installation

**Step 2: Verify all external links resolve**

Run: `grep -oP 'https?://[^\s\)]+' apps/docs/content/docs/overview/companion-tools.mdx | sort -u`
Expected: List of all external URLs. Spot-check 2-3 in a browser to confirm they resolve.

**Step 3: Commit (if any fixes needed)**

```bash
git add -A
git commit -m "fix: correct companion tools links"
```

---

### Task 4: Build verification

**Step 1: Run full docs build**

Run: `cd apps/docs && bun run build`
Expected: Build succeeds with no errors. The companion-tools page is included in the output.

**Step 2: Final commit (if build required fixes)**

```bash
git add -A
git commit -m "fix: resolve companion tools build issues"
```

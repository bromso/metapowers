# Companion Tools Page Design

**Date:** 2026-04-24
**Status:** Approved

## Goal

Create a curated "works great with" companion page listing third-party tools that enhance the Claude Code experience alongside Metapowers. Grouped by function, with rich cards including install commands and links.

## Page Location

- **File:** `apps/docs/content/docs/overview/companion-tools.mdx`
- **Sidebar:** Added to `overview/meta.json` after `comparisons`, before `installation`
- **URL:** `/docs/overview/companion-tools`

## Categories & Tools

### 1. Usage & Cost Monitoring

Track token spend, session costs, and rate limits.

| Tool | Description | Install | Links |
|------|-------------|---------|-------|
| ccflare | Usage dashboard with web UI, acts as API proxy with real-time analytics | `git clone https://github.com/snipeship/ccflare` | [GitHub](https://github.com/snipeship/ccflare), [Website](https://ccflare.com) |
| ccusage | CLI analyzer for token usage and costs from local JSONL files. Privacy-first | `npx ccusage` | [GitHub](https://github.com/ryoppippi/ccusage), [Website](https://ccusage.com) |
| Claude Code Usage Monitor | Real-time terminal monitor with Rich UI, burn rate, ML predictions | `uv tool install claude-monitor` | [GitHub](https://github.com/Maciek-roboblog/Claude-Code-Usage-Monitor) |

### 2. Status & Developer Experience

See what's happening at a glance — context usage, active tools, running agents.

| Tool | Description | Install | Links |
|------|-------------|---------|-------|
| claude-hud | Context usage, active tools, running agents, todo progress | Via Claude Code statusline config | [GitHub](https://github.com/jarrodwatts/claude-hud) |
| ClaudeCodeStatusLine | Model, tokens, rate limits, git info with auto-update | Via Claude Code statusline config | [GitHub](https://github.com/daniel3303/ClaudeCodeStatusLine) |
| ccstatusline | Powerline support, themes, highly customizable | Via Claude Code statusline config | [GitHub](https://github.com/sirmalloc/ccstatusline) |

### 3. Token Optimization

Reduce output token consumption without losing technical accuracy.

| Tool | Description | Install | Links |
|------|-------------|---------|-------|
| caveman | Compressed "caveman" prose output, ~75% token savings. Code/URLs/paths untouched | Auto-activates via SessionStart hook | [GitHub](https://github.com/JuliusBrussee/caveman) |

### 4. Skill & Plugin Discovery

Find and install community-built skills and plugins.

| Tool | Description | Install | Links |
|------|-------------|---------|-------|
| skills.sh | Vercel-run skill marketplace and leaderboard, supports 19+ AI agents | `npx skills add owner/repo` | [Website](https://skills.sh) |
| awesome-claude-plugins | Curated registry by ComposioHQ, includes 500-app Tool Router | Clone repo + `claude --plugin-dir ./connect-apps` | [GitHub](https://github.com/ComposioHQ/awesome-claude-plugins) |
| ClaudePluginHub | Web directory with semantic search and AI-powered relevance ranking | `npx claudepluginhub owner/repo --plugin name` | [Website](https://www.claudepluginhub.com) |

### 5. Official Marketplaces

Anthropic-maintained plugin collections with verified quality.

| Tool | Description | Install | Links |
|------|-------------|---------|-------|
| claude-plugins-official | ~100+ Anthropic-verified plugins (LSP, GitHub, Playwright, Slack, etc.) | `/plugin install name@claude-plugins-official` | [GitHub](https://github.com/anthropics/claude-plugins-official) |
| knowledge-work-plugins | 14 role-based plugins for sales, marketing, legal, finance, HR, brand voice | `claude plugin marketplace add anthropics/knowledge-work-plugins` | [GitHub](https://github.com/anthropics/knowledge-work-plugins) |

## Card Format

Each tool entry uses:
- **H2** for category headings, **H3** for each tool
- One-line description paragraph
- Fenced `bash` block for install command
- Inline links separated by `·`
- Blockquote "Pairs well with" note referencing relevant metapowers domains
- Disclaimer callout at page top: these are community tools, not maintained by metapowers

## Style

Plain MDX with standard Fumadocs primitives. No custom components. Consistent with `comparisons.mdx` and other overview pages.

## Out of Scope

- Interactive wizard / filtering UI
- Tiered rankings (Essential/Recommended/Nice-to-have)
- Tool verification or testing by metapowers team
- claude-plugins.dev (could not verify existence)

# LLM-Agnostic Rebrand Design

**Date:** 2026-04-24
**Status:** Approved

## Goal

Reposition Metapowers from "Claude Code plugins" to "LLM-agnostic plugins" across all user-facing copy. Add a tabbed install component to the landing page showing install commands for npm, pnpm, yarn, bun, Claude Code, and Cursor.

## Scope

### Landing Page (`apps/docs/app/(home)/page.tsx`)

**Copy changes:**
- "Claude Code plugins for structured workflows" → "LLM plugins for structured workflows"
- "Claude Code plugins powered by proven methodologies." → "LLM-agnostic plugins that package skills, agents, and MCP to power proven methodologies."
- Step 1 description: "Add all domains to Claude Code in one command." → "Add all domains in one command."
- Step 1 command: `claude install bromso/metapowers` → `npx create-metapowers`

**Tabbed install component:**
Replace step 1's hardcoded command with a tab group:

| Tab | Command |
|-----|---------|
| npm | `npx create-metapowers` |
| pnpm | `pnpx create-metapowers` |
| yarn | `yarn dlx create-metapowers` |
| bun | `bunx create-metapowers` |
| Claude Code | `claude install bromso/metapowers` |
| Cursor | `cp metapowers/.cursorrules ./` |

### Documentation Pages

**overview/index.mdx:**
- description: "...structured workflows in Claude Code." → "...structured workflows for AI coding assistants."
- "collection of Claude Code plugins" → "collection of LLM plugins"
- "Install the metapowers marketplace in Claude Code:" → "Install metapowers:"

**overview/what-is-metapowers.mdx:**
- description: "...domain-specific workflows for Claude Code." → "...domain-specific workflows for AI coding assistants."
- "collection of Claude Code plugins" → "collection of LLM plugins"
- "Anyone using Claude Code" → "Anyone using an AI coding assistant"

**overview/installation.mdx:**
- description: "...across Claude Code, Codex CLI, OpenCode, and Cursor." → "...across AI coding assistants."

**overview/companion-tools.mdx:**
- description: "...enhance your Claude Code experience" → "...enhance your AI coding experience"
- "proxy between Claude Code and the Anthropic API" → "proxy between your AI assistant and the Anthropic API"
- "analyzes Claude Code token usage" → "analyzes token usage"
- "19+ AI agents including Claude Code" → "19+ AI agents"
- "production-ready Claude Code plugins" → "production-ready AI coding plugins"
- "directory for Claude Code plugins" → "directory for AI coding plugins"

**overview/comparisons.mdx:**
- description: "...other Claude Code plugin ecosystems." → "...other AI coding plugin ecosystems."
- "Several Claude Code plugin ecosystems exist." → "Several AI coding plugin ecosystems exist."

**design/index.mdx:**
- description: "...UI components in Claude Code." → "...UI components with AI coding assistants."

### README.md

- Badge: "Claude_Code-Plugin" → "LLM-Plugin"
- "Works with Claude Code, Codex CLI, OpenCode, and Cursor." → "Works with any AI coding assistant — Claude Code, Codex CLI, OpenCode, Cursor, and more."

### Other Files

- `.claude-plugin/marketplace.json`: "Metaprompting plugins for Claude Code" → "Metaprompting plugins for AI coding assistants"
- `packages/create-metapowers/package.json`: remove "claude-code" keyword, add "llm", "ai-coding"
- `packages/scoring-harness/src/runner.ts`: "scoring a Claude Code skill" → "scoring a skill"

### Out of Scope

- Plan docs (historical records, left as-is)
- `create-metapowers/src/index.ts` tool-specific install output (contextually correct)
- Installation page section headers (Claude Code, Codex CLI, etc. — these are tool-specific instructions)

## Non-Goals

- No layout or structural changes beyond the tabbed install component
- No changes to skill files or SKILL.md content
- No changes to how skills are loaded or executed

# LLM-Agnostic Rebrand Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace all "Claude Code plugin" positioning with LLM-agnostic language across the entire project, and add a tabbed install component to the landing page.

**Architecture:** Pure copy changes across MDX docs, TSX landing page, README, JSON manifests, and source files. One new React component (tabbed installer) on the landing page. No structural or behavioral changes.

**Tech Stack:** Next.js, React, MDX (fumadocs), Markdown, JSON

---

### Task 1: Landing page — update hero copy

**Files:**
- Modify: `apps/docs/app/(home)/page.tsx`

**Step 1: Update the badge text**

Change line ~222:
```tsx
// OLD
<span>Claude Code plugins for structured workflows</span>
// NEW
<span>LLM plugins for structured workflows</span>
```

**Step 2: Update the subtitle**

Change line ~230:
```tsx
// OLD
Structured workflows for every discipline — from design to legal.
Claude Code plugins powered by proven methodologies.
// NEW
Structured workflows for every discipline — from design to legal.
LLM-agnostic plugins that package skills, agents, and MCP to power proven methodologies.
```

**Step 3: Update step 1 in "How it works"**

Change the steps array entry for "Install":
```tsx
// OLD
command: "claude install bromso/metapowers",
description: "Add all domains to Claude Code in one command.",
// NEW
command: "npx create-metapowers",
description: "Add all domains in one command.",
```

**Step 4: Build and verify**

Run: `npx turbo build --filter=@metapowers/docs`
Expected: Build succeeds

**Step 5: Commit**

```bash
git add apps/docs/app/\(home\)/page.tsx
git commit -m "docs(landing): update hero and how-it-works copy to LLM-agnostic"
```

---

### Task 2: Landing page — add tabbed install component

**Files:**
- Modify: `apps/docs/app/(home)/page.tsx`

**Step 1: Add tab state and data**

Add a `useState` hook and tab data for the install tabs. Tabs: npm, pnpm, yarn, bun, Claude Code, Cursor. Each has a label and command string.

```tsx
const installTabs = [
  { label: "npm", command: "npx create-metapowers" },
  { label: "pnpm", command: "pnpx create-metapowers" },
  { label: "yarn", command: "yarn dlx create-metapowers" },
  { label: "bun", command: "bunx create-metapowers" },
  { label: "Claude Code", command: "claude install bromso/metapowers" },
  { label: "Cursor", command: "cp metapowers/.cursorrules ./" },
];
```

**Step 2: Create InstallTabs component**

Build a client component (or inline with `"use client"` at file top) with tab buttons and a code display area. Style to match the fumadocs reference image — horizontal tab row with active underline, code block below with copy button.

```tsx
"use client";
import { useState } from "react";

function InstallTabs() {
  const [active, setActive] = useState(0);
  return (
    <div className="w-full max-w-xl rounded-xl border border-fd-border bg-fd-card overflow-hidden">
      <div className="flex border-b border-fd-border">
        {installTabs.map((tab, i) => (
          <button
            key={tab.label}
            onClick={() => setActive(i)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors ${
              active === i
                ? "border-b-2 border-fd-primary text-fd-primary"
                : "text-fd-muted-foreground hover:text-fd-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="flex items-center justify-between px-4 py-3">
        <code className="text-sm text-fd-foreground">
          <span className="text-fd-muted-foreground">$ </span>
          {installTabs[active].command}
        </code>
        <button
          onClick={() => navigator.clipboard.writeText(installTabs[active].command)}
          className="rounded-md p-1.5 text-fd-muted-foreground hover:text-fd-foreground transition-colors"
          aria-label="Copy to clipboard"
        >
          {/* clipboard icon */}
        </button>
      </div>
    </div>
  );
}
```

**Step 3: Place in hero section**

Add `<InstallTabs />` below the CTA buttons in the hero section, before the stats bar.

**Step 4: Build and verify**

Run: `npx turbo build --filter=@metapowers/docs`
Expected: Build succeeds

**Step 5: Commit**

```bash
git add apps/docs/app/\(home\)/page.tsx
git commit -m "feat(landing): add tabbed install component with multi-tool support"
```

---

### Task 3: Overview docs — update index.mdx

**Files:**
- Modify: `apps/docs/content/docs/overview/index.mdx`

**Step 1: Apply copy changes**

```mdx
---
title: Getting Started
description: What is Metapowers and how to get started with structured workflows for AI coding assistants.
---

## What is Metapowers?

Metapowers is a collection of LLM plugins that bring structured, repeatable workflows to digital production domains. Each plugin adds a set of slash commands that guide you through a proven methodology.

...

## Quick Start

Install metapowers:

```bash
npx create-metapowers
```
```

Changes:
- description: "in Claude Code" → "for AI coding assistants"
- body: "Claude Code plugins" → "LLM plugins"
- "Install the metapowers marketplace in Claude Code:" → "Install metapowers:"
- command: `claude install bromso/metapowers` → `npx create-metapowers`

**Step 2: Commit**

```bash
git add apps/docs/content/docs/overview/index.mdx
git commit -m "docs(overview): update getting started copy to LLM-agnostic"
```

---

### Task 4: Overview docs — update what-is-metapowers.mdx

**Files:**
- Modify: `apps/docs/content/docs/overview/what-is-metapowers.mdx`

**Step 1: Apply copy changes**

- Line 3: description: "for Claude Code" → "for AI coding assistants"
- Line 14: "Claude Code plugins" → "LLM plugins"
- Line 64: "Anyone using Claude Code" → "Anyone using an AI coding assistant"

**Step 2: Commit**

```bash
git add apps/docs/content/docs/overview/what-is-metapowers.mdx
git commit -m "docs(overview): update what-is-metapowers copy to LLM-agnostic"
```

---

### Task 5: Overview docs — update comparisons.mdx

**Files:**
- Modify: `apps/docs/content/docs/overview/comparisons.mdx`

**Step 1: Apply copy changes**

- Line 3: description: "other Claude Code plugin ecosystems" → "other AI coding plugin ecosystems"
- Line 8: "Several Claude Code plugin ecosystems exist" → "Several AI coding plugin ecosystems exist"

**Step 2: Commit**

```bash
git add apps/docs/content/docs/overview/comparisons.mdx
git commit -m "docs(overview): update comparisons copy to LLM-agnostic"
```

---

### Task 6: Overview docs — update installation.mdx

**Files:**
- Modify: `apps/docs/content/docs/overview/installation.mdx`

**Step 1: Apply copy change**

- Line 3: description: "across Claude Code, Codex CLI, OpenCode, and Cursor" → "across AI coding assistants"

Note: Keep the section headers (## Claude Code, ## Codex CLI, etc.) as-is — those are tool-specific install instructions.

**Step 2: Commit**

```bash
git add apps/docs/content/docs/overview/installation.mdx
git commit -m "docs(overview): update installation description to LLM-agnostic"
```

---

### Task 7: Overview docs — update companion-tools.mdx

**Files:**
- Modify: `apps/docs/content/docs/overview/companion-tools.mdx`

**Step 1: Apply copy changes**

- Line 3: description: "your Claude Code experience" → "your AI coding experience"
- Line 14: "between Claude Code and the Anthropic API" → "between your AI assistant and the Anthropic API"
- Line 26: "analyzes Claude Code token usage" → "analyzes token usage"
- Line 117: "19+ AI agents including Claude Code" → "19+ AI agents"
- Line 129: "production-ready Claude Code plugins" → "production-ready AI coding plugins"
- Line 142: "directory for Claude Code plugins" → "directory for AI coding plugins"

Note: Keep "Claude Code's /statusline command" references (lines 59, 71, 83) — those are tool-specific instructions.

**Step 2: Commit**

```bash
git add apps/docs/content/docs/overview/companion-tools.mdx
git commit -m "docs(overview): update companion-tools copy to LLM-agnostic"
```

---

### Task 8: Domain docs — update design/index.mdx

**Files:**
- Modify: `apps/docs/content/docs/design/index.mdx`

**Step 1: Apply copy change**

- Line 3: description: "in Claude Code" → "with AI coding assistants"

**Step 2: Commit**

```bash
git add apps/docs/content/docs/design/index.mdx
git commit -m "docs(design): update description to LLM-agnostic"
```

---

### Task 9: Domain docs — update development docs

**Files:**
- Modify: `apps/docs/content/docs/development/architecture/index.mdx`
- Modify: `apps/docs/content/docs/development/mcp-server/index.mdx`
- Modify: `apps/docs/content/docs/development/mcp-server/setup.mdx`

**Step 1: Apply copy changes**

architecture/index.mdx line 29:
- "Claude Code loads the corresponding skill file" → "your AI coding assistant loads the corresponding skill file"

mcp-server/index.mdx line 8:
- "connects Claude Code to Figma" → "connects your AI coding assistant to Figma"

mcp-server/index.mdx line 18:
- "Claude Code <--stdio-->" → "AI Assistant <--stdio-->"

mcp-server/setup.mdx line 8:
- "Claude Code CLI installed" → "An AI coding assistant (Claude Code, Codex CLI, etc.) installed"

**Step 2: Commit**

```bash
git add apps/docs/content/docs/development/
git commit -m "docs(development): update architecture and MCP docs to LLM-agnostic"
```

---

### Task 10: Root README.md

**Files:**
- Modify: `README.md`

**Step 1: Apply copy changes**

Line 5 — badge:
```md
// OLD
[![Claude Code](https://img.shields.io/badge/Claude_Code-Plugin-CC785C?logo=anthropic&logoColor=white)](https://claude.ai/code)
// NEW
[![LLM Plugin](https://img.shields.io/badge/LLM-Plugin-CC785C?logo=anthropic&logoColor=white)](https://bromso.github.io/metapowers/)
```

Line 10:
```md
// OLD
Works with Claude Code, Codex CLI, OpenCode, and Cursor.
// NEW
Works with any AI coding assistant — Claude Code, Codex CLI, OpenCode, Cursor, and more.
```

Line 106:
```md
// OLD
- One of: Claude Code, Codex CLI, OpenCode, or Cursor
// NEW
- One of: Claude Code, Codex CLI, OpenCode, Cursor, or any SKILL.md-compatible assistant
```

**Step 2: Commit**

```bash
git add README.md
git commit -m "docs(readme): update positioning to LLM-agnostic"
```

---

### Task 11: Manifests and package config

**Files:**
- Modify: `.claude-plugin/marketplace.json`
- Modify: `packages/create-metapowers/package.json`

**Step 1: Update marketplace.json**

Line 7:
```json
// OLD
"description": "Metaprompting plugins for Claude Code — structured workflows for design, coding, research, and more"
// NEW
"description": "Metaprompting plugins for AI coding assistants — structured workflows for design, coding, research, and more"
```

**Step 2: Update create-metapowers/package.json keywords**

```json
// OLD
"keywords": [
  "metapowers",
  "claude-code",
  ...
]
// NEW
"keywords": [
  "metapowers",
  "llm",
  "ai-coding",
  "claude-code",
  ...
]
```

Add "llm" and "ai-coding" at positions 2 and 3, keep "claude-code" for discoverability.

**Step 3: Commit**

```bash
git add .claude-plugin/marketplace.json packages/create-metapowers/package.json
git commit -m "chore: update manifests and keywords to LLM-agnostic"
```

---

### Task 12: Source code — scoring harness

**Files:**
- Modify: `packages/scoring-harness/src/runner.ts`

**Step 1: Apply copy change**

Line 6:
```ts
// OLD
return `You are scoring a Claude Code skill.
// NEW
return `You are scoring a skill.
```

**Step 2: Commit**

```bash
git add packages/scoring-harness/src/runner.ts
git commit -m "chore(scoring): remove Claude Code reference from scoring prompt"
```

---

### Task 13: Skill files — find-skill

**Files:**
- Modify: `plugins/metapowers/skills/find-skill/SKILL.md`

**Step 1: Apply copy change**

Line 21:
```md
// OLD
- Search terms: "$ARGUMENTS SKILL.md", "$ARGUMENTS claude code skill", "$ARGUMENTS AI coding skill"
// NEW
- Search terms: "$ARGUMENTS SKILL.md", "$ARGUMENTS AI coding skill", "$ARGUMENTS LLM skill"
```

**Step 2: Commit**

```bash
git add plugins/metapowers/skills/find-skill/SKILL.md
git commit -m "chore(skills): update find-skill search terms to LLM-agnostic"
```

---

### Task 14: Final build verification

**Step 1: Run full build**

```bash
npx turbo build --filter=@metapowers/docs
```

Expected: Build succeeds with 0 errors.

**Step 2: Grep for remaining "Claude Code" references (excluding plan docs and git history)**

```bash
rg "Claude Code" --type md --type mdx --type ts --type tsx --type json \
  --glob '!docs/plans/*' --glob '!node_modules/*' --glob '!.git/*' \
  --glob '!CHANGELOG.md'
```

Expected: Only contextually-correct references remain (installation section headers, tool-specific instructions in companion-tools, create-metapowers CLI output).

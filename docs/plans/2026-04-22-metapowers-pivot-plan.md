# Metapowers Pivot Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Port the designpowers repo to Metapowers — rename everything, switch pnpm to Bun, restructure plugins, verify all 19 tests pass.

**Architecture:** This is a rename-and-restructure, not a rewrite. The TS packages (skill-validator, scoring-harness) keep their logic. The design plugin moves from `plugins/design-thinking/` to `plugins/design/` with updated artifact paths (`.dt/` → `.design/`). Bun replaces pnpm. GitHub org setup is manual/separate.

**Tech Stack:** Bun, Turborepo, TypeScript 5.x, vitest, Biome

---

## Task 1: Switch from pnpm to Bun

**Files:**
- Modify: `package.json`
- Delete: `pnpm-workspace.yaml`
- Delete: `pnpm-lock.yaml`

**Step 1: Update root `package.json`**

Replace the current content with:

```json
{
  "name": "metapowers",
  "private": true,
  "workspaces": ["packages/*"],
  "scripts": {
    "build": "turbo run build",
    "test": "turbo run test",
    "lint": "turbo run lint",
    "lint:skills": "turbo run lint:skills",
    "score": "turbo run score",
    "check": "biome check .",
    "format": "biome format --write ."
  },
  "devDependencies": {
    "@biomejs/biome": "^1.9.0",
    "turbo": "^2.4.0",
    "typescript": "^5.7.0"
  }
}
```

Note: removed `"packageManager": "pnpm@9.15.4"`, added `"workspaces"`, changed name to `metapowers`.

**Step 2: Delete pnpm files**

```bash
rm pnpm-workspace.yaml pnpm-lock.yaml
```

**Step 3: Delete node_modules and reinstall with Bun**

```bash
rm -rf node_modules packages/*/node_modules packages/*/dist .turbo
bun install
```

Expected: `bun.lock` created, all packages resolved.

**Step 4: Verify build and tests work with Bun**

```bash
bun run build && bun run test
```

Expected: 19 tests pass across both packages.

**Step 5: Commit**

```bash
git add -A
git commit -m "chore: switch from pnpm to Bun workspaces

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

## Task 2: Rename Package Scope

**Files:**
- Modify: `packages/skill-validator/package.json`
- Modify: `packages/scoring-harness/package.json`

**Step 1: Update skill-validator package name**

In `packages/skill-validator/package.json`, change:
```
"name": "@designpowers/skill-validator"
```
to:
```
"name": "@metapowers/skill-validator"
```

**Step 2: Update scoring-harness package name**

In `packages/scoring-harness/package.json`, change:
```
"name": "@designpowers/scoring-harness"
```
to:
```
"name": "@metapowers/scoring-harness"
```

**Step 3: Reinstall to update lockfile**

```bash
bun install
```

**Step 4: Verify tests still pass**

```bash
bun run build && bun run test
```

Expected: 19 tests pass.

**Step 5: Commit**

```bash
git add -A
git commit -m "chore: rename package scope from @designpowers to @metapowers

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

## Task 3: Restructure Design Plugin

**Files:**
- Move: `plugins/design-thinking/` → `plugins/design/`
- Delete: `plugins/double-diamond/`
- Move: `fixtures/design-thinking/` → `fixtures/design/`

**Step 1: Move the design-thinking plugin to design**

```bash
mv plugins/design-thinking plugins/design
```

**Step 2: Delete double-diamond placeholder**

```bash
rm -rf plugins/double-diamond
```

**Step 3: Move fixtures**

```bash
mv fixtures/design-thinking fixtures/design
```

**Step 4: Verify skill-validator finds the skill in new location**

```bash
bun run build && bun run lint:skills
```

Expected: PASS for `plugins/design/skills/define-component/SKILL.md`

**Step 5: Commit**

```bash
git add -A
git commit -m "refactor: rename design-thinking to design, remove double-diamond placeholder

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

## Task 4: Update Plugin Manifests

**Files:**
- Modify: `.claude-plugin/marketplace.json`
- Modify: `plugins/design/.claude-plugin/plugin.json`
- Modify: `plugins/design/.mcp.json` (verify, likely no change needed)

**Step 1: Rewrite marketplace.json**

Replace `.claude-plugin/marketplace.json` with:

```json
{
  "name": "metapowers",
  "owner": {
    "name": "Jonas Broms"
  },
  "metadata": {
    "description": "Metaprompting plugins for Claude Code — structured workflows for design, coding, research, and more",
    "version": "0.1.0",
    "pluginRoot": "./plugins"
  },
  "plugins": [
    {
      "name": "design",
      "source": "./plugins/design",
      "description": "Five-phase design thinking process for component design, writing to Figma canvas via MCP",
      "version": "0.1.0",
      "keywords": ["design", "figma", "components", "design-thinking", "ux"],
      "category": "design"
    }
  ]
}
```

**Step 2: Rewrite design plugin.json**

Replace `plugins/design/.claude-plugin/plugin.json` with:

```json
{
  "name": "design",
  "version": "0.1.0",
  "description": "Five-phase design thinking process for component design, writing to Figma canvas via MCP",
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

**Step 3: Commit**

```bash
git add -A
git commit -m "chore: update marketplace and plugin manifests for metapowers

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

## Task 5: Update SKILL.md Artifact Paths

**Files:**
- Modify: `plugins/design/skills/define-component/SKILL.md`

**Step 1: Update all `.dt/` references to `.design/`**

In `plugins/design/skills/define-component/SKILL.md`, make these replacements:

- `.dt/$ARGUMENTS/` → `.design/$ARGUMENTS/` (all occurrences)
- `/dt:empathize` → `/design:empathize`
- `plugins/design-thinking/shared/` → `plugins/design/shared/` (all occurrences)

The full updated SKILL.md should have:

```markdown
---
description: Define a component contract with props, variants, states, tokens, and accessibility criteria for design-system-quality components
---

# Define Component

Produce a complete component contract for "$ARGUMENTS" that serves as the single source of truth for prototyping, implementation, and testing.

## Prerequisites

Read `.design/$ARGUMENTS/01-empathize.md`. If this file does not exist, tell the user:

> Phase 1 (Empathize) has not been completed for "$ARGUMENTS". Run `/design:empathize $ARGUMENTS` first, or use `--skip-checks` to bypass.

If `--skip-checks` is present in $ARGUMENTS, skip this check and log to `.design/$ARGUMENTS/skip-log.md`.

## Process

1. **Read context files:**
   - Read `plugins/design/shared/component-contract-template.md` for the output structure
   - Read `plugins/design/shared/wcag-criteria.md` for accessibility requirements
   - Read `.design/$ARGUMENTS/01-empathize.md` for user needs and existing patterns (if exists)

2. **Read the design system** via Figma MCP `get_design_context`:
   - Existing components that overlap with this one
   - Available design tokens (colors, spacing, typography, radii)
   - Established patterns and conventions

3. **Produce the component contract** following the template structure. Every field must be filled — no placeholders, no TBDs. Specifically:
   - **Props:** Complete with TypeScript types. Every prop has a default value rationale.
   - **Variant matrix:** Enumerate all dimensions. Calculate total combinations. Flag any combinations that should be excluded and explain why.
   - **States:** All of: default, hover, focus, active, disabled, error, loading. For each state, specify visual changes (which tokens change) and ARIA updates.
   - **Token references:** Use only tokens from the design system. Never use raw color values, pixel values, or hardcoded strings. If a needed token doesn't exist, flag it as "MISSING TOKEN: [description]".
   - **Accessibility:** Map each WCAG criterion from the reference file. Specify keyboard interaction model, ARIA role, all ARIA attributes, focus management strategy.
   - **i18n:** Identify all translatable strings. Specify RTL behavior. State content expansion allowance (typically 30-50% for Western to CJK).

4. **Self-review the contract:**
   - Does every variant x state combination have defined token references?
   - Are there any raw values instead of tokens?
   - Is every interactive state keyboard-accessible?
   - Are ARIA attributes specified for every state change?

5. **Write the artifact** to `.design/$ARGUMENTS/02-define.md`

## Output

The component contract written to `.design/$ARGUMENTS/02-define.md`. Present a summary to the user highlighting:
- Total variant combinations
- Any missing tokens flagged
- Key accessibility decisions that need validation
```

**Step 2: Verify skill still passes validation**

```bash
bun run lint:skills
```

Expected: PASS

**Step 3: Commit**

```bash
git add -A
git commit -m "refactor: update SKILL.md paths from .dt to .design, dt: to design:

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

## Task 6: Update Hook Script

**Files:**
- Modify: `plugins/design/hooks/check-define-exists.sh`

**Step 1: Update the hook script**

Replace `plugins/design/hooks/check-define-exists.sh` with:

```bash
#!/usr/bin/env bash
set -euo pipefail

# Allow bypass via env var
if [[ "${DESIGN_SKIP_CHECKS:-}" == "1" ]]; then
  exit 0
fi

# Try to find .design/<name>/ directories to infer current component
COMPONENT_DIR=$(find .design -mindepth 1 -maxdepth 1 -type d 2>/dev/null | head -1)

if [[ -z "$COMPONENT_DIR" ]]; then
  echo "BLOCKED: No .design/ directory found. Run /design:empathize and /design:define first." >&2
  exit 1
fi

COMPONENT=$(basename "$COMPONENT_DIR")
DEFINE_FILE=".design/${COMPONENT}/02-define.md"

if [[ ! -f "$DEFINE_FILE" ]]; then
  echo "BLOCKED: ${DEFINE_FILE} not found." >&2
  echo "" >&2
  echo "The component contract must be defined before writing to Figma." >&2
  echo "Run: /design:define ${COMPONENT}" >&2
  echo "" >&2
  echo "To bypass: export DESIGN_SKIP_CHECKS=1" >&2
  exit 1
fi

exit 0
```

Changes: `.dt/` → `.design/`, `DT_SKIP_CHECKS` → `DESIGN_SKIP_CHECKS`, `/dt:` → `/design:`.

**Step 2: Ensure it's still executable**

```bash
chmod +x plugins/design/hooks/check-define-exists.sh
```

**Step 3: Commit**

```bash
git add -A
git commit -m "refactor: update hook script for .design/ paths and DESIGN_SKIP_CHECKS env var

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

## Task 7: Update .gitignore and biome.json

**Files:**
- Modify: `.gitignore`
- Modify: `biome.json`

**Step 1: Update `.gitignore`**

Replace content with:

```
node_modules/
dist/
.turbo/
*.tsbuildinfo
```

Note: No pnpm references. The `.design/` and other domain artifact directories are committed by users in their own projects, not in the plugin repo.

**Step 2: Update `biome.json`**

In `biome.json`, change the files.ignore entry from `"**/.dt/**", "**/.dd/**"` to `"**/.design/**"`:

```json
{
  "$schema": "https://biomejs.dev/schemas/1.9.0/schema.json",
  "organizeImports": { "enabled": true },
  "linter": {
    "enabled": true,
    "rules": { "recommended": true }
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "tab",
    "lineWidth": 100
  },
  "files": {
    "ignore": ["**/dist/**", "**/node_modules/**", "**/.design/**"]
  }
}
```

**Step 3: Commit**

```bash
git add -A
git commit -m "chore: update .gitignore and biome.json for metapowers naming

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

## Task 8: Update Git Remote

**Files:** None (git config only)

**Step 1: Update the remote URL**

```bash
git remote set-url origin https://github.com/bromso/metapowers.git
```

**Step 2: Verify**

```bash
git remote -v
```

Expected:
```
origin	https://github.com/bromso/metapowers.git (fetch)
origin	https://github.com/bromso/metapowers.git (push)
```

Note: The push will fail until the user creates the GitHub org and repo. This just updates the local config.

**Step 3: Commit** (no file changes, just verify remote is set)

No commit needed — this is a git config change, not a file change.

---

## Task 9: Final Verification

**Step 1: Clean build from scratch**

```bash
rm -rf node_modules packages/*/node_modules packages/*/dist .turbo && bun install && bun run build && bun run test
```

Expected: 19 tests pass from clean state.

**Step 2: Run skill validator**

```bash
bun run lint:skills
```

Expected: PASS for `plugins/design/skills/define-component/SKILL.md`

**Step 3: Verify no stale references remain**

```bash
grep -r "designpowers" --include='*.json' --include='*.ts' --include='*.md' --include='*.yaml' --include='*.sh' . | grep -v node_modules | grep -v dist | grep -v .turbo | grep -v .git | grep -v docs/plans/
```

Expected: No matches (docs/plans/ excluded because they're historical records).

**Step 4: Verify no stale `.dt/` or `design-thinking` references in live files**

```bash
grep -r '\.dt/' --include='*.md' --include='*.sh' --include='*.json' --include='*.ts' . | grep -v node_modules | grep -v dist | grep -v docs/plans/
```

Expected: No matches.

**Step 5: Show final file tree**

```bash
find . -not -path '*/node_modules/*' -not -path '*/.turbo/*' -not -path '*/dist/*' -not -path '*/.git/*' -not -name '.DS_Store' -type f | sort
```

**Step 6: Commit if any fixes were needed**

```bash
git add -A
git commit -m "chore: final metapowers pivot verification

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

## Summary

After completing all 9 tasks, the repo is fully ported:

- **Name:** metapowers (was designpowers)
- **Package manager:** Bun (was pnpm)
- **Package scope:** `@metapowers/*` (was `@designpowers/*`)
- **Plugin:** `plugins/design/` (was `plugins/design-thinking/`)
- **Artifacts:** `.design/` (was `.dt/`)
- **Commands:** `/design:*` (was `/dt:*`)
- **Hook env var:** `DESIGN_SKIP_CHECKS` (was `DT_SKIP_CHECKS`)
- **GitHub remote:** `bromso/metapowers` (was `bromso/designpowers`)
- **Tests:** 19 passing
- **double-diamond:** removed (will return as separate domain plugin)

**Manual step remaining:** User must create `metapowers` GitHub org and `metapowers` repo, then push.

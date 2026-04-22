# M1 Implementation Plan: Scaffold + Validator + Scoring Harness + First Skill

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Ship the monorepo scaffold, skill-validator, scoring-harness, and one end-to-end skill (`dt:define-component`) with a golden fixture and passing score — proving the full quality loop before building breadth.

**Architecture:** Turborepo monorepo with pnpm workspaces. Three TS packages (`skill-validator`, `scoring-harness`, `mcp-contrast-checker` deferred to M4). Two plugin directories (only `design-thinking` populated in M1). Skills are markdown, tooling is TypeScript with vitest.

**Tech Stack:** TypeScript 5.x, pnpm, Turborepo, vitest, Biome (lint+format), Node 20+

---

## Task 1: Root Monorepo Scaffold

**Files:**
- Create: `package.json`
- Create: `pnpm-workspace.yaml`
- Create: `turbo.json`
- Create: `tsconfig.base.json`
- Create: `biome.json`
- Create: `.gitignore`
- Create: `.node-version`

**Step 1: Create root `package.json`**

```json
{
  "name": "designpowers",
  "private": true,
  "packageManager": "pnpm@9.15.4",
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

**Step 2: Create `pnpm-workspace.yaml`**

```yaml
packages:
  - "packages/*"
```

**Step 3: Create `turbo.json`**

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "test": {
      "dependsOn": ["build"],
      "cache": false
    },
    "lint": {
      "dependsOn": ["^build"]
    },
    "lint:skills": {
      "cache": true,
      "inputs": ["../../plugins/**/skills/**/SKILL.md"]
    },
    "score": {
      "dependsOn": ["build"],
      "cache": true,
      "inputs": [
        "../../plugins/**/skills/**/SKILL.md",
        "../../fixtures/**"
      ]
    }
  }
}
```

**Step 4: Create `tsconfig.base.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "Node16",
    "moduleResolution": "Node16",
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "dist",
    "rootDir": "src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true
  }
}
```

**Step 5: Create `biome.json`**

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
    "ignore": ["**/dist/**", "**/node_modules/**", "**/.dt/**", "**/.dd/**"]
  }
}
```

**Step 6: Create `.gitignore`**

```
node_modules/
dist/
.turbo/
*.tsbuildinfo

# Phase artifacts (committed per-project, not in the plugin repo)
# .dt/
# .dd/
```

**Step 7: Create `.node-version`**

```
20
```

**Step 8: Install dependencies**

Run: `pnpm install`
Expected: lockfile created, node_modules populated

**Step 9: Commit**

```bash
git add -A
git commit -m "chore: scaffold turborepo monorepo with pnpm workspaces"
```

---

## Task 2: Plugin Structure — Design Thinking

**Files:**
- Create: `.claude-plugin/marketplace.json`
- Create: `plugins/design-thinking/.claude-plugin/plugin.json`
- Create: `plugins/design-thinking/.mcp.json`
- Create: `plugins/double-diamond/.claude-plugin/plugin.json` (placeholder)

**Step 1: Create marketplace manifest**

Create `.claude-plugin/marketplace.json`:

```json
{
  "name": "designpowers",
  "owner": {
    "name": "Jonas Broms",
    "email": "jonas@designpowers.com"
  },
  "metadata": {
    "description": "Design methodology plugins for Claude Code — structured design thinking and research workflows backed by Figma MCP",
    "version": "0.1.0",
    "pluginRoot": "./plugins"
  },
  "plugins": [
    {
      "name": "design-thinking",
      "source": "./plugins/design-thinking",
      "description": "Five-phase design thinking process for component design, writing to Figma canvas via MCP",
      "version": "0.1.0",
      "keywords": ["design", "figma", "components", "design-thinking", "ux"],
      "category": "design"
    },
    {
      "name": "double-diamond",
      "source": "./plugins/double-diamond",
      "description": "Double diamond research and problem-definition process, writing to FigJam via MCP",
      "version": "0.1.0",
      "keywords": ["research", "figma", "figjam", "double-diamond", "ux-research"],
      "category": "design"
    }
  ]
}
```

**Step 2: Create design-thinking plugin manifest**

Create `plugins/design-thinking/.claude-plugin/plugin.json`:

```json
{
  "name": "design-thinking",
  "version": "0.1.0",
  "description": "Five-phase design thinking process for component design, writing to Figma canvas via MCP",
  "author": {
    "name": "Jonas Broms"
  },
  "repository": "https://github.com/bromso/designpowers",
  "license": "MIT",
  "skills": "../skills/",
  "commands": "../commands/",
  "agents": "../agents/",
  "hooks": "../hooks/hooks.json",
  "mcpServers": "../.mcp.json"
}
```

**Step 3: Create MCP config for design-thinking**

Create `plugins/design-thinking/.mcp.json`:

```json
{
  "mcpServers": {
    "figma": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/figma-mcp"],
      "env": {
        "FIGMA_ACCESS_TOKEN": "${FIGMA_ACCESS_TOKEN}"
      }
    }
  }
}
```

Note: The exact Figma MCP package name may need updating when you configure auth. This is a placeholder that gets the structure right.

**Step 4: Create double-diamond placeholder**

Create `plugins/double-diamond/.claude-plugin/plugin.json`:

```json
{
  "name": "double-diamond",
  "version": "0.1.0",
  "description": "Double diamond research and problem-definition process, writing to FigJam via MCP",
  "author": {
    "name": "Jonas Broms"
  },
  "repository": "https://github.com/bromso/designpowers",
  "license": "MIT"
}
```

**Step 5: Commit**

```bash
git add -A
git commit -m "chore: add plugin manifests and marketplace config"
```

---

## Task 3: Shared Reference Files

**Files:**
- Create: `plugins/design-thinking/shared/wcag-criteria.md`
- Create: `plugins/design-thinking/shared/component-contract-template.md`

**Step 1: Create WCAG criteria reference**

Create `plugins/design-thinking/shared/wcag-criteria.md`:

```markdown
# WCAG 2.1 Criteria for Component Design

## Color Contrast
- **AA Normal text (< 18pt):** 4.5:1 minimum
- **AA Large text (>= 18pt or 14pt bold):** 3:1 minimum
- **AAA Normal text:** 7:1 minimum
- **AAA Large text:** 4.5:1 minimum

## Non-text Contrast (AA)
- UI components and graphical objects: 3:1 against adjacent colors
- Focus indicators: 3:1 against adjacent non-focused state

## Interaction
- **Keyboard:** All functionality available via keyboard (2.1.1)
- **Focus visible:** Focus indicator visible on all interactive elements (2.4.7)
- **Focus order:** Logical tab order matching visual layout (2.4.3)
- **Target size:** Interactive targets minimum 24x24 CSS pixels (2.5.8, AA)

## Content
- **Text alternatives:** Non-text content has text alternatives (1.1.1)
- **Meaningful sequence:** Reading order matches visual order (1.3.2)
- **Resize text:** Content readable at 200% zoom without loss (1.4.4)
- **Reflow:** No horizontal scrolling at 320px viewport width (1.4.10)

## State Communication
- **Error identification:** Errors identified and described in text (3.3.1)
- **Labels:** Input fields have visible labels (3.3.2)
- **Status messages:** Status changes communicated to assistive tech via aria-live (4.1.3)

## Motion
- **Reduced motion:** Respect `prefers-reduced-motion` for animations (2.3.3)
```

**Step 2: Create component contract template**

Create `plugins/design-thinking/shared/component-contract-template.md`:

```markdown
# Component Contract: [Component Name]

## Purpose
[One sentence: what problem this component solves for the user]

## Props
| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| | | | | |

## Variant Matrix
| Dimension | Values |
|-----------|--------|
| Size | sm, md, lg |
| Style | primary, secondary, ghost |
| State | default, hover, focus, active, disabled, error, loading |

Total combinations: [size x style x state]

## Slots / Composition
- [Named slots or children composition points]

## Token References
| Usage | Token | Fallback |
|-------|-------|----------|
| Background | `color.bg.[variant]` | — |
| Text | `color.text.[variant]` | — |
| Border | `color.border.[variant]` | — |
| Spacing | `spacing.[size]` | — |
| Border radius | `radius.[size]` | — |
| Typography | `type.[scale]` | — |

## Accessibility
- Keyboard interaction: [describe]
- ARIA role: [role]
- ARIA attributes: [list]
- Focus management: [describe]
- Screen reader announcement: [describe]

## i18n Considerations
- [Translatable strings]
- [RTL layout behavior]
- [Content expansion allowance]
```

**Step 3: Commit**

```bash
git add -A
git commit -m "chore: add shared WCAG criteria and component contract template"
```

---

## Task 4: The `define-component` Skill

**Files:**
- Create: `plugins/design-thinking/skills/define-component/SKILL.md`

**Step 1: Write the SKILL.md**

Create `plugins/design-thinking/skills/define-component/SKILL.md`:

```markdown
---
description: Define a component contract with props, variants, states, tokens, and accessibility criteria for design-system-quality components
---

# Define Component

Produce a complete component contract for "$ARGUMENTS" that serves as the single source of truth for prototyping, implementation, and testing.

## Prerequisites

Read `.dt/$ARGUMENTS/01-empathize.md`. If this file does not exist, tell the user:

> Phase 1 (Empathize) has not been completed for "$ARGUMENTS". Run `/dt:empathize $ARGUMENTS` first, or use `--skip-checks` to bypass.

If `--skip-checks` is present in $ARGUMENTS, skip this check and log to `.dt/$ARGUMENTS/skip-log.md`.

## Process

1. **Read context files:**
   - Read `plugins/design-thinking/shared/component-contract-template.md` for the output structure
   - Read `plugins/design-thinking/shared/wcag-criteria.md` for accessibility requirements
   - Read `.dt/$ARGUMENTS/01-empathize.md` for user needs and existing patterns (if exists)

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

5. **Write the artifact** to `.dt/$ARGUMENTS/02-define.md`

## Output

The component contract written to `.dt/$ARGUMENTS/02-define.md`. Present a summary to the user highlighting:
- Total variant combinations
- Any missing tokens flagged
- Key accessibility decisions that need validation
```

**Step 2: Commit**

```bash
git add -A
git commit -m "feat: add define-component skill for design thinking plugin"
```

---

## Task 5: Golden Fixture

**Files:**
- Create: `fixtures/design-thinking/button-brief.md`
- Create: `fixtures/design-thinking/expected/button-define-sections.json`

**Step 1: Create the button brief fixture**

Create `fixtures/design-thinking/button-brief.md`:

```markdown
# Button Component Brief

## Context
Design system for a B2B SaaS product. The design system uses Tailwind-based tokens. The product supports English, German, Japanese, and Arabic (RTL).

## User Need
Users need a consistent, accessible button component that works across the product for primary actions, secondary actions, and destructive actions.

## Existing Patterns
- Currently using unstyled HTML buttons with inline styles
- No existing button component in the design system
- Icons are used inline with text in some buttons

## Design System Tokens Available
- Colors: `color.bg.primary`, `color.bg.secondary`, `color.bg.destructive`, `color.bg.ghost`, `color.text.on-primary`, `color.text.on-secondary`, `color.text.default`, `color.border.default`, `color.border.focus`
- Spacing: `spacing.xs`, `spacing.sm`, `spacing.md`, `spacing.lg`
- Typography: `type.label.sm`, `type.label.md`, `type.label.lg`
- Radii: `radius.sm`, `radius.md`, `radius.full`
- Shadows: `shadow.focus-ring`

## Accessibility Requirements
- WCAG 2.1 AA compliance
- Full keyboard navigation
- Screen reader support
- Reduced motion support
```

**Step 2: Create expected sections rubric**

Create `fixtures/design-thinking/expected/button-define-sections.json`:

```json
{
  "skill": "define-component",
  "fixture": "button-brief.md",
  "rubric": {
    "has_purpose": {
      "description": "Contract includes a Purpose section with one-sentence problem statement",
      "weight": 1,
      "check": "section_exists",
      "pattern": "## Purpose"
    },
    "has_props_table": {
      "description": "Contract includes a Props table with Type and Default columns",
      "weight": 2,
      "check": "section_contains",
      "section": "## Props",
      "patterns": ["Type", "Default", "Required"]
    },
    "has_variant_matrix": {
      "description": "Contract includes a Variant Matrix with Size, Style, and State dimensions",
      "weight": 3,
      "check": "section_contains",
      "section": "## Variant Matrix",
      "patterns": ["Size", "Style", "State"]
    },
    "has_all_states": {
      "description": "Contract covers all required states",
      "weight": 3,
      "check": "content_contains_all",
      "patterns": ["default", "hover", "focus", "active", "disabled", "error", "loading"]
    },
    "has_token_references": {
      "description": "Contract uses token references, not raw values",
      "weight": 3,
      "check": "section_exists",
      "pattern": "## Token References"
    },
    "no_raw_colors": {
      "description": "Contract does not contain raw hex or rgb color values",
      "weight": 3,
      "check": "content_excludes",
      "patterns": ["#[0-9a-fA-F]{3,8}", "rgb\\(", "rgba\\(", "hsl\\("]
    },
    "has_accessibility": {
      "description": "Contract includes Accessibility section with ARIA and keyboard details",
      "weight": 3,
      "check": "section_contains",
      "section": "## Accessibility",
      "patterns": ["ARIA", "keyboard", "focus"]
    },
    "has_i18n": {
      "description": "Contract includes i18n section with RTL and expansion considerations",
      "weight": 2,
      "check": "section_contains",
      "section": "## i18n",
      "patterns": ["RTL", "expansion"]
    },
    "total_combinations_stated": {
      "description": "Contract explicitly states the total number of variant combinations",
      "weight": 1,
      "check": "content_contains_any",
      "patterns": ["Total combinations", "total combinations"]
    }
  }
}
```

**Step 3: Commit**

```bash
git add -A
git commit -m "feat: add button golden fixture and scoring rubric for define-component"
```

---

## Task 6: Skill Validator Package — Setup

**Files:**
- Create: `packages/skill-validator/package.json`
- Create: `packages/skill-validator/tsconfig.json`
- Create: `packages/skill-validator/vitest.config.ts`

**Step 1: Create `packages/skill-validator/package.json`**

```json
{
  "name": "@designpowers/skill-validator",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "test": "vitest run",
    "test:watch": "vitest",
    "lint:skills": "node dist/cli.js ../../plugins"
  },
  "dependencies": {
    "gray-matter": "^4.0.3",
    "glob": "^11.0.0"
  },
  "devDependencies": {
    "vitest": "^3.0.0"
  }
}
```

**Step 2: Create `packages/skill-validator/tsconfig.json`**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src"]
}
```

**Step 3: Create `packages/skill-validator/vitest.config.ts`**

```typescript
import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		include: ["src/**/*.test.ts"],
	},
});
```

**Step 4: Commit**

```bash
git add -A
git commit -m "chore: scaffold skill-validator package"
```

---

## Task 7: Skill Validator — Core Logic (TDD)

**Files:**
- Create: `packages/skill-validator/src/parse-skill.ts`
- Create: `packages/skill-validator/src/parse-skill.test.ts`
- Create: `packages/skill-validator/src/rules.ts`
- Create: `packages/skill-validator/src/rules.test.ts`
- Create: `packages/skill-validator/src/index.ts`

**Step 1: Write the failing test for `parseSkill`**

Create `packages/skill-validator/src/parse-skill.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import { parseSkill } from "./parse-skill.js";

describe("parseSkill", () => {
	it("parses valid SKILL.md with frontmatter", () => {
		const input = `---
description: Do something useful when the user asks
---

# Skill Title

Body content here.`;

		const result = parseSkill(input, "test/SKILL.md");
		expect(result.frontmatter.description).toBe("Do something useful when the user asks");
		expect(result.body).toContain("# Skill Title");
		expect(result.filePath).toBe("test/SKILL.md");
		expect(result.sections).toContain("# Skill Title");
	});

	it("extracts all markdown sections", () => {
		const input = `---
description: Test skill
---

# Title

## Section One

Content one.

## Section Two

Content two.`;

		const result = parseSkill(input, "test/SKILL.md");
		expect(result.sections).toEqual(["# Title", "## Section One", "## Section Two"]);
	});

	it("returns error for missing frontmatter", () => {
		const input = "# No frontmatter\n\nJust body.";
		const result = parseSkill(input, "test/SKILL.md");
		expect(result.errors).toContain("Missing frontmatter");
	});
});
```

**Step 2: Run test to verify it fails**

Run: `cd packages/skill-validator && npx vitest run src/parse-skill.test.ts`
Expected: FAIL — module not found

**Step 3: Implement `parseSkill`**

Create `packages/skill-validator/src/parse-skill.ts`:

```typescript
import matter from "gray-matter";

export interface ParsedSkill {
	filePath: string;
	frontmatter: Record<string, unknown>;
	body: string;
	sections: string[];
	errors: string[];
}

export function parseSkill(content: string, filePath: string): ParsedSkill {
	const errors: string[] = [];

	let frontmatter: Record<string, unknown> = {};
	let body = content;

	try {
		const parsed = matter(content);
		if (Object.keys(parsed.data).length === 0 && !content.startsWith("---")) {
			errors.push("Missing frontmatter");
		} else {
			frontmatter = parsed.data;
		}
		body = parsed.content;
	} catch {
		errors.push("Missing frontmatter");
	}

	const sections = Array.from(body.matchAll(/^(#{1,3}\s+.+)$/gm)).map((m) => m[1]);

	return { filePath, frontmatter, body, sections, errors };
}
```

**Step 4: Run test to verify it passes**

Run: `cd packages/skill-validator && npx vitest run src/parse-skill.test.ts`
Expected: PASS (3 tests)

**Step 5: Write the failing test for validation rules**

Create `packages/skill-validator/src/rules.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import { validateSkill, type ValidationResult } from "./rules.js";
import { parseSkill } from "./parse-skill.js";

function validate(content: string): ValidationResult {
	const parsed = parseSkill(content, "test/SKILL.md");
	return validateSkill(parsed);
}

describe("validateSkill", () => {
	const validSkill = `---
description: Define a component contract with props, variants, and states
---

# Define Component

Body content with instructions.

## Prerequisites

Check for prior artifacts.

## Process

Steps to follow.

## Output

What gets produced.`;

	it("passes for a valid skill", () => {
		const result = validate(validSkill);
		expect(result.pass).toBe(true);
		expect(result.errors).toHaveLength(0);
	});

	it("fails when description is missing", () => {
		const input = `---
name: test
---

# Title

Body.`;
		const result = validate(input);
		expect(result.pass).toBe(false);
		expect(result.errors).toContainEqual(
			expect.objectContaining({ rule: "description-required" })
		);
	});

	it("fails when description exceeds 200 chars", () => {
		const input = `---
description: ${"a".repeat(201)}
---

# Title

Body.`;
		const result = validate(input);
		expect(result.pass).toBe(false);
		expect(result.errors).toContainEqual(
			expect.objectContaining({ rule: "description-max-length" })
		);
	});

	it("fails when description does not start with a verb", () => {
		const input = `---
description: The component contract builder
---

# Title

Body.`;
		const result = validate(input);
		expect(result.pass).toBe(false);
		expect(result.errors).toContainEqual(
			expect.objectContaining({ rule: "description-starts-with-verb" })
		);
	});

	it("warns when body exceeds 2000 words", () => {
		const longBody = `---
description: Do something useful
---

# Title

${"word ".repeat(2001)}`;
		const result = validate(longBody);
		expect(result.warnings).toContainEqual(
			expect.objectContaining({ rule: "body-max-words" })
		);
	});
});
```

**Step 6: Run test to verify it fails**

Run: `cd packages/skill-validator && npx vitest run src/rules.test.ts`
Expected: FAIL — module not found

**Step 7: Implement validation rules**

Create `packages/skill-validator/src/rules.ts`:

```typescript
import type { ParsedSkill } from "./parse-skill.js";

export interface ValidationIssue {
	rule: string;
	message: string;
	severity: "error" | "warning";
}

export interface ValidationResult {
	pass: boolean;
	errors: ValidationIssue[];
	warnings: ValidationIssue[];
}

const COMMON_VERBS = new Set([
	"add", "analyze", "apply", "audit", "build", "calculate", "check", "clean",
	"configure", "convert", "create", "debug", "define", "delete", "deploy",
	"describe", "design", "detect", "discover", "display", "do", "enforce",
	"evaluate", "execute", "export", "extract", "fetch", "find", "fix",
	"format", "gather", "generate", "get", "greet", "guide", "handle",
	"identify", "implement", "import", "initialize", "inspect", "install",
	"invoke", "launch", "lint", "list", "load", "log", "manage", "map",
	"merge", "migrate", "monitor", "move", "notify", "open", "optimize",
	"orchestrate", "organize", "output", "parse", "perform", "plan", "post",
	"prepare", "present", "process", "produce", "prototype", "provide",
	"publish", "query", "read", "record", "refactor", "remove", "render",
	"replace", "report", "request", "resolve", "respond", "restore", "retrieve",
	"review", "run", "save", "scaffold", "scan", "schedule", "search", "send",
	"serve", "set", "show", "sort", "start", "stop", "store", "stream",
	"structure", "submit", "summarize", "sync", "synthesize", "test",
	"track", "transform", "translate", "trigger", "update", "upload",
	"validate", "verify", "view", "watch", "write",
]);

export function validateSkill(parsed: ParsedSkill): ValidationResult {
	const errors: ValidationIssue[] = [];
	const warnings: ValidationIssue[] = [];

	// Forward parse errors
	for (const err of parsed.errors) {
		errors.push({ rule: "parse-error", message: err, severity: "error" });
	}

	// description-required
	const desc = parsed.frontmatter.description;
	if (!desc || typeof desc !== "string" || desc.trim().length === 0) {
		errors.push({
			rule: "description-required",
			message: "Frontmatter must include a non-empty 'description' field",
			severity: "error",
		});
	} else {
		// description-max-length
		if (desc.length > 200) {
			errors.push({
				rule: "description-max-length",
				message: `Description is ${desc.length} chars (max 200)`,
				severity: "error",
			});
		}

		// description-starts-with-verb
		const firstWord = desc.trim().split(/\s+/)[0].toLowerCase();
		if (!COMMON_VERBS.has(firstWord)) {
			errors.push({
				rule: "description-starts-with-verb",
				message: `Description should start with a verb. "${firstWord}" is not in the recognized verb list`,
				severity: "error",
			});
		}
	}

	// body-max-words
	const wordCount = parsed.body.trim().split(/\s+/).length;
	if (wordCount > 2000) {
		warnings.push({
			rule: "body-max-words",
			message: `Skill body is ${wordCount} words (recommended max 2000)`,
			severity: "warning",
		});
	}

	return {
		pass: errors.length === 0,
		errors,
		warnings,
	};
}
```

**Step 8: Run test to verify it passes**

Run: `cd packages/skill-validator && npx vitest run src/rules.test.ts`
Expected: PASS (5 tests)

**Step 9: Create the index barrel**

Create `packages/skill-validator/src/index.ts`:

```typescript
export { parseSkill, type ParsedSkill } from "./parse-skill.js";
export { validateSkill, type ValidationResult, type ValidationIssue } from "./rules.js";
```

**Step 10: Commit**

```bash
git add -A
git commit -m "feat: implement skill-validator with parse and validation rules"
```

---

## Task 8: Skill Validator — CLI

**Files:**
- Create: `packages/skill-validator/src/cli.ts`
- Create: `packages/skill-validator/src/cli.test.ts`

**Step 1: Write the failing test for the CLI**

Create `packages/skill-validator/src/cli.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import { discoverSkills, runValidator } from "./cli.js";
import { join } from "node:path";
import { mkdirSync, writeFileSync, rmSync } from "node:fs";

const TMP = join(import.meta.dirname, "__test_fixtures__");

function setup(skills: Record<string, string>) {
	rmSync(TMP, { recursive: true, force: true });
	for (const [path, content] of Object.entries(skills)) {
		const full = join(TMP, path);
		mkdirSync(join(full, ".."), { recursive: true });
		writeFileSync(full, content);
	}
}

function teardown() {
	rmSync(TMP, { recursive: true, force: true });
}

describe("discoverSkills", () => {
	it("finds SKILL.md files recursively", () => {
		setup({
			"plugin-a/skills/foo/SKILL.md": "---\ndescription: Test\n---\n# Foo",
			"plugin-a/skills/bar/SKILL.md": "---\ndescription: Test\n---\n# Bar",
		});
		const files = discoverSkills(TMP);
		expect(files).toHaveLength(2);
		teardown();
	});
});

describe("runValidator", () => {
	it("returns exit code 0 for valid skills", () => {
		setup({
			"plugin-a/skills/foo/SKILL.md":
				"---\ndescription: Define a component contract\n---\n# Foo\n\nBody.",
		});
		const result = runValidator(TMP);
		expect(result.exitCode).toBe(0);
		teardown();
	});

	it("returns exit code 1 for invalid skills", () => {
		setup({
			"plugin-a/skills/foo/SKILL.md": "# No frontmatter\n\nBody.",
		});
		const result = runValidator(TMP);
		expect(result.exitCode).toBe(1);
		teardown();
	});
});
```

**Step 2: Run test to verify it fails**

Run: `cd packages/skill-validator && npx vitest run src/cli.test.ts`
Expected: FAIL — module not found

**Step 3: Implement the CLI**

Create `packages/skill-validator/src/cli.ts`:

```typescript
import { globSync } from "glob";
import { readFileSync } from "node:fs";
import { parseSkill } from "./parse-skill.js";
import { validateSkill, type ValidationResult } from "./rules.js";

export function discoverSkills(rootDir: string): string[] {
	return globSync("**/skills/*/SKILL.md", { cwd: rootDir, absolute: true });
}

export interface ValidatorRunResult {
	exitCode: number;
	results: Array<{ filePath: string; result: ValidationResult }>;
}

export function runValidator(rootDir: string): ValidatorRunResult {
	const files = discoverSkills(rootDir);
	const results: ValidatorRunResult["results"] = [];
	let hasErrors = false;

	for (const filePath of files) {
		const content = readFileSync(filePath, "utf-8");
		const parsed = parseSkill(content, filePath);
		const result = validateSkill(parsed);
		results.push({ filePath, result });
		if (!result.pass) hasErrors = true;
	}

	return { exitCode: hasErrors ? 1 : 0, results };
}

// CLI entry point
const args = process.argv.slice(2);
if (args.length > 0) {
	const rootDir = args[0];
	const { exitCode, results } = runValidator(rootDir);

	for (const { filePath, result } of results) {
		const icon = result.pass ? "PASS" : "FAIL";
		console.log(`${icon} ${filePath}`);
		for (const err of result.errors) {
			console.log(`  ERROR [${err.rule}]: ${err.message}`);
		}
		for (const warn of result.warnings) {
			console.log(`  WARN  [${warn.rule}]: ${warn.message}`);
		}
	}

	process.exit(exitCode);
}
```

**Step 4: Run test to verify it passes**

Run: `cd packages/skill-validator && npx vitest run src/cli.test.ts`
Expected: PASS (3 tests)

**Step 5: Build and validate against the real skill**

Run: `cd packages/skill-validator && pnpm build && node dist/cli.js ../../plugins`
Expected: `PASS` for `define-component/SKILL.md`

**Step 6: Commit**

```bash
git add -A
git commit -m "feat: add skill-validator CLI for linting SKILL.md files"
```

---

## Task 9: Scoring Harness Package — Setup

**Files:**
- Create: `packages/scoring-harness/package.json`
- Create: `packages/scoring-harness/tsconfig.json`
- Create: `packages/scoring-harness/vitest.config.ts`

**Step 1: Create `packages/scoring-harness/package.json`**

```json
{
  "name": "@designpowers/scoring-harness",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "test": "vitest run",
    "test:watch": "vitest",
    "score": "node dist/cli.js"
  },
  "dependencies": {
    "@anthropic-ai/sdk": "^0.39.0",
    "glob": "^11.0.0"
  },
  "devDependencies": {
    "vitest": "^3.0.0"
  }
}
```

**Step 2: Create `packages/scoring-harness/tsconfig.json`**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src"]
}
```

**Step 3: Create `packages/scoring-harness/vitest.config.ts`**

```typescript
import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		include: ["src/**/*.test.ts"],
	},
});
```

**Step 4: Commit**

```bash
git add -A
git commit -m "chore: scaffold scoring-harness package"
```

---

## Task 10: Scoring Harness — Rubric Scorer (TDD)

**Files:**
- Create: `packages/scoring-harness/src/rubric.ts`
- Create: `packages/scoring-harness/src/rubric.test.ts`

**Step 1: Write the failing test for rubric scoring**

Create `packages/scoring-harness/src/rubric.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import { scoreOutput, loadRubric, type Rubric } from "./rubric.js";

const sampleRubric: Rubric = {
	skill: "define-component",
	fixture: "button-brief.md",
	rubric: {
		has_purpose: {
			description: "Has a Purpose section",
			weight: 1,
			check: "section_exists",
			pattern: "## Purpose",
		},
		has_all_states: {
			description: "Covers all states",
			weight: 3,
			check: "content_contains_all",
			patterns: ["default", "hover", "focus", "disabled"],
		},
		no_raw_colors: {
			description: "No raw hex colors",
			weight: 3,
			check: "content_excludes",
			patterns: ["#[0-9a-fA-F]{3,8}"],
		},
	},
};

describe("scoreOutput", () => {
	it("scores a passing output", () => {
		const output = `## Purpose

A button for actions.

## States

Supports default, hover, focus, and disabled states.

Uses token color.bg.primary.`;

		const result = scoreOutput(output, sampleRubric);
		expect(result.score).toBe(1.0);
		expect(result.passed).toHaveLength(3);
		expect(result.failed).toHaveLength(0);
	});

	it("scores a partially passing output", () => {
		const output = `## Purpose

A button.

Only has default and hover.

Uses #ff0000 for the background.`;

		const result = scoreOutput(output, sampleRubric);
		expect(result.score).toBeLessThan(1.0);
		expect(result.score).toBeGreaterThan(0);
		expect(result.failed.length).toBeGreaterThan(0);
	});

	it("returns 0 for completely failing output", () => {
		const output = "Nothing useful here.";
		const result = scoreOutput(output, sampleRubric);
		expect(result.score).toBe(0);
	});
});

describe("loadRubric", () => {
	it("loads a rubric from a JSON file", () => {
		const rubric = loadRubric(
			new URL("../../../fixtures/design-thinking/expected/button-define-sections.json", import.meta.url).pathname
		);
		expect(rubric.skill).toBe("define-component");
		expect(Object.keys(rubric.rubric).length).toBeGreaterThan(0);
	});
});
```

**Step 2: Run test to verify it fails**

Run: `cd packages/scoring-harness && npx vitest run src/rubric.test.ts`
Expected: FAIL — module not found

**Step 3: Implement the rubric scorer**

Create `packages/scoring-harness/src/rubric.ts`:

```typescript
import { readFileSync } from "node:fs";

export interface RubricCheck {
	description: string;
	weight: number;
	check: "section_exists" | "section_contains" | "content_contains_all" | "content_contains_any" | "content_excludes";
	pattern?: string;
	patterns?: string[];
	section?: string;
}

export interface Rubric {
	skill: string;
	fixture: string;
	rubric: Record<string, RubricCheck>;
}

export interface CheckResult {
	name: string;
	description: string;
	passed: boolean;
	weight: number;
}

export interface ScoreResult {
	score: number;
	maxScore: number;
	earnedScore: number;
	passed: CheckResult[];
	failed: CheckResult[];
}

function runCheck(output: string, check: RubricCheck): boolean {
	switch (check.check) {
		case "section_exists":
			return output.includes(check.pattern!);

		case "section_contains": {
			const sectionIdx = output.indexOf(check.section!);
			if (sectionIdx === -1) return false;
			const sectionContent = output.slice(sectionIdx);
			return check.patterns!.every((p) => sectionContent.includes(p));
		}

		case "content_contains_all":
			return check.patterns!.every((p) => {
				const regex = new RegExp(p, "i");
				return regex.test(output);
			});

		case "content_contains_any":
			return check.patterns!.some((p) => {
				const regex = new RegExp(p, "i");
				return regex.test(output);
			});

		case "content_excludes":
			return check.patterns!.every((p) => {
				const regex = new RegExp(p, "gi");
				return !regex.test(output);
			});

		default:
			return false;
	}
}

export function scoreOutput(output: string, rubric: Rubric): ScoreResult {
	const passed: CheckResult[] = [];
	const failed: CheckResult[] = [];
	let maxScore = 0;
	let earnedScore = 0;

	for (const [name, check] of Object.entries(rubric.rubric)) {
		maxScore += check.weight;
		const didPass = runCheck(output, check);
		const result: CheckResult = {
			name,
			description: check.description,
			passed: didPass,
			weight: check.weight,
		};

		if (didPass) {
			earnedScore += check.weight;
			passed.push(result);
		} else {
			failed.push(result);
		}
	}

	return {
		score: maxScore > 0 ? earnedScore / maxScore : 0,
		maxScore,
		earnedScore,
		passed,
		failed,
	};
}

export function loadRubric(filePath: string): Rubric {
	const content = readFileSync(filePath, "utf-8");
	return JSON.parse(content) as Rubric;
}
```

**Step 4: Run test to verify it passes**

Run: `cd packages/scoring-harness && npx vitest run src/rubric.test.ts`
Expected: PASS (4 tests)

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: implement scoring-harness rubric scorer with check types"
```

---

## Task 11: Scoring Harness — Runner & Revision Comparison (TDD)

**Files:**
- Create: `packages/scoring-harness/src/runner.ts`
- Create: `packages/scoring-harness/src/runner.test.ts`
- Create: `packages/scoring-harness/src/compare.ts`
- Create: `packages/scoring-harness/src/compare.test.ts`
- Create: `packages/scoring-harness/src/index.ts`

**Step 1: Write the failing test for revision comparison**

Create `packages/scoring-harness/src/compare.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import { compareRevisions, type RevisionScore } from "./compare.js";

describe("compareRevisions", () => {
	it("identifies the better revision", () => {
		const a: RevisionScore = { sha: "abc123", score: 0.9, timestamp: Date.now() - 1000 };
		const b: RevisionScore = { sha: "def456", score: 0.7, timestamp: Date.now() };
		const result = compareRevisions(a, b);
		expect(result.winner).toBe("abc123");
		expect(result.delta).toBeCloseTo(0.2);
		expect(result.regression).toBe(true);
	});

	it("reports no regression when newer is better", () => {
		const a: RevisionScore = { sha: "abc123", score: 0.7, timestamp: Date.now() - 1000 };
		const b: RevisionScore = { sha: "def456", score: 0.9, timestamp: Date.now() };
		const result = compareRevisions(a, b);
		expect(result.winner).toBe("def456");
		expect(result.regression).toBe(false);
	});

	it("reports tie when scores are equal", () => {
		const a: RevisionScore = { sha: "abc123", score: 0.8, timestamp: Date.now() - 1000 };
		const b: RevisionScore = { sha: "def456", score: 0.8, timestamp: Date.now() };
		const result = compareRevisions(a, b);
		expect(result.winner).toBeNull();
		expect(result.regression).toBe(false);
	});
});
```

**Step 2: Run test to verify it fails**

Run: `cd packages/scoring-harness && npx vitest run src/compare.test.ts`
Expected: FAIL — module not found

**Step 3: Implement revision comparison**

Create `packages/scoring-harness/src/compare.ts`:

```typescript
export interface RevisionScore {
	sha: string;
	score: number;
	timestamp: number;
}

export interface ComparisonResult {
	winner: string | null;
	delta: number;
	regression: boolean;
	older: RevisionScore;
	newer: RevisionScore;
}

export function compareRevisions(a: RevisionScore, b: RevisionScore): ComparisonResult {
	const [older, newer] = a.timestamp < b.timestamp ? [a, b] : [b, a];
	const delta = Math.abs(a.score - b.score);

	if (a.score === b.score) {
		return { winner: null, delta: 0, regression: false, older, newer };
	}

	const winner = a.score > b.score ? a.sha : b.sha;
	const regression = newer.score < older.score;

	return { winner, delta, regression, older, newer };
}
```

**Step 4: Run test to verify it passes**

Run: `cd packages/scoring-harness && npx vitest run src/compare.test.ts`
Expected: PASS (3 tests)

**Step 5: Write the runner test**

Create `packages/scoring-harness/src/runner.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import { buildScoringPrompt } from "./runner.js";

describe("buildScoringPrompt", () => {
	it("constructs a prompt from skill and fixture", () => {
		const skillContent = "---\ndescription: Define a component\n---\n\n# Define\n\nInstructions.";
		const fixtureContent = "# Button Brief\n\nA button component.";
		const prompt = buildScoringPrompt(skillContent, fixtureContent);

		expect(prompt).toContain("# Define");
		expect(prompt).toContain("# Button Brief");
		expect(prompt).toContain("Instructions.");
	});
});
```

**Step 6: Run test to verify it fails**

Run: `cd packages/scoring-harness && npx vitest run src/runner.test.ts`
Expected: FAIL — module not found

**Step 7: Implement the runner**

Create `packages/scoring-harness/src/runner.ts`:

```typescript
import Anthropic from "@anthropic-ai/sdk";
import { readFileSync } from "node:fs";
import { loadRubric, scoreOutput, type ScoreResult } from "./rubric.js";

export function buildScoringPrompt(skillContent: string, fixtureContent: string): string {
	return `You are scoring a Claude Code skill. Execute the skill instructions against the provided fixture input. Produce ONLY the skill output — no commentary, no explanation.

## Skill Instructions

${skillContent}

## Input (Fixture)

${fixtureContent}

## Task

Execute the skill instructions above against the input. Produce the output artifact exactly as the skill describes.`;
}

export interface ScoringRunResult {
	skill: string;
	fixture: string;
	output: string;
	score: ScoreResult;
	sha: string;
}

export async function runScoring(options: {
	skillPath: string;
	fixturePath: string;
	rubricPath: string;
	sha: string;
}): Promise<ScoringRunResult> {
	const skillContent = readFileSync(options.skillPath, "utf-8");
	const fixtureContent = readFileSync(options.fixturePath, "utf-8");
	const rubric = loadRubric(options.rubricPath);

	const prompt = buildScoringPrompt(skillContent, fixtureContent);

	const client = new Anthropic();
	const response = await client.messages.create({
		model: "claude-sonnet-4-20250514",
		max_tokens: 4096,
		messages: [{ role: "user", content: prompt }],
	});

	const output = response.content
		.filter((block) => block.type === "text")
		.map((block) => block.text)
		.join("\n");

	const score = scoreOutput(output, rubric);

	return {
		skill: rubric.skill,
		fixture: rubric.fixture,
		output,
		score,
		sha: options.sha,
	};
}
```

**Step 8: Run test to verify it passes**

Run: `cd packages/scoring-harness && npx vitest run src/runner.test.ts`
Expected: PASS (1 test)

**Step 9: Create the index barrel**

Create `packages/scoring-harness/src/index.ts`:

```typescript
export { scoreOutput, loadRubric, type Rubric, type ScoreResult, type CheckResult } from "./rubric.js";
export { runScoring, buildScoringPrompt, type ScoringRunResult } from "./runner.js";
export { compareRevisions, type RevisionScore, type ComparisonResult } from "./compare.js";
```

**Step 10: Commit**

```bash
git add -A
git commit -m "feat: implement scoring-harness runner and revision comparison"
```

---

## Task 12: Scoring Harness — CLI

**Files:**
- Create: `packages/scoring-harness/src/cli.ts`

**Step 1: Implement the CLI**

Create `packages/scoring-harness/src/cli.ts`:

```typescript
import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { globSync } from "glob";
import { resolve, dirname } from "node:path";
import { runScoring } from "./runner.js";

function getCurrentSha(): string {
	return execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf-8" }).trim();
}

function parseArgs(args: string[]) {
	const flags: Record<string, string> = {};
	for (let i = 0; i < args.length; i++) {
		if (args[i].startsWith("--") && i + 1 < args.length) {
			flags[args[i].slice(2)] = args[i + 1];
			i++;
		}
	}
	return flags;
}

async function main() {
	const flags = parseArgs(process.argv.slice(2));
	const sha = getCurrentSha();

	// Find all rubric files
	const rubricFiles = globSync("../../fixtures/**/expected/*.json", {
		cwd: import.meta.dirname,
		absolute: true,
	});

	// Filter by skill if specified
	const filtered = flags.skill
		? rubricFiles.filter((f) => {
				const content = JSON.parse(readFileSync(f, "utf-8"));
				return content.skill === flags.skill;
			})
		: rubricFiles;

	console.log(`Running ${filtered.length} scoring run(s) at ${sha.slice(0, 7)}...\n`);

	const results = [];
	for (const rubricPath of filtered) {
		const rubricDir = dirname(rubricPath);
		const rubricContent = JSON.parse(readFileSync(rubricPath, "utf-8"));
		const fixtureName = rubricContent.fixture;
		const fixturePath = resolve(rubricDir, "..", fixtureName);
		const skillName = rubricContent.skill;

		// Find skill
		const skillPaths = globSync(`../../plugins/**/skills/${skillName}/SKILL.md`, {
			cwd: import.meta.dirname,
			absolute: true,
		});
		const skillPath = skillPaths[0];

		if (!skillPath) {
			console.log(`SKIP ${skillName} — skill not found`);
			continue;
		}

		console.log(`SCORE ${skillName} against ${fixtureName}...`);

		try {
			const result = await runScoring({ skillPath, fixturePath, rubricPath, sha });
			results.push(result);

			const pct = (result.score.score * 100).toFixed(0);
			console.log(`  Score: ${pct}% (${result.score.earnedScore}/${result.score.maxScore})`);

			for (const fail of result.score.failed) {
				console.log(`  FAIL [${fail.name}]: ${fail.description}`);
			}
		} catch (err) {
			console.log(`  ERROR: ${err}`);
		}
	}

	const hasFailures = results.some((r) => r.score.score < 1.0);
	process.exit(hasFailures ? 1 : 0);
}

main();
```

**Step 2: Build the package**

Run: `cd packages/scoring-harness && pnpm build`
Expected: compiles without errors

**Step 3: Commit**

```bash
git add -A
git commit -m "feat: add scoring-harness CLI for running skill scores"
```

---

## Task 13: Hooks — PreToolUse Gate

**Files:**
- Create: `plugins/design-thinking/hooks/hooks.json`
- Create: `plugins/design-thinking/hooks/check-define-exists.sh`

**Step 1: Create hooks.json**

Create `plugins/design-thinking/hooks/hooks.json`:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "mcp__figma__write_to_figma",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PLUGIN_ROOT}/hooks/check-define-exists.sh"
          }
        ]
      }
    ]
  }
}
```

**Step 2: Create the gate script**

Create `plugins/design-thinking/hooks/check-define-exists.sh`:

```bash
#!/usr/bin/env bash
set -euo pipefail

# Allow bypass via env var
if [[ "${DT_SKIP_CHECKS:-}" == "1" ]]; then
  exit 0
fi

# Try to find .dt/<name>/ directories to infer current component
COMPONENT_DIR=$(find .dt -mindepth 1 -maxdepth 1 -type d 2>/dev/null | head -1)

if [[ -z "$COMPONENT_DIR" ]]; then
  echo "BLOCKED: No .dt/ directory found. Run /dt:empathize and /dt:define first." >&2
  exit 1
fi

COMPONENT=$(basename "$COMPONENT_DIR")
DEFINE_FILE=".dt/${COMPONENT}/02-define.md"

if [[ ! -f "$DEFINE_FILE" ]]; then
  echo "BLOCKED: ${DEFINE_FILE} not found." >&2
  echo "" >&2
  echo "The component contract must be defined before writing to Figma." >&2
  echo "Run: /dt:define ${COMPONENT}" >&2
  echo "" >&2
  echo "To bypass: export DT_SKIP_CHECKS=1" >&2
  exit 1
fi

exit 0
```

**Step 3: Make it executable**

Run: `chmod +x plugins/design-thinking/hooks/check-define-exists.sh`

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: add PreToolUse hook to gate Figma writes on define artifact"
```

---

## Task 14: Wire Everything Together

**Step 1: Install all dependencies**

Run: `pnpm install`
Expected: all workspace packages resolved

**Step 2: Build all packages**

Run: `pnpm build`
Expected: both packages compile cleanly

**Step 3: Run all tests**

Run: `pnpm test`
Expected: all tests pass (skill-validator: 8 tests, scoring-harness: 8 tests)

**Step 4: Run skill validator against the real skill**

Run: `pnpm lint:skills`
Expected: `PASS` for `define-component/SKILL.md`

**Step 5: Verify turbo caching works**

Run: `pnpm test` (again)
Expected: `FULL TURBO` — cached results

**Step 6: Commit any final wiring fixes**

```bash
git add -A
git commit -m "chore: wire turbo tasks and verify full build pipeline"
```

---

## Task 15: Final Verification

**Step 1: Clean build from scratch**

Run: `rm -rf node_modules packages/*/node_modules packages/*/dist .turbo && pnpm install && pnpm build && pnpm test`
Expected: everything passes from clean state

**Step 2: Validate the complete file tree matches the design doc**

Run: `find . -not -path '*/node_modules/*' -not -path '*/.turbo/*' -not -path '*/dist/*' -not -path '*/.git/*' | sort`
Expected: matches the repo structure from the design doc (M1 subset)

**Step 3: Run skill validator one final time**

Run: `pnpm lint:skills`
Expected: PASS

**Step 4: Commit if any fixes were needed**

```bash
git add -A
git commit -m "chore: final M1 verification pass"
```

---

## Summary

After completing all 15 tasks, M1 delivers:

- Turborepo monorepo with pnpm workspaces
- Plugin marketplace config + design-thinking plugin manifest
- `define-component` SKILL.md — the critical first skill
- Shared reference files (WCAG criteria, component contract template)
- `@designpowers/skill-validator` — lints SKILL.md quality (8 tests)
- `@designpowers/scoring-harness` — rubric scorer, revision comparison, runner (8 tests)
- Golden fixture (button brief) with scoring rubric
- PreToolUse hook gating Figma writes on define artifact
- Full turbo pipeline: `build`, `test`, `lint:skills`, `score`

M2 picks up: remaining Design Thinking skills, component-ideator agent, `/design` orchestrator.

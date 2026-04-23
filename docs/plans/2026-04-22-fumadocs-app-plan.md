# Fumadocs Documentation App Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a Fumadocs documentation site at `apps/docs` deployed to GitHub Pages at `metapowers.github.io/metapowers`.

**Architecture:** Next.js App Router with Fumadocs MDX content collections, statically exported. Content lives in `apps/docs/content/docs/` as MDX files. GitHub Actions deploys the `out/` directory to GitHub Pages on push to main.

**Tech Stack:** Next.js 16, Fumadocs (core/ui/mdx v16.x), Tailwind CSS v4, Bun, Turborepo

---

### Task 1: Update monorepo config for apps workspace

**Files:**
- Modify: `package.json` (root)
- Modify: `turbo.json`
- Modify: `biome.json`

**Step 1: Add `apps/*` to root workspaces**

In `package.json`, change:
```json
"workspaces": ["packages/*"]
```
to:
```json
"workspaces": ["packages/*", "apps/*"]
```

**Step 2: Update turbo.json to handle docs build output**

The docs app outputs to `out/` not `dist/`. In `turbo.json`, update the `build` task:
```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", "out/**"]
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

**Step 3: Add `out/` and `.source/` to biome ignore**

In `biome.json`, update the `files.ignore` array:
```json
"ignore": ["**/dist/**", "**/node_modules/**", "**/.design/**", "**/out/**", "**/.source/**"]
```

**Step 4: Commit**

```bash
git add package.json turbo.json biome.json
git commit -m "chore: add apps/* workspace and update build config for docs"
```

---

### Task 2: Scaffold apps/docs with Next.js + Fumadocs

**Files:**
- Create: `apps/docs/package.json`
- Create: `apps/docs/tsconfig.json`
- Create: `apps/docs/next.config.mjs`
- Create: `apps/docs/source.config.ts`
- Create: `apps/docs/postcss.config.mjs`
- Create: `apps/docs/.gitignore`

**Step 1: Create `apps/docs/package.json`**

```json
{
  "name": "@metapowers/docs",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "fumadocs-core": "^16.0.0",
    "fumadocs-mdx": "^14.0.0",
    "fumadocs-ui": "^16.0.0",
    "next": "^16.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@types/mdx": "^2.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "tailwindcss": "^4.0.0",
    "@tailwindcss/postcss": "^4.0.0",
    "typescript": "^5.7.0"
  }
}
```

**Step 2: Create `apps/docs/tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./*"],
      "collections/*": ["./.source/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", "**/*.mdx", ".source/**/*.ts"],
  "exclude": ["node_modules"]
}
```

**Step 3: Create `apps/docs/next.config.mjs`**

```js
import { createMDX } from "fumadocs-mdx/next";

const isProd = process.env.NODE_ENV === "production";

/** @type {import('next').NextConfig} */
const config = {
	reactStrictMode: true,
	output: "export",
	basePath: isProd ? "/metapowers" : "",
	trailingSlash: true,
	images: {
		unoptimized: true,
	},
};

const withMDX = createMDX();

export default withMDX(config);
```

**Step 4: Create `apps/docs/source.config.ts`**

```ts
import { defineDocs, defineConfig } from "fumadocs-mdx/config";

export const docs = defineDocs({
	dir: "content/docs",
});

export default defineConfig();
```

**Step 5: Create `apps/docs/postcss.config.mjs`**

```js
const config = {
	plugins: {
		"@tailwindcss/postcss": {},
	},
};

export default config;
```

**Step 6: Create `apps/docs/.gitignore`**

```
.next/
out/
.source/
next-env.d.ts
```

**Step 7: Install dependencies**

```bash
cd apps/docs && bun install
```

Run from root:
```bash
bun install
```

**Step 8: Commit**

```bash
git add apps/docs/package.json apps/docs/tsconfig.json apps/docs/next.config.mjs apps/docs/source.config.ts apps/docs/postcss.config.mjs apps/docs/.gitignore
git commit -m "feat(docs): scaffold Next.js + Fumadocs app"
```

---

### Task 3: Create app shell (layouts, styles, components)

**Files:**
- Create: `apps/docs/app/global.css`
- Create: `apps/docs/app/layout.tsx`
- Create: `apps/docs/lib/source.ts`
- Create: `apps/docs/lib/layout.shared.tsx`
- Create: `apps/docs/components/mdx.tsx`

**Step 1: Create `apps/docs/app/global.css`**

```css
@import "tailwindcss";
@import "fumadocs-ui/css/neutral.css";
@import "fumadocs-ui/css/preset.css";
```

**Step 2: Create `apps/docs/app/layout.tsx`**

```tsx
import { RootProvider } from "fumadocs-ui/provider/next";
import type { ReactNode } from "react";
import "./global.css";

export default function Layout({ children }: { children: ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className="flex min-h-screen flex-col">
				<RootProvider>{children}</RootProvider>
			</body>
		</html>
	);
}
```

**Step 3: Create `apps/docs/lib/source.ts`**

```ts
import { docs } from "collections/server";
import { loader } from "fumadocs-core/source";

export const source = loader({
	baseUrl: "/docs",
	source: docs.toFumadocsSource(),
});
```

**Step 4: Create `apps/docs/lib/layout.shared.tsx`**

```tsx
import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";

export function baseOptions(): BaseLayoutProps {
	return {
		nav: {
			title: "Metapowers",
		},
		links: [
			{
				text: "Docs",
				url: "/docs",
			},
		],
	};
}
```

**Step 5: Create `apps/docs/components/mdx.tsx`**

```tsx
import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";

export function getMDXComponents(components?: MDXComponents) {
	return {
		...defaultMdxComponents,
		...components,
	} satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
	type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
```

**Step 6: Commit**

```bash
git add apps/docs/app/ apps/docs/lib/ apps/docs/components/
git commit -m "feat(docs): add app shell with layouts, styles, and MDX components"
```

---

### Task 4: Create landing page and docs route

**Files:**
- Create: `apps/docs/app/(home)/layout.tsx`
- Create: `apps/docs/app/(home)/page.tsx`
- Create: `apps/docs/app/docs/layout.tsx`
- Create: `apps/docs/app/docs/[[...slug]]/page.tsx`

**Step 1: Create `apps/docs/app/(home)/layout.tsx`**

```tsx
import { HomeLayout } from "fumadocs-ui/layouts/home";
import { baseOptions } from "@/lib/layout.shared";
import type { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
	return <HomeLayout {...baseOptions()}>{children}</HomeLayout>;
}
```

**Step 2: Create `apps/docs/app/(home)/page.tsx`**

```tsx
import Link from "next/link";

export default function HomePage() {
	return (
		<main className="flex flex-1 flex-col items-center justify-center px-4 text-center">
			<h1 className="mb-4 text-4xl font-bold">Metapowers</h1>
			<p className="mb-8 max-w-lg text-lg text-fd-muted-foreground">
				Metaprompting plugins for Claude Code — structured workflows for design,
				coding, research, and more.
			</p>
			<div className="flex gap-4">
				<Link
					href="/docs"
					className="rounded-lg bg-fd-primary px-6 py-3 text-sm font-medium text-fd-primary-foreground transition-colors hover:bg-fd-primary/90"
				>
					Get Started
				</Link>
				<a
					href="https://github.com/bromso/metapowers"
					className="rounded-lg border border-fd-border px-6 py-3 text-sm font-medium transition-colors hover:bg-fd-accent"
					target="_blank"
					rel="noopener noreferrer"
				>
					GitHub
				</a>
			</div>
		</main>
	);
}
```

**Step 3: Create `apps/docs/app/docs/layout.tsx`**

```tsx
import { source } from "@/lib/source";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { baseOptions } from "@/lib/layout.shared";
import type { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
	return (
		<DocsLayout tree={source.getPageTree()} {...baseOptions()}>
			{children}
		</DocsLayout>
	);
}
```

**Step 4: Create `apps/docs/app/docs/[[...slug]]/page.tsx`**

```tsx
import { source } from "@/lib/source";
import {
	DocsBody,
	DocsDescription,
	DocsPage,
	DocsTitle,
} from "fumadocs-ui/layouts/docs/page";
import { notFound } from "next/navigation";
import { getMDXComponents } from "@/components/mdx";
import type { Metadata } from "next";
import { createRelativeLink } from "fumadocs-ui/mdx";

interface PageProps {
	params: Promise<{ slug?: string[] }>;
}

export default async function Page(props: PageProps) {
	const params = await props.params;
	const page = source.getPage(params.slug);
	if (!page) notFound();

	const MDX = page.data.body;

	return (
		<DocsPage toc={page.data.toc} full={page.data.full}>
			<DocsTitle>{page.data.title}</DocsTitle>
			<DocsDescription>{page.data.description}</DocsDescription>
			<DocsBody>
				<MDX
					components={getMDXComponents({
						a: createRelativeLink(source, page),
					})}
				/>
			</DocsBody>
		</DocsPage>
	);
}

export async function generateStaticParams() {
	return source.generateParams();
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
	const params = await props.params;
	const page = source.getPage(params.slug);
	if (!page) notFound();

	return {
		title: page.data.title,
		description: page.data.description,
	};
}
```

**Step 5: Commit**

```bash
git add apps/docs/app/
git commit -m "feat(docs): add landing page and docs catch-all route"
```

---

### Task 5: Write Getting Started content

**Files:**
- Create: `apps/docs/content/docs/meta.json`
- Create: `apps/docs/content/docs/index.mdx`
- Create: `apps/docs/content/docs/installation.mdx`

**Step 1: Create `apps/docs/content/docs/meta.json`**

```json
{
	"title": "Documentation",
	"pages": ["index", "installation", "---", "...design", "...architecture", "...reference"]
}
```

**Step 2: Create `apps/docs/content/docs/index.mdx`**

```mdx
---
title: Getting Started
description: What is Metapowers and how to get started with structured workflows in Claude Code.
---

## What is Metapowers?

Metapowers is a collection of Claude Code plugins that bring structured, repeatable workflows to digital production domains. Each plugin adds a set of slash commands that guide you through a proven methodology.

The first plugin — **Design** — implements a five-phase design thinking process for building UI components, writing artifacts to Figma via MCP.

## Quick Start

Install the metapowers marketplace in Claude Code:

```bash
claude install bromso/metapowers
```

Then start a design workflow:

```
/design:empathize button
```

This kicks off the empathize phase for a "button" component, creating research artifacts in `.design/button/`.

## How It Works

Each domain plugin provides:

- **Phases** — ordered steps in a methodology (e.g., empathize → define → ideate → prototype → test)
- **Skills** — slash commands that execute each phase with structured prompts
- **Quality gates** — checks that enforce phase ordering and artifact completeness
- **Artifacts** — markdown files generated at each phase, stored in a `.design/` (or domain-specific) directory

## Next Steps

- [Installation](/docs/installation) — detailed setup instructions
- [Design Domain Guide](/docs/design) — walk through all five design phases
- [Architecture](/docs/architecture) — understand how the plugin system works
```

**Step 3: Create `apps/docs/content/docs/installation.mdx`**

```mdx
---
title: Installation
description: How to install and configure Metapowers plugins in Claude Code.
---

## Prerequisites

- [Claude Code](https://claude.ai/code) CLI installed
- A Figma account with an access token (for the Design plugin's Figma integration)

## Install from Marketplace

```bash
claude install bromso/metapowers
```

This installs the marketplace and all available plugins. Currently, the **Design** plugin is the only published domain.

## Configure Figma Access

The Design plugin writes prototypes to Figma via MCP. Set your Figma access token:

```bash
export FIGMA_ACCESS_TOKEN="your-token-here"
```

Add this to your shell profile (`.zshrc`, `.bashrc`) to persist it.

## Verify Installation

Run any design skill to confirm everything works:

```
/design:empathize test-component
```

You should see the empathize phase execute, creating artifacts in `.design/test-component/`.

## Updating

To update to the latest version:

```bash
claude update bromso/metapowers
```
```

**Step 4: Commit**

```bash
git add apps/docs/content/
git commit -m "docs: add getting started and installation pages"
```

---

### Task 6: Write Design Domain Guide content

**Files:**
- Create: `apps/docs/content/docs/design/meta.json`
- Create: `apps/docs/content/docs/design/index.mdx`
- Create: `apps/docs/content/docs/design/empathize.mdx`
- Create: `apps/docs/content/docs/design/define.mdx`
- Create: `apps/docs/content/docs/design/ideate.mdx`
- Create: `apps/docs/content/docs/design/prototype.mdx`
- Create: `apps/docs/content/docs/design/test.mdx`

**Step 1: Create `apps/docs/content/docs/design/meta.json`**

```json
{
	"title": "Design Domain",
	"pages": ["index", "empathize", "define", "ideate", "prototype", "test"]
}
```

**Step 2: Create `apps/docs/content/docs/design/index.mdx`**

```mdx
---
title: Design Domain Overview
description: A five-phase design thinking process for building UI components in Claude Code.
---

The Design plugin implements a complete design thinking methodology with five phases. Each phase has a dedicated slash command that guides you through structured research, definition, ideation, prototyping, and testing.

## The Five Phases

| Phase | Command | Purpose |
|-------|---------|---------|
| Empathize | `/design:empathize` | Research user needs, context, and existing patterns |
| Define | `/design:define` | Create a component contract with specs and constraints |
| Ideate | `/design:ideate` | Explore multiple design approaches |
| Prototype | `/design:prototype` | Build the component in Figma via MCP |
| Test | `/design:test` | Validate against WCAG and component contract |

## Artifact Flow

Each phase reads from previous phases and writes to `.design/<component-name>/`:

```
.design/button/
  empathize-brief.md    ← Phase 1 output
  component-contract.md ← Phase 2 output
  ideation-options.md   ← Phase 3 output
  prototype-notes.md    ← Phase 4 output
  test-report.md        ← Phase 5 output
```

## Quality Gates

The plugin enforces phase ordering through quality gates:

- **Soft gates** check that prerequisite artifacts exist and warn if missing
- **Hard gates** (hooks) block actions that require prior phases — e.g., you cannot write to Figma until the define phase is complete
- **Scoring gates** validate skill output quality in CI

You can bypass soft gates with `--skip-checks` when needed, but hard gates always apply.
```

**Step 3: Create `apps/docs/content/docs/design/empathize.mdx`**

```mdx
---
title: "Phase 1: Empathize"
description: Research user needs, context, and existing patterns for your component.
---

## Purpose

The empathize phase researches the problem space before any design work begins. It gathers user needs, existing patterns, accessibility requirements, and contextual constraints.

## Usage

```
/design:empathize <component-name>
```

**Example:**
```
/design:empathize button
```

## What It Does

1. Researches common patterns for the component type
2. Identifies user needs and use cases
3. Reviews accessibility requirements (WCAG criteria)
4. Documents existing implementations and prior art
5. Writes findings to `.design/<component-name>/empathize-brief.md`

## Output

Creates `.design/<component-name>/empathize-brief.md` containing:

- User needs and pain points
- Existing pattern analysis
- Accessibility considerations
- Contextual constraints
- Recommended approach

## Next Phase

After empathize, proceed to [Define](/docs/design/define) to create the component contract.
```

**Step 4: Create `apps/docs/content/docs/design/define.mdx`**

```mdx
---
title: "Phase 2: Define"
description: Create a component contract with specifications and constraints.
---

## Purpose

The define phase synthesizes empathize research into a concrete component contract — a specification document that drives all subsequent design and implementation.

## Usage

```
/design:define <component-name>
```

## Prerequisites

Requires `.design/<component-name>/empathize-brief.md` from Phase 1. A soft gate warns if this file is missing.

## What It Does

1. Reads the empathize brief
2. Creates a component contract using the shared template
3. Defines variants, states, props, and constraints
4. Specifies accessibility requirements
5. Writes to `.design/<component-name>/component-contract.md`

## Output

Creates `.design/<component-name>/component-contract.md` containing:

- Component name and purpose
- Variants and states
- Props/API surface
- Accessibility requirements (from WCAG criteria)
- Visual specifications
- Interaction patterns

## Hard Gate

The define phase output is a **hard gate** for prototyping — the Figma MCP write hook (`check-define-exists.sh`) blocks writing to Figma until a component contract exists.

## Next Phase

After define, proceed to [Ideate](/docs/design/ideate) to explore design approaches.
```

**Step 5: Create `apps/docs/content/docs/design/ideate.mdx`**

```mdx
---
title: "Phase 3: Ideate"
description: Explore multiple design approaches for your component.
---

## Purpose

The ideate phase generates multiple design options before committing to an implementation. This prevents jumping to the first solution and encourages creative exploration.

## Usage

```
/design:ideate <component-name>
```

## Prerequisites

Requires `.design/<component-name>/component-contract.md` from Phase 2.

## What It Does

1. Reads the component contract
2. Generates 3+ distinct design approaches
3. Evaluates each against the contract's constraints
4. Recommends one approach with rationale
5. Writes to `.design/<component-name>/ideation-options.md`

## Output

Creates `.design/<component-name>/ideation-options.md` containing:

- Multiple design options with visual descriptions
- Trade-off analysis for each option
- Constraint compliance evaluation
- Recommended approach and reasoning

## Next Phase

After ideate, proceed to [Prototype](/docs/design/prototype) to build the chosen design in Figma.
```

**Step 6: Create `apps/docs/content/docs/design/prototype.mdx`**

```mdx
---
title: "Phase 4: Prototype"
description: Build the component in Figma via the MCP server.
---

## Purpose

The prototype phase takes the chosen design from ideation and builds it as a Figma component using the Figma MCP server.

## Usage

```
/design:prototype <component-name>
```

## Prerequisites

- `.design/<component-name>/component-contract.md` (hard gate — enforced by hook)
- `.design/<component-name>/ideation-options.md` (soft gate)
- `FIGMA_ACCESS_TOKEN` environment variable set

## What It Does

1. Reads the component contract and chosen ideation option
2. Connects to Figma via the MCP server
3. Creates the component with all specified variants and states
4. Applies visual specifications from the contract
5. Writes notes to `.design/<component-name>/prototype-notes.md`

## Figma MCP Integration

The Design plugin uses `@anthropic-ai/figma-mcp` to write directly to your Figma canvas. The hook at `hooks/check-define-exists.sh` ensures a component contract exists before any Figma write operations.

## Output

- Figma component created on your canvas
- `.design/<component-name>/prototype-notes.md` with implementation notes

## Next Phase

After prototype, proceed to [Test](/docs/design/test) to validate the implementation.
```

**Step 7: Create `apps/docs/content/docs/design/test.mdx`**

```mdx
---
title: "Phase 5: Test"
description: Validate the prototype against WCAG and the component contract.
---

## Purpose

The test phase validates the completed prototype against the component contract and WCAG accessibility criteria, producing a pass/fail report.

## Usage

```
/design:test <component-name>
```

## Prerequisites

All prior phase artifacts should exist in `.design/<component-name>/`.

## What It Does

1. Reads the component contract and prototype notes
2. Checks each contract requirement against the prototype
3. Validates WCAG compliance using shared criteria
4. Generates a test report with pass/fail for each criterion
5. Writes to `.design/<component-name>/test-report.md`

## Output

Creates `.design/<component-name>/test-report.md` containing:

- Contract compliance checklist (pass/fail per requirement)
- WCAG validation results
- Issues found and remediation suggestions
- Overall pass/fail status

## After Testing

If the test report identifies issues, iterate by returning to the relevant phase (often prototype or define) to address them. The artifact flow is designed for iteration — update the artifact and re-run downstream phases.
```

**Step 8: Commit**

```bash
git add apps/docs/content/docs/design/
git commit -m "docs: add design domain guide with all five phases"
```

---

### Task 7: Write Architecture Overview content

**Files:**
- Create: `apps/docs/content/docs/architecture/meta.json`
- Create: `apps/docs/content/docs/architecture/index.mdx`
- Create: `apps/docs/content/docs/architecture/artifacts.mdx`

**Step 1: Create `apps/docs/content/docs/architecture/meta.json`**

```json
{
	"title": "Architecture",
	"pages": ["index", "artifacts"]
}
```

**Step 2: Create `apps/docs/content/docs/architecture/index.mdx`**

```mdx
---
title: Architecture Overview
description: How the Metapowers plugin system works — domains, skills, quality gates, and the marketplace.
---

## Domain-as-Plugin Architecture

Metapowers organizes work into **domains** — self-contained plugins that each implement a methodology for a specific discipline. Each domain plugin lives under `plugins/<domain>/` and contains:

```
plugins/design/
  .claude-plugin/
    plugin.json        # Plugin manifest
  skills/              # Slash command implementations
    empathize/SKILL.md
    define/SKILL.md
    ...
  hooks/               # Quality gate enforcement
    hooks.json
    check-define-exists.sh
  shared/              # Shared resources (templates, criteria)
    component-contract-template.md
    wcag-criteria.md
  .mcp.json            # MCP server configuration
```

## The Skill System

Each skill is a Markdown file (`SKILL.md`) with YAML frontmatter and structured instructions. When you run a slash command like `/design:empathize button`, Claude Code loads the corresponding skill file and follows its instructions.

Skills define:
- **Description** — what the skill does (used for matching)
- **Prerequisites** — what artifacts must exist before running
- **Process** — step-by-step instructions for Claude to follow
- **Output** — what artifacts to create and where to save them

## Quality Gates

Three layers of quality enforcement:

### Soft Gates (Prerequisites)
Each skill checks for prerequisite artifacts at the start of execution. If missing, it warns you but allows proceeding with `--skip-checks`.

### Hard Gates (Hooks)
Hook scripts in `hooks/hooks.json` block specific tool calls until conditions are met. For example, writing to Figma is blocked until a component contract exists. These cannot be bypassed.

### Scoring Gates (CI)
The `@metapowers/scoring-harness` package validates skill output quality by comparing against fixture inputs using Claude as a judge. This runs in CI to catch regressions.

## The Marketplace

The marketplace manifest (`.claude-plugin/marketplace.json`) registers all available plugins. When users install metapowers, they get access to every published domain plugin.

## Monorepo Structure

```
metapowers/
  packages/
    skill-validator/    # Validates SKILL.md format
    scoring-harness/    # Scores skill output quality
  plugins/
    design/             # First domain plugin
  apps/
    docs/               # This documentation site
```

Built with Turborepo + Bun. Packages are internal utilities; plugins are the user-facing product.
```

**Step 3: Create `apps/docs/content/docs/architecture/artifacts.mdx`**

```mdx
---
title: Artifact Flow
description: How artifacts are created, stored, and consumed across phases.
---

## Artifact Directory

Each domain stores artifacts in a dotfile directory named after the domain. The Design plugin uses `.design/`:

```
.design/<component-name>/
  empathize-brief.md
  component-contract.md
  ideation-options.md
  prototype-notes.md
  test-report.md
```

This directory is created in your project root when you first run a design skill.

## Phase Dependencies

Artifacts form a dependency chain — each phase reads from previous phases:

```
empathize → define → ideate → prototype → test
   ↓          ↓        ↓         ↓          ↓
 brief    contract   options    notes     report
```

Quality gates enforce this ordering. You can run phases out of order with `--skip-checks`, but the output quality may suffer without prior context.

## Artifact Format

All artifacts are Markdown files with structured sections. They are designed to be:

- **Human-readable** — review and edit them directly
- **Machine-consumable** — subsequent skills parse them for context
- **Version-controllable** — commit them alongside your code

## Gitignore

The `.design/` directory is typically gitignored since artifacts are project-specific working files. Add it to your `.gitignore`:

```
.design/
```

The Biome config already ignores `.design/` for linting and formatting.
```

**Step 4: Commit**

```bash
git add apps/docs/content/docs/architecture/
git commit -m "docs: add architecture overview and artifact flow pages"
```

---

### Task 8: Write Skill Reference content

**Files:**
- Create: `apps/docs/content/docs/reference/meta.json`
- Create: `apps/docs/content/docs/reference/index.mdx`

**Step 1: Create `apps/docs/content/docs/reference/meta.json`**

```json
{
	"title": "Reference",
	"pages": ["index"]
}
```

**Step 2: Create `apps/docs/content/docs/reference/index.mdx`**

```mdx
---
title: Skill Reference
description: Reference for all available skills in the Design plugin.
---

## Design Plugin Skills

| Skill | Command | Description |
|-------|---------|-------------|
| Empathize | `/design:empathize <name>` | Research user needs, context, and existing patterns |
| Define | `/design:define <name>` | Create a component contract with specs and constraints |
| Ideate | `/design:ideate <name>` | Explore multiple design approaches |
| Prototype | `/design:prototype <name>` | Build the component in Figma via MCP |
| Test | `/design:test <name>` | Validate against WCAG and component contract |

## Common Arguments

All design skills accept a component name as the primary argument:

```
/design:<phase> <component-name>
```

The component name is used to namespace artifacts in `.design/<component-name>/`.

## Flags

### `--skip-checks`

Bypass soft prerequisite gates. Useful when you want to run a phase without its prerequisites (e.g., jumping straight to define without empathize).

```
/design:define button --skip-checks
```

Hard gates (hooks) cannot be bypassed with this flag.

## Environment Variables

### `FIGMA_ACCESS_TOKEN`

Required for the prototype phase. Your Figma personal access token, used by the MCP server to write components to your canvas.

### `DESIGN_SKIP_CHECKS`

Set to `true` to globally disable soft prerequisite checks for all design skills.

```bash
export DESIGN_SKIP_CHECKS=true
```
```

**Step 3: Commit**

```bash
git add apps/docs/content/docs/reference/
git commit -m "docs: add skill reference page"
```

---

### Task 9: Set up GitHub Actions workflow

**Files:**
- Create: `.github/workflows/deploy-docs.yml`

**Step 1: Create `.github/workflows/deploy-docs.yml`**

```yaml
name: Deploy Docs

on:
  push:
    branches: [main]
    paths:
      - "apps/docs/**"
      - ".github/workflows/deploy-docs.yml"
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: oven-sh/setup-bun@v2
        with:
          bun-version: "1.3.12"

      - name: Install dependencies
        run: bun install --frozen-lockfile

      - name: Build docs
        run: bun turbo build --filter=@metapowers/docs

      - name: Add .nojekyll
        run: touch apps/docs/out/.nojekyll

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: apps/docs/out

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

**Step 2: Commit**

```bash
git add .github/workflows/deploy-docs.yml
git commit -m "ci: add GitHub Actions workflow for docs deployment"
```

---

### Task 10: Build and verify locally

**Step 1: Install all dependencies from root**

```bash
bun install
```

**Step 2: Run the docs build**

```bash
bun turbo build --filter=@metapowers/docs
```

Expected: Build succeeds, static files in `apps/docs/out/`

**Step 3: Verify the output directory**

```bash
ls apps/docs/out/
```

Expected: `index.html`, `docs/` directory, `_next/` directory

**Step 4: Test locally with a static server**

```bash
cd apps/docs/out && bunx serve -p 3000
```

Visit `http://localhost:3000` and verify:
- Landing page renders with "Metapowers" title and "Get Started" button
- `/docs/` shows the Getting Started page with sidebar navigation
- All doc pages render correctly
- Sidebar navigation works across all sections

**Step 5: Final commit (if any fixes needed)**

```bash
git add -A
git commit -m "fix(docs): address build issues"
```

---

## Summary

| Task | Description | Commit message |
|------|-------------|----------------|
| 1 | Update monorepo config | `chore: add apps/* workspace and update build config for docs` |
| 2 | Scaffold Next.js + Fumadocs | `feat(docs): scaffold Next.js + Fumadocs app` |
| 3 | App shell (layouts, styles) | `feat(docs): add app shell with layouts, styles, and MDX components` |
| 4 | Landing page + docs route | `feat(docs): add landing page and docs catch-all route` |
| 5 | Getting Started content | `docs: add getting started and installation pages` |
| 6 | Design Domain Guide | `docs: add design domain guide with all five phases` |
| 7 | Architecture Overview | `docs: add architecture overview and artifact flow pages` |
| 8 | Skill Reference | `docs: add skill reference page` |
| 9 | GitHub Actions workflow | `ci: add GitHub Actions workflow for docs deployment` |
| 10 | Build and verify | (fix commit if needed) |

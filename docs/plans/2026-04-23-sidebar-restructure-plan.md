# Sidebar Restructure Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Restructure the apps/docs sidebar into 8 domain-based sections with a Fumadocs root toggle dropdown.

**Architecture:** Reorganize `content/docs/` into 8 top-level domain folders, each with `root: true` in its `meta.json`. Add `tabs={{}}` to `DocsLayout` to auto-generate the dropdown. Existing content is moved to new paths; new domains get stub pages.

**Tech Stack:** Fumadocs MDX, Next.js App Router, React

**Design doc:** `docs/plans/2026-04-23-sidebar-restructure-design.md`

---

### Task 1: Create Overview domain (move existing content)

**Files:**
- Create: `apps/docs/content/docs/overview/meta.json`
- Move: `apps/docs/content/docs/index.mdx` → `apps/docs/content/docs/overview/index.mdx`
- Move: `apps/docs/content/docs/installation.mdx` → `apps/docs/content/docs/overview/installation.mdx`
- Move: `apps/docs/content/docs/reference/index.mdx` → `apps/docs/content/docs/overview/reference/index.mdx`
- Move: `apps/docs/content/docs/reference/meta.json` → `apps/docs/content/docs/overview/reference/meta.json`
- Create: `apps/docs/content/docs/overview/what-is-metapowers.mdx`
- Create: `apps/docs/content/docs/overview/comparisons.mdx`
- Create: `apps/docs/content/docs/overview/guides.mdx`
- Create: `apps/docs/content/docs/overview/prompting.mdx`

**Step 1: Create overview directory and meta.json**

```bash
mkdir -p apps/docs/content/docs/overview/reference
```

```json
// apps/docs/content/docs/overview/meta.json
{
  "title": "Overview",
  "root": true,
  "pages": ["index", "what-is-metapowers", "comparisons", "installation", "guides", "prompting", "...reference"]
}
```

**Step 2: Move existing files**

```bash
git mv apps/docs/content/docs/index.mdx apps/docs/content/docs/overview/index.mdx
git mv apps/docs/content/docs/installation.mdx apps/docs/content/docs/overview/installation.mdx
git mv apps/docs/content/docs/reference/index.mdx apps/docs/content/docs/overview/reference/index.mdx
git mv apps/docs/content/docs/reference/meta.json apps/docs/content/docs/overview/reference/meta.json
rmdir apps/docs/content/docs/reference
```

**Step 3: Update internal links in overview/index.mdx**

Update the "Next Steps" links at the bottom of `overview/index.mdx`:

```mdx
## Next Steps

- [Installation](/docs/overview/installation) — detailed setup instructions
- [Design Domain Guide](/docs/design) — walk through all five design phases
- [Architecture](/docs/development/architecture) — understand how the plugin system works
```

**Step 4: Create stub pages**

```mdx
// apps/docs/content/docs/overview/what-is-metapowers.mdx
---
title: What is Metapowers
description: An introduction to the Metapowers ecosystem.
---

# What is Metapowers

Content coming soon.
```

```mdx
// apps/docs/content/docs/overview/comparisons.mdx
---
title: Comparisons
description: How Metapowers compares to other workflow tools.
---

# Comparisons

Content coming soon.
```

```mdx
// apps/docs/content/docs/overview/guides.mdx
---
title: Guides
description: Step-by-step guides for common workflows.
---

# Guides

Content coming soon.
```

```mdx
// apps/docs/content/docs/overview/prompting.mdx
---
title: Prompting
description: How to write effective prompts for Metapowers skills.
---

# Prompting

Content coming soon.
```

**Step 5: Commit**

```bash
git add apps/docs/content/docs/overview/
git commit -m "feat(docs): create overview domain with moved and stub content"
```

---

### Task 2: Create Research domain (all stubs)

**Files:**
- Create: `apps/docs/content/docs/research/meta.json`
- Create: `apps/docs/content/docs/research/index.mdx`
- Create: `apps/docs/content/docs/research/discover.mdx`
- Create: `apps/docs/content/docs/research/define.mdx`
- Create: `apps/docs/content/docs/research/design.mdx`
- Create: `apps/docs/content/docs/research/deliver.mdx`

**Step 1: Create research directory and meta.json**

```bash
mkdir -p apps/docs/content/docs/research
```

```json
// apps/docs/content/docs/research/meta.json
{
  "title": "Research",
  "root": true,
  "pages": ["index", "discover", "define", "design", "deliver"]
}
```

**Step 2: Create stub pages**

```mdx
// apps/docs/content/docs/research/index.mdx
---
title: Research Domain Overview
description: A four-phase research methodology for structured discovery and validation.
---

# Research

The Research domain implements a Double Diamond methodology with four phases: Discover, Define, Design, and Deliver.

Content coming soon.
```

```mdx
// apps/docs/content/docs/research/discover.mdx
---
title: Discover
description: Explore the problem space through broad research and data gathering.
---

# Discover

Content coming soon.
```

```mdx
// apps/docs/content/docs/research/define.mdx
---
title: Define
description: Synthesize research findings into clear problem statements.
---

# Define

Content coming soon.
```

```mdx
// apps/docs/content/docs/research/design.mdx
---
title: Design
description: Develop and iterate on potential solutions.
---

# Design

Content coming soon.
```

```mdx
// apps/docs/content/docs/research/deliver.mdx
---
title: Deliver
description: Validate and ship the final solution.
---

# Deliver

Content coming soon.
```

**Step 3: Commit**

```bash
git add apps/docs/content/docs/research/
git commit -m "feat(docs): create research domain with stub content"
```

---

### Task 3: Update Design domain (add root: true)

**Files:**
- Modify: `apps/docs/content/docs/design/meta.json`

**Step 1: Update meta.json**

Change from:
```json
{
  "title": "Design Domain",
  "pages": ["index", "empathize", "define", "ideate", "prototype", "test"]
}
```

To:
```json
{
  "title": "Design",
  "root": true,
  "pages": ["index", "empathize", "define", "ideate", "prototype", "test"]
}
```

**Step 2: Commit**

```bash
git add apps/docs/content/docs/design/meta.json
git commit -m "feat(docs): add root toggle to design domain"
```

---

### Task 4: Create Development domain (move existing content)

**Files:**
- Create: `apps/docs/content/docs/development/meta.json`
- Create: `apps/docs/content/docs/development/index.mdx`
- Move: `apps/docs/content/docs/architecture/` → `apps/docs/content/docs/development/architecture/`
- Move: `apps/docs/content/docs/mcp-server/` → `apps/docs/content/docs/development/mcp-server/`

**Step 1: Create development directory and meta.json**

```bash
mkdir -p apps/docs/content/docs/development
```

```json
// apps/docs/content/docs/development/meta.json
{
  "title": "Development",
  "root": true,
  "pages": ["index", "...architecture", "...mcp-server"]
}
```

**Step 2: Create index page**

```mdx
// apps/docs/content/docs/development/index.mdx
---
title: Development Domain Overview
description: Architecture, tooling, and developer resources for building with Metapowers.
---

# Development

The Development domain covers the technical architecture, MCP server integration, and developer tooling for extending and building with Metapowers.

## Sections

- [Architecture](/docs/development/architecture) — how the plugin system works
- [MCP Server](/docs/development/mcp-server) — Figma MCP integration and tools
```

**Step 3: Move existing directories**

```bash
git mv apps/docs/content/docs/architecture apps/docs/content/docs/development/architecture
git mv apps/docs/content/docs/mcp-server apps/docs/content/docs/development/mcp-server
```

**Step 4: Commit**

```bash
git add apps/docs/content/docs/development/
git commit -m "feat(docs): create development domain with moved architecture and mcp-server content"
```

---

### Task 5: Create remaining stub domains

**Files:**
- Create: `apps/docs/content/docs/accessibility/meta.json`
- Create: `apps/docs/content/docs/accessibility/index.mdx`
- Create: `apps/docs/content/docs/marketing/meta.json`
- Create: `apps/docs/content/docs/marketing/index.mdx`
- Create: `apps/docs/content/docs/project-management/meta.json`
- Create: `apps/docs/content/docs/project-management/index.mdx`
- Create: `apps/docs/content/docs/coaching/meta.json`
- Create: `apps/docs/content/docs/coaching/index.mdx`

**Step 1: Create directories**

```bash
mkdir -p apps/docs/content/docs/{accessibility,marketing,project-management,coaching}
```

**Step 2: Create meta.json files**

```json
// apps/docs/content/docs/accessibility/meta.json
{
  "title": "Accessibility",
  "root": true,
  "pages": ["index"]
}
```

```json
// apps/docs/content/docs/marketing/meta.json
{
  "title": "Marketing",
  "root": true,
  "pages": ["index"]
}
```

```json
// apps/docs/content/docs/project-management/meta.json
{
  "title": "Project Management",
  "root": true,
  "pages": ["index"]
}
```

```json
// apps/docs/content/docs/coaching/meta.json
{
  "title": "Coaching & Leadership",
  "root": true,
  "pages": ["index"]
}
```

**Step 3: Create stub index pages**

```mdx
// apps/docs/content/docs/accessibility/index.mdx
---
title: Accessibility Domain Overview
description: Workflows and tools for building accessible digital products.
---

# Accessibility

Content coming soon.
```

```mdx
// apps/docs/content/docs/marketing/index.mdx
---
title: Marketing Domain Overview
description: Structured marketing workflows and campaign tools.
---

# Marketing

Content coming soon.
```

```mdx
// apps/docs/content/docs/project-management/index.mdx
---
title: Project Management Domain Overview
description: Project planning, tracking, and delivery workflows.
---

# Project Management

Content coming soon.
```

```mdx
// apps/docs/content/docs/coaching/index.mdx
---
title: Coaching & Leadership Domain Overview
description: Leadership development and coaching methodology tools.
---

# Coaching & Leadership

Content coming soon.
```

**Step 4: Commit**

```bash
git add apps/docs/content/docs/{accessibility,marketing,project-management,coaching}/
git commit -m "feat(docs): create accessibility, marketing, project-management, and coaching stub domains"
```

---

### Task 6: Update root meta.json and layout

**Files:**
- Modify: `apps/docs/content/docs/meta.json`
- Modify: `apps/docs/app/docs/layout.tsx`

**Step 1: Update root meta.json**

Change from:
```json
{
  "title": "Documentation",
  "pages": ["index", "installation", "---", "...design", "...architecture", "...mcp-server", "...reference"]
}
```

To:
```json
{
  "title": "Documentation",
  "pages": [
    "...overview",
    "...research",
    "...design",
    "...development",
    "...accessibility",
    "...marketing",
    "...project-management",
    "...coaching"
  ]
}
```

**Step 2: Update DocsLayout to enable tabs**

Change `apps/docs/app/docs/layout.tsx` from:
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

To:
```tsx
import { source } from "@/lib/source";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { baseOptions } from "@/lib/layout.shared";
import type { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
	return (
		<DocsLayout tree={source.getPageTree()} tabs={{}} {...baseOptions()}>
			{children}
		</DocsLayout>
	);
}
```

**Step 3: Commit**

```bash
git add apps/docs/content/docs/meta.json apps/docs/app/docs/layout.tsx
git commit -m "feat(docs): enable root toggle dropdown with 8 domain tabs"
```

---

### Task 7: Clean up old directories and verify

**Step 1: Remove any empty leftover directories**

Check if `reference/` directory was fully cleaned up in Task 1. If any empty dirs remain:

```bash
# Verify no orphaned files remain at old paths
ls apps/docs/content/docs/reference/ 2>/dev/null && echo "LEFTOVER" || echo "CLEAN"
ls apps/docs/content/docs/architecture/ 2>/dev/null && echo "LEFTOVER" || echo "CLEAN"
ls apps/docs/content/docs/mcp-server/ 2>/dev/null && echo "LEFTOVER" || echo "CLEAN"
```

Expected: all "CLEAN"

**Step 2: Verify the dev server builds**

```bash
cd apps/docs && npx next build 2>&1 | tail -20
```

Expected: Build completes without errors. All pages generate at their new paths.

**Step 3: Spot-check key URLs in build output**

Look for these paths in the build output:
- `/docs/overview`
- `/docs/overview/installation`
- `/docs/design`
- `/docs/design/empathize`
- `/docs/development/architecture`
- `/docs/development/mcp-server/setup`
- `/docs/research`
- `/docs/accessibility`

**Step 4: Fix any issues and commit**

```bash
git add -A
git commit -m "fix(docs): clean up old directories and verify build"
```

Only commit if there are actual changes to commit.

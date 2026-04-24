# Docs Site Branding Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Brand the Fumadocs docs site with Miranda Sans font, indigo color palette, improved header nav, footer name fix, and sidebar icon links.

**Architecture:** All changes are CSS variable overrides in global.css, prop changes in layout configs, and a small component addition for sidebar icons. No new packages needed — lucide-react is already installed, npm icon will be inline SVG.

**Tech Stack:** Fumadocs UI v16, Tailwind CSS 4, Next.js 16, React 19

---

### Task 1: Add Miranda Sans font and indigo color palette

**Files:**
- Modify: `apps/docs/app/global.css`

**Step 1: Replace the contents of global.css**

Replace the entire file with:

```css
@import url('https://fonts.googleapis.com/css2?family=Miranda+Sans:wght@400;500;600;700&display=swap');
@import "tailwindcss";
@import "fumadocs-ui/css/neutral.css";
@import "fumadocs-ui/css/preset.css";

:root {
  --font-fd-sans: 'Miranda Sans', sans-serif;
  --color-fd-background: rgb(248, 250, 252);
  --color-fd-foreground: rgb(30, 41, 59);
  --color-fd-primary: rgb(99, 102, 241);
  --color-fd-primary-foreground: rgb(255, 255, 255);
  --color-fd-border: rgb(209, 213, 219);
  --color-fd-muted: rgb(243, 244, 246);
  --color-fd-muted-foreground: rgb(107, 114, 128);
  --color-fd-accent: rgb(224, 231, 255);
  --color-fd-accent-foreground: rgb(55, 65, 81);
  --color-fd-card: rgb(255, 255, 255);
  --color-fd-card-foreground: rgb(30, 41, 59);
  --color-fd-ring: rgb(99, 102, 241);
}

.dark {
  --color-fd-background: rgb(15, 23, 42);
  --color-fd-foreground: rgb(226, 232, 240);
  --color-fd-primary: rgb(129, 140, 248);
  --color-fd-primary-foreground: rgb(15, 23, 42);
  --color-fd-border: rgb(75, 85, 99);
  --color-fd-muted: rgb(21, 32, 50);
  --color-fd-muted-foreground: rgb(156, 163, 175);
  --color-fd-accent: rgb(55, 65, 81);
  --color-fd-accent-foreground: rgb(209, 213, 219);
  --color-fd-card: rgb(30, 41, 59);
  --color-fd-card-foreground: rgb(226, 232, 240);
  --color-fd-ring: rgb(129, 140, 248);
}
```

**Step 2: Verify dev server renders with new font and colors**

Run: `cd apps/docs && bun run dev`
Expected: Dev server starts. Open browser — text should render in Miranda Sans, primary color should be indigo.

**Step 3: Commit**

```bash
git add apps/docs/app/global.css
git commit -m "style: add Miranda Sans font and indigo color palette"
```

---

### Task 2: Update header navigation links

**Files:**
- Modify: `apps/docs/lib/layout.shared.tsx`

**Step 1: Replace the entire file contents**

```typescript
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
			{
				text: "Domains",
				url: "/docs/overview/what-is-metapowers",
			},
			{
				text: "Getting Started",
				url: "/docs/overview/installation",
			},
			{
				text: "GitHub",
				url: "https://github.com/bromso/metapowers",
				external: true,
			},
		],
	};
}
```

**Step 2: Verify in browser**

Expected: Top nav shows four links — Docs, Domains, Getting Started, GitHub (opens in new tab).

**Step 3: Commit**

```bash
git add apps/docs/lib/layout.shared.tsx
git commit -m "feat: add Domains, Getting Started, and GitHub to header nav"
```

---

### Task 3: Fix footer name — Jonas Broms → Jonas Bröms

**Files:**
- Modify: `apps/docs/app/(home)/page.tsx:348`

**Step 1: Change the name in the footer**

Find:
```tsx
Jonas Broms
```

Replace with:
```tsx
Jonas Bröms
```

This is on line 348 of the file, inside the footer `<a>` tag.

**Step 2: Verify in browser**

Expected: Footer reads "Built by Jonas Bröms".

**Step 3: Commit**

```bash
git add "apps/docs/app/(home)/page.tsx"
git commit -m "fix: correct author name to Jonas Bröms in footer"
```

---

### Task 4: Add GitHub and npm icon links to docs sidebar footer

**Files:**
- Modify: `apps/docs/app/docs/layout.tsx`

**Step 1: Replace the entire file contents**

```typescript
import { source } from "@/lib/source";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { baseOptions } from "@/lib/layout.shared";
import type { ReactNode } from "react";
import { Github } from "lucide-react";

function NpmIcon({ className }: { className?: string }) {
	return (
		<svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
			<path d="M1.763 0C.786 0 0 .786 0 1.763v20.474C0 23.214.786 24 1.763 24h20.474c.977 0 1.763-.786 1.763-1.763V1.763C24 .786 23.214 0 22.237 0zM5.13 5.323h13.74v13.04H16.5V7.476H12.1v10.886H5.13z" />
		</svg>
	);
}

export default function Layout({ children }: { children: ReactNode }) {
	return (
		<DocsLayout
			tree={source.getPageTree()}
			tabs={{}}
			{...baseOptions()}
			sidebar={{
				footer: (
					<div className="flex items-center gap-1">
						<a
							href="https://github.com/bromso/metapowers"
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center justify-center rounded-md p-2 text-fd-muted-foreground hover:text-fd-foreground transition-colors"
							aria-label="GitHub"
						>
							<Github className="size-5" />
						</a>
						<a
							href="https://www.npmjs.com/org/metapowers"
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center justify-center rounded-md p-2 text-fd-muted-foreground hover:text-fd-foreground transition-colors"
							aria-label="npm"
						>
							<NpmIcon className="size-5" />
						</a>
					</div>
				),
			}}
		>
			{children}
		</DocsLayout>
	);
}
```

**Step 2: Verify in browser**

Expected: Bottom-left of the docs sidebar shows GitHub and npm icon buttons. Clicking GitHub opens the repo. Clicking npm opens the org page. Icons are muted gray, darken on hover.

**Step 3: Commit**

```bash
git add apps/docs/app/docs/layout.tsx
git commit -m "feat: add GitHub and npm icon links to docs sidebar footer"
```

---

### Task 5: Build verification

**Step 1: Run full docs build**

Run: `cd apps/docs && bun run build`
Expected: Build succeeds (ignore pre-existing `compliance/examples.mdx` error — unrelated to our changes).

**Step 2: Verify no regressions in our files**

Run: `bun run build 2>&1 | grep -E "global.css|layout.shared|page.tsx|docs/layout"`
Expected: No errors mentioning our modified files.

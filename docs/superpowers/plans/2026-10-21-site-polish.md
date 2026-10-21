# Site Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the Metapowers docs site's homepage and docs chrome in the warm cream / Miranda Sans / coral identity, with calm motion, build-time counts, shared skill-page components adopted by an idempotent codemod, and the audit quick wins (OG image, icons, 404, fonts).

**Architecture:** Everything lives in `apps/docs`. Presentational facts per plugin sit in `lib/domains.ts`; counts come from a generated `lib/site-data.json`. Motion is isolated under `components/motion/` (React Bits copies plus two GSAP hooks) behind one reduced-motion gate. Docs pages keep their tree and URLs; they gain a header band, a dark sidebar, a custom search dialog, and six MDX components that a line-based codemod wires into the existing content without removing words.

**Tech Stack:** Next 16.2 (static export, basePath `/metapowers`), Fumadocs UI/Core 16.8.1, Fumadocs MDX 14.3, Tailwind 4, React 19, GSAP 3.13 + @gsap/react, Vitest 3, Bun 1.3.12, Biome 1.9 (tabs, width 100).

**Spec:** `docs/superpowers/specs/2026-10-21-site-polish-design.md`

## Global Constraints

- New runtime dependencies in `apps/docs` only: `gsap`, `@gsap/react`. No `ogl` (the current React Bits Aurora is dependency-free), no `three`, no `@react-three/fiber`, no `motion`.
- `next.config.mjs` stays as is: `output: "export"`, `trailingSlash: true`, `basePath` `/metapowers` in production, `images.unoptimized`.
- Information architecture is untouched: no edits to any `content/docs/**/meta.json`, no page renames, no URL changes.
- Codemod invariant: no words removed from `content/docs`; content is re-wrapped or moved into frontmatter, never dropped. Hand edits only in the 15 domain `index.mdx` intros and `overview/index.mdx`.
- Identity tokens (spec §3): ground `#F8F4EC` / `#141210`, surface `#FFFFFF` / `#1F1C18`, ink `#1B1916` / `#F3EEE4`, muted `#6B655C` / `#A8A196`, accent soft `#F4B7A0` / `#5A2E22`, gradient stops `#F4B7A0`, `#F9D78F`, `#D6E8D2`. Accent starts at `#D9553A` and is darkened until white text on it reaches 4.5:1. No raw hex in components; tokens only.
- Miranda Sans is the only typeface; headlines weight 500, letter-spacing about -0.03em, line-height about 1.0.
- Motion: everything honours `prefers-reduced-motion: reduce` (static final states; no Aurora); reveals fire once; text reaches opacity ≥ 0.8 within 300 ms of entering the viewport; hero headline settled within 1.2 s; Aurora `dpr` ≤ 1.5, paused when offscreen or tab hidden, `aria-hidden`.
- Copy fixed by the spec: hero headline "Your whole production team, as repeatable workflows."; eyebrow "{skills} skills · {plugins} domains · one command"; install command `/plugin marketplace add bromso/metapowers`; "How it works" title "Three steps, then it's muscle memory."; tiles title "Pick the room you need."; showcase title "A brief in, a numbered artifact out."; closing title "Give your agent a studio."; search placeholder "Find the skill that…"; search empty state "No skill matches. Try a verb: audit, plan, draft."; sidebar search trigger "Find a skill…".
- Nav: wordmark → `/`; Docs → `/docs/overview`; Domains → `#domains`; GitHub → `https://github.com/bromso/metapowers`; Install pill → `#install`.
- Performance budget (homepage, Lighthouse mobile, production build): performance ≥ 90, LCP ≤ 2.5 s, CLS ≤ 0.1, homepage route JS ≤ 250 KB gzipped above the baseline recorded in Task 1.
- Accessibility: WCAG AA contrast everywhere; visible focus rings; keyboard-operable nav and copy buttons.
- Biome formatting (tabs). Conventional commits: `feat(docs):`, `fix(docs):`, `test(docs):`, `chore(docs):`, `ci:`.
- Worktree note: Biome and turbo have stalled in fresh worktrees in this repo. Run `bunx biome format --write <paths>` on specific paths, and run `bun run build` inside `apps/docs` instead of `bun turbo build`.

## Review Focus

1. **A docs slug whose first segment is not a plugin** (for example a future `/docs/guides/...`): the header band must render with the neutral `metapowers` colour, not crash. Pinned by `getDomainForSlug` test in Task 8.
2. **A `## Usage` section with a paragraph before its fence**: the codemod must still lift the first fence into frontmatter and keep the paragraph. Pinned in Task 11 fixtures.
3. **Running the codemod twice**: second run must be a no-op (`--check` exits 0). Pinned in Task 11.
4. **Rendering on the server or with reduced motion**: `prefersReducedMotion()` must not touch `window` when it is undefined, and must return `true` under the media query so Aurora and SplitText render their static fallbacks. Pinned in Task 4.
5. **Search client and index mismatch**: the route exports a flexsearch index while the current `RootProvider` asks for `type: "static"` (Orama). The new dialog must use `type: "flexsearch-static"` and a search for "audit" on the built site must return results. Pinned by the verification step in Task 10.

---

### Task 1: Test harness, dependencies and hygiene

**Files:**
- Modify: `.gitignore` (add `.superpowers/`)
- Modify: `apps/docs/package.json`
- Create: `apps/docs/vitest.config.ts`
- Create: `apps/docs/turbo.json`
- Create: `apps/docs/scripts/smoke.test.ts` (deleted in Task 2 once a real test exists)

**Interfaces:**
- Produces: `bun run test` inside `apps/docs` runs Vitest over `scripts/**/*.test.ts` and `lib/**/*.test.ts`; `bun run check` inside `apps/docs` is the `--check` entry point later tasks extend; turbo runs docs `test` and `check` without building Next first.

- [ ] **Step 1: Add `.superpowers/` to `.gitignore`** as its own line after `.claude/worktrees/`.

- [ ] **Step 2: Add dependencies and scripts to `apps/docs/package.json`**

Dependencies: `"gsap": "^3.13.0"`, `"@gsap/react": "^2.1.2"`. Dev dependencies: `"vitest": "^3.0.0"`. Scripts added: `"test": "vitest run"`, `"gen:data": "bun scripts/gen-site-data.ts"`, `"codemod": "bun scripts/codemod-skill-pages.ts"`, `"check": "bun scripts/gen-site-data.ts --check && bun scripts/codemod-skill-pages.ts --check"`, and `build` becomes `"bun scripts/gen-site-data.ts && next build"`. (The two scripts do not exist yet; `check` and `build` are wired now so later tasks only add files.)

- [ ] **Step 3: Create `apps/docs/vitest.config.ts`** mirroring `packages/plugin-tools/vitest.config.ts` with `include: ["scripts/**/*.test.ts", "lib/**/*.test.ts"]`.

- [ ] **Step 4: Create `apps/docs/turbo.json`**

```json
{
	"$schema": "https://turbo.build/schema.json",
	"extends": ["//"],
	"tasks": {
		"test": { "dependsOn": [], "cache": false },
		"check": { "dependsOn": [], "cache": false }
	}
}
```

- [ ] **Step 5: Create `apps/docs/scripts/smoke.test.ts`** with one test `expect(1 + 1).toBe(2)` so the harness is proven.

- [ ] **Step 6: Install and run**

Run: `bun install` (from the worktree root), then `bun run test` inside `apps/docs`.
Expected: 1 test passed.

- [ ] **Step 7: Record the JS baseline**

Run: `bun run build` inside `apps/docs` (the `gen:data` step will fail because the script does not exist yet; temporarily run `next build` directly for this one measurement). Note the "First Load JS" for route `/` from the build output in the commit message body.
Expected: build succeeds; number recorded.

- [ ] **Step 8: Commit**

```bash
git add .gitignore apps/docs/package.json apps/docs/vitest.config.ts apps/docs/turbo.json apps/docs/scripts/smoke.test.ts bun.lock
git commit -m "chore(docs): test harness, gsap deps, ignore .superpowers (baseline / JS: <n> kB)"
```

---

### Task 2: Generated site data and the domains table

**Files:**
- Create: `apps/docs/scripts/gen-site-data.ts`
- Create: `apps/docs/scripts/gen-site-data.test.ts`
- Create: `apps/docs/lib/site-data.json` (generated, committed)
- Create: `apps/docs/lib/domains.ts`
- Create: `apps/docs/lib/site.ts`
- Create: `apps/docs/lib/site.test.ts`
- Delete: `apps/docs/scripts/smoke.test.ts`

**Interfaces:**
- Produces:
  - `generateSiteData(pluginsDir: string): SiteData` and `writeSiteData(pluginsDir: string, outFile: string, check: boolean): number` (exit code) in `gen-site-data.ts`; CLI: `bun scripts/gen-site-data.ts [--check]`, resolving `pluginsDir` to `../../plugins` relative to the script.
  - `type SiteData = { plugins: { slug: string; name: string; skills: number; hasEvals: boolean }[]; totals: { skills: number; plugins: number; evalSuites: number; agents: 4 } }`. `plugins` sorted by slug; JSON written with tabs and a trailing newline; no timestamp.
  - `lib/domains.ts`: `type Domain = { slug: string; name: string; methodology: string; colour: string; icon: LucideIcon; blurb: string; docsPath: string }`; `export const domains: Domain[]` with one entry per plugin (16, including `metapowers` with `docsPath: "/docs/overview"`; others `/docs/<slug>`). Colours are six pastel tokens defined once as CSS variables `--domain-coral|amber|sage|lilac|sky|sand` in Task 3; `colour` holds the token name, e.g. `"coral"`. Methodology and blurb text come from the existing `domains` array in `app/(home)/page.tsx`; `metapowers` gets methodology "Meta skills" and blurb "Detect gaps, find, create and improve skills; init and report on any project."
  - `lib/site.ts`: `getDomains(): (Domain & { skills: number; hasEvals: boolean })[]` (joined, sorted by name with `metapowers` last), `getTotals(): SiteData["totals"]`, `getDomainForSlug(slug: string[] | undefined): Domain | undefined` (maps `"overview"` to `metapowers`; unknown → `undefined`).

- [ ] **Step 1: Write the failing generator tests** in `gen-site-data.test.ts` using a temp directory fixture with two fake plugins (`alpha`: 2 skills, has `evals/`; `beta`: 0 skills, no evals):

```ts
test("counts skills, plugins and eval suites", () => {
	const data = generateSiteData(fixtureDir);
	expect(data.plugins).toEqual([
		{ slug: "alpha", name: "Alpha", skills: 2, hasEvals: true },
		{ slug: "beta", name: "Beta", skills: 0, hasEvals: false },
	]);
	expect(data.totals).toEqual({ skills: 2, plugins: 2, evalSuites: 1, agents: 4 });
});
test("throws a clear error when plugin.json is missing", ...); // message contains the plugin dir name
test("--check returns 1 when the committed file differs and 0 when equal", ...);
test("output is byte-identical on a second run", ...);
```

- [ ] **Step 2: Run to verify failure.** Run: `bun run test` in `apps/docs`. Expected: FAIL, module not found.

- [ ] **Step 3: Implement `gen-site-data.ts`** (name from `plugin.json` `name`, skills = directories under `skills/` containing `SKILL.md`, `hasEvals` = `evals/` directory exists; `import.meta.main` guards the CLI).

- [ ] **Step 4: Run tests.** Expected: PASS.

- [ ] **Step 5: Generate the real file.** Run: `bun run gen:data` in `apps/docs`. Expected: `lib/site-data.json` exists with `totals.skills` 283 and `totals.plugins` 16. Run `bun run gen:data -- --check`. Expected: exit 0.

- [ ] **Step 6: Write the failing join tests** in `lib/site.test.ts`:

```ts
test("every plugin in site-data has a domain entry and vice versa", () => {
	const dataSlugs = siteData.plugins.map((p) => p.slug).sort();
	const domainSlugs = domains.map((d) => d.slug).sort();
	expect(domainSlugs).toEqual(dataSlugs);
});
test("getDomainForSlug maps overview to metapowers and unknown to undefined", () => {
	expect(getDomainForSlug(["overview", "status"])?.slug).toBe("metapowers");
	expect(getDomainForSlug(["design"])?.slug).toBe("design");
	expect(getDomainForSlug(["guides"])).toBeUndefined();
	expect(getDomainForSlug(undefined)).toBeUndefined();
});
test("getDomains puts metapowers last and carries counts", ...);
```

- [ ] **Step 7: Implement `lib/domains.ts` and `lib/site.ts`**; delete `scripts/smoke.test.ts`.

- [ ] **Step 8: Run tests.** Expected: all PASS.

- [ ] **Step 9: Commit**

```bash
git add apps/docs/scripts apps/docs/lib
git commit -m "feat(docs): generate site data from plugins; single domains table"
```

---

### Task 3: Theme tokens and fonts

**Files:**
- Modify: `apps/docs/app/global.css`
- Modify: `apps/docs/app/layout.tsx`
- Move: `apps/docs/public/fonts/*.ttf` → `apps/docs/app/fonts/*.ttf`

**Interfaces:**
- Produces: CSS custom properties on `:root` and `.dark`: the full Fumadocs set (`--color-fd-background`, `-foreground`, `-muted`, `-muted-foreground`, `-popover`, `-popover-foreground`, `-card`, `-card-foreground`, `-border`, `-primary`, `-primary-foreground`, `-secondary`, `-secondary-foreground`, `-accent`, `-accent-foreground`, `-ring`) mapped to spec §3; site tokens `--mp-ground`, `--mp-surface`, `--mp-ink`, `--mp-muted`, `--mp-accent`, `--mp-accent-soft`, `--mp-grad-1|2|3`; domain tokens `--domain-coral`, `--domain-amber`, `--domain-sage`, `--domain-lilac`, `--domain-sky`, `--domain-sand` (light and dark values); `--fd-layout-width: 1400px`; Tailwind utilities via `@theme inline` so classes like `bg-mp-ground`, `text-mp-ink`, `bg-domain-coral` exist. Font variable `--font-fd-sans` resolves to Miranda Sans through `next/font/local`.

- [ ] **Step 1: Move the four TTF files** to `apps/docs/app/fonts/` and delete the `@font-face` blocks from `global.css`.

- [ ] **Step 2: Load the font in `app/layout.tsx`** with `localFont` from `next/font/local`: four `src` entries (weights 400/500/600/700, style normal), `display: "swap"`, `variable: "--font-miranda"`; put `mirandaSans.variable` on `<html className>`. In `global.css`, `:root { --font-fd-sans: var(--font-miranda), ui-sans-serif, system-ui, sans-serif; }`.

- [ ] **Step 3: Replace the `:root` and `.dark` token blocks** with the full set from the Interfaces block. Accent: start from `#D9553A` and darken until `white` on it measures ≥ 4.5:1 (record the final hex in a CSS comment with the measured ratio); dark accent lightened until ink `#141210` on it is ≥ 4.5:1. `--color-fd-primary` = accent; `--color-fd-background` = ground; `--color-fd-card` = surface; `--color-fd-foreground` = ink; `--color-fd-muted-foreground` = muted; `--color-fd-accent` = accent soft at 40% alpha; `--color-fd-ring` = accent.

- [ ] **Step 4: Add headline utilities** in `global.css`: `.mp-display { font-weight: 500; letter-spacing: -0.03em; line-height: 1; }`, `.mp-eyebrow { font-size: 0.75rem; letter-spacing: 0.14em; text-transform: uppercase; color: var(--mp-muted); }`.

- [ ] **Step 5: Verify.** Run: `bun run build` in `apps/docs`. Expected: success; `grep -r "metapowers/fonts" app/` returns nothing; the built `out/index.html` references a hashed font under `/metapowers/_next/static/media/`.

- [ ] **Step 6: Commit**

```bash
git add apps/docs/app apps/docs/public
git commit -m "feat(docs): cream/ink/coral theme tokens; Miranda Sans via next/font"
```

---

### Task 4: Motion primitives

**Files:**
- Create: `apps/docs/components/motion/Aurora.tsx`, `SplitText.tsx`, `SpotlightCard.tsx` (copied from React Bits)
- Create: `apps/docs/components/motion/README.md`
- Create: `apps/docs/lib/motion.ts`, `apps/docs/lib/motion.test.ts`
- Create: `apps/docs/lib/gsap.ts`
- Create: `apps/docs/components/motion/Reveal.tsx`, `CountUp.tsx`

**Interfaces:**
- Produces:
  - `prefersReducedMotion(): boolean` (pure; `false` when `window` or `matchMedia` is undefined) and `usePrefersReducedMotion(): boolean` (client hook, subscribes to the media query) in `lib/motion.ts`.
  - `lib/gsap.ts`: `export { gsap, ScrollTrigger, useGSAP }` with `gsap.registerPlugin(ScrollTrigger, useGSAP)` run once.
  - `Reveal({ children, delay?: number, as?: keyof JSX.IntrinsicElements, className? })`: fades/rises children once when 20% in view (`ScrollTrigger` `once: true`, from `y: 16, opacity: 0`, duration 0.45 s, ease `power2.out`, so opacity passes 0.8 before 300 ms); with reduced motion renders children statically.
  - `CountUp({ to: number, duration?: number, className? })`: counts from 0 to `to` once when in view using `gsap.to` on a number object with `snap: 1`, formatted with `toLocaleString("en-US")`; with reduced motion renders `to` immediately.
  - React Bits components keep their upstream props; each file starts with a comment `// Source: https://reactbits.dev/r/<Name>-TS-TW.json (MIT + Commons Clause), copied <date>`.

- [ ] **Step 1: Write the failing tests** in `lib/motion.test.ts`:

```ts
test("prefersReducedMotion is false without a window", () => {
	expect(prefersReducedMotion()).toBe(false);
});
test("prefersReducedMotion reads the media query when present", () => {
	(globalThis as any).window = { matchMedia: () => ({ matches: true }) };
	expect(prefersReducedMotion()).toBe(true);
	delete (globalThis as any).window;
});
```

- [ ] **Step 2: Run to verify failure.** Expected: FAIL, module not found.

- [ ] **Step 3: Implement `lib/motion.ts` and `lib/gsap.ts`.**

- [ ] **Step 4: Run tests.** Expected: PASS.

- [ ] **Step 5: Copy the three React Bits components.** For each of `Aurora`, `SplitText`, `SpotlightCard`: fetch `https://reactbits.dev/r/<Name>-TS-TW.json`, write `files[0].content` to `components/motion/<Name>.tsx`, add the source comment, run Biome on the file. Confirm the registry `dependencies` list contains nothing beyond `gsap` and `@gsap/react`.

- [ ] **Step 6: Gate the copies.** In `Aurora.tsx`, early-return `null` when `usePrefersReducedMotion()` is true, add `aria-hidden="true"` to the container, cap `dpr` at 1.5, and pause the render loop when `document.hidden` or when the container is not intersecting the viewport (IntersectionObserver). In `SplitText.tsx`, render the plain `text` inside the `tag` when reduced motion is on.

- [ ] **Step 7: Implement `Reveal.tsx` and `CountUp.tsx`** as `"use client"` components using `lib/gsap.ts` and `usePrefersReducedMotion`.

- [ ] **Step 8: Write `components/motion/README.md`**: origin of the three files, license (MIT + Commons Clause; used in this site, not redistributed), the local modifications from Step 6, and the rule that all motion goes through `lib/motion.ts`.

- [ ] **Step 9: Verify.** Run: `bun run build` in `apps/docs`. Expected: success (components are unused yet, but must type-check).

- [ ] **Step 10: Commit**

```bash
git add apps/docs/components/motion apps/docs/lib
git commit -m "feat(docs): motion primitives (Aurora, SplitText, SpotlightCard, Reveal, CountUp) behind reduced-motion gate"
```

---

### Task 5: Home chrome, hero and install strip

**Files:**
- Create: `apps/docs/components/ui/Pill.tsx`, `Eyebrow.tsx`, `CopyButton.tsx`, `Terminal.tsx`, `Icons.tsx`
- Create: `apps/docs/components/home/SiteNav.tsx`, `Hero.tsx`, `InstallStrip.tsx`, `SiteFooter.tsx`
- Modify: `apps/docs/app/(home)/layout.tsx`
- Modify: `apps/docs/app/(home)/page.tsx` (replace wholesale; sections 3–7 arrive in Task 6)

**Interfaces:**
- Consumes: `getTotals()` from Task 2; `Aurora`, `SplitText`, `usePrefersReducedMotion`, `lib/gsap.ts` from Task 4; tokens from Task 3.
- Produces:
  - `Pill({ href, variant: "primary" | "outline" | "ghost", children, external? })` renders `next/link` or `<a>`; full pill radius; primary = accent fill + white text.
  - `Eyebrow({ children, as? })` applies `.mp-eyebrow`.
  - `CopyButton({ text, label? })` client component: copies `text`, shows "Copied" for 2 s, `aria-live="polite"`.
  - `Terminal({ command, note?, className? })`: ink block, prompt glyph `❯` in accent soft, monospace command, `CopyButton`.
  - `Icons.tsx`: `GitHubIcon`, `NpmIcon` moved here from `page.tsx` and `app/docs/layout.tsx`.
  - `SiteNav()` with the five links from Global Constraints and the Fumadocs theme toggle (`ThemeToggle` from `fumadocs-ui/components/layout/theme-toggle`); fixed, transparent over the hero, gains a cream/ink blur background after 80 px of scroll.
  - `Hero({ skills, plugins })`: outer `<section>` of height 160vh; inner sticky 100vh panel with static CSS gradient (`--mp-grad-*`) underneath `<Aurora lightMode direction="bottom" colorStops=[grad-1, grad-2, grad-3] dpr={1.5} />`; headline via `SplitText` (`splitType="words"`, `delay` 60 ms, `duration` 0.9 s, tag `h1`, class `mp-display`); eyebrow; two pills ("Add the marketplace" → `#install`, "Browse skills" → `/docs/overview`). A `useGSAP` ScrollTrigger scrubbed over the outer section animates the panel `scale` 1 → 0.9, `borderRadius` 0 → 32px, and inset margin 0 → 24px. With reduced motion, the panel renders at scale 1 with 0 radius and no ScrollTrigger.
  - `InstallStrip()`: `<section id="install">` with `Terminal command="/plugin marketplace add bromso/metapowers"` and the muted line "Also: `npx create-metapowers` for Codex · OpenCode · Cursor" linking to `/docs/overview/installation`.
  - `SiteFooter()`: Docs · Domains · GitHub · npm · MIT · "Built by Jonas Bröms".

- [ ] **Step 1: Replace `app/(home)/layout.tsx`**: drop `HomeLayout`; render `<SiteNav />`, `{children}`, `<SiteFooter />` inside a `<div className="bg-mp-ground text-mp-ink">`.

- [ ] **Step 2: Create the `components/ui/*` primitives and `Icons.tsx`**; update `app/docs/layout.tsx` to import `GitHubIcon`/`NpmIcon` from `components/ui/Icons`.

- [ ] **Step 3: Create `SiteNav.tsx`, `Hero.tsx`, `InstallStrip.tsx`, `SiteFooter.tsx`** per the Interfaces block.

- [ ] **Step 4: Rewrite `app/(home)/page.tsx`** as a server component: `const totals = getTotals();` then `<Hero skills={totals.skills} plugins={totals.plugins} />` and `<InstallStrip />` with a `{/* sections 3–7: Task 6 */}` placeholder. Remove the old `domains`, `stats`, `steps`, `installTabs`, `skillManagement`, `InstallTabs`, `DomainCard` code.

- [ ] **Step 5: Verify in the browser.** Run: `bun run dev` in `apps/docs`, open `http://localhost:3000/`. Expected: gradient hero with animated headline, nav fixed, hero shrinks into a rounded card while scrolling the first 60vh, install strip copies the command. Toggle "Reduce motion" in OS settings and reload: static gradient, plain headline, no shrink. Stop the dev server.

- [ ] **Step 6: Build.** Run: `bun run build` in `apps/docs`. Expected: success.

- [ ] **Step 7: Commit**

```bash
git add apps/docs/app apps/docs/components
git commit -m "feat(docs): new home chrome, cinematic hero and install strip"
```

---

### Task 6: Homepage sections 3–7

**Files:**
- Create: `apps/docs/components/home/HowItWorks.tsx`, `DomainTiles.tsx`, `DomainTile.tsx`, `SkillShowcase.tsx`, `NumbersStrip.tsx`, `ClosingCta.tsx`
- Modify: `apps/docs/app/(home)/page.tsx`

**Interfaces:**
- Consumes: `getDomains()`, `getTotals()` (Task 2); `Reveal`, `CountUp`, `SpotlightCard` (Task 4); `Pill`, `Eyebrow`, `Terminal` (Task 5).
- Produces:
  - `DomainTile({ domain: ReturnType<typeof getDomains>[number], compact?: boolean })`: `SpotlightCard theme="light"` wrapping a `next/link` to `domain.docsPath`; shows a swatch coloured with `style={{ background: \`var(--domain-${domain.colour})\` }}` (Tailwind cannot see dynamic class names; every swatch in the site uses this inline-variable form), the lucide icon, name, "{skills} skills", methodology; `metapowers` tile is ink-on-ink inverted. Reused by `DomainGrid` in Task 8.
  - `DomainTiles()`: `<section id="domains">`, eyebrow "{plugins} domains · {skills} skills", title "Pick the room you need.", 2-column grid on phones, 4 columns from `lg`, tiles wrapped in `Reveal` with a 40 ms stagger.
  - `HowItWorks()`: eyebrow "How it works", title "Three steps, then it's muscle memory.", three `Reveal` columns with numerals 01/02/03 and the three sentences from spec §4.3.
  - `SkillShowcase()`: eyebrow "What a skill looks like", title "A brief in, a numbered artifact out."; left card = frontmatter plus the first three process steps of `plugins/design/skills/empathize/SKILL.md` (hand-copied, ≤ 14 lines); right card = a `Terminal`-styled tree for `.metapowers/design/<project>/` listing the design plugin's numbered artifacts.
  - `NumbersStrip()`: four `CountUp`s: skills, plugins, eval suites, agents (labels "skills", "domains", "eval suites", "agents supported").
  - `ClosingCta()`: ink section, title "Give your agent a studio.", pills "Add the marketplace" (→ `#install`) and "Star on GitHub" (outline, external).

- [ ] **Step 1: Create the six components** per the Interfaces block.

- [ ] **Step 2: Compose `page.tsx`**: Hero, InstallStrip, HowItWorks, DomainTiles, SkillShowcase, NumbersStrip, ClosingCta, in that order.

- [ ] **Step 3: Verify in the browser** (`bun run dev`): tiles light up on hover and link to the right docs path (metapowers → `/docs/overview`); numbers count once; reveals do not replay when scrolling back up; with reduced motion every section is static and complete. Check phone width (400 px): 2-column tiles, no horizontal scroll.

- [ ] **Step 4: Build and compare JS.** Run: `bun run build` in `apps/docs`. Expected: success; "First Load JS" for `/` ≤ baseline from Task 1 + 250 kB. Record the number in the commit body.

- [ ] **Step 5: Commit**

```bash
git add apps/docs/app apps/docs/components/home
git commit -m "feat(docs): homepage sections — how it works, domain tiles, showcase, numbers, closing CTA"
```

---

### Task 7: Skill-page MDX components

**Files:**
- Create: `apps/docs/components/docs/Command.tsx`, `Steps.tsx`, `Output.tsx`, `Requires.tsx`, `NextPhase.tsx`
- Modify: `apps/docs/components/mdx.tsx`
- Create: `apps/docs/content/docs/overview/reference/component-gallery.mdx` (temporary; deleted in Step 5)

**Interfaces:**
- Consumes: `Terminal`, `CopyButton`, `Eyebrow` (Task 5).
- Produces (all registered in `getMDXComponents` under these exact names):
  - `Command({ children: string, note?: string })` → `Terminal`.
  - `Steps({ children })` and `Step({ title?: string, children })`: `Steps` renders a grid of cards with numerals; when `children` is a single `<ol>` element (plain MDX list) it maps each `<li>` to a `Step`.
  - `Output({ children })`: surface card with a 3 px accent left rule.
  - `Requires({ mcp?: { name: string; description?: string }[], config?: string[], skills?: string[] })`: badge rows labelled "MCP tools", "User config", "Skills"; MCP badges show `description` beneath the name.
  - `NextPhase({ href: string, title: string, children? })`: arrow card; `children` rendered as the body sentence.

- [ ] **Step 1: Create the five components** and register them in `components/mdx.tsx`.

- [ ] **Step 2: Create the temporary gallery page** that uses every component with realistic content (copy the `a11y-audit.mdx` sections into the new shapes), including a `<Steps>` fed a plain ordered list.

- [ ] **Step 3: Verify in the browser** at `/docs/overview/reference/component-gallery`: all five render; `Command` copies; keyboard focus visible on the copy button; dark mode legible.

- [ ] **Step 4: Build.** Run: `bun run build` in `apps/docs`. Expected: success.

- [ ] **Step 5: Delete the gallery page**, rebuild to confirm, and commit:

```bash
git add apps/docs/components
git commit -m "feat(docs): Command, Steps, Output, Requires and NextPhase MDX components"
```

---

### Task 8: Frontmatter schema, skill header band and DomainGrid

**Files:**
- Modify: `apps/docs/source.config.ts`
- Create: `apps/docs/components/docs/SkillHeader.tsx`, `apps/docs/components/docs/DomainGrid.tsx`
- Modify: `apps/docs/app/docs/[[...slug]]/page.tsx`
- Modify: `apps/docs/components/mdx.tsx` (register `DomainGrid`)

**Interfaces:**
- Consumes: `getDomainForSlug`, `getDomains` (Task 2); `DomainTile` (Task 6); `Command` (Task 7); `source` from `lib/source.ts`.
- Produces:
  - Frontmatter schema: `pageSchema.extend({ command: z.string().optional(), kind: z.enum(["phase", "utility", "overview"]).optional() })` using `pageSchema` from `fumadocs-core/source/schema` and `z` from `zod` (v4 is already installed through Fumadocs; add `"zod": "^4.0.0"` to `apps/docs` dependencies so the import is explicit).
  - `SkillHeader({ domain?: Domain, kind: "phase" | "utility" | "overview", title: string, description?: string, command?: string })`: gradient band from `var(--domain-<colour>)` (neutral `--mp-accent-soft` when `domain` is undefined) to transparent; eyebrow "{domain.name} · {kind}" (just the kind when no domain); `h1.mp-display`; description; `Command` when `command` is set.
  - `DomainGrid({ domain?: string })`: with `domain`, lists `source.getPages()` whose URL starts with `/docs/<domain>/` excluding the index page, as compact tiles showing kind, title and command (from `page.data`); eyebrow "{skills} skills in this domain" from `getDomains()`; without `domain`, renders `DomainTile` for every domain.

- [ ] **Step 1: Extend the schema** in `source.config.ts`. Run: `bun run build` in `apps/docs`. Expected: success; `page.data.command` and `page.data.kind` type-check in `page.tsx`.

- [ ] **Step 2: Create `SkillHeader.tsx` and `DomainGrid.tsx`**; register `DomainGrid` in `mdx.tsx`.

- [ ] **Step 3: Wire `page.tsx`**: replace `DocsTitle`/`DocsDescription` with `<SkillHeader domain={getDomainForSlug(params.slug)} kind={page.data.kind ?? "overview"} title=… description=… command={page.data.command} />`.

- [ ] **Step 4: Temporarily add `command: "/design:a11y-audit"` and `kind: utility`** to `content/docs/design/a11y-audit.mdx` and `<DomainGrid domain="design" />` to the end of `content/docs/design/index.mdx`; run `bun run dev`; verify the band shows "Design · utility" with the command, the grid lists design pages, and `/docs/overview/status` shows the metapowers colour. Revert both content edits (Task 12 does them properly).

- [ ] **Step 5: Build.** Expected: success.

- [ ] **Step 6: Commit**

```bash
git add apps/docs/source.config.ts apps/docs/components apps/docs/app/docs apps/docs/package.json bun.lock
git commit -m "feat(docs): command/kind frontmatter, skill header band, DomainGrid"
```

---

### Task 9: Dark sidebar with domain swatches

**Files:**
- Create: `apps/docs/components/docs/sidebar.tsx` (client)
- Modify: `apps/docs/app/docs/layout.tsx`
- Modify: `apps/docs/app/global.css`

**Interfaces:**
- Consumes: `domains` from `lib/domains.ts`; `fumadocs-ui/components/sidebar/base` (`SidebarFolder`, `SidebarFolderTrigger`, `SidebarFolderLink`, `SidebarFolderContent`, `SidebarItem`, `SidebarSeparator`, `useFolderDepth`); `SidebarPageTreeComponents` type from `fumadocs-ui/components/sidebar/page-tree`.
- Produces: `sidebarComponents: Partial<SidebarPageTreeComponents>` exporting `Folder`, `Item`, `Separator`. `Folder` finds its domain by matching `item.index?.url` (or the first child item URL) against `/docs/<slug>` (overview → metapowers) and renders a 10 px rounded swatch coloured by inline `var(--domain-<colour>)` before the name. `Separator` renders with `.mp-eyebrow`. `Item` keeps Fumadocs behaviour with the new tokens.

- [ ] **Step 1: Create `components/docs/sidebar.tsx`** per the Interfaces block (`"use client"`).

- [ ] **Step 2: Pass it to `DocsLayout`** in `app/docs/layout.tsx`: `sidebar={{ components: sidebarComponents, footer: <existing icons/> }}`; set `searchToggle={{ components: { lg: <custom trigger text "Find a skill…" with ⌘K hint> } }}` if the installed `searchToggle` type allows a custom component; otherwise set the placeholder text through the i18n provider's `search` string in `RootProvider` (`i18n={{ locale: "en", translations: { search: "Find a skill…" } }}`). Pick whichever type-checks; note the choice in the commit body.

- [ ] **Step 3: Style the sidebar dark in both themes** in `global.css` by scoping the Fumadocs sidebar container (`#nd-sidebar`, or the `aside` with `data-sidebar` the installed version renders; check the built HTML) to ink background, cream text and muted separators, in both `:root` and `.dark`.

- [ ] **Step 4: Verify in the browser**: tree order and labels unchanged versus `main`; swatches match the homepage tiles; the active item is legible; collapse/expand works; mobile drawer opens.

- [ ] **Step 5: Build.** Expected: success.

- [ ] **Step 6: Commit**

```bash
git add apps/docs/components/docs/sidebar.tsx apps/docs/app
git commit -m "feat(docs): dark sidebar with domain swatches"
```

---

### Task 10: Search dialog

**Files:**
- Create: `apps/docs/components/search.tsx` (client)
- Modify: `apps/docs/app/layout.tsx`

**Interfaces:**
- Consumes: `useDocsSearch` from `fumadocs-core/search/client` with `{ type: "flexsearch-static", from: "/metapowers/api/search" }` in production and `"/api/search"` in development (derive from `process.env.NODE_ENV === "production"` the same way `next.config.mjs` does); `SearchDialog*` primitives and `SearchItemType` from `fumadocs-ui/components/dialog/search`; `getDomainForSlug`.
- Produces: `default export SearchDialog(props: SharedProps)`; input placeholder "Find the skill that…"; results grouped by domain (derive the slug from each result's `url` after `/docs/`), each group headed by the domain swatch and name, page-type results showing their title; `Empty` renders "No skill matches. Try a verb: audit, plan, draft."; footer shows "↵ open · esc close".

- [ ] **Step 1: Create `components/search.tsx`** per the Interfaces block, grouping `query.data` (when not `"empty"`) by domain and passing a custom `Item` to `SearchDialogList`.

- [ ] **Step 2: Register it** in `app/layout.tsx`: `search={{ SearchDialog }}`, removing the old `options`.

- [ ] **Step 3: Verify on the production build.** Run: `bun run build` in `apps/docs`, then `bunx serve out -l 4173` from `apps/docs`, open `http://localhost:4173/metapowers/docs/overview/`, press ⌘K, type `audit`. Expected: results grouped under Design and Accessibility (at least), Enter navigates. Stop the server.

- [ ] **Step 4: Commit**

```bash
git add apps/docs/components/search.tsx apps/docs/app/layout.tsx
git commit -m "feat(docs): skill-oriented search dialog on the flexsearch static index"
```

---

### Task 11: Codemod for skill pages

**Files:**
- Create: `apps/docs/scripts/codemod-skill-pages.ts`
- Create: `apps/docs/scripts/codemod-skill-pages.test.ts`
- Create: `apps/docs/scripts/__fixtures__/single-skill.mdx`, `single-skill.expected.mdx`, `usage-with-paragraph.mdx`, `usage-with-paragraph.expected.mdx`, `phase-group.mdx`, `phase-group.expected.mdx`, `nothing-to-do.mdx`, `meta.json`

**Interfaces:**
- Produces:
  - `deriveKind(fileBase: string, meta: { pages: string[] } | undefined): "phase" | "utility" | "overview"` — walks `pages`; separators `---Phases---` → `phase`, `---Utilities---` | `---Skill Management---` | `---Project---` | `---Meta Skills---` → `utility`; everything else, pages before any separator, and files absent from `meta` → `overview`.
  - `transformDoc(src: string, kind: Kind): { out: string; changed: boolean; report: string[] }` — pure; line/section based (split body on lines starting with `## `); applies the six rules of spec §7.5 and writes `kind` (and `command` when exactly one Usage fence exists) into frontmatter directly after `description`, preserving all other keys and order; skips any rule whose target already contains the component (idempotent).
  - `runCodemod(contentDir: string, check: boolean): number` — walks `**/*.mdx`, reads the sibling `meta.json`, writes changed files unless `check`; prints a report (`changed: <path>` lines, then `unmatched: <path> — <section>` lines); returns 1 in check mode if anything would change, else 0.
  - CLI: `bun scripts/codemod-skill-pages.ts [--check] [--dir <contentDir>]`, default dir `content/docs` relative to the script's `..`.
- Rule details the tests pin:
  - Usage: the first fenced block anywhere in the section is lifted; the heading stays unless the section is then empty (whitespace only).
  - What It Does: items `1. Sentence one. Sentence two.` → `<Step title="Sentence one.">Sentence two.</Step>`; single-sentence items → `<Step>Whole item.</Step>`.
  - MCP Tools Used: items shaped `` - `name` — description `` → `<Requires mcp={[{ name: "name", description: "description" }]} />` (one object per item, JSON-stringified strings).
  - Next Phase: the paragraph's first markdown link supplies `href` and `title`; the paragraph with the link replaced by its text becomes the children.
  - Phase-group pages: inside `## Skills`, each fence → `<Command>`, each `**Output:** …` line → `<Output>…</Output>`; frontmatter `command` is not written.

- [ ] **Step 1: Write the fixtures.** `single-skill.mdx` is a copy of `content/docs/design/a11y-audit.mdx` plus a `## Next Phase` paragraph with a link; `usage-with-paragraph.mdx` has a paragraph between `## Usage` and the fence and an `**Example:**` block after it; `phase-group.mdx` is the first two skills of `content/docs/security/identify.mdx`; `nothing-to-do.mdx` is a copy of `content/docs/design/artifacts.mdx`. Hand-write each `.expected.mdx` following the rules above (they are the specification of the output).

- [ ] **Step 2: Write the failing tests:**

```ts
test.each(["single-skill", "usage-with-paragraph", "phase-group"])("transforms %s", (name) => {
	const { out, changed } = transformDoc(read(`${name}.mdx`), "utility");
	expect(changed).toBe(true);
	expect(out).toBe(read(`${name}.expected.mdx`));
});
test("is idempotent", () => {
	const once = transformDoc(read("single-skill.mdx"), "utility").out;
	const twice = transformDoc(once, "utility");
	expect(twice.changed).toBe(false);
	expect(twice.out).toBe(once);
});
test("leaves a page with nothing to transform unchanged except kind", () => {
	const { out, report } = transformDoc(read("nothing-to-do.mdx"), "overview");
	expect(out.replace("kind: overview\n", "")).toBe(read("nothing-to-do.mdx"));
	expect(report).toEqual([]);
});
test("removes no words", () => {
	for (const name of ["single-skill", "usage-with-paragraph", "phase-group"]) {
		expect(words(transformDoc(read(`${name}.mdx`), "utility").out)).toEqual(expect.arrayContaining(words(read(`${name}.mdx`))));
	}
}); // words() lowercases and splits on non-letters, dropping markdown/JSX punctuation
test("deriveKind follows meta separators", () => {
	const meta = { pages: ["index", "---Phases---", "empathize", "---Utilities---", "a11y-audit", "---Memory---", "storage"] };
	expect(deriveKind("empathize", meta)).toBe("phase");
	expect(deriveKind("a11y-audit", meta)).toBe("utility");
	expect(deriveKind("storage", meta)).toBe("overview");
	expect(deriveKind("index", meta)).toBe("overview");
	expect(deriveKind("unlisted", undefined)).toBe("overview");
});
test("runCodemod --check returns 1 when files would change and 0 after writing", ...); // temp dir copy of fixtures + meta.json
```

- [ ] **Step 3: Run to verify failure.** Expected: FAIL, module not found.

- [ ] **Step 4: Implement `codemod-skill-pages.ts`.**

- [ ] **Step 5: Run tests.** Expected: all PASS. Run `bun run codemod -- --check` in `apps/docs` against the real content. Expected: exit 1 with a long `changed:` list and the `unmatched:` list; read the unmatched list and extend the fixtures/rules only where a pattern repeats on 3+ pages. Re-run tests.

- [ ] **Step 6: Commit**

```bash
git add apps/docs/scripts
git commit -m "feat(docs): idempotent codemod wiring skill pages into the new components"
```

---

### Task 12: Apply the codemod to the content

**Files:**
- Modify: `apps/docs/content/docs/**/*.mdx` (codemod output only)

**Interfaces:**
- Consumes: Task 11 CLI.

- [ ] **Step 1: Run the codemod.** Run: `bun run codemod` in `apps/docs`. Save the printed report to the SDD workspace (not the repo).

- [ ] **Step 2: Check idempotency.** Run: `bun run codemod -- --check`. Expected: exit 0. Run: `bun run check`. Expected: exit 0.

- [ ] **Step 3: Review the diff for word loss.** Run from the worktree root: `git diff --stat apps/docs/content | tail -1`, then for five sampled pages (`design/a11y-audit.mdx`, `security/identify.mdx`, `marketing/<any phase>.mdx`, `overview/status.mdx`, `legal/<any utility>.mdx`) read the diff and confirm only wrapping, frontmatter additions and fence moves. Confirm every page has `kind:` in frontmatter: `grep -L "^kind:" -r content/docs --include=*.mdx` prints nothing (use `find … -exec grep -L` under zsh).

- [ ] **Step 4: Build and spot-check.** Run: `bun run build`, then `bunx serve out -l 4173`; open a phase page, a utility page, a phase-group page and `/docs/overview/status/`. Expected: header band with command, Steps cards, Output callouts, Requires badges, NextPhase cards; no duplicate command on any page; no MDX compile errors.

- [ ] **Step 5: Commit**

```bash
git add apps/docs/content
git commit -m "docs: adopt skill-page components across content via codemod"
```

---

### Task 13: Hand-edited intros and DomainGrid on index pages

**Files:**
- Modify: `apps/docs/content/docs/<domain>/index.mdx` for the 15 domains
- Modify: `apps/docs/content/docs/overview/index.mdx`

**Interfaces:**
- Consumes: `DomainGrid` (Task 8).

- [ ] **Step 1: Rewrite each domain intro paragraph** (the first paragraph after frontmatter) in the homepage voice: present tense, no marketing superlatives, under 60 words, names the methodology and what lands in `.metapowers/<domain>/`. Keep every other section as the codemod left it.

- [ ] **Step 2: Append `<DomainGrid domain="<slug>" />`** under a `## Skills in this domain` heading at the end of each of the 15 domain index pages. The overview index gets `<DomainGrid />` (all domains) under `## Domains`.

- [ ] **Step 3: Verify.** Run `bun run codemod -- --check` (exit 0: hand edits must not re-trigger rules), `bun run build` (success), and open two index pages in `bunx serve out`.

- [ ] **Step 4: Commit**

```bash
git add apps/docs/content
git commit -m "docs: rewrite domain intros in the site voice; add domain grids"
```

---

### Task 14: OG image, icons and 404

**Files:**
- Create: `apps/docs/app/opengraph-image.tsx`, `apps/docs/app/icon.svg`, `apps/docs/app/apple-icon.tsx`
- Delete: `apps/docs/public/favicon.svg`
- Modify: `apps/docs/app/layout.tsx` (remove `icons`; `openGraph.images`/`twitter.images` are inferred from the file convention), `apps/docs/app/not-found.tsx`

**Interfaces:**
- Consumes: `SiteNav`, `SiteFooter`, `Pill`, `Eyebrow` (Task 5); font files from Task 3.
- Produces: `opengraph-image.tsx` exporting `size = { width: 1200, height: 630 }`, `contentType = "image/png"`, `alt`, and a default `ImageResponse` (from `next/og`) with cream ground, the hero headline in Miranda Sans 500 loaded with `fs.readFile` from `app/fonts/miranda-sans-500.ttf`, a coral mark, and "bromso.github.io/metapowers" in muted; `apple-icon.tsx` 180×180 coral rounded square with a cream "M"; `icon.svg` the same mark as vector.

- [ ] **Step 1: Create the three image files** and delete `public/favicon.svg`; remove `icons` from `metadata` in `layout.tsx`.

- [ ] **Step 2: Restyle `not-found.tsx`**: render `SiteNav`, a cream page with eyebrow "404", `h1.mp-display` "This room doesn't exist.", one sentence, pills to `/docs/overview` and `/`, then `SiteFooter`.

- [ ] **Step 3: Verify.** Run: `bun run build`. Expected: `out/opengraph-image*.png`, `out/apple-icon*.png` and `out/icon.svg` exist; `grep -o '<meta property="og:image"[^>]*>' out/index.html` shows the image URL under `/metapowers/`; `out/404.html` contains the new headline.

- [ ] **Step 4: Commit**

```bash
git add apps/docs/app apps/docs/public
git commit -m "feat(docs): OG image, icon set and styled 404"
```

---

### Task 15: CI wiring, docs and acceptance record

**Files:**
- Modify: `.github/workflows/validate-skills.yml`
- Modify: `CLAUDE.md` (Commands section: `apps/docs` scripts `gen:data`, `codemod`, `check`, `test`; note that `bun run check:plugins` now includes the docs checks)
- Modify: `apps/docs/lib/site-data.json` only if `gen:data --check` says so
- Create: `docs/superpowers/plans/2026-10-21-site-polish-acceptance.md`

**Interfaces:**
- Consumes: `bun run check` in `apps/docs` (Task 1), which turbo reaches through the root `bun run check:plugins`.

- [ ] **Step 1: Confirm CI already reaches the docs checks.** Run from the worktree root: `bun turbo run check --filter=@metapowers/docs --dry-run=json | grep -c '"task": "check"'`. Expected: ≥ 1. If turbo stalls, run `bun run check` inside `apps/docs` instead and note it. No workflow edit is needed when `validate-skills.yml` already runs `bun run check:plugins`; otherwise add a step `run: bun run --cwd apps/docs check` after it.

- [ ] **Step 2: Run the full gate** from the worktree root: `bun run test` (or `bun run test` inside `apps/docs` plus each package if turbo stalls), `bunx biome check apps/docs`, `bun run build` inside `apps/docs`. Expected: all green.

- [ ] **Step 3: Lighthouse and accessibility.** Run: `bunx serve out -l 4173` in `apps/docs`; `bunx lighthouse http://localhost:4173/metapowers/ --preset=mobile --only-categories=performance,accessibility --output=json --output-path=/tmp/lh.json --chrome-flags="--headless"`; read `categories.performance.score`, `categories.accessibility.score`, `audits["largest-contentful-paint"].numericValue`, `audits["cumulative-layout-shift"].numericValue`. Expected: performance ≥ 0.90, accessibility ≥ 0.95, LCP ≤ 2500, CLS ≤ 0.1. If performance misses, first lower Aurora `dpr` to 1 and defer its mount to `requestIdleCallback`; re-measure.

- [ ] **Step 4: Write the acceptance record** at `docs/superpowers/plans/2026-10-21-site-polish-acceptance.md`: the Lighthouse numbers, the JS delta against the Task 1 baseline, the search check from Task 10, the codemod report summary (pages changed, unmatched sections), screenshots' paths if taken, and open follow-ups.

- [ ] **Step 5: Update `CLAUDE.md`** Commands section.

- [ ] **Step 6: Commit**

```bash
git add .github CLAUDE.md docs/superpowers/plans/2026-10-21-site-polish-acceptance.md apps/docs/lib/site-data.json
git commit -m "ci: docs data and codemod checks in CI; site polish acceptance record"
```

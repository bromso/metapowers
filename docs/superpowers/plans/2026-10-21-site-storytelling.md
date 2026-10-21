# Site Storytelling Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Place eight React Bits pieces into the Project C site tastefully: star-lap primary pills, a "Works with" logo row, a true-to-skill Thought Line trace, a chroma bento of domain tiles with hover-once animated icons, a flip-card skill showcase, faint fibres behind the closing CTA, and a blur at the bottom of the docs sidebar.

**Architecture:** Every React Bits copy lives under `components/motion/` behind the existing reduced-motion gate and first-paint rule. Data (bento order and sizes, animated icon names, agent marks, trace steps) lives in `lib/` with unit tests; homepage sections compose it. Heavy chunks (`motion`-based Thought Line and Flip Card, WebGL fibres) load through `next/dynamic` below the fold.

**Tech Stack:** Next 16.2 static export (basePath `/metapowers`), React 19, Tailwind 4, Fumadocs 16.8.1 (pinned), GSAP (existing), `motion` (new), `@iconify-json/line-md` + `@iconify/utils` (build-time), `simple-icons` (build-time), Vitest 3, Bun, Biome.

**Spec:** `docs/superpowers/specs/2026-10-21-site-storytelling-design.md`

## Global Constraints

- New runtime dependency: `motion` only. Dev dependencies: `@iconify-json/line-md`, `@iconify/utils`, `simple-icons`. No `@hugeicons/*`, no `@iconify/react`, no `three`. Nothing fetched from a CDN at runtime.
- Budgets: first-load JS for `/` ≤ 976,366 bytes uncompressed (`firstLoadUncompressedJsBytes` in `.next/diagnostics/route-bundle-stats.json`; Project C left it at 726,366); Lighthouse mobile home performance ≥ 0.90, accessibility ≥ 0.95, CLS ≤ 0.1.
- Rest state is still: only the aurora and Ghost Fibers move continuously, both paused offscreen and when the tab is hidden, both capped at 60 fps. Thought Line plays once per page load. Everything else responds to pointer or keyboard only. No hover effect shifts layout.
- Reduced motion: every piece renders its final static state (settled trace with all steps listed, no fibres, no star lap, no spotlight tracking, instant flip).
- First-paint rule (`components/motion/README.md`): server HTML carries the final content of every piece; hidden initial states only client-side in layout effects; nothing already on screen is hidden on hydration.
- Keyboard parity: star laps on focus-visible, flip on Enter/Space, tiles are links, trace toggle is a button.
- Tokens only (no raw hex outside `global.css`; React Bits colour props fed from tokens, resolved on the client where a canvas needs literals, as `Hero.tsx` does). Dark mode via `[.dark_&]:`, not `dark:`.
- Copy fixed by the spec: trace label `Running /design:empathize date-picker`; the six steps in spec §4.3 verbatim; settle text `Thought for 3s · wrote 01-empathize.md`; beat 500 ms; flip labels "Flip to see what it writes" / "Flip back to the skill"; install line "Install with `npx create-metapowers`" → `/docs/overview/installation`; logo row names Claude Code, Codex, OpenCode, Cursor.
- Docs pages: only the sidebar blur changes. No `content/`, `meta.json`, TOC or codemod changes.
- Biome tabs; TypeScript strict; conventional commits (`feat(docs):`, `fix(docs):`, `chore(docs):`, `docs:`); commit trailer per session rules.
- Worktree notes: run Biome on explicit paths; run `bun run build` inside `apps/docs`; a controller dev server may use port 3111.

## Review Focus

1. **Touch devices** (no hover): tiles must show name, count and swatch at rest and work as plain links; the flip card flips on tap; the star never shows. Pinned in Task 6 (rest-state render test) and Task 7 (tap = click).
2. **Reduced motion** on the Thought Line: it must render already settled with all six steps visible and the toggle working. Pinned in Task 5.
3. **No JavaScript**: the flip card's back face (artifact tree) must be readable. Pinned in Task 7 (server render test asserts both faces in markup).
4. **Keyboard**: Enter/Space flips; focus-visible laps the star once and stops. Pinned in Task 3 and Task 7.
5. **Hidden tab or late scroll**: the trace must start only when the section is in view and the document visible, and play exactly once even if the user scrolls away and back. Pinned in Task 5 (hook test with a fake IntersectionObserver and `document.visibilityState`).

---

### Task 1: Dependencies and data model

**Files:**
- Modify: `apps/docs/package.json`
- Modify: `apps/docs/lib/domains.ts`
- Modify: `apps/docs/lib/site.ts`, `apps/docs/lib/site.test.ts`
- Create: `apps/docs/lib/trace.ts`, `apps/docs/lib/trace.test.ts`
- Create: `apps/docs/lib/agents.ts`, `apps/docs/lib/agents.test.ts`

**Interfaces:**
- Produces:
  - `Domain` gains `bento: { order: number; size: "wide" | "half" | "small" | "meta" }` and `animatedIcon: string` (a `line-md` icon name, e.g. `"line-md:paint-drop"`; builder picks per domain).
  - `getBentoDomains(): ReturnType<typeof getDomains>` sorted by `bento.order` ascending.
  - `BENTO_CELLS: Record<Domain["bento"]["size"], number> = { wide: 6, half: 2, small: 1, meta: 2 }` (cells at six columns).
  - `lib/trace.ts`: `TRACE_LABEL`, `TRACE_STEPS: readonly string[]` (six, verbatim from spec §4.3), `TRACE_BEAT_MS = 500`, `TRACE_SETTLE_SECONDS = 3`, `TRACE_SETTLED_LABEL = "Thought for 3s · wrote 01-empathize.md"`, `TRACE_CAPTIONS: readonly [string, string, string]` (the three existing HowItWorks sentences, moved here).
  - `lib/agents.ts`: `type Agent = { slug: "claude-code" | "codex" | "opencode" | "cursor"; name: string; mark: { kind: "svg"; path: string; title: string } | { kind: "wordmark"; text: string }; href: string }`; `export const agents: Agent[]` (four, in that order); SVG paths copied once from `simple-icons` (`claude`, `opencode`, `cursor`) by a small script step, pasted as string constants with a comment naming the icon and version; Codex is a wordmark; `href` is `/docs/overview/installation#<slug>` for all four.

- [ ] **Step 1: Add dependencies.** `dependencies`: `"motion": "^14.5.0"`. `devDependencies`: `"@iconify-json/line-md": "^1.2.16"`, `"@iconify/utils": "^3.1.7"`, `"simple-icons": "^16.35.0"`. Run `bun install` from the worktree root; include `bun.lock`.

- [ ] **Step 2: Write the failing tests** (`lib/site.test.ts` additions, `lib/trace.test.ts`, `lib/agents.test.ts`):

```ts
test("every domain has a unique bento order 1..16 and a size", () => {
	const orders = domains.map((d) => d.bento.order).sort((a, b) => a - b);
	expect(orders).toEqual(Array.from({ length: 16 }, (_, i) => i + 1));
});
test("bento sizes: 2 wide, 3 half, 10 small, 1 meta (metapowers), 30 cells", () => {
	const by = (s: string) => domains.filter((d) => d.bento.size === s);
	expect(by("wide").map((d) => d.slug).sort()).toEqual(["design", "development"]);
	expect(by("half").map((d) => d.slug).sort()).toEqual(["marketing", "research", "security"]);
	expect(by("small")).toHaveLength(10);
	expect(by("meta").map((d) => d.slug)).toEqual(["metapowers"]);
	expect(domains.reduce((n, d) => n + BENTO_CELLS[d.bento.size], 0)).toBe(30);
});
test("getBentoDomains is ordered design, development, research, marketing, security, …, metapowers", () => {
	const slugs = getBentoDomains().map((d) => d.slug);
	expect(slugs.slice(0, 5)).toEqual(["design", "development", "research", "marketing", "security"]);
	expect(slugs.at(-1)).toBe("metapowers");
	expect(slugs.slice(5, 15)).toEqual([...slugs.slice(5, 15)].sort());
});
test("every domain names a line-md animated icon", () => {
	for (const d of domains) expect(d.animatedIcon).toMatch(/^line-md:[a-z0-9-]+$/);
});
// trace.test.ts
test("trace copy is fixed", () => {
	expect(TRACE_STEPS).toHaveLength(6);
	expect(TRACE_STEPS[4]).toContain(".metapowers/design/date-picker/01-empathize.md");
	expect(TRACE_BEAT_MS).toBe(500);
	expect(TRACE_SETTLE_SECONDS * 1000).toBe(TRACE_STEPS.length * TRACE_BEAT_MS);
	expect(TRACE_SETTLED_LABEL).toBe("Thought for 3s · wrote 01-empathize.md");
});
// agents.test.ts
test("four supported agents in order, each with a bundled mark or wordmark", () => {
	expect(agents.map((a) => a.name)).toEqual(["Claude Code", "Codex", "OpenCode", "Cursor"]);
	for (const a of agents) {
		if (a.mark.kind === "svg") expect(a.mark.path).toMatch(/^M/);
		else expect(a.mark.text).toBe("Codex");
		expect(a.href).toBe(`/docs/overview/installation#${a.slug}`);
	}
});
```

- [ ] **Step 3: Run tests, verify failure.** Run: `bun run test` in `apps/docs`. Expected: FAIL (missing fields/modules).

- [ ] **Step 4: Implement.** Extend `Domain`, fill `bento` per spec §4.4 table and `animatedIcon` per domain (verify each name exists: `node -e "const s=require('@iconify-json/line-md/icons.json'); console.log('paint-drop' in s.icons)"`); add `BENTO_CELLS` and `getBentoDomains` to `lib/site.ts`; create `lib/trace.ts` and `lib/agents.ts` (extract the three SVG paths with a one-off `node -e "console.log(require('simple-icons').siClaude.path)"` and paste them).

- [ ] **Step 5: Run tests.** Expected: all PASS, including the existing `site.test.ts` join test and the Project A `check-counts` (`bun run check` in `packages/plugin-tools` after `bun run build` there).

- [ ] **Step 6: Commit** `feat(docs): bento, animated-icon, trace and agent data`.

---

### Task 2: React Bits copies behind the motion gate

**Files:**
- Create: `apps/docs/components/motion/StarBorder.tsx`, `ThoughtLine.tsx`, `FlipCard.tsx`, `GhostFibers.tsx`, `GradualBlur.tsx`, `ChromaSpotlight.tsx`
- Modify: `apps/docs/components/motion/README.md`

**Interfaces:**
- Produces (default exports keep upstream prop names unless noted):
  - `StarBorder` (upstream, no deps) with `as`, `hover`, `stars`, `duration`, `glow`, `sparkle`, `clickPulse`, `theme`, `radius`; local change: when `prefersReducedMotion()` is true it renders `as` with children and no star canvas/animation.
  - `ThoughtLine` (upstream; `motion`): the two `@hugeicons` glyphs replaced by inline SVG (sparkle, chevron) so no hugeicons dependency; props `label`, `doneLabel`, `steps`, `working`, `elapsed`, `showTimer`, `collapsible`, `collapseOnSettle`, `onSettle`. Reduced motion: no breath/shimmer, settle instantly.
  - `FlipCard` (upstream; `motion`): props `front`, `back`, `flipped`, `onFlipChange`, `axis`, `flipOnClick`, `draggable`, `tilt`, `glare`, `hoverScale`, `width`, `height`, `radius`, `background`, `color`, `ariaLabel`. Reduced motion: flip switches faces instantly (no spring), tilt and glare off.
  - `GhostFibers` (upstream, WebGL): adds the aurora's local rules: live `prefersReducedMotion()` early return before context creation, 60 fps cap, pause when `document.hidden` or not intersecting, `aria-hidden`, `dpr` ≤ 1.5, fresh canvas per effect run.
  - `GradualBlur` (upstream, CSS): unchanged except `"use client"` and prop types; reduced motion needs nothing (static blur).
  - `ChromaSpotlight` (ported from ChromaGrid, no deps): `ChromaSpotlight({ children, radius?: number (260), softness?: number (0.6), damping?: number (0.45), className? })` — a client wrapper that tracks the pointer over its box and writes `--chroma-x`, `--chroma-y`, `--chroma-r` CSS variables on itself; children (tiles) use them for their own accent wash/border glow. Under reduced motion or on coarse pointers it sets nothing. Document in README that only the spotlight math is ported, not the photo grid.

- [ ] **Step 1: Copy the six registry files.** For each of `StarBorder`, `ThoughtLine`, `FlipCard`, `GhostFibers`, `GradualBlur`, `ChromaGrid` fetch `https://reactbits.dev/r/<Name>-TS-TW.json`, write `files[0].content` to `components/motion/<Name>.tsx` (ChromaGrid is read, then reduced to `ChromaSpotlight.tsx`), prepend the source comment used by the Project C copies (`// Source: … (MIT + Commons Clause), copied 2026-10-21`), run Biome on them.

- [ ] **Step 2: Apply the local modifications** listed in Interfaces, in that order of files.

- [ ] **Step 3: Write `lib/motion.test.ts` additions** that import each new module in Node without a DOM and assert the module loads (guards against top-level `window` access):

```ts
test.each(["StarBorder", "ThoughtLine", "FlipCard", "GhostFibers", "GradualBlur", "ChromaSpotlight"])(
	"%s imports without a DOM",
	async (name) => { await expect(import(`../components/motion/${name}`)).resolves.toBeTruthy(); },
);
```

- [ ] **Step 4: Run tests and build.** `bun run test`, then `bun run build` in `apps/docs`. Expected: both pass (components unused yet, but they type-check).

- [ ] **Step 5: Update `components/motion/README.md`:** origin, license, local modifications for each file, and the "ported, not copied" note for `ChromaSpotlight`.

- [ ] **Step 6: Commit** `feat(docs): React Bits copies — star border, thought line, flip card, ghost fibers, gradual blur, chroma spotlight`.

---

### Task 3: Star Border on the primary pills

**Files:**
- Modify: `apps/docs/components/ui/Pill.tsx`
- Modify: `apps/docs/components/home/Hero.tsx`, `apps/docs/components/home/ClosingCta.tsx`

**Interfaces:**
- Consumes: `StarBorder` (Task 2).
- Produces: `Pill` gains `star?: boolean`; when `star && variant === "primary"` the pill renders `StarBorder` with `as={Link}` (internal) or `as="a"` (external), `hover="lap"`, `stars={1}`, `duration={1.6}`, `glow={0.4}`, `sparkle={false}`, `clickPulse={false}`, `radius={999}`, `theme` from the surface the pill sits on (`"light"` on cream, `"dark"` on the ink CTA; a `starTheme?: "light" | "dark"` prop, default `"light"`), colours from tokens (`color` = `--mp-accent-soft`, resolved on the client like `Hero.tsx` resolves aurora stops). Resting markup and classes stay identical to today's pill.

- [ ] **Step 1: Add `star` and `starTheme` to `Pill`**; the two primary pills in `Hero.tsx` and `ClosingCta.tsx` pass `star` (`starTheme="dark"` on the CTA).

- [ ] **Step 2: Verify in the browser** (`bun run dev --port 3111` in apps/docs): rest identical; hover → one lap then still; Tab to the pill → one lap; reduced motion → nothing; both themes legible. `curl` the HTML: pill text present.

- [ ] **Step 3: Build.** `bun run build` in `apps/docs`. Expected: success.

- [ ] **Step 4: Commit** `feat(docs): star border laps the primary pills on hover and focus`.

---

### Task 4: "Works with" logo row

**Files:**
- Create: `apps/docs/components/home/WorksWith.tsx`
- Modify: `apps/docs/components/home/InstallStrip.tsx`
- Modify: `apps/docs/content/docs/overview/installation.mdx` only if the four anchors `#claude-code`, `#codex`, `#opencode`, `#cursor` do not already exist as headings (check first; if the headings exist with those ids, no content change)

**Interfaces:**
- Consumes: `agents` (Task 1).
- Produces: `WorksWith()` server component: eyebrow "Works with", a row of four `next/link`s, each an inline `<svg viewBox="0 0 24 24"><title>` + path or a Miranda Sans wordmark at the same cap height, ink at 60% opacity, 100% on hover/focus, focus ring per site convention. `InstallStrip` renders `Terminal`, then `WorksWith`, then the muted line "Install with `npx create-metapowers`" linking to `/docs/overview/installation` (replacing the old "Also: …" line).

- [ ] **Step 1: Check the installation page anchors** (`grep -n "^## \|^### " content/docs/overview/installation.mdx`). If the four agent headings are missing, add `href` targets by pointing `agents[].href` at the existing nearest heading ids instead (data change in Task 1's file, with the test updated); do not edit content.

- [ ] **Step 2: Create `WorksWith.tsx` and wire `InstallStrip`.**

- [ ] **Step 3: Verify:** `curl` of the homepage contains the four names and three `<svg`; keyboard focus visible; both themes.

- [ ] **Step 4: Build and commit** `feat(docs): works-with row with Claude Code, Codex, OpenCode and Cursor marks`.

---

### Task 5: Thought Line in "How it works"

**Files:**
- Create: `apps/docs/components/home/SkillTrace.tsx` (client), `apps/docs/components/home/useTracePlayback.ts`, `apps/docs/components/home/useTracePlayback.test.ts`
- Modify: `apps/docs/components/home/HowItWorks.tsx`

**Interfaces:**
- Consumes: `ThoughtLine` (Task 2); `TRACE_*` (Task 1); `usePrefersReducedMotion` (`lib/motion.ts`).
- Produces:
  - `useTracePlayback({ ref, steps, beatMs, reduced }): { shown: string[]; working: boolean; elapsed: number }` — starts when the element is ≥ 40% in view **and** `document.visibilityState === "visible"`, appends one step per `beatMs`, sets `working=false` after the last, `elapsed` = steps shown × beatMs / 1000; plays once (a `started` ref), never restarts; with `reduced` returns all steps, `working=false`, `elapsed=steps.length*beatMs/1000` immediately.
  - `SkillTrace()` renders `ThoughtLine` with `label={TRACE_LABEL}`, `doneLabel={TRACE_SETTLED_LABEL}`, `steps={shown}`, `working`, `elapsed` (controlled), `showTimer`, `collapsible`, `collapseOnSettle`, inside a surface card; **server render** passes the settled state (all steps, `working=false`) so the HTML is complete, and the client hook resets to zero steps only inside a layout effect before first paint when playback is going to run (first-paint rule exception documented in README, same reasoning as the hero headline).
  - `HowItWorks` keeps `SectionHeader`, renders `SkillTrace` (via `next/dynamic`, `ssr: true`), then the three `TRACE_CAPTIONS` as a three-column caption row (no numerals, no `Reveal`).

- [ ] **Step 1: Write the failing hook tests** with a fake `IntersectionObserver` and fake timers:

```ts
test("plays all six steps at the beat once in view and visible, then settles at 3s", ...);
test("does not start while the document is hidden", ...);
test("plays only once even if the element leaves and re-enters", ...);
test("reduced motion returns the settled state immediately", ...);
```

- [ ] **Step 2: Run to verify failure.** Expected: FAIL, module not found.

- [ ] **Step 3: Implement the hook, `SkillTrace`, and the `HowItWorks` change.**

- [ ] **Step 4: Run tests; verify in the browser:** trace plays once on scroll-in, settles to "Thought for 3s · wrote 01-empathize.md" with a working chevron; reduced motion shows it settled; `curl` shows all six steps and the three captions in the HTML.

- [ ] **Step 5: Build and commit** `feat(docs): thought-line trace tells how a skill runs`.

---

### Task 6: Chroma bento with hover-once icons

**Files:**
- Create: `apps/docs/lib/icons.ts`, `apps/docs/lib/icons.test.ts`
- Create: `apps/docs/components/home/AnimatedIcon.tsx` (client), `apps/docs/components/home/BentoTile.tsx`, `apps/docs/components/home/ChromaBento.tsx`
- Modify: `apps/docs/components/home/DomainTiles.tsx`, `apps/docs/app/global.css`

**Interfaces:**
- Consumes: `getBentoDomains`, `BENTO_CELLS`, `Domain.bento`, `Domain.animatedIcon` (Task 1); `ChromaSpotlight` (Task 2).
- Produces:
  - `lib/icons.ts`: `renderLineMdIcon(name: string): string` — looks the icon up in `@iconify-json/line-md` and returns the SVG markup via `@iconify/utils` (`getIconData`, `iconToSVG`, `iconToHTML`, `replaceIDs`); throws with the name when missing. Build-time only (imported by a server component).
  - `AnimatedIcon({ svg: string, className? })`: client; renders the SVG markup (`dangerouslySetInnerHTML`, trusted build-time string); on the tile's first `pointerenter`/`focus` it re-mounts the markup (key bump) so the line-md animation plays, then never again; reduced motion: no re-mount.
  - `BentoTile({ domain })`: server; a `next/link` to `domain.docsPath`, grid classes from `domain.bento.size` (`wide`: `lg:col-span-3 lg:row-span-2 col-span-2 row-span-2`, `half`: `lg:col-span-2 col-span-2`, `small`: `col-span-1`, `meta`: `lg:col-span-2 col-span-2` inverted), swatch via `var(--mp-sidebar-swatch-<colour>)`, `AnimatedIcon`, name, `{skills} skills`, methodology; wide tiles also show `blurb`; accent wash/border glow driven by the `--chroma-*` variables and `--domain-<colour>` (CSS in `global.css`, token-only).
  - `ChromaBento()`: `<ul>` with `grid-cols-2 lg:grid-cols-6 lg:grid-auto-rows` wrapped in `ChromaSpotlight`; replaces the `DomainTile`/`SpotlightCard` grid in `DomainTiles` (which keeps its `SectionHeader`). `DomainTile.tsx` stays for `DomainGrid`.

- [ ] **Step 1: Write the failing tests:**

```ts
// lib/icons.test.ts
test("renders every domain's animated icon to inline SVG", () => {
	for (const d of domains) expect(renderLineMdIcon(d.animatedIcon)).toMatch(/^<svg[^>]+viewBox/);
});
test("throws with the icon name when it does not exist", () => {
	expect(() => renderLineMdIcon("line-md:does-not-exist")).toThrow("line-md:does-not-exist");
});
```

- [ ] **Step 2: Run to verify failure.** Expected: FAIL.

- [ ] **Step 3: Implement `lib/icons.ts`, `AnimatedIcon`, `BentoTile`, `ChromaBento`; wire `DomainTiles`; add the chroma CSS** (`.bento-tile` uses `radial-gradient(circle var(--chroma-r) at var(--chroma-x) var(--chroma-y), color-mix(in srgb, var(--domain-<colour>) 35%, transparent), transparent)` for the wash and a matching border colour; no transition longer than 300 ms).

- [ ] **Step 4: Run tests; verify in the browser:** six full rows at ≥ 1024 px, two columns at 400 px with no gaps and the same order; spotlight raises colour under the pointer, rest state still; icons play once on hover and not again; touch emulation shows rest state and tap navigates; reduced motion: no spotlight, no icon play. Record `firstLoadUncompressedJsBytes` for `/`.

- [ ] **Step 5: Build and commit** `feat(docs): chroma bento of domain tiles with hover-once animated icons`.

---

### Task 7: Flip Card skill showcase

**Files:**
- Create: `apps/docs/components/home/SkillFlipCard.tsx` (client)
- Modify: `apps/docs/components/home/SkillShowcase.tsx`

**Interfaces:**
- Consumes: `FlipCard` (Task 2).
- Produces: `SkillFlipCard({ front: ReactNode, back: ReactNode })`: before mount it renders `<div data-faces>` with both faces stacked (front then back, each with its label "Flip to see what it writes" / "Flip back to the skill" as a visible caption); after mount it renders `FlipCard` (`axis="y"`, `flipOnClick`, `draggable`, `tilt`, `glare={false}`, `hoverScale={1.01}`, `radius={20}`, `width` = container width, `height` 360 on desktop, `ariaLabel="Skill card: flip to see what it writes"`), loaded through `next/dynamic` with `ssr: false` for the `motion` chunk while the stacked faces stay as the SSR output. `SkillShowcase` passes the existing two `<figure>` contents as `front`/`back`.

- [ ] **Step 1: Write the failing test** (`components/home/SkillFlipCard.test.ts`, server render with `react-dom/server`):

```ts
test("server markup carries both faces and both labels", () => {
	const html = renderToString(<SkillFlipCard front={<p>FRONT</p>} back={<p>BACK</p>} />);
	expect(html).toContain("FRONT"); expect(html).toContain("BACK");
	expect(html).toContain("Flip to see what it writes"); expect(html).toContain("Flip back to the skill");
});
```

(Add `components/**/*.test.tsx` to the vitest include if needed.)

- [ ] **Step 2: Run to verify failure.** Expected: FAIL.

- [ ] **Step 3: Implement and wire `SkillShowcase`.**

- [ ] **Step 4: Verify in the browser:** click, drag, Enter and Space flip; no layout shift when the card mounts (reserve the height); reduced motion flips instantly; `curl` shows both faces.

- [ ] **Step 5: Build and commit** `feat(docs): flip-card skill showcase — brief in, artifact out`.

---

### Task 8: Ghost Fibers behind the closing CTA

**Files:**
- Modify: `apps/docs/components/home/ClosingCta.tsx`
- Create: `apps/docs/components/home/CtaFibers.tsx` (client)

**Interfaces:**
- Consumes: `GhostFibers` (Task 2); `usePrefersReducedMotion`; the idle/in-view pattern from `Hero.tsx`.
- Produces: `CtaFibers()` mounts `GhostFibers` through `next/dynamic` (`ssr: false`) once the section is within one viewport and the browser is idle; props `opacity={0.25}`, `speed={0.1}`, `layers={2}`, `glowColor` resolved from `--mp-accent-soft`, `lightMode={false}`, `vignette={0.9}`, `mouseInteraction={false}`, `dpr={1.5}`; absolutely positioned behind the CTA content, `aria-hidden`. The section's ink background stays beneath.

- [ ] **Step 1: Implement `CtaFibers` and place it in `ClosingCta`.**

- [ ] **Step 2: Verify in the browser:** fibres faint and slow behind the CTA, text contrast unchanged (measure cream on ink with fibres at peak: still ≥ 4.5:1 by construction since opacity 0.25 over ink); paused when scrolled away (check `requestAnimationFrame` activity via the component's debug flag or DevTools); nothing under reduced motion; dark theme legible.

- [ ] **Step 3: Build; record `firstLoadUncompressedJsBytes` for `/` (must be ≤ 976,366). Commit** `feat(docs): ghost fibers behind the closing CTA`.

---

### Task 9: Gradual Blur at the bottom of the docs sidebar

**Files:**
- Create: `apps/docs/components/docs/SidebarBlur.tsx` (client)
- Modify: `apps/docs/app/docs/layout.tsx`, `apps/docs/app/global.css`

**Interfaces:**
- Consumes: `GradualBlur` (Task 2).
- Produces: `SidebarBlur()` renders `GradualBlur` with `position="bottom"`, `target="parent"`, `height="56px"`, `strength` about 1.5, `layers` 4, `curve="bezier"`, `autoHide` on, `tint` from `--mp-sidebar-bg`; placed inside the sidebar's scroll viewport so it sits over the end of the tree, above the footer; applied to both `#nd-sidebar` and `#nd-sidebar-mobile`. If the installed `sidebar` slots cannot host it inside the viewport, mount it from `sidebar.footer` with absolute positioning over the viewport's bottom edge and document the choice.

- [ ] **Step 1: Read `fumadocs-ui/dist/layouts/docs/slots/sidebar.js` to pick the mount point**, then implement.

- [ ] **Step 2: Verify in the browser** on a long tree (`/docs/compliance/`) and a short one (`/docs/research/`): blur only when the tree overflows, last item readable when scrolled to the end, mobile drawer same, both themes.

- [ ] **Step 3: Build and commit** `feat(docs): gradual blur at the sidebar's bottom edge`.

---

### Task 10: Budgets, Lighthouse and acceptance record

**Files:**
- Create: `docs/superpowers/plans/2026-10-21-site-storytelling-acceptance.md`
- Modify: `apps/docs/components/motion/README.md` (final modification list), `CLAUDE.md` (one line: new data fields in `lib/domains.ts` and `lib/agents.ts` that a new domain or agent must fill)

- [ ] **Step 1: Full gate:** `bun run test` (root), `bunx biome check apps/docs`, `bun run build` in `apps/docs`, `bun run check` in `apps/docs` and in `packages/plugin-tools`.

- [ ] **Step 2: Lighthouse** with the Project C setup (gzip server under `/metapowers`, `--form-factor=mobile`, three home runs, one docs page). Targets: performance ≥ 0.90, accessibility ≥ 0.95, CLS ≤ 0.1. If performance misses: defer the Thought Line and Flip Card chunks further (mount on in-view), lower fibres `dpr` to 1, re-measure once.

- [ ] **Step 3: Write the acceptance record** (gate output, Lighthouse table before/after, JS delta vs 726,366, a per-piece checklist of the behaviour rules with how each was verified, follow-ups).

- [ ] **Step 4: Commit** `docs: site storytelling acceptance record`.

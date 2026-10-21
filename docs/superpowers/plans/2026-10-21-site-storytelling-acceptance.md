# Site storytelling: acceptance results

Date: 2026-10-21 · Branch: `worktree-site-storytelling` · Next.js 16.2.4 (Turbopack) · Lighthouse via `bunx lighthouse` (headless Chrome 155)

These are the results for the storytelling pieces in [`docs/superpowers/specs/2026-10-21-site-storytelling-design.md`](../specs/2026-10-21-site-storytelling-design.md) (Project D). They were measured on the production build (`apps/docs/out`) at `bb3c204`, the last feature commit (Task 9). Project C's record is [`2026-10-21-site-polish-acceptance.md`](2026-10-21-site-polish-acceptance.md); its final numbers are the "before" column here.

**Summary.**
- **Gate:** green. Tests 9/9 turbo tasks, Biome clean, the docs build exports 192 static pages, `bun run check` exits 0 in `apps/docs` and in `packages/plugin-tools` (including Project A's `check-counts`).
- **Performance:** home **0.92 / 0.93 / 0.92**, which meets ≥ 0.90. It was 0.95–0.96 after Project C. The fallback plan (deferring chunks, fibres `dpr` 1) was not needed.
- **Accessibility:** 1.00 on the home page and on the docs page.
- **CLS:** 0 in Lighthouse on both pages. Lighthouse does not scroll, so it never sees the Thought Line or the Flip Card mount. Measured with the section in view, the Flip Card mount is 0.035–0.049. The Thought Line's play is 0.104–0.107 on a phone-sized viewport, just over 0.1 (see [carried-over check 3](#3-thought-line-growth-and-collapse)). No fix was made in this task.
- **LCP:** 3.23–3.32 s (Project C: 2.71–2.86 s). Spec §2 does not budget LCP; Project C already missed its 2.5 s goal. See follow-up 1.
- **JS:** first-load JS for `/` is **820,822 bytes**, **+94,456** over the 726,366 baseline, within the +250,000 budget (976,366). Gzipped it is 260.2 KB (Project C: 225.7 KB).

Legend: ✅ met with recorded evidence · ⚠️ missed or weak, written up · ⏳ pending (owner)

## Gate

Run from the worktree root unless noted.

| Step | Command | Result |
|---|---|---|
| Tests | `bun run test` | ✅ exit 0, 9/9 turbo tasks (2 cached), 4.3 s: docs 65 (11 files), skill-validator 68, plugin-tools 163, figma-mcp 30, create-metapowers 6. Turbo did not stall. |
| Lint | `bunx biome check apps/docs` | ✅ exit 0, "Checked 109 files in 26ms. No fixes applied." |
| Build | `bun run build` (in `apps/docs`) | ✅ exit 0, "Compiled successfully in 4.8s", 192/192 static pages |
| Docs checks | `bun run check` (in `apps/docs`) | ✅ exit 0. Prints the four known `unmatched: … — What It Does` lines (`branding/audit`, `development/build`, `development/debug`, `development/ship`), as in Project C. |
| Plugin tools build | `bun run build` (in `packages/plugin-tools`) | ✅ exit 0 (`tsc`) |
| Plugin tools checks | `bun run check` (in `packages/plugin-tools`) | ✅ exit 0, no output from any of the nine checks, including `check-counts ../..` against the new `domains.ts` fields |

Known noise, none of it a failure: Node `DEP0205` (`module.register()` deprecated) when Vitest and `next build` start; Next's "set `turbopack.root`" workspace-root warning.

## Lighthouse

**Setup** (unchanged from Project C):
- A Bun static server on `127.0.0.1:4176` served `apps/docs/out` under `/metapowers` and gzipped HTML, JS, CSS, SVG, JSON and TXT, as GitHub Pages does. (Port 4176 instead of 4175 only to avoid a clash with any leftover Project C server.)
- `bunx lighthouse <url> --form-factor=mobile --only-categories=performance,accessibility --output=json --output-path=<scratch>/lh-d-*.json --chrome-flags="--headless=new"`: default mobile emulation, simulated slow 4G, 4× CPU slowdown.
- Three runs on `/metapowers/`, one on `/metapowers/docs/design/a11y-audit/`.

| Stage | Home perf (3 runs) | Home LCP | Home CLS | Docs perf | Docs LCP | A11y (home / docs) |
|---|---|---|---|---:|---:|---|
| Before: Project C final | 0.95 / 0.96 / 0.96 | 2.71–2.86 s | 0 | 0.93 | 3.22 s | 1.00 / 1.00 |
| **After: Project D (`bb3c204`)** | **0.92 / 0.93 / 0.92** | **3.31 / 3.23 / 3.32 s** | **0** | **0.93** | **3.22 s** | **1.00 / 1.00** |

**After, other metrics:**
- **Home:** FCP 1.06 s (Project C 0.90 s), TBT 10–22 ms (Project C 58–72 ms), Speed Index 1.94–2.01 s, CLS 0.
- **Docs:** FCP 1.05 s, TBT 8 ms, Speed Index 1.05 s, CLS 0. The docs page is unchanged from Project C apart from the sidebar blur.

**Targets (spec §2), home page, mobile:**

| Metric | Target | Result |
|---|---|---|
| Performance | ≥ 0.90 | ✅ 0.92–0.93 |
| Accessibility | ≥ 0.95 | ✅ 1.00 (docs page 1.00 too) |
| CLS | ≤ 0.1 | ✅ 0 in Lighthouse. ⚠️ 0.104–0.107 in a manual check on a phone viewport with the Thought Line in view during its play (below) |

**Why the score dropped by 0.03.** The extra first-load JS (+94 KB uncompressed, +34.5 KB gzipped) is the likely cause. Lantern charges each first-load request before FCP and LCP, and both moved by about the same amount (FCP +0.16 s, LCP +0.45–0.5 s). TBT went down, so main-thread work is not the cause. The score is still above target, so the brief's fallback (defer the Thought Line and Flip Card chunks to in-view mounting, fibres `dpr` 1) was not applied.

**JSON reports** (scratch, not committed), in `/private/tmp/claude-501/-Users-jonasbroms-Sites-metapowers/60cf9438-7627-4c25-b8c7-d534fd41322d/scratchpad/`: `lh-d-home-1.json`, `lh-d-home-2.json`, `lh-d-home-3.json`, `lh-d-docs.json`.

## JS budget

| | Bytes (`firstLoadUncompressedJsBytes`, route `/`, `apps/docs/.next/diagnostics/route-bundle-stats.json`) | Gzip (sum of the 14 first-load chunks, `gzip -9`) |
|---|---:|---:|
| Baseline (Project C final, PR #45) | 726,366 | 225,694 |
| After Task 6 (bento, icons) | 810,084 | not recorded |
| After Task 7 (Flip Card) | 818,920 | not recorded |
| After Task 8 (Ghost Fibers) | 820,759 | not recorded |
| **Final (`bb3c204`)** | **820,822** | **260,181** |
| **Delta vs baseline** | **+94,456** ✅ (budget +250,000, ceiling 976,366) | +34,487 |

The aurora, Ghost Fibers, Flip Card and search chunks are loaded on demand and are not counted in this metric.

## Behaviour rules (spec §3), per piece

Rules: **Still** = rest state is still · **RM** = reduced motion gives the final static state · **Paint** = first paint complete from server HTML · **Keys** = keyboard parity · **Tokens** = colours from `global.css` tokens.

"T10" marks evidence gathered in this task: a headless Chrome 155 driven over CDP against the production build (script `t10-cdp.ts` in the scratch directory). The rest-state check wraps `requestAnimationFrame` and attributes each call by stack to a chunk (see [check 6](#6-rest-state-raf-count)). The reduced-motion check uses `Emulation.setEmulatedMedia` with `prefers-reduced-motion: reduce` and counts canvases and requests.

| Piece | Rule | Status | How it was verified (task) |
|---|---|---|---|
| **Star Border** (hero and CTA pills) | Still | ✅ | T3 found upstream's ambient cruise and gated it for `hover="lap"`; the loop stops after one lap. T10: no rAF from StarBorder in a 5 s idle window, although both star canvases exist. |
| | RM | ✅ | T3 by code reading (no canvas, effect bails). T10: 0 canvases on the page under reduced motion. |
| | Paint | ✅ | T3: the SSR anchor carries the full pill classes and label; the canvas draws nothing before hydration. |
| | Keys | ✅ | T3: a real Tab focuses the pill, `:focus-visible` matches, and the lap starts on focus-visible; the accent ring shows. |
| | Tokens | ✅ | T3: colours resolved from `--mp-*` tokens (`white` mirrors the existing `text-white`). |
| **Works with row** | Still | ✅ | T4: CSS opacity transition on hover/focus only (150 ms). |
| | RM | ✅ | Nothing to reduce. |
| | Paint | ✅ | T4: four names, three bundled SVG marks and the Codex wordmark in `curl` output and `out/index.html`; the four install anchors resolve. |
| | Keys | ✅ | T4: plain links, `focus-visible:opacity-100` and the accent ring. |
| | Tokens | ✅ | T4: `text-mp-ink`, no hex. |
| **Thought Line** | Still | ✅ | T5: plays once at ≥ 40 % in view, never replays on scroll-back. T10: no rAF from it after the play (bottom and back-at-top windows). |
| | RM | ✅ | T5: stays `6 | settled | 3.0s`, toggle works, ring shows. |
| | Paint | ✅ | T5: `out/index.html` holds all six steps, the settled label, `3.0s` and the three captions. The README now states the one caveat (a visitor who reloads already scrolled to it sees the settled trace before the replay). |
| | Keys | ✅ | T5: the toggle is always tabbable; Enter and Space toggle `aria-expanded`; ring `solid 2px` accent. |
| | Tokens | ✅ | T5: ink on surface, ring from `--mp-accent`; checked in both themes. |
| **Chroma bento + hover-once icons** | Still | ✅ | T6: at rest `--chroma-power` 0, no SMIL in the icons (build-time still render); an icon plays once and never again. T10: no rAF from the spotlight at rest. |
| | RM | ✅ | T6: no `--chroma-*` writes under reduced motion or on coarse pointers; icons stay still. |
| | Paint | ✅ | T6: `out/index.html` has 16 `data-bento-tile` links with names and counts, no `<animate`. |
| | Keys | ✅ | T6: tiles are links; Tab plays the icon; accent focus ring. |
| | Tokens | ✅ | T6: wash and glow from `--domain-*`, swatches from `--mp-sidebar-swatch-*`. T10: the built CSS carries the `-webkit-mask` prefix for the ring (check 1). |
| **Flip Card** | Still | ✅ | T7: moves only on click, drag, Enter or Space. T10: no rAF at rest. |
| | RM | ✅ | T7: no transform at any point; faces swap instantly on click, Enter, Space and drag. |
| | Paint | ✅ | T7: without JS both faces render stacked (758 px desktop, 768 px phone); after the fix round both faces stay visible until the card mounts, and their text stays in the accessibility tree after mount. |
| | Keys | ✅ | T7: Enter and Space flip; `outline-solid` ring visible. |
| | Tokens | ✅ | T7: `var(--mp-surface)`, `var(--mp-ink)`, `--skill-shadow` from ink/ground. |
| **Ghost Fibers** | Still | ✅ (continuous by design) | Allowed continuous motion. T8: pauses when scrolled away. T10: the fibres chunk is not requested until the CTA is near; its rAF stops once the page is back at the top. |
| | RM | ✅ | T8: the chunk is never requested. T10: confirmed again after scrolling the whole page: no fibres request, 0 canvases. |
| | Paint | ✅ | T8: the ink section is painted beneath; text contrast ≥ 14:1. |
| | Keys | n/a | Decorative, `aria-hidden`, no interaction. |
| | Tokens | ✅ | T8 fix round: `--mp-accent-soft`, `--domain-sky`, `--mp-muted`, resolved once each. |
| **Gradual Blur** (docs sidebar) | Still | ✅ | Static CSS; `autoHide` only reveals and hides it on scroll. |
| | RM | ✅ | Nothing to reduce. |
| | Paint | ✅ | T9: the tree is complete in the server HTML; the blur mounts after hydration on top. |
| | Keys | n/a | Decorative. T9: at the scroll end the reveal is 0, so the last item is readable. |
| | Tokens | ✅ | T9: tint from `--mp-sidebar-bg`. |
| **Aurora** (Project C, the other allowed continuous motion) | Still | ✅ | T10: 300 rAF calls in 5 s at the top, which is the 60 fps cap; none while the page is scrolled to the bottom (paused offscreen). |
| | RM | ⚠️ | T10: renders nothing (0 canvases) but its chunk is still requested. See check 5 and follow-up 2. |

The anti-goals hold as far as these checks reach. No dot grid or second backdrop shares the hero. Hover changes no layout (T6: 0 holes, 0 overlaps; spotlight is an overlay). The trace copy is pinned against the empathize skill by `lib/trace.test.ts` (T1/T5). Nothing is loaded from a third-party CDN.

## Carried-over checks

### 1. Safari prefix for the bento ring mask

✅ The built stylesheet `apps/docs/out/_next/static/chunks/0v7lkw~ij3i00.css` carries the prefixed shorthand. The `.bento-tile:after` rule reads:

```css
.bento-tile:after{--tile-spot:var(--tile-edge);-webkit-mask-composite:xor,source-over;-webkit-mask-composite:xor,source-over;padding:1px;inset:-1px;-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor,source-over;mask:linear-gradient(#000 0 0) content-box exclude,linear-gradient(#000 0 0)}
```

The source (`app/global.css`) has only the unprefixed `mask: … content-box exclude, …`. Lightning CSS adds `-webkit-mask` and a `-webkit-mask-composite: xor` after it, so the prefixed shorthand does not reset the composite. (The duplicate `-webkit-mask-composite` declarations before it are harmless.) Not checked in a real Safari.

### 2. Flip Card mount shift

✅ Lighthouse home CLS is **0** in all three runs (the card is below the fold at load), so no fix was needed and `SkillFlipCard.tsx` is unchanged.

T10 also measured it directly: the page loaded, the showcase was scrolled into view 50 ms after navigation (before the card mounts), and `layout-shift` entries were recorded for 7 s.
- 1440 × 900: one shift of **0.0345** (source: the next section moving), in two runs.
- 412 × 823 (mobile emulation): one shift of **0.0485**.

That is under Task 7's 0.06–0.077 and under 0.1.

### 3. Thought Line growth and collapse

Lighthouse attributes **no** CLS to it: there are no layout-shift items in any of the three home reports. The section is below the fold and Lighthouse does not scroll.

T10 measured it with the section scrolled to the centre 1.5 s after load and `layout-shift` entries recorded for 7 s. All entries fall in one session window (gaps ≤ 0.5 s, span about 3.2 s), so the window's CLS is their sum.

| Viewport | CLS during the play | Sources |
|---|---|---|
| 1440 × 900 | 0.039 | the captions `<ul>` under the card, and the bento section below it |
| 768 × 1024 | 0.067 | same |
| 412 × 823 | 0.107 / 0.107 (two runs) | same: one shift per beat as each step is appended (about 0.009 each), then a run of small shifts as the trace collapses |
| 390 × 844 | 0.104 | same |

⚠️ On phone viewports, a visitor who stops with the section centred while it plays gets about 0.105, just over the 0.1 budget. It happens once per page load, and only if the visitor holds still during the 3 s play. Real-user CLS would only reach this when nothing else on the page shifts in the same session. This task does not change the Thought Line (the brief scopes a CLS fix to the Flip Card). The fix Task 5 named is in follow-up 3.

### 4. Collapsed desktop sidebar with the blur

✅ `/docs/compliance/` at 1440 × 900. Clicking "Collapse Sidebar" moved the aside to x = −268 and the blur's holder with it (x = −269, 56 px tall). Nothing was left on screen. Hovering the left edge slid the aside back in as a floating panel at x = 8, and the blur came with it (x = 7), sitting over the bottom of the tree ("Examples" blurred) above the footer. The only `backdrop-filter` elements outside the aside are Fumadocs' own headers and an empty toolbar slot; none of them is the Gradual Blur.

Screenshots (scratch): `t10-sidebar-expanded.png`, `t10-sidebar-collapsed.png`, `t10-sidebar-collapsed-hover.png`.

### 5. Aurora chunk under reduced motion

⚠️ Confirmed. With `prefers-reduced-motion: reduce` emulated (`matchMedia` returns true), the home page still requests the aurora chunk (`151z964suhva-.js`, 11.9 KB, initiator `script`). The page then has 0 canvases, so the Aurora renders nothing and no WebGL context is created. The cause is that `Hero.tsx` renders `<Aurora>` when `auroraTheme && idle`, without `!reduced`, so `next/dynamic` imports the chunk and the wrapper returns `null`. Hero was not changed in this task. See follow-up 2.

In the same run, the fibres chunk was never requested, even after scrolling the whole page.

### 6. Rest-state rAF count

✅ No Project D piece animates at rest. `requestAnimationFrame` was wrapped before any page script ran, and each call was attributed by the chunk at the top of its stack. The aurora chunk is `151z964suhva-.js` and the fibres chunk is `0r-pb.jk9glum.js`, identified by their shader uniforms. Each window was 5 s with no input.

| Window | Total | Aurora | Fibres | Other |
|---|---:|---:|---:|---|
| Top of page, 4 s after load | 620 | 300 | 0 | 300 + 20 from GSAP ScrollTrigger |
| Bottom of page, after scrolling through once and waiting 6 s (Thought Line played, icons and fibres mounted) | 620 | 0 | 300 | 300 + 20 from GSAP ScrollTrigger |
| Back at top | 654 | 300 | 0 | 300 + 20 ScrollTrigger + 34 GSAP ticker (the hero's scroll-scrub settling after the jump) |

The "other" calls all come from the shared GSAP chunk, which is Project C's hero code, not a Project D piece:
- ScrollTrigger's empty keep-alive loop runs `function t(){return i7&&requestAnimationFrame(t)}` at 60 Hz while ScrollTrigger is enabled. This is upstream's `_rafBugFix`. Its callback does nothing.
- ScrollTrigger's 250 ms sync interval (`sK`) queues a rAF at about 4 per second.

StarBorder, ThoughtLine, FlipCard (`motion`), ChromaSpotlight and the icons made no rAF calls in any window. Both continuous canvases also paused offscreen: the aurora had 0 calls while the page was at the bottom, and the fibres had 0 once it was back at the top. The headless tab reported `document.hidden === false`.

## Acceptance checklist

| # | Item | Status | Evidence |
|---|---|---|---|
| 1 | Full gate green (tests, Biome, build, docs `check`, plugin-tools build and `check`) | ✅ | [Gate](#gate) |
| 2 | Lighthouse performance ≥ 0.90 (home, mobile) | ✅ | 0.92–0.93 |
| 3 | Lighthouse accessibility ≥ 0.95 | ✅ | 1.00 home, 1.00 docs |
| 4 | CLS ≤ 0.1 | ✅ in Lighthouse (0) · ⚠️ 0.104–0.107 with the Thought Line in view on phones | [Check 3](#3-thought-line-growth-and-collapse) |
| 5 | First-load JS for `/` ≤ 976,366 B | ✅ | 820,822 (+94,456) |
| 6 | Behaviour rules per piece | ✅ (aurora reduced-motion chunk ⚠️, pre-existing) | [Behaviour rules](#behaviour-rules-spec-3-per-piece) |
| 7 | Six carried-over checks | ✅ 1, 2, 4, 6 · ⚠️ 3, 5 written up | [Carried-over checks](#carried-over-checks) |
| 8 | Safari rendering of the bento ring | ⏳ owner | Prefix present in the CSS; not opened in Safari |
| 9 | Pieces on a real GPU in both themes (aurora, fibres) | ⏳ owner | Headless checks use software rendering |

## Follow-ups

1. **LCP 3.2–3.3 s on simulated mobile** (Project C: 2.7–2.9 s). Project C's lever still applies: load GSAP and ScrollTrigger after first paint. The Project D first-load additions (a 69 KB uncompressed first-load chunk that includes `motion`, pulled in by the `ssr: true` SkillTrace import, plus the bento client code) could also move behind in-view mounting if the score needs headroom.
2. **Aurora chunk under reduced motion.** In `components/home/Hero.tsx`, gate the `<Aurora>` element on `!reduced` as well (`auroraTheme && idle && !reduced`), as `CtaFibers` does, so `next/dynamic` never fetches the chunk. It saves one 11.9 KB request for reduced-motion visitors and has no visual effect.
3. **Thought Line CLS on phones (about 0.105 with the section in view).** Task 5's named fix: hold the trace's six-step height while it plays, so appending steps does not push the captions down. Then animate the collapse inside a fixed-height box, or let the settled card keep that height. The captions `<ul>` is the moving source in every entry.
4. **ScrollTrigger keep-alive rAF.** GSAP ScrollTrigger keeps an empty 60 Hz rAF loop alive for as long as it is enabled. It draws nothing, but it keeps the page from being fully idle. This is pre-existing (Project C); it could go if the hero's scroll-shrink moved off ScrollTrigger, or if ScrollTrigger were disabled once the hero has scrolled past.
5. **Deferred minors from the task reviews** (see the SDD ledger): Pill↔StarPill circular import; `Hero.tsx` keeps a local copy of `lib/motion.ts`'s `useIdle`; the still-icon baker supports only the SMIL subset the 16 icons use (add a guard test); the animated icon markup ships for all 16 tiles in the RSC payload; find-in-page matches the `opacity-0` flip-card copy; the sidebar blur depends on the Radix `data-radix-scroll-area-viewport` attribute (it becomes a silent no-op if that changes).
6. **Owner eyeball:** the light-theme glow mixed toward ink, the cream meta tile in dark, and the fibres' second ribbon (`--domain-sky`) on a real GPU.

## Concerns

1. **Thought Line CLS** is just over budget on phones in a scroll-and-hold scenario that Lighthouse does not exercise. It is recorded as ⚠️, not fixed, because the brief scopes this task's CLS fix to the Flip Card.
2. **The performance score fell from 0.95–0.96 to 0.92–0.93.** It is still within budget, but there is less headroom for later work.
3. **Local server and headless Chrome are not GitHub Pages and a real device.** Lighthouse variance is about ±0.02 in score and ±0.15 s in LCP (Project C's estimate). WebGL ran in software in headless Chrome.

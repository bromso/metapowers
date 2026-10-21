# Site polish: acceptance results

Date: 2026-10-21 · Branch: `worktree-site-polish` · Next.js 16.2.4 (Turbopack) · Lighthouse via `bunx lighthouse` (headless Chrome)

These are the results for the docs-site polish in [`docs/superpowers/specs/2026-10-21-site-polish-design.md`](../specs/2026-10-21-site-polish-design.md). They were measured on the production build (`apps/docs/out`) after the last feature commit (`818f891`), the Task 15 commit (`a223d2f`) and one performance fix round.

**Summary.**
- **Gate:** green.
  - `bun run test`: 9/9 turbo tasks pass.
  - Biome: clean.
  - The docs build exports 192 static pages.
  - `bun run check` in `apps/docs` exits 0.
- **CI:** the root `bun run check:plugins` (`turbo run check`) already reaches the docs `check` task. The workflow now also triggers on `apps/docs/scripts/**` and `apps/docs/lib/**`.
- **Accessibility:** home 1.00, docs page 1.00, after the docs pages gained a main landmark. Colour contrast passes on both.
- **Performance:**
  - ⚠️ home performance is **0.95–0.96**, which meets ≥ 0.90.
  - ⚠️ LCP is **2.71–2.86 s**, which **still misses** ≤ 2.5 s, by 0.2–0.4 s.
  - CLS is 0.
  - Before the fix round the figures were 0.84–0.85 and 4.4 s.
- **JS:** the first-load JS for `/` is **726,366 bytes**, +36,238 over the Task 1 baseline. It was 1,151,559 before the fix round. Gzipped it is 225.7 KB, down from 360.6 KB.
- **Brand font:** the site now renders in Miranda Sans. Before this round it rendered in the system font stack. See [Fix round](#performance-fix-round).

Legend: ✅ met with recorded evidence · ⚠️ missed or weak, written up · ⏳ pending (owner or post-deploy)

## Gate

Final state, re-run after the fix round:

| Step | Command | Result |
|---|---|---|
| CI reach | `bun turbo run check --filter=@metapowers/docs --dry-run=json \| grep -c '"task": "check"'` (worktree root) | ✅ `1`. The planned command is `bun scripts/gen-site-data.ts --check && bun scripts/codemod-skill-pages.ts --check`. Turbo did not stall. |
| Docs checks | `bun run check` (in `apps/docs`) | ✅ exit 0. It prints the four known `unmatched: … — What It Does` lines (see [Codemod](#codemod)). `site-data.json` and `search-commands.json` are unchanged. |
| Tests | `bun run test` (worktree root) | ✅ exit 0, 9/9 turbo tasks: docs 43, skill-validator 68, plugin-tools 161, figma-mcp 30, create-metapowers 6. |
| Lint | `bunx biome check apps/docs` | ✅ 86 files, no errors. The Task 15 commit fixed an import-order error in `app/layout.tsx` that Task 14 had left. |
| Build | `bun run build` (in `apps/docs`) | ✅ exit 0, 192 static pages. |

Known noise in the output, none of it a failure:
- Node prints `DEP0205` (`module.register()` deprecated) when Vitest and next build start. This is pre-existing and deferred.
- Next warns that it inferred the workspace root ("set `turbopack.root`").
- `bunx` warns about an `@opentelemetry/api` peer dependency.

## CI wiring

`.github/workflows/validate-skills.yml` runs `bun run check:plugins`, which is the root `turbo run check`. `apps/docs/turbo.json` (Task 1) gives the docs `check` task no build dependency, so CI runs the data and codemod checks with no build step.

**Change in Task 15.** The workflow's path filters listed `apps/docs/app/**` and `apps/docs/content/**`, but not the generator or its committed output. A PR that touched only `apps/docs/scripts/gen-site-data.ts`, `lib/site-data.json` or `lib/search-commands.json` would skip the job. Both paths are now added: `apps/docs/scripts/**` and `apps/docs/lib/**`. The step is renamed to say it covers the docs checks.

## Lighthouse

**Setup.** Lighthouse ran in its default mobile emulation, with simulated slow 4G and 4× CPU slowdown. The flags were:

`--form-factor=mobile --only-categories=performance,accessibility --chrome-flags="--headless=new"`

The plan's `--preset=mobile` is not a valid preset in this Lighthouse version.

**Serving.** The site needs its `/metapowers` basePath, so it was served from a scratch server:
- A small Bun static server (`127.0.0.1:4175`) served `apps/docs/out` under `/metapowers`.
- It gzips HTML, JS, CSS, SVG, JSON and TXT, as GitHub Pages does. Font files are sent as-is.
- The first measurement was also taken uncompressed, with `python3 -m http.server`.
- Each step was measured with three runs on the home page and one on `/docs/design/a11y-audit/`.

| Stage | Home perf (3 runs) | Home LCP | Docs perf | Docs LCP | A11y (home / docs) |
|---|---|---|---:|---:|---|
| Start, uncompressed server | 0.46 | 10.9 s | 0.73 | 10.3 s | 1.00 / 0.98 |
| Start, gzip server | 0.85 / 0.84 / 0.84 | 4.36–4.51 s | 0.85 | 4.36 s | 1.00 / 0.98 |
| Aurora dpr 1 + idle mount (Task 15 commit) | 0.85 / 0.84 / 0.85 | 4.36–4.51 s | 0.86 | 4.21 s | 1.00 / 0.98 |
| Fix 1: WOFF2 fonts | 0.90 / 0.90 / 0.91 | 3.46–3.61 s | 0.88 | 3.91 s | 1.00 / 0.98 |
| Fix 2: preload 400/500 only, and Miranda actually applied | 0.90 / 0.93 / 0.90 | 3.16–3.61 s | 0.89 | 3.76 s | 1.00 / 0.98 |
| Fix 3: lazy search dialog + lazy Aurora | 0.95 / 0.96 / 0.95 | 2.71–2.86 s | 0.93 | 3.23 s | 1.00 / 0.98 |
| **Fix 4 (final): docs main landmark** | **0.95 / 0.96 / 0.96** | **2.71–2.86 s** | **0.93** | **3.22 s** | **1.00 / 1.00** |

**Final metrics:**
- **Home:** FCP 0.90 s, TBT 58–72 ms, Speed Index ~1.8 s, CLS 0.
- **Docs:** FCP 1.06 s, TBT 6 ms, CLS 0.

**Targets (spec §8), home page:**

| Metric | Target | Final |
|---|---|---|
| Performance | ≥ 0.90 | ✅ 0.95–0.96 |
| Accessibility | ≥ 0.95 | ✅ 1.00 (docs page 1.00 too) |
| LCP | ≤ 2.5 s | ⚠️ 2.71–2.86 s |
| CLS | ≤ 0.1 | ✅ 0 |

**Why LCP is still over 2.5 s.**
- In the real, unthrottled trace, LCP happens at the same moment as FCP: about 70 ms, when the server-rendered hero `<h1>` paints.
- Lantern's simulated LCP charges every request made before that moment. That includes the fonts and every first-load JS chunk the HTML references.
- The remaining first-load JS totals 226 KB gzipped across 13 chunks. The largest are React DOM (~71 KB gz), GSAP with ScrollTrigger (~51 KB gz) and a 37 KB gz framework chunk whose contents I didn't identify. GSAP drives the hero's scroll-shrink and SplitText.
- The next lever would be loading GSAP after first paint. The fix round's step list stops before that.

**JSON reports** (scratch, not committed) are in `/private/tmp/claude-501/-Users-jonasbroms-Sites-metapowers/60cf9438-7627-4c25-b8c7-d534fd41322d/scratchpad/`:
- Start: `lh-home.json`, `lh-docs.json`, `lh-home-gz*.json`, `lh-docs-gz.json`.
- After the Aurora tuning: `lh-home-tuned-*.json`, `lh-docs-final.json`.
- Fix-round steps: `lh-s1-*`, `lh-s2-*` (fonts split, before the family fix), `lh-s2f-*`, `lh-s3a-*` and `lh-final-*`.

## Performance fix round

| Step | Change | What it bought (home) |
|---|---|---|
| Aurora (Task 15 commit) | `dpr={1}`, mounted after `requestIdleCallback` | Nothing measurable. Kept, because it takes GPU work off first paint. |
| 1. WOFF2 | `app/fonts/miranda-sans-{400,500,600,700}.ttf` converted with `bunx ttf2woff2`: 49 KB → 18–19 KB each. `next/font/local` points at the `.woff2` files. Of the TTFs, only `miranda-sans-500.ttf` is kept, for the `opengraph-image` route, because satori needs TTF/OTF. The OG image still renders. | +0.06 perf, −0.9 s LCP |
| 2. Preload 400/500 only | `app/layout.tsx` has two `localFont` calls that declare the same family (`mirandaSans`) through `declarations`. 400/500 are preloaded. 600/700 use `preload: false` and `adjustFontFallback: false`, so they load when first used. CSS sees one four-weight family, so no per-selector remapping was needed. The home page now fetches only 400/500; docs pages fetch 600 for headings. | about +0.01 and −0.1 to −0.3 s LCP |
| 2b. Brand font fix | `app/global.css` sets `--font-sans: var(--font-fd-sans)`. See the note below. | none on its own (it is a rendering fix) |
| 3a. Lazy search | `components/search-lazy.tsx` wraps the search dialog in `next/dynamic` with `ssr: false`, and `app/layout.tsx` uses it. ⌘K opens the dialog; "audit" returns grouped results; Enter navigates. | together with 3b, +0.05 perf and −0.5 s LCP |
| 3b. Lazy Aurora | `Aurora` is imported through `next/dynamic` with `ssr: false` in `Hero.tsx`. The static gradient covers first paint, and the canvas still mounts. | first-load JS 1,151,559 → 726,366 bytes |
| 3b. SplitText: not deferred | Deliberately left eager. Deferring it means a plain `<h1>` paints first and SplitText mounts later. Its intro would then hide and re-raise text that is already on screen, which breaks the first-paint rule in `components/motion/README.md`. Skipping the intro instead would remove the animation. The replacement `<h1>` would also become a later LCP candidate. | n/a |
| 4. Main landmark | `app/docs/[[...slug]]/page.tsx` passes `role="main"` to `DocsPage`, which puts it on its container, `article#nd-page`. That container is a CSS grid item, so a `<main>` wrapper would break the layout. A `biome-ignore` comment records this. Each docs page has exactly one main landmark, and the home page keeps its single `<main>`. | docs a11y 0.98 → 1.00 |

**Brand font fix.** The site had never rendered in Miranda Sans on Fumadocs 16. `app/global.css` set only `--font-fd-sans`, which nothing reads. Tailwind 4's preflight resolves `html { font-family }` through `--font-sans`, so every page used `ui-sans-serif, system-ui`. The preloaded faces downloaded but stayed `unloaded` in `document.fonts`. This was already true on `main`, where `--font-fd-sans` was set to `"Miranda Sans"`.

With the fix, `h1`, `h2` and body text compute to `mirandaSans` and the faces load. Screenshots of the home page (mobile) and a docs page (desktop) show the layout intact:
- `shot-s2-home.png`
- `shot-s2-docs.png`
- `shot-s3a-home.png`

All three are in the scratch directory above. **This is a visible change across the whole site, so the owner should look at it.**

## JS budget

| | Bytes (`firstLoadUncompressedJsBytes`, route `/`, `.next/diagnostics/route-bundle-stats.json`) | Gzip (sum of chunks, `gzip -9`) |
|---|---:|---:|
| Task 1 baseline | 690,128 | not recorded |
| After the Task 15 commit | 1,151,559 | 360,620 |
| **Final** | **726,366** | **225,694** |
| **Delta vs baseline** | **+36,238** ✅ (budget +750,000) | |

## Search check (Task 10, re-checked after lazy loading)

- **Task 10:** searching "audit" grouped results under Accessibility, Accounting, Branding, Design, Compliance, Legal, Metapowers and Marketing, and Enter navigated to the selected result. Task 15a then added each skill's command under its result.
- **Fix round:** after search became lazy, ⌘K opened the dialog on both the home page and a docs page. Results grouped by domain, commands showed (for example `/accessibility:scope <target>`), and Enter navigated.

## Codemod

Task 12 report: `.superpowers/sdd/2026-10-21-site-polish/task-12-codemod-report.txt`.
- **186 pages changed.**
- **4 unmatched "What It Does" sections**, all one-off shapes left as prose: `branding/audit`, `development/build`, `development/debug` and `development/ship`.
- The multiset word diff was clean, apart from 44 empty `Usage` headings dropped as the spec sanctions.
- `bun run check` re-confirms that the codemod is idempotent over the committed content.

## Acceptance checklist

| # | Item | Status | Evidence |
|---|---|---|---|
| 1 | Full gate green (tests, Biome, build, docs `check`) | ✅ | [Gate](#gate) |
| 2 | Docs data and codemod checks reached by CI | ✅ | Dry run shows the docs `check` task; path filters widened |
| 3 | Lighthouse accessibility ≥ 0.95 | ✅ | 1.00 home, 1.00 docs |
| 4 | Lighthouse performance ≥ 0.90 (home, mobile) | ✅ | 0.95–0.96 |
| 5 | LCP ≤ 2.5 s (home, mobile) | ⚠️ | 2.71–2.86 s after all fix-round steps. See [Lighthouse](#lighthouse) and follow-up 1. |
| 6 | CLS ≤ 0.1 | ✅ | 0 on both pages |
| 7 | Homepage JS within baseline + budget | ✅ | +36,238 B of +750,000 B |
| 8 | Search groups by domain; Enter navigates | ✅ | Task 10, re-checked after lazy loading |
| 9 | Skill pages converted by the codemod; `--check` idempotent | ✅ | 186 changed, 4 unmatched, `check` exit 0 |
| 10 | Aurora on a real GPU (headless rendered it white in Task 5) | ⏳ owner | Needs a browser with a real GPU, in both themes |
| 11 | OG image content type on GitHub Pages | ⏳ post-deploy | See follow-up 4 |
| 12 | Site renders in Miranda Sans | ✅, owner look | Fixed in this round; see the note in [Fix round](#performance-fix-round) |

## Follow-ups

1. **LCP 2.7–2.9 s on simulated mobile.** The next lever is to load GSAP and ScrollTrigger (~51 KB gz) after first paint. The hero's scroll-shrink could start on idle. SplitText's intro would need its own handling to keep the first-paint rule.
2. **Search index size.** `out/api/search` is about 21.5 MB in this build; Task 10 measured 25.7 MB. It is the pre-existing flexsearch static export of all pages. Consider a smaller index: fewer fields, headings only, or one index per domain.
3. **`/docs/` has no index page.** The client prefetches `/metapowers/docs/` and gets a 404. This was visible before the fix round as well. Add a redirect page or remove the link target.
4. **OG image content type.** The exported `opengraph-image` file has no extension. After the first deploy, check that GitHub Pages serves it as `image/png` and not `application/octet-stream`.
5. **Shared domain colour.** `design` and `metapowers` both use `sand` (`lib/domains.ts`). Reassign one of them.
6. **Hero inset geometry.** The hero insets 24 px at the top and more at the sides. This is by design: the side inset is folded into the scale.
7. **Light-mode aurora saturation.** In light mode the WebGL aurora reads more saturated than the static CSS gradient beneath it.
8. **Per-domain grid count.** The grid's eyebrow counts skills, but its tiles list documented pages.
9. **Aurora on a real GPU.** Checklist item 10.
10. **Fonts and the Fumadocs upgrade.** The shared-family trick depends on Turbopack building `--font-miranda` from the first `localFont` call's identifier (`mirandaSans`), and both calls declare that exact family. After a Next upgrade, confirm that `--font-miranda` still resolves to `mirandaSans` in `out/_next/static/chunks/*.css`.

## Concerns

1. **LCP target missed** by 0.2–0.4 s on simulated slow 4G, after every step in the fix round. Performance itself is comfortably over target.
2. **The local server is not GitHub Pages.** The gzip server approximates Pages' compression but not its CDN latency or caching.
3. **Lighthouse variance.** Repeated runs spread by about ±0.02 in score and ±0.15 s in LCP. Step-to-step changes were larger than that, except step 2 against step 1.
4. **The brand-font fix is a site-wide visual change** that earlier browser checks didn't see, because they were looking at the system font.
5. **Edits outside the brief's file list:**
   - `app/layout.tsx`: the import sort, the font split and the lazy search;
   - `app/global.css`;
   - `components/search-lazy.tsx` (new);
   - `app/docs/[[...slug]]/page.tsx`;
   - `app/fonts/*`.

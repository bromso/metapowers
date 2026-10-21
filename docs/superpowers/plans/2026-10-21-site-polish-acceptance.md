# Site polish: acceptance results

Date: 2026-10-21 · Branch: `worktree-site-polish` · Next.js 16.2.4 (Turbopack) · Lighthouse via `bunx lighthouse` (headless Chrome)

These are the results for the docs-site polish in [`docs/superpowers/specs/2026-10-21-site-polish-design.md`](../specs/2026-10-21-site-polish-design.md), measured on the production build (`apps/docs/out`) after the last feature commit (`818f891`) plus the Task 15 changes.

**Summary.**
- **Gate:** green. Tests 9/9 turbo tasks, Biome clean, the docs build exports 192 static pages, and `bun run check` in `apps/docs` exits 0.
- **CI:** the root `bun run check:plugins` (`turbo run check`) already reaches the docs `check` task. The workflow now also triggers on `apps/docs/scripts/**` and `apps/docs/lib/**`.
- **Accessibility:** home 1.00, docs page 0.98. Both meet ≥ 0.95. Colour contrast passes on both pages.
- **Performance:** ⚠️ **missed.** The home page scores 0.84–0.85 (target ≥ 0.90), with LCP 4.4 s (target ≤ 2.5 s). CLS is 0. Moving the Aurora to dpr 1 and an idle-deferred mount changed nothing measurable. The cause is network-bound: four preloaded TTF fonts and the first-load JS. It is not the WebGL backdrop.
- **JS budget:** within budget. The `/` route is +461,431 bytes uncompressed over the Task 1 baseline, against a budget of +750,000.

Legend: ✅ met with recorded evidence · ⚠️ missed or weak, written up · ⏳ pending (owner or post-deploy)

## Gate

| Step | Command | Result |
|---|---|---|
| CI reach | `bun turbo run check --filter=@metapowers/docs --dry-run=json \| grep -c '"task": "check"'` (worktree root) | ✅ `1`. The planned command is `bun scripts/gen-site-data.ts --check && bun scripts/codemod-skill-pages.ts --check`. Turbo did not stall. |
| Docs checks | `bun run check` (in `apps/docs`) | ✅ exit 0. It prints the four known `unmatched: … — What It Does` lines (see [Codemod](#codemod)). `site-data.json` and `search-commands.json` are unchanged. |
| Tests | `bun run test` (worktree root) | ✅ exit 0, 9/9 turbo tasks: docs 43, skill-validator 68, plugin-tools 161, figma-mcp 30, create-metapowers 6. Docs re-run after the Hero change: 43/43. |
| Lint | `bunx biome check apps/docs` | ✅ 85 files, no errors. The first run found one error: unsorted imports in `app/layout.tsx`, left by the Task 14 fix commit. The import sort is now fixed. |
| Build | `bun run build` (in `apps/docs`) | ✅ exit 0, 192 static pages, rebuilt after the Hero change. |

Known noise in the output, none of it a failure:
- Node prints `DEP0205` (`module.register()` deprecated) when Vitest and next build start. This is pre-existing and deferred.
- Next warns that it inferred the workspace root ("set `turbopack.root`").
- `bunx` warns about an `@opentelemetry/api` peer dependency.

## CI wiring

`.github/workflows/validate-skills.yml` runs `bun run check:plugins`, which is the root `turbo run check`. `apps/docs/turbo.json` (Task 1) gives the docs `check` task no build dependency, so CI runs the data and codemod checks with no build step.

**Change in this task.** The workflow's `push`/`pull_request` path filters listed `apps/docs/app/**` and `apps/docs/content/**`, but not the generator or its committed output. A PR that touched only `apps/docs/scripts/gen-site-data.ts`, `lib/site-data.json` or `lib/search-commands.json` would therefore skip the job, and drift would go unnoticed. Both paths are now added: `apps/docs/scripts/**` and `apps/docs/lib/**`. The step is renamed to say it covers the docs checks. No new step was needed.

## Lighthouse

**Setup.** Lighthouse ran in its default mobile emulation, with simulated slow 4G and 4× CPU slowdown. The command:

`--form-factor=mobile --only-categories=performance,accessibility --chrome-flags="--headless=new"`

The plan's `--preset=mobile` is not a valid preset in this Lighthouse version (it accepts perf, experimental or desktop), and mobile is the default.

**Serving.** The site's `/metapowers` basePath needs a prefixed server:
- `bunx serve` could not bind, and port 4173 was held by another process.
- `python3 -m http.server` (port 4174) served a `metapowers` symlink to `apps/docs/out`. It sends files **uncompressed**.
- A small Bun static server (port 4175) served the same tree with **gzip**, as GitHub Pages does. Its TTF fonts were left uncompressed.

The gzip numbers are the representative ones.

| Page | Server | Build | Perf | A11y | LCP | CLS | FCP | TBT |
|---|---|---|---:|---:|---:|---:|---:|---:|
| `/metapowers/` | uncompressed | before tuning | 0.46 | 1.00 | 10.9 s | 0 | 1.95 s | 1,081 ms |
| `/metapowers/docs/design/a11y-audit/` | uncompressed | before tuning | 0.73 | 0.98 | 10.3 s | 0 | 1.95 s | 6 ms |
| `/metapowers/` (3 runs) | gzip | before tuning | 0.85 / 0.84 / 0.84 | 1.00 | 4.36–4.51 s | 0 | 0.90 s | 34–36 ms |
| `/metapowers/` (3 runs) | gzip | **after tuning** (Aurora dpr 1 + idle mount) | 0.85 / 0.84 / 0.85 | 1.00 | 4.36–4.51 s | 0 | 0.90 s | 30–38 ms |
| `/metapowers/docs/design/a11y-audit/` | gzip | after tuning | 0.86 | 0.98 | 4.21 s | 0 | 0.90 s | 6 ms |
| `/metapowers/` (diagnostic) | gzip **including TTF** | after tuning | 0.89 | 1.00 | 3.76 s | 0 | 0.91 s | 30 ms |

**Targets (spec §8):**

| Metric | Target | Result |
|---|---|---|
| Performance | ≥ 0.90 | ⚠️ 0.84–0.85 |
| Accessibility | ≥ 0.95 | ✅ 1.00 home, 0.98 docs |
| LCP | ≤ 2.5 s | ⚠️ ~4.4 s |
| CLS | ≤ 0.1 | ✅ 0 |

**Tuning (plan Step 3).** The Aurora now renders at `dpr={1}` (was 1.5). `components/home/Hero.tsx` mounts it only after `requestIdleCallback`, with a 2 s timeout, or after `setTimeout(200)` where `requestIdleCallback` is missing. The static CSS gradient paints underneath until then. Scores before and after are the same within run-to-run noise. Main-thread bootup was already low under gzip (0.5–0.6 s), and TBT was ~35 ms. The change is kept because it is cheap and takes GPU work off first paint, but it does not move the score.

**Why LCP is ~4.4 s.**
- The docs page has no hero, no SplitText and no WebGL, yet its LCP (a plain `<p>`) is 4.2 s. The cause is common to both pages.
- In the observed trace the LCP render delay is ~65 ms. The simulated LCP comes from the bytes fetched before it:
  - four `next/font/local` TTF files, preloaded at High priority, ~49 KB each and ~196 KB in total;
  - ~360 KB gzipped of first-load JS.
- With the TTFs gzipped by the test server (~24 KB each, roughly what WOFF2 would give), the home page reaches 0.89 and LCP 3.76 s.
- On the home page the LCP element is the hero `<h1>` (SplitText). On the docs page it is the first prose paragraph.

**Accessibility detail.**
- Home: every audit passes.
- Docs: one failure, `landmark-one-main` ("Document does not have a main landmark"). The Fumadocs docs layout renders `article#nd-page` without a `<main>`.
- `color-contrast` passes on both pages. That covers the Task 8 concern about domain-band contrast.

**JSON reports** (scratch, not committed), under `/private/tmp/claude-501/-Users-jonasbroms-Sites-metapowers/60cf9438-7627-4c25-b8c7-d534fd41322d/scratchpad/`:
- uncompressed: `lh-home.json`, `lh-docs.json`;
- gzip, before tuning: `lh-home-gz.json`, `lh-home-gz-2.json`, `lh-home-gz-3.json`, `lh-docs-gz.json`;
- gzip, after tuning: `lh-home-tuned-1.json` to `-3.json`, `lh-docs-final.json`;
- diagnostic: `lh-home-fontgz.json`.

No screenshots were taken.

## JS budget

| | Bytes (`firstLoadUncompressedJsBytes`, route `/`, `.next/diagnostics/route-bundle-stats.json`) |
|---|---:|
| Task 1 baseline | 690,128 |
| Now, after the Hero change | 1,151,559 |
| **Delta** | **+461,431** ✅ (budget +750,000) |

The budget follows the Task 1 ruling: the spec's +250 KB gzipped, read as +750 kB on this uncompressed metric. For reference, the 17 first-load chunks of `/` gzip to 360,620 bytes in total (`gzip -9`). No gzipped baseline was recorded in Task 1, so there is no gzipped delta. Before the Hero change the figure was 1,151,261, so the idle hook added 298 bytes.

## Search check (Task 10)

Searching "audit" in the dialog returned results grouped under Accessibility, Accounting, Branding, Design, Compliance, Legal, Metapowers and Marketing. Enter navigated to the selected result. Task 15a then added the skill command under each result, bound to its row's highlight and click target.

## Codemod

Task 12 report: `.superpowers/sdd/2026-10-21-site-polish/task-12-codemod-report.txt`.
- **186 pages changed.**
- **4 unmatched "What It Does" sections**, all one-off shapes left as prose: `branding/audit`, `development/build`, `development/debug` and `development/ship`.
- The multiset word diff was clean, apart from 44 empty `Usage` headings that were dropped as the spec sanctions.
- `bun run check` re-confirms today that the codemod is idempotent over the committed content: `--check` exits 0 and prints the same four unmatched lines.

## Acceptance checklist

| # | Item | Status | Evidence |
|---|---|---|---|
| 1 | Full gate green (tests, Biome, build, docs `check`) | ✅ | [Gate](#gate) |
| 2 | Docs data and codemod checks reached by CI | ✅ | Dry run shows the docs `check` task. Path filters widened ([CI wiring](#ci-wiring)). |
| 3 | Lighthouse accessibility ≥ 0.95 | ✅ | 1.00 home, 0.98 docs |
| 4 | Lighthouse performance ≥ 0.90, LCP ≤ 2.5 s (home, mobile) | ⚠️ | 0.84–0.85, LCP ~4.4 s, with the plan's Aurora tuning applied. See [Lighthouse](#lighthouse) and follow-up 1. |
| 5 | CLS ≤ 0.1 | ✅ | 0 on both pages |
| 6 | Homepage JS within baseline + budget | ✅ | +461,431 B of +750,000 B |
| 7 | Search groups by domain; Enter navigates | ✅ | Task 10 check |
| 8 | Skill pages converted by the codemod; `--check` idempotent | ✅ | 186 changed, 4 unmatched, `check` exit 0 |
| 9 | Aurora on a real GPU (headless rendered it white in Task 5) | ⏳ owner | Needs a browser with a real GPU, in both themes |
| 10 | OG image content type on GitHub Pages | ⏳ post-deploy | See follow-up 4 |

## Follow-ups

1. **Performance: fonts first.** Convert `app/fonts/miranda-sans-{400,500,600,700}.ttf` to WOFF2. The spec §7 leaves this optional; this record recommends doing it. No converter (`woff2_compress`, fontTools) is installed here, so the change wasn't made in this task. Gzipping the TTFs alone lifted the home score from 0.85 to 0.89. Also consider:
   - preloading only the weights used above the fold (`preload: false` on the others);
   - checking whether GitHub Pages compresses `.ttf`.

   After the fonts, the next lever is first-load JS: Under gzip, Lighthouse estimates 158 KiB of unused JavaScript on the home page and 167 KiB on the docs page.
2. **Search index size.** `out/api/search` is 21,502,825 bytes (~20.5 MiB) in this build; Task 10 measured it at 25.7 MB. It is the pre-existing flexsearch static export of all pages. Consider a smaller index: fewer fields, or headings only, or a split per domain.
3. **Docs pages have no `<main>` landmark.** This is Lighthouse `landmark-one-main` on `/docs/design/a11y-audit/`. Wrap the docs article in `<main>`, or check whether a Fumadocs option provides one.
4. **OG image content type.** The exported `opengraph-image` file has no extension. After the first deploy, check that GitHub Pages serves it as `image/png` and not `application/octet-stream`.
5. **Shared domain colour.** `design` and `metapowers` both use the `sand` colour (`lib/domains.ts`). Reassign one of them.
6. **Hero inset geometry.** The hero insets 24 px at the top and more at the sides. This is by design: the side inset is folded into the scale. Note it for anyone who expects an even inset.
7. **Light-mode aurora saturation.** In light mode the WebGL aurora reads more saturated than the static CSS gradient beneath it, so the swap is visible. Tune `lightMode` opacity, or the stops.
8. **Per-domain grid count.** The grid's eyebrow counts skills, but its tiles list documented pages, so the two numbers differ.
9. **Aurora on a real GPU.** It rendered white in Task 5's headless check. Confirm it in a real browser in both themes; checklist item 9 covers this.

## Concerns

1. **The performance target is not met on simulated mobile.** The plan's prescribed Aurora tuning is in, and it does not help, because the bottleneck is network bytes. Follow-up 1 is the evidence-backed next step.
2. **The local server is not GitHub Pages.** The gzip server approximates Pages' compression but not its CDN latency or caching. With no compression at all, the scores drop sharply (0.46 home), so whether Pages compresses fonts and JS matters.
3. **Lighthouse variance.** Three runs per configuration spread by ±0.01. The before/after comparison holds within that.
4. **Biome fix outside the brief's file list.** `app/layout.tsx` had an import-order error, so the brief's Biome gate would have failed. This task fixed it (import sort only, no behaviour change).

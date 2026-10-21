# Site Polish Design (Project C)

Date: 2026-10-21
Status: builder-checked, awaiting owner approval
Scope: `apps/docs` (the Fumadocs + Next.js site deployed to GitHub Pages at `https://bromso.github.io/metapowers`)

## 1. Intent and why

The plugins now install and run (Project A) and the skills route and score well (Project B). The site that sells and documents them still looks like a stock documentation template: a text-only hero, stale counts, indigo-on-slate Fumadocs defaults, no motion, no OG image, a placeholder favicon.

The owner wants the site to feel **big and bold**, in the spirit of nekohealth.com: one enormous sentence-case headline over a living full-bleed visual, a tiny centered nav, pill buttons, uppercase eyebrow labels, rounded cards, warm cream, generous air, calm cinematic motion. The docs pages must read as part of the same product, with their information architecture left exactly as it is.

Success looks like: a visitor who lands on the homepage understands in one screen what Metapowers is and copies the install command; a visitor who lands on any skill page sees the command to run, the steps, and the artifact, in the same visual language as the homepage; nothing gets slower or less accessible; the GitHub Pages deploy keeps working unchanged.

## 2. Goals, non-goals, anti-goals

### Goals

1. A new homepage with seven sections (section 4 below) in the chosen identity (section 3), with motion that respects reduced-motion preferences.
2. A warm cream / Miranda Sans / coral identity applied to the docs via Fumadocs theme tokens, with a matching dark theme.
3. Custom docs chrome: a dark sidebar with a colour per domain, a per-skill header band carrying the domain colour and the command, and a search dialog tuned for "find me the skill that…".
4. Shared skill-page MDX components (Command, Steps, Output, Requires, NextPhase, DomainGrid) adopted across the existing pages by a scripted, idempotent codemod.
5. Counts (skills, plugins, eval suites, agents) generated from the repository at build time so they never go stale.
6. The quick wins from the 2026-10-19 audit: OG image, icon set, styled 404 inside the site chrome, fonts served through `next/font/local` so the base path is never hardcoded.

### Non-goals

- Changing the docs information architecture: `content/docs/**/meta.json`, page order, page URLs, domain grouping and the `root: true` per-domain structure stay as they are.
- Writing new documentation pages or covering the ~100 skills that have no page today.
- Rewriting the prose of skill pages. The codemod re-wraps existing content; it does not change the words inside it (section 7 lists the two places where copy is edited by hand).
- Touching `plugins/`, `packages/`, the marketplace, or the eval suites.
- Changing the deploy workflow, the static export, the `/metapowers` base path, or the Fumadocs/Next major versions.
- Adding analytics, a newsletter, or any third-party embed.

### Anti-goals (would make this a failure even if it "works")

- Motion that delays or obstructs reading: no scroll-jacking, no animation that must finish before text is legible, no re-triggering reveals on every scroll.
- A heavier dependency footprint than the effect justifies: no `three`, `@react-three/fiber`, or `motion`; at most the three libraries in section 8.
- Breaking any existing deep link into the docs, or the `/docs` → `/docs/overview/` redirect.
- Contrast below WCAG AA anywhere text sits on the new palette.
- A homepage that works only with WebGL or only with JavaScript: the first paint must be a complete, styled page.
- Duplicating the domain list: name, slug, colour, icon, methodology and count must have one source.

## 3. Identity (decided with the owner)

Chosen from three options shown in the visual companion: **warm cream, Miranda Sans only, one coral accent**.

| Token | Light | Dark (docs toggle and homepage variant) |
|---|---|---|
| ground | cream `#F8F4EC` | ink `#141210` |
| surface (cards) | white `#FFFFFF` | `#1F1C18` |
| ink (text) | `#1B1916` | cream `#F3EEE4` |
| muted text | `#6B655C` | `#A8A196` |
| accent (fills with white text) | coral, starting from `#D9553A` and darkened until white text on it reaches 4.5:1 | lightened until ink text on it reaches 4.5:1 |
| accent soft (tints, hover washes) | `#F4B7A0` | `#5A2E22` |
| hero gradient stops | coral `#F4B7A0`, amber `#F9D78F`, sage `#D6E8D2` on cream | the same three stops at lower brightness on ink |

Rules:

- Miranda Sans (existing TTFs, weights 400/500/600/700) is the only typeface, including headlines. Headlines use weight 500 with tight letter-spacing (about -0.03em) and line-height around 1.0. Body stays 400.
- The four Fumadocs colour tokens the site overrides today (`--color-fd-*`) are extended to the full set Fumadocs documents (including `--color-fd-secondary`, `--color-fd-popover`, which are missing today) and mapped to the table above. No raw hex values in components; everything references a token.
- Eyebrow labels: 11–12px, uppercase, letter-spacing 0.14em, muted.
- Corners: cards 16–20px, buttons full pill, terminal blocks 12px.
- Dark mode: the docs keep their theme toggle. The homepage has its own tuned dark variant (ink ground, cream text, dimmer gradient), chosen by the same toggle. Owner accepted this as my call.

## 4. Homepage (approved section by section in the visual companion)

Route: `app/(home)/page.tsx`, rebuilt. Sections, in order, with the behaviour each must have.

1. **Hero.** Full viewport. Living gradient backdrop (section 6) with one headline low-left: "Your whole production team, as repeatable workflows." Eyebrow above it reads "{skills} skills · {plugins} domains · one command" from generated data. Two pill buttons: primary "Add the marketplace" (anchors to the install strip) and secondary "Browse skills" (links to `/docs/overview`). Tiny centered nav: wordmark left, Docs / Plugins / Skills / GitHub center, "Install" pill right. On scroll the hero scales down and gains rounded corners and a margin so it reads as an inset card while the cream page continues beneath it. Headline words rise and fade in on load (SplitText, words), settled within 1.2 s.
2. **Install strip.** Directly under the hero. One dark terminal block showing `/plugin marketplace add bromso/metapowers` with a copy button and "copied" feedback. One muted line beneath: "Also: `npx create-metapowers` for Codex · OpenCode · Cursor" linking to the installation page. This replaces today's six-tab InstallTabs.
3. **How it works.** Eyebrow "How it works", title "Three steps, then it's muscle memory." Three columns with giant numerals 01/02/03: install the marketplace once and enable the domains you need; run a skill with a project name and it asks for what it can't infer; numbered artifacts land in `.metapowers/`, gates stop you skipping steps. Columns reveal with a stagger when scrolled into view, once.
4. **Domain tiles.** Eyebrow "{plugins} domains · {skills} skills", title "Pick the room you need." A 4×4 grid on desktop (2 columns on phones) of square-ish tiles, one per plugin, including `metapowers` styled as the dark "meta" tile. Each tile: domain colour swatch or icon, name, skill count, methodology; links to `/docs/<slug>`. Tiles use the spotlight hover (section 6).
5. **What a skill looks like.** Eyebrow "What a skill looks like", title "A brief in, a numbered artifact out." Two cards side by side: an abbreviated real SKILL.md (frontmatter plus the first process steps of one real skill, chosen by the builder from `plugins/design/skills/`) and the artifact tree it writes under `.metapowers/design/<project>/`. Static content, copied at build from the repo is not required; a hand-maintained excerpt is acceptable here.
6. **Numbers strip.** Four counts that animate up once when scrolled into view: skills, plugins, eval suites, agents supported (4: Claude Code, Codex, OpenCode, Cursor). Values from generated data. With reduced motion, the final numbers render immediately.
7. **Closing CTA and footer.** Ink background. Title "Give your agent a studio." Primary pill "Add the marketplace" (anchor to section 2), secondary outline pill "Star on GitHub". Slim footer: Docs · Plugins · Skills · GitHub · npm · MIT · "Built by Jonas Bröms".

Everything on the homepage that is a count or a domain list comes from `lib/site-data.ts` (section 5). The current "Adaptive skill management" section is dropped; its four skills are reachable from the `metapowers` tile.

The `metapowers` plugin has no `content/docs/metapowers` folder; its eight skills are documented under `/docs/overview` (status, init, report, detect, find-skill, create-skill, improve-skill, workflow). Its tile therefore links to `/docs/overview`, and `lib/domains.ts` records `docsPath: "/docs/overview"` for it while every other plugin uses `/docs/<slug>`. (My call, from the repo.)

Nav links, left to right: wordmark → `/`; "Docs" → `/docs/overview`; "Domains" → `#domains` (the tiles section); "GitHub" → the repository; "Install" pill → `#install`. (My call; the earlier mockups said "Plugins / Skills", which have no pages behind them.)

## 5. Generated site data

A script `apps/docs/scripts/gen-site-data.ts` reads `plugins/*/.claude-plugin/plugin.json`, counts `plugins/*/skills/*/SKILL.md`, counts `plugins/*/evals/` directories, and writes `apps/docs/lib/site-data.json` with:

- `plugins`: array of `{ slug, name, skills, hasEvals }` sorted by slug
- `totals`: `{ skills, plugins, evalSuites, agents: 4 }`
- `generatedAt` is **not** included (keeps the file stable and diff-free)

`lib/domains.ts` is the single hand-maintained source for presentational facts per plugin: `{ slug, name, methodology, colour, icon, blurb, docsPath }`, and it is joined with `site-data.json` at import time. A unit test fails if a plugin exists in `site-data.json` without an entry in `domains.ts`, or vice versa.

The script is idempotent and supports `--check` (exit 1 if the committed JSON differs), matching the convention in `packages/plugin-tools`. `apps/docs` gets `"gen:data"` and `"test"` scripts; `build` runs `gen:data` first. CI's docs build already runs `bun turbo build --filter=@metapowers/docs`, which therefore regenerates the data; the `--check` form runs in `validate-skills.yml` so a stale committed file fails a PR.

## 6. Motion and backdrop

Parts bin is React Bits (MIT + Commons Clause; copied-in source via `npx shadcn@latest add @react-bits/<Name>-TS-TW`, or copied by hand). Components live under `apps/docs/components/motion/` and are treated as our code after copying.

| Effect | Component | Dependency | Notes |
|---|---|---|---|
| Hero backdrop | Aurora (`lightMode`, `direction="bottom"`, three colour stops from section 3, `dpr` capped at 1.5, `mouseInteraction` on, paused when offscreen or tab hidden) | none | Renders only after hydration; underneath it the hero always has a static CSS gradient with the same stops, so first paint and no-WebGL both look finished. |
| Headline entrance | SplitText (words) | `gsap`, `@gsap/react` | Runs once on mount. |
| Hero shrink on scroll | GSAP ScrollTrigger scrub on `scale`, `border-radius`, `margin` | `gsap` | Transform-only; no layout thrash. |
| Section reveals, number count-up | small in-house hooks using GSAP (`gsap.from` with ScrollTrigger `once: true`; `gsap.to` on a number object) | `gsap` | React Bits CountUp needs `motion`; we do not add `motion`. |
| Tile hover | SpotlightCard (`theme="light"`, `proximity` 80) | none | Pointer-only; no effect on touch beyond the normal link tap. |

Global motion rules, enforced in one place (`lib/motion.ts` exporting `prefersReducedMotion()` and a `MotionProvider`):

- When `prefers-reduced-motion: reduce` is set: Aurora does not mount, SplitText renders plain text, ScrollTrigger animations are skipped and elements sit in their final state, count-ups render the final number.
- No animation blocks reading: text is visible (opacity ≥ 0.8) within 300 ms of the section entering the viewport.
- Reveals fire once per page load.
- Aurora is capped at 60 fps and pauses when the hero is fully scrolled out of view or the document is hidden.

## 7. Docs pages

### 7.1 Theme

The token table in section 3 replaces the current `:root` / `.dark` overrides in `app/global.css`. The neutral preset import stays. `--fd-layout-width` is set to 1400px. Fonts move from `@font-face` with hardcoded `/metapowers/fonts/...` URLs to `next/font/local` in `app/layout.tsx`, exposed as the `--font-fd-sans` variable. Converting the TTFs to WOFF2 is optional and left to the builder; keeping TTF is acceptable.

### 7.2 Sidebar

`DocsLayout` keeps the tree from `source.getPageTree()` untouched. Visual changes only:

- Ink background in both themes (the sidebar is always dark; the content column follows the theme).
- Each root (domain) folder gets a small rounded swatch in its domain colour from `lib/domains.ts` before its name, implemented through `sidebar.components` overrides (Folder/Item/Separator) from `fumadocs-ui/components/sidebar/base`. The `overview` root uses the `metapowers` colour.
- Separators ("Phases", "Utilities", …) become eyebrow labels.
- The existing GitHub and npm footer icons stay.
- The search trigger in the sidebar reads "Find a skill…" with the ⌘K hint.

### 7.3 Skill header band

`app/docs/[[...slug]]/page.tsx` renders, above `DocsTitle`, a header band on every docs page: a soft gradient from the domain's colour to transparent on the page ground, an eyebrow "{Domain} · {kind}", the title, the description, and, when frontmatter `command` is present, a Command block. The domain is the first slug segment; `overview` maps to the `metapowers` plugin and uses its colour (so `/docs/overview/status` is styled as a metapowers skill page). The band is the only place the command is rendered on the page (see 7.5).

`kind` is one of `phase`, `utility`, `overview`. The codemod writes it into frontmatter from the page's position in its folder's `meta.json`: pages listed after a `---Phases---` separator are `phase`, pages after `---Utilities---` (or `---Skill Management---`, `---Project---`, `---Meta Skills---` in the overview folder) are `utility`, everything else (index, artifacts, storage, examples, guides, and so on) is `overview`. Phase-group pages such as `security/identify.mdx` are `phase` by this rule. (My call.)

Frontmatter schema in `source.config.ts` is extended with optional `command: string` and `kind: "phase" | "utility" | "overview"`.

### 7.4 Search

A custom `SearchDialog` built from `fumadocs-ui/components/dialog/search` primitives with `useStaticSearch`, replacing the default via `RootProvider search.SearchDialog`. The static flexsearch index and `app/api/search/route.ts` stay. Changes: placeholder "Find the skill that…", results grouped under their domain with the domain swatch, each result shows the page's `command` when present, Enter opens the page. Empty state: "No skill matches. Try a verb: audit, plan, draft."

### 7.5 Skill-page components and codemod

Components under `apps/docs/components/docs/`, registered in `components/mdx.tsx`:

- `<Command>{"/design:a11y-audit <project>"}</Command>` — dark terminal block, prompt glyph, copy button. Accepts an optional `note` prop rendered beneath.
- `<Steps>` wrapping `<Step title="…">children</Step>` — cards with giant numerals; also accepts a plain MDX ordered list as children and numbers it.
- `<Output>` — callout with a coral left rule; content is the page's existing Output section.
- `<Requires mcp={[{ name: "figma_a11y_lint", description: "Lint a Figma component…" }]} config={["figma_access_token"]} skills={["/accessibility:scope"]} />` — badge row; each MCP badge renders its description beneath the name so no words from the source list are lost.
- `<NextPhase href="/docs/design/define" title="Define">After empathize, proceed to Define to create the component contract.</NextPhase>` — arrow card used at the end of phase pages; the children are the page's existing sentence.
- `<DomainGrid domain="design" />` — on a domain `index.mdx`, a grid of that domain's documented pages (phases and utilities) read from the page tree, each tile showing kind, title and command; with no `domain` prop (homepage) it renders the plugin tiles from `lib/site-data.ts`. It does not list undocumented skills, so a domain's grid may show fewer tiles than its skill count; the index page states the count from `site-data.json` in its eyebrow. (My call.)

The codemod `apps/docs/scripts/codemod-skill-pages.ts` runs over `content/docs/**/*.mdx` and is idempotent (`--check` mode reports files that would change). The invariant is: **no words are removed**; content is re-wrapped or moved, never dropped.

| Source pattern | Transform |
|---|---|
| `## Usage` followed by a fenced block | Move the first fence's text into frontmatter `command` and delete that fence from the body. Keep the `## Usage` heading and everything else in the section (explanatory paragraphs, the `**Example:**` block and its fence stay as plain markdown). If the section is empty after the move, delete the heading too. The command is rendered once, in the header band (7.3). |
| `## What It Does` followed by an ordered list | Replace heading and list with `<Steps>` containing one `<Step>` per item (first sentence becomes the title when the item has two or more sentences; otherwise the whole item is the body) |
| `## Output` section | Wrap the section body in `<Output>`; keep the heading |
| `## MCP Tools Used` list of `` `tool` — description`` items | Replace with `<Requires mcp={[{name, description}, …]} />` |
| `## Next Phase` paragraph containing one link | Replace with `<NextPhase href title>` whose children are the whole paragraph with the link text kept as plain text |
| Phase-group pages (`## Skills` with `### <Skill>` + fence + `**Output:**` line, as in `security/identify.mdx`) | Each fence becomes `<Command>`, each `**Output:** …` line becomes `<Output>` with the same text; headings stay; no frontmatter `command` is written (the page has several) |
| `kind` | Written into frontmatter for every page by the rule in 7.3 |

Anything the codemod cannot match is left untouched and listed in its report. Frontmatter key order is preserved. The committed result is reviewed as a diff; the words inside the wrapped sections do not change.

### 7.6 Hand-edited copy

Only two places are edited by hand: the fifteen domain `index.mdx` intros (one paragraph each, rewritten to the eyebrow/title voice of the homepage, under 60 words) and the overview `index.mdx`, which plays the same role for the `metapowers` plugin. Everything else in `content/docs` changes only through the codemod.

## 8. Dependencies and constraints

- New runtime dependencies in `apps/docs` only: `gsap`, `@gsap/react`. Nothing else. (The current React Bits Aurora is dependency-free raw WebGL2, so `ogl` is not needed; checked against the registry on 2026-10-21.) Exact versions are the latest stable at build time, pinned with caret ranges like the rest of the file.
- Next 16 static export (`output: "export"`, `trailingSlash: true`, `basePath` `/metapowers` in production) is unchanged. Every component that touches `window`, canvas, or GSAP is a client component mounted after hydration.
- Node/Bun: Bun 1.3.12 as pinned in CI. Biome formatting (tabs). TypeScript strict.
- Performance budget on the homepage, measured with Lighthouse mobile on the production build: performance ≥ 90, LCP ≤ 2.5 s, CLS ≤ 0.1, total JS for the homepage route ≤ 250 KB gzipped above today's baseline.
- Accessibility: all text passes WCAG AA contrast on its surface; focus rings visible on every interactive element; nav and copy buttons keyboard-operable; Aurora canvas is `aria-hidden`.
- OG image: `app/opengraph-image.tsx` (1200×630, cream ground, headline in Miranda Sans, coral mark) generated at build; `twitter:card` stays `summary_large_image`. Icons: `app/icon.svg` plus a 180×180 `apple-icon.png`, replacing the placeholder `public/favicon.svg` and the hardcoded `icons.icon` path.
- 404: `app/not-found.tsx` stays at the app root (Next only honours the global not-found there) and renders the home nav and footer components itself, styled in the new identity, with links to `/docs/overview` and `/`.
- Tests: Vitest in `apps/docs` for `gen-site-data` (`--check`, totals, join with `domains.ts`) and for the codemod (fixtures for a single-skill page, a phase-group page, a page with nothing to transform; idempotency: running twice equals running once). `next build` must pass. Biome must pass.
- Licensing: React Bits components are copied into the repo under the Commons Clause, which permits use in this site; they are not re-exported or redistributed as a library. A note in `components/motion/README.md` states their origin and license.

## 9. What is left to the builder

- Exact accent shades that satisfy the contrast rules in section 3, and the dark-theme shades.
- Which design skill is excerpted in homepage section 5.
- Component internals, class names, file split within `components/`.
- GSAP timings and easings within the limits in section 6.
- Whether to convert fonts to WOFF2.
- Sidebar component override details, as long as the tree and order are untouched.
- How the codemod parses MDX (a real MDX/remark AST is preferred over regex; either is acceptable if the tests in section 8 pass).

## 10. Open questions for the owner

None at hand-over. Everything above was either chosen by the owner in the brainstorming session (hero direction A, identity 3, the seven homepage sections, docs depth C with IA kept, content polish as re-wrapping) or is marked as my call.

# Site Storytelling Design (Project D)

Date: 2026-10-21
Status: builder-checked, awaiting owner approval
Scope: `apps/docs` (the Fumadocs + Next.js site shipped in Project C, PR #45)

## 1. Intent and why

Project C gave the site its calm, cinematic identity. The owner now wants a few of the React Bits pieces placed into it so the page comes alive, on one condition: **tastefully, or not at all**. The reference is still Neko Health, which has motion and micro-interactions, each one deliberate.

Two of the requested pieces carry story, not decoration. The Thought Line component is an agent "thinking…" trace with steps and a timer that folds into one line when done; it can show, on the homepage, what actually happens when a skill runs inside an LLM. The logotype row makes the "works with" promise visible. The rest are texture and feedback: a star that laps the primary button on hover, a chroma spotlight over a bento of domain tiles with icons that play once, a flip card that turns "brief in, artifact out" into a gesture, faint fibres behind the dark closing section, and a blur at the bottom of the docs sidebar.

Success looks like: a visitor notices the site feels more alive without being able to point at any one effect; nothing moves at rest except the hero aurora and the one-time Thought Line play; Lighthouse and the first-paint rule from Project C hold; the docs' own table of contents is untouched.

## 2. Goals, non-goals, anti-goals

### Goals

1. Place eight pieces (section 4) into the existing pages with the behaviour rules in section 3.
2. Tell the "how a skill runs" story on the homepage with a Thought Line trace that plays once.
3. Show the four supported agents as official marks under the install command.
4. Keep every budget from Project C: Lighthouse mobile performance ≥ 0.90, accessibility ≥ 0.95, CLS ≤ 0.1; first-load JS for `/` within the Project C baseline (726,366 B uncompressed after PR #45) + 250 kB; the first-paint rule (server markup complete and visible; hidden initial states only client-side in layout effects; nothing already on screen is hidden on hydration).

### Non-goals

- Touching the docs table of contents, sidebar tree, information architecture, content, or the codemod. The Fumadocs TOC stays exactly as it is (owner decision: Line Sidebar dropped).
- Supporting agents the installer cannot install into. The row shows Claude Code, Codex, OpenCode and Cursor only (owner decision: no Gemini until `create-metapowers` supports it).
- Changing the identity (palette, type, hero) from Project C.
- Any effect on docs pages other than the sidebar blur.

### Anti-goals (would make this a failure even if it works)

- Two living backdrops in view at once (for example a dot grid under the hero's aurora).
- Anything that moves at rest besides the aurora and the one-time Thought Line play: no idle shimmer on buttons, no perpetual tile animation, no cursor-chasing blobs.
- Hover effects that shift layout (tiles growing and pushing neighbours).
- A trace that lies: every step in the Thought Line must correspond to something the real skill does.
- Logos used in a way that implies endorsement; the row is a plain "Works with" statement.
- Loading icons or fonts from a third-party CDN at runtime; everything ships in the static export.

## 3. Behaviour rules (bind every piece)

- **Rest state is still.** A piece may animate on page load once (Thought Line), on scroll-into-view once, or in response to the pointer or keyboard. Ghost Fibers and the aurora are the only continuous motion, and both pause offscreen and when the tab is hidden.
- **Reduced motion** turns every piece into its final, static state: no fibres, no star lap, no spotlight tracking, no flip animation (the flip card still switches faces instantly on activation), the Thought Line renders already settled with all steps listed.
- **First paint complete.** Server HTML carries the final content of each piece (the settled trace, the front and back of the flip card, the tiles with their names and counts, the logo row). Client code adds motion on top.
- **Keyboard parity.** Everything the pointer can do, the keyboard can do: the star laps on focus-visible, the flip card flips on Enter/Space, tiles are links, the Thought Line's trace toggles with a button.
- **Tokens only.** Colours come from `global.css` tokens (`--mp-*`, `--domain-*`, `--mp-sidebar-swatch-*`); React Bits copies have their colour props fed from tokens, resolved once on the client where a canvas needs a literal value (as `Hero.tsx` already does for the aurora).
- **Pieces that cannot meet these rules are dropped**, not forced. The owner has already dropped Line Sidebar; Meta Balls and Dot Grid are dropped in this spec (section 4.9).

## 4. The pieces and where they live

### 4.1 Star Border on the primary pills (homepage)

`StarBorder` (React Bits, no dependencies) wraps the two primary pills, "Add the marketplace" in the hero and in the closing CTA. Resting look identical to today's pill (accent fill, white or ground text, no visible border). On hover or focus-visible one star laps the outline once (`hover="lap"`, `stars={1}`, `duration` about 1.6 s, `glow` about 0.4, `sparkle` off, `clickPulse` off). Light theme on cream, dark theme on ink. No other button gets it.

### 4.2 "Works with" logotype row (homepage, install strip)

Under the install command, a row of four marks with their names: Claude Code, Codex, OpenCode, Cursor. Marks are inline SVG bundled in the repo (no runtime fetch): `claude`, `opencode` and `cursor` from the `simple-icons` package (CC0 for the SVG data; the marks remain their owners' trademarks and are used nominatively), and a Miranda Sans wordmark for Codex because Simple Icons carries no OpenAI/Codex mark and OpenAI's brand terms restrict logo reuse. Marks are ink at 60% opacity at rest and 100% on hover; each links to the installation page section for that agent. The existing "Also: `npx create-metapowers` for Codex · OpenCode · Cursor" line is replaced by the row plus a muted one-liner: "Install with `npx create-metapowers`" linking to `/docs/overview/installation`.

### 4.3 Thought Line (homepage, "How it works")

`ThoughtLine` (React Bits micro; depends on `motion`; its two `@hugeicons` glyphs are replaced by inline SVG so that dependency is not added) replaces the three numbered columns. The section keeps its eyebrow and title "Three steps, then it's muscle memory." and shows one trace card, ink text on surface, in Miranda Sans with a monospace step list:

- Working label: `Running /design:empathize date-picker` (the skill researches one UI component, so the argument is a component name).
- Steps, appended one per beat (500 ms apart) when the section scrolls into view, once per page load. The copy below was checked against `plugins/design/skills/empathize/SKILL.md` and `plugins/design/hooks/` (builder-check finding); every line is something the skill really does, in the order it does it:
  1. `Loaded skill: design/empathize and shared/wcag-criteria.md`
  2. `Read the Figma file through the Figma MCP server`
  3. `Inferred user needs, context and existing patterns`
  4. `Checked the WCAG criteria the component must meet`
  5. `Gate passed (01-empathize needs no prior phase) · wrote .metapowers/design/date-picker/01-empathize.md`
  6. `Next: /design:define-component reads it`
- Settled label after the last step: `Thought for 3s · wrote 01-empathize.md`. The timer is driven by the beats (6 × 500 ms), not a real clock, so it settles at the same number every time; `showTimer` on, `collapseOnSettle` on, the trace stays expandable with a chevron button. The step count (6), the beat (500 ms) and the settle text are fixed by this spec and pinned by the test in section 5; if a later change to the empathize skill makes a line untrue, the line is rewritten and the test updated together.

Beneath the card, the three original sentences stay as three short captions ("Install once…", "Run a skill…", "Artifacts land…") so the no-JS and reduced-motion page still reads as three steps.

This is the only Thought Line on the site (owner decision).

### 4.4 Chroma bento for the 16 domain tiles (homepage)

The tiles section becomes a bento. Sizes and order are **hand-picked by story** (owner chose option B). `lib/domains.ts` gets a `bento: { order: number; size: "wide" | "half" | "small" | "meta" }` field per domain; the homepage sorts by `bento.order` instead of the alphabetical `getDomains()` order used elsewhere (builder-check finding: alphabetical order leaves holes). The order and sizes, chosen so every row tiles without gaps at 6 columns:

| order | domain | size | cells (6-col) |
|---|---|---|---|
| 1 | Design | wide (3 col × 2 row), with its one-line pitch | 6 |
| 2 | Development | wide (3 × 2), with its pitch | 6 |
| 3 | Research | half (2 × 1) | 2 |
| 4 | Marketing | half | 2 |
| 5 | Security | half | 2 |
| 6–15 | Accessibility, Accounting, Bookkeeping, Branding, Coaching, Compliance, Finance, Leadership, Legal, Project Management (alphabetical) | small (1 × 1) | 10 |
| 16 | Metapowers | meta (2 × 1), inverted: ink surface, cream text | 2 |

Rows: two rows of Design + Development, one row of the three halves, two rows of ten smalls plus Metapowers (30 cells, five full rows).

Breakpoints: 6 columns from `lg`; 2 columns below `lg` (wide → 2 × 2, half → 2 × 1, small → 1 × 1, meta → 2 × 1; 2 + 2 rows, then the three halves, then five rows of smalls, then Metapowers: no gaps, order preserved). There is no 4-column tier, because no size set tiles at 4 columns without reordering. Every tile remains a link to `domain.docsPath`.

Chroma treatment adapted from `ChromaGrid` (React Bits, no dependencies): the photo grid is not used; the builder ports its spotlight mask and per-card accent border glow onto our tiles. At rest tiles are ink on surface with their domain swatch at `--mp-sidebar-swatch-*` strength; a soft spotlight (radius about 260 px, damped) follows the pointer across the grid and raises each tile's accent colour (border glow and a faint fill wash from `--domain-*`) under it; tiles outside the spotlight stay as they are (no grayscale, since there is nothing to drain). Touch devices show tiles in their rest state with the usual link tap. Replaces the SpotlightCard currently wrapping each tile (one spotlight for the grid instead of sixteen).

Icon: each tile's lucide icon is replaced by an animated icon from Iconify's `line-md` set, bundled offline from `@iconify-json/line-md` and rendered to inline SVG at build time with `@iconify/utils` (no `@iconify/react`, no runtime fetch). At rest the icon shows its final frame. On the tile's first hover or focus the icon plays its draw animation once (re-mounting the SVG so its animations run), then stays. The mapping from domain to `line-md` icon lives in `lib/domains.ts` next to the lucide icon, which remains for the docs chrome.

### 4.5 Flip Card for the skill showcase (homepage)

`FlipCard` (React Bits, depends on `motion`) replaces the two side-by-side cards. One card, surface background, 20 px radius, about 560 × 360 px on desktop (full width on phones): front is the SKILL.md excerpt that exists today; back is the artifact tree. A small label on the front reads "Flip to see what it writes" and on the back "Flip back to the skill". Flip on click, drag, Enter and Space; `tilt` on, `glare` off, `hoverScale` 1.01. Without JavaScript the two faces render stacked (front then back) so nothing is lost; under reduced motion the switch is instant.

### 4.6 Ghost Fibers behind the closing CTA (homepage)

`GhostFibers` (React Bits, no dependencies, WebGL) sits behind the ink closing section at `opacity` about 0.25, `speed` 0.1, `layers` 2, `glowColor` from `--mp-accent-soft` (dark value), `lightMode` off, `vignette` 0.9, `mouseInteraction` off. Loaded with `next/dynamic`, mounted on idle after the section is near the viewport, paused when offscreen or the tab is hidden, not mounted under reduced motion. The section's ink background is always painted beneath it, so first paint and no-WebGL look finished. The same rules as the aurora (`components/motion/README.md`) apply, including a 60 fps cap.

### 4.7 Gradual Blur at the bottom of the docs sidebar

`GradualBlur` (React Bits, no dependencies, CSS backdrop-filter layers) is placed at the bottom edge of the sidebar's scroll viewport (`#nd-sidebar` and the mobile drawer), about 56 px tall, blurring the tree as it runs under the footer icons instead of a hard cut. It must not cover the last item when the tree is scrolled to the end (fade to zero at the very bottom, or hide when the viewport cannot scroll). This is the only Gradual Blur on the site.

### 4.8 Chroma spotlight and the docs pages

None of the homepage pieces appear on docs pages. The per-domain `DomainGrid` keeps the current compact tiles.

### 4.9 Dropped

- **Meta Balls**: cursor-chasing blobs read playful, not calm; nowhere on the site earns it.
- **Dot Grid**: the hero already has a living backdrop, and under "How it works" it would compete with the trace.
- **Line Sidebar**: the docs keep Fumadocs' own table of contents (owner decision).

## 5. Dependencies and constraints

- New runtime dependencies in `apps/docs`: `motion` (for Thought Line and Flip Card), `@iconify-json/line-md` and `@iconify/utils` (build-time only, dev dependencies), `simple-icons` (build-time only, dev dependency; the three SVG paths are inlined). No `@hugeicons/*`, no `@iconify/react`, no `three`.
- React Bits copies go under `components/motion/` with the same source comment, license note and README entry as the Project C copies; local modifications are listed in `components/motion/README.md`.
- JS budget: first-load JS for `/` ≤ 726,366 + 250,000 bytes uncompressed (the Project C metric). `motion` is the main cost; the builder loads the Flip Card and Thought Line chunks through `next/dynamic` below the fold.
- Static export, basePath `/metapowers`, `trailingSlash` unchanged. Everything client-side mounts after hydration.
- Performance and accessibility budgets as in section 2, re-measured with the Project C Lighthouse setup and recorded in a new acceptance file.
- `lib/domains.ts` gains `bento` and `animatedIcon` fields; the Project A `check-counts` rule (one entry per plugin) must still pass.
- Tests: Vitest for the bento data (every domain has a `bento` entry; orders 1–16 unique; exactly two wide, three half, ten small, one meta; cells sum to 30 at six columns), for the logo row data (four entries, each with a bundled SVG or wordmark), and for the Thought Line step list (six steps, 500 ms beat, settle text "Thought for 3s · wrote 01-empathize.md"). `next build` must pass; Biome must pass.

## 6. What is left to the builder

- Exact `StarBorder`, `GhostFibers`, spotlight and flip timings within the limits above.
- The `line-md` icon chosen per domain.
- How the Flip Card renders both faces without JavaScript (CSS stacking is the suggestion).
- Whether the Codex wordmark gets a small neutral glyph or stays text.
- The "Install with `npx create-metapowers`" line's exact placement under the logo row.

## 7. Open questions for the owner

None at hand-over. Decisions taken by the owner in the brainstorm: tasteful-or-drop rule; Thought Line on the landing page only; Fumadocs TOC untouched; logos limited to supported agents; chroma bento sized by story (option B). Everything else is marked as my call.

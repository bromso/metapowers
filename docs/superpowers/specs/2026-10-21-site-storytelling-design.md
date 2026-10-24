# Site Storytelling Design (Project D)

Date: 2026-10-21
Status: builder-checked, awaiting owner approval
Scope: `apps/docs` (the Fumadocs + Next.js site shipped in Project C, PR #45)

## 1. Intent and why

Project C gave the site its calm, cinematic identity. The owner now wants a few of the React Bits pieces placed into it so the page comes alive, on one condition: **tastefully, or not at all**. The reference is still Neko Health, which has motion and micro-interactions, each one deliberate.

Two of the requested pieces carry story, not decoration. The Thought Line component is an agent "thinking…" trace with steps and a timer that folds into one line when done; it can show, on the homepage, what actually happens when a skill runs inside an LLM. The logotype row makes the "works with" promise visible (since the PR #47 review it is the install section's tab list). The rest are texture and feedback: a star that laps the primary button on hover, a chroma spotlight over a bento of domain tiles with icons that play once, a flip card that turns "brief in, artifact out" into a gesture, faint contour lines behind the dark closing section (Ghost Fibers until the owner's PR #46 review), a faint dot grid in the hero (added in that review), and a blur at the bottom of the docs sidebar.

Success looks like: a visitor notices the site feels more alive without being able to point at any one effect; nothing moves at rest except the hero aurora and the one-time Thought Line play (revised in the owner's PR #46 review, see §3: the Thought Line now loops, the hero dot grid answers the pointer and the closing topography drifts continuously); Lighthouse and the first-paint rule from Project C hold; the docs' own table of contents is untouched.

## 2. Goals, non-goals, anti-goals

### Goals

1. Place eight pieces (section 4) into the existing pages with the behaviour rules in section 3.
2. Tell the "how a skill runs" story on the homepage with a Thought Line trace that plays once.
3. Show the four supported agents as official marks under the install command.
4. Keep every budget from Project C: Lighthouse mobile performance ≥ 0.90, accessibility ≥ 0.95, CLS ≤ 0.1; first-load JS for `/` within the Project C baseline (726,366 B uncompressed after PR #45) + 250 kB; the first-paint rule (server markup complete and visible; hidden initial states only client-side in layout effects; nothing already on screen is hidden on hydration).

### Non-goals

- Touching the docs table of contents, sidebar tree, information architecture, content, or the codemod. The Fumadocs TOC stays exactly as it is (owner decision: Line Sidebar dropped from the docs; it later joined the landing page only, section 4.8a).
- Supporting agents the installer cannot install into. The row shows Claude Code, Codex, OpenCode and Cursor only (owner decision: no Gemini until `create-metapowers` supports it).
- Changing the identity (palette, type, hero) from Project C.
- Any effect on docs pages other than the sidebar blur.

### Anti-goals (would make this a failure even if it works)

- Two living backdrops in view at once (for example a dot grid under the hero's aurora). *Owner reversal (PR #46 review): the hero now carries a faint, pointer-reactive dot grid (section 4.1a; under the aurora until the PR #47 review moved it above). It is still at rest when the pointer is still, so the aurora stays the hero's only continuous motion.*
- Anything that moves at rest besides the aurora, the closing-section topography and the looping Thought Line (section 3): no idle shimmer on buttons, no perpetual tile animation, no cursor-chasing blobs.
- Hover effects that shift layout (tiles growing and pushing neighbours).
- A trace that lies: every step in the Thought Line must correspond to something the real skill does.
- Logos used in a way that implies endorsement; the row is a plain statement of the agents the install works with.
- Loading icons or fonts from a third-party CDN at runtime; everything ships in the static export.

## 3. Behaviour rules (bind every piece)

- **Rest state is still.** A piece may animate on page load once, on scroll-into-view once, or in response to the pointer or keyboard. The aurora and the closing-section Topography are the only continuous backdrops, and both pause offscreen and when the tab is hidden.
  - *Owner note (PR #46 review):* the owner allowed continuous motion for three pieces beyond the aurora: the Thought Line trace now loops (section 4.3), the hero dot grid reacts to the pointer (section 4.1a), and the Topography replaces Ghost Fibers behind the closing CTA (section 4.6). Each pauses offscreen and when the tab is hidden, keeps the 60 fps cap where it draws on a canvas, and has nothing moving under reduced motion. The dot grid is still at rest whenever the pointer is still.
- **Reduced motion** turns every piece into its final, static state: no topography, no dot grid, no star lap, no spotlight tracking, no flip animation (the flip card still switches faces instantly on activation), the Thought Line renders already settled with all steps listed and never loops.
- **First paint complete.** Server HTML carries the final content of each piece (the settled trace, the front and back of the flip card, the tiles with their names and counts, the logo row). Client code adds motion on top.
- **Keyboard parity.** Everything the pointer can do, the keyboard can do: the star laps on focus-visible, the flip card flips on Enter/Space, tiles are links, the Thought Line's trace toggles with a button.
- **Tokens only.** Colours come from `global.css` tokens (`--mp-*`, `--domain-*`, `--mp-sidebar-swatch-*`); React Bits copies have their colour props fed from tokens, resolved once on the client where a canvas needs a literal value (as `Hero.tsx` already does for the aurora).
- **Pieces that cannot meet these rules are dropped**, not forced. The owner has already dropped Line Sidebar; Meta Balls and Ghost Fibers are dropped (section 4.9; Dot Grid was dropped here first, then brought back to the hero by the owner, section 4.1a).

## 4. The pieces and where they live

### 4.1 Star Border on the primary pills (homepage)

`StarBorder` (React Bits, no dependencies) wraps the two primary pills, "Add the marketplace" in the hero and in the closing CTA. Resting look identical to today's pill (accent fill, white or ground text, no visible border). On hover or focus-visible one star laps the outline once (`hover="lap"`, `stars={1}`, `duration` about 1.6 s, `glow` about 0.4, `sparkle` off, `clickPulse` off). Light theme on cream, dark theme on ink. No other button gets it.

### 4.1a Dot Grid in the hero (owner reversal, PR #46 review)

The owner reversed the "no dot grid" decision (section 4.9, anti-goals). `DotGrid` (React Bits, no dependencies; WebGL2 upstream, so the aurora's WebGL rules apply) sits in the hero panel as a layer above the static gradient and the aurora and under the content, `pointer-events-none`, `aria-hidden`. Values: `dotSize` 2.5, `gap` 24, `baseColor` the resolved `--mp-ink` with the layer at 30% opacity, `activeColor` the resolved `--mp-accent`, `proximity` 140, `strength` 0.5, `bounce` 0.3, `swell` 0.4, `stretch` 0.2, `glow` 0, `fade` 0.6, `intro` off, `clickShock` off, `mouseInteraction` on. Loaded with `next/dynamic` (`ssr: false`) and mounted on idle, gated by `!reduced` exactly like the aurora, so under reduced motion the chunk is never requested. The grid only moves while the pointer moves over the hero; it pauses offscreen and when the tab is hidden, at most 60 fps.

*Owner change (PR #47 review, "very hard to see the dots"):* the first values (`dotSize` 2, `gap` 22, layer 12%, `proximity` 120, `activeColor` `--mp-accent-soft`, layer under the aurora) were too faint. The dark theme's soft accent (`#5a2e22`) vanished on the dark ground, so the pointer now lights the dots in the full accent (`#c2432a` light, `#e06a4f` dark). The layer moved above the aurora because the aurora's bright lower half covered the dots there; the dots now read across the whole panel at rest and stay quieter than the headline.

### 4.2 Install tabs: the "works with" row (homepage, install section)

*Owner change (PR #47 review): the install section gets a visible title, and the works-with row becomes the install tab list.*

The install section (`#install`, which the nav links to) has a visible header like the other sections: eyebrow "Install", title "One line, any agent." Under it, left-aligned and at most `48rem` wide, a tab list of the four supported agents: Claude Code, Codex, OpenCode, Cursor. Each tab is the agent's mark plus its name. Marks are inline SVG bundled in the repo (no runtime fetch): `claude`, `opencode` and `cursor` from the `simple-icons` package (CC0 for the SVG data; the marks remain their owners' trademarks and are used nominatively), and a Miranda Sans wordmark for Codex because Simple Icons carries no OpenAI/Codex mark and OpenAI's brand terms restrict logo reuse. The tab list is a segmented-control track (ink at 6%, 4 px padding, round in one row); inactive tabs are ink at 70% opacity (above 4.5:1 in both themes), full ink with a faint tint on hover, a 3% press shrink, and the active one at 100% on a surface pill with a soft shadow (a lighter ink tint in the dark theme, where the surface token is darker than the track). The Codex wordmark is one step above the label size (18 px, semibold, tight) rather than the logo row's 1.7 rem. Each panel shows that agent's install command in the terminal block, with a muted note, then a link "Full guide for {agent} →" to the installation page section for that agent. Commands and notes live in `lib/agents.ts` (from `content/docs/overview/installation.mdx`). The separate "Works with" eyebrow and the "Install with `npx create-metapowers`" line are gone; the title carries the promise and the tabs show the commands.

The tabs copy animate-ui's base-ui Tabs behaviour, not its dependency (no `@base-ui-components/react`): a pill that slides behind the active tab (spring, stiffness 260, damping 28, settling in about 0.27 s so it leads), the terminal block kept as one static shell with only its lines changing, directionally as in animate-ui's tabs: the old lines slide 40 px out toward the side the user came from through a `blur(16px)` (0.2 s ease-in, on a throwaway clone of the old panel since React has already hidden the real one), and the prompt line, the note and the guide link under the block slide 40 px in from the side the user moved toward, sharpening from `blur(16px)` over 0.4 s ease-out-quint, 40 ms apart, starting 60 ms after the pill. The side follows the key or the click (ArrowRight, End and a click further right come from the right; ArrowLeft, Home and a click further left from the left, including when the arrows wrap). Owner polish, PR #47: the first cut's 0.25 s blur-only fade read as a snap, a per-tab block made the block itself blink, and a vertical rise did not say where the user went. The shell animates its height to the new lines'. The four `tabpanel`s (prompt line + note) live inside the shell; the guide link sits under it as one element whose text and target follow the active tab. The "Full guide" arrow nudges 2 px right on hover. animate-ui builds the slide and the height with motion's `layoutId` and `layout`; those pull in motion's layout-projection code (+105 KB first-load JS for `/`, measured), so the same three behaviours run on motion's imperative `animate()`, which the homepage already ships. The pattern is hand-built WAI-ARIA tabs: `tablist` labelled "Install for", roving `tabIndex`, Left/Right/Home/End move focus and select (automatic activation), the panel is a focusable `tabpanel` labelled by its tab, and the focus ring is the site's accent outline. First paint: the server HTML shows the tab list and the Claude Code panel with the pill drawn on its tab; the moving pill takes over in a layout effect. Reduced motion: the pill jumps, the panel swaps with no fade or blur, the height snaps. On phones the tab list wraps to two rows and the pill follows; the command keeps its horizontal scroll. The default tab is Claude Code and the choice is not remembered.

### 4.3 Thought Line (homepage, "How it works")

`ThoughtLine` (React Bits micro; depends on `motion`; its two `@hugeicons` glyphs are replaced by inline SVG so that dependency is not added) replaces the three numbered columns. The section keeps its eyebrow and title "Three steps, then it's muscle memory." and shows one trace card, ink text on surface, in Miranda Sans with a monospace step list:

- Working label: `Running /design:empathize date-picker` (the skill researches one UI component, so the argument is a component name).
- Glyph (owner request, PR #47): a React Bits Lattice Loader in place of the sparkle, as the bare lattice (`labelled={false}`): a 3×3 orbit of 4 px accent cells that runs while the trace plays and settles into the loader's tick mark when the trace settles. The Thought Line keeps the label and the live region. Server HTML and reduced motion show the tick, so nothing in it moves unless a play is running.
- Steps, appended one per beat (500 ms apart) when the section scrolls into view. *Owner change (PR #46 review): the trace loops.* After it settles it holds the settled state for about 2.5 s, resets to zero steps and plays again, forever, while the section is at least 40% in view and the tab is visible; scrolled away or hidden it freezes where it is and resumes from there. The copy below was checked against `plugins/design/skills/empathize/SKILL.md` and `plugins/design/hooks/` (builder-check finding); every line is something the skill really does, in the order it does it:
  1. `Loaded skill: design/empathize`
  2. `Read the Figma file through the Figma MCP server`
  3. `Inferred user needs, context and existing patterns`
  4. `Read shared/wcag-criteria.md and checked the criteria the component must meet`
  5. `Gate passed (01-empathize needs no prior phase) · wrote .metapowers/design/date-picker/01-empathize.md`
  6. `Next: /design:define-component reads it`
- Settled label after the last step: `Thought for 3s · wrote 01-empathize.md`. The timer is driven by the beats (6 × 500 ms), not a real clock, so it settles at the same number every time; `showTimer` off (the settled label carries the time). The trace never collapses (`collapseOnSettle={false}`); the chevron button still folds and unfolds it by hand. The card keeps the six-step height for the whole loop, so no part of the cycle shifts the layout. Server HTML is the settled, expanded trace; reduced-motion and no-JS visitors keep it, with no loop and no reset. The step count (6), the beat (500 ms) and the settle text are fixed by this spec and pinned by the test in section 5; if a later change to the empathize skill makes a line untrue, the line is rewritten and the test updated together.

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

### 4.6 Topography and a bottom blur behind the closing CTA (homepage)

*Owner change (PR #46 review): Topography and a bottom Gradual Blur replace Ghost Fibers, which is dropped (section 4.9).*

`Topography` (React Bits, no dependencies, WebGL2) sits behind the ink closing section as faint, slow contour lines. Values: React Bits' "dunes" preset (`color` `#ffc46b`, `lineCount` 34, `majorLines` off, `elevation` 0.5, `scale` 1.8, `detail` 0.15, `speed` 0.45, `direction` `"right"`) on the demo's base look for the rest (`lineWidth` 1.2, `foreground` 0.2, `tilt` 32, `morph` 0.2, `depthOfField` 0.4, `fog` 0.35), then made subtle: `opacity` 0.3 (0.22 before the PR #47 review), `glow` 0.15, `mouseInteraction`, `clickEffect`, `markers` and `glitch` off, `intro` on. The colour is the `--mp-topo` token (`#ffc46b` on the light theme's ink section, a dimmer `#c8994f` of the same hue on the dark theme's surface section), resolved on the client because the component parses a hex string. Loaded with `next/dynamic`, mounted on idle after the section is near the viewport, paused when offscreen or the tab is hidden, not mounted under reduced motion. The section's ink background is always painted beneath it, so first paint and no-WebGL look finished. The same rules as the aurora (`components/motion/README.md`) apply, including a 60 fps cap.

A `GradualBlur` band (`clamp(180px, 42%, 300px)` of the section's height, `strength` 2.5, `layers` 6, `curve` bezier, no `autoHide`, tinted with the section's own background token) sits on the section's bottom edge over the topography and under the content (`z-index` 1; the content is `z-10`). It blurs only the backdrop, never the pills or the text, so it may reach above the bottom padding; the site footer is outside the section. *Owner change (PR #47 review, "cannot see the gradual blur"):* the first band (96 px, `strength` 1.5, `layers` 4) sat over almost flat ink and showed nothing, so the band grew and the topography went from 0.22 to 0.3 opacity; the contour lines now visibly soften and fade toward the bottom edge.

### 4.7 Gradual Blur at the bottom of the docs sidebar

`GradualBlur` (React Bits, no dependencies, CSS backdrop-filter layers) is placed at the bottom edge of the sidebar's scroll viewport (`#nd-sidebar` and the mobile drawer), about 56 px tall, blurring the tree as it runs under the footer icons instead of a hard cut. It must not cover the last item when the tree is scrolled to the end (fade to zero at the very bottom, or hide when the viewport cannot scroll). This was the only Gradual Blur on the site until the owner added one at the bottom of the closing CTA (section 4.6).

### 4.8 Chroma spotlight and the docs pages

None of the homepage pieces appear on docs pages. The per-domain `DomainGrid` keeps the current compact tiles.

### 4.8a Line Sidebar as the landing page's section rail (owner request, PR #47)

`LineSidebar` (React Bits component, no dependencies) is fixed to the right edge of the landing page, vertically centred, from `lg` up (phones and tablets never show it). It lists the six sections below the hero, in page order: Install, How it works, Domains, Showcase, Numbers, Start, each a real `#id` link to its `<section>` (ids `install`, `how-it-works`, `domains`, `showcase`, `numbers`, `start`, all with `scroll-mt-20` for the fixed nav). At rest it is six short lines in muted ink; hovering or focusing the rail reveals the index and label to the left of each line, lines near the pointer lengthen and warm toward the accent and the labels shift 8 px toward the pointer (React Bits' proximity easing, with the copy's `side="right"` mirror); the section crossing the band between 35% and 60% of the viewport is drawn in the accent and carries `aria-current="location"`. The rail is hidden (opacity 0, inert, `aria-hidden`) while the hero is at least 20% in view and fades in over 0.3 s once it has scrolled away. A click smooth-scrolls to the section (instant under reduced motion); without JavaScript the links jump. Reduced motion: no hover easing (values jump), no label shift, no fades. The docs pages are untouched; Fumadocs' table of contents stays as it is.

### 4.9 Dropped

- **Meta Balls**: cursor-chasing blobs read playful, not calm; nowhere on the site earns it.
- ~~**Dot Grid**: the hero already has a living backdrop, and under "How it works" it would compete with the trace.~~ *No longer dropped: the owner brought it back as a faint hero layer (section 4.1a).*
- **Ghost Fibers** (owner, PR #46 review): replaced by Topography behind the closing CTA (section 4.6). `GhostFibers.tsx` is deleted.
- **Line Sidebar** on the docs pages: the docs keep Fumadocs' own table of contents (owner decision). *Owner change (PR #47): it is now on the landing page only, as the section rail in section 4.8a.*

## 5. Dependencies and constraints

- New runtime dependencies in `apps/docs`: `motion` (for Thought Line and Flip Card), `@iconify-json/line-md` and `@iconify/utils` (build-time only, dev dependencies), `simple-icons` (build-time only, dev dependency; the three SVG paths are inlined). No `@hugeicons/*`, no `@iconify/react`, no `three`.
- React Bits copies go under `components/motion/` with the same source comment, license note and README entry as the Project C copies; local modifications are listed in `components/motion/README.md`.
- JS budget: first-load JS for `/` ≤ 726,366 + 250,000 bytes uncompressed (the Project C metric). `motion` is the main cost; the builder loads the Flip Card and Thought Line chunks through `next/dynamic` below the fold.
- Static export, basePath `/metapowers`, `trailingSlash` unchanged. Everything client-side mounts after hydration.
- Performance and accessibility budgets as in section 2, re-measured with the Project C Lighthouse setup and recorded in a new acceptance file.
- `lib/domains.ts` gains `bento` and `animatedIcon` fields; the Project A `check-counts` rule (one entry per plugin) must still pass.
- Tests: Vitest for the bento data (every domain has a `bento` entry; orders 1–16 unique; exactly two wide, three half, ten small, one meta; cells sum to 30 at six columns), for the logo row data (four entries, each with a bundled SVG or wordmark), and for the Thought Line step list (six steps, 500 ms beat, settle text "Thought for 3s · wrote 01-empathize.md"). `next build` must pass; Biome must pass.

## 6. What is left to the builder

- Exact `StarBorder`, `Topography`, spotlight and flip timings within the limits above.
- The `line-md` icon chosen per domain.
- How the Flip Card renders both faces without JavaScript (CSS stacking is the suggestion).
- Whether the Codex wordmark gets a small neutral glyph or stays text.
- The "Install with `npx create-metapowers`" line's exact placement under the logo row.

## 7. Open questions for the owner

None at hand-over. Decisions taken by the owner in the brainstorm: tasteful-or-drop rule; Thought Line on the landing page only; Fumadocs TOC untouched; logos limited to supported agents; chroma bento sized by story (option B). Everything else is marked as my call.

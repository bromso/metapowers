# Motion primitives

Every animation on the docs site lives in this folder and goes through one
reduced-motion gate: `lib/motion.ts` (`prefersReducedMotion()` /
`usePrefersReducedMotion()`). Every read of `prefers-reduced-motion` in this
folder goes through it, including the reads inside the React Bits copies.
GSAP and its plugins are imported only from `lib/gsap.ts`, which registers
`ScrollTrigger` and `useGSAP` (browser only). `SplitText.tsx` additionally
registers GSAP's `SplitText` plugin. Do not add an animation anywhere else.

## First-paint rule

Server markup is always complete and visible, and it works without JS. A hidden
or animated starting state is applied only on the client, inside a layout effect
(`useGSAP` / `useLayoutEffect`). It is never applied to an element that is
already in the viewport at mount. There are two exceptions, both armed in the
same layout pass as hydration, so the reset state is what first paints: the
SplitText intro (see below) and the homepage Thought Line trace (see
`ThoughtLine.tsx` below).

`usePrefersReducedMotion()` returns `false` during hydration (the server
snapshot). Effects therefore also call `prefersReducedMotion()` live before they
start anything.

| File | Origin | Reduced motion |
| --- | --- | --- |
| `Aurora.tsx` | React Bits | Wrapper renders `null`; the effect bails before creating a WebGL context. The hero supplies a static CSS gradient beneath it |
| `SplitText.tsx` | React Bits | Renders the plain `text` inside `tag` |
| `SpotlightCard.tsx` | React Bits | Upstream reduced-motion handling (spotlight follows instantly, no ambient drift or flare), now fed by `prefersReducedMotion()` |
| `StarBorder.tsx` | React Bits | Renders `as` with its children and border styling, but no star canvas and no animation loop |
| `ThoughtLine.tsx` | React Bits | No breath and no shimmer; the working/done swap, timer slide and trace expand happen instantly (`--tl-settle: 0ms`); the step pulse dot is static |
| `FlipCard.tsx` | React Bits | The faces swap instantly (no spring, no cross-fade); no tilt, hover lift or glare; dragging is off |
| `GhostFibers.tsx` | React Bits | Renders nothing, so no WebGL context is created; it unmounts, releasing the context, if the preference turns on mid-session. Callers supply a static background beneath it |
| `GradualBlur.tsx` | React Bits | Nothing needed: the blur is static CSS |
| `ChromaSpotlight.tsx` | React Bits (ported) | Writes no variables (also on coarse pointers); tiles keep their static look |
| `Reveal.tsx` | Local | Renders children statically |
| `CountUp.tsx` | Local | Renders `to` |

## Origin and license

`Aurora.tsx`, `SplitText.tsx`, `SpotlightCard.tsx`, `StarBorder.tsx`,
`ThoughtLine.tsx`, `FlipCard.tsx`, `GhostFibers.tsx` and `GradualBlur.tsx` were
copied on 2026-10-21 from the React Bits registry
(`https://reactbits.dev/r/<Name>-TS-TW.json`, `files[0].content`). React Bits is
licensed MIT + Commons Clause. The components are used in this site and are not
redistributed or sold as components. Each file starts with a `// Source:` comment
naming its registry URL. Upstream prop names are kept unchanged.

`ChromaSpotlight.tsx` is **ported, not copied**. It was written from
`ChromaGrid-TS-TW.json` (same date and license, same `// Source:` comment). Only
the spotlight math survives: the pointer tracking, the damped follow, the power
fade and the mask falloff stops. The photo grid, its themes, images and card
markup are not included.

No copy adds a dependency. `ThoughtLine` and `FlipCard` use `motion`, which the
site already has. `ThoughtLine`'s `@hugeicons` icons were replaced by inline SVG.

## Local modifications

All three copies were reformatted with Biome (tabs, width 100) and received
Biome's safe lint fixes: sorted imports, `import type`, `Number.parseFloat`, and
`**` in place of `Math.pow`. These fixes do not change behaviour. All other
upstream code, including its remaining `forEach` calls, is untouched unless
listed below.

**Aurora.tsx**
- The upstream component is renamed `AuroraCanvas`. The default export `Aurora`
  is a wrapper that returns `null` once `usePrefersReducedMotion()` is true.
  During hydration the wrapper may still render the empty container and
  canvas. `AuroraCanvas`'s effect calls `prefersReducedMotion()` first and
  returns before `getContext("webgl2")`, so for reduced-motion users no WebGL
  context is created and no frame is drawn.
- The internal `reduce` flag reads `prefersReducedMotion()` instead of calling
  `matchMedia` directly.
- `aria-hidden="true"` moved from the canvas to the container, which hides the
  whole decorative subtree.
- The device-pixel-ratio cap is lowered from 2 to 1.5 (`MAX_DPR`). It applies to
  both the `dpr` prop and `window.devicePixelRatio`.
- The canvas is created inside the effect (`document.createElement`) and removed in
  its cleanup, instead of being rendered in JSX. Upstream's cleanup calls
  `loseContext()`, and a canvas keeps its context for life. So when the effect ran
  twice on the same JSX canvas (React Strict Mode in dev, Fast Refresh), the second
  run got the lost context back. Chrome painted that lost canvas as an opaque white
  box over the whole hero, hiding the static gradient in both themes. Each run now
  owns a fresh canvas.
- Each frame clears to transparent (`gl.clearColor(0, 0, 0, 0)`), and the fragment
  shader clamps the premultiplied colour to at most alpha in both the light and dark
  paths. Upstream added the dither to the colour even where alpha clamped to 0, which
  adds stray light. Pixels outside the aurora are now fully transparent, so the
  aurora composites over the hero's static CSS gradient.
- Render-loop pausing is kept unchanged from upstream. The frame loop stops
  while `document.hidden` is true or the container is not intersecting the
  viewport (IntersectionObserver). It resumes on `visibilitychange` or when the
  container intersects again.
- Drawing is capped at 60 fps. At the top of `frame()`, if less than
  `1000 / 60 - 1` ms has passed since the last draw, the loop re-queues the rAF
  and returns without drawing. On 120 Hz displays this halves the GPU work; the
  1 ms slack keeps 60 Hz displays from dropping frames on rAF timing jitter.

**SplitText.tsx**
- Imports `gsap`, `ScrollTrigger` and `useGSAP` from `@/lib/gsap`. Only GSAP's
  `SplitText` plugin is registered locally, and only in the browser.
- The upstream `ready` state and its `visibility: hidden` style are removed, so
  the server markup always shows the text. The pieces are hidden only by the
  intro tween (`immediateRender`), which is created inside `useGSAP`'s layout
  effect immediately before it starts.
- If fonts were not ready in the mount layout pass, the intro is deferred. When
  that happens and the text is already on screen once fonts load, the intro is
  skipped and the text stays visible, rather than being hidden after it was
  painted.
- The internal reduced-motion check calls `prefersReducedMotion()` instead of
  `matchMedia`.
- The upstream component is renamed `AnimatedSplitText`. When reduced motion is
  on, the default export `SplitText` renders the plain `text` inside `tag`,
  keeping `className`, `textAlign` and `color`.
- Lint rewrites:
  - The two `forEach` calls in the `useGSAP` cleanup became `for…of` loops.
  - The spring-allocation assignment-in-expression in `tick` became an
    explicit `if`.

**SpotlightCard.tsx**
- The internal `reduce` flag reads `prefersReducedMotion()` instead of calling
  `matchMedia` directly. Otherwise there are no changes beyond the source
  comment and Biome fixes.

The five 2026-10-21 Project D copies (`StarBorder`, `ThoughtLine`, `FlipCard`,
`GhostFibers`, `GradualBlur`) received the same Biome formatting and safe fixes,
plus these lint rewrites, none of which change behaviour: every `forEach` became
a `for…of` loop (a `return` inside one became `continue`), `Math.pow` became `**`,
and upstream's `eslint-disable` comments became `biome-ignore` comments. Upstream's
intentional hook dependency lists, its `role="button"` / `role="status"`
elements, its index keys on GradualBlur's fixed layer stack and StarBorder's
`aria-hidden` canvas are kept, each with a `biome-ignore` comment giving the
reason.

**StarBorder.tsx**
- Colour props every consumer must pass token values for: `color`, `trailColor`
  (or let it follow `color`), `backgroundColor`, `textColor` and `borderColor`.
  `color` and `trailColor` are parsed through a 2D canvas, so pass resolved
  colours, not `var(...)`.
- Reads `usePrefersReducedMotion()`. When it is true, the element renders without
  the star `<canvas>`, so only `as`, the children and the CSS border styling
  remain.
- The animation effect calls `prefersReducedMotion()` live first and returns
  before touching the canvas, because the hook reports `false` during hydration.
  The effect depends on the hook value, so it starts if the preference is turned
  off later.
- The internal `reduce` flag reads `prefersReducedMotion()` instead of
  `matchMedia`.
- `hover="lap"` is a one-shot animation, not an ambient loop: upstream's
  ambient `cruise` rotation (`(direction * perimeter) / duration`) ran
  unconditionally for every hover mode, so a `hover="lap"` border was always
  slowly circling, before, during and after any interaction. It is now `0`
  whenever `hover === "lap"`. `pointerenter` / `focus-visible` (re)start a lap
  from the outline's start point (`phase = 0`) — including interrupting one
  already in flight — which travels exactly one revolution over `duration`
  seconds (upstream's one-shot burst used a fixed 0.9s regardless of
  `duration`; the prop is now the actual lap length). Nothing is drawn before
  the first lap or once a lap's `state.reveal` has faded back out — reusing
  upstream's existing reveal smoothing gives the fade — and upstream's
  "keep the render loop alive while the pointer is over the element" branch
  is skipped for `hover="lap"` specifically, so the loop actually stops once
  a lap finishes and fades, even if the pointer never left. The other hover
  modes (`brighten`, `reveal`, `none`) keep upstream's continuous-cruise
  behaviour unchanged.

**ThoughtLine.tsx**
- The `@hugeicons/react` and `@hugeicons/core-free-icons` imports are removed.
  The sparkle glyph, the collapse chevron and the step tick are small inline SVG
  components in the same file (`SparkleGlyph`, `ChevronGlyph`, `TickGlyph`),
  stroked with `currentColor` at the same sizes and stroke widths as upstream.
  (Upstream used three icons, not two: the tick on finished trace steps is the
  third.)
- `useReducedMotion` from `motion/react` is replaced by
  `usePrefersReducedMotion()`.
- Reduced motion: breath depth is 0 instead of upstream's shallower, slower
  breath; the shimmer is off (as upstream); `--tl-settle` is `0ms`, so the label
  swap, timer slide and trace expand are instant; the pending step's pulse dot
  has no animation.
- The opacity effect checks `prefersReducedMotion()` live, and under reduced
  motion it sets the final opacities directly (glyph 1 while working, 0.55 when
  done; label 1) without starting a tween.
- Upstream's Tailwind `motion-reduce:` class variants are kept. They are CSS
  media queries, not JavaScript reads. They only soften transitions that the
  `0ms` settle already makes instant.
- The collapse toggle `<button>` gets the site focus ring
  (`focus-visible:outline-2 focus-visible:outline-offset-2
  focus-visible:outline-solid focus-visible:outline-mp-accent`). Upstream had
  only `outline-none`, and `className` does not reach the button.
  `outline-solid` is needed because Tailwind 4's `outline-none` sets
  `outline-style: none`, which `outline-2` alone does not undo.
- The timer span's initial text is the controlled `elapsed` (formatted as the
  timer paints it) instead of upstream's literal `0.0s`, so server markup for a
  settled trace shows its real time. The layout effect still paints the timer.
- A collapsible line's button is always in the tab order (upstream used
  `tabIndex={-1}` until the first step arrived). The homepage trace holds zero
  steps until it scrolls into view, so keyboard users tabbing past it would
  skip it; now focusing the button scrolls the card into view, playback starts,
  and the button becomes the toggle half a beat later. Before the first step it
  has no `aria-expanded` and a click does nothing, as upstream.

Usage (`components/home/SkillTrace.tsx`, via `useTracePlayback`): the server and
hydration render pass the settled trace (all six steps, `working={false}`,
`elapsed={3}`), so the HTML is complete without JS. When playback is going to
run (no reduced motion, not already played), the hook resets to zero steps
inside a `useLayoutEffect`, before first paint. This is a first-paint
exception, for the same reason as the hero headline: the reset happens in the
hydration layout pass, so no settled frame is painted and then hidden. Playback
starts once the card is at least 40% in view and the tab is visible, and runs
once per page load. Under reduced motion the settled trace stays.

**FlipCard.tsx**
- Colour props every consumer must pass token values for: `background`, `color`
  and `shadowColor`. They become CSS variables, so `var(--mp-…)` works.
- `useReducedMotion` from `motion/react` is replaced by
  `usePrefersReducedMotion()`. The two spring call sites also check
  `prefersReducedMotion()` live and jump instead of springing.
- Under reduced motion the faces swap instantly: the 200 ms opacity cross-fade
  on the faces (`group-data-[fade]:[transition:opacity_200ms_ease]`) is removed.
  Upstream already disabled the rotor, tilt, hover lift and dragging; the glare
  layer is now not rendered either (`glare && !reduce`).
- The `role="button"` root gets the site focus ring by default
  (`focus-visible:outline-2 focus-visible:outline-offset-2
  focus-visible:outline-mp-accent`); consumers can override it through
  `className`.

**GhostFibers.tsx**
- Colour props every consumer must pass token values for: `glowColor`,
  `lineColor` and `secondaryColor` (the last two otherwise derive from
  `glowColor`). They are parsed through a 2D canvas, so pass resolved colours,
  not `var(...)`.
- The upstream component is renamed `GhostFibersCanvas`. The default export
  `GhostFibers` is a wrapper that returns `null` once `usePrefersReducedMotion()`
  is true, as `Aurora.tsx` does. If the preference turns on mid-session, the
  canvas component unmounts and its cleanup releases the WebGL context.
- `GhostFibersCanvas`'s effect also calls `prefersReducedMotion()` first, and
  returns before creating a canvas or a WebGL context. That covers hydration,
  when the hook still reports `false`.
  The internal `reduce` flag reads `prefersReducedMotion()` instead of
  `matchMedia`.
- The canvas is created in the effect, appended to the container, and removed
  in cleanup, for the same reason as `Aurora.tsx`. Cleanup now also calls
  `loseContext()`, which upstream did not. If a shader fails to link, the
  programs that did link are deleted and the context and canvas are released
  (upstream leaked them).
- `aria-hidden="true"` moved from the canvas to the container, and is set
  after the spread props so it cannot be overridden. The `children` prop is
  dropped, as upstream did.
- The device-pixel-ratio cap is lowered from 2 to 1.5 (`MAX_DPR`). Upstream's
  2400 px `MAX_RENDER_DIM` cap still applies on top.
- Drawing is capped at 60 fps, as in `Aurora.tsx`. The upstream pausing while
  `document.hidden` or not intersecting (IntersectionObserver) is kept.

**GradualBlur.tsx**
- No behaviour changes. Upstream already starts with `"use client"` and is fully
  typed. Its one top-level `window` read is already guarded
  (`typeof window !== "undefined"`), so the module imports without a DOM.

**ChromaSpotlight.tsx** (ported)
- `ChromaSpotlight({ children, radius = 260, softness = 0.6, damping = 0.45,
  className })` renders a `<div>` around `children` and tracks the pointer over
  it. It writes on itself: `--chroma-x` / `--chroma-y` (px from its top-left),
  `--chroma-r` (px), and also `--chroma-stops` (the mask falloff for `softness`)
  and `--chroma-power` (0–1, fades in on enter and out on leave). Descendants
  marked `data-chroma-area` get `--chroma-ox` / `--chroma-oy`, their offset in
  the wrapper, as in upstream, so a tile can place the spotlight in its own
  coordinates. For example:
  `radial-gradient(circle var(--chroma-r) at calc(var(--chroma-x) - var(--chroma-ox)) calc(var(--chroma-y) - var(--chroma-oy)), var(--chroma-stops))`.
- The follow and fade math is upstream's. `fadeOut` is fixed at upstream's
  default of 0.6 s.
- Under reduced motion (`usePrefersReducedMotion()` and a live
  `prefersReducedMotion()` check), or when `matchMedia("(pointer: coarse)")`
  matches, it writes nothing. Cleanup removes every variable it set. Tile CSS
  must therefore use fallbacks such as `var(--chroma-power, 0)`,
  `var(--chroma-x, -9999px)` and `var(--chroma-r, 0px)`, so tiles show their
  static look when nothing is written.
- When active, `--chroma-x` / `--chroma-y` start at `-9999px` (off-canvas) at
  mount, until the pointer arrives. The pointer listeners are passive.

Usage (`components/home/ChromaBento.tsx`): one spotlight wraps the homepage
bento grid. Each `BentoTile` link is a `data-chroma-area`, and the
`.bento-tile` CSS in `app/global.css` draws a fill wash and a 1px border glow
from `--domain-<colour>` with `opacity: var(--chroma-power, 0)`. There is no
CSS transition, because the damped power already fades.

## Hover-once icons (`components/home/AnimatedIcon.tsx`)

This is the one animation outside this folder. It is a line-md icon (Iconify)
whose markup `lib/icons.ts` renders at build time. line-md draws with SMIL
(`<animate>`, `<animateTransform>`, `<set>`, all `fill="freeze"`), not CSS,
so `animation-play-state` cannot freeze it. `renderLineMdIconStill()` writes
each animation's final value onto the element it animates and then removes
the animation elements. That still SVG is the resting render: server HTML,
touch and reduced motion all show the finished drawing, with no motion. On the
tile's first mouse/pen `pointerenter` or `:focus-visible` focus, the
component swaps in the animated markup under a new React key. The fresh
`<svg>` is inserted, rewound with `setCurrentTime(0)`, and draws once. The
listeners are then removed, and `fill="freeze"` holds a last frame identical
to the still render. Under reduced motion (live `prefersReducedMotion()`)
nothing is swapped.

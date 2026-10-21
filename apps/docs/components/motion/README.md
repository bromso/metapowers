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
already in the viewport at mount. The one exception is the SplitText intro,
which is armed in the same layout pass as hydration (see below).

`usePrefersReducedMotion()` returns `false` during hydration (the server
snapshot). Effects therefore also call `prefersReducedMotion()` live before they
start anything.

| File | Origin | Reduced motion |
| --- | --- | --- |
| `Aurora.tsx` | React Bits | Wrapper renders `null`; the effect bails before creating a WebGL context. The hero supplies a static CSS gradient beneath it |
| `SplitText.tsx` | React Bits | Renders the plain `text` inside `tag` |
| `SpotlightCard.tsx` | React Bits | Upstream reduced-motion handling (spotlight follows instantly, no ambient drift or flare), now fed by `prefersReducedMotion()` |
| `Reveal.tsx` | Local | Renders children statically |
| `CountUp.tsx` | Local | Renders `to` |

## Origin and license

`Aurora.tsx`, `SplitText.tsx` and `SpotlightCard.tsx` were copied on 2026-10-21
from the React Bits registry (`https://reactbits.dev/r/<Name>-TS-TW.json`,
`files[0].content`). React Bits is licensed MIT + Commons Clause. The components
are used in this site and are not redistributed or sold as components. Each file
starts with a `// Source:` comment naming its registry URL. Upstream prop names
are kept unchanged.

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
- Render-loop pausing is kept unchanged from upstream. The frame loop stops
  while `document.hidden` is true or the container is not intersecting the
  viewport (IntersectionObserver). It resumes on `visibilitychange` or when the
  container intersects again.

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

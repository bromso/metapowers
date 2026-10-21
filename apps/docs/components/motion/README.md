# Motion primitives

Every animation on the docs site lives in this folder and goes through one
reduced-motion gate: `lib/motion.ts` (`prefersReducedMotion()` /
`usePrefersReducedMotion()`). GSAP and its plugins are imported only from
`lib/gsap.ts`, which registers `ScrollTrigger` and `useGSAP` exactly once.
Do not add an animation anywhere else, and do not read
`prefers-reduced-motion` anywhere else.

| File | Origin | Reduced motion |
| --- | --- | --- |
| `Aurora.tsx` | React Bits | Does not mount (returns `null`); the hero supplies a static CSS gradient beneath it |
| `SplitText.tsx` | React Bits | Renders the plain `text` inside `tag` |
| `SpotlightCard.tsx` | React Bits | Upstream behaviour (spotlight follows instantly, no ambient drift or flare) |
| `Reveal.tsx` | Local | Renders children statically |
| `CountUp.tsx` | Local | Renders `to` immediately |

## Origin and license

`Aurora.tsx`, `SplitText.tsx` and `SpotlightCard.tsx` were copied on 2026-10-21
from the React Bits registry (`https://reactbits.dev/r/<Name>-TS-TW.json`,
`files[0].content`). React Bits is licensed MIT + Commons Clause: the components
are used in this site and are not redistributed or sold as components. Each file
starts with a `// Source:` comment naming its registry URL. Upstream prop names
are kept unchanged.

## Local modifications

All three copies were reformatted with Biome (tabs, width 100) and given Biome's
lint fixes (sorted imports, `import type`, `Number.parseFloat`, `**` instead of
`Math.pow`), with no change in behaviour.

**Aurora.tsx**
- The upstream component is renamed `AuroraCanvas`; the default export `Aurora`
  is a wrapper that returns `null` when `usePrefersReducedMotion()` is true, so
  no WebGL context is ever created.
- `aria-hidden="true"` moved from the canvas to the container, which hides the
  whole decorative subtree.
- Device-pixel-ratio cap lowered from 2 to 1.5 (`MAX_DPR`), applied to both the
  `dpr` prop and `window.devicePixelRatio`.
- Render-loop pausing is kept from upstream: the frame loop stops while
  `document.hidden` is true or the container is not intersecting the viewport
  (IntersectionObserver), and resumes on `visibilitychange` / re-intersection.

**SplitText.tsx**
- Imports `gsap`, `ScrollTrigger` and `useGSAP` from `@/lib/gsap`; only the
  GSAP `SplitText` plugin is registered locally.
- The upstream component is renamed `AnimatedSplitText`; the default export
  `SplitText` renders the plain `text` inside `tag` (keeping `className`,
  `textAlign`, `color`) when reduced motion is on.
- Lint-only rewrites: a `forEach` cleanup became `for…of` loops and a
  spring-allocation assignment-in-expression became an explicit `if`.

**SpotlightCard.tsx**
- No behavioural changes (source comment, formatting and `import type` only).

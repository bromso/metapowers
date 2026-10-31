# Accessibility checks without a server

The checks a design skill computes itself, from values it read through a Figma capability (`references/figma-capabilities.md`) or that the user gave. No tool provides them. Criterion numbers refer to `references/wcag-criteria.md`.

## Contrast

Convert each sRGB channel to linear: with `c` in 0–1, `c ≤ 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ^ 2.4`. Relative luminance is `L = 0.2126 R + 0.7152 G + 0.0722 B`. The contrast ratio of two colours is `(L1 + 0.05) / (L2 + 0.05)` with `L1` the lighter.

| Text | AA | AAA |
| --- | --- | --- |
| Normal text | 4.5:1 | 7:1 |
| Large text (18 pt, or 14 pt bold, and up) | 3:1 | 4.5:1 |
| Non-text: UI components, graphical objects, focus indicators (1.4.11) | 3:1 | |

Worked example: `#1A73E8` on `#FFFFFF`. Channels 26, 115, 232 → 0.0103, 0.1714, 0.8069 linear → `L = 0.183`. Ratio `(1.0 + 0.05) / (0.183 + 0.05) = 4.5:1`: passes AA for normal text, fails AAA, passes AA for large text.

Report line: `<foreground> on <background>: <ratio>:1, AA <pass|fail> (normal), AA <pass|fail> (large) — computed`.

## Colour-vision simulation

Simulate each primary pair, then recompute the contrast. Work in linear RGB, apply the matrix, clamp to 0–1, and convert back only for display. The matrices are Machado, Oliveira and Fernandes (2009) at full severity; the result is an approximation, so every line it produces ends with `simulated`.

| Type | Matrix (rows R', G', B') |
| --- | --- |
| Protanopia | `[0.152286, 1.052583, -0.204868]`, `[0.114503, 0.786281, 0.099216]`, `[-0.003882, -0.048116, 1.051998]` |
| Deuteranopia | `[0.367322, 0.860646, -0.227968]`, `[0.280085, 0.672501, 0.047413]`, `[-0.011820, 0.042940, 0.968881]` |
| Tritanopia | `[1.255528, -0.076749, -0.178779]`, `[-0.078411, 0.930809, 0.147602]`, `[0.004733, 0.691367, 0.303900]` |

Worked pair: `#D93025` (red) on `#1E8E3E` (green), 1.3:1 as seen; under deuteranopia both land near the same muddy ochre and the ratio stays about 1.2:1, so the pair fails with or without simulation and must not carry meaning by colour alone (1.4.1).

Report line: `<pair> under <type>: <ratio>:1, AA <pass|fail> — simulated`.

## Focus order

From `read-node`, take the interactive children (buttons, inputs, links, anything the contract lists as focusable) in reading order: auto-layout order where the parent has one, else top-to-bottom then left-to-right. Compare that order with the contract's keyboard model (2.4.3) and with the visual grouping (1.3.2). Report each mismatch as a line; with no structure to read, `focus order — not checked`.

## Target size and text

- Each interactive node is at least 24 × 24 CSS px (2.5.8); report smaller ones with their size.
- Body text is at least the contract's minimum (default 14 px; 12 px for captions); report smaller text layers.
- Every image layer that carries meaning has a name or description usable as alt text (1.1.1); report unnamed ones.

Without node dimensions, each of these is `not checked`.

## Inputs and the missing-input line

| Check | Needs | Line when the input is missing |
| --- | --- | --- |
| Contrast | colour pairs from `read-tokens`, `read-node`, the build sheet or the user | `contrast — not checked` |
| Colour-vision simulation | the same colour pairs | `simulation — not checked` |
| Focus order | structure from `read-node` or the user | `focus order — not checked` |
| Target size, text size, alt text | dimensions and layer names from `read-node` | `<check> — not checked` |

Every check's report line ends with exactly one of `computed`, `simulated` or `not checked`.

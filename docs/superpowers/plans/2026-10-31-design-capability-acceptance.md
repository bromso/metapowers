# Design without a bundled server: acceptance record

Plan: `2026-10-31-design-capability.md`. Spec: `docs/superpowers/specs/2026-10-31-design-capability-design.md` §10. Branch `design-capability`, verified 2026-10-31 on macOS with Claude Code, the pack loaded from this worktree with `--plugin-dir`.

## 1. Counts and drift

```
grep -l 'figma-aware: true' skills/*/SKILL.md | wc -l          → 9
grep -l '^\*\*Figma\.\*\*' skills/*/SKILL.md | wc -l            → 9
grep -rlE '\bfig(ma|jam)_[a-z_]+' skills/*/SKILL.md | wc -l    → 0
node dist/cli.js fix-skill-text ../../skills --check            → exit 0
node dist/cli.js gen-references ../.. --check                   → exit 0
ls skills/design-test/references → a11y-checks.md figma-capabilities.md wcag-criteria.md
ls skills/*/references/figma-capabilities.md | wc -l            → 9
ls skills/*/references/a11y-checks.md | wc -l                   → 3
```

`bun run lint:skills`, `bun run check:pack`, `cd apps/docs && bun run check`, `bun run test` (validator 107, docs 102, pack-tools 239), `bun run check` (Biome) and `bash scripts/check-rename.sh` pass; `bun run evals --dry` lists 17 cases.

## 2. Validator

Rule `figma-step`: five cases (accepts a utility opening with the step; accepts handoff, stack, figma in order; rejects missing, before the stack step, after the gate; rejects the marker on an unflagged skill; `frontmatter-shape` accepts `figma-aware: true` and rejects `yes`). Rule `no-server-tool-names`: two cases (`figma_get_variables` and `figjam_create_stickies` rejected naming the offender; `use_figma`, `generate_figma_design`, `references/figma-capabilities.md` and the word Figma accepted). The cross-package equality test in `packages/pack-tools/src/skill-text.test.ts` compares `FIGMA_STEP` with the validator's copy; `gates.test.ts` knows the Figma lead paragraph.

## 3. References

`references/design/figma-capabilities.md` (binding, file and node, what counts as read, recording, the seven capabilities, `write-design` patterns, pointer to a11y-checks) and `references/design/a11y-checks.md` (contrast with a worked `#1A73E8` on `#FFFFFF` = 4.5:1, Machado 2009 full-severity matrices, focus order, target and text size, the inputs table). `references/memory/trail.md` gained the utility-artifact row and the `## Tools` section.

## 4. No-server manual checks

Scratch project with `02-define.md` and `03-ideate.md` fixtures for `date-picker` (a four-variant, seven-state contract with twelve hex tokens), `claude -p … --plugin-dir <worktree> --strict-mcp-config --mcp-config '{"mcpServers":{}}' --allowedTools Read,Write,Edit,Glob,Grep,Skill,Bash --max-turns 16`. No transcript mentions a `figma_`/`figjam_` tool, asks for a Figma link, or asks to connect a server (grep over all six logs).

- **`/design-empathize date-picker`** ("I won't be around to answer questions"): wrote `01-empathize.md` with `## Recalled` (found phases 2 and 3 and the log), then `## Tools` = `No Figma server: steps marked Figma ran without one.`, a **Not checked** heading, contrast computed from the contract's hex values (disabled text 2.64:1 fail, pressed fill 1.15:1), colour-vision results marked simulated, assumptions listed in place of answers. No question asked.
- **`/design-prototype date-picker --skip-checks`**: logged `skipped`, `started`, `finished`; ran `singular-detect` (no Stack section) as the stack step requires; wrote a build sheet: seven build steps, a 28-variant Mode × Size × State set on a 7 × 4 grid, every property a contract token or `(raw, no token)`, thirteen raw values tabled, a verification pass against the contract, four contrast-driven deviations recorded under Decisions; no node id; closed by noting no UI framework is declared so no code prototype was offered.
- **`/design-test date-picker --skip-checks`**: read the build sheet as the thing under test; every report line ends `computed`, `simulated` or `not checked` (structure, keyboard, reflow `not checked`); recomputed every ratio independently and matched the brief; overall FAIL with three blocking items (placeholder contrast 2.64:1, lg width at 320 px, unnamed month chevrons).
- **`/design-system-overview`** (no link): opened with `No Figma server: steps marked Figma ran without one.`, listed the three capabilities as unbound with the reason (the session's one design-related tool syncs claude.ai/design projects and does not qualify), did not ask for a link, stopped.
- **`/design-design-review date-picker`**: wrote `review-deck.md` with frontmatter `phase: null`, `gate: none`, `## Tools` no-server line, seven `## Slide` sections, Decisions and Open questions; logged `started` and `finished` with `"phase":null,"artifact":"review-deck.md"`; not published (no Slides link).
- **`/singular-status`**: listed `design/date-picker/review-deck.md` as "a utility artifact from `design-design-review` (phase null)", not as unmatched; phases 1–5 written, gates `none/passed/passed/skipped/skipped`.

Observation: even with an empty MCP config, Claude Code exposes a built-in claude.ai/design sync tool; the overview and test runs considered it and rejected it under the binding rule, which is the behaviour the contract asks for.

## 5. Owner checks (spec §10.4)

- With `claude mcp add --transport http figma https://mcp.figma.com/mcp` authenticated: `/design-system-overview <link>` lists real components, styles and variable collections and names the bound tools; `/design-export-tokens <link>` writes CSS custom properties from `get_variable_defs`; `/design-prototype` creates a component set through `use_figma` and records the node ids; `/design-empathize date-picker` asks for the file link once and the next phase reads it from `01-empathize.md`.
- The paid `bun run evals design-empathize` run (the dry listing is green).
- `/plugin marketplace update singularskills` after merging.

## 6. Deferred minors

- `design-prototype` ran `singular-detect` and wrote `.singularskills/detect.md` in the scratch project because the stack step asks it to when no Stack section exists; `singular-status` lists that file as matching no phase. Expected, but a `detect.md` under `.singularskills/` is not in the trail contract's Where table.
- The empathize brief spends several lines on the fixtures' timestamps being later than the clock; harmless, caused by hand-written fixture data.

# Design without a bundled server: design

Project 3 of the singularskills programme. Follows the foundation
(`2026-10-26-singularskills-foundation-design.md`, §8 and §10), the conductor
handoff (`2026-10-30-conductor-handoff-design.md`) and the stack and memory seam
(`2026-10-30-stack-and-memory-design.md`, whose §2 names "a capability contract
like project 3's Figma one"). The owner opted out of the brainstorm questions on
2026-10-31; every decision below is the controller's call unless marked *(owner)*,
made from the foundation brainstorm (no bundled server, no network call in any
skill, files are the contract, every skill runs alone) and from the official Figma
MCP server's documentation as published in `figma/mcp-server-guide` (read through
Context7 on 2026-10-31). A builder check on 2026-10-31 raised six questions; their
answers are marked *(builder-check answer, controller's call)* where they land.

## 1. Intent

The foundation removed `@metapowers/figma-mcp`, the bundled Figma server, and left
the nine design skills that used it with their old text under a one-line note
("Figma steps require a Figma MCP server; see the design workflow page"). That text
still calls the removed server's tools by name: `figma_get_design_system`,
`figma_get_variables`, `figma_create_component`, `figma_a11y_lint`,
`figjam_create_stickies`, `figma_create_slide` and about twenty more. Nobody has
those tools. The server people do have, Figma's own (`https://mcp.figma.com/mcp`,
also in Figma Desktop), exposes a different and smaller surface: read a node's
design context, metadata and screenshot; read variables and styles; search the
file's libraries; run Plugin API code on the canvas (`use_figma`); generate a
design from a description; read or draw FigJam; Code Connect. Third-party servers
(`figma-console-mcp`, `mcp-figma`, `figma-context-mcp`) expose yet other names.

So today a design skill either fails ("tool not found") or, worse, has the agent
improvise. This project makes the nine skills name **capabilities** instead of
tools, binds each capability to whatever server the user connected at run time,
and gives every Figma-dependent step a stated way to proceed with no server at
all, so the audit trail says plainly what was read from Figma, what was computed,
and what was not checked.

## 2. Goals

- A **capability contract**, one reference file, that names the seven things a
  design skill may ask a Figma server for, what each returns, how the official
  server provides it, how to recognise an equivalent on another server, and what
  the skill does without it.
- The nine Figma-dependent skills (`design-empathize`, `design-define-component`,
  `design-ideate`, `design-prototype`, `design-test`, `design-a11y-audit`,
  `design-design-review`, `design-export-tokens`, `design-system-overview`) carry
  one generated **Figma step** in their Prerequisites, owned by `fix-skill-text`
  and pinned by the validator like the handoff, recall and stack steps, and no
  longer mention any server's tool names anywhere.
- The accessibility checks the removed server computed (contrast, large-text
  thresholds, colour-vision simulation, focus order, target size) become
  computations the skill does itself from values it read, documented in a second
  reference file, so they never depend on a server.
- Every artifact a Figma-aware phase skill writes records which capabilities were
  bound to which tools, or that no server was connected, in one visible section.
- The docs site tells a user how to connect Figma's server in each Tier 1 agent
  (quoting Figma's instructions), lists the capabilities, and says what happens
  without a server.

## 3. Non-goals and anti-goals

- No bundled server, no `.mcp.json`, no network call from any skill or script
  (foundation §3). This project adds no code that talks to Figma; only text.
- No change to what the nine skills are for. Their descriptions keep "Figma"
  where the subject is a Figma file; their artifacts keep their names and shape.
- No support matrix for third-party servers. The contract names the official
  server's tools and gives a matching rule for any other; the builder tests
  nothing but the official server and the no-server path.
- Anti-goal: a skill that refuses to run, or asks the user to install anything,
  when no server is connected. Absence degrades to the step's stated fallback.
- Anti-goal: an agent inventing token values, component lists or audit results a
  tool would have returned. The Figma step forbids it in so many words, and the
  `## Tools` section makes the omission visible.
- Anti-goal: a second copy of Figma's own skills. Figma publishes Agent Skills
  (`figma-use`, `figma-generate-library`, `figma-implement-design` and others in
  `figma/mcp-server-guide`); the contract points at them for Plugin API detail
  and quotes only the handful of patterns the prototype step needs.

## 4. The capability contract

`references/design/figma-capabilities.md`, canonical, bundled by `gen-references`
into every Figma-aware skill. A design skill links its domain's references without
the domain segment (`references/wcag-criteria.md` resolves to
`references/design/wcag-criteria.md`), so the link, the Figma step and the
validator rule all say `references/figma-capabilities.md`; the canonical file sits
under `references/design/` and `gen-references` needs no change. *(Builder-check
answer, controller's call.)* Its sections, in order:

**Binding.** Before its first Figma step, the skill lists the tools available to
it and binds each capability it will use to one tool: the official server's tool
named in the table, else any tool whose description plainly does the same thing
(the matching rule is stated per capability: what the description must say it
reads or writes). A capability with no match is **unbound**. Binding happens once
per run, before any question about a file, and is recorded (section 6). The skill
never calls a tool it has not bound to a capability, and never names a tool in its
own text.

**Finding the file and node.** A bound capability that reads or writes a file
needs a file key, and most need a node id. Both come from the Figma link the user
gives: `figma.com/design/<fileKey>/<name>?node-id=X-Y` (also `/file/`), node id
`X-Y` written as `X:Y`; a branch link uses the branch key; `figma.com/board/` is a
FigJam board and `figma.com/slides/` a Slides deck, which only the FigJam and
Slides capabilities accept, given in the request or the conversation (the
`argument-hint` does not change). The link is read first from the `## Tools`
section of the project's latest earlier artifact (section 6), so a workflow asks
for it once, in phase 1; only when no bound capability can be used without a link
and none is recorded or given does the skill ask for it, once, in the same turn as
any other question it asks. With nothing bound, no link is ever asked for: a
project with no Figma file and a project with no server take the same path.
*(Builder-check answer, controller's call.)*

**What counts as read.** Values the user gave, in the request or in files the
request names (a brief, a token file, a pasted palette), are the user's and are
used as such. `not checked` is for what only Figma could have answered. *(Builder-
check answer, controller's call.)*

**The capabilities.** One subsection each, with: what it returns, the official
server's tool and arguments, the matching rule for another server, and the
without-Figma rule.

| Capability | Returns | Official server |
| --- | --- | --- |
| `read-tokens` | the variables and styles (colour, spacing, typography, radii, effects) of a node or file, with names, values and modes | `get_variable_defs(fileKey, nodeId)`; `search_design_system` with `entity: variable` or `style` for the libraries |
| `find-components` | the components and component sets the file can use, with names, library and description | `search_design_system(queries: [{entity: component, query}], fileKey)`; `get_libraries(fileKey)` to list libraries |
| `read-node` | a node's structure: layout, children, text, sizes, applied tokens | `get_design_context(fileKey, nodeId)`; `get_metadata(fileKey, nodeId)` for a sparse tree |
| `screenshot` | an image of a node | `get_screenshot(fileKey, nodeId)` |
| `write-design` | new frames, components, text and variant sets in a Design file | `use_figma` with Plugin API code (editor `figma`); `generate_figma_design` for a first draft from a description |
| `write-figjam` | stickies, tables, connectors or a diagram on a FigJam board | `use_figma` (editor `figjam`); `generate_diagram` from Mermaid |
| `write-slides` | slides with text and images in a Figma Slides deck | `use_figma` (editor `slides`) |

Without-Figma rules, per capability: `read-tokens` reads the project's own token
sources (a `tokens` package, CSS custom properties, a Tailwind config, found in
the repository; a stack-aware skill looks where its Stack section's `layout` says)
and otherwise writes `not checked`; `find-components` reads the project's
component folders the same way and otherwise `not checked`; the four Figma-aware
phase skills that are not stack-aware stay that way and search the repository
*(builder-check answer, controller's call)*;
`read-node` and `screenshot` are `not checked`; `write-design` produces a **build
sheet** instead (section 5, prototype); `write-figjam` is skipped, since the
comparison already lives in the ideation artifact; `write-slides` is skipped,
since the deck already lives in the review artifact.

**Patterns for `write-design`.** The official server's `use_figma` runs Plugin
API code. The contract quotes the few patterns a prototype needs, taken from
Figma's `figma-use` skill: `figma.createComponent()` with auto layout and padding;
`figma.createAutoLayout('VERTICAL' | 'HORIZONTAL')`; `figma.loadFontAsync` before
`createText`; encode variant axes in component names (`State=Hover, Size=Large`)
and `figma.combineAsVariants(nodes, page)`, then position the variants in a grid
with measured sizes and `resizeWithoutConstraints`; return the ids you created.
It then says: when Figma's own `figma-use` or `figma-generate-library` skill is
installed in the agent, follow it for anything beyond these patterns.

**Checks that need no server.** One line pointing at `references/a11y-checks.md`
(canonical `references/design/a11y-checks.md`).

## 5. The nine skills

Each skill's `> **Note:** Figma steps require…` line goes; the generated Figma
step (section 6) replaces it. Each Process step that used a tool is rewritten in
one fixed form so a reader can see the two paths:

```
2. **Read the design system.** *Figma (read-tokens, find-components):* read the
   file's variables and styles and search its libraries for components related
   to <project>. *Without Figma:* read the project's own token and component
   sources (a `tokens` package, CSS custom properties, a Tailwind config,
   component folders), else note `not checked`.
```

The italic labels are the convention: `*Figma (<capabilities>):*` then
`*Without Figma:*`. No tool name appears. What changes per skill:

- **design-empathize** (phase 1): steps 2 to 4 become one Figma step
  (`read-tokens`, `find-components`, `read-node`, `screenshot` for related
  components) plus the WCAG step, whose contrast check becomes a computation on
  the colour pairs read (a11y-checks). The brief's **Not checked** heading stays
  for the no-server case. Step 1's "Never ask about tooling" sentence stays and
  gains "a link to the design file is not tooling: when a capability is bound and
  no link was given, ask for it with your other questions".
- **design-define-component** (phase 2): step 2 uses `read-tokens` and
  `find-components`; the "MISSING TOKEN" rule stays and gains "or `not checked`
  when no tokens could be read, never a guessed name".
- **design-ideate** (phase 3): step 2 uses `read-tokens`; step 4 (FigJam board)
  becomes optional, only when the user gave a `figma.com/board/` link and
  `write-figjam` is bound; otherwise the comparison matrix in the artifact is the
  board.
- **design-prototype** (phase 4): steps 2 to 6 become `read-tokens`, then
  `write-design` following the contract's patterns, then `screenshot` to verify;
  the node ids it created go into `## Tools` as a `created:` line so the test
  phase and the review find them without asking.
  *Without Figma* the skill writes a **build sheet** into `04-prototype.md`: one
  table per variant axis and one per state with the exact token (or `not
  checked`) for every fill, stroke, text style, spacing and radius, the auto
  layout settings, and the variant grid, in the order a designer would build it;
  and, when the Stack section names a UI framework, it offers `development-build`
  for a code prototype in one closing line. The artifact's "component node id"
  becomes "component node id, or `build sheet` when no server was bound".
- **design-test** (phase 5): steps 2 and 3 become `read-node` and `read-tokens`
  on the prototype's node id, then the checks from a11y-checks computed by the
  skill; each check's line in the report says `computed` or `not checked`. Without
  Figma, the build sheet in `04-prototype.md` is the thing under test: contract
  compliance and contrast are computed from it, structure checks are `not checked`.
- **design-a11y-audit** (utility): the same checks on a node the user links, or
  on colours and structure the user pastes; without either, it says what it
  cannot check and stops. It gains a `## References` line for both reference files.
- **design-design-review** (utility): it now always writes the deck as Markdown,
  `.singularskills/design/<project>/review-deck.md`, one `## ` heading per slide
  with the phase summaries and the decisions list, and appends `started` and
  `finished` lines to the run log (its `phase` stays `null`, its `artifact`
  `review-deck.md`); with a `figma.com/slides/` link and `write-slides` bound it
  also creates the slides from that deck and records their ids in it. A Slides
  deck without a file on disk was the one design artifact the trail could not
  audit; this closes that. The deck is the first **utility artifact**: an
  artifact a non-phase skill writes into a project folder, named without the
  `NN-` prefix, with the same frontmatter as a phase artifact except `phase:
  null` and `gate: none`, and the same closing sections. The trail contract's
  Where table gains that row, `singular-status` lists such files under "Utility
  artifacts" instead of flagging them as unmatched, and `singular-report` includes
  them after the phases. The gate hook only matches `NN-` files, so the write goes
  through. *(Builder-check answer, controller's call.)*
- **design-export-tokens** (utility): `read-tokens` on the file the user linked;
  the export formats (CSS custom properties, Tailwind config, JSON) are the
  skill's own transformation of what it read, since no server exports them;
  without Figma it says the file could not be read and exports nothing.
- **design-system-overview** (utility): `read-tokens`, `find-components` and
  `read-node` on the file's pages; without Figma it says so and stops.

The three utilities with no artifact (`a11y-audit`, `export-tokens`,
`system-overview`) record the binding in their chat summary instead of a `## Tools`
section (section 6).

Descriptions are untouched except `design-design-review`, whose first sentence
becomes "Create a design review deck summarizing a component's design journey…
as Markdown, and as Figma Slides when a deck link is given"; the validator's
length and verb rules still hold.

## 6. The Figma step and the `## Tools` section

A skill is Figma-aware when its frontmatter has `metadata.figma-aware: true`; the
validator's `METADATA_KEYS` accepts the key, as it does `stack-aware`. The nine
skills above carry it and nothing else does.

Each Figma-aware skill carries one generated paragraph, the **Figma step**, owned
by `fix-skill-text` and pinned by the validator (rule `figma-step`): in
`## Prerequisites`, after the handoff, recall and stack paragraphs when present,
before the gate or `started` step. `LEAD_ORDER` becomes handoff, recall, stack,
figma. Its text, verbatim for every Figma-aware skill:

> **Figma.** Steps marked *Figma* use a Figma MCP server you connect to this
> agent yourself; this pack ships none and makes no network calls. Before the first
> such step, list the tools available to you and bind each capability the step
> names to one tool, as `references/figma-capabilities.md`, bundled with this
> skill, describes: the official Figma server's tool named there, else any tool
> whose description plainly does the same thing. With a capability bound, take the
> file key and node id from the `file:` line of the `## Tools` section of the
> project's latest earlier artifact, else from the Figma link the user gave; when a
> bound capability needs one and there is none, ask for the link once, with any
> other question you ask. With nothing bound, never ask for a link. Record the
> result in a `## Tools` section after any `## Recalled` section: a `- file:`
> line, one line per bound capability (`- read-tokens: get_variable_defs
> (figma)`), and a `- created:` line for node ids you created; or the single line
> `No Figma server: steps marked Figma ran without one.`; a skill with no artifact
> says the same in its summary. For an unbound capability do what the step's
> *Without Figma* line says: never ask the user to connect a server, never invent
> values a tool would have returned, and never report a step as run when it was
> not.

The `## Tools` section joins the trail contract (`references/memory/trail.md`,
"Visible structure") as optional, after `## Recalled`, for Figma-aware skills
that write an artifact, with this shape:

```markdown
## Tools
- file: https://www.figma.com/design/<fileKey>/<name>?node-id=12-34
- read-tokens: get_variable_defs (figma)
- write-design: use_figma (figma)
- created: 12:40 (DatePicker), 12:41 (DatePicker/State=Hover)
```

or the single line `No Figma server: steps marked Figma ran without one.`
`singular-report` includes it when present. It is where a later phase finds the
file and the node ids, and the one place a reviewer sees whether the colours in a
test report came from Figma or from the build sheet. *(Builder-check answer,
controller's call.)*

## 7. Accessibility checks without a server

`references/design/a11y-checks.md`, canonical, linked as `references/a11y-checks.md`
and bundled into `design-empathize`, `design-test` and `design-a11y-audit`. It states, with formulas a model can apply
to the numbers it has:

- Relative luminance and contrast ratio (WCAG 2.x, sRGB linearisation), the AA
  and AAA thresholds for normal and large text (18 pt, or 14 pt bold) and the 3:1
  non-text threshold, with one worked example.
- Colour-vision simulation: the Machado, Oliveira and Fernandes (2009) matrices
  for protanopia, deuteranopia and tritanopia at full severity, applied in linear
  RGB, then contrast recomputed; the file says this is an approximation and that
  the report must label it `simulated`.
- Focus order: the reading order of interactive children from `read-node`
  (auto-layout order, then top-to-bottom, left-to-right), compared with the
  contract's keyboard model.
- Target size (24 × 24 CSS px, 2.5.8) and minimum text size from node
  dimensions; alt text from image layer names and descriptions.
- What each check needs (`read-node`, `read-tokens`, or values the user pasted)
  and the report line to write when the input is missing: `not checked`.

`references/design/wcag-criteria.md` is unchanged; a11y-checks cites its
criteria numbers.

## 8. Tooling

- **skill-validator.** `METADATA_KEYS` gains `figma-aware` (boolean, like
  `stack-aware`). New rule `figma-step`: a Figma-aware skill's Prerequisites carry
  the step verbatim at its position after handoff, recall and stack; a skill
  without the flag must not carry the marker `**Figma.**`; a Figma-aware skill
  links `references/figma-capabilities.md` so it is bundled. New rule
  `no-server-tool-names`: no skill body may contain an identifier matching
  `\bfig(ma|jam)_[a-z_]+` (the removed server's names), reported with the first
  offender; this is what stops the old text from creeping back.
- **pack-tools.** `skill-text.ts` gains `FIGMA_MARKER`, `FIGMA_STEP`,
  `figmaAware`, `fixFigmaStep`, and `isFigma` in `LEAD_ORDER`; the equality test
  with the validator's copy, as for `STACK_STEP`. `fixSkillText` calls
  `fixFigmaStep` after `fixStackStep`. `gen-references` needs no change: both new
  files live under `references/design/`, the domain's own folder. `migrate.ts` is
  the one-time migration from the old repo and keeps `FIGMA_NOTE` as history; it
  is not run by `check:pack`.
- **docs site.** A new page `design/figma.mdx` under a `---Figma---` group in the
  design `meta.json`: how to connect Figma's server in Claude Code (`claude mcp
  add --transport http figma https://mcp.figma.com/mcp`), Cursor and VS Code
  (the `mcpServers`/`servers` JSON with the URL), Gemini CLI (`gemini extensions
  install https://github.com/figma/mcp-server-guide`, then `/mcp auth figma`),
  Codex and the rest (the same URL in the agent's MCP config, with a link to
  Figma's guide), each quoted from Figma's README; the capability table from
  section 4; the `## Tools` section; what happens without a server. The design
  `index.mdx` "Figma MCP Server" section shrinks to three sentences and links
  the page; `prototype.mdx` steps name capabilities and the build sheet;
  `overview/reference/index.mdx` and `development/architecture/index.mdx` lose
  their `figma_*` wording; `artifacts.mdx` says binary assets stay in Figma when
  a server is bound and the build sheet otherwise; `design-review.mdx` names
  `review-deck.md`; `overview/memory.mdx` lists `## Tools`. `gen:data` and the
  codemod regenerate the rest. `lib/trace.ts` and `lib/domains.ts` keep their
  wording ("through the Figma MCP server", "via MCP"), which is still true.
- **AGENTS.md** gains one paragraph under a `## Figma` heading: the nine
  Figma-aware skills, the step, the two reference files, the tool-name rule.
- **`singular-status` and `singular-report`** learn the utility artifact kind
  (section 5, design-review): one sentence each; `references/memory/trail.md`
  gains the Where row and the `## Tools` section.
- **Evals.** No case added; `design-empathize`'s existing case runs with no
  server, its brief supplies the tokens (which count as read, section 4), and its
  graders do not mention Figma, so it must keep passing with the `## Tools` line
  present. The builder runs `bun run evals --dry` only; the paid run is an owner
  check (section 10). *(Builder-check answer, controller's call.)*
- Counts are unchanged (283 skills, 16 domains).

## 9. Constraints on the builder

- Generated text (the Figma step) is owned by `fix-skill-text`, mirrored by the
  validator, checked by `check:pack`; the skills' own prose is rewritten only
  where section 5 says.
- Order inside `## Prerequisites`: handoff, recall, stack, figma, gate-or-started
  step, then the skill's own prose.
- Nothing in the pack calls Figma; the builder verifies the no-server path by
  running skills, and the official-server path only if the owner's Figma login is
  available in the session, otherwise records it as an owner check (section 10).
- `bun run lint:skills`, `bun run check:pack`, `cd apps/docs && bun run check`,
  `bun run evals --dry`, `SKIP_NETWORK_TESTS=1 bun run test`, `bun run check`
  (Biome) and `bash scripts/check-rename.sh` stay green at every commit.
- Conventional commits with the session's attribution trailer; PR opened by the
  builder, merged by the owner *(owner's standing choice)*.

## 10. Acceptance

Recorded in `docs/superpowers/plans/2026-10-31-design-capability-acceptance.md`.

1. `grep -l 'figma-aware: true' skills/*/SKILL.md | wc -l` → 9; `grep -l
   '^\*\*Figma\.\*\*' skills/*/SKILL.md | wc -l` → 9; `grep -lE
   '\bfig(ma|jam)_[a-z_]+' skills/*/SKILL.md` → nothing; `fix-skill-text --check`
   and `gen-references --check` exit 0; `ls skills/design-test/references` shows
   `wcag-criteria.md`, `figma-capabilities.md`, `a11y-checks.md`.
2. The validator has cases for `figma-step` (present, absent, misplaced, unlinked)
   and `no-server-tool-names`; the cross-package equality test covers
   `FIGMA_STEP`.
3. **No server, manual.** In a scratch project with no MCP servers, `claude -p …
   --plugin-dir <worktree>`: `/design-empathize date-picker` writes
   `01-empathize.md` with `## Recalled`, then `## Tools` reading `No Figma server:
   steps marked Figma ran without one.`, a **Not checked** heading, and no
   invented token or component names; `/design-prototype date-picker
   --skip-checks` (with a fixture `02-define.md` and `03-ideate.md`) writes a build
   sheet with every state and variant from the contract and no node id;
   `/design-test date-picker --skip-checks` computes contrast from the build
   sheet's values and marks structure checks `not checked`;
   `/design-system-overview` says `No Figma server: steps marked Figma ran
   without one.` and stops without asking for a link; `/design-design-review
   date-picker` writes `review-deck.md` with `phase: null` and `singular-status`
   lists it as a utility artifact. No run asks for a Figma link, mentions a
   `figma_` tool or asks to install a server.
4. **Official server, owner check.** With `claude mcp add --transport http figma
   https://mcp.figma.com/mcp` authenticated, `/design-system-overview <link>`
   lists real components, styles and variable collections from the file and its
   summary names the bound tools; `/design-export-tokens <link> --format css`
   writes CSS custom properties from `get_variable_defs`; `/design-prototype`
   creates a component set on the canvas through `use_figma` and records the node
   ids; `/design-empathize date-picker` asks for the file link once and the
   next phase reads it from `01-empathize.md` without asking. The paid
   `bun run evals design-empathize` run. *(Owner: needs a Figma login and the
   eval budget, which the builder does not have.)*
5. Docs: `design/figma` page present, counts page unchanged, the four `figma_`
   mentions outside the design skills gone (`grep -rn 'figma_' apps/docs/content
   README.md` → nothing).

## 11. Left to the builder

- The exact wording of each rewritten Process step within the form of section 5.
- The worked examples in `a11y-checks.md` (one contrast pair, one simulation).
- Whether `design-design-review` keeps its `--skip-checks` sentence (it has no
  gate; the builder may drop the generated Arguments sentence if `fix-args`
  allows a utility to) and how its `started`/`finished` lines are phrased, matching
  `fix-skill-text`'s start step for a non-member if one exists, else hand-written.
- The scratch-project fixtures for acceptance 3.

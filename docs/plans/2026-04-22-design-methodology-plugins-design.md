# Design Methodology Plugins — Architecture Design

**Date:** 2026-04-22
**Status:** Approved
**Repo:** designpowers (greenfield)

## Overview

Two Claude Code plugins that bring structured design methodology to AI-assisted workflows, backed by Figma MCP for canvas/FigJam execution:

1. **Design Thinking** — five-phase component design process writing to Figma canvas
2. **Double Diamond** — five-phase research/problem-definition process writing to FigJam

Target users: designers/researchers already using Claude Code, and developers who want design rigor in their workflow. Both plugins require Figma MCP.

## Decisions Log

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Target audience | Designers + developers | Both need methodology guidance at different levels |
| Figma MCP | Required for both plugins | Core value prop is canvas/FigJam writes, not just markdown |
| Distribution | Single monorepo, marketplace install | Users install via Claude Code plugin marketplace |
| Eval harness | Full from M1 | Every skill ships with quality guarantees from day one |
| Custom MCP server | Minimal — contrast checker only | Feeds test-component WCAG story; Type x Tone and i18n deferred |
| Shared prompts | Runtime-read files, no build step | Skills stay self-contained; shared content read via Read tool |
| Phase artifacts | Namespaced by run, committed | `.dt/<component>/`, `.dd/<brief>/` — design docs live with code |
| Hooks | Shell scripts initially | Promote to compiled TS only if complexity warrants it |
| TS packages | 3 only | skill-validator, eval-harness, mcp-contrast-checker |

## Repository Structure

```
designpowers/
├── .claude-plugin/
│   └── marketplace.json
├── plugins/
│   ├── design-thinking/
│   │   ├── .claude-plugin/plugin.json
│   │   ├── skills/
│   │   │   ├── empathize/SKILL.md
│   │   │   ├── define-component/SKILL.md
│   │   │   ├── prototype-in-figma/SKILL.md
│   │   │   └── test-component/SKILL.md
│   │   ├── agents/
│   │   │   └── component-ideator.md
│   │   ├── commands/
│   │   │   ├── design.md
│   │   │   ├── dt-empathize.md
│   │   │   ├── dt-define.md
│   │   │   ├── dt-prototype.md
│   │   │   └── dt-test.md
│   │   ├── hooks/
│   │   │   ├── hooks.json
│   │   │   └── check-define-exists.sh
│   │   ├── shared/
│   │   │   ├── wcag-criteria.md
│   │   │   └── component-contract-template.md
│   │   └── .mcp.json
│   └── double-diamond/
│       ├── .claude-plugin/plugin.json
│       ├── skills/
│       │   ├── discover/SKILL.md
│       │   ├── define-problem/SKILL.md
│       │   ├── develop-flows/SKILL.md
│       │   └── deliver/SKILL.md
│       ├── agents/
│       │   └── discovery-synthesizer.md
│       ├── commands/
│       │   ├── research.md
│       │   ├── dd-discover.md
│       │   ├── dd-define.md
│       │   ├── dd-develop.md
│       │   └── dd-deliver.md
│       ├── hooks/
│       │   ├── hooks.json
│       │   └── check-brief-exists.sh
│       ├── shared/
│       │   └── research-protocol-template.md
│       └── .mcp.json
├── packages/
│   ├── skill-validator/
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── src/
│   ├── eval-harness/
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── src/
│   └── mcp-contrast-checker/
│       ├── package.json
│       ├── tsconfig.json
│       └── src/
├── fixtures/
│   ├── design-thinking/
│   │   ├── button-brief.md
│   │   └── expected/
│   └── double-diamond/
│       ├── onboarding-brief.md
│       └── expected/
├── turbo.json
├── pnpm-workspace.yaml
├── package.json
├── tsconfig.base.json
└── biome.json
```

## Plugin 1: Design Thinking

Five phases producing artifacts in `.dt/<component-name>/`.

### Phase Flow

| # | Phase | Type | Output | Prerequisites |
|---|-------|------|--------|---------------|
| 1 | empathize | skill | `01-empathize.md` | none |
| 2 | define-component | skill | `02-define.md` | `01-empathize.md` |
| 3 | ideate-variations | agent (worktree) | `03-ideate.md` | `02-define.md` |
| 4 | prototype-in-figma | skill | `04-prototype.md` | `02-define.md` + `03-ideate.md` |
| 5 | test-component | skill | `05-test.md` | `04-prototype.md` |

### Phase Details

**empathize** — Reads design system via Figma MCP `get_design_context`. Captures user need, accessibility requirements, existing patterns that could be reused.

**define-component** — The critical artifact. Produces the component contract: props with types, variant matrix (size x style x state), slots/composition points, all states (default/hover/focus/disabled/error/loading), token references (no raw values), WCAG criteria (reads `shared/wcag-criteria.md`), i18n considerations.

**ideate-variations** — Agent with `isolation: worktree`. Produces 2-3 approaches with tradeoffs. Main conversation presents options with recommendation; user picks. Only agent in this plugin. Justified by needing clean context for parallel exploration.

**prototype-in-figma** — Executes Figma MCP writes. Enforces: use existing components first, tokens not raw values, semantic layer names, auto-layout over absolute positioning.

**test-component** — Post-flight validation. WCAG contrast via `mcp-contrast-checker`, variant completeness check (all matrix cells covered?), token usage audit.

### Orchestrator: `/design <component>`

Runs all five phases sequentially. Pauses for user input after phases 1, 2, and 3 (decision points). Phases 4 and 5 run without pause. Detects existing artifacts for resumability.

### Individual Commands

`/dt:empathize <component>`, `/dt:define <component>`, `/dt:prototype <component>`, `/dt:test <component>` — each callable standalone, each checks prerequisites.

## Plugin 2: Double Diamond

Five phases producing artifacts in `.dd/<brief-name>/`.

### Phase Flow

| # | Phase | Type | Output | Prerequisites |
|---|-------|------|--------|---------------|
| 1 | discover | skill | `01-discover.md` | none |
| 2 | synthesize-discovery | agent (worktree) | `02-themes.md` | `01-discover.md` |
| 3 | define-problem | skill | `03-problem.md` + `personas/*.md` | `02-themes.md` |
| 4 | develop-flows | skill | `04-flows.md` + FigJam boards | `03-problem.md` |
| 5 | deliver | skill | `05-deliver.md` | `04-flows.md` |

### Phase Details

**discover** — Research brief scaffold: problem space definition, stakeholder interview questions, data-gathering protocol, assumptions to validate.

**synthesize-discovery** — Agent with `isolation: worktree`. Affinity mapping from raw notes into themes. Dedicated context because synthesis is the step that most often gets hand-waved.

**define-problem** — From themes: problem statement, "How Might We" questions, personas/archetypes grounded in themes (not invented), success metrics.

**develop-flows** — Uses FigJam MCP tools. `generate_diagram` for user flows (sequence diagrams), journey maps (flowcharts), state diagrams from Mermaid syntax. `write_to_figjam` for sticky-note opportunity mapping and affinity clusters.

**deliver** — Packages research artifacts: executive summary, decisions log, handoff doc, FigJam board links.

### Orchestrator: `/research <brief>`

Pauses after phases 1, 2, and 3. Phases 4 and 5 run through. Same resumability pattern as Design Thinking.

### Individual Commands

`/dd:discover <brief>`, `/dd:define <brief>`, `/dd:develop <brief>`, `/dd:deliver <brief>`.

## TypeScript Packages

### skill-validator

Lints SKILL.md files. Runs via `turbo lint:skills`.

Checks:
- Frontmatter: `name`, `description`, `triggers` present and well-formed
- Description quality: under 200 chars, starts with verb, contains trigger keywords
- Required sections per plugin type
- Max word count per section
- No raw color values or hardcoded tokens

Exit code 1 blocks CI on failure.

### eval-harness

Runs skills against golden fixtures, scores outputs, compares revisions.

Flow:
1. Takes fixture + skill
2. Executes skill in sandboxed Claude call
3. Scores output against per-skill rubric (e.g., define-component: all states listed? variant matrix complete? WCAG present? tokens not raw values?)
4. Stores scored results per git SHA
5. Elo comparison across revisions

Run modes:
- `turbo eval` — full suite
- `turbo eval -- --skill dt:define-component` — single skill
- `turbo eval -- --compare HEAD~1..HEAD` — compare last revision

### mcp-contrast-checker

Minimal MCP server. Single tool: `check_contrast`.

- Input: two token references (e.g., `color.text.primary`, `color.bg.surface`)
- Output: contrast ratio, WCAG AA pass/fail, WCAG AAA pass/fail
- Resolves token values via Figma MCP `get_design_context`, computes ratio locally

## Quality System: Three Layers

### Layer 1: Soft Gate (skill-level)

Each SKILL.md declares prerequisites. The skill checks for required artifacts and stops with a message if missing. Relies on Claude following the instruction.

### Layer 2: Hard Gate (PreToolUse hooks)

Shell scripts that block Figma writes when prerequisites are missing.

- Design Thinking: hook on `mcp__figma__write_to_figma` checks `02-define.md` exists
- Double Diamond: hook on `mcp__figma__write_to_figjam` checks `03-problem.md` exists

Returns exit code 1 with explanation if prerequisite missing.

### Layer 3: Eval Gate (CI)

Eval harness runs on every skill change. If a skill revision scores lower than previous on its rubric, CI fails. Prevents silent quality regression.

### `--skip-checks` Bypass

For expert users. When used:
- Soft gate: skill skips prerequisite check
- Hard gate: hook checks `DT_SKIP_CHECKS=1` env var
- Eval gate: unaffected
- Logged to `.dt/<component>/skip-log.md` or `.dd/<brief>/skip-log.md`

## Orchestrator UX

### Pause Points

Both orchestrators pause for user input at decision points:
- After empathize/discover (confirm findings)
- After define/synthesize (approve contract/themes)
- After ideate (pick approach)

Execution phases (prototype, test, develop-flows, deliver) run without pause.

### Resumability

Running `/design button` when `.dt/button/` has existing artifacts: detect what's done, report status, ask whether to resume or restart.

### Error Handling

If a phase fails (Figma auth, contrast check, MCP timeout): stop, explain the error, tell user how to resume from that phase.

## Milestone Plan

**M1:** Scaffold monorepo + skill-validator + eval-harness + one end-to-end skill (`dt:define-component`) with one golden fixture and one eval. Validate the full loop before building breadth.

**M2:** Remaining Design Thinking skills + component-ideator agent + `/design` orchestrator + hooks

**M3:** Double Diamond skills + discovery-synthesizer agent + `/research` orchestrator + hooks

**M4:** mcp-contrast-checker + test-component integration

**M5:** Polish, marketplace listing, documentation

# Research Plugin Design

## Goal

Create a Research plugin implementing the Double Diamond methodology (Discover, Define, Design, Deliver) as Claude Code skills, with web research MCP integration and documentation.

## Architecture

Follows the same pattern as the Design plugin: one folder per skill with a SKILL.md, sequential numbered artifacts in `.research/<topic>/`, hook-based quality gates, and shared reference templates.

## Plugin Structure

```
plugins/research/
├── .claude-plugin/
│   └── plugin.json
├── hooks/
│   ├── hooks.json
│   └── check-define-exists.sh
├── shared/
│   ├── research-plan-template.md
│   └── double-diamond-guide.md
└── skills/
    ├── discover/SKILL.md
    ├── define/SKILL.md
    ├── design/SKILL.md
    └── deliver/SKILL.md
```

## Arguments

User provides a research topic or question: `/research:discover "user onboarding friction"`

Artifacts stored in `.research/<slugified-topic>/`.

## Phases

### Phase 1: Discover (Diverge on Problem)

- **Prerequisites:** None
- **Process:** WebSearch + WebFetch to gather articles, data, user insights, competitive landscape. Identify patterns and themes.
- **Output:** `01-discover.md` — findings by theme: user insights, market data, competitive analysis, pain points, opportunities
- **Tone:** Expansive — wide net

### Phase 2: Define (Converge on Problem)

- **Prerequisites:** `01-discover.md` (soft gate)
- **Process:** Synthesize findings into problem statements, "How Might We" questions, success criteria, scope, research plan.
- **Output:** `02-define.md` — problem statement, HMW questions, success criteria, scope, research plan
- **Tone:** Convergent — narrow to focused problem

### Phase 3: Design (Diverge on Solutions)

- **Prerequisites:** `01-discover.md` + `02-define.md` (hard gate on `02-define.md`)
- **Process:** WebSearch for existing solutions and case studies. Generate 3-5 solution concepts, evaluate feasibility/impact/effort, prioritize.
- **Output:** `03-design.md` — solution concepts, feasibility analysis, prioritized recommendations
- **Tone:** Expansive — multiple solution paths

### Phase 4: Deliver (Converge on Solution)

- **Prerequisites:** All prior artifacts (soft gate on `03-design.md`)
- **Process:** WebSearch/WebFetch to validate top solutions against evidence. Compile findings, write actionable recommendations.
- **Output:** `04-deliver.md` — validation results, recommendations, action items, evidence summary
- **Tone:** Convergent — lock down with evidence

## Quality Gates

- **Soft gate:** Warn if prerequisite artifact missing, allow `--skip-checks` bypass
- **Hard gate (hook):** Design phase blocked until `02-define.md` exists (PreToolUse hook)
- **Bypass:** `RESEARCH_SKIP_CHECKS=1` environment variable
- **Skip log:** `.research/<topic>/skip-log.md`

## MCP Integration

Uses Claude Code's built-in WebSearch and WebFetch tools — no custom MCP server needed. Skills reference these tools in their process steps.

## Marketplace Registration

Add `research` entry to root `.claude-plugin/marketplace.json` alongside `design`.

## Documentation

Replace stub pages in `apps/docs/content/docs/research/`:

- `index.mdx` — Overview with phase table, artifact flow, quality gates
- `discover.mdx` — Phase 1 guide
- `define.mdx` — Phase 2 guide
- `design.mdx` — Phase 3 guide
- `deliver.mdx` — Phase 4 guide

Each page follows: Purpose, Usage, Prerequisites, What It Does, Output, Next Phase.

`meta.json` stays as-is (already correct with `---Phases---` separator).

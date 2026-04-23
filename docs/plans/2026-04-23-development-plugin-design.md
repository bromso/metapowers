# Development Plugin Design

## Goal

Create a Development plugin providing a structured software development workflow (plan → build → test → debug → review → ship) as Claude Code skills, inspired by Superpowers' process-oriented approach.

## Architecture

Follows the Metapowers plugin pattern (SKILL.md, hooks, shared resources). Skills are purely process-oriented and tech-stack-agnostic — they say "run the project's test suite" not "run bun test". Claude infers the appropriate tooling from the project context. Sequential artifacts stored in `.development/<feature>/`.

## Plugin Structure

```
plugins/development/
├── .claude-plugin/plugin.json
├── hooks/hooks.json
├── shared/plan-template.md
└── skills/
    ├── plan/SKILL.md
    ├── build/SKILL.md
    ├── test/SKILL.md
    ├── debug/SKILL.md
    ├── review/SKILL.md
    └── ship/SKILL.md
```

## Skills

### /development:plan <feature> (Phase 1)
- **Purpose:** Break a feature into bite-sized tasks (2-5 min each)
- **Prerequisites:** None
- **Process:** Understand feature, explore codebase, break into tasks with exact file paths, define test strategy
- **Output:** `.development/<feature>/01-plan.md`

### /development:build <feature> (Phase 2)
- **Purpose:** Execute plan tasks sequentially with TDD discipline
- **Prerequisites:** `01-plan.md` (soft gate)
- **Process:** Read plan, execute tasks: write failing test → implement → verify → commit. Log progress.
- **Output:** `.development/<feature>/02-build.md`

### /development:test <feature> (Utility)
- **Purpose:** Write tests for existing code or validate coverage
- **Prerequisites:** None
- **Process:** Analyze code, identify untested paths, write tests, run suite, report gaps
- **Output:** `.development/<feature>/03-test.md`

### /development:debug <topic> (Utility)
- **Purpose:** Systematic root cause investigation
- **Prerequisites:** None
- **Process:** 4 phases: read errors → reproduce → trace → hypothesize → test → fix → verify
- **Output:** No sequential artifact — fixes committed directly

### /development:review <feature> (Utility)
- **Purpose:** Pre-merge code review
- **Prerequisites:** `02-build.md` (soft gate)
- **Process:** Read changed files, check bugs/security/quality, verify tests, report findings
- **Output:** `.development/<feature>/04-review.md`

### /development:ship <feature> (Utility)
- **Purpose:** Finish branch — merge, PR, or cleanup
- **Prerequisites:** None
- **Process:** Run tests, verify pass, present 4 options (merge/PR/keep/discard), execute chosen action
- **Output:** No artifact — executes shipping action

## Tech Stack Approach

No detection table or stack-specific logic. Skills use process language ("run the project's test suite") and Claude infers the right commands from project context. Works with any language/framework.

## Documentation

Update `apps/docs/content/docs/development/`:
- `meta.json` — add skill pages with separators (Workflow, Utilities, Technical)
- `index.mdx` — overview with skill table and workflow diagram
- `plan.mdx`, `build.mdx`, `test.mdx`, `debug.mdx`, `review.mdx`, `ship.mdx` — per-skill guides
- Existing `architecture/` and `mcp-server/` stay under Technical separator

## Marketplace

Already registered in marketplace.json (no change needed).
